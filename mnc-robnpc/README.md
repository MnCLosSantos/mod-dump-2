# 💰 MnC Rob NPC

[![FiveM](https://img.shields.io/badge/FiveM-Ready-green.svg)](https://fivem.net/)
[![QBCore](https://img.shields.io/badge/Framework-QBCore-blue.svg)](https://github.com/qbcore-framework)
[![Version](https://img.shields.io/badge/Version-1.1.0-brightgreen.svg)]()

---

## 🌟 Overview

MnC Rob NPC lets armed players hold up random pedestrians on the street using qb-target. The victim freezes, faces the player with hands up, and a skill-based progress bar determines success. Successful robberies pay out random cash and a chance at extra loot items, and can optionally alert players on configured jobs (e.g. police) with a temporary GPS blip to the crime scene.

---

## ✨ Key Features

**Robbery Interaction**
- Adds a global qb-target option ("Rob Pedestrian") to any human, non-player, alive ped that isn't already in a vehicle or already robbed
- Requires the player to have a weapon drawn (not unarmed) **and** own a weapon item in their inventory (server-verified against a full list of QBCore weapon item names)
- Ped is frozen, made invincible, forced to face the player, and plays a hands-up animation while the player is forced to aim at them for the duration of the robbery
- `lib.progressBar` skill check (cancellable) gates the robbery outcome; on cancel the ped reacts and flees instead of paying out

**Loot & Payout**
- Guaranteed/percentage-based cash reward randomized between `Config.MinCash` and `Config.MaxCash`
- Weighted random item table (`Config.RobLoot.items`) with per-item drop chance, min/max amount, and a cap on how many distinct extra item types can drop per robbery (`maxExtraItems`)
- Successfully robbed peds are tracked so they can't be robbed again

**Job Alerts**
- Players on jobs listed in `Config.NotifyJobs` (default `police`) receive a notification with the street/zone name of the robbery
- Pressing `[R]` within the notification window drops a temporary blip and GPS waypoint at the crime scene that expires after `Config.BlipTime` seconds

---

## 📋 Requirements

| Dependency | Required |
|---|---|
| qb-core | Yes |
| qb-target | Yes |
| ox_lib | Yes |

---

## 🚀 Installation

```bash
# Place into your resources folder
[server-data]/resources/[custom]/mnc-robnpc/
```

```lua
# server.cfg
ensure mnc-robnpc
```

No database tables or items are required — the script only reads/gives existing QBCore items defined in `Config.RobLoot.items` (make sure those item names, e.g. `water_bottle`, `lockpick`, `pistol_ammo`, exist in your `qb-core` shared items).

---

## ⚙️ Configuration Guide

```lua
Config.NotifyJobs = {"police"}
Config.MinCash = 10
Config.MaxCash = 100

Config.RobLoot = {
    guaranteedCash = true,
    cashChance = 100,
    items = {
        { item = "water_bottle", min = 1, max = 3, chance = 45 },
        { item = "weapon_pistol", min = 1, max = 4, chance = 2 }, -- rare
    },
    maxExtraItems = 4,
}

Config.RobDuration = 10000   -- progress bar duration (ms)
Config.NotifyDuration = 10000 -- how long the job alert stays active
Config.BlipTime = 24          -- seconds the alert blip stays on the map
```

---

## 🎮 Controls & Usage

- **Target a pedestrian with a weapon drawn** → select "Rob Pedestrian" to start the hold-up
- **[R]** — while a job alert notification is showing, respond to the robbery by placing a waypoint/blip at the location

---

## 🔧 Troubleshooting

- **"You need a weapon in your inventory!" even when armed** — the server checks for any item name in the hardcoded `weapons` list in `server.lua`; make sure your weapon item names match QBCore's defaults.
- **Police never get notified** — confirm the responding player's `job.name` matches an entry in `Config.NotifyJobs` exactly (case-sensitive).
- **Ped doesn't react/flee after a failed robbery** — this relies on `TaskReactAndFleePed` and `SetPedFleeAttributes`; heavily scripted or mission peds may not respond correctly.

---

## 📝 Credits & License

**Author**: Stan Leigh
**Version**: 1.1.0
**Framework**: QBCore

Distributed as part of the MnCLosSantos mod-dump collection — open source, please credit the original author if you edit and re-release.
