# 🛒 MnC Shops

[![FiveM](https://img.shields.io/badge/FiveM-Ready-green.svg)](https://fivem.net/)
[![QBCore](https://img.shields.io/badge/Framework-QBCore-blue.svg)](https://github.com/qbcore-framework)
[![Version](https://img.shields.io/badge/Version-1.3.0-brightgreen.svg)]()

---

## 🌟 Overview

MnC Shops is a full NUI-based shop system covering dozens of vendor types across the map — 24/7 supermarkets, Ammunation, a construction supply store, hardware/electronics shops, a liquor store, weed/vape shops, a leisure/gear shop, and more. Each shop location has its own animated clerk ped, category-filtered item catalogue, live per-zone stock tracking, and a themeable NUI storefront.

---

## ✨ Key Features

**Shop Zones**
- 40+ configured zones (`Config.Zones`), each with coordinates, interaction radius, UI theme, title, item categories, an animated clerk ped, and an optional map blip
- Interaction via proximity `[E]` keypress or `qb-target` (`Config.UseTarget` toggle)
- Zones can be job-restricted (`staffJobs`) or require a specific item to access (`requiredItem`) — e.g. the Ammunation-style shops require `weaponlicense`
- `useAnywhere` zones instead register a chat command (`<zonename>_shop`) so a shop can be opened without a physical location

**Catalogue & Purchasing**
- Items are grouped by category (food, drinks, weapons, ammo, weed, vapes, construction props, leisure gear, bikes, boards, prison canteen items, etc.) defined in `Config.Products`
- Single-item purchase and multi-item cart checkout, both paid via cash or bank
- Live stock tracking per zone: each zone independently tracks remaining stock per item, decremented on purchase and restored automatically if a purchase fails (insufficient funds, inventory full, etc.)
- All shops restock to their configured starting amounts automatically on resource start
- Compatible with both `qb-inventory` and `ox_inventory`, including weight/slot-based carry checks for qb-inventory

**5 selectable NUI color themes** (`style1`-`style5`) assignable per zone

---

## 📋 Requirements

| Dependency | Required |
|---|---|
| qb-core | Yes |
| ox_lib | Yes |
| qb-target | Only if `Config.UseTarget = true` |
| qb-inventory or ox_inventory | Yes (auto-detected at runtime) |

---

## 🚀 Installation

```bash
# Place into your resources folder
[server-data]/resources/[custom]/mnc-shops/
```

```lua
# server.cfg
ensure mnc-shops
```

No database tables are required — stock is tracked in-memory server-side and resets on restart. Make sure every item referenced across `Config.Products` categories (food, drinks, weapons, weedshop, gearshop, construction props, etc.) exists in your inventory's shared items.

---

## ⚙️ Configuration Guide

```lua
Config.UseTarget = false -- true = qb-target, false = keypress [E]
Config.Debug = false

Config.Zones = {
    {
        name = 'food',
        coords = vector3(24.47, -1346.62, 29.5),
        radius = 1.5,
        uiStyle = 'style1',
        title = '24/7 Supermarket',
        categories = {'food', 'drinks', 'beer', 'snacks', 'misc'},
        ped = { model = 's_m_m_cntrybar_01', coords = vector4(...), animationSet = {...} },
        blip = { enabled = true, sprite = 52, color = 2, scale = 0.6, name = '24/7 Supermarket' },
    },
    -- ... 40+ more zones
}
```

Ammunation-style zones add a `requiredItem` gate:

```lua
{
    -- ...
    requiredItem = 'weaponlicense',
}
```

---

## 🎮 Controls & Usage

- **[E]** near a shop's clerk (when `Config.UseTarget = false`) — open the shop UI
- **qb-target interaction** (when `Config.UseTarget = true`) — "Open <shop name>" option on the clerk/zone
- **`/<zonename>_shop`** — for any zone with `useAnywhere = true`, opens that shop's catalogue from anywhere

---

## 🔧 Troubleshooting

- **Shop UI doesn't open** — check whether `Config.UseTarget` is set correctly for your setup; proximity keypress and qb-target logic are mutually exclusive per the client code.
- **"Access Denied" at a restricted shop** — the zone has `staffJobs` and/or `requiredItem` set; the player needs a matching job or the required item in inventory.
- **Stock resets unexpectedly** — stock is entirely in-memory and reinitializes to `Config.Products` amounts on every resource restart; there is no database persistence.
- **Item purchased but no notification** — some purchase paths only trigger the `inventory:client:ItemBox` popup for `qb-inventory`; check which inventory resource is actually running.

---

## 📝 Credits & License

**Author**: Stan Leigh
**Version**: 1.3.0
**Framework**: QBCore

Distributed as part of the MnCLosSantos mod-dump collection — open source, please credit the original author if you edit and re-release.
