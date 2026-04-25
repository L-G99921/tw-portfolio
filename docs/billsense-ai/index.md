---
title: User guide
description: "Step-by-step guide for using BillSense AI to analyze energy bills, review usage patterns, and manage customer profiles."
sidebar_label: User guide
sidebar_position: 3
tags: [billsense-ai, user-guide]
---

# BillSense AI user guide

Use this guide if you are a utility customer service representative or support agent assisting customers with billing inquiries. It covers the main features and workflows in BillSense AI.

## Insights Dashboard

The Insights dashboard displays the current billing period summary and identifies the factors that affected the bill.

### View the Bill Summary

1. **Check the Total Amount**

    The bill total appears at the top of the dashboard with the billing period dates.

2. **Review the Comparisons**

    Green arrows indicate a decrease. The display shows percentage and dollar changes compared to the previous month and the same month last year.

3. **Read Quick Usage Insights**

    The panel on the right highlights the largest bill changes and compares the customer's usage against similar homes in the same ZIP code.

### Understand Bill Changes

The **Top Factors That Changed** section explains what caused the bill to increase or decrease.

#### How Your Usage Changed

This panel shows factors the customer can control:

| Category | Description |
|----------|-------------|
| Always On | Devices drawing power continuously in standby mode |
| Heating and Cooling | HVAC system energy consumption |
| Kitchen | Cooking appliances and kitchen equipment |
| All Other Contributors | Aggregated smaller usage categories |

#### Beyond Your Control

This panel shows external factors:

| Factor | Description |
|--------|-------------|
| Fixed Charges | Base charges and service fees |
| Bill Length Difference | Impact of varying billing cycle lengths |
| Warmer/Colder Weather | Temperature-related usage adjustments |

### Review the Energy Health Report

The Energy Health Report assesses the customer's energy performance across categories.

1. **Identify Top Contributors**

    Each category shows the customer's cost and a performance indicator.

2. **Interpret the Status**

    | Status | Meaning |
    |--------|---------|
    | Doing Well | Performance is better than average |
    | Caution | Performance needs attention |
    | Room to Improve | Significant improvement opportunity exists |
    | Normal Range | Performance is within expected parameters |

3. **Check Peak Usage**

    The panel shows usage split between on-peak and off-peak hours. Peak windows vary by utility.

### Present Recommendations

The **Top Recommendations** section displays personalized savings opportunities.

1. **Review Each Card**

    Each recommendation card shows potential savings, the suggested action, and an explanation.

2. **Explain the Savings**

    Use the dollar amount shown to quantify the benefit for the customer.

3. **Note Dismissed Cards**

    Click **See Dismissed Cards** to view recommendations the customer previously dismissed.

:::tip
Focus on recommendations with the highest potential savings first. Common high-impact recommendations include sealing ductwork, scheduling electric vehicle (EV) charging during off-peak hours, and replacing HVAC filters.
:::

## Usage Section

The Usage section provides detailed breakdowns of energy consumption by category and time.

### View Usage by Category

1. **Select the Billing Period**

    Use the dropdown menu to select the month.

2. **Toggle the View**

    Click **$** for dollar amounts or the energy icon for kWh values.

3. **Review the Breakdown**

    The left panel shows categories as percentages of the total bill.

| Category | Typical Range | Description |
|----------|---------------|-------------|
| Always On | 25–35% | Devices drawing power continuously in standby mode |
| Heating and Cooling | 20–35% | HVAC system operations |
| Everything Else | 20–25% | Miscellaneous electrical usage |
| EV | Varies | Electric vehicle charging |
| Kitchen | 2–5% | Cooking and food storage |
| Laundry | 2–3% | Washer and dryer |

### Analyze Daily Usage

1. **Review the Bar Chart**

    Light blue bars show off-peak usage. Dark blue bars show on-peak usage.

2. **Check the Temperature Overlay**

    The red line shows the correlation between daily temperature and usage.

3. **Identify Outlier Days**

    Yellow stars mark days with unusual consumption patterns.

4. **View the Total Breakdown**

    The bottom panel shows the cost split between peak periods. On-peak hours carry higher rates, while off-peak hours carry lower rates. Specific rate values and time windows vary by utility.

