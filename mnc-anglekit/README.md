# 🛞 MNC Angle Kit

[![FiveM](https://img.shields.io/badge/FiveM-Ready-green.svg)](https://fivem.net/)
[![QBCore](https://img.shields.io/badge/Framework-QBCore-blue.svg)](https://github.com/qbcore-framework)
[![Version](https://img.shields.io/badge/Version-1.0.0-brightgreen.svg)]()

---

## 🌟 Overview

MNC Angle Kit lets mechanics install steering-angle ("drift lock") upgrades onto vehicles by directly modifying the vehicle's `fSteeringLock` handling value. Three tiered kits set progressively larger fixed steering lock angles, and the Pro kit unlocks a `/angle` command to fine-tune a custom angle. Installation and removal are done wheel-by-wheel with an interactive walk-to-each-wheel-and-press-E flow plus an `ox_lib` progress bar and mechanic animation.

---

## ✨ Key Features

**Tiered angle kits**
- Basic (45°), Street (55°), and Pro (65° default, adjustable) kits are installed as usable inventory items, each defining a fixed steering lock angle applied via `SetVehicleHandlingFloat(vehicle, 'CHandlingData', 'fSteeringLock', ...)`.
- The original steering lock value is cached per-vehicle-entity so it can be restored if the kit is later removed.
- Kits enforce a tier hierarchy (`Config.KitTier`) — installing a lower-or-equal tier over an existing kit is blocked.
- Angle is applied automatically whenever the driver enters a vehicle that has a kit on record (fetched via server callback and cached client-side by plate).

**Wheel-by-wheel install/remove flow**
- Both installation and removal require the mechanic to walk to each of the 4 wheels in turn (front-left, front-right, rear-left, rear-right), see an orange (install) or red (removal) ground marker with an "E" prompt, and complete a timed `ox_lib` progress bar with a mechanic animation at each wheel before moving to the next.
- An `angle_kit_remover` item strips any installed kit and returns the original kit item to the mechanic's inventory.

**Custom angle command**
- `/angle <degrees>` — only usable by drivers with a Pro Angle Kit installed (`canSetAngle = true`); sets a custom steering lock between `Config.MinAngle` and `Config.MaxAngle`, synced live to all clients and persisted to the database.

**Persistence & sync**
- Angle kit data is stored in an auto-created `vehicle_angle_kits` MySQL table keyed by plate, and pushed to all clients via `mnc-anglekit:syncAngleData` on install/remove/angle-change so the effect applies immediately for anyone driving that vehicle.

**Admin commands**
- `/anglebasic`, `/anglestreet`, `/anglepro [id]` — admin-only, force-installs a kit on a target player's current vehicle (bypasses item and tier checks).

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
[server-data]/resources/[custom]/mnc-anglekit/
```

```lua
# server.cfg
ensure mnc-anglekit
```

Add the item definitions in `install/items.txt` (`basic_angle_kit`, `street_angle_kit`, `pro_angle_kit`, `angle_kit_remover`) to your `qb-core/shared/items.lua`. The resource automatically creates its `vehicle_angle_kits` MySQL table on first start.

---

## ⚙️ Configuration Guide

```lua
Config.RequireJob = true
Config.AllowedJobs = {
    mechanic = 0, mechanic2 = 0, mechanic3 = 0,
    beekers = 0, autoexotics = 0,
    bennys = 2, tuner = 1,
}

Config.Kits = {
    pro_angle_kit = {
        item = 'pro_angle_kit', label = 'Pro Angle Kit',
        angle = 65, installTime = 6000, canSetAngle = true,
    },
}

Config.MaxAngle = 85  -- hard ceiling on /angle input
Config.MinAngle = 45  -- floor for /angle input
Config.ApplyDistance = 2.5 -- max distance to the vehicle for item use
```

`AllowedJobs` maps job names to the minimum grade required to install/remove kits. Each `Kits` entry sets the fixed steering lock angle, per-wheel total install time, and whether the kit unlocks the `/angle` command. `MinAngle`/`MaxAngle` bound what `/angle` accepts.

---

## 🎮 Controls & Usage

- Use a `basic_angle_kit` / `street_angle_kit` / `pro_angle_kit` item near a vehicle, then walk to each wheel and press **E** when prompted to complete installation.
- Use `angle_kit_remover` near a vehicle with a kit installed to remove it wheel-by-wheel and get the kit item back.
- `/angle <degrees>` — Pro Angle Kit vehicles only; sets a custom steering lock between `Config.MinAngle` and `Config.MaxAngle`.
- `/anglebasic`, `/anglestreet`, `/anglepro [id]` — admin-only kit grants.

---

## 🔧 Troubleshooting

- **"You must be a mechanic to install this kit"** — the player's job/grade isn't listed in `Config.AllowedJobs`.
- **Wheel marker/prompt never appears** — the player must be within the 1.2m prompt radius of the exact wheel bone; some add-on vehicles may not expose standard `wheel_lf`/`wheel_rf`/`wheel_lr`/`wheel_rr` bones.
- **"/angle" says kit doesn't support it** — only the Pro Angle Kit has `canSetAngle = true`; Basic and Street kits are fixed-angle only.
- **Steering doesn't change after installing** — angle is only (re)applied when entering the vehicle as driver; exit and re-enter, or check that `Config.ApplyDistance` allowed the item to target the correct vehicle.

---

## 📝 Credits & License

**Author**: Stan Leigh
**Version**: 1.0.0
**Framework**: QBCore

Distributed as part of the MnCLosSantos mod-dump collection — open source, please credit the original author if you edit and re-release.
