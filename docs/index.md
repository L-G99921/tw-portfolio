---
slug: /
title: Featured Project — EnergyGrid Docs
description: Portfolio sample by Leandro Gabriel — a technical documentation portal for a fictional utility platform.
sidebar_position: 1
tags: [portfolio, featured-project, getting-started]
---

# Featured project — EnergyGrid documentation

*A featured project in [Leandro Gabriel's](https://www.linkedin.com/in/leandro-gabriel-8aab31167/) technical writing portfolio — a full documentation portal for a **fictional** utility energy platform, built to demonstrate information architecture, docs-as-code workflows, and Docusaurus theming.*

The EnergyGrid Platform is an energy management solution that connects utility partners, smart meters, and customers through integrated hardware and software. It delivers real-time energy monitoring, smart device control, and AI-powered billing insights.

:::tip Looking to integrate?
Start with the [Integration Guide](/docs/integration-guide) to connect your utility's backend systems with the EnergyGrid Platform.
:::

## Products

**DataBridge Hub** — An enterprise-grade hardware device that connects to Advanced Metering Infrastructure (AMI) smart meters over the utility's wireless mesh radio. It enables real-time energy data streaming and control of compatible smart home devices.

**SmartLink Plug** — A compact smart plug with integrated whole-home energy metering. It connects to utility smart meters and controls compatible mesh smart devices in a simplified form factor.

**BillSense AI** — An intelligent billing analysis system that explains bill changes, identifies usage patterns, and provides actionable insights to customers.

## Get started

| Resource | Description |
|----------|-------------|
| [Integration Guide](/docs/integration-guide) | Configure PowerBox API middleware, OAuth authentication, and data ingestion pipelines. |
| [API Reference](/docs/api/powerbox-api) | Explore endpoints, authentication methods, and implementation examples. |
| [DataBridge Hub Installation](/docs/databridge/databridge-installation-guide-atlas-insight) | Deploy and configure DataBridge Hub hardware for smart meter connectivity. |
| [SmartLink Plug Installation](/docs/smartlink/smartlink-installation-guide) | Install and bind SmartLink Plug devices to utility smart meters. |
| [PIX — Diátaxis showcase](/docs/pix/about-pix) | A second domain — Brazil's instant-payments rail — with one page of each Diátaxis type and an anonymized OpenAPI sample modelled on the public PIX PSP standard. |

## Platform Architecture

The EnergyGrid Platform consists of two integration layers.

### Real-Time Layer (PowerBox API)

A middleware service hosted within utility infrastructure that handles:

- Customer authentication via OAuth 2.0
- Customer profile synchronization from the Customer Information System (CIS)
- Hardware binding requests for DataBridge Hub and SmartLink Plug devices

### Bulk Data Layer (SFTP / Object Storage)

A batch ingestion pipeline for high-volume data required by BillSense AI:

- **Usage Data (MDM)** — 15-minute or hourly meter reads for energy visualization
- **Billing Data (MCH)** — Financial records for bill explanation and analysis
- **Invoice Details** — Line-item breakdowns for granular cost attribution

## Hardware Solutions

EnergyGrid offers two hardware options for smart meter connectivity.

| Device | Connection | Best For |
|--------|------------|----------|
| **DataBridge Hub** | Ethernet or Wi-Fi | Full smart home integration with extended mesh device support |
| **SmartLink Plug** | Wi-Fi only | Simplified deployment with mesh smart device control |

Both devices communicate with utility AMI meters over the utility's wireless mesh radio and require a bind request to join the Home Area Network (HAN).

## Support

For technical assistance with integration or hardware deployment, contact your EnergyGrid technical account manager or refer to the relevant installation guide in this documentation.
