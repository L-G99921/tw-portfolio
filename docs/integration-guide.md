---
id: integration-guide
title: PowerBox & BillSense Integration Guide
description: "Step-by-step guide to integrate utility backend systems with the EnergyGrid Platform, covering PowerBox API middleware, OAuth authentication, customer synchronization, and bulk data ingestion for BillSense AI."
sidebar_label: Integration Guide
sidebar_position: 2
tags: [integration, api, powerbox, oauth]
---

# PowerBox API and BillSense AI Integration Guide

## Overview

This guide describes how to integrate your utility's backend systems with the EnergyGrid Platform. A complete integration enables the EnergyGrid mobile app, BillSense AI bill analysis, and DataBridge Hub hardware functionality.

The integration consists of two layers:

1. **Real-Time Layer (PowerBox API):** Middleware hosted in your infrastructure that handles customer authentication and profile synchronization.
2. **Bulk Data Layer (SFTP / Object Storage):** A batch ingestion pipeline for high-volume usage data (MDM), billing financial data, billing cycles, and rate information required by BillSense AI.

---

## Table of Contents

- [Step 1: Host the PowerBox Middleware](#step-1-host-the-powerbox-middleware)
- [Step 2: Configure Authentication (OAuth)](#step-2-configure-authentication-oauth)
- [Step 3: Customer Synchronization](#step-3-customer-synchronization)
- [Step 4: Bulk Data Ingestion (Required for BillSense AI)](#step-4-bulk-data-ingestion-required-for-billsense-ai)
- [Step 5: Billing Cycle Schedule](#step-5-billing-cycle-schedule)
- [Step 6: Rate Information (Required for BillSense AI)](#step-6-rate-information-required-for-billsense-ai)
- [Step 7: Hardware Binding (Optional)](#step-7-hardware-binding-optional)
- [Step 8: Data Transport Options](#step-8-data-transport-options)
- [Appendix A: Error Codes](#error-codes)
- [Appendix B: Account Status Codes](#account-status-codes)

---

## Step 1: Host the PowerBox Middleware

The PowerBox API is a translation service between the EnergyGrid Platform and the utility's IT infrastructure. It must be hosted within the utility's IT infrastructure and remain accessible to EnergyGrid cloud services via HTTPS (TLS 1.2+).

- **Security:** Mutual TLS (mTLS), OAuth token validation, or additional measures such as IP restriction.
- **Hosting:** Utility infrastructure, either on-premise or cloud.

---

## Step 2: Configure Authentication (OAuth)

EnergyGrid uses an **OAuth Authorization Code Flow** with **OpenID Connect (OIDC)** to securely link the utility customer account with the EnergyGrid user profile.

:::tip Recommendation
OIDC is the recommended protocol. If the utility does not yet support OIDC, SAML is also accepted. Most utility partners are already migrating to OIDC.
:::

### Authentication Flow

1. The mobile app sends a token request to the utility Identity Provider (IDP).
2. The customer logs in via the utility login page using their existing credentials.
3. The IDP returns an authorization code to the mobile app.
4. The mobile app exchanges the code for a token with the utility IDP.
5. The token response returns to the app.
6. The app sends the token to the EnergyGrid backend.
7. EnergyGrid validates the token against the utility IDP.
8. After validation, EnergyGrid issues its own internal session token for subsequent API calls.

:::note
The utility IDP is used only for initial authentication. After token validation, EnergyGrid manages the session with its own internal token. EnergyGrid doesn't store customer personally identifiable information (PII).
:::

### JWT Claims

The claims inside the JSON Web Token (JWT) vary by utility. Common patterns:

| Utility Type | Claim Used |
|---------|-----------|
| Business partner model | `BPID` (Business Partner ID) |
| Profile-based model | `subject`, custom claims, or Profile ID |

The claim must resolve to a **unique, permanent customer identifier** (see `clientId` in [Step 3](#step-3-customer-synchronization)).

### Login Endpoint

**Endpoint:** `POST /powerbox/login`

This endpoint authenticates a utility customer against the utility customer database.

**Request payload:** OAuth token (Bearer header)

**Response (Success — HTTP 200):**

```json
{
  "clientId": "123456789"
}
```

**Response (Error — HTTP 401/404):**

```json
{
  "errorCode": 1
}
```

| Field | Data Type | Notes |
|-------|-----------|-------|
| `clientId` | Alphanumeric | Unique customer identifier within the utility |

See [Error Codes](#error-codes) for all valid error codes.

---

## Step 3: Customer Synchronization

After authentication, EnergyGrid fetches the customer's account details, service addresses (premises), and meter configurations from the utility's Customer Information System (CIS).

**Endpoint:** `POST /powerbox/customer`

This endpoint is called in conjunction with login to capture the most current customer information. It fires each time a token expires, the customer logs out, or the customer reinstalls the app.

**Request payload:** OAuth token (Bearer header)

### Understanding the Data Model

| Concept | What It Identifies | Examples |
|---------|--------------------|----------|
| **Client ID** | The person (login profile). Permanent across moves. | Business Partner ID (BPID), Business Partner Number (BPN), Profile ID |
| **Account Number** | The billing account. Changes when the customer moves. | Contract account number |
| **External Site ID / Premise Number** | The physical location. Permanent — does not change between tenants. | Premise number, site number |
| **Meter ID** | The physical meter device. Permanent unique identifier. | Utility meter ID |

**Key relationships:**

- One person (`clientId`) can have multiple premises (`customerSites`).
- One premise can have multiple meters (`meters`).
- `Account Number` + `Premise ID` = unique site in EnergyGrid.
- If only one premise or meter exists, `isPrimary` defaults to `true`.

:::note Tenant Move Detection
If premise and meter IDs are permanent (they do not change between tenants), EnergyGrid applies additional logic to detect when a new tenant has moved in and dissociates the premise from the previous tenant's Client ID. When Client IDs share the same Account Number and Premise identifier, EnergyGrid treats these as shared accounts — multiple login profiles with access to the same premises.
:::

### Response (Full Reference Model)

```json
{
  "clientId": "123456789",
  "firstName": null,
  "lastName": null,
  "businessName": null,
  "AcctStatus": "A",
  "customerSites": [
    {
      "externalSiteId": "5113305555",
      "isPrimary": true,
      "firstName": "John",
      "lastName": "Doe",
      "address1": "123 Main St.",
      "city": "Detroit",
      "state": "MI",
      "postalCode": "48067",
      "meters": [
        {
          "accountNumber": "85000000",
          "meterId": "123456789",
          "meterType": "Electric",
          "unitOfMeasure": "kWh",
          "isPrimary": true,
          "isAMI": true,
          "isAMR": true,
          "rateCode": "ABCRATE1",
          "billingCycleId": 1
        }
      ]
    }
  ]
}
```

### Customer Fields

| Field | Data Type | Required | Notes |
|-------|-----------|----------|-------|
| `clientId` | Alphanumeric | **Yes** | Unique customer identifier. Use a permanent profile ID (BPID, BPN, or Profile ID) so the record persists across moves. |
| `firstName` | String | Optional | Customer's first name. |
| `lastName` | String | Optional | Customer's last name. |
| `businessName` | String | Optional | If present, EnergyGrid marks the customer as a business account. |
| `AcctStatus` | String | Optional | Current account state. See [Account Status Codes](#account-status-codes). This field name is intentionally PascalCase as returned by the API. |
| `customerSites` | Array | **Yes** | Premises associated with the customer. |

### CustomerSite Fields

| Field | Data Type | Required | Notes |
|-------|-----------|----------|-------|
| `externalSiteId` | Alphanumeric | **Yes** | Premise or site number. Use the permanent value if available. Combined with Account Number, this forms a unique premise in EnergyGrid. |
| `isPrimary` | Boolean | **Yes** | `true` if this is the customer's primary location. Always `true` if only one site exists. |
| `firstName` | String | Optional | First name on the billing account. |
| `lastName` | String | Optional | Last name on the billing account. |
| `address1` | String | **Yes** | Street address. |
| `city` | String | **Yes** | City. |
| `state` | String | **Yes** | Two-character state or province code. |
| `postalCode` | String | **Yes** | US: 5-digit zip code. Canada: 6-character postal code with space (for example, `V6M 2T5`). |
| `meters` | Array | **Yes** | Meters at this site. A site may have more than one meter of any type. |

### Meter Fields

| Field | Data Type | Required | Notes |
|-------|-----------|----------|-------|
| `accountNumber` | Alphanumeric | Conditional | Contract account number. **Required** if permanent client and premise IDs are used (where only the account number changes on move). Apply the same account number to all meters at a billing account. Account numbers must differ across premises. |
| `meterId` | Alphanumeric | **Yes** | Permanent unique meter identifier. Used for DataBridge Hub binding requests if applicable. |
| `meterType` | String | **Yes** | `"Electric"` or `"Gas"`. |
| `unitOfMeasure` | String | Optional | Electric: `kWh` or `Wh`. Gas: `ccf` or `cm`. |
| `isPrimary` | Boolean | **Yes** | `true` for the main meter when multiple meters exist at a site. If a site has an interruptible HVAC meter and a standard meter, the standard meter is marked primary. |
| `isAMI` | Boolean | **Yes** | `true` if this is an Advanced Metering Infrastructure (AMI) smart meter. AMI meters have radios that form a mesh network and send data automatically. If `isAMI = true`, a DataBridge Hub can be added. |
| `isAMR` | Boolean | Optional | `true` if this is an Advanced Meter Reading (AMR) meter — uses RFID, read by a drive-by vehicle. |
| `PANID` | Alphanumeric | Optional | **Obsolete.** Personal Area Network (PAN) ID of the AMI meter. Previously used by DataBridge Hub for mesh binding. |
| `rateCode` | Alphanumeric | **Yes** | Meter rate code that determines which billing calculator to use. See [Rate Information](#step-6-rate-information-required-for-billsense-ai). |
| `rateMultiplier` | Numeric | Optional | **Obsolete.** Rate multiplier for usage computation. |
| `billingCycleId` | Integer | **Yes** | Customer's billing cycle ID. References the billing cycle schedule. See [Billing Cycle Schedule](#step-5-billing-cycle-schedule). |
| `dialCount` | Integer | Optional | **Obsolete.** Number of dials on a meter, previously used for AMR gas meters. |

:::tip Minimum Required Fields for Launch
At a minimum, the customer response must include: `clientId`, at least one `customerSite` with `externalSiteId` and `postalCode`, and at least one meter with `meterId`, `meterType`, `isAMI`, `rateCode`, and `billingCycleId`.
:::

---

## Step 4: Bulk Data Ingestion (Required for BillSense AI)

The PowerBox API establishes who the customer is. BillSense AI also requires how much energy the customer used and what they were billed in order to generate insights.

:::important
Without rate information and billing data, BillSense AI cannot function. Projected bills will not match actual bills, which drives unnecessary call center volume.
:::

### 4.1 Usage Data (MDM)

Usage data is the primary source for energy visualization and is sourced from the Meter Data Management (MDM) system.

| Attribute | Description |
|-----------|-------------|
| **Source** | Meter Data Management (MDM) system |
| **Electric granularity** | 15-minute or hourly |
| **Gas granularity** | Daily (standard) or hourly (if using AMR adapters) |
| **Latency** | Varies by utility — from near real-time (a few hours behind) to approximately 36 hours behind |

:::note AMI Dependency
If the utility does not have AMI meters and lacks hourly resolution, the platform's analytical value is significantly reduced. There is no granular data to visualize or analyze.
:::

#### Ingestion Methods

- **Full Batch:** Receive data for all utility customers, store it, and load it upon user registration.
- **Registered Only:** Receive data only for customers who have registered.
- **API Backfill:** Request historical data at registration time via API, followed by standard SFTP or object-storage updates the next day.

#### File Format

**Format:** CSV via SFTP

**File naming convention:**

- Electric: `CompanyCode_DDMMYYYY_Electric.csv`
- Gas: `CompanyCode_DDMMYYYY_Gas.csv`

**CSV structure:**

```csv
AccountNumber,ExternalSiteID,MeterID,TimeStamp,TotalUnit
910020087577,5113018555,5532879,1/1/2017,22.556
910020087577,5113018555,5532879,1/2/2017,12.898
910020087577,5113018555,5532879,1/3/2017,0.256
910020087577,5113018555,5532879,1/4/2017,10.256
```

:::note
Only data for registered EnergyGrid customers is loaded into the platform database, matched using identifiers from the `/powerbox/customer` endpoint. Utility partners may choose to send data for all customers.
:::

### 4.2 Billing and Financial Data (BillSense AI Core)

BillSense AI requires granular financial data to explain bill changes — for example, identifying that a bill increased due to a rate change.

#### Meter Contract History (MCH)

The Meter Contract History (MCH) is the authoritative record of what the customer was billed. Essential fields:

| Field | Description |
|-------|-------------|
| Contract Account | Billing account identifier |
| Billing Start Date | Start of billing period |
| Billing End Date | End of billing period |
| Total Consumption | Total energy consumed in the period |
| Usage Value | Usage amount in billing units |
| Cost | Dollar amount charged |
| Tax Amounts | Tax breakdown |
| Meter Effective Date | When the meter became active for this contract |

:::tip
If the utility provides billing line items (a detailed breakdown of charges), that is the preferred format. If not, a condensed version with the fields above is acceptable. Approximately 25% of columns in a typical billing export can be eliminated.
:::

#### Additional Data Sets

| Data Set | Description | Frequency |
|----------|-------------|-----------|
| **Invoice Details** | Breakdown of line items (taxes, fees, riders) essential for AI analysis | Daily |
| **Payment Plans** | Records for customers on payment arrangements or budget billing | Daily |
| **Account Termination** | List of closed accounts to trigger data cleanup | Daily (or as needed) |

:::note Solar Billing
Solar billing structures are complex and not yet standardized across utility partners. The current approach uses net metering. Solar-specific billing structures are handled on a case-by-case basis.
:::

---

## Step 5: Billing Cycle Schedule

Billing cycles — also called Meter Reading Schedule or Meter Reading Units (MRU) — define the service intervals for which utility customers are billed. The `billingCycleId` on each meter references this schedule.

Utility partners stagger billing cycles to distribute processing load. A typical arrangement serves approximately 100,000 customers per cycle per day in rotation. A utility may have as few as 20 billing cycles or several thousand MRUs.

EnergyGrid requires the complete cycle schedule to evaluate billing period costs and charges.

### Example: Cycle 1 Schedule for 2025

| Cycle ID | Start Date | End Date |
|----------|-----------|----------|
| 1 | 2024-12-03 | 2025-01-02 |
| 1 | 2025-01-03 | 2025-01-30 |
| 1 | 2025-01-31 | 2025-03-03 |
| 1 | 2025-03-04 | 2025-04-01 |
| 1 | 2025-04-02 | 2025-05-01 |
| 1 | 2025-05-02 | 2025-06-02 |
| 1 | 2025-06-03 | 2025-07-02 |
| 1 | 2025-07-03 | 2025-08-01 |
| 1 | 2025-08-02 | 2025-09-02 |
| 1 | 2025-09-03 | 2025-10-01 |
| 1 | 2025-10-02 | 2025-10-30 |
| 1 | 2025-10-31 | 2025-12-02 |

:::note
Cycle IDs are not limited to numeric values. They can be alphanumeric depending on the utility's system.
:::

---

## Step 6: Rate Information (Required for BillSense AI)

:::danger Non-Negotiable
Without rate information, BillSense AI will not function. Projected bills will not match actual bills, which generates unnecessary calls to the utility's call center.
:::

The `rateCode` on each meter in the customer object points to the appropriate billing calculator. EnergyGrid requires all rate codes supported by the utility for **residential rates** only.

### Meter Rate Codes

Each meter is assigned a rate code. Provide the full list of supported codes:

| Rate Code | Description |
|-----------|----------------------|
| EFR_D1_8 | Residential Dynamic Peak Pricing — Exp. D1_8 |
| EFR_D1-A | Residential Time-of-Day Pilot I |
| EFR_D1-B | Residential Time-of-Day Pilot II |
| EFR_D1.11 | Residential Service Rate — Standard Time-of-Use D1.11 |
| EFR_D1.13 | Residential Service Rate — Overnight Savers |

### Supported Rate Types

EnergyGrid supports three rate calculation types, plus fixed costs (service and facility fees, taxes, and non-taxable program charges) that apply to any billing interval.

#### Time of Use (TOU)

Time-of-Use (TOU) rates require:

- A schedule of observed holidays (generally treated as off-peak)
- Peak intervals with start and end hours for each day type

**Example: Summer TOU Schedule**

| Name | Amount ($/kWh) | Start Hour | End Hour | Rate Start Date | Rate End Date |
|------|---------------|------------|----------|----------------|--------------|
| Off-peak M-F | 0.0479 | 0 | 7 | 2025-06-01 | 2025-09-30 |
| Mid-Peak M-F | 0.0922 | 7 | 15 | 2025-06-01 | 2025-09-30 |
| On-peak M-F | 0.1660 | 15 | 19 | 2025-06-01 | 2025-09-30 |
| Off-Peak M-F | 0.0479 | 23 | 24 | 2025-06-01 | 2025-09-30 |
| Off-Peak Wknd/Holiday | 0.0479 | 0 | 24 | 2025-06-01 | 2025-09-30 |

Each day is split into intervals on a 24-hour clock. Weekends and holidays are treated as off-peak. The start and end dates define the summer period. Winter periods follow the same structure with different amounts, typically running from October 1 to May 31, then cycling back to summer rates.

Concurrent rates (delivery, energy waste reduction, distribution) can be rolled into the peak windows or evaluated separately.

#### Tiered

Tiered rates use a prorate factor to compute the daily Tier 1 allowance. Given a daily Tier 1 prorate factor of 22.1918 kilowatt-hours (kWh) and the number of days in a billing period, the system calculates the upper Tier 1 limit. When cumulative usage exceeds this threshold, Tier 2 pricing applies for the remainder of the billing period. Delivery, distribution, and other charges also apply.

#### Flat

A single average per-kWh amount applied uniformly to all usage.

---

## Step 7: Hardware Binding (Optional)

If the integration includes DataBridge Hub hardware, the bind endpoint links the device to the AMI meter over the utility's wireless mesh radio.

**Endpoint:** `POST /powerbox/bind`

The bind process uses a service account — individual customer credentials are not used. In addition to TLS 1.2, a client certificate for mutual TLS (mTLS), provisioned by EnergyGrid, is attached during the TLS handshake along with a basic authentication header.

### Request Payload

```json
{
  "hemProfileId": "a3f1c8d2-44bc-4e1a-b9f0-123456789abc",
  "accountSlid": "SL-000123456",
  "macAddress": "AA:BB:CC:DD:EE:FF",
  "installCode": "A1B2C3D4E5F6A7B8"
}
```

| Field | Description |
|-------|-------------|
| `hemProfileId` | Customer GUID |
| `accountSlid` | Account Service Location ID (SLID) |
| `macAddress` | DataBridge Hub MAC address |
| `installCode` | DataBridge Hub install code |

### Response (Success — HTTP 200)

```json
{
  "status": "success",
  "message": "Binding request accepted"
}
```

:::note
For error responses, see [Error Codes](#error-codes).
:::

---

## Step 8: Data Transport Options

The following methods are supported for bulk data exchange between the utility and EnergyGrid:

| Method | Notes |
|--------|-------|
| **SFTP** | Standard method for MDM data |
| **FTP** | Legacy option |
| **Object-storage replication** | Bucket-to-bucket sync between utility and EnergyGrid object stores |
| **API** | For on-demand backfill or real-time feeds |
| **File Exchange** | Generic file drop mechanism |

Agree on the transport method and hosting responsibility (utility-hosted vs. EnergyGrid-hosted) during the integration kickoff.

---

## Appendix A: Error Codes {#error-codes}

| HTTP Status | Error Code | Description |
|-------------|-----------|-------------|
| 401 | 1 | Invalid credentials. The customer does not have a utility account. |
| 401 | 2 | Invalid credentials. Two authentication attempts remaining. |
| 401 | 3 | Invalid credentials. One authentication attempt remaining. |
| 401 | 4 | Account is locked. The customer must contact the utility to remove the lock. |
| 401 | 86 | Account is closed, finaled, or no longer accessible. EnergyGrid may or may not have an associated record. |
| 503 | — | PowerBox API outage or maintenance. No error model body is returned. |

:::note
Error codes 2–4 apply only to existing utility customers. HTTP 503 may be returned without an error model body to indicate PowerBox API outages or scheduled maintenance.
:::

## Appendix B: Account Status Codes {#account-status-codes}

| Status Code | Name | Description |
|-------------|------|-------------|
| A | Active | Active account |
| C | Charge Off | Account charged off |
| D | Active Service Disconnect | Active account with service disconnected |
| F | Final | Final account billing complete |
| L | Closed | Closed account with unpaid final bill |
| N | New | Active new account |
| P | Pending | Pending account with a future open date |
| S | Sold | Sold receivables account |
| U | Final Account Funds Due | Final account with unclaimed funds |
| X | Final Account Still Billed | Final account still receiving charges |
| Z | Cancel | Cancelled account |
