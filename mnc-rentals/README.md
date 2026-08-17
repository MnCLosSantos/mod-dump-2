# 🚗 MnC Vehicle Rentals

[![FiveM](https://img.shields.io/badge/FiveM-Ready-green.svg)](https://fivem.net/)
[![QBCore](https://img.shields.io/badge/Framework-QBCore-blue.svg)](https://github.com/qbcore-framework)
[![Version](https://img.shields.io/badge/Version-1.0.0-brightgreen.svg)]()

---

## 🌟 Overview

MnC Vehicle Rentals adds a network of rental car/boat/jet-ski counters across the map, each staffed by an animated NPC clerk. Players walk up, browse a categorized NUI catalogue of vehicles priced by the hour, pay cash, and get warped into a freshly spawned rental with keys, fuel, and (optionally) temporary insurance/registration/inspection. Returning the vehicle to any rental location refunds 10% of the rental cost.

---

## ✨ Key Features

**Rental Zones & NPCs**
- 12 pre-configured rental locations (LS Airport, Innocence, Elgin, Pillbox, Eclipse, Wigwang, Route 1, Paleto, Sandy Shores, Leigon, Arena GoKarting, Vespucci Beach) each with its own NPC clerk, vehicle spawn point, and category-tagged vehicle list
- NPC clerks are server-spawned, given idle animations, frozen/invincible, and automatically respawned if they go missing (checked every 60s)
- Proximity-based interaction: `[E]` opens the rental UI near a clerk, `[E]` returns a vehicle near the zone's spawn point

**Rental Flow**
- NUI catalogue groups vehicles by category (Compacts, Sedans, Boats, JetSki, etc.) with per-zone pricing and a selectable hourly duration
- Optional item requirement (`driver_license` by default) before renting can be toggled via config
- Server-side cash check, rental limit of 3 concurrent rentals per player, and automatic key assignment (`vehiclekeys` / `qb-vehiclekeys`) plus fuel refill (LegacyFuel/cdn-fuel/ox_fuel/standalone)
- Rentals auto-expire after the paid duration; a background thread cleans up expired rentals and notifies the player
- Returning a rental at any location refunds 10% of what was paid directly to the player's bank

**Temporary Insurance/Registration**
- When `GrantTemporaryInsurance` is enabled, renting a vehicle inserts temporary rows into `insured_vehicles`, `registered_vehicles`, and `inspected_vehicles` (requires the companion **mnc-insurance** resource), which are removed automatically on return, expiration, or player disconnect

**5 selectable NUI color themes** (`style1`-`style5`) assignable per rental zone

---

## 📋 Requirements

| Dependency | Required |
|---|---|
| qb-core | Yes |
| ox_lib | Yes |
| oxmysql | Yes (for temporary insurance/registration inserts) |
| mnc-insurance | Only if `Config.GrantTemporaryInsurance = true` |
| LegacyFuel / cdn-fuel / ox_fuel | Depending on `Config.Fuel` setting |

---

## 🚀 Installation

```bash
# Place into your resources folder
[server-data]/resources/[custom]/mnc-rentals/
```

```lua
# server.cfg
ensure mnc-rentals
```

This resource does not ship a SQL file — it inserts into the `insured_vehicles`, `registered_vehicles`, and `inspected_vehicles` tables, which are expected to already exist (typically created by the companion **mnc-insurance** script). Make sure those tables exist in your database if `GrantTemporaryInsurance` is enabled.

---

## ⚙️ Configuration Guide

```lua
Config.Fuel = 'legacy'          -- 'legacy', 'cdn', 'ox', or 'standalone'
Config.Keys = 'qb'
Config.Warp = true
Config.GrantTemporaryInsurance = true  -- requires mnc-insurance
Config.RequireItem = true
Config.RequiredItem = 'driver_license'
```

Each entry in `Config.Zones` defines a rental location:

```lua
[1] = {
    name = 'LS Airport Rentals',
    coords = vector3(-986.64, -2690.21, 13.02), -- NPC location
    spawn = vector4(-989.63, -2706.8, 13.22, 333.45), -- Vehicle spawn
    vehicles = {
        {model = 'asbo', name = 'Asbo', rentalPrice = 200, brand = 'Maxwell', category = 'Compacts'},
    },
    style = 'style2', -- UI theme
    ped = { model = 'a_m_y_business_01', coords = vector4(...), animationSet = { dict = '...', anims = {'idle_a','idle_b','idle_c'} } },
}
```

---

## 🎮 Controls & Usage

- **[E]** near an NPC clerk — open the rental catalogue
- **[E]** near a zone's vehicle spawn point while driving a rented vehicle — return it for a refund

---

## 🔧 Troubleshooting

- **No temporary insurance/registration appears** — confirm `mnc-insurance`'s database tables exist and `Config.GrantTemporaryInsurance` is `true`.
- **Vehicle spawns without fuel** — check `Config.Fuel` matches the fuel resource actually running on your server.
- **Rental NPC missing** — the script auto-respawns clerks every minute; enable `Config.Debug` to see respawn logs in console.
- **"You can only have a maximum of 3 active rentals"** — this is a hardcoded server-side limit in `server/server.lua`.

---

## 📝 Credits & License

**Author**: Stan Leigh
**Version**: 1.0.0
**Framework**: QBCore

Distributed as part of the MnCLosSantos mod-dump collection — open source, please credit the original author if you edit and re-release.
