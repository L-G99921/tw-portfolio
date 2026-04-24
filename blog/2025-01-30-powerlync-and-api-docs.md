---
title: "SmartLink Installation Guide and API Reference Now Available"
description: "Announcing the SmartLink Installation Guide and updated API Reference documentation for ConnectBox API and EnergyGrid Usage API."
tags: [smartlink, api, documentation]
---

We are excited to announce the release of two major additions to our documentation: the **SmartLink Installation Guide** and the updated **API Reference** for both the ConnectBox API and the Usage Data API.

<!--truncate-->

## SmartLink Installation Guide

The SmartLink is a compact smart plug that doubles as a whole-home energy meter. The new [SmartLink Installation Guide](/docs/powerlync/powerlync-installation-guide) walks you through the complete setup process, covering:

- **Requirements and prerequisites** — everything you need before starting, including device placement guidelines and Wi-Fi requirements.
- **Mobile app setup** — step-by-step instructions for signing in, scanning the QR code, connecting to Wi-Fi, and binding to your smart meter.
- **Installation verification** — how to confirm your SmartLink is online and reporting real-time energy data.
- **Troubleshooting** — solutions for common issues such as connection failures, communication errors, and LED status indicators.

The guide includes screenshots for each step of the setup process.

## API Reference Updates

Our API documentation now covers two complete API systems:

### ConnectBox API

The [ConnectBox API](/docs/api/powerbox-api) provides integration between utility backend systems and the EnergyGrid Platform. It includes:

- **Customer Synchronization** (`POST /powerbox/customer`) — sync customer account details, service addresses, and meter configurations from your utility CIS.
- **Hardware Binding** (`POST /powerbox/bind`) — link a DataBridge or SmartLink device to an AMI meter via Zigbee.

Authentication uses OAuth 2.0 Bearer tokens in JWT format.

### Usage API

The [Usage API](/docs/api/usage-api/energygrid-usage-api) exposes endpoints for accessing energy usage data and insights. Categories include:

- **Customer** — login, profile management, budget settings, and home profile configuration.
- **Insights** — energy usage breakdowns, main uses of energy, and message carousels.
- **Similar Homes** — comparison data against similar households.
- **Usage** — filtered energy usage data.
- **Metadata** — thing types, categories, granularity types, property types, and metric types.
- **Rate Data** — rate groups and billing cycle dates.

### Integration Guide

For a high-level walkthrough of how these APIs work together, see the [Integration Guide](/docs/integration-guide), which covers the full flow from hosting the ConnectBox middleware through OAuth setup, customer synchronization, bulk data ingestion, and hardware binding.
