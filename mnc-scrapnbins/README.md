# 🗑️ MnC Scrap N Bins

[![FiveM](https://img.shields.io/badge/FiveM-Ready-green.svg)](https://fivem.net/)
[![QBCore](https://img.shields.io/badge/Framework-QBCore-blue.svg)](https://github.com/qbcore-framework)
[![Version](https://img.shields.io/badge/Version-2.0.0-brightgreen.svg)]()

---

## 🌟 Overview

MnC Scrap N Bins turns the map's dumpsters, trash bags, litter piles, and wrecked-vehicle props into searchable loot spots. Players target a bin or scrap prop, pass an `ox_lib` skill-check minigame, sit through a search animation with contextual rummage sound effects, and have a chance to walk away with tiered loot — or, if unlucky while digging through bins, a nasty needle-prick injury.

---

## ✨ Key Features

**Searchable World Props**
- Dozens of hardcoded prop hashes are targetable: standard/recycle bins, trash bags, dumpsters, loose rubbish piles, and scrapyard car wrecks (`Config.BinModels` / `Config.ScrapModels`)
- Works with either `qb-target` or `ox_target` (`Config.Target`)
- Per-entity search cooldown (`Config.Cooldown`) prevents repeatedly farming the same prop

**Search Flow**
- Optional skill-check minigame before searching, separately configurable for bins vs. scrap (`wasd`/`1234`/`arrowkeys`/`qwer` key types, per-attempt difficulty, duration)
- Progress bar/circle via `qb`, `ox_lib_bar`, or `ox_lib_circle` (`Config.Progress`) with a searching animation and movement/combat locked
- Context-aware rummage sound effects (`Config.RummageSounds`) picked based on the searched prop's archetype (bin/skip/bag/scrap)

**Loot System**
- `Config.ChanceToFind` gates whether anything is found at all
- Tiered loot table (`Common`/`Uncommon`/`Rare`) with cumulative percentage rolls and per-tier item pools, quantity capped by `Config.MaxAmount`
- Supports both `qb-inventory` and `ox_inventory` for adding items, with inventory-full handling

**Needle Prick Hazard**
- Searching **bins only** (not scrap) carries a configurable chance (`Config.NeedlePrick.Chance`) of a needle-prick injury: notification, red screen effect, camera shake, pain animation, needle sound, and gradual health drain over several damage ticks

---

## 📋 Requirements

| Dependency | Required |
|---|---|
| qb-core | Yes |
| ox_lib | Yes |
| qb-target or ox_target | Yes (choose via `Config.Target`) |
| qb-inventory or ox_inventory | Yes (choose via `Config.Inventory`) |

---

## 🚀 Installation

```bash
# Place into your resources folder
[server-data]/resources/[custom]/mnc-scrapnbins/
```

```lua
# server.cfg
ensure mnc-scrapnbins
```

No database tables are required. Make sure every item referenced in `Config.Tiers` (e.g. `plastic`, `metal_scrap`, `advancedlockpick`, `repairkit`, `joint`) exists in your inventory's item list.

---

## ⚙️ Configuration Guide

```lua
Config.CoreName  = 'qb-core'
Config.Target    = "qb-target"     -- "qb-target" or "ox_target"
Config.Inventory = "qb-inventory"  -- "qb-inventory" or "ox_inventory"
Config.Notify    = "ox_lib"        -- "qb" or "ox_lib"
Config.Progress  = "ox_lib_bar"    -- "qb", "ox_lib_bar", "ox_lib_circle"

Config.SearchTime   = 8000   -- ms to search
Config.Cooldown     = 45000  -- ms cooldown per entity
Config.ChanceToFind = 70     -- % chance to find anything
Config.MaxAmount    = 3      -- max item quantity found

Config.Tiers = {
    Common   = { Chance = 70, Items = {'plastic', 'metal_scrap', 'rubber', 'tosti', 'glass'} },
    Uncommon = { Chance = 25, Items = {'aluminum', 'steel', 'copper', 'lockpick', 'lighter'} },
    Rare     = { Chance = 5,  Items = {'advancedlockpick', 'repairkit', 'joint', 'pistol_ammo'} },
}
```

```lua
Config.NeedlePrick = {
    Enabled = true,
    Chance = 10,        -- % chance per successful bin search
    HealthDrain = 15,
    DrainTicks = 5,
    TickInterval = 1600, -- ms between damage ticks
}
```

---

## 🎮 Controls & Usage

- **Target a bin, dumpster, trash bag, or scrap wreck** and select "Search Trash" / "Search Scrap" from the qb-target/ox_target menu to begin.

---

## 🔧 Troubleshooting

- **Nothing happens when targeting props** — verify `Config.Target` matches whichever targeting resource is actually running.
- **"Failed to add item"** — check that the rolled item name from `Config.Tiers` exists in `QBCore.Shared.Items` (invalid items are skipped and logged when `Config.Debug = true`).
- **Skill check never appears** — set `Config.Minigame.Enabled = false` to bypass it entirely, or verify `ox_lib`'s skill-check UI is loading correctly.

---

## 📝 Credits & License

**Author**: Stan Leigh
**Version**: 2.0.0
**Framework**: QBCore

Distributed as part of the MnCLosSantos mod-dump collection — open source, please credit the original author if you edit and re-release.
