# 🩼 MNC Crutch

[![FiveM](https://img.shields.io/badge/FiveM-Ready-green.svg)](https://fivem.net/)
[![QBCore](https://img.shields.io/badge/Framework-QBCore-blue.svg)](https://github.com/qbcore-framework)
[![Version](https://img.shields.io/badge/Version-2.1.0-brightgreen.svg)]()

---

## 🌟 Overview

MNC Crutch is an EMS roleplay tool that lets ambulance-job players fit an injured player with a temporary mobility aid — a crutch or cane. The affected player gets a limping animation/movement clipset, an attached prop, and (optionally) restricted sprinting, jumping, melee, and weapon use for a set duration, automatically clearing itself when the timer expires.

---

## ✨ Key Features

**EMS interaction (qb-target)**
- Adds a global player target option, "EMS: Manage Mobility Aid," visible only to the configured EMS job, which opens a menu (via `ox_lib` context menu or `qb-menu`, per config) to give a Crutch, give a Cane, or remove an existing aid from the targeted player.
- A second target option, "EMS: Check Aid Time," lets EMS see how many minutes remain on a patient's active aid (togglable via `Config.EMSCanSeeRemaining`).

**Mobility aid effects**
- Applying an aid attaches the configured prop (`v_med_crutch01` for crutch, `prop_cs_walking_stick` for cane) to the player's hand bone and switches their movement clipset to an injured walk (`move_m@injured`).
- Optionally restricts sprint, jump, melee attacks, aiming, and weapon firing/switching while the aid is active (`Config.RestrictMovement`).
- Aids auto-expire after a configurable duration (default 15 minutes for Crutch, 10 for Cane) and are automatically removed and re-synced if the player reloads their outfit (`qb-clothing:client:reloadOutfit`) or if the resource restarts.

**Configurable UX**
- Menu system (`ox_lib` or `qb-menu`), notification system (`ox_lib` or QBCore notify), and progress indicator style (`bar`, `circle`, or legacy `progressbar` resource) are all switchable in config, each install/removal action plays an EMS repair animation during its progress bar.

---

## 📋 Requirements

| Dependency | Required |
|---|---|
| qb-core | Yes |
| qb-target | Yes |
| ox_lib | Yes (default menu/notify/progress system) |
| oxmysql | Loaded by manifest, but no queries are made — no DB table is used |

---

## 🚀 Installation

```bash
# Place into your resources folder
[server-data]/resources/[custom]/mnc-crutch/
```

```lua
# server.cfg
ensure mnc-crutch
```

No database setup is required — active aids are tracked entirely in server memory and cleared on resource restart.

---

## ⚙️ Configuration Guide

```lua
Config.MenuSystem    = "qb-menu"   -- "ox_lib" or "qb-menu"
Config.NotifySystem  = "ox_lib"    -- "ox_lib" or "qb-notify"
Config.ProgressType  = "bar"       -- "bar", "circle", or "QB"

Config.DefaultDuration = { Crutch = 15, Cane = 10 } -- minutes

Config.RestrictMovement    = true       -- disable sprint/jump while using an aid
Config.EMSCanSeeRemaining  = true       -- show remaining time to EMS on target
Config.EMSJob              = "ambulance" -- job allowed to apply/remove aids
```

`MenuSystem`/`NotifySystem`/`ProgressType` swap out which UI library is used for each part of the flow. `DefaultDuration` sets how long each aid type lasts before auto-removal. `EMSJob` gates who can use the target options at all.

---

## 🎮 Controls & Usage

- EMS (job matching `Config.EMSJob`) targets another player via `qb-target` and selects "EMS: Manage Mobility Aid" to open the give/remove menu, or "EMS: Check Aid Time" to see remaining duration.
- Affected players automatically get the limping animation, attached prop, and (if enabled) movement/combat restrictions until the timer runs out or EMS manually removes the aid.

---

## 🔧 Troubleshooting

- **Target option doesn't appear** — the acting player's job must exactly match `Config.EMSJob` (default `ambulance`).
- **Player isn't restricted from sprinting/fighting** — check `Config.RestrictMovement` is set to `true`.
- **Aid doesn't reappear after changing clothes** — this is handled automatically via the `qb-clothing:client:reloadOutfit` event; if using a different clothing resource that doesn't fire this event, the aid prop may need to be manually reapplied.
- **Aids vanish after a server restart** — expected behavior; active aid state is stored in memory only and is cleared (not persisted) when the resource stops.

---

## 📝 Credits & License

**Author**: Stan Leigh
**Version**: 2.1.0
**Framework**: QBCore

Distributed as part of the MnCLosSantos mod-dump collection — open source, please credit the original author if you edit and re-release.
