---
id: integration-guide
title: PowerBox and BillSense AI integration guide
description: "Step-by-step guide to integrate utility backend systems with the EnergyGrid Platform, covering PowerBox API middleware, OAuth authentication, customer synchronization, and bulk data ingestion for BillSense AI."
sidebar_label: Integration guide
sidebar_position: 2
tags: [integration, api, powerbox, oauth]
---

# PowerBox and BillSense AI integration guide

This guide is for backend engineers at a utility. It covers what you need to connect your systems to EnergyGrid so that the EnergyGrid app, BillSense AI bill analysis, and the DataBridge Hub work for your customers.

The integration has two layers:

1. **Real-time layer (PowerBox API):** middleware you host that handles customer sign-in and profile sync.
2. **Bulk data layer (SFTP or object storage):** scheduled file transfers with usage data (MDM), billing data, billing cycles, and rate information. BillSense AI depends on this layer.

:::tip Prefer to try it first?
The [30-minute tutorial](/docs/tutorial-first-integration) walks through the real-time layer against the sandbox.
:::

## Step 1: Host the PowerBox middleware

The PowerBox API translates between EnergyGrid and your systems. Host it in your own infrastructure, on premises or in your cloud, and make it reachable from EnergyGrid over HTTPS with TLS 1.2 or later.

Protect it with mutual TLS (mTLS), OAuth token validation, or both. IP allowlisting is a common extra layer.

## Step 2: Configure authentication (OAuth)

EnergyGrid uses the **OAuth authorization code flow** with **OpenID Connect (OIDC)** to link the customer's utility account to their EnergyGrid profile.

:::tip Recommendation
Use OIDC. If your identity provider doesn't support it yet, SAML also works, but most utility partners are moving to OIDC.
:::

### Authentication flow

1. The mobile app sends a token request to the utility identity provider (IDP).
2. The customer signs in on the utility's sign-in page with their existing credentials.
3. The IDP returns an authorization code to the mobile app.
4. The mobile app exchanges the code for a token with the utility IDP.
5. The token response returns to the app.
6. The app sends the token to the EnergyGrid backend.
7. EnergyGrid validates the token against the utility IDP.
8. After validation, EnergyGrid issues its own internal session token for subsequent API calls.

:::note
EnergyGrid uses the utility IDP only for the first sign-in. After it validates the token, EnergyGrid runs the session with its own token. EnergyGrid doesn't store customers' personally identifiable information (PII).
:::

### JWT claims

The claims in the JSON Web Token (JWT) vary by utility. The two common patterns:

| Utility model | Claim used |
|---------|-----------|
| Business partner model | `BPID` (Business Partner ID) |
| Profile-based model | `subject`, custom claims, or Profile ID |