:::note
Usage shown does not include program fees, taxes, supplemental meters, or voluntary programs.
:::

## History Section

The History section displays billing data organized by year.

### Navigate Bill History

1. **View the Timeline**

    The bar chart at the top shows monthly bills over time. The current period is highlighted.

2. **Expand a Year**

    Click a year row to view individual billing periods.

3. **Review Bill Details**

    Each row shows the month, billing dates, duration, amount, and payment status.

4. **Access Bill Actions**

    Click the three-dot menu for additional options.

### Compare Annual Totals

| Year | Purpose |
|------|---------|
| Current year | Shows the year-to-date total |
| Previous years | Shows complete annual totals for trend analysis |

## My Home Section

The My Home section stores the customer's appliance information. Accurate appliance data improves recommendation quality.

### Update Appliance Details

1. **Open My Home**

    Click **My Home** in the left sidebar.

2. **Review Each Category**

    Scroll through the Heating and Cooling, Cooking, and Green Energy sections.

3. **Verify Selections**

    Confirm that the selections match the customer's actual appliances.

4. **Save Changes**

    Changes save automatically when selections are modified.

### Heating and cooling options

| Option | Description |
|--------|-------------|
| Electric Furnace | Electric-powered forced air heating |
| Oil/Natural Gas Furnace | Combustion-based forced air heating |
| Electric Baseboard | Electric resistance heating |
| Central or Ductless Heat Pump | Heat pump system |
| Hybrid/Dual-Fuel System | Combined heat pump and furnace |

### Electric vehicle configuration

1. **Indicate EV Ownership**

    Check the **Electric Vehicle** box if the customer owns an EV.

2. **Set the Quantity**

    Use the plus and minus buttons to set the number of EVs.

3. **Select Charger Type**

    Choose from Level 1 (110V), Level 2 (220V), Both, or "I don't charge at home."

:::caution
EV charger type affects scheduled charging recommendations. Verify this setting if the customer reports inaccurate EV-related suggestions.
:::

## My Plan Section

The My Plan section displays the customer's current rate plan and available alternatives.

### Review the Current Plan

1. **Check the Plan Name**

    The current plan appears at the top with the rate type code.

2. **Note the Estimated Cost**

    The estimated cost under the current plan appears on the right.

3. **Read the Description**

    The summary explains the plan's on-peak and off-peak windows.

### Compare Available Plans

1. **Scroll to All Available Plans**

    Plans the customer qualifies for appear below the current plan.

2. **Review Each Option**

    Each plan shows the rate type, description, and estimated savings.

3. **Check Eligibility**

    A warning message appears if the customer has an active agreement that prevents switching.

Available rate plans vary by utility. Common plan types include:

| Plan Type | Best For |
|-----------|----------|
| Time of Use (TOU) | Customers who can shift usage to off-peak hours |
| Flat Rate | Customers with consistent usage throughout the day |
| Tiered Rate | Customers with lower overall consumption |
| EV-Specific Plans | EV owners who charge overnight |

:::warning
Customers in a 12-month agreement cannot switch plans until the agreement expires. The expiration date appears in the plan card.
:::

## Conduct a billing inquiry

Use this workflow to lead a customer through a billing question with BillSense AI. Each step uses one of the sections covered above.

### Start the conversation

1. **Begin with Insights**

    Open the Insights dashboard first to understand the full billing picture.

2. **Acknowledge changes**

    Note whether the bill increased or decreased compared to previous periods.

3. **Identify key factors**

    Point out the top contributors to bill changes.

### Explain usage patterns

1. **Use the charts**

    Charts help explain complex usage patterns in a clear, visual format.

2. **Highlight peak times**

    Explain the cost difference between on-peak and off-peak usage.

3. **Show category breakdown**

    Use category percentages to illustrate where the customer's energy goes.

### Present savings opportunities

1. **Quantify the benefit**

    Use the dollar amounts shown on recommendation cards.

2. **Prioritize high-impact items**

    Focus on recommendations with the largest potential savings.

3. **Connect to usage data**

    Reference specific categories when explaining why a recommendation applies.
