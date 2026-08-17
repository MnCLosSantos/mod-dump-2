# 🔧 MnC Vehicle Manager v2

[![FiveM](https://img.shields.io/badge/FiveM-Ready-green.svg)](https://fivem.net/)
[![QBCore](https://img.shields.io/badge/Framework-QBCore-blue.svg)](https://github.com/qbcore-framework)
[![Version](https://img.shields.io/badge/Version-2.3.7-brightgreen.svg)]()

---

## 🌟 Overview

MnC Vehicle Manager v2 is an admin/developer tool for building out a server's vehicle database. While sitting in any vehicle — including ones not yet added to QBCore — an admin runs `/vehiclelua` to open an NUI editor that auto-detects the vehicle's brand, class, and type, lets them set a name/price/category/shop, and either appends a new entry to a local `vehiclesaves.lua` file or directly patches an existing entry in `qb-core/shared/vehicles.lua` on disk.

---

## ✨ Key Features

**Vehicle Inspector** (`/vehiclelua`)
- Must be run while seated in a vehicle; reads the current vehicle's model, in-game display name, manufacturer, and GTA vehicle class directly from natives (`GetMakeNameFromVehicleModel`, `GetVehicleClass`, `GetVehicleType`)
- Ships a full brand-name lookup table (`BrandMap`) that converts raw GTA manufacturer codes (e.g. `UBERMACH`, `SCHAFTER2`) into properly formatted display names, including umlauts (Übermacht, Schäfter)
- Builds full and "unavailable" (not yet in `QBCore.Shared.Vehicles`) vehicle lists, including every drivable model in the game's vehicle CD image, for cross-referencing in the UI

**Save / Edit Actions**
- **Save New Vehicle** — appends a new formatted Lua table entry to `vehiclesaves.lua` in this resource's own folder (does not touch `qb-core` directly)
- **Replace/Edit Vehicle** — locates an existing model entry inside `qb-core/shared/vehicles.lua` by parsing the file's brace structure, and rewrites that block in place with the edited name/brand/price/category/type/shop, preserving original indentation
- **Export Chunk** — bulk-appends multiple vehicle entries to `vehiclesaves.lua` in one call, used for exporting large batches from the UI
- **Create Vehicle List** — generates a `vehiclelist.lua` report of every drivable model on the server, split into "In QB-Core" vs "Not in QB-Core" sections with duplicate spawncode warnings

**Access Control**
- All server actions require either the `command` ace permission or QBCore `admin` permission

---

## 📋 Requirements

| Dependency | Required |
|---|---|
| ox_lib | Yes (declared dependency) |
| qb-core | Yes (used throughout client/server code, though not listed in `dependencies {}`) |

---

## 🚀 Installation

```bash
# Place into your resources folder
[server-data]/resources/[custom]/mnc-vehiclemanager-v2/
```

```lua
# server.cfg
ensure mnc-vehiclemanager-v2
```

No database tables are used — all output is written to Lua files on disk (`vehiclesaves.lua`, `vehiclelist.lua` inside this resource's folder). The server process needs write access to this resource's directory, and to `qb-core`'s directory if using the "Replace/Edit Vehicle" feature (since it edits `qb-core/shared/vehicles.lua` directly).

---

## ⚙️ Configuration Guide

This resource has no `config.lua` — all behavior is hardcoded in `client.lua`/`server.lua`. The only user-facing setting is the command name itself, registered via:

```lua
RegisterCommand('vehiclelua', function()
    -- opens the vehicle inspector UI for the vehicle you're currently in
end, false)
```

---

## 🎮 Controls & Usage

- **`/vehiclelua`** — while seated in any vehicle, opens the vehicle data editor for that vehicle

---

## 🔧 Troubleshooting

- **"Enter a vehicle first"** — the command only works while the player is physically inside a vehicle.
- **Replace/Edit fails with "Vehicle not found"** — the model string must exactly match an existing `model = '...'` entry in `qb-core/shared/vehicles.lua`; the patcher does a literal text search and will fail silently if the model isn't present.
- **"Cannot write vehiclesaves.lua" / "Write failed"** — the server process lacks file write permission on the resource (or `qb-core`) directory; check your hosting provider's file permissions.
- **Direct edits to `qb-core/shared/vehicles.lua` are risky** — this resource rewrites that file with raw string manipulation; always keep a backup before using the Replace/Edit feature on a production vehicles file.

---

## 📝 Credits & License

**Author**: Stan Leigh
**Version**: 2.3.7
**Framework**: QBCore

Distributed as part of the MnCLosSantos mod-dump collection — open source, please credit the original author if you edit and re-release.