The claim must resolve to a **unique, permanent customer identifier** (see `clientId` in [Step 3](#step-3-customer-synchronization)).

### Login endpoint

**Endpoint:** `POST /powerbox/login`

Authenticates a utility customer against your customer database.

**Request payload:** OAuth token (Bearer header)

**Response (success, HTTP 200):**

```json
{
  "clientId": "123456789"
}
```

**Response (error, HTTP 401 or 404):**

```json
{
  "errorCode": 1
}
```

| Field | Data type | Notes |
|-------|-----------|-------|
| `clientId` | Alphanumeric | Unique customer identifier within the utility |

For every error code, see [Appendix A](#error-codes).

## Step 3: Customer synchronization

After sign-in, EnergyGrid fetches the customer's account details, service addresses (premises), and meter configuration from your customer information system (CIS).

**Endpoint:** `POST /powerbox/customer`

EnergyGrid calls this endpoint right after login, to get current customer data. It calls it again whenever a token expires, the customer signs out, or the customer reinstalls the app.

**Request payload:** OAuth token (Bearer header)

### The data model

| Concept | What it identifies | Examples |
|---------|--------------------|----------|
| **Client ID** | The person (sign-in profile). Stays the same when they move. | Business Partner ID (BPID), Business Partner Number (BPN), Profile ID |
| **Account number** | The billing account. Changes when the customer moves. | Contract account number |
| **External site ID (premise number)** | The physical location. Stays the same between tenants. | Premise number, site number |
| **Meter ID** | The physical meter. Permanent and unique. | Utility meter ID |

**Key relationships:**

- One person (`clientId`) can have multiple premises (`customerSites`).
- One premise can have multiple meters (`meters`).
- Account number plus premise ID identifies one site in EnergyGrid.
- If only one premise or meter exists, `isPrimary` defaults to `true`.

:::note Detecting a tenant move
When premise and meter IDs stay the same between tenants, EnergyGrid detects when a new tenant moves in and removes the premise from the previous tenant's client ID. When two client IDs share the same account number and premise, EnergyGrid treats them as a shared account: several sign-in profiles with access to the same premises.
:::

### Response (full model)

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

### Customer fields

| Field | Data type | Required | Notes |
|-------|-----------|----------|-------|
| `clientId` | Alphanumeric | **Yes** | Unique customer identifier. Use a permanent profile ID (BPID, BPN, or Profile ID) so the record persists across moves. |
| `firstName` | String | Optional | Customer's first name. |
| `lastName` | String | Optional | Customer's last name. |
| `businessName` | String | Optional | If present, EnergyGrid marks the customer as a business account. |
| `AcctStatus` | String | Optional | Current account state. See [Appendix B](#account-status-codes). The API returns this field name in PascalCase. |
| `customerSites` | Array | **Yes** | Premises associated with the customer. |

### CustomerSite fields

| Field | Data type | Required | Notes |
|-------|-----------|----------|-------|
| `externalSiteId` | Alphanumeric | **Yes** | Premise or site number. Use the permanent value if available. With the account number, it identifies one premise in EnergyGrid. |
| `isPrimary` | Boolean | **Yes** | `true` if this is the customer's primary location. Always `true` if only one site exists. |
| `firstName` | String | Optional | First name on the billing account. |
| `lastName` | String | Optional | Last name on the billing account. |
| `address1` | String | **Yes** | Street address. |
| `city` | String | **Yes** | City. |
| `state` | String | **Yes** | Two-character state or province code. |
| `postalCode` | String | **Yes** | US: 5-digit zip code. Canada: 6-character postal code with space (for example, `V6M 2T5`). |
| `meters` | Array | **Yes** | Meters at this site. A site can have more than one meter of any type. |

### Meter fields

| Field | Data type | Required | Notes |
|-------|-----------|----------|-------|
| `accountNumber` | Alphanumeric | Conditional | Contract account number. **Required** if permanent client and premise IDs are used (where only the account number changes on move). Apply the same account number to all meters at a billing account. Account numbers must differ across premises. |
| `meterId` | Alphanumeric | **Yes** | Permanent unique meter identifier. Used for DataBridge Hub binding requests if applicable. |
| `meterType` | String | **Yes** | `"Electric"` or `"Gas"`. |
| `unitOfMeasure` | String | Optional | Electric: `kWh` or `Wh`. Gas: `ccf` or `cm`. |
| `isPrimary` | Boolean | **Yes** | `true` for the main meter when multiple meters exist at a site. If a site has an interruptible HVAC meter and a standard meter, the standard meter is marked primary. |
| `isAMI` | Boolean | **Yes** | `true` if this is an Advanced Metering Infrastructure (AMI) smart meter. AMI meters have radios that form a mesh network and send data automatically. If `isAMI = true`, a DataBridge Hub can be added. |
| `isAMR` | Boolean | Optional | `true` if this is an Automated Meter Reading (AMR) meter, which a passing vehicle reads over RFID. |
| `PANID` | Alphanumeric | Optional | **Obsolete.** Personal Area Network (PAN) ID of the AMI meter. Previously used by DataBridge Hub for mesh binding. |
| `rateCode` | Alphanumeric | **Yes** | Meter rate code that determines which billing calculator to use. See [Step 6](#step-6-rate-information-required-for-billsense-ai). |
| `rateMultiplier` | Numeric | Optional | **Obsolete.** Rate multiplier for usage computation. |
| `billingCycleId` | Integer | **Yes** | Customer's billing cycle ID. References the billing cycle schedule. See [Step 5](#step-5-billing-cycle-schedule). |
| `dialCount` | Integer | Optional | **Obsolete.** Number of dials on a meter, previously used for AMR gas meters. |

:::tip Minimum fields for launch
The customer response must include at least: `clientId`, at least one `customerSite` with `externalSiteId` and `postalCode`, and at least one meter with `meterId`, `meterType`, `isAMI`, `rateCode`, and `billingCycleId`.
:::

## Step 4: Bulk data ingestion (required for BillSense AI)

The PowerBox API tells EnergyGrid who the customer is. To explain a bill, BillSense AI also needs how much energy the customer used and what they were charged.

:::caution
Without billing data and rate information, BillSense AI can't work. Projected bills won't match real bills, and customers call your support line to ask why.
:::

### 4.1 Usage data (MDM)

Usage data drives every chart in the app. It comes from your meter data management (MDM) system.

| Attribute | Description |
|-----------|-------------|
| **Source** | Meter Data Management (MDM) system |
| **Electric granularity** | 15-minute or hourly |
| **Gas granularity** | Daily (standard) or hourly (if using AMR adapters) |
| **Latency** | Varies by utility, from a few hours to about 36 hours behind |

:::note AMI dependency
Without AMI meters and hourly data, there's little for the app to chart or analyze, and the platform loses most of its value.
:::

#### Ingestion methods

- **Full batch:** send data for every customer. EnergyGrid stores it and loads it when a customer registers.
- **Registered only:** send data only for customers who have registered.
- **API backfill:** EnergyGrid requests history through the API at registration, then regular SFTP or object-storage updates start the next day.

#### File format

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
EnergyGrid loads data only for registered customers, matched by the identifiers from `/powerbox/customer`. You can still send data for every customer.
:::

### 4.2 Billing and financial data

To explain why a bill changed, for example because the rate went up, BillSense AI needs detailed billing data.

#### Meter Contract History (MCH)

The meter contract history (MCH) is the record of what the customer was billed. Include these fields:

| Field | Description |
|-------|-------------|
| Contract account | Billing account identifier |
| Billing start date | Start of the billing period |
| Billing end date | End of the billing period |
| Total consumption | Total energy used in the period |
| Usage value | Usage in billing units |
| Cost | Amount charged, in dollars |
| Tax amounts | Tax breakdown |
| Meter effective date | When the meter became active for this contract |

:::tip
Billing line items, with every charge broken out, work best. If you can't export them, the fields above are enough. You can usually drop about 25% of the columns in a typical billing export.
:::

#### Other data sets

| Data set | Description | Frequency |
|----------|-------------|-----------|
| **Invoice details** | Line items (taxes, fees, riders). BillSense AI uses them to attribute each charge. | Daily |
| **Payment plans** | Customers on payment arrangements or budget billing | Daily |
| **Account termination** | Closed accounts, so EnergyGrid can delete their data | Daily, or as needed |

:::note Solar billing
Solar billing varies a lot between utilities. EnergyGrid supports net metering today and handles other solar structures case by case.
:::

## Step 5: Billing cycle schedule

Billing cycles, also called the meter reading schedule or meter reading units (MRU), define the periods customers are billed for. The `billingCycleId` on each meter references this schedule.

Utilities stagger billing cycles to spread the processing load, often around 100,000 customers per cycle per day. A utility can have as few as 20 cycles or several thousand MRUs.

EnergyGrid needs the complete schedule to calculate the costs of each billing period.

### Example: cycle 1 schedule for 2025

| Cycle ID | Start date | End date |
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
Cycle IDs can be alphanumeric, depending on your system.
:::

## Step 6: Rate information (required for BillSense AI)

:::warning Required
Without rate information, BillSense AI can't calculate a bill. Projections won't match real bills, and customers call your support line to ask why.
:::

The `rateCode` on each meter tells EnergyGrid which billing calculator to use. Send every rate code you offer for **residential** customers.

### Meter rate codes

| Rate code | Description |
|-----------|----------------------|
| EFR_D1_8 | Residential Dynamic Peak Pricing, Exp. D1_8 |
| EFR_D1-A | Residential Time-of-Day Pilot I |
| EFR_D1-B | Residential Time-of-Day Pilot II |
| EFR_D1.11 | Residential Service Rate, Standard Time-of-Use D1.11 |
| EFR_D1.13 | Residential Service Rate, Overnight Savers |

### Supported rate types

EnergyGrid supports three ways to calculate rates. Fixed costs (service and facility fees, taxes, and non-taxable program charges) apply on top of any of them.

#### Time of use (TOU)

TOU rates need:

- A schedule of observed holidays (generally treated as off-peak)
- Peak intervals with start and end hours for each day type

**Example: summer TOU schedule**

| Name | Amount ($/kWh) | Start hour | End hour | Rate start date | Rate end date |
|------|---------------|------------|----------|----------------|--------------|
| Off-peak M-F | 0.0479 | 0 | 7 | 2025-06-01 | 2025-09-30 |
| Mid-Peak M-F | 0.0922 | 7 | 15 | 2025-06-01 | 2025-09-30 |
| On-peak M-F | 0.1660 | 15 | 19 | 2025-06-01 | 2025-09-30 |
| Off-Peak M-F | 0.0479 | 23 | 24 | 2025-06-01 | 2025-09-30 |
| Off-Peak Wknd/Holiday | 0.0479 | 0 | 24 | 2025-06-01 | 2025-09-30 |

EnergyGrid splits each day into intervals on a 24-hour clock. Weekends and holidays count as off-peak. The start and end dates define the summer period. Winter periods follow the same structure with different amounts, typically running from October 1 to May 31, then cycling back to summer rates.

Concurrent rates (delivery, energy waste reduction, distribution) can be rolled into the peak windows or evaluated separately.

#### Tiered

Tiered rates use a prorate factor for the daily Tier 1 allowance. For example, with a factor of 22.1918 kWh a day, a 30-day billing period has a Tier 1 limit of about 665.75 kWh. Usage above that limit is priced at Tier 2 for the rest of the period. Delivery, distribution, and other charges still apply.

#### Flat

One price per kWh for all usage.

## Step 7: Hardware binding (optional)

If your rollout includes the DataBridge Hub, the bind endpoint links the device to the customer's AMI meter over your wireless mesh radio.

**Endpoint:** `POST /powerbox/bind`

Binding uses a service account, not the customer's credentials. Each request carries a basic authentication header and, during the TLS 1.2 handshake, a client certificate for mutual TLS (mTLS) that EnergyGrid provides.

### Request payload

```json
{
  "hemProfileId": "a3f1c8d2-44bc-4e1a-b9f0-5c2e7d81a6b4",
  "macAddress": "70:B3:D5:4A:1C:9E",
  "installCode": "A1B2C3D4E5F6A7B8",
  "meterId": "123456789",
  "actionCode": 1
}
```

| Field | Description |
|-------|-------------|
| `hemProfileId` | EnergyGrid customer profile ID (GUID) |
| `macAddress` | MAC address on the DataBridge Hub label |
| `installCode` | Install code on the same label |
| `meterId` | Meter to bind, from customer sync |
| `actionCode` | `1` to bind, `0` to release the meter |

### Response

`200` with no body means the request was accepted. Pairing finishes afterward, usually within 15 minutes and at most 48 hours.

Binding isn't idempotent. A second bind for the same meter returns `400`:

```json
{
  "errorCode": "METER_ALREADY_BOUND",
  "message": "Meter 123456789 is already bound. Send actionCode 0 to release it first."
}
```

For the other error codes, see [Appendix A](#error-codes).

## Step 8: Data transport options

EnergyGrid can exchange bulk data in any of these ways:

| Method | Notes |
|--------|-------|
| **SFTP** | Standard method for MDM data |
| **FTP** | Legacy option |
| **Object-storage replication** | Bucket-to-bucket sync between your object store and EnergyGrid's |
| **API** | On-demand backfill or real-time feeds |
| **File exchange** | A generic file drop |

At the integration kickoff, agree on the method and on who hosts it, you or EnergyGrid.

## Appendix A: Error codes {#error-codes}

| HTTP status | Error code | Description |
|-------------|-----------|-------------|
| 401 | 1 | Invalid credentials. The customer does not have a utility account. |
| 401 | 2 | Invalid credentials. Two authentication attempts remaining. |
| 401 | 3 | Invalid credentials. One authentication attempt remaining. |
| 401 | 4 | Account is locked. The customer must contact the utility to remove the lock. |
| 401 | 86 | Account is closed, finaled, or no longer accessible. EnergyGrid might still have a record for it. |
| 503 | None | PowerBox API outage or maintenance. The response has no body. |

:::note
Error codes 2 to 4 apply only to existing utility customers.
:::

## Appendix B: Account status codes {#account-status-codes}

| Status code | Name | Description |
|-------------|------|-------------|
| A | Active | Active account |
| C | Charge off | Account charged off |
| D | Active service disconnect | Active account with service disconnected |
| F | Final | Final account billing complete |
| L | Closed | Closed account with unpaid final bill |
| N | New | Active new account |
| P | Pending | Pending account with a future open date |
| S | Sold | Sold receivables account |
| U | Final account funds due | Final account with unclaimed funds |
| X | Final account still billed | Final account still receiving charges |
| Z | Cancel | Cancelled account |
