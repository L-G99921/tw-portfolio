---
id: data-dictionary
title: Data dictionary
description: "Where each EnergyGrid data set lives, what it depends on, and which customers it covers, for each type of utility integration."
sidebar_label: Data dictionary
tags: [reference, data, energygrid]
---

# Data dictionary

This reference lists the data sets behind EnergyGrid integrations: what each one depends on, which customers it covers, and where it's stored. Utilities integrate in one of three ways, depending on the data they can provide, so each integration type has its own table.

## How to read the tables

- **Depends on** lists the data sets that have to load first.
- **Customers** says whose data is stored: all of the utility's customers, only customers registered in the EnergyGrid app, or only customers with a DataBridge Hub or SmartLink Plug.
- **Where it lives** gives the database instance, then the database, schema, or table. "Read replica" means a read-only copy of the instance is available for queries.
- `public.*_usage` means every table in the `public` schema whose name ends in `_usage`.

## Integration type A

| Data set | Depends on | Customers | Where it lives |
|---|---|---|---|
| MDM usage data | Customer data | All | **MDM RDS:** `mdmusage`. **Object storage:** electric and gas MDM files. |
| MDM usage data (app copy) | Customer data | Registered | **Brainstem RDS** (read replica): `brainstem`, tables `public.*_usage`, hourly and coarser |
| Payment plans | Customer data, MCH billing data | All | **CorePlatform RDS:** `EGCore_UDX`, table `dbo.PaymentPlans`. **Object storage:** payment plan files. |
| Customer data | None | Registered | **CorePlatform RDS:** `EGCore_ATLS`. **CorePlatform Central RDS:** every database on the instance. **Brainstem RDS** (read replica): `brainstem`, tables listed in [Customer tables](#customer-tables). |
| BillSense AI data | Customer, MDM usage, billing, disaggregation, and data warehouse data | All | **MDM RDS:** `atls_bill_sense`. **Object storage:** BillSense AI files. Staging buckets and intermediate tables are in the BillSense AI integration runbook. |
| Meter contract history (MCH) billing data | Customer data | All | **Brainstem RDS** (read replica): `brainstem`, table `data.meter_contract_history`. **Object storage:** MCH files. |
| Disaggregation data | Customer data, MDM usage data | All | **Brainstem RDS** (read replica): `brainstem`, table `data.ntg_daily_disaggregation_partitioned` |
| Device minute usage | Customer data, a DataBridge Hub or SmartLink Plug | With a device | **Brainstem RDS** (read replica): `brainstem`, tables `public.*_usage`, per minute and coarser. **Object storage:** home minute usage, device minute usage, AMR gas hourly usage, and heartbeats. |
| Powernet minute usage | Customer data, device minute usage | With a device | **Brainstem RDS** (read replica): `brainstem`, tables `public.*_usage`, per minute and coarser |
| Data warehouse | Usage, billing, and disaggregation data | Varies by data set | Combines several data sets, including advisor and recommendation data. The schema is in the data engineering runbook. |

**What each feature needs:**

- **EnergyGrid app:** MDM usage, customer data, device minute usage, Powernet minute usage, and the data warehouse.
- **Bill management:** MDM usage, customer data, MCH billing, payment plans, BillSense AI data, the data warehouse, and disaggregation data.

## Integration type B

| Data set | Depends on | Customers | Where it lives |
|---|---|---|---|
| MDM usage data | Customer data | Registered | **MDM RDS:** `grcn_mdm_prod`. **Brainstem RDS** (read replica): `brainstem`, tables `public.*_usage`, hourly and coarser. **Object storage:** MDM usage files. |
| Customer data | None | Registered | **CorePlatform RDS:** `EGCore_GRCN`. **CorePlatform Central RDS:** every database on the instance. **Brainstem RDS** (read replica): `brainstem`, tables listed in [Customer tables](#customer-tables). |
| Disaggregation data | Customer data, MDM usage data | Registered | **Brainstem RDS** (read replica): `brainstem`, table `data.ntg_daily_disaggregation_partitioned` |
| Device minute usage | Customer data, a device, data warehouse data | With a device | **Brainstem RDS** (read replica): `brainstem`, tables `public.*_usage`, per minute and coarser. **Object storage:** home minute usage, device minute usage, AMR gas hourly usage, and heartbeats. |
| Powernet minute usage | Customer data, device minute usage | With a device | **Brainstem RDS** (read replica): `brainstem`, tables `public.*_usage`, per minute and coarser. **Object storage:** Powernet files. |
| Data warehouse | Usage, billing, and disaggregation data | Varies by data set | Combines several data sets, including advisor and recommendation data. The schema is in the data engineering runbook. |

**What each feature needs:**

- **EnergyGrid app:** MDM usage, customer data, device minute usage, Powernet minute usage, the data warehouse, and disaggregation data.

## Integration type C

| Data set | Depends on | Customers | Where it lives |
|---|---|---|---|
| MDM usage data | Customer data | All | **Object storage:** MDM files |
| MDM usage data (app copy) | Customer data | Registered | **Brainstem RDS** (read replica): `brainstem_spec`, tables `public.*_usage`, hourly and coarser |
| Customer data | None | Registered | **CorePlatform RDS:** `EGCore_SPEC`. **CorePlatform Central RDS:** every database on the instance. **Brainstem RDS** (read replica): `brainstem_spec`, tables listed in [Customer tables](#customer-tables). |
| Disaggregation data | Customer data, MDM usage data | All | **Brainstem RDS** (read replica): `brainstem_spec`, table `data.ntg_daily_disaggregation_partitioned` |
| Advisor data | Customer data, MDM usage data, and more for some advisor cards | Registered | **Data warehouse RDS** (read replica): `datawarehouse_spec`, tables `public.homecharacteristics` and `public.metrictypes`. Advisor settings are in the `coaching` schema of the same database. |

**What each feature needs:**

- **External API:** MDM usage, customer data, disaggregation data, and advisor data.

## Customer tables

In every integration type, customer data in Brainstem is spread across these tables:

| Table | Holds |
|---|---|
| `public.people` | Customers |
| `public.sites` | Service addresses (premises) |
| `public.person_site_associations` | Which customers belong to which premises |
| `public.things` | Meters and devices |
| `public.thing_properties` | Settings and attributes of each meter or device |
| `public.source_target_associations` | Links between meters and devices, such as a hub bound to a meter |
