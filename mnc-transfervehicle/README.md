# 📄 MnC Transfer Vehicle

[![FiveM](https://img.shields.io/badge/FiveM-Ready-green.svg)](https://fivem.net/)
[![QBCore](https://img.shields.io/badge/Framework-QBCore-blue.svg)](https://github.com/qbcore-framework)
[![Version](https://img.shields.io/badge/Version-1.0.0-brightgreen.svg)]()

---

## 🌟 Overview

MnC Transfer Vehicle is a peer-to-peer vehicle ownership transfer system built around a signed digital document. A seller sits in their vehicle, runs a command to bring up a transfer form, sends it to a nearby buyer, and the buyer reviews and digitally signs to accept (or deny) the deal. On acceptance, the vehicle's database ownership changes hands, payment is exchanged, and both parties receive a permanent, re-viewable transfer document item as a receipt.

---

## ✨ Key Features

**Transfer Flow**
- `/transfervehicle [ID] [amount]` — must be run while sitting in an owned, unfinanced vehicle; opens an NUI seller form pre-filled with the vehicle's plate, model, and mileage pulled from `player_vehicles`
- Seller enters a buyer's server ID and sale amount (or leaves amount blank/zero to gift the vehicle); the buyer must be within `Config.TransferDistance` meters
- Buyer receives an NUI approval screen showing vehicle and price details, and must digitally sign to accept or can deny the transfer
- Pending transfers expire automatically after `Config.DocumentExpiration` (default 5 minutes) if the buyer doesn't respond

**Transaction Handling**
- Prevents selling a vehicle with an outstanding finance balance when `Config.PreventFinanceSelling = true`
- On acceptance, updates `player_vehicles.citizenid`/`license` to the buyer, deducts/pays the agreed amount from cash or bank (whichever the buyer can afford), and transfers `vehiclekeys` ownership
- Both buyer and seller receive a `vehicletransdocument` inventory item containing the completed transfer record (date, plate, names, phone numbers, price, payment method, signature) which can be re-opened/viewed at any time via `QBCore.Functions.CreateUseableItem`

**Safety Checks**
- Blocks self-transfers, offline buyers/sellers, and transfers where the seller doesn't actually own the vehicle
- ESC key and NUI close callback both force-close the UI and release NUI focus to prevent players getting stuck

---

## 📋 Requirements

| Dependency | Required |
|---|---|
| qb-core | Yes |
| oxmysql | Yes (`player_vehicles` lookup and update) |

Note: although not declared in `fxmanifest.lua`'s `dependencies {}`, the client and server code call `exports['ox_lib']:notify` for all notifications — `ox_lib` must also be running.

---

## 🚀 Installation

```bash
# Place into your resources folder
[server-data]/resources/[custom]/mnc-transfervehicle/
```

```lua
# server.cfg
ensure mnc-transfervehicle
```

Add a `vehicletransdocument` item to your `qb-core` shared items (useable, holds the completed transfer info in its metadata) — this resource does not ship an `install/items.txt`, so the item must be created manually.

---

## ⚙️ Configuration Guide

```lua
Config.Debug = false
Config.PreventFinanceSelling = true   -- block selling vehicles with a balance
Config.SignatureRequired = true       -- buyer must sign to accept
Config.DocumentExpiration = 300000    -- ms before a pending transfer expires (5 min)
Config.TransferDistance = 5.0         -- max meters between buyer and seller
```

---

## 🎮 Controls & Usage

- **`/transfervehicle [buyerID] [amount]`** — while in your vehicle, opens the seller UI (arguments are optional and can also be filled in through the form)
- **ESC** — force-closes the transfer UI at any point

---

## 🔧 Troubleshooting

- **"Cannot sell a financed vehicle"** — the vehicle's `balance` column in `player_vehicles` is greater than 0; pay it off first or disable `Config.PreventFinanceSelling`.
- **Notifications never appear** — this script calls `exports['ox_lib']:notify` directly without declaring `ox_lib` as a dependency; make sure it's started before this resource.
- **"Buyer is too far away"** — both players must be within `Config.TransferDistance` meters when the seller sends the document, not just when the command was run.
- **Transfer silently expires** — the buyer has `Config.DocumentExpiration` milliseconds to accept or deny; both parties are notified when it times out.

---

## 📝 Credits & License

**Author**: Your Name (as listed in fxmanifest.lua)
**Version**: 1.0.0
**Framework**: QBCore

Distributed as part of the MnCLosSantos mod-dump collection — open source, please credit the original author if you edit and re-release.
