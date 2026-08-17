# 🚔 MnC Seize Car v2

[![FiveM](https://img.shields.io/badge/FiveM-Ready-green.svg)](https://fivem.net/)
[![QBCore](https://img.shields.io/badge/Framework-QBCore-blue.svg)](https://github.com/qbcore-framework)
[![Version](https://img.shields.io/badge/Version-1.4.7-brightgreen.svg)]()

---

## 🌟 Overview

MnC Seize Car v2 is a small admin/police utility for permanently deleting vehicles from the `player_vehicles` table. It provides confirmation-dialog-driven commands for removing a single vehicle, wiping every vehicle a specific player owns, wiping the entire server's vehicle garage, and a job-restricted "seize" command that lets police (or configured jobs) confiscate a specific player's vehicle by plate.

---

## ✨ Key Features

**Admin Commands** (`ox_lib` input dialogs, admin-permission gated)
- `/removecar` — prompts for a player server ID and plate, deletes that one `player_vehicles` row
- `/removeallcars` — prompts for a player server ID, deletes every vehicle owned by that citizen ID (with a "DANGER ZONE" confirmation dialog)
- `/removeallcarsfromserver` — full server-wide vehicle wipe, gated behind typing `DELETEALL` plus a confirmation checkbox

**Job-Restricted Seizure**
- `/seizecar` — any player can run it, but the server checks the caller's job against `Config.SeizeCarJob` (default: `police = true`, `mechanic`/`mechanic2 = false`) before deleting the target's vehicle by plate
- Notifies the vehicle's owner (if online) that their vehicle was seized, including the seizing officer's name and job

**Player Lookup**
- Works against both online players (`QBCore.Functions.GetPlayer`) and offline players by querying the `players` table for `citizenid` by server ID

---

## 📋 Requirements

| Dependency | Required |
|---|---|
| qb-core | Yes |
| ox_lib | Yes (input dialogs, alert dialogs, notifications) |
| oxmysql | Yes (all deletions run through `exports.oxmysql:executeSync`) |

---

## 🚀 Installation

```bash
# Place into your resources folder
[server-data]/resources/[custom]/mnc-seizecar-v2/
```

```lua
# server.cfg
ensure mnc-seizecar-v2
```

No SQL import is needed — the resource only deletes rows from the existing `player_vehicles` table.

Note: this resource has no standalone `config.lua` — the job whitelist for `/seizecar` (`Config.SeizeCarJob`) is defined directly at the top of `server.lua`.

---

## ⚙️ Configuration Guide

```lua
-- server.lua
Config = {
    SeizeCarJob = { ['police'] = true, ['mechanic'] = false, ['mechanic2'] = false },
}
```

Add additional job names as keys set to `true` to allow other jobs to use `/seizecar`.

---

## 🎮 Controls & Usage

- **`/removecar`** (admin) — remove a single vehicle by player ID + plate
- **`/removeallcars`** (admin) — wipe all vehicles owned by one player
- **`/removeallcarsfromserver`** (admin) — wipe every vehicle on the server
- **`/seizecar`** (job-restricted) — seize a specific vehicle by player ID + plate

---

## 🔧 Troubleshooting

- **"No permission" on admin commands** — the caller needs `admin` or `god` QBCore permission; job-based access does not apply to the removal commands, only to `/seizecar`.
- **"Player not found"** — the target ID must correspond to an existing `players`/`player_vehicles` row; typos in the server ID are a common cause.
- **`/removeallcarsfromserver` did nothing** — the confirmation input must be exactly `DELETEALL` (case-sensitive) and the checkbox must be checked.

---

## 📝 Credits & License

**Author**: Stan Leigh
**Version**: 1.4.7
**Framework**: QBCore

Distributed as part of the MnCLosSantos mod-dump collection — open source, please credit the original author if you edit and re-release.
