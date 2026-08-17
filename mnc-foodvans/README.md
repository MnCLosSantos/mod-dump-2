# 🌭 MNC Food Vans

[![FiveM](https://img.shields.io/badge/FiveM-Ready-green.svg)](https://fivem.net/)
[![QBCore](https://img.shields.io/badge/Framework-QBCore-blue.svg)](https://github.com/qbcore-framework)
[![Version](https://img.shields.io/badge/Version-1.3.6-brightgreen.svg)]()

---

## 🌟 Overview

MNC Food Vans is a full player-ownable food business system built around hotdog stands, burger stands, food vans, and a coffee cart placed at 16 preset locations across the map. Players can purchase a stall, craft menu items from ingredient recipes, order more stock, sell to wandering NPC customers, manage a staff/authorised list, run a shared safe, and invoice other players — all backed by a MySQL-persisted ownership system.

---

## ✨ Key Features

**Ownership & Locations**
- 16 preconfigured stall locations (5 hotdog stands, 5 burger stands, 5 food vans, 1 coffee cart), each with its own prop model, coordinates, and purchase price
- Purchasing a stall spawns its prop, creates a `qb-target` interaction zone and map blip, and records ownership (citizenid) in the database
- Owners can add/remove other players as **authorised staff** via citizen ID, and can sell the location back

**Crafting & Recipes**
- Each stall type (`prop_hotdogstand_01`, `prop_burgerstand_01`, `prop_food_van_02`, `p_ld_coffee_vend_s`) has its own recipe list — 20+ menu items total, each requiring specific raw ingredients (buns, patties, cheese, coffee beans, syrups, etc.)
- Crafting runs a timed progress bar (`Config.CraftDuration`, 6s) and consumes ingredients from the van's linked stash
- Raw ingredients can be restocked through an in-game order menu at set prices (`Config.OrderableIngredients`)

**NPC Customer Sales**
- While a stall is open, nearby NPC pedestrians periodically spawn, walk up, place an order from the stall's stock, and pay — automatically deducting sold items and crediting the owner (minus a cut into the shared safe)
- Stalls auto-close if the owner/staff move too far away (`Config.StallCloseRadius`, checked every `Config.StallCloseCheckInterval`)

**Money & Staff Management**
- **Safe balance** system: a portion of each sale is banked into the stall's safe, withdrawable by the owner
- **Invoice system**: staff can request payment from other players at the stand, up to `Config.MaxPayment`, which the target must confirm/deny
- Management menu lists authorised staff and lets the owner add/remove them by citizen ID

**Admin Tools**
- Admin-only reset (`Config.AdminGroups`) clears a stall's ownership back to unpurchased

---

## 📋 Requirements

| Dependency | Required |
|---|---|
| qb-core | Yes |
| qb-target | Yes |
| ox_lib | Yes |
| oxmysql | Yes |

---

## 🚀 Installation

```bash
# Place into your resources folder
[server-data]/resources/[custom]/mnc-foodvans/
```

```lua
# server.cfg
ensure mnc-foodvans
```

Add the ~40 ingredient/menu items listed in `install/items.txt` to your item system. Per `install/readme.txt`, these consumable food/drink items should be added via `qb-smallresources`, `jim-consumables`, or a similar eat/drink handler (not plain `qb-core` items) so they have usable eat/drink effects. The `mnc_foodvans` table (stall ownership, open state, staff list, safe balance) is created automatically on resource start via `CREATE TABLE IF NOT EXISTS`, with an automatic `ALTER TABLE` for `safe_balance` on upgrade from older versions.

---

## ⚙️ Configuration Guide

```lua
Config.PaymentAccount = 'cash'
Config.BuyRange = 3.0
Config.CraftDuration = 6000
Config.AdminGroups = { 'admin', 'god', 'superadmin' }
Config.StashSlots = 50
Config.StashMaxWeight = 100000
Config.MaxPayment = 500

Config.VanLocations = {
    { id = 1, label = 'Rockford Hot Dogs', prop = 'prop_hotdogstand_01',
      coords = vector4(107.96, -198.66, 54.8, 180.02), price = 25000 },
    -- ... 15 more locations
}
```

`Config.VanLocations` defines each purchasable stall's position, prop, and price. `Config.PropRecipes` (keyed by prop model) defines every craftable menu item and its ingredient costs, while `Config.CustomerSalePrices` sets what NPCs pay for each finished item.

---

## 🎮 Controls & Usage

- **qb-target interaction**: All stall actions — purchase, open/close for business, craft, access stash, order ingredients, manage staff, request payment — are accessed by targeting the stall prop.
- No chat commands or keybinds are used; the entire flow is target/menu-driven.

---

## 🔧 Troubleshooting

- **Food items don't restore hunger/thirst**: The items in `install/items.txt` need eat/drink effects added through `qb-smallresources`, `jim-consumables`, or equivalent — this script only handles crafting/selling, not consumption effects.
- **Stall closes on its own**: Stalls auto-close if no owner/authorised staff remain within `Config.StallCloseRadius` of the location; this is checked every `Config.StallCloseCheckInterval` (15s).
- **NPC customers not spawning**: Confirm the stall is marked "open" and that players are within `Config.CustomerSpawnRadius` of the stall — NPCs only spawn near an active, open location.
- **Old server upgrading and missing safe_balance errors**: The script automatically runs an `ALTER TABLE ... ADD COLUMN IF NOT EXISTS safe_balance` on startup, so simply restarting the resource against an older table should self-heal.

---

## 📝 Credits & License

**Author**: Stan Leigh
**Version**: 1.3.6
**Framework**: QBCore

Distributed as part of the MnCLosSantos mod-dump collection — open source, please credit the original author if you edit and re-release.
