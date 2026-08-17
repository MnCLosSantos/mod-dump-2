# 🚗 MNC Jacks

[![FiveM](https://img.shields.io/badge/FiveM-Ready-green.svg)](https://fivem.net/)
[![QBCore](https://img.shields.io/badge/Framework-QBCore-blue.svg)](https://github.com/qbcore-framework)
[![Version](https://img.shields.io/badge/Version-1.1.4-brightgreen.svg)]()

---

## 🌟 Overview

MNC Jacks is a physical car jack and axle stand system that lets players actually lift one side of a vehicle off the ground using a `car_jack` item, then secure it in place with two `axle_stand` props per side before it's safe to work underneath. The vehicle is frozen and visually raised in real time, with synced props and target zones so other players see the same lift state. All lift state is session-only (in memory) — nothing is written to the database.

---

## ✨ Key Features

**Jacking**
- Using `car_jack` near a vehicle opens a menu to lift the left or right side (only if that side isn't already raised)
- Player must walk to a marker at the jack point and press `E`, then complete a progress bar with a mechanic animation while a floor jack prop spawns and the vehicle visibly rises
- The raised side is frozen in place and kept locked to its target height/rotation by a keep-alive thread, synced to all clients via `mnc-jacks:raiseVehicle`

**Axle Stands**
- After jacking a side, using `axle_stand` triggers a two-stage placement: walk to each of two stand positions (front/rear on that side) and press `E`, each with its own progress bar and prop attached to the player's hand during placement
- Once both stands are placed, the side is marked "secured" and a `qb-target` zone is added on the stand props to allow removal later
- Removing stands runs the same two-step `E`-press + progress bar flow in reverse, returns both `axle_stand` items to the player's inventory, and lowers the vehicle (partially if the other side is still raised, fully once both are down)

**Multiplayer Sync & Cleanup**
- Lift state (stage, raised flags, stand net IDs) is tracked server-side per plate and broadcast to all clients so props and vehicle position stay consistent for everyone nearby
- Integrates with `mnc-parking`: listens for `mnc-parking:vehicleRecalled` / `mnc-parking:vehicleUntracked` events to automatically clean up jack/stand state and props if a vehicle is stored or despawned while lifted

---

## 📋 Requirements

| Dependency | Required |
|---|---|
| qb-core | Yes |
| ox_lib | Yes |
| qb-target | Yes (used for stand-removal interaction zones, not declared in fxmanifest `dependencies{}`) |
| oxmysql | Loaded via `@oxmysql/lib/MySQL.lua` but not actually used — this resource is session-only with no database persistence |

---

## 🚀 Installation

```bash
# Place into your resources folder
[server-data]/resources/[custom]/mnc-jacks/
```

```lua
# server.cfg
ensure mnc-jacks
```

Add the two items from `install/items.txt` (`car_jack`, `axle_stand`) to your `qb-core/shared/items.lua`. No database table is used — all lift/stand state lives in server memory for the current session only and resets on resource restart.

---

## ⚙️ Configuration Guide

```lua
Config.CarJackItem   = 'car_jack'
Config.AxleStandItem = 'axle_stand'
Config.InteractDistance = 2.5

Config.Lift = {
    StandsPerSide = 2,
    JackPropModel  = 'prop_carjack',
    StandPropModel = 'xs_prop_x18_axel_stand_01a',
    JackDuration  = 5000,
    StandDuration = 3000,
    RaiseHeight   = 0.20,
    StandOffsets = {
        left  = { [1] = { x = -0.65, y =  1.10, z = -0.30 }, [2] = { x = -0.65, y = -1.10, z = -0.30 } },
        right = { [1] = { x =  0.65, y =  1.10, z = -0.30 }, [2] = { x =  0.65, y = -1.10, z = -0.30 } },
    },
}
```

`RaiseHeight` controls how far (in metres) the vehicle lifts off the ground. `StandOffsets` defines the exact local-space position of each of the two stand placement points per side, relative to the vehicle's center.

---

## 🎮 Controls & Usage

- **Use `car_jack`** near a vehicle to open the jack menu and choose a side to lift; walk to the marked jack point and press `E` to start the progress bar.
- **Use `axle_stand`** after a side is jacked to begin placing stands — walk to each marked position and press `E`.
- **Target interaction** on placed stand props to remove them (lowers that side and returns the stands to inventory).

---

## 🔧 Troubleshooting

- **"No active jack session" when using an axle stand**: You must jack up a side first with `car_jack` before axle stands can be placed.
- **Vehicle stays floating/frozen after the resource restarts**: Since state is session-only and stored in memory, a resource restart while a vehicle is jacked can leave it visually stuck — approach the vehicle and use the items again, or restart the resource fully to clear all lift state.
- **Stand props not appearing for other players**: Confirm `qb-target` is running; prop networking relies on `NetworkRegisterEntityAsNetworked` from the spawning client, so a poor connection can delay visibility for others briefly.
- **Vehicle doesn't fully lower**: Both sides must be un-stood (stands removed) individually — one side lowers only partially while the other side remains raised.

---

## 📝 Credits & License

**Author**: Stan Leigh
**Version**: 1.1.4
**Framework**: QBCore

Distributed as part of the MnCLosSantos mod-dump collection — open source, please credit the original author if you edit and re-release.
