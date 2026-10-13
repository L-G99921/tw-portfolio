---
title: DataBridge installation guide
description: "Installation guide for the DataBridge Hub, covering physical setup, mobile app pairing via Bluetooth, Wi-Fi connection, and smart meter binding."
sidebar_label: DataBridge installation
sidebar_position: 1
tags: [databridge, installation]
---

# DataBridge installation guide

This guide shows you how to install the DataBridge Hub at home and connect it to your smart meter. It takes about 15 minutes, plus the time your utility takes to approve the connection.

:::info Which guide is this?
Each utility that offers the DataBridge Hub publishes its own version of this guide. This is the version for **Atlas Insight** customers. For Pacific Grid, see the [DataBridge Hub setup guide](./databridge-hub-setup-guide-pacific-grid).
:::

## Before you begin

Have these ready:

- **EnergyGrid app:** download it from the App Store or Google Play.
- **EnergyGrid account:** an active account linked to your service address.
- **A phone with Bluetooth:** iPhone or Android.
- **A 2.4 GHz Wi-Fi network:** the DataBridge Hub doesn't work with 5 GHz networks.
- **The power adapter:** check that the micro-USB adapter is in the box.

## Physical setup

1. **Power the device**

    Plug the adapter into the micro-USB port on the back of the DataBridge Hub, then into a wall outlet.

2. **Connect to the network**

    To use a cable, plug an Ethernet cable into the square port on the DataBridge Hub and connect the other end to your router. A cable gives the most stable connection, but it's optional. To use Wi-Fi instead, skip this step. The app connects the hub to Wi-Fi [later](#wi-fi-connection).

    :::tip
    If you change your mind, the app offers an Ethernet option during the Wi-Fi step.
    :::

3. **Check the status light**

    Wait for the light on the front of the device to turn solid green before you continue.

## Mobile app setup

With the hub powered on, use the EnergyGrid app to connect it to your account.

### Start setup

1. **Begin the installation**

    Open the EnergyGrid app and tap **Begin DataBridge Setup**. You can also find it under **My Devices**.

2. **Check the requirements**

    The first screen lists what you need before you continue. The app then guides you through each step.

### Pairing

1. **Scan for the device**

    Tap **Start Scanning**.

2. **Pair over Bluetooth**

    Hold the phone against the DataBridge Hub. The light turns blue when pairing starts.

### Wi-Fi connection

1. **Select the network**

    Choose your home Wi-Fi network from the list. If it appears twice, choose the 2.4 GHz one.

2. **Enter the password**

    Type the Wi-Fi password and tap **Continue**.

### Meter binding

:::caution Stay in range
Keep the DataBridge Hub within 30 feet (about 9 meters) of your smart meter until binding finishes. The hub has to stay reachable on the meter's home area network.
:::

1. **Request the bind**

    Tap **Request Bind**. Your utility receives the request and adds the hub to the meter's home area network (HAN), so it can read your usage directly from the meter.

2. **Wait for the connection**

    Binding usually finishes within 15 minutes. With a weak signal, it can take up to 48 hours. Keep the hub plugged in and close to the meter until then.

### Finish setup

1. **Confirm successful connection**

    When setup is complete, the **Successfully Connected** screen appears, and your usage starts showing in the app.

## Troubleshooting

| Problem | Cause | What to do |
|-------|-------|----------|
| The light doesn't turn solid green | The adapter isn't fully plugged in | Push the adapter firmly into the micro-USB port and the outlet, or try another outlet. If the light stays off or flashes red, contact EnergyGrid support. |
| The Bluetooth scan doesn't find the hub | Bluetooth is off, or the phone is too far away | Turn on Bluetooth and hold the phone a few inches from the hub. Restart the app and scan again. If the hub still doesn't appear, unplug it for 10 seconds and plug it back in. |
| Binding hasn't finished | The hub is too far from the meter, or the utility network is slow | Move the hub within 30 feet (about 9 meters) of the meter. Binding can take up to 48 hours. If it hasn't finished after 48 hours, tap **Request Bind** again, and contact EnergyGrid support if it still doesn't work. |
