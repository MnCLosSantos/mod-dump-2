# 🔖 MNC Custom Plate

[![FiveM](https://img.shields.io/badge/FiveM-Ready-green.svg)](https://fivem.net/)
[![QBCore](https://img.shields.io/badge/Framework-QBCore-blue.svg)](https://github.com/qbcore-framework)
[![Version](https://img.shields.io/badge/Version-1.0.0-brightgreen.svg)]()

---

## 🌟 Overview

MNC Custom Plate lets players change the license plate on a nearby vehicle using a consumable **Custom Plate Kit** item, applied through an ox_lib-powered progress bar and a themed NUI plate editor. Server-side it validates the requested text, checks for duplicate plates in `player_vehicles`, and re-inserts the vehicle record under its new plate so the change persists through `qb-garages`.

---

## ✨ Key Features

**Plate Application**
- Usable item (`custom_plate_kit`) opens an NUI plate designer where the player types a plate (1–8 characters) and picks a plate theme/state text
- Plays a carrying animation and a 5-second `lib.progressBar` while the plate is being applied
- Automatically detects the closest vehicle within 5m (or the vehicle the player is currently in)

**Server Validation & Persistence**
- Rejects plates that are too long/short, contain invalid characters, or match the vehicle's current plate
- Checks `player_vehicles` for duplicate plates (ignoring spacing/case) before allowing the change
- Deletes and re-inserts the owned vehicle's DB row under the new plate, resetting its state to "in garage" and wiping mods (player is warned of this in the UI)
- Removes the plate kit item from the player's inventory on success

**Admin Mode**
- `/customplate` command (configurable name) lets admins open the same UI and apply any plate to a nearby vehicle without needing the item, gated by `Config.AdminGroups` (ACE groups or QBCore permission groups)

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
[server-data]/resources/[custom]/mnc-customplate/
```

```lua
# server.cfg
ensure mnc-customplate
```

Add the item definition from `install/items.txt` to your `qb-core/shared/items.lua` — it adds `custom_plate_kit`, a usable item players consume to apply a plate. The script prints a warning on start if this item is missing from `QBCore.Shared.Items`.

---

## ⚙️ Configuration Guide

```lua
Config.Item = 'custom_plate_kit'
Config.MaxPlateLength = 8
Config.MinPlateLength = 1
Config.ProgressDuration = 5000
Config.AdminGroups = { 'admin', 'god', 'superadmin' }
Config.JobLock = nil  -- e.g. { name = 'mechanic', grade = 0 }
Config.AdminCommand = true
Config.AdminCommandName = 'customplate'
```

`Config.JobLock` can restrict plate-kit usage to a specific job/grade; leave it `nil` to allow anyone holding the item. `Config.PlateThemes` defines the visual plate style(s) shown in the NUI editor (ships with a single white theme).

---

## 🎮 Controls & Usage

- **Item use**: Using `custom_plate_kit` from the inventory opens the plate editor NUI for the nearest vehicle.
- **`/customplate`**: Admin-only command (if `Config.AdminCommand` is true) that opens the same editor without consuming an item, restricted to `Config.AdminGroups`.

---

## 🔧 Troubleshooting

- **"Item not found" warning on start**: Add `custom_plate_kit` from `install/items.txt` to your `qb-core` shared items.
- **"That plate is already taken!"**: The script checks `player_vehicles` for any existing row with the same normalized plate; pick a different combination.
- **Mods reset after a plate change**: This is expected — the script re-inserts the vehicle row with `mods` wiped to `'{}'` when swapping plates on an owned vehicle.

---

## 📝 Credits & License

**Author**: MNC Scripts
**Version**: 1.0.0
**Framework**: QBCore

Distributed as part of the MnCLosSantos mod-dump collection — open source, please credit the original author if you edit and re-release.
