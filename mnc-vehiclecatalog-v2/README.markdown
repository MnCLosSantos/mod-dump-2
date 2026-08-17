# 🏎️ MnC Vehicle Catalog v2

[![FiveM](https://img.shields.io/badge/FiveM-Ready-green.svg)](https://fivem.net/)
[![QBCore](https://img.shields.io/badge/Framework-QBCore-blue.svg)](https://github.com/qbcore-framework)
[![Version](https://img.shields.io/badge/Version-2.3.0-brightgreen.svg)]()

---

## 🌟 Overview

MnC Vehicle Catalog v2 is a browsable, image-driven vehicle showcase for dealerships. It ships a shared vehicle database of 1000+ vehicles (`shared/vehicles.lua`) tagged by dealership ("shop"), and lets players walk up to any of 7 configured dealership zones to browse that shop's inventory in a themed NUI catalogue. Admins get an extra `/vehiclecatalog` command that opens every vehicle across all dealerships with in-place price editing and the ability to reassign a vehicle to a different dealership.

---

## ✨ Key Features

**Dealership Zones**
- 7 pre-configured showroom zones (PDM, PDM Deluxe, MnC Motors, Trucks and Trailers, Race and Rally, Drift and Drag, Semi Catalogue), each with its own coordinates, radius, and UI theme
- Interaction via proximity keypress or `qb-target` (`Config.UseTarget`)
- Each zone only displays vehicles whose `shop` field in `shared/vehicles.lua` matches that zone's name

**Vehicle Catalogue**
- 1000+ vehicle entries bundled in `shared/vehicles.lua` (loaded alongside `@qb-core/shared/vehicles.lua`), each with model, display name, brand, price, class category, and assigned dealership `shop`
- Vehicle images resolved through a fallback chain: `docs.fivem.net` renders → two configurable GitHub-hosted image mirrors → a local `fallback.png`
- A server-side image scanner (admin-triggered) checks each vehicle's image URLs in batches and reports progress via an in-game menu, flagging any vehicles that fall back to the local placeholder

**Admin Tools** (`/vehiclecatalog`, admin permission required)
- Opens the full "All Vehicles" catalogue across every dealership with editable prices
- Reassign a vehicle's dealership ("swap dealership") — this directly patches the `shop` field for that vehicle's entry inside `shared/vehicles.lua` on disk
- Edit a vehicle's price — persists a live patch into the resource's own `shared/vehicles.lua`

**5 selectable NUI color themes** (`style1`-`style5`) assignable per zone

---

## 📋 Requirements

| Dependency | Required |
|---|---|
| qb-core | Yes |
| ox_lib | Yes |

---

## 🚀 Installation

```bash
# Place into your resources folder
[server-data]/resources/[custom]/mnc-vehiclecatalog-v2/
```

```lua
# server.cfg
ensure mnc-vehiclecatalog-v2
```

No database tables are used. This resource ships its own `shared/vehicles.lua` (in addition to `@qb-core/shared/vehicles.lua`) with the full vehicle-to-dealership mapping; admin price/shop edits are written directly back to this file on disk, so the resource folder must be writable by the server process.

---

## ⚙️ Configuration Guide

```lua
Config.Command = 'vehiclecatalog' -- admin command to open the full catalogue

Config.ImagePaths = {
    primary  = 'https://docs.fivem.net/vehicles/{model}.webp',
    github1  = 'https://github.com/MnCLosSantos/mnc-vehicle-image-storage/raw/main/{model}.png',
    github2  = 'https://github.com/MnCLosSantos/mnc-vehicle-image-storage-2/raw/main/{model}.png',
    local_fallback = './images/fallback.png',
}

Config.UseTarget = false -- true = qb-target, false = keypress [E]

Config.Zones = {
    { name = 'pdm', coords = vector3(-55.17, -1089.85, 26.92), radius = 2.0, uiStyle = 'style1', title = 'Adams Apple PDM Catalogue' },
    -- ... 6 more zones
}
```

---

## 🎮 Controls & Usage

- **[E]** near a dealership zone (or qb-target if `Config.UseTarget = true`) — browse that dealership's vehicles
- **`/vehiclecatalog`** (admin only) — opens the full catalogue with price editing and dealership reassignment

---

## 🔧 Troubleshooting

- **Vehicle images all show the fallback icon** — the configured GitHub image mirrors or `docs.fivem.net` may not have an image for that model; run the admin fallback scanner to identify which vehicles need attention.
- **Price/dealership edits don't stick after a restart** — edits are written directly into `shared/vehicles.lua` on disk; confirm the server process has write permission to the resource folder and that the file wasn't reset by a deployment pipeline.
- **A zone shows no vehicles** — no entries in `shared/vehicles.lua` have a matching `shop` value for that zone's `name`.

---

## 📝 Credits & License

**Author**: Stan Leigh
**Version**: 2.3.0
**Framework**: QBCore

Distributed as part of the MnCLosSantos mod-dump collection — open source, please credit the original author if you edit and re-release.
