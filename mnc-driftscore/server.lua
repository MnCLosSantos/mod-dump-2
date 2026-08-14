-- server.lua
local QBCore = exports['qb-core']:GetCoreObject()

MySQL.ready(function()
    MySQL.Async.execute([[
        CREATE TABLE IF NOT EXISTS `mnc_drift_styles` (
            `id` int(11) NOT NULL AUTO_INCREMENT,
            `citizenid` varchar(50) NOT NULL,
            `style` int(11) NOT NULL DEFAULT 1,
            `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
            `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
            PRIMARY KEY (`id`),
            UNIQUE KEY `citizenid` (`citizenid`)
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
    ]], {}, function(rowsChanged)
        print("^2[mnc-driftscore]^7 mnc_drift_styles table checked/created successfully!")
    end)
end)

QBCore.Functions.CreateCallback('mnc-driftscore:getStyle', function(source, cb)
    local Player = QBCore.Functions.GetPlayer(source)
    if not Player then 
        cb(Config.DefaultStyle)
        return 
    end

    local citizenid = Player.PlayerData.citizenid
    if not citizenid then
        cb(Config.DefaultStyle)
        return
    end
    
    MySQL.Async.fetchScalar('SELECT style FROM mnc_drift_styles WHERE citizenid = ?', {citizenid}, function(result)
        if result then
            cb(result)
        else
            MySQL.Async.insert('INSERT INTO mnc_drift_styles (citizenid, style) VALUES (?, ?)', {
                citizenid, Config.DefaultStyle
            }, function(insertId)
                cb(Config.DefaultStyle)
            end)
        end
    end)
end)

RegisterNetEvent('mnc-driftscore:saveStyle', function(style)
    local src = source
    local Player = QBCore.Functions.GetPlayer(src)
    if not Player then return end

    local citizenid = Player.PlayerData.citizenid
    if not citizenid then return end
    
    MySQL.Async.execute('UPDATE mnc_drift_styles SET style = ? WHERE citizenid = ?', {
        style, citizenid
    }, function(affectedRows)
        if affectedRows == 0 then
            MySQL.Async.insert('INSERT INTO mnc_drift_styles (citizenid, style) VALUES (?, ?)', {
                citizenid, style
            })
        end
    end)
end)

print("^2[mnc-driftscore]^7 Script loaded successfully!")