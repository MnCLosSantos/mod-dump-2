# 📋 MNC Insurance

[![FiveM](https://img.shields.io/badge/FiveM-Ready-green.svg)](https://fivem.net/)
[![QBCore](https://img.shields.io/badge/Framework-QBCore-blue.svg)](https://github.com/qbcore-framework)
[![Version](https://img.shields.io/badge/Version-1.2.0-brightgreen.svg)]()

---

## 🌟 Overview

MNC Insurance is a full vehicle paperwork system covering **insurance**, **registration**, and **inspection**, each with its own NUI database screen, per-category pricing, and MySQL persistence. Prices scale by vehicle class and mod tier, insurance is sold through one of three competing companies with different premium rates, and players can check any nearby vehicle's document status without needing to be the owner.

---

## ✨ Key Features

**Insurance**
- Vehicle class-based base pricing (`categoryPrices`), from motorcycles at $750 up to open-wheel/planes at $5,750–$8,500
- Mod tier surcharge (1–5, $0–$1,000) representing how heavily modified the vehicle is
- Three insurance companies with different premium multipliers: **MNC** (10%), **LSIC** (15%), **MAZE** (20%) — emergency-class vehicles are automatically insured through **LosSantosGov** instead
- Optional business coverage add-on (flat $1,450 fee) plus fixed processing fee, base fee, and tax baked into the total
- Expiration tracking — the system detects expired policies and treats them differently from active ones when recalculating cost
- Background timer periodically checks nearby vehicles and notifies the player of their insurance/registration/inspection status

**Registration & Inspection**
- Separate flat-fee registration ($250) and inspection ($350) systems, each with their own database table and check/apply NUI screens

**Money Handling**
- All purchases (insurance, registration, inspection) are deducted from the player's **bank** account via `Player.Functions.RemoveMoney`

---

## 📋 Requirements

| Dependency | Required |
|---|---|
| qb-core | Yes |
| ox_lib | Yes |
| oxmysql | Yes (used via `exports.oxmysql`, not listed in fxmanifest `dependencies{}` but required for the resource to function) |

---

## 🚀 Installation

```bash
# Place into your resources folder
[server-data]/resources/[custom]/mnc-insurance/
```

```lua
# server.cfg
ensure mnc-insurance
```

No manual SQL import is required — `insured_vehicles`, `registered_vehicles`, and `inspected_vehicles` tables are created automatically on resource start via `exports.oxmysql:execute(... CREATE TABLE IF NOT EXISTS ...)`. (`install/create_tables.sql` and `install/manualEntry/create_tables.txt` are provided as reference/manual-import copies of the same schema if you prefer to run them yourself.)

---

## ⚙️ Configuration Guide

```lua
-- config.lua
Config.DateFormat = 'USA'
```

Configuration is minimal — only the date display format is exposed in `config.lua`. Pricing tables (`categoryPrices`, `modTierPrices`, `insuranceCompanyPremiums`, and flat fees like `businessFee`, `registrationFee`, `inspectionFee`) are defined directly in `server.lua` and can be edited there.

---

## 🎮 Controls & Usage

- **`/insurance`**: Opens the insurance purchase screen for the vehicle you're currently driving.
- **`/checkinsurance`**: Checks the insurance status of the nearest vehicle within 10m (no need to be inside it).
- **`/registration`**: Opens the registration purchase screen for your current vehicle.
- **`/checkregistration`**: Checks the registration status of the nearest vehicle within 10m.
- **`/inspection`**: Opens the inspection screen for your current vehicle.
- **`/checkinspection`**: Checks inspection status of the nearest vehicle within 10m.
- **`/checkvehdocs`**: Combined document lookup for a vehicle.

---

## 🔧 Troubleshooting

- **Commands do nothing on a fresh join**: The client waits up to 10 seconds for `QBCore` to initialize before commands function — if it still fails, check the console for the "[mnc-insurance] Failed to initialize QBCore" message.
- **"No vehicle within 10 meters"**: The check commands require a vehicle within 10m; get closer or use the non-check command while seated in the vehicle instead.
- **Pricing looks wrong for a vehicle class**: Confirm the vehicle's GTA vehicle class maps to an entry in `categoryPrices` (server.lua) — unmapped classes default to the "compacts" rate.
- **Emergency vehicles insured under the wrong company**: This is expected — emergency-class vehicles are hardcoded to `LosSantosGov` insurance regardless of the company selected in the UI.

---

## 📝 Credits & License

**Author**: Stan Leigh
**Version**: 1.2.0
**Framework**: QBCore

Distributed as part of the MnCLosSantos mod-dump collection — open source, please credit the original author if you edit and re-release.
