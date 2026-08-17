# 🏷️ MNC Price Sheets

[![FiveM](https://img.shields.io/badge/FiveM-Ready-green.svg)](https://fivem.net/)
[![QBCore](https://img.shields.io/badge/Framework-QBCore-blue.svg)](https://github.com/qbcore-framework)
[![Version](https://img.shields.io/badge/Version-1.0.0-brightgreen.svg)]()

---

## 🌟 Overview

MNC Price Sheets is a configurable, in-world catalog/menu display system for businesses — an NUI "price sheet" that opens when a player walks up to a configured location, showing categorized items with images and prices, plus rotating special offers. It ships pre-configured for an Auto Exotics parts & services shop (13 categories, 90+ items) with commented-out examples for a burger joint, police armory, hospital pharmacy, and 24/7 store. Authorized staff can apply per-item discounts or create limited-time special offers directly from the UI, persisted to the database.

---

## ✨ Key Features

**Location-Based Catalog Display**
- Each price sheet has a world location, theme color, optional map blip, and an optional job restriction (`jobs = {}` for public access, or a list of job names)
- Approaching within 5m draws a marker and, within 2m, shows a `[E] - View <name>` prompt (styled per the sheet's theme color) to open the NUI
- Items are organized into named categories with icons, each item showing an image, price, and description

**Special Offers**
- Static special offers defined in config (`specialOffers`) plus dynamic ones created live by staff, both shown together in the UI
- Optional watermark image overlay per price sheet

**Staff Discount & Specials Management**
- `Config.DiscountPermissions` maps job names + minimum grades allowed to apply discounts (ships with `autoexotics` grades 3-4 enabled, others commented out)
- Authorized staff can apply a percentage discount (capped at `Config.MaxDiscountPercent`, default 50%) to individual items, remove discounts, or create/remove dynamic special offers — all directly from the sheet's NUI
- Discounts and dynamic specials are persisted server-side in `pricesheet_discounts` and `pricesheet_specials` MySQL tables and re-synced live to all clients viewing that sheet

---

## 📋 Requirements

| Dependency | Required |
|---|---|
| qb-core | Yes |
| ox_lib | Yes |
| oxmysql | Yes |

---

## 🚀 Installation

```bash
# Place into your resources folder
[server-data]/resources/[custom]/mnc-pricesheets/
```

```lua
# server.cfg
ensure mnc-pricesheets
```

No manual database import is required — `pricesheet_discounts` and `pricesheet_specials` tables are created automatically via `CREATE TABLE IF NOT EXISTS` on resource start. Item images referenced in `config.lua` are pulled from `Config.InventoryImagePath` (defaults to your `qb-inventory` image folder) — make sure the referenced item images exist there, or add your own to `html/images/` and point `Config.WatermarkImagePath` accordingly.

---

## ⚙️ Configuration Guide

```lua
Config.DiscountPermissions = {
    ['autoexotics'] = {3, 4},
}
Config.MaxDiscountPercent = 50

Config.PriceSheets = {
    {
        name = "Auto Exotics Parts & Services",
        location = vector3(544.76, -199.0, 54.51),
        theme = "blue",
        jobs = {}, -- Public access
        watermark = "autoexotics.png",
        categories = {
            {
                name = "Tools & Equipment",
                icon = "fa-toolbox",
                items = {
                    {name = "OBD Scanner", item = "obd_scanner", price = 200, image = "obd_scanner.png", description = "Diagnostic scanner"},
                    -- ...
                }
            },
            -- more categories...
        },
        specialOffers = {
            {name = "Stancing Bundle", description = "Full Stance Setup", originalPrice = 3000, salePrice = 2750, image = "stancerkit.png"},
        }
    },
}
```

Each entry in `Config.PriceSheets` is a fully independent catalog — location, theme, job restriction, categories/items, and special offers. Commented-out examples in `config.lua` show how to set up additional sheets (burger restaurant, police armory, pharmacy, convenience store) as templates to copy.

---

## 🎮 Controls & Usage

- **Approach a configured location** and press `E` when the `[E] - View <sheet name>` prompt appears (within 2m) to open the catalog.
- No standalone purchase flow is built in — this script is a **display/catalog** system; item purchasing (if any) must be handled by another shop resource or added separately.
- Staff with sufficient job grade (per `Config.DiscountPermissions`) see extra controls in the NUI to apply/remove discounts and create/remove special offers.

---

## 🔧 Troubleshooting

- **Item images not showing**: Confirm `Config.InventoryImagePath` points to a valid image folder (defaults to `nui://qb-inventory/html/images/`) and that the image filenames referenced in `config.lua` actually exist there.
- **"Access Denied" opening a sheet**: The sheet has a `jobs` restriction list — only players with a matching job can open it; leave `jobs = {}` for public access.
- **Discount/special controls don't appear**: Your job and grade must be listed in `Config.DiscountPermissions` to see staff controls in the NUI.
- **Discounts/specials don't persist after restart**: Confirm `oxmysql` is connected — the resource waits for it before creating `pricesheet_discounts`/`pricesheet_specials` and will retry with debug logging if `Config.Debug = true`.

---

## 📝 Credits & License

**Author**: Stan Leigh
**Version**: 1.0.0
**Framework**: QBCore

Distributed as part of the MnCLosSantos mod-dump collection — open source, please credit the original author if you edit and re-release.
