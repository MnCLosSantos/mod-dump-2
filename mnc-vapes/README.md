# 💨 MnC Vapes

[![FiveM](https://img.shields.io/badge/FiveM-Ready-green.svg)](https://fivem.net/)
[![QBCore](https://img.shields.io/badge/Framework-QBCore-blue.svg)](https://github.com/qbcore-framework)
[![Version](https://img.shields.io/badge/Version-1.0.0-brightgreen.svg)]()

---

## 🌟 Overview

MnC Vapes is a full vape-device roleplay system: players equip and puff on disposable vapes, weed pens, or rebuildable box mods, each with battery, coil, and tank management. A trio of placeable crafting stations lets players brew flavoured vape juice, process raw fruit into flavour concentrates, and build vape hardware from scratch (batteries, shells, coils, tanks, chargers) all the way up to fully packaged starter kits.

---

## ✨ Key Features

**Vaping**
- Three vape device types (`dispo_vape`, `weed_pen`, `box_vape`) each with configurable tank size, ml-per-puff consumption, coil lifespan, max battery, and puff/exhale animation
- Puffing consumes tank liquid and coil life; juice flavours apply configurable timed status effects (speed boost, infinite stamina, strength, health/food regen, drunk/psycho walk, camera shake, fog, confusion, etc.) defined per-flavour in `Config.VapeJuices`
- Per-vape context menu (`ox_lib` context) showing battery %, coil status, tank status, and current liquid, with actions to fill with juice, charge, and (on `box_vape`) swap coils/tanks
- Server-authoritative state cached per player and persisted to MySQL (`mnc_vape_data`, `mnc_juice_data`) with citizenid/slot tracking

**Crafting Stations**
- Three station types — Vape Juice Station, Vape Crafting Station, Concentrate Station — each definable as fixed job-locked/public world locations (`Config.CraftingStations`, `Config.VapeCraftingStations`, `Config.ConcentrateCraftingStations`) or as placeable items (`juice_table`, `vape_table`, `concentrate_table`) players can drop anywhere via qb-target
- **Juice crafting**: combines base liquid, flavour concentrate, nicotine, and empty bottles into 60ml/120ml juice bottles or 30ml cannabis juices
- **Vape crafting**: builds every hardware component from raw materials (copper, plastic, aluminum, iron, glass) — batteries, wiring, shells, LCD screens, tanks, coils (single and 3/6/10-packs), chargers — and assembles them into complete vapes, then into fully packaged starter sets (`box_set`, `dispo_set`, `weed_set`)
- **Concentrate crafting**: processes raw fruit/sugar/mint items with water and solvent into flavour concentrates used by juice recipes
- All recipes are job/grade-restricted per station and have configurable craft times and ingredient costs

---

## 📋 Requirements

| Dependency | Required |
|---|---|
| qb-core | Yes |
| qb-target | Yes (crafting station interaction) |
| qb-inventory | Yes |
| ox_lib | Yes |
| oxmysql | Yes |

---

## 🚀 Installation

```bash
# Place into your resources folder
[server-data]/resources/[custom]/mnc-vapes/
```

```lua
# server.cfg
ensure mnc-vapes
```

This resource auto-creates its database tables (`mnc_vape_data`, `mnc_juice_data`) on startup via `CREATE TABLE IF NOT EXISTS` — no manual SQL import needed. `install/items.txt` contains ~70+ ready-to-paste QBCore item entries (vapes, juices, crafting components, packaging, starter sets, and raw ingredients like fruit/flavour concentrates) that must be added to your `qb-core` shared items before use; `install/images/` ships matching item icons.

---

## ⚙️ Configuration Guide

```lua
Config.PuffsPerMl      = 25      -- max puffs per 1ml of vape juice
Config.ChargeTime      = 80000   -- ms to fully charge a battery
Config.FillTime        = 10000   -- ms to refill a tank
Config.PuffCooldown    = 5000    -- ms between puffs
```

```lua
Config.Vapes = {
    ['box_vape'] = {
        label = 'Box Vape',
        tankSize = 5,
        mlPerPuff = 0.04,
        maxCoilPuffs = 500,
        maxBattery = 250,
        canChangeCoil = true,
        canChangeTank = true,
        juiceType = 'regular',
        puffAnimation = 'WORLD_HUMAN_SMOKING',
    },
}
```

```lua
Config.CraftingStations = {
    { coords = vector3(377.54, -820.07, 29.3), heading = 90.0, label = 'Vape Juice Station', job = 'bestbudz', minGrade = 0, prop = 'v_ret_ml_tablea' },
    { coords = vector3(481.46, -570.84, 28.92), heading = 85.0, label = 'Vape Juice Station', prop = 'v_ret_ml_tablea' }, -- no job = public
}
```

---

## 🎮 Controls & Usage

- **Use a vape item from your inventory** to equip and start puffing (`WORLD_HUMAN_SMOKING` animation)
- **qb-target on an equipped vape / crafting table** — opens the relevant status/crafting menu (fill juice, charge, swap coil/tank, craft recipes)
- **Placeable table items** (`juice_table`, `vape_table`, `concentrate_table`) are used from the inventory to drop a portable crafting station anywhere

---

## 🔧 Troubleshooting

- **Crafting station has no options** — check the station's `job`/`minGrade` restriction in config; leaving `job` unset makes it public.
- **Vape state doesn't persist across sessions** — confirm `oxmysql` is connected and the `mnc_vape_data`/`mnc_juice_data` tables were created (check console on resource start for the confirmation print).
- **Items missing from inventory menus** — verify every entry from `install/items.txt` was added to your shared items; many crafting recipes reference items (e.g. `weed_stems`, raw fruit) that may already exist if you run `mnc-drugeffects`.
- **Coil/tank options missing on a vape** — only vapes with `canChangeCoil`/`canChangeTank = true` (currently `box_vape`) expose swap options; disposables are fixed by design.

---

## 📝 Credits & License

**Author**: Stan Leigh
**Version**: 1.0.0
**Framework**: QBCore

Distributed as part of the MnCLosSantos mod-dump collection — open source, please credit the original author if you edit and re-release.
