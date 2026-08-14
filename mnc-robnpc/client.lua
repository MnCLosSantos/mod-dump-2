-- client.lua
local QBCore = exports['qb-core']:GetCoreObject()

local robbedPeds = {}
local WEAPON_UNARMED = `WEAPON_UNARMED`

-- Add target option to all non-player human peds
exports['qb-target']:AddGlobalPed({
    options = {
        {
            type = "client",
            event = "mnc-robnpc:client:AttemptRob",
            icon = "fas fa-sack-dollar",
            label = "Rob Pedestrian",
            canInteract = function(entity)
                return IsPedHuman(entity) 
                    and not IsPedAPlayer(entity) 
                    and not IsEntityDead(entity) 
                    and not IsPedInAnyVehicle(entity, false)
                    and not robbedPeds[entity]
            end,
        },
    },
    distance = 2.5
})

-- Attempt to rob the targeted NPC
RegisterNetEvent('mnc-robnpc:client:AttemptRob', function(data)
    local ped = data.entity
    local playerPed = PlayerPedId()

    if #(GetEntityCoords(playerPed) - GetEntityCoords(ped)) > 3.0 then return end

    -- Check if player has drawn weapon (not unarmed)
    local currentWeapon = GetSelectedPedWeapon(playerPed)
    if currentWeapon == WEAPON_UNARMED then
        lib.notify({
            title = 'Robbery Failed',
            description = 'You need to draw a weapon to rob someone!',
            type = 'error',
            duration = 5000
        })
        return
    end

    -- Check if player has any weapon in inventory
    QBCore.Functions.TriggerCallback('mnc-robnpc:server:HasWeapon', function(hasWeapon)
        if not hasWeapon then
            lib.notify({
                title = 'Robbery Failed',
                description = 'You need a weapon in your inventory!',
                type = 'error',
                duration = 5000
            })
            return
        end

        -- Load animation dicts
        lib.requestAnimDict('missminuteman_1ig_2')

        -- Freeze the ped in place
        FreezeEntityPosition(ped, true)
        SetEntityInvincible(ped, true)
        SetBlockingOfNonTemporaryEvents(ped, true)
        SetPedKeepTask(ped, true)  -- Lock ped tasks to prevent interruptions

        -- Force ped to face the player
        TaskTurnPedToFaceEntity(ped, playerPed, -1)

        -- Lock legs/movement completely during robbery
        TaskStandStill(ped, Config.RobDuration + 2000)

        -- Play hands-up animation (looping with flag 49)
        TaskPlayAnim(ped, 'missminuteman_1ig_2', 'handsup_base', 8.0, -8.0, -1, 49, 0, false, false, false)

        -- Make player aim at the ped during robbery
        TaskAimGunAtEntity(playerPed, ped, Config.RobDuration + 1000, true)
		
        -- Progress bar
        local success = lib.progressBar({
            duration = Config.RobDuration,
            label = 'Robbing pedestrian...',
            useWhileDead = false,
            canCancel = true,
            disable = {
                move = true,
                car = true,
            },
        })

        -- Clear player aiming task
        ClearPedTasks(playerPed)

        -- Always unfreeze and clear ped tasks after robbery (success or cancel)
        FreezeEntityPosition(ped, false)
        SetEntityInvincible(ped, false)
        SetBlockingOfNonTemporaryEvents(ped, false)
        ClearPedTasks(ped)
		SetPedFleeAttributes(ped, 0, false)          -- reset any previous restrictions
        SetPedFleeAttributes(ped, 1 << 15, false)     -- 0x8000 = force cower (optional - remove if you don't want cowering)
        TaskReactAndFleePed(ped, playerPed)

        if success then
            -- Mark ped as robbed (prevents re-robbery)
            robbedPeds[ped] = true

            local coords = GetEntityCoords(ped)
            TriggerServerEvent('mnc-robnpc:server:GiveCash', coords)
        else
            lib.notify({
                title = 'Robbery Cancelled',
                description = 'You feel sorry for the local and regret your lifes choices.',
                type = 'inform',
                duration = 8000
            })
        end
    end)
end)

-- Notification from server about received mone
RegisterNetEvent('mnc-robnpc:client:MoneyReceived', function(cashAmount, itemsGiven)
    local message = 'You stole **$' .. cashAmount .. '**'

    if #itemsGiven > 0 then
        message = message .. ' + '
        for i, item in ipairs(itemsGiven) do
            if i > 1 then message = message .. ', ' end
            message = message .. item.amount .. 'x ' .. item.label
        end
    end

    lib.notify({
        title = 'Robbery Success',
        description = message,
        type = 'success',
        duration = 7500
    })
end)

-- Notification for jobs about robbery
RegisterNetEvent('mnc-robnpc:client:NotifyRobbery', function(coords)
    local streetHash1, streetHash2 = GetStreetNameAtCoord(coords.x, coords.y, coords.z)
    local streetName1 = GetStreetNameFromHashKey(streetHash1)
    local streetName2 = GetStreetNameFromHashKey(streetHash2)
    local zoneName = GetLabelText(GetNameOfZone(coords.x, coords.y, coords.z))
    
    local location = (zoneName ~= "" and zoneName ~= "UNKNOWN") and zoneName or "Unknown Area"
    if streetName1 ~= "" then 
        location = streetName1 
    end
    if streetName2 ~= "" then 
        location = location .. " / " .. streetName2 
    end

    lib.notify({
        title = 'Local Robbery Alert',
        description = string.format(Config.NotifyMessage, location),
        type = 'inform',
        duration = Config.NotifyDuration
    })

    local listening = true
    SetTimeout(Config.NotifyDuration, function()
        listening = false
    end)

    CreateThread(function()
        while listening do
            if IsControlJustPressed(0, 45) then  -- R key
                listening = false

                -- Add temporary blip
                local blip = AddBlipForCoord(coords.x, coords.y, coords.z)
                SetBlipSprite(blip, Config.BlipSprite)
                SetBlipColour(blip, Config.BlipColour)
                SetBlipScale(blip, Config.BlipScale)
                SetBlipAsShortRange(blip, true)
                BeginTextCommandSetBlipName("STRING")
                AddTextComponentString(Config.BlipLabel)
                EndTextCommandSetBlipName(blip)

                -- Set GPS waypoint
                SetNewWaypoint(coords.x, coords.y)

                Wait(Config.BlipTime * 1000)
                RemoveBlip(blip)
                break
            end
            Wait(0)
        end
    end)
end)