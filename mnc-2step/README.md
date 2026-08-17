# 🏁 MNC 2-Step

[![FiveM](https://img.shields.io/badge/FiveM-Ready-green.svg)](https://fivem.net/)
[![QBCore](https://img.shields.io/badge/Framework-QBCore-blue.svg)](https://github.com/qbcore-framework)
[![Version](https://img.shields.io/badge/Version-1.0.0-brightgreen.svg)]()

---

## 🌟 Overview

MNC 2-Step adds a JDM-style two-step/launch control system to turbocharged vehicles. Holding the configured key while stationary produces a rev-limiter bounce with rapid backfire pops and exhaust flames; holding it while rolling produces a rolling 2-step effect; releasing the key while moving fires a launch burst and applies a temporary engine torque boost. Three tiered kits (Basic/Street/Pro) are installed and removed as usable inventory items by mechanics, with all data persisted per vehicle plate in MySQL.

---

## ✨ Key Features

**Two-step / launch control effects**
- **Rev-limiter bounce** — while the vehicle is stationary and the 2-step key is held above an RPM threshold, fires periodic backfire pop bursts (sound + particle flames at exhaust bones) at a configurable interval.
- **Rolling 2-step** — same effect while the vehicle is moving above a speed threshold, with its own interval/RPM threshold.
- **Launch boost** — releasing the key while moving fast enough triggers a big backfire burst plus a temporary `SetVehicleEngineTorqueMultiplier` boost for a configurable duration.
- All three effects (limiter, rolling, boost) have independently tunable burst interval, flame count, particle scale, volume, and sound file, both globally and per-kit.
- Flame effects on the local player's vehicle are broadcast to nearby players via `mnc-2step:broadcastFlames` so other clients see the backfire too.

**Kit installation (usable items)**
- Three tiered kits — Basic, Street, Pro (`basic_2step`, `street_2step`, `pro_2step`) — each overriding the global limiter/rolling/boost settings with stronger effects at higher tiers.
- Installing requires the vehicle to already have GTA's base Turbo mod (mod slot 18) installed, and the player must stand within 1m of the front of the vehicle. A tier check blocks installing an equal-or-lower kit over an existing one.
- A `twostep_toolbox` item removes any installed kit from a vehicle and returns the original kit item to the player's inventory.
- Both install and removal open the hood, play a mechanic animation, and run an `ox_lib` progress bar.

**Persistence & sync**
- Installed kits are stored in a `vehicle_2step` MySQL table (auto-created on start) keyed by plate, and synced live to all clients via `mnc-2step:syncData` whenever a kit is applied or removed.

**Admin commands**
- `/twostepbasic`, `/twostepstreet`, `/twosteppro` `[id]` — admin-only, directly grants a kit to a target player's current vehicle, bypassing item/job checks.

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
[server-data]/resources/[custom]/mnc-2step/
```

```lua
# server.cfg
ensure mnc-2step
```

Add the item definitions in `install/items.txt` (`basic_2step`, `street_2step`, `pro_2step`, `twostep_toolbox`) to your `qb-core/shared/items.lua`. The resource automatically creates its `vehicle_2step` MySQL table on first start — no manual SQL import needed.

---

## ⚙️ Configuration Guide

```lua
Config.RequireJob = true
Config.AllowedJobs = {
    ['mechanic'] = 0,
    ['bennys']   = 0,
}

Config.TwoStepKey = 21  -- Right Shift (INPUT_SPRINT)

Config.Limiter = {
    burstInterval = 300,   -- ms between bursts while on limiter
    rpmThreshold  = 0.82,  -- RPM must be at/above this to be "on the limiter"
    speedThreshold = 35.0, -- m/s below this = stationary/limiter mode
}

Config.Kits = {
    ['pro_2step'] = {
        label = 'Pro 2-Step',
        item  = 'pro_2step',
        limiter = { burstInterval = 160, flameCount = 5, scale = 2.0, volumeScale = 0.10 },
        -- ...rolling / boost overrides
    },
}
```

`AllowedJobs` restricts which jobs/grades can install and remove kits. `TwoStepKey` is the FiveM control index held to activate the effect (default Right Shift). `Config.Limiter` / `Config.Rolling` / `Config.Boost` are the global defaults for each effect state, and `Config.Kits` overrides them per kit tier.

---

## 🎮 Controls & Usage

- **Hold configured key (default Right Shift)** while driving a turbocharged vehicle with an installed kit to activate 2-step effects; release while moving to trigger the launch boost.
- Use a `basic_2step` / `street_2step` / `pro_2step` item near the front of a vehicle to install that tier's kit (base Turbo mod required first).
- Use `twostep_toolbox` to remove an installed kit.
- `/twostepbasic`, `/twostepstreet`, `/twosteppro [id]` — admin-only kit grants.

---

## 🔧 Troubleshooting

- **Nothing happens when holding the key** — the vehicle needs GTA's base Turbo mod (mod index 18) installed before a 2-step kit works at all.
- **"Only authorized mechanics can install this"** — the installing player's job/grade isn't listed in `Config.AllowedJobs`.
- **"An equal or higher 2-step kit is already installed"** — kits can only be upgraded, not downgraded or reinstalled at the same tier; use the removal toolbox first.
- **No sound plays** — pops are played through the NUI (`html/index.html`) using `html/sounds/twostep_pop.ogg`; verify the resource's `files {}` entries loaded correctly and the client isn't muting resource audio.

---

## 📝 Credits & License

**Author**: Stan Leigh
**Version**: 1.0.0
**Framework**: QBCore

Distributed as part of the MnCLosSantos mod-dump collection — open source, please credit the original author if you edit and re-release.
