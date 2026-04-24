---
id: data-dictionary
title: Data Dictionary
sidebar_label: Data Dictionary
---

# Data Dictionary

This document describes all data sources used across EnergyGrid utility partner integrations. Each section details the data types, their dependencies, and the databases or storage locations where they reside. Sections vary by integration based on the data sources available for each utility partner.

---

## Integration Type A

### Meter Data Management (MDM) Usage Data

**Requires:** Customer data

**All customers**

- **MDM RDS Instance** — Database: `mdmusage`
- **S3 MDM files:**
  - Electric
  - Gas

**Registered customers only**

- **Brainstem RDS Instance** — Database: `brainstem`
  - Read-only instance available
  - The `public.*_usage` tables, granularity hour and higher

---

### Payment Plan

**Requires:**

- Customer data
- Meter Contract History (MCH) billing data

**All customers**

- **CorePlatform RDS Instance** — Database: `EGCore_UDX` — Table: `dbo.PaymentPlans`
- S3 Payment Plan files

---

### Customer Data

**Registered customers**

- **CorePlatform RDS Instance** — Database: `EGCore_ATLS`
- **CorePlatform Central RDS Instance** — All databases on instance
- **Brainstem RDS Instance** — Database: `brainstem`
  - Read-only instance available
  - Tables:
    - `public.people`
    - `public.person_site_associations`
    - `public.sites`
    - `public.things`
    - `public.thing_properties`
    - `public.source_target_associations`

---

### BillSense AI Data

**Requires:**

- Customer data
- MDM usage data
- Billing data
- Disaggregation data
- Data warehouse data

**All customers**

- **MDM RDS Instance** — Database: `atls_bill_sense`
- S3 BillSense AI files

Additional BillSense AI storage locations (S3 staging buckets and intermediate processing tables) are documented separately in the BillSense AI integration runbook.

---

### Meter Contract History (MCH) Billing Data

**Requires:** Customer data

**All customers**

- **Brainstem RDS Instance** — Database: `brainstem`
  - Read-only instance available
  - Table: `data.meter_contract_history`
- S3 Meter Contract History files

---

### Disaggregation Data

**Requires:**

- Customer data
- MDM usage data

**All customers**

- **Brainstem RDS Instance** — Database: `brainstem`
  - Read-only instance available
  - Table: `data.ntg_daily_disaggregation_partitioned`

---

### DataBridge Hub and SmartLink Plug Minute Usage Data

**Requires:**

- Customer data
- DataBridge Hub or SmartLink Plug device

**Customers with a DataBridge Hub or SmartLink Plug only**

- **Brainstem RDS Instance** — Database: `brainstem`
  - Read-only instance available
  - The `public.*_usage` tables, granularity minute and higher
- **S3 files** — Includes:
  - Home Minute Usage
  - Device Minute Usage
  - AMR Gas Hour Usage
  - Heartbeats

---

### Powernet Minute Usage Data

**Requires:**

- Customer data
- DataBridge Hub or SmartLink Plug minute usage data

**Customers with a DataBridge Hub or SmartLink Plug only**

- **Brainstem RDS Instance** — Database: `brainstem`
  - Read-only instance available
  - The `public.*_usage` tables, granularity minute and higher

---

### Data Warehouse

- General-purpose data repository consolidating multiple data types from various sources
- Includes advisor and recommendation data

The Data Warehouse consolidates usage, billing, and disaggregation data. Schema details are maintained in the internal data engineering runbook.

---

### Data Required for the EnergyGrid App

- MDM Usage Data
- Customer Data
- DataBridge Hub / SmartLink Plug Minute Usage Data
- Powernet Minute Usage Data
- Data Warehouse Data

---

### Data Required for Bill Management

- MDM Usage Data
- Customer Data
- Meter Contract History (MCH) Billing Data
- Payment Plan Data
- BillSense AI Data
- Data Warehouse Data
- Disaggregation Data

---

## Integration Type B

### MDM Usage Data

**Requires:** Customer data

