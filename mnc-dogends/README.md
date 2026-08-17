# 🚬 MNC Dogends

[![FiveM](https://img.shields.io/badge/FiveM-Ready-green.svg)](https://fivem.net/)
[![QBCore](https://img.shields.io/badge/Framework-QBCore-blue.svg)](https://github.com/qbcore-framework)
[![Version](https://img.shields.io/badge/Version-1.0.0-brightgreen.svg)]()

---

## 🌟 Overview

MNC Dogends is a roleplay item-crafting script where players scavenge discarded cigarette butts and lighters from the world, then roll their own cigarettes using a rolling machine, rolling papers, and either the collected butts or purchased tobacco pouches plus a filter pack. It uses `qb-target` to interact with ashtray/butt props and lighter props, and `ox_lib` for skill checks, progress bars, and context menus.

---

## ✨ Key Features

**Pickup**
- `qb-target` interaction on a configurable set of ashtray/cigarette-butt prop models lets players "Pick up cigarette butts", each attempt gated behind an `ox_lib` WASD skill check and a progress bar (with mining animation and a random pickup sound)
- Lighter props (also targetable) can be picked up the same way, awarding a `lighter` item and deleting the world prop
- Prevents re-picking the same entity twice per session

**Rolling System**
- Rolling machine (`rolling_machine`) usable item opens a menu to roll cigarettes either from **cigarette butts** (5 butts per cigarette) or from one of several **tobacco pouches** (0.5g per cigarette), each pouch tracking remaining grams via item metadata
- Player also chooses a **filter pack** (slim, normal, or mint), each tracking remaining filter count via item metadata; mint filters produce a distinct `roll_up_mint` output item instead of the standard `roll_up`
- Batch rolling of 1–10 cigarettes at once, with rolling time scaling per cigarette and requiring that many rolling papers
- Requires at least 1 rolling paper before the menu can even open, and rolls back consumed papers if a later resource check fails

---

## 📋 Requirements

| Dependency | Required |
|---|---|
| qb-core | Yes |
| qb-target | Yes |
| qb-inventory | Yes |
| ox_lib | Yes |

---

## 🚀 Installation

```bash
# Place into your resources folder
[server-data]/resources/[custom]/mnc-dogends/
```

```lua
# server.cfg
ensure mnc-dogends
```

Add the items from `install/items.txt` to your `qb-core/shared/items.lua`: `paper`, `cig_butt`, `rolling_machine`, `roll_up`, `roll_up_mint`, nine tobacco pouch variants (`tobacco_classic/normal/mature_125/30/50`), and three filter packs (`filter_pack_slim`, `filter_pack_normal`, `filter_pack_mint`). No database table is used — everything is tracked via item metadata.

---

## ⚙️ Configuration Guide

```lua
Config.PickupItem = 'cig_butt'
Config.RequiredButts = 5
Config.TobaccoPerRoll = 0.5
Config.RollTime = 8000
Config.SearchTime = 3500

Config.TobaccoPouches = {
    tobacco_classic_125 = { grams = 12.5, max_rolls = 30 },
    -- ...
}
Config.FilterPacks = {
    filter_pack_slim = 45, filter_pack_normal = 30, filter_pack_mint = 25,
}

Config.Minigame = { Enabled = true, Type = "wasd", Difficulty = {"easy", "easy", "medium"} }
```

`RequiredButts` and `TobaccoPerRoll` set the cost of one cigarette under each rolling method. `Config.Minigame` controls the skill check played before every pickup — set `Enabled = false` to skip it entirely.

---

## 🎮 Controls & Usage

- **Target interaction**: Approach a cigarette-butt/ashtray prop or lighter prop and use the `qb-target` prompt to pick it up (skill check required).
- **Rolling**: Use the `rolling_machine` item, then choose a method (butts or tobacco pouch), a filter pack, and a quantity (1–10) from the context menus.

---

## 🔧 Troubleshooting

- **"You don't have enough butts or usable tobacco to roll anything"**: You need at least 5 butts or 0.5g+ in a tobacco pouch, plus a filter pack with remaining filters, before the rolling machine menu will open.
- **Pickup prompt doesn't appear**: Confirm `qb-target` is running and the prop you're targeting matches one of the models in `Config.PropModels` / `Config.LighterModels`.
- **Inventory full errors**: The script uses `qb-inventory`'s `CanAddItem` export before granting items — free up space if pickups are being rejected.

---

## 📝 Credits & License

**Author**: Stan Leigh
**Version**: 1.0.0
**Framework**: QBCore

Distributed as part of the MnCLosSantos mod-dump collection — open source, please credit the original author if you edit and re-release.
