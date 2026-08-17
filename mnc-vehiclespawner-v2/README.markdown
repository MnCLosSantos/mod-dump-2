# 🏁 MnC Vehicle Spawner v2

[![FiveM](https://img.shields.io/badge/FiveM-Ready-green.svg)](https://fivem.net/)
[![QBCore](https://img.shields.io/badge/Framework-QBCore-blue.svg)](https://github.com/qbcore-framework)
[![Version](https://img.shields.io/badge/Version-1.1.3-brightgreen.svg)]()

---

## 🌟 Overview

MnC Vehicle Spawner v2 is an admin-only NUI tool for spawning and fully customizing any vehicle registered in `QBCore.Shared.Vehicles`. Admins pick a vehicle from an image-driven catalogue, configure colors, liveries, wheels, and performance mods, choose a custom or auto-generated plate, and either spawn a throwaway vehicle or register it as an owned vehicle in `player_vehicles`.

---

## ✨ Key Features

**Admin Vehicle Catalogue**
- `/vehiclespawner` command (admin permission required) opens an NUI catalogue of every vehicle in `QBCore.Shared.Vehicles`, grouped by category, with images resolved through the same fallback chain used by mnc-vehiclecatalog-v2 (docs.fivem.net → GitHub mirrors → local fallback)

**Spawning & Customization**
- Full color/mod configuration before spawning: primary/secondary paint, pearlescent/wheel color, interior/dashboard trim, window tint, livery (both mod-slot 14 and native livery mod 48), wheel type, and plate style
- Optional performance mods and a "random visual mods" option
- Custom plate entry (max 8 chars, auto-uppercased) or an auto-generated random plate; the server validates plate uniqueness against `player_vehicles` before spawning, silently regenerating auto-plates on collision or surfacing an error for custom-plate collisions
- Auto-assigns vehicle keys (`vehiclekeys` or `qb-vehiclekeys` depending on `Config.Keys`) and refuels via the configured fuel resource (LegacyFuel/cdn-fuel/ox_fuel/standalone)
- "Own Vehicle" option inserts the spawned vehicle into `player_vehicles` under the spawning admin's citizenid (garage defaults to `pillboxgarage`)

**Standalone Vehicle Mods Panel**
- A separate live mod-editing panel (colors, livery, neon, tyre smoke color, bulletproof tyres, xenon headlights, plate index) can be applied directly to whatever vehicle the admin is currently in, independent of spawning a new one

**5 selectable NUI color themes** (`style1`-`style5`, set via `Config.UIStyle`)

---

## 📋 Requirements

| Dependency | Required |
|---|---|
| qb-core | Yes |
| ox_lib | Yes |
| oxmysql | Yes (plate uniqueness check, `player_vehicles` insert) |
| LegacyFuel / cdn-fuel / ox_fuel | Depending on `Config.Fuel` setting |

---

## 🚀 Installation

```bash
# Place into your resources folder
[server-data]/resources/[custom]/mnc-vehiclespawner-v2/
```

```lua
# server.cfg
ensure mnc-vehiclespawner-v2
```

No database tables are created — this resource only reads/writes the existing `player_vehicles` table when the "Own Vehicle" option is used.

---

## ⚙️ Configuration Guide

```lua
Config.Command = 'vehiclespawner' -- admin command to open the spawner
Config.Fuel = 'legacy'            -- 'legacy', 'cdn', 'ox', or 'standalone'
Config.Keys = 'qb'                -- 'qb' or 'qbx'
Config.Warp = true                -- warp player into spawned vehicle

Config.ImagePaths = {
    primary = 'https://docs.fivem.net/vehicles/{model}.webp',
    github1 = 'https://github.com/MnCLosSantos/mnc-vehicle-image-storage/raw/main/{model}.png',
    local_fallback = './images/fallback.png',
}

Config.UIStyle = 'style1' -- style1 through style5
```

---

## 🎮 Controls & Usage

- **`/vehiclespawner`** (admin only) — opens the vehicle catalogue and spawner UI with full customization options

---

## 🔧 Troubleshooting

- **"Access Denied" on the command** — requires QBCore `admin` permission via `QBCore.Functions.HasPermission`.
- **Spawn hangs on "checking plate"** — this indicates `oxmysql` isn't responding to the `player_vehicles` plate lookup; verify the database connection.
- **Vehicle spawns without fuel** — check `Config.Fuel` matches whichever fuel resource is actually running on the server.
- **"Own Vehicle" doesn't appear in the player's garage** — it's inserted with `garage = 'pillboxgarage'`; confirm that garage name matches your garage script's expected default garage.

---

## 📝 Credits & License

**Author**: Stan Leigh
**Version**: 1.1.3
**Framework**: QBCore

Distributed as part of the MnCLosSantos mod-dump collection — open source, please credit the original author if you edit and re-release.
