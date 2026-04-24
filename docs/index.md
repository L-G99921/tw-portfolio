---
slug: /
title: Welcome
description: EnergyGrid Technical Documentation
sidebar_position: 1
tags: [welcome, getting-started]
---

# Welcome to EnergyGrid Documentation

The EnergyGrid Platform is an energy management solution that connects utility partners, smart meters, and customers through integrated hardware and software. It delivers real-time energy monitoring, smart device control, and AI-powered billing insights.

:::note Looking to integrate?
Start with the [Integration Guide](/docs/integration-guide) to connect your utility's backend systems with the EnergyGrid Platform.
:::

## Products

**DataBridge Hub** — An enterprise-grade hardware device that connects to Advanced Metering Infrastructure (AMI) smart meters via Zigbee. It enables real-time energy data streaming and Z-Wave smart home device control.

**SmartLink Plug** — A compact smart plug with integrated whole-home energy metering. It connects to utility smart meters and controls Zigbee devices in a simplified form factor.

**BillSense AI** — An intelligent billing analysis system that explains bill changes, identifies usage patterns, and provides actionable insights to customers.

## Get Started

| Resource | Description |
|----------|-------------|
| [Integration Guide](/docs/integration-guide) | Configure PowerBox API middleware, OAuth authentication, and data ingestion pipelines. |
| [API Reference](/docs/api/powerbox-api) | Explore endpoints, authentication methods, and implementation examples. |
| [DataBridge Hub Installation](/docs/energy-bridge/energy-bridge-installation-guide-atlas-insight) | Deploy and configure DataBridge Hub hardware for smart meter connectivity. |
| [SmartLink Plug Installation](/docs/powerlync/powerlync-installation-guide) | Install and bind SmartLink Plug devices to utility smart meters. |

## Platform Architecture

The EnergyGrid Platform consists of two integration layers.

### Real-Time Layer (PowerBox API)

A middleware service hosted within utility infrastructure that handles:

- Customer authentication via OAuth 2.0
- Customer profile synchronization from the Customer Information System (CIS)
- Hardware binding requests for DataBridge Hub and SmartLink Plug devices

### Bulk Data Layer (SFTP/S3)

A batch ingestion pipeline for high-volume data required by BillSense AI:

- **Usage Data (MDM)** — 15-minute or hourly meter reads for energy visualization
- **Billing Data (MCH)** — Financial records for bill explanation and analysis
- **Invoice Details** — Line-item breakdowns for granular cost attribution

## Hardware Solutions

EnergyGrid offers two hardware options for smart meter connectivity.

| Device | Connection | Best For |
|--------|------------|----------|
| **DataBridge Hub** | Ethernet or Wi-Fi | Full smart home integration with Z-Wave support |
| **SmartLink Plug** | Wi-Fi only | Simplified deployment with Zigbee device control |

Both devices communicate with utility AMI meters via Zigbee and require a bind request to join the Home Area Network (HAN).

## Support

For technical assistance with integration or hardware deployment, contact your EnergyGrid technical account manager or refer to the relevant installation guide in this documentation.
