# ⚙️ MNC Diffs

[![FiveM](https://img.shields.io/badge/FiveM-Ready-green.svg)](https://fivem.net/)
[![QBCore](https://img.shields.io/badge/Framework-QBCore-blue.svg)](https://github.com/qbcore-framework)
[![Version](https://img.shields.io/badge/Version-1.0.0-brightgreen.svg)]()

---

## 🌟 Overview

MNC Diffs is a vehicle handling-modifier script that lets mechanics install a **Welded Differential** or a **Limited Slip Differential (LSD)** on a vehicle's rear axle. Installed diffs dynamically scale the vehicle's traction handling floats based on RPM and gear in real time, giving welded diffs a constant locked-wheelspin feel and LSDs a threshold-based lock/unlock behavior, with the diff wearing out after 3 hours of drive time.

---

## ✨ Key Features

**Installation & Removal**
- Two-stage wheel-by-wheel install minigame: player walks to the rear-left then rear-right wheel and presses `E` at each, with an on-screen marker and progress bar
- `diff_toolbox` item lets mechanics remove an installed differential and return it to their inventory
- Tier system prevents downgrading — a higher-tier diff (LSD, tier 2) can overwrite a lower-tier one (Welded, tier 1), but not the reverse

**Physics Behavior**
- Welded diffs continuously lerp `fTractionCurveMin`/`fTractionLossMult` toward locked values as RPM rises past a configurable threshold
- LSDs engage (lock) above a configured RPM and release below a lower RPM threshold to avoid flicker, and only affect handling while "locked"
- A configurable `GearSpinCutoff` suppresses the diff effect above a given gear, restoring stock handling at high speed
- Original vehicle handling floats are cached per-vehicle and fully restored on exit or diff removal

**Job & Item Gating**
- Requires an allowed job/grade (`Config.AllowedJobs`: mechanic, mechanic2, mechanic3, beekers, autoexotics, bennys, tuner) to install or remove, re-validated server-side
- Consumes the corresponding item (`welded_diff` / `lsd_diff`) on install; returns it to inventory on manual removal

**Persistence & Wear**
- Diff assignments are stored per-plate in a `vehicle_diffs` MySQL table (auto-created with `CREATE TABLE IF NOT EXISTS`) and synced live to all clients
- Each diff wears out and is auto-removed after 3 hours of accumulated in-vehicle time (`Config.DiffDurationMs`)

**Admin Tools**
- `/diffwelded [id]` and `/difflsd [id]` commands (admin permission required) instantly grant a differential to a target player's current vehicle, bypassing item/job checks

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
[server-data]/resources/[custom]/mnc-diffs/
```

```lua
# server.cfg
ensure mnc-diffs
```

Add the three items from `install/items.txt` (`welded_diff`, `lsd_diff`, `diff_toolbox`) to your `qb-core/shared/items.lua`. The `vehicle_diffs` table is created automatically on resource start via `CREATE TABLE IF NOT EXISTS` — no manual SQL import needed.

---

## ⚙️ Configuration Guide

```lua
Config.RequireJob = true
Config.AllowedJobs = {
    mechanic = 0, mechanic2 = 0, mechanic3 = 0,
    beekers = 0, autoexotics = 0, bennys = 2, tuner = 1,
}

Config.Diffs = {
    welded_diff = {
        item = 'welded_diff', type = 'welded', installTime = 5000,
        SpinRpm = 0.90, TractionMin = 0.45, SpinLossMult = 2.5, GearSpinCutoff = 4,
    },
    lsd_diff = {
        item = 'lsd_diff', type = 'lsd', installTime = 6000,
        LsdLockRpm = 1.95, LsdUnlockRpm = 1.85,
        SpinRpm = 1.95, TractionMin = 0.20, SpinLossMult = 4.0, GearSpinCutoff = 3,
    },
}

Config.DiffDurationMs = 3 * 60 * 60 * 1000  -- 3 hours
Config.ApplyDistance = 2.5
```

`AllowedJobs` maps job names to the minimum grade required to install/remove diffs. Each entry under `Config.Diffs` tunes how aggressively that differential type locks traction (`TractionMin`, `SpinLossMult`) and at what RPM it engages/disengages.

---

## 🎮 Controls & Usage

- **Install**: Use a `welded_diff` or `lsd_diff` item near a vehicle, then walk to each rear wheel and press `E` when prompted.
- **Remove**: Use the `diff_toolbox` item near a vehicle with a diff installed, then repeat the wheel-by-wheel `E` prompt to remove it.
- **`/diffwelded [player id]`** and **`/difflsd [player id]`**: Admin-only commands to instantly install a diff on a target's current vehicle (defaults to yourself if no ID given).

---

## 🔧 Troubleshooting

- **Diff install/removal silently fails**: Confirm your job and grade match an entry in `Config.AllowedJobs` — the server re-validates this even if the client-side check passes.
- **"Already has an equal or higher differential"**: The tier system blocks installing a Welded diff (tier 1) over an existing LSD (tier 2); remove the existing diff first.
- **Handling doesn't feel like it's changing**: Check `Config.Debug = true` for console output of live RPM/traction values, and verify the vehicle hasn't exceeded `GearSpinCutoff`.

---

## 📝 Credits & License

**Author**: Stan Leigh
**Version**: 1.0.0
**Framework**: QBCore

Distributed as part of the MnCLosSantos mod-dump collection — open source, please credit the original author if you edit and re-release.
