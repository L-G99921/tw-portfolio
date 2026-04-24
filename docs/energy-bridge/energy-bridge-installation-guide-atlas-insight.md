---
title: DataBridge Installation Guide
description: "Installation guide for the DataBridge Hub, covering physical setup, mobile app pairing via Bluetooth, Wi-Fi connection, and smart meter binding."
sidebar_label: DataBridge Installation
sidebar_position: 1
tags: [energy-bridge, installation]
---

# DataBridge Installation Guide

## Before You Begin

Gather the following before starting the installation:

- **EnergyGrid App** — Download from the App Store or Google Play.
- **EnergyGrid account** — An active account linked to your service address.
- **Compatible smartphone** — iPhone or Android device with Bluetooth enabled.
- **2.4 GHz Wi-Fi network** — The DataBridge Hub does not support 5 GHz networks.
- **Power adapter** — Confirm the MicroUSB power adapter is included in the box.

## Physical Setup

1. **Power the Device**

    Plug the power adapter into the MicroUSB port on the back of the DataBridge Hub, then plug the adapter into a wall outlet.

2. **Connect to the Network**

    Plug an Ethernet cable into the square port on the DataBridge Hub and connect the other end to your router. Ethernet provides a stable connection and is recommended, but it's optional. If you prefer a wireless connection, skip this step and follow the [Wi-Fi Connection](#wi-fi-connection) instructions instead.

    :::tip
    You can select the Ethernet option during the Wi-Fi setup step in the app if you decide to use a wired connection at any point.
    :::

3. **Check the Status Light**

    Watch the LED on the front of the device. Wait for it to turn solid green before continuing.

## Mobile App Setup

Power on the hardware first. Then use the EnergyGrid App to connect the DataBridge Hub to your account.

### Start Setup

1. **Begin the Installation**

    Open the EnergyGrid App and tap **Begin DataBridge Setup**. This option is also available under **My Devices**.

2. **Follow On-Screen Instructions**

    The app guides you through each step. The setup screen confirms which requirements must be met before you can proceed.

### Pairing

1. **Scan for the Device**

    Tap **Start Scanning**.

2. **Connect via Bluetooth**

    Hold the phone against the DataBridge Hub. The LED turns blue when pairing begins.

### Wi-Fi Connection

1. **Select the Network**

    Choose your home Wi-Fi network from the list. Select the 2.4 GHz network.

2. **Enter the Password**

    Type the Wi-Fi password and tap **Continue**.

### Meter Binding

1. **Request the Bind**

    Tap **Request Bind**. This sends a request through the meter network. The DataBridge Hub joins the Home Area Network (HAN) and receives real-time usage data directly from your smart meter.

2. **Wait for the Connection**

    Binding typically completes within 15 minutes, but may take up to 48 hours depending on network conditions. Keep the DataBridge Hub within 25 feet of your smart meter during this process.

### Finish Setup

1. **Confirm Successful Connection**

    The **Successfully Connected** screen appears when setup is complete. Real-time energy data begins flowing into the app.

## Troubleshooting

| Issue | Cause | Solution |
|-------|-------|----------|
| LED does not turn solid green | Power adapter not fully seated | Verify the adapter is fully inserted into both the MicroUSB port and the wall outlet. Try a different outlet. Contact EnergyGrid support if the LED remains off or flashes red. |
| Bluetooth scan finds no device | Bluetooth disabled or phone too far away | Enable Bluetooth on your phone and hold the phone within a few inches of the DataBridge Hub. Restart the app and scan again. If the device still does not appear, power-cycle the DataBridge Hub by unplugging it for 10 seconds. |
| Meter binding does not complete | Device out of range or network delay | Confirm the DataBridge Hub is within 25 feet of your smart meter. Binding may take up to 15 minutes depending on the utility network. If it does not complete after 15 minutes, tap **Request Bind** again. Contact EnergyGrid support if the issue persists. |
