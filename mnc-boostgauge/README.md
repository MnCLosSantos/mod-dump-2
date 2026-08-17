# 📟 MNC Boost Gauge

[![FiveM](https://img.shields.io/badge/FiveM-Ready-green.svg)](https://fivem.net/)
[![QBCore](https://img.shields.io/badge/Framework-QBCore-blue.svg)](https://github.com/qbcore-framework)
[![Version](https://img.shields.io/badge/Version-2.4.7-brightgreen.svg)]()

---

## 🌟 Overview

MNC Boost Gauge is an on-screen NUI boost/PSI gauge that appears automatically whenever the driver is in a turbocharged vehicle. It simulates realistic boost pressure from RPM, throttle, and speed/load, scales its max PSI based on installed turbo/remap parts (via the companion `mnc-performanceparts` resource if present), and lets players customize the gauge with 40 visual styles, 20 bezel finishes, and 20 preset combos — all purchasable/appliable as inventory items and saved per vehicle.

---

## ✨ Key Features

**Live boost simulation**
- Runs a per-frame update loop (~60fps while visible) that calculates a simulated boost PSI from RPM, throttle position, and speed-vs-RPM "engine load," smoothed with a spring-damper (`smoothDamp`) for realistic needle movement.
- Automatically shows/hides based on whether the player is driving (not just riding in) a vehicle with GTA's base Turbo mod (mod slot 18) installed, and hides for blacklisted vehicle classes (boats, helicopters, planes).
- Integrates with the optional `mnc-performanceparts` resource: if a remap or upgraded turbo part is detected on the vehicle, max PSI is pulled from `Config.RemapPSI`/`Config.TurboPSI` tables instead of the flat baseline (`Config.Mod18StandardPSI`).
- Triggers a needle-sweep animation on engine start and reacts to vehicle light state (for gauge backlighting cues sent to the NUI).

**Extensive customization**
- 40 gauge visual styles and 20 bezel styles (chrome, carbon fiber, neon colors, holographic, cyberpunk, etc.), each installable as its own usable inventory item that swaps the currently equipped style/bezel and returns the previously equipped item to inventory.
- 20 combo "preset" items that apply a matched style + bezel pair in one use.
- Optional install minigame (`ox_lib` skill check, 3 difficulty levels) or a standard progress bar/circle, both with a mechanic repair animation.
- `/bgauge <style> <bezel>` or `/bgauge presetN` command lets authorized jobs manually change styles/presets without consuming an item, useful for admin testing.

**Persistence**
- Selected style/bezel per vehicle plate is stored in an auto-created `vehicle_gauges` MySQL table and re-applied automatically whenever that vehicle is entered.

---

## 📋 Requirements

| Dependency | Required |
|---|---|
| qb-core | Yes |
| ox_lib | Yes |
| oxmysql | Yes |
| mnc-performanceparts | Optional (enables remap/turbo-aware PSI scaling) |

---

## 🚀 Installation

```bash
# Place into your resources folder
[server-data]/resources/[custom]/mnc-boostgauge/
```

```lua
# server.cfg
ensure mnc-boostgauge
```

Add all the item definitions in `install/items.txt` (40 gauge style items, 20 bezel items, and 20 preset combo items, e.g. `boostgauge_classic`, `bezel_chrome`, `boostgauge_preset1`) to your `qb-core/shared/items.lua`. The resource automatically creates its `vehicle_gauges` MySQL table on first start.

---

## ⚙️ Configuration Guide

```lua
Config.LockCommandToJobs = true
Config.AllowedJobs = {
    ['mechanic'] = true, ['mechanic2'] = true,
    ['autoexotics'] = true, ['mncracing'] = true,
    ['yachtclub'] = true, ['admin'] = true,
}

Config.Installation = {
    requireMinigame = true,
    minigameDifficulty = 3,   -- 1 (easiest) to 3 (hardest)
    progressDuration = 5000,
    progressType = 'bar',     -- 'bar' or 'circle'
}

Config.UI = {
    x = 0.289, y = 0.75, scale = 0.30,
    defaultStyle = 6, defaultBezel = 2, bezelThickness = 9,
}

Config.Mod18StandardPSI = 6.0  -- baseline PSI for stock Turbo mod, no remap
```

`AllowedJobs`/`LockCommandToJobs` restrict the `/bgauge` admin command. `Config.Installation` controls whether installing a style/bezel item requires an `ox_lib` skill-check minigame or just a progress bar. `Config.UI` sets the gauge's screen position, scale, and default style/bezel. `Config.Mod18StandardPSI`, `Config.TurboPSI`, and `Config.RemapPSI` control how max PSI scales with installed turbo/remap tier.

---

## 🎮 Controls & Usage

- Gauge appears automatically while driving a vehicle with a Turbo mod installed.
- Use any `boostgauge_*` (style), `bezel_*`, or `boostgauge_presetN` item while driving to change the equipped look (may require a minigame/progress bar).
- `/bgauge <style#> <bezel#>` or `/bgauge presetN` — restricted to jobs in `Config.AllowedJobs`; manually sets style/bezel without consuming an item.

---

## 🔧 Troubleshooting

- **Gauge never appears** — the vehicle needs GTA's base Turbo mod (mod index 18) installed, and must not be a boat/helicopter/plane (blacklisted classes).
- **Max PSI stays at baseline even with a remap installed** — `mnc-performanceparts` must be running and the vehicle's installed parts must match the keys in `Config.TurboPSI`/`Config.RemapPSI`.
- **Item won't apply / "already applied" error** — the item's style/bezel/preset matches what's already equipped on that plate; equip a different one.
- **`/bgauge` says "not authorized"** — the player's job isn't listed in `Config.AllowedJobs` while `Config.LockCommandToJobs` is enabled.
- Per the project's own `TODO.rtf`: gauge visibility for non-land vehicles (air/boat) is a known area still being refined.

---

## 📝 Credits & License

**Author**: Stan Leigh
**Version**: 2.4.7
**Framework**: QBCore

Distributed as part of the MnCLosSantos mod-dump collection — open source, please credit the original author if you edit and re-release.
