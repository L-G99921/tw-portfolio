---
slug: /
title: EnergyGrid documentation
description: Featured portfolio project by Leandro Gabriel. A documentation portal for a fictional utility platform, written for three audiences.
sidebar_position: 1
tags: [portfolio, featured-project, getting-started]
---

# EnergyGrid documentation

:::info About this project
EnergyGrid is a fictional utility platform. I documented it end to end for this portfolio to show how one product can serve three audiences: backend engineers at a utility, people installing hardware at home, and support agents. The company, products, and URLs are invented. The writing decisions are real.
:::

EnergyGrid connects utility companies, smart meters, and their customers. Utilities send customer and meter data to the platform, customers install a small device at home, and the EnergyGrid app shows energy use in near real time and explains each bill.

:::tip Integrating a utility?
Start with the [integration guide](/docs/integration-guide). If you prefer to learn by doing, the [tutorial](/docs/tutorial-first-integration) gets you to a working sandbox integration in about 30 minutes.
:::

## Products

**DataBridge Hub.** A device that reads the smart meter over the utility's wireless mesh radio (AMI). It streams usage data to the app and can control compatible smart home devices.

**SmartLink Plug.** A smart plug with the same meter connection in a smaller device. It suits homes that only need monitoring and a few controlled devices.

**BillSense AI.** A bill analysis feature in the app. It explains why a bill changed, breaks usage down by category, and suggests ways to save.

## Where to start

| If you are | Read |
|---|---|
| A backend engineer at a utility | [Integration guide](/docs/integration-guide), then the [API reference](/docs/api/powerbox-api) |
| New to the platform and want to try it | [Tutorial: your first integration](/docs/tutorial-first-integration) |
| Installing hardware at home | [DataBridge Hub](/docs/databridge/databridge-installation-guide-atlas-insight) or [SmartLink Plug](/docs/smartlink/smartlink-installation-guide) |
| A support agent | [BillSense AI overview](/docs/billsense-ai/overview) and [troubleshooting](/docs/billsense-ai/troubleshooting) |

The portfolio also has a second, separate project: [PIX](/docs/pix/about-pix), a documentation set for Brazil's instant-payments system with one page of each Diátaxis type and an API reference you can call from the browser.

## How the platform connects

A utility integrates through two layers.

### Real-time layer: PowerBox API

PowerBox is a middleware service that runs inside the utility's infrastructure. It handles:

- Customer sign-in through OAuth 2.0
- Customer profile sync from the utility's customer information system (CIS)
- Requests to bind a DataBridge Hub or SmartLink Plug to a meter

### Bulk data layer: SFTP or object storage

BillSense AI needs more data than an API call can carry. The utility uploads files on a schedule:

- **Usage data (MDM):** meter reads at 15-minute or hourly intervals
- **Billing data:** the financial record of each bill
- **Invoice details:** line items, so the app can show what each charge covers

## Hardware options

| Device | Connects through | Good fit for |
|---|---|---|
| DataBridge Hub | Ethernet or Wi-Fi | Homes that want to control several smart devices |
| SmartLink Plug | Wi-Fi | Homes that mainly want monitoring |

Both devices talk to the utility's AMI meter over the wireless mesh radio. Before a device can read the meter, the utility sends a bind request that adds the device to the meter's home area network (HAN).

## Support

For help with an integration or a hardware rollout, contact your EnergyGrid technical account manager.
