# EnergyGrid Docs

A technical documentation portal for a fictional utility energy platform. Built as a portfolio project to demonstrate technical writing skills across multiple content types — API references, hardware installation guides, integration workflows, and UX-facing content.

Built with [Docusaurus 3](https://docusaurus.io/) and deployed via Docker on AWS ECS.

---

## About this project

EnergyGrid is a white-label platform that utility companies use to offer energy monitoring and bill analysis to their residential customers. This documentation portal serves three audiences:

- **Utility integration engineers** — implementing the PowerBox API middleware and bulk data pipelines
- **Field technicians** — installing DataBridge Hub and SmartLink Plug hardware
- **Customer support agents** — using BillSense AI to assist customers with billing inquiries

---

## What's included

### Integration Guide
End-to-end integration reference for utility backend engineers. Covers OAuth 2.0 / OIDC authentication flow, customer data synchronization, bulk MDM and billing data ingestion via SFTP/S3, billing cycle schedules, rate information, and optional hardware binding.

### API Reference
Auto-generated interactive API docs from OpenAPI specs using the `docusaurus-plugin-openapi-docs` plugin.

- **ConnectBox API** — customer authentication, profile sync, and hardware binding endpoints
- **Usage Data API** — energy consumption, billing, home profile, and rate plan endpoints

### Hardware guides
Step-by-step installation guides for two smart home devices, written for non-technical end users.

- **DataBridge Hub** — Bluetooth pairing, Wi-Fi setup, and smart meter binding (two white-label variants)
- **SmartLink Plug** — QR code scanning, Wi-Fi provisioning, and meter binding

### BillSense AI docs
User guide and troubleshooting reference for a bill analysis tool used by customer support agents. Includes feature walkthroughs, escalation paths, and data interpretation guidance.

### Writing guideline
Internal style guide adapted from the Microsoft Writing Style Guide, covering voice and tone, UX writing patterns, data presentation standards, grammar rules, and a pre-publication checklist.

---

## Writing standards applied

- Microsoft Writing Style Guide — sentence case headings, active voice, second person, contractions
- Structured authoring — consistent use of admonitions (note, tip, warning, caution, danger)
- Docs-as-code workflow — Markdown and MDX, version-controlled in Git
- OpenAPI-driven API docs — single source of truth from the spec, no manual duplication

---

## Tech stack

| Tool | Purpose |
|------|---------|
| Docusaurus 3 | Static site framework |
| `docusaurus-plugin-openapi-docs` | Interactive API reference from OpenAPI specs |
| SASS | Custom theming |
| Docker + nginx | Production containerization |
| AWS ECR + ECS | Container registry and deployment |

---

## Run locally

**Requirements:** Node.js 20+

```bash
npm install
npm start
```

The site runs at `http://localhost:3000`.

To build for production:

```bash
npm run build
npm run serve
```
