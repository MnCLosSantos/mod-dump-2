# 🛞 MNC Drivelines

[![FiveM](https://img.shields.io/badge/FiveM-Ready-green.svg)](https://fivem.net/)
[![QBCore](https://img.shields.io/badge/Framework-QBCore-blue.svg)](https://github.com/qbcore-framework)
[![Version](https://img.shields.io/badge/Version-1.0.0-brightgreen.svg)]()

---

## 🌟 Overview

MNC Drivelines is a vehicle drivetrain conversion system that lets mechanics change a vehicle's drive type — FWD, RWD, AWD 50/50, Haldex 65/35, or Viscous 35/65 — using consumable conversion kits. Each conversion physically re-flags which wheels receive power and rewrites the vehicle's traction/drive-bias handling floats, giving each layout a distinct real-world driving feel.

---

## ✨ Key Features

**Drive Type Conversions**
- Five drivetrain kits, each with a unique torque split (`driveBias`), front/rear traction bias, and set of powered wheels
- Multi-stage wheel-by-wheel install: player must walk to each relevant wheel (2 for FWD/RWD, 4 for AWD variants) and press `E` at each with a colored on-screen marker
- Only one drive type can be active per vehicle at a time — installing a new kit automatically returns the previously-installed kit to the player's inventory
- Snapshots the vehicle's original handling/wheel-power values the first time a conversion is applied so it can be restored later

**Driveline Toolbox**
- `driveline_toolbox` usable item opens a context menu showing the currently installed drive type, its torque bias, and driven wheels (color-coded markers per drivetrain)
- "Remove Conversion Kit" option runs the same wheel-by-wheel uninstall flow and returns the kit item, restoring stock handling

**Anti-Abuse**
- A per-frame watcher on AWD-equipped vehicles blocks simultaneous throttle+brake input at near-standstill speeds to prevent brake-torque/standing-burnout exploits, and force-cancels `IsVehicleInBurnout`

**Persistence & Admin**
- Installed drive types are stored per-plate in an auto-created `vehicle_drivetype` MySQL table and synced live to all clients
- Admin commands `/drivetypefwd`, `/drivetyperwd`, `/drivetyreawd`, `/drivetypehaldex`, `/drivetypeviscous` instantly apply a given drivetrain to a target player's current vehicle

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
[server-data]/resources/[custom]/mnc-drivelines/
```

```lua
# server.cfg
ensure mnc-drivelines
```

Add the six items from `install/items.txt` (`driveline_toolbox`, `drivetype_fwd`, `drivetype_rwd`, `drivetype_awd5050`, `drivetype_haldex`, `drivetype_viscous`) to your `qb-core/shared/items.lua`. The `vehicle_drivetype` table is created automatically via `CREATE TABLE IF NOT EXISTS` — no manual SQL import needed.

---

## ⚙️ Configuration Guide

```lua
Config.RequireJob = true
Config.AllowedJobs = { ['mechanic'] = 0, ['bennys'] = 0 }

Config.DriveTypes = {
    ['awd_5050'] = {
        label = 'AWD 50/50 Split', item = 'drivetype_awd5050', installTime = 12000,
        driveBias = 0.5, tractionFront = 0.50, tractionRear = 0.50,
        poweredWheels = { [0]=true, [1]=true, [2]=true, [3]=true },
        wheelSet = { {bone='wheel_lf', label='Front Left Wheel'}, {bone='wheel_rf', label='Front Right Wheel'},
                     {bone='wheel_lr', label='Rear Left Wheel'},  {bone='wheel_rr', label='Rear Right Wheel'} },
    },
    -- fwd, rwd, haldex_6535, viscous_3565 defined similarly
}

Config.ApplyDistance = 2.5
```

Each drivetrain entry controls its torque split (`driveBias`), traction handling floats, which wheel indices are powered, install time, and which wheel bones the player must visit during install/removal.

---

## 🎮 Controls & Usage

- **Install**: Use a drivetrain conversion kit item while standing outside the vehicle, then walk to each prompted wheel and press `E`.
- **Toolbox**: Use `driveline_toolbox` near a converted vehicle to open a menu showing its current drivetrain and torque bias, with an option to remove it.
- **Admin commands**: `/drivetypefwd`, `/drivetyperwd`, `/drivetyreawd`, `/drivetypehaldex`, `/drivetypeviscous [player id]` — admin-only, instantly applies that drivetrain to the target's current vehicle.

---

## 🔧 Troubleshooting

- **Conversion doesn't apply**: Confirm your job/grade is listed in `Config.AllowedJobs`, and that you're standing outside the vehicle (installs are blocked while seated).
- **Vehicle stuck with strange handling after uninstalling this script**: The mod stores no permanent handling.meta changes — it applies floats live and restores a snapshot on removal, but if the resource is stopped mid-drive without going through the toolbox, restart the resource and re-enter the vehicle to trigger a clean state.
- **AWD vehicle refuses to burnout at a standstill**: This is intentional anti-exploit behavior for AWD/Haldex/Viscous types — disable by removing the anti-burnout thread in `client.lua` if undesired.

---

## 📝 Credits & License

**Author**: Stan Leigh
**Version**: 1.0.0
**Framework**: QBCore

Distributed as part of the MnCLosSantos mod-dump collection — open source, please credit the original author if you edit and re-release.
