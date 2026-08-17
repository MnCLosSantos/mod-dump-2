# 💼 MNC Job HUD

[![FiveM](https://img.shields.io/badge/FiveM-Ready-green.svg)](https://fivem.net/)
[![QBCore](https://img.shields.io/badge/Framework-QBCore-blue.svg)](https://github.com/qbcore-framework)
[![Version](https://img.shields.io/badge/Version-1.1.0-brightgreen.svg)]()

---

## 🌟 Overview

MNC Job HUD is a persistent on-screen HUD that displays the player's job/gang, cash, bank balance, server ID, player name, in-game time, and current player count, rendered through an NUI overlay with 25 selectable color/gradient styles. Each player's chosen style is saved to a MySQL table and restored automatically on future sessions.

---

## ✨ Key Features

**HUD Display**
- Shows cash, bank, job/gang label, server ID + player name, in-game clock, and live server player count, each individually toggleable and positionable via `Config.HUD`
- Flashes a visual "effect" pulse on any field when its value changes, and computes the delta (`bankChange` / `cashChange`) shown alongside cash/bank updates
- Automatically hides while the pause menu is open (or, if `Config.ShowOnlyInPauseMenu` is enabled, shows only while the pause menu is open)
- Player count is fetched from the server via callback rather than `GetActivePlayers()`, avoiding proximity/streaming inaccuracies

**Styling**
- 25 predefined visual styles (gradients/colors), switchable in-game and persisted per-citizen to a `mnc_hud_styles` MySQL table (auto-created)
- In-NUI help panel lists every style with a live preview alongside a command guide

---

## 📋 Requirements

| Dependency | Required |
|---|---|
| qb-core | Yes |
| oxmysql | Yes |
| ox_lib | Yes |

---

## 🚀 Installation

```bash
# Place into your resources folder
[server-data]/resources/[custom]/mnc-jobhud/
```

```lua
# server.cfg
ensure mnc-jobhud
```

No manual database import is required — the `mnc_hud_styles` table (stores each citizen's chosen HUD style) is created automatically via `CREATE TABLE IF NOT EXISTS` on resource start. `install/mnc_hud_styles.sql` is provided as a reference copy of the same schema if you prefer to import it manually.

---

## ⚙️ Configuration Guide

```lua
Config.DefaultStyle = 1
Config.ShowOnlyInPauseMenu = false

Config.HUD = {
    jobOrGang = { enabled = false, position = { top = "0px", left = "0px" } },
    players   = { enabled = true,  position = { top = "710px", left = "15px" } },
    time      = { enabled = true,  position = { top = "590px", left = "15px" } },
    id        = { enabled = true,  position = { top = "710px", left = "165px" } },
    bank      = { enabled = true,  position = { top = "670px", left = "15px" } },
    cash      = { enabled = true,  position = { top = "630px", left = "15px" } },
}
```

Each entry under `Config.HUD` toggles a field on/off and sets its screen position independently. `Config.ShowOnlyInPauseMenu` flips the HUD between "always visible except in pause menu" and "only visible in pause menu" behavior.

---

## 🎮 Controls & Usage

- **`/jobhud [1-25]`**: Changes the HUD's color style and saves the choice to the database.
- **`/hudhelp`**: Opens an in-NUI help panel listing all 25 styles with previews and a command guide (also references a `/weaponui` command from a companion script).

---

## 🔧 Troubleshooting

- **Player count shows 0 or stale**: The count is pulled from a server callback (`mnc-hud:getPlayerCount`), not client-side pools — confirm the server event isn't being blocked by another resource.
- **Style doesn't persist between sessions**: Confirm `oxmysql` is running and the `mnc_hud_styles` table was created; check console for the "table checked/created" log line on startup.
- **HUD never shows**: Check `Config.ShowOnlyInPauseMenu` — if set to `true`, the HUD will only appear while the pause menu is open, not during normal gameplay.

---

## 📝 Credits & License

**Author**: Stan Leigh
**Version**: 1.1.0
**Framework**: QBCore

Distributed as part of the MnCLosSantos mod-dump collection — open source, please credit the original author if you edit and re-release.
