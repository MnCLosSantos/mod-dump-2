# 🔫 MnC Weapon UI v2

[![FiveM](https://img.shields.io/badge/FiveM-Ready-green.svg)](https://fivem.net/)
[![QBCore](https://img.shields.io/badge/Framework-QBCore-blue.svg)](https://github.com/qbcore-framework)
[![Version](https://img.shields.io/badge/Version-1.1.0-brightgreen.svg)]()

---

## 🌟 Overview

MnC Weapon UI v2 adds a persistent on-screen HUD widget that shows the player's currently equipped weapon name, ammo count, and weapon icon whenever they're armed. It automatically hides during vehicle-mounted weapon use, in the pause menu, or when unarmed, and ships 25 selectable visual skins/styles that each player's choice is saved to the database and restored on reconnect.

---

## ✨ Key Features

**Live Weapon HUD**
- Polls the player's selected weapon and ammo count roughly every 110ms and pushes updates to the NUI only when something changes
- Automatically hides the HUD when unarmed, in the pause menu, using a vehicle-mounted weapon (`VEHICLE_WEAPON_*`), or in special weaponized vehicles that don't switch weapon hash (e.g. fire trucks) via a configurable vehicle model list
- Resolves the weapon's display name from `QBCore.Shared.Weapons` and its icon from whichever inventory is running (`ox_inventory`, `qb-inventory`, or a configurable `qs-inventory`/Quasar path)
- Separate configurable position/size for the weapon HUD and for in-game style-change notifications

**25 Selectable UI Skins**
- `/weaponui [1-25]` switches between 25 named visual styles (e.g. "Classic Green", "Cyberpunk Neon", "Dark Matrix", "Quantum Flux"), each defined with its own background gradient, text color, and accent color in `config.lua`
- The `html/` folder ships a dedicated `style1.css` through `style25.css` file for each skin plus a shared `app.js`/`notify.css`, so switching styles is a pure CSS swap in the NUI — no need to touch any of the style files to add a new server's branding, just point to a different numbered style
- Selected style is saved server-side per citizenid and automatically restored the next time the player loads in

**Persistence**
- Auto-creates the `mnc_weapon_ui_styles` table (`citizenid`, `style`) on resource start if it doesn't already exist
- An `install/weapon_ui_database.sql` file is also provided for manual import if preferred

---

## 📋 Requirements

| Dependency | Required |
|---|---|
| qb-core | Yes |
| oxmysql | Yes |

---

## 🚀 Installation

```bash
# Place into your resources folder
[server-data]/resources/[custom]/mnc-weaponUi-V2/
```

```lua
# server.cfg
ensure mnc-weaponUi-V2
```

This resource auto-creates its `mnc_weapon_ui_styles` table via `CREATE TABLE IF NOT EXISTS` on startup, so no manual SQL import is strictly required — but `install/weapon_ui_database.sql` is provided if you prefer to import it ahead of time.

---

## ⚙️ Configuration Guide

```lua
Config.DefaultStyle = 1 -- default skin (1-25)

Config.UI = {
    x = "15px", y = "537px", width = "auto", height = "auto",
}

Config.NotifyUI = {
    x = "1685px", y = "20px", width = "auto", height = "auto", duration = 5000,
}

Config.StyleCommand = "weaponui" -- command to switch styles

-- Framework auto-detect (do not hardcode — set automatically)
Config.UseOxInventory = GetResourceState('ox_inventory') == 'started'
Config.UseQbInventory = GetResourceState('qb-inventory') == 'started'
```

Each of the 25 entries in `Config.Styles` defines a named skin, e.g.:

```lua
[3] = {
    name = "Neon Dark",
    bg = "rgba(20,20,20,0.4)",
    text = "#0be881",
    accent = "rgba(11, 232, 129, 0.3)",
    description = "Dark background with bright neon green"
},
```

---

## 🎮 Controls & Usage

- **`/weaponui [1-25]`** — switch the weapon HUD's visual style; the choice is saved automatically and persists across sessions

---

## 🔧 Troubleshooting

- **HUD never appears** — the widget only shows once `QBCore:Client:OnPlayerLoaded` has fired and the player's saved style has loaded from the database; check the F8 console for `[mnc-weaponui]` debug prints.
- **Weapon icon is blank** — the icon path is built from whichever inventory resource is detected running (`ox_inventory`/`qb-inventory`); if neither is running, no image path is generated.
- **Style doesn't persist after restart** — confirm `oxmysql` is connected and the `mnc_weapon_ui_styles` table was created (check console for the "table checked/created successfully" message).
- **HUD shows during vehicle-mounted weapon use in an unlisted vehicle** — add the vehicle's spawn name to `specialWeaponizedVehicles` in `client.lua` if it doesn't switch to a `VEHICLE_WEAPON_*` hash automatically.

---

## 📝 Credits & License

**Author**: Stan Leigh
**Version**: 1.1.0
**Framework**: QBCore

Distributed as part of the MnCLosSantos mod-dump collection — open source, please credit the original author if you edit and re-release.
