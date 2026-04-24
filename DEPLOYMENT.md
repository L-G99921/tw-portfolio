# Deployment Guide

This guide covers deploying the Docusaurus documentation site using Docker, AWS ECR, and AWS ECS with Bitbucket Pipelines.

## Production Configuration

- **AWS Account**: XXXXXXXXXXXX
- **Region**: us-east-1
- **ECR Repository**: api-documentation
- **ECS Cluster**: energygrid-devops
- **Access URL**: https://api-docs.energygrid.io (accessible only from within your 3 VPCs)

## Architecture Overview

The deployment pipeline consists of:

1. **Docker**: Application containerization with Node.js 24 build stage and Nginx production stage
2. **AWS ECR**: Docker image repository at XXXXXXXXXXXX.dkr.ecr.us-east-1.amazonaws.com/api-documentation
3. **AWS ECS**: Container orchestration on energygrid-devops cluster
4. **Bitbucket Pipelines**: CI/CD automation with auto-deployment on push to master/staging

## Prerequisites

### AWS Infrastructure Setup

Before configuring the pipeline, you need to set up the following AWS resources:

#### 1. Create ECR Repository

```bash
aws ecr create-repository \
  --repository-name api-documentation \
  --region us-east-1
```

#### 2. Create ECS Cluster

```bash
aws ecs create-cluster \
  --cluster-name api-documentation-cluster \
  --region us-east-1
```

#### 3. Create Task Definition

Create a file named `task-definition.json`:

```json
{
  "family": "api-documentation-task",
  "networkMode": "awsvpc",
  "requiresCompatibilities": ["FARGATE"],
  "cpu": "256",
  "memory": "512",
  "executionRoleArn": "arn:aws:iam::YOUR_ACCOUNT_ID:role/ecsTaskExecutionRole",
  "containerDefinitions": [
    {
      "name": "api-documentation",
      "image": "YOUR_ACCOUNT_ID.dkr.ecr.us-east-1.amazonaws.com/api-documentation:latest",
      "portMappings": [
        {
          "containerPort": 80,
          "protocol": "tcp"
        }
      ],
      "essential": true,
      "logConfiguration": {
        "logDriver": "awslogs",
        "options": {
          "awslogs-group": "/ecs/api-documentation",
          "awslogs-region": "us-east-1",
          "awslogs-stream-prefix": "ecs"
        }
      },
      "healthCheck": {
        "command": ["CMD-SHELL", "wget --quiet --tries=1 --spider http://localhost/health || exit 1"],
        "interval": 30,
        "timeout": 5,
        "retries": 3,
        "startPeriod": 60
      }
    }
  ]
}
```

Register the task definition:

```bash
aws ecs register-task-definition \
  --cli-input-json file://task-definition.json \
  --region us-east-1
```

#### 4. Create CloudWatch Log Group

```bash
aws logs create-log-group \
  --log-group-name /ecs/api-documentation \
  --region us-east-1
```

#### 5. Create Application Load Balancer (Optional but Recommended)

```bash
# Create ALB
aws elbv2 create-load-balancer \
  --name api-documentation-alb \
  --subnets subnet-xxxxx subnet-yyyyy \
  --security-groups sg-xxxxx \
  --scheme internet-facing \
  --region us-east-1

# Create Target Group
aws elbv2 create-target-group \
  --name api-documentation-tg \
  --protocol HTTP \
  --port 80 \
  --vpc-id vpc-xxxxx \
  --target-type ip \
  --health-check-path /health \
  --region us-east-1

# Create Listener
aws elbv2 create-listener \
  --load-balancer-arn arn:aws:elasticloadbalancing:... \
  --protocol HTTP \
  --port 80 \
  --default-actions Type=forward,TargetGroupArn=arn:aws:elasticloadbalancing:... \
  --region us-east-1
```

#### 6. Create ECS Service