**Registered customers only**

- **MDM RDS Instance** — Database: `grcn_mdm_prod`
- **Brainstem RDS Instance** — Database: `brainstem`
  - Read-only instance available
  - The `public.*_usage` tables, granularity hour and higher
- S3 MDM usage data

---

### Customer Data

**Registered customers**

- **CorePlatform RDS Instance** — Database: `EGCore_GRCN`
- **CorePlatform Central RDS Instance** — All databases on instance
- **Brainstem RDS Instance** — Database: `brainstem`
  - Read-only instance available
  - Tables:
    - `public.people`
    - `public.person_site_associations`
    - `public.sites`
    - `public.things`
    - `public.thing_properties`
    - `public.source_target_associations`

---

### Disaggregation Data

**Requires:**

- Customer data
- MDM usage data

**Registered customers**

- **Brainstem RDS Instance** — Database: `brainstem`
  - Read-only instance available
  - Table: `data.ntg_daily_disaggregation_partitioned`

---

### DataBridge Hub and SmartLink Plug Minute Usage Data

**Requires:**

- Customer data
- DataBridge Hub or SmartLink Plug device
- Data warehouse data

**Customers with a DataBridge Hub or SmartLink Plug only**

- **Brainstem RDS Instance** — Database: `brainstem`
  - Read-only instance available
  - The `public.*_usage` tables, granularity minute and higher
- **S3 files** — Includes:
  - Home Minute Usage
  - Device Minute Usage
  - AMR Gas Hour Usage
  - Heartbeats

---

### Powernet Minute Usage Data

**Requires:**

- Customer data
- DataBridge Hub or SmartLink Plug minute usage data

**Customers with a DataBridge Hub or SmartLink Plug only**

- **Brainstem RDS Instance** — Database: `brainstem`
  - Read-only instance available
  - The `public.*_usage` tables, granularity minute and higher
- S3 files

---

### Data Warehouse

- General-purpose data repository consolidating multiple data types from various sources
- Includes advisor and recommendation data

The Data Warehouse consolidates usage, billing, and disaggregation data. Schema details are maintained in the internal data engineering runbook.

---

### Data Required for the EnergyGrid App

- MDM Usage Data
- Customer Data
- DataBridge Hub / SmartLink Plug Minute Usage Data
- Powernet Minute Usage Data
- Data Warehouse Data
- Disaggregation Data

---

## Integration Type C

### MDM Usage Data

**Requires:** Customer data

**All customers**

- S3 MDM files

**Registered customers**

- **Brainstem AWS RDS Instance** — Database: `brainstem_spec`
  - Read-only instance available
  - The `public.*_usage` tables, granularity hour and higher

---

### Customer Data

**Registered customers**

- **CorePlatform RDS Instance** — Database: `EGCore_SPEC`
- **CorePlatform Central RDS Instance** — All databases on instance
- **Brainstem AWS RDS Instance** — Database: `brainstem_spec`
  - Read-only instance available
  - Tables:
    - `public.people`
    - `public.person_site_associations`
    - `public.sites`
    - `public.things`
    - `public.thing_properties`
    - `public.source_target_associations`

---

### Disaggregation Data

**Requires:**

- Customer data
- MDM usage data

**All customers**

- **Brainstem AWS RDS Instance** — Database: `brainstem_spec`
  - Read-only instance available
  - Table: `data.ntg_daily_disaggregation_partitioned`

---

### Advisor Data

**Requires:**

- Customer data
- MDM usage data
- Additional data for certain advisor features (varies by card type)

**Registered customers**

- **Data Warehouse AWS RDS Instance** — Database: `datawarehouse_spec`
  - Read-only instance available
  - Schema: `coaching`
  - Tables:
    - `public.homecharacteristics`
    - `public.metrictypes`

Tables reside in the `public` schema. The `coaching` schema contains additional advisor configuration tables not listed here.

---

### Data Required for the External API

- MDM Usage Data
- Customer Data
- Disaggregation Data
- Advisor Data
