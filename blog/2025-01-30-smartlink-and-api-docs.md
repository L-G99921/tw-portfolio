---
title: "New: SmartLink Plug installation guide and the EnergyGrid API reference"
description: "Release note for the EnergyGrid docs: a SmartLink Plug installation guide, and reference pages for the PowerBox API and the Usage API."
tags: [smartlink, api, documentation]
authors: [leandro]
---

The EnergyGrid docs have two new sections: an installation guide for the SmartLink Plug, and a reference for the PowerBox API and the Usage API.

<!--truncate-->

:::note
EnergyGrid is the fictional platform behind most of this portfolio. This post is written the way I'd write a docs release note for a real product.
:::

## SmartLink Plug installation guide

The SmartLink Plug is a smart plug that also reads the home's smart meter. The [installation guide](/docs/smartlink/smartlink-installation-guide) covers:

- **Before you begin:** what to have ready, where to place the plug, and which Wi-Fi networks work.
- **App setup:** signing in, scanning the QR code, connecting to Wi-Fi, and linking the plug to the meter.
- **Checking the installation:** how to confirm the plug is online and sending usage data.
- **Troubleshooting:** connection failures, communication errors, and what each light means.

## API reference

### PowerBox API

The [PowerBox API](/docs/api/powerbox-api) connects a utility's back-office systems to EnergyGrid:

- **Sync a customer** (`POST /powerbox/customer`): send account details, service addresses, and meters from the utility's customer information system.
- **Bind or unbind a device** (`POST /powerbox/bind`): link a DataBridge Hub or SmartLink Plug to an AMI meter over the utility's wireless mesh radio.

Requests use OAuth 2.0 bearer tokens from the utility's identity provider.

### Usage API

The [Usage API](/docs/api/usage-api/energygrid-usage-api) is what the EnergyGrid app calls to show a customer their energy data. Its endpoints are grouped by area:

- **Customer:** login, profile, budget, and home profile.
- **Insights:** usage breakdowns, main uses of energy, and in-app messages.
- **Similar homes:** how the customer's use compares with similar households.
- **Usage:** usage data filtered by date, fuel, and granularity.
- **Metadata:** reference lists, such as device types and granularities.
- **Rates:** rate groups and billing cycle dates.

## How they fit together

The [integration guide](/docs/integration-guide) explains how the pieces connect, from hosting the PowerBox middleware to OAuth, customer sync, bulk data, and device binding.