```bash
aws ecs create-service \
  --cluster api-documentation-cluster \
  --service-name api-documentation-service \
  --task-definition api-documentation-task:1 \
  --desired-count 2 \
  --launch-type FARGATE \
  --network-configuration "awsvpcConfiguration={subnets=[subnet-xxxxx,subnet-yyyyy],securityGroups=[sg-xxxxx],assignPublicIp=ENABLED}" \
  --load-balancers "targetGroupArn=arn:aws:elasticloadbalancing:...,containerName=api-documentation,containerPort=80" \
  --region us-east-1
```

#### 7. Create IAM Role for ECS Task Execution

If not already created:

```bash
aws iam create-role \
  --role-name ecsTaskExecutionRole \
  --assume-role-policy-document file://trust-policy.json

aws iam attach-role-policy \
  --role-name ecsTaskExecutionRole \
  --policy-arn arn:aws:iam::aws:policy/service-role/AmazonECSTaskExecutionRolePolicy
```

## Bitbucket Configuration

### 1. Enable Pipelines

Go to your Bitbucket repository:
- Navigate to **Repository Settings** → **Pipelines** → **Settings**
- Enable Pipelines

### 2. Configure Repository Variables

The pipeline is pre-configured with production values. If you need to force ECS deployments (optional), add these variables in **Repository Settings** → **Pipelines** → **Repository variables**:

| Variable Name | Description | Required | Value |
|--------------|-------------|----------|-------|
| `AWS_ACCESS_KEY_ID` | AWS access key with ECR and ECS permissions | **Yes** | (from AWS IAM) |
| `AWS_SECRET_ACCESS_KEY` | AWS secret access key | **Yes** | (from AWS IAM - mark as Secured) |
| `ECS_CLUSTER_NAME` | ECS cluster name | Only if forcing deployment | `energygrid-devops` |
| `ECS_SERVICE_NAME` | ECS service name | Only if forcing deployment | (your ECS service name) |

**Note**: The pipeline automatically pushes to ECR. ECS auto-deployment is recommended, but you can uncomment the deploy step in the pipeline if needed.

**Important**: Mark `AWS_SECRET_ACCESS_KEY` as **Secured** to hide its value.

### 3. IAM Permissions

The AWS user/role used by Bitbucket Pipelines needs the following permissions:

```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Action": [
        "ecr:GetAuthorizationToken",
        "ecr:BatchCheckLayerAvailability",
        "ecr:GetDownloadUrlForLayer",
        "ecr:BatchGetImage",
        "ecr:PutImage",
        "ecr:InitiateLayerUpload",
        "ecr:UploadLayerPart",
        "ecr:CompleteLayerUpload"
      ],
      "Resource": "*"
    },
    {
      "Effect": "Allow",
      "Action": [
        "ecs:UpdateService",
        "ecs:DescribeServices",
        "ecs:DescribeTaskDefinition",
        "ecs:RegisterTaskDefinition",
        "ecs:ListTaskDefinitions",
        "ecs:DescribeClusters"
      ],
      "Resource": "*"
    },
    {
      "Effect": "Allow",
      "Action": [
        "iam:PassRole"
      ],
      "Resource": "arn:aws:iam::*:role/ecsTaskExecutionRole"
    }
  ]
}
```

## Pipeline Workflow

### Branch-Based Deployments

The pipeline is configured for different branches:

#### Master Branch
Commits to `master` trigger:
1. Build Docker image
2. Push to ECR with commit SHA and `latest` tags
3. Deploy to production ECS cluster

#### Staging Branch
Commits to `staging` trigger:
1. Build Docker image
2. Push to ECR
3. Deploy to staging ECS cluster (configure separate cluster/service)

#### Pull Requests
All pull requests trigger:
1. Docker build validation
2. No deployment

### Manual Deployment

You can manually trigger a deployment from the Bitbucket Pipelines UI:
1. Go to **Pipelines**
2. Click **Run pipeline**
3. Select the branch
4. Click **Run**

## Manual Deployment

If you need to manually deploy (outside of CI/CD):

### 1. Build and Push to ECR

