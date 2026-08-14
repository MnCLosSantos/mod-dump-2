-- fxmanifest.lua
fx_version 'cerulean'
game 'gta5'
lua54 'yes'

author 'Stan Leigh' -- Keeping similar, but you can change
description 'Drift Score HUD'
version '1.0.0'

ui_page 'html/index.html'

files {
    'html/index.html',
    'html/style.css',
    'html/script.js'
}

client_script 'client.lua'
server_scripts {
    '@oxmysql/lib/MySQL.lua',
    'server.lua'
}
shared_script 'config.lua'

dependencies {
    'qb-core',
    'oxmysql',
    'ox_lib'
}