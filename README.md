# 🗃️ MnCLosSantos Mod Dump 2

[![FiveM](https://img.shields.io/badge/FiveM-Ready-green.svg)](https://fivem.net/)
[![QBCore](https://img.shields.io/badge/Framework-QBCore-blue.svg)](https://github.com/qbcore-framework)
[![Resources](https://img.shields.io/badge/Resources-28-brightgreen.svg)]()

<img width="1920" height="1080" alt="thumb42069" src="https://github.com/user-attachments/assets/38efbc34-bf00-4f68-85ef-1761eb5b5423" />

---

## 🌟 Overview

A collection of 28 completed, standalone FiveM scripts built for QBCore servers — covering drift/performance vehicle modding, HUDs and gauges, vehicle management and economy systems, job/business scripts, and roleplay interaction tools. Each resource lives in its own folder with its own README covering setup, configuration, and usage in detail.

---

## 📦 Resources

### 🏎️ Performance & Drift Mods

Mechanic-installable, tiered vehicle modification kits with install/remove minigames.

| Resource | Description |
|---|---|
| [mnc-2step](./mnc-2step) | JDM-style two-step/launch control system with rev-limiter bounce, rolling 2-step, and launch boost effects (sound + particle flames), installed via tiered mechanic items with database persistence. |
| [mnc-anglekit](./mnc-anglekit) | Lets mechanics install tiered steering-angle "drift lock" kits via a wheel-by-wheel install/remove minigame flow, with a Pro-tier `/angle` command for custom angle tuning. |
| [mnc-antilag](./mnc-antilag) | Automatic rally-style anti-lag exhaust backfire system that fires synced sound/flame pops based on RPM and throttle lift-off, installed via tiered mechanic items. |
| [mnc-diffs](./mnc-diffs) | Lets mechanics install welded or limited-slip differentials that dynamically alter rear-wheel traction handling based on RPM/gear, with a wheel-by-wheel install minigame and 3-hour wear-out timer. |
| [mnc-drivelines](./mnc-drivelines) | Lets mechanics convert a vehicle's drivetrain (FWD/RWD/AWD variants) via wheel-by-wheel install kits that alter torque bias and powered wheels, with anti-burnout exploit protection. |
| [mnc-hydros](./mnc-hydros) | Lets mechanics install street or competition hydraulic handbrake kits that boost handbrake force for drifting, mirroring mnc-diffs' install/tier/wear-out system. |

### 📊 HUD & Gauges

| Resource | Description |
|---|---|
| [mnc-boostgauge](./mnc-boostgauge) | Live on-screen NUI boost/PSI gauge for turbocharged vehicles with 40 visual styles, 20 bezels, and 20 presets, remap-aware via optional mnc-performanceparts integration. |
| [mnc-driftscore](./mnc-driftscore) | Live drift-scoring HUD that tracks angle/speed/proximity telemetry to award combo-multiplied points with 20+ named combos and 25 selectable NUI color themes. |
| [mnc-jobhud](./mnc-jobhud) | Persistent NUI HUD showing job, cash, bank, ID, time, and player count with 25 selectable color styles saved per-citizen. |
| [mnc-weaponUi-V2](./mnc-weaponUi-V2) | On-screen weapon/ammo HUD with 25 selectable, database-persisted visual skins. |

### 🚗 Vehicle Management & Economy

| Resource | Description |
|---|---|
| [mnc-customplate](./mnc-customplate) | Lets players apply a custom license plate to a nearby vehicle via a consumable item and NUI editor, with server-side duplicate-plate/validation checks plus an admin-only bypass command. |
| [mnc-insurance](./mnc-insurance) | Vehicle paperwork system covering insurance (with 3 competing companies and mod-tier pricing), registration, and inspection, each with its own NUI and database persistence. |
| [mnc-jacks](./mnc-jacks) | Physical car jack and axle stand system letting players lift and secure one side of a vehicle at a time using synced props and session-only (non-persisted) state. |
| [mnc-parking](./mnc-parking) | Lets players park owned vehicles anywhere outside restricted zones with full position/mod persistence, wheel locks, vehicle covers, and slot limits (with VIP overrides). |
| [mnc-rentals](./mnc-rentals) | NPC-staffed vehicle rental network with hourly pricing, temporary insurance/registration, and refund-on-return. |
| [mnc-seizecar-v2](./mnc-seizecar-v2) | Admin/police command suite for deleting or seizing player vehicles from the database by plate or player ID. |
| [mnc-transfervehicle](./mnc-transfervehicle) | Signed digital-document system for peer-to-peer vehicle ownership transfers with cash/gift payment handling. |
| [mnc-vehiclecatalog-v2](./mnc-vehiclecatalog-v2) | Browsable 1000+ vehicle dealership catalogue with admin price editing and dealership reassignment. |
| [mnc-vehiclemanager-v2](./mnc-vehiclemanager-v2) | Admin tool to inspect the current vehicle and save/patch entries into qb-core's `vehicles.lua`. |
| [mnc-vehiclespawner-v2](./mnc-vehiclespawner-v2) | Admin NUI vehicle spawner with full color/mod/plate customization and optional ownership registration. |

### 🛠️ Jobs, Businesses & Shops

| Resource | Description |
|---|---|
| [mnc-foodvans](./mnc-foodvans) | Full player-ownable food stall business (hotdog/burger/van/coffee stands) with crafting recipes, NPC customer sales, staff management, invoicing, and a shared safe. |
| [mnc-pricesheets](./mnc-pricesheets) | Location-based in-world NUI catalog/menu display system for businesses, with staff-managed discounts and special offers persisted to the database. |
| [mnc-shops](./mnc-shops) | 40+ zone NUI shop system (supermarkets, Ammunation, hardware, weed, etc.) with live per-zone stock and job/item-gated access. |

### 🎭 Roleplay & Interaction

| Resource | Description |
|---|---|
| [mnc-crutch](./mnc-crutch) | EMS roleplay tool letting ambulance-job players fit injured players with a temporary crutch or cane, applying a limp animation, attached prop, and optional movement/combat restrictions until the timer expires. |
| [mnc-dogends](./mnc-dogends) | Roleplay crafting script where players scavenge cigarette butts/lighters and roll their own cigarettes from butts or tobacco pouches plus filter packs. |
| [mnc-robnpc](./mnc-robnpc) | qb-target pedestrian mugging system with skill-check progress bar, randomized cash/item loot, and police GPS alerts. |
| [mnc-scrapnbins](./mnc-scrapnbins) | Searchable dumpster/scrap-wreck props with minigame skill checks, tiered loot, and a needle-prick injury hazard. |
| [mnc-vapes](./mnc-vapes) | Full vape roleplay system — puffing, battery/coil/tank management, and juice/vape/concentrate crafting stations. |

---

## 📋 Common Requirements

Most resources in this collection are built for **QBCore** and lean on a shared set of dependencies. Check each resource's own README for its exact list, but across the collection you'll generally need:

| Dependency | Used By |
|---|---|
| QBCore Framework | All resources |
| ox_lib | Most resources (menus, notifications, config) |
| oxmysql | Resources with database persistence (mod kits, parking, insurance, HUDs, etc.) |
| qb-target | Resources with world interaction points (crutch, shops, robnpc) |
| qb-inventory | Resources with craftable/consumable items (vapes, dogends) |

Many mod-kit resources (2step, anglekit, antilag, diffs, drivelines, hydros, customplate, parking, etc.) also ship an `install/items.txt` file listing the QBCore items to add.

---

## 🚀 Installation

```bash
# Clone the full collection
git clone https://github.com/MnCLosSantos/mod-dump-2.git
```

Copy the specific resource folder(s) you want into your server's resources directory, then add each one to `server.cfg`:

```lua
# server.cfg
ensure mnc-<resource-name>
```

Open each resource's own README for its specific database/items setup before starting it.

---

## 📝 Credits & License

**Author**: Stan Leigh (MnCLosSantos)
**Framework**: QBCore

All resources in this collection are open source. If you edit and redistribute any of them, please credit the original author.
