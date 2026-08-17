# 🔥 MNC Anti-Lag

[![FiveM](https://img.shields.io/badge/FiveM-Ready-green.svg)](https://fivem.net/)
[![QBCore](https://img.shields.io/badge/Framework-QBCore-blue.svg)](https://github.com/qbcore-framework)
[![Version](https://img.shields.io/badge/Version-1.0.0-brightgreen.svg)]()

---

## 🌟 Overview

MNC Anti-Lag adds an automatic rally-style anti-lag/exhaust backfire system to turbocharged vehicles. Once a kit is installed, the vehicle randomly fires exhaust pops (synced sound + particle flames at the exhaust bones) whenever RPM is high and the throttle is lifted, without any player input needed — mimicking a real anti-lag system. Three tiered kits with different burst frequency/intensity are installed and removed as usable inventory items by mechanics.

---

## ✨ Key Features

**Automatic backfire system**
- A background loop checks the driven vehicle's RPM and throttle every tick; when RPM is above `Config.MinRPM` and (if `Config.LiftOffOnly` is true) the throttle has been lifted, there's a randomized chance each interval to fire a burst of pops.
- Each burst plays synced audio (via NUI) and spawns particle flames (`veh_backfire`) positioned and rotated to match the vehicle's actual exhaust bone(s), with a fallback rear-mounted flame position for vehicles with no exhaust bones.
- Burst interval, pop count, particle scale, and volume all have randomized jitter so it doesn't sound perfectly mechanical, and roughly 55% of eligible windows are skipped to keep the effect present but not constant.
- Flame effects are broadcast to nearby players so other clients see the same backfire on that vehicle.

**Tiered kits**
- Basic, Street, and Pro anti-lag kits (`antilag_1`/`antilag_2`/`antilag_3`) each define their own burst interval, flame count, particle scale, and volume, with Pro being the loudest/most frequent.
- Kits enforce a tier hierarchy — a lower-or-equal tier can't be installed over an existing kit.
- Installing requires the mechanic to be within 5m of the target vehicle; an open-hood animation and `ox_lib` progress bar play during install.
- An `antilag_toolbox` item starts a removal flow: walk to a marker at the front of the vehicle, press **E**, then complete a progress bar to remove the kit and return the base kit item.

**Persistence & sync**
- Installed kits are stored in an auto-created `vehicle_antilag` MySQL table keyed by plate, synced to all clients via `mnc-antilag:syncData` whenever installed/removed.

**Admin commands**
- `/antilag1`, `/antilag2`, `/antilag3 [id]` — admin-only; asks the target's own client to verify it has GTA's base Turbo mod (mod slot 18) before force-granting the kit.

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
[server-data]/resources/[custom]/mnc-antilag/
```

```lua
# server.cfg
ensure mnc-antilag
```

Add the item definitions in `install/items.txt` (`antilag_1`, `antilag_2`, `antilag_3`, `antilag_toolbox`) to your `qb-core/shared/items.lua`. The resource automatically creates its `vehicle_antilag` MySQL table on first start.

---

## ⚙️ Configuration Guide

```lua
Config.RequireJob = true
Config.AllowedJobs = { ['mechanic'] = 0, ['bennys'] = 0 }

Config.Kits = {
    ['antilag_3'] = {
        label = 'Pro Anti-Lag Kit', item = 'antilag_3',
        burstInterval = 700, flameCount = 4, scale = 1.5,
        volumeScale = 0.07, soundFile = 'antilag_pop.ogg',
    },
}

Config.MinRPM      = 0.65  -- 0.0–1.0 RPM threshold before pops can fire
Config.LiftOffOnly = true  -- true = only fires when throttle is released
```

`AllowedJobs` gates who can install/remove kits. Each `Kits` entry controls how often (`burstInterval`), how many pops per burst (`flameCount`), and how loud/large the effect is for that tier. `MinRPM`/`LiftOffOnly` control the overall trigger conditions for the automatic backfire behavior.

---

## 🎮 Controls & Usage

- No manual activation is needed — once a kit is installed, backfire pops fire automatically based on RPM/throttle while driving.
- Use `antilag_1` / `antilag_2` / `antilag_3` near a vehicle (base Turbo mod required) to install that tier.
- Use `antilag_toolbox` near a vehicle, then walk to the marker at the front and press **E** to start the removal sequence.
- `/antilag1`, `/antilag2`, `/antilag3 [id]` — admin-only grants.

---

## 🔧 Troubleshooting

- **No pops fire at all** — confirm the vehicle has GTA's base Turbo mod (mod index 18) installed; anti-lag kits are layered on top of it.
- **"No vehicle within 5m"** during install — the mechanic must be standing close to the target vehicle when using the kit item.
- **"An equal or higher anti-lag kit is already installed"** — use the `antilag_toolbox` to remove the existing kit before installing a different tier.
- **Sound out of sync with flames** — this shouldn't normally happen since flames are only spawned in lockstep with each audio pop; if it does, check that `html/sounds/antilag_pop.ogg` loaded correctly via the NUI.

---

## 📝 Credits & License

**Author**: Stan Leigh
**Version**: 1.0.0
**Framework**: QBCore

Distributed as part of the MnCLosSantos mod-dump collection — open source, please credit the original author if you edit and re-release.
