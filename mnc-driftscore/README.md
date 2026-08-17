# 🏁 MNC Drift Score

[![FiveM](https://img.shields.io/badge/FiveM-Ready-green.svg)](https://fivem.net/)
[![QBCore](https://img.shields.io/badge/Framework-QBCore-blue.svg)](https://github.com/qbcore-framework)
[![Version](https://img.shields.io/badge/Version-1.0.0-brightgreen.svg)]()

---

## 🌟 Overview

MNC Drift Score is a live drifting-scoring HUD that analyzes a player's driving angle, speed, proximity to obstacles, and other real-time vehicle telemetry to calculate a running drift score, chained combo multipliers, and named "combo" callouts (e.g. "Tokyo Style", "Wall Runner"), rendered through a themeable NUI overlay with 25 selectable color styles.

---

## ✨ Key Features

**Drift Detection & Scoring**
- Calculates drift angle from the difference between vehicle velocity direction and heading, only counting it as a drift above `Config.DriftThresholdAngle` and `Config.MinDriftSpeed`
- Awards points per tick based on speed × angle, multiplied by the current combo multiplier, and accumulates into a running chain score
- Detects spin-outs (excessive angle or rotation velocity) and crashes (sudden health/velocity drops) to reset the current chain
- Chain auto-banks into the total score after `Config.ComboTimeout` (3.5s) of no drifting, and the total resets entirely after `Config.InactiveResetTime` (5s) of inactivity

**Combo System**
- 20+ named combos evaluated every tick, covering angle thresholds, speed thresholds, wall proximity (raycast-based), drift duration, and compound conditions (angle+speed, angle+proximity)
- Advanced combos detect tandem drifting (nearby AI-free players also drifting), reverse-entry drifts, clutch-kick throttle blips, chicane heading changes, donuts, e-brake timing, and sustained "link" chains
- All active combos stack additively into the current multiplier and are displayed together as a combo string

**HUD & Styling**
- NUI overlay shows score, multiplier, and active combo text, individually toggleable and positionable via `Config.HUD`
- 25 predefined visual styles (gradients/colors) selectable in-game; the chosen style is saved per-citizen to a `mnc_drift_styles` MySQL table (auto-created)
- HUD auto-hides while the pause menu is open and re-shows when closed

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
[server-data]/resources/[custom]/mnc-driftscore/
```

```lua
# server.cfg
ensure mnc-driftscore
```

No manual database import is required — the `mnc_drift_styles` table (stores each citizen's chosen HUD style) is created automatically via `CREATE TABLE IF NOT EXISTS` on resource start.

---

## ⚙️ Configuration Guide

```lua
Config.DriftThresholdAngle = 15.0
Config.MaxDriftAngle = 150.0
Config.MinDriftSpeed = 5.0
Config.ComboTimeout = 3500
Config.InactiveResetTime = 5000

Config.HUD = {
    combo = { enabled = true, position = { top = "1020px", right = "850px" } },
    multiplier = { enabled = true, position = { top = "50px", right = "850px" } },
    score = { enabled = true, position = { top = "100px", right = "850px" } },
}
```

`DriftThresholdAngle`/`MinDriftSpeed` tune drift sensitivity, while `Config.HUD` lets you enable/disable and reposition each HUD element independently. `Config.Combos` (a large table) defines every named combo, its trigger condition, and its multiplier bonus.

---

## 🎮 Controls & Usage

- **`/driftscore`**: Toggles the drift HUD on/off; banks any active chain score when turned off.
- **`/driftstyle [1-25]`**: Instantly switches to the given HUD color style and saves it to the database.
- **`/drifthudhelp`**: Opens an in-NUI help/style-browser panel.

---

## 🔧 Troubleshooting

- **HUD never appears**: Run `/driftscore` to enable it — the HUD is hidden by default until toggled on, and also stays hidden while the pause menu is open.
- **Style doesn't persist between sessions**: Confirm `oxmysql` is running and the `mnc_drift_styles` table was created; check console for the "table checked/created" log line on startup.
- **Score resets unexpectedly mid-drift**: This is by design — hard health/velocity drops are treated as crashes and end the current chain (see `isCrash` logic in `client.lua`).

---

## 📝 Credits & License

**Author**: Stan Leigh
**Version**: 1.0.0
**Framework**: QBCore

Distributed as part of the MnCLosSantos mod-dump collection — open source, please credit the original author if you edit and re-release.
