# 🎯 MNC Hydros

[![FiveM](https://img.shields.io/badge/FiveM-Ready-green.svg)](https://fivem.net/)
[![QBCore](https://img.shields.io/badge/Framework-QBCore-blue.svg)](https://github.com/qbcore-framework)
[![Version](https://img.shields.io/badge/Version-1.0.0-brightgreen.svg)]()

---

## 🌟 Overview

MNC Hydros lets mechanics install a hydraulic handbrake kit — **Street** or **Competition** grade — onto a vehicle's rear axle, boosting its `fHandBrakeForce` handling value for a much stronger, snappier e-brake feel useful for drifting and hydraulic-style rear-lockup tricks. Like its sister script mnc-diffs, kits are installed through a two-wheel install minigame, persist per-plate in the database, and wear out after 3 hours of use.

---

## ✨ Key Features

**Installation & Removal**
- Two-stage rear-wheel install minigame: walk to the rear-left then rear-right wheel and press `E` at each, with on-screen markers and a progress bar
- `hydro_toolbox` item lets mechanics remove an installed kit and return it to inventory
- Tier system — Competition Hydraulics (tier 2) can overwrite Street Hydraulics (tier 1), but not the reverse

**Handling Behavior**
- Raises `fHandBrakeForce` to a fixed configured value while the kit is active (Street: 3.5, Competition: 7.0, vs. GTA's stock ~0.9–1.0)
- Caches and fully restores the vehicle's original handbrake force on exit or removal

**Job & Item Gating**
- Requires an allowed job/grade (`Config.AllowedJobs`: mechanic, mechanic2, mechanic3, beekers, autoexotics, bennys, tuner) to install or remove, re-validated server-side
- Consumes the corresponding item (`street_hydro` / `comp_hydro`) on install; returns it to inventory on manual removal

**Persistence & Wear**
- Hydro assignments are stored per-plate in an auto-created `vehicle_hydros` MySQL table and synced live to all clients
- Each kit wears out and is auto-removed after 3 hours of accumulated in-vehicle time (`Config.HydroDurationMs`)

**Admin Tools**
- `/hydrostreet [id]` and `/hydrocomp [id]` commands instantly grant a hydraulic kit to a target player's current vehicle, bypassing item/job checks

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
[server-data]/resources/[custom]/mnc-hydros/
```

```lua
# server.cfg
ensure mnc-hydros
```

Add the three items from `install/items.txt` (`street_hydro`, `comp_hydro`, `hydro_toolbox`) to your `qb-core/shared/items.lua`. The `vehicle_hydros` table is created automatically via `CREATE TABLE IF NOT EXISTS` — no manual SQL import needed.

---

## ⚙️ Configuration Guide

```lua
Config.RequireJob = true
Config.AllowedJobs = {
    mechanic = 0, mechanic2 = 0, mechanic3 = 0,
    beekers = 0, autoexotics = 0, bennys = 2, tuner = 1,
}

Config.Hydros = {
    street_hydro = { item = 'street_hydro', type = 'street', installTime = 5000, HandbrakeForce = 3.5 },
    comp_hydro   = { item = 'comp_hydro',   type = 'comp',   installTime = 7000, HandbrakeForce = 7.0 },
}

Config.HydroDurationMs = 3 * 60 * 60 * 1000  -- 3 hours
Config.ApplyDistance = 2.5
```

`HandbrakeForce` under each hydro type is the raw `fHandBrakeForce` value applied while that kit is installed — higher means a harder, more instant rear-wheel lockup.

---

## 🎮 Controls & Usage

- **Install**: Use a `street_hydro` or `comp_hydro` item near a vehicle, then walk to each rear wheel and press `E` when prompted.
- **Remove**: Use the `hydro_toolbox` item near a vehicle with a kit installed, then repeat the wheel-by-wheel `E` prompt to remove it.
- **`/hydrostreet [player id]`** and **`/hydrocomp [player id]`**: Admin-only commands to instantly install a hydraulic kit on a target's current vehicle.

---

## 🔧 Troubleshooting

- **Install/removal fails silently**: Confirm your job and grade match an entry in `Config.AllowedJobs` — the server re-validates this even if the client-side check passes.
- **"Already has an equal or higher hydraulic kit"**: The tier system blocks installing Street Hydraulics over an existing Competition kit; remove the existing kit first.
- **Handbrake doesn't feel stronger**: Verify the kit hasn't already worn out (3-hour timer) and enable `Config.Debug = true` to log the live `fHandBrakeForce` value being applied.

---

## 📝 Credits & License

**Author**: Stan Leigh
**Version**: 1.0.0
**Framework**: QBCore

Distributed as part of the MnCLosSantos mod-dump collection — open source, please credit the original author if you edit and re-release.
