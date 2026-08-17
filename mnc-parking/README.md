# 🅿️ MNC Parking

[![FiveM](https://img.shields.io/badge/FiveM-Ready-green.svg)](https://fivem.net/)
[![QBCore](https://img.shields.io/badge/Framework-QBCore-blue.svg)](https://github.com/qbcore-framework)
[![Version](https://img.shields.io/badge/Version-1.4.0-brightgreen.svg)]()

---

## 🌟 Overview

MNC Parking lets players physically park an owned vehicle anywhere in the world (outside restricted zones) instead of only in a garage, persisting its exact position, heading, fuel, and mods to the database. Parked vehicles can be locked down with a wheel lock item, wrapped in a physical tarp/cover prop, tracked with a map blip, and recalled or moved between garages — all with server-authoritative validation and slot limits per player.

---

## ✨ Key Features

**Parking & Persistence**
- `/park` parks the vehicle you're currently driving at its exact world position (position, heading, fuel, engine/body health, and full mod properties are saved to `mnc_parked_vehicles`)
- Confirmation dialog warns that recalling from the depot/impound wipes mods, and explains how to preserve them (via `/parked` → Recall, or waiting for a server restart)
- No-parking zones (`Config.NoParkZones`) block parking near configured locations (police stations, casino, mechanic shops, etc.) with a radius and label per zone
- Per-player slot limit (`Config.MaxVehiclesOut`, default 4) with a Discord-ID-based VIP override (`Config.VipDiscordIds` / `Config.VipMaxVehiclesOut`) granting extra slots
- A background sync timer periodically updates the vehicle's live position/condition back to the database, and a move-watcher detects if a parked vehicle has been displaced (e.g. towed) beyond a threshold

**Parked Vehicle Menu**
- `/parked` (configurable command list) opens an `ox_lib` menu of all your parked vehicles, showing condition (Excellent/Good/Fair/Poor) and fuel level
- Per-vehicle options: set GPS waypoint, re-issue keys, or recall the vehicle back to a garage

**Parking Lock**
- `parking_lock` item physically installs a wheel lock on a nearby vehicle (with a progress bar), preventing it from being driven/tracked as a target for theft until removed
- `parking_key` item removes the lock

**Vehicle Cover System**
- `vehicle_tarp` item covers a parked vehicle with a class-appropriate cover prop (`Config.Cover.CoverProps`, mapped by GTA vehicle class), timed with a progress bar and interaction distance check
- `vehicle_tarp_box` item removes a cover, useful if a cover prop becomes stuck/desynced
- Cover state persists per-plate in a dedicated `mnc_cover_state` table and automatically cleans up when a vehicle is recalled or untracked

**Admin Tools**
- `/dropparked` (admin permission or server console) force-clears every parked vehicle on the server, tearing down covers, deleting spawned entities, and resetting all state/DB records at once

---

## 📋 Requirements

| Dependency | Required |
|---|---|
| qb-core | Yes |
| ox_lib | Yes |
| oxmysql | Yes |
| qb-garages | Implied — recalled/impounded vehicles are routed to named garages (`Config.RecallGarage`, `Config.ImpoundGarage`) that must exist in your garage system |

---

## 🚀 Installation

```bash
# Place into your resources folder
[server-data]/resources/[custom]/mnc-parking/
```

```lua
# server.cfg
ensure mnc-parking
```

Add the four items from `install/items.txt` (`parking_lock`, `parking_key`, `vehicle_tarp`, `vehicle_tarp_box`) to your `qb-core/shared/items.lua`. Both `mnc_parking_locks` / `mnc_parked_vehicles` (parking) and `mnc_cover_state` (cover system) tables are created automatically via `CREATE TABLE IF NOT EXISTS` on resource start — no manual SQL import needed.

---

## ⚙️ Configuration Guide

```lua
Config.MaxVehiclesOut = 4
Config.ParkingLockItem = 'parking_lock'
Config.ParkingKeyItem  = 'parking_key'
Config.RecallGarage  = 'pillboxgarage'
Config.ImpoundGarage = 'depotLot'
Config.Commands = { 'parked' }

Config.NoParkZones = {
    { coords = vector3(441.0, -982.0, 30.7), radius = 100.0, label = 'Mission Row PD' },
    -- more zones...
}

Config.VipMaxVehiclesOut = 15
Config.VipDiscordIds = {
    -- '123456789012345678',
}

Config.Cover = {
    CoverItem = 'vehicle_tarp',
    CoverRemoveItem = 'vehicle_tarp_box',
    CoverDuration = 4000,
    InteractDistance = 2.5,
}
```

`Config.NoParkZones` is a list of coordinate/radius/label entries blocking parking near sensitive areas. `Config.VipDiscordIds` grants listed Discord snowflake IDs a higher parking slot cap. `Config.Cover.CoverProps` maps each GTA vehicle class number to a specific cover prop model.

---

## 🎮 Controls & Usage

- **`/park`** (also bound via `RegisterKeyMapping` so it appears as a bindable key in FiveM's keybind settings): Parks the vehicle you're currently driving at your location.
- **`/parked`**: Opens the menu of your parked vehicles (waypoint, get keys, recall).
- **`parking_lock` / `parking_key` items**: Install/remove a wheel lock on a nearby vehicle.
- **`vehicle_tarp` / `vehicle_tarp_box` items**: Cover/uncover a parked vehicle.
- **`/dropparked`**: Admin-only (or server console) — force-clears all parked vehicles server-wide.

---

## 🔧 Troubleshooting

- **"You cannot park here"**: Check `Config.NoParkZones` — you're within the configured radius of a restricted location.
- **Mods reset after pulling a vehicle from the depot/impound**: This is expected — recalling via the depot resets tuning. Use the `/parked` menu's Recall option or wait for a server restart to preserve mods instead.
- **Vehicle stuck under a cover prop that won't remove**: Use a `vehicle_tarp_box` item near the vehicle to force-remove a desynced cover.
- **Player has more parked vehicles than expected**: Check `Config.VipDiscordIds` — listed Discord IDs get `Config.VipMaxVehiclesOut` slots instead of the default `Config.MaxVehiclesOut`.

---

## 📝 Credits & License

**Author**: Stan Leigh
**Version**: 1.4.0
**Framework**: QBCore

Distributed as part of the MnCLosSantos mod-dump collection — open source, please credit the original author if you edit and re-release.