```bash
# Login to ECR
aws ecr get-login-password --region us-east-1 --profile energygrid-production | \
  docker login --username AWS --password-stdin XXXXXXXXXXXX.dkr.ecr.us-east-1.amazonaws.com

# Build Docker image
docker build -t api-documentation .

# Tag the image
docker tag api-documentation:latest \
  XXXXXXXXXXXX.dkr.ecr.us-east-1.amazonaws.com/api-documentation:latest

# Push to ECR
docker push XXXXXXXXXXXX.dkr.ecr.us-east-1.amazonaws.com/api-documentation:latest
```

### 2. ECS Auto-Deployment

Once the image is pushed, the ECS service will automatically start the task and deploy the new version.

### 3. Access the Application

Access the documentation at: **https://api-docs.energygrid.io** (accessible only from within your 3 VPCs)

## Local Testing

### Build Docker Image Locally

```bash
docker build -t api-documentation:local .
```

### Run Container Locally

```bash
docker run -d -p 8080:80 --name api-docs-test api-documentation:local
```

Access the site at http://localhost:8080

### Test Health Check

```bash
curl http://localhost:8080/health
```

Should return: `healthy`

### Clean Up Test Container

```bash
docker stop api-docs-test
docker rm api-docs-test
```

## Environment-Specific Configurations

For different environments (staging, production), you can:

1. **Use separate ECS clusters and services**
   - Create `api-documentation-staging-cluster` and `api-documentation-prod-cluster`
   - Update pipeline variables for each branch

2. **Use environment variables in task definition**
   ```json
   "environment": [
     {
       "name": "ENV",
       "value": "production"
     }
   ]
   ```

3. **Create branch-specific pipeline files** (if needed)

## Monitoring and Troubleshooting

### View Logs

```bash
# CloudWatch Logs
aws logs tail /ecs/api-documentation --follow

# ECS Service Events
aws ecs describe-services \
  --cluster api-documentation-cluster \
  --services api-documentation-service \
  --query 'services[0].events' \
  --output table
```

### Check Service Status

```bash
aws ecs describe-services \
  --cluster api-documentation-cluster \
  --services api-documentation-service
```

### Rollback Deployment

```bash
# List task definition revisions
aws ecs list-task-definitions \
  --family-prefix api-documentation-task

# Update service to previous revision
aws ecs update-service \
  --cluster api-documentation-cluster \
  --service api-documentation-service \
  --task-definition api-documentation-task:PREVIOUS_REVISION
```

## Scaling

### Auto-Scaling Configuration

```bash
# Register scalable target
aws application-autoscaling register-scalable-target \
  --service-namespace ecs \
  --resource-id service/api-documentation-cluster/api-documentation-service \
  --scalable-dimension ecs:service:DesiredCount \
  --min-capacity 2 \
  --max-capacity 10

# Create scaling policy
aws application-autoscaling put-scaling-policy \
  --service-namespace ecs \
  --resource-id service/api-documentation-cluster/api-documentation-service \
  --scalable-dimension ecs:service:DesiredCount \
  --policy-name cpu-scaling-policy \
  --policy-type TargetTrackingScaling \
  --target-tracking-scaling-policy-configuration file://scaling-policy.json
```

## Cost Optimization

1. **Use Fargate Spot** for non-production environments
2. **Right-size container resources** (CPU/Memory)
3. **Use ECR lifecycle policies** to remove old images
4. **Enable ECS container insights** only when needed

## Security Best Practices

1. **Use VPC with private subnets** for ECS tasks
2. **Enable container image scanning** in ECR
3. **Rotate AWS credentials** regularly
4. **Use AWS Secrets Manager** for sensitive configuration
5. **Enable ALB access logs** for audit trails
6. **Implement WAF rules** on the ALB

## Next Steps

After completing this setup:

1. Test the pipeline by pushing to a branch
2. Monitor the deployment in Bitbucket Pipelines
3. Verify the service is running in ECS
4. Access the application via the ALB DNS name
5. Set up a custom domain with Route 53 (optional)
6. Configure SSL/TLS with ACM (optional)
