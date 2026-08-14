fx_version 'cerulean'
game 'gta5'

author 'Stan Leigh'
description 'mnc-boostgauge - QBCore boost gauge with 25 styles, remap aware'
version '2.4.7'

ui_page 'html/index.html'

shared_script 'config.lua'

client_scripts {
    'client.lua',
	'client_items.lua',
}

server_scripts {
	'@oxmysql/lib/MySQL.lua',
    'server_items.lua',
}

files {
    'html/index.html',
    'html/script.js',
    'html/style.css'
}

dependencies {
    'qb-core',
    'ox_lib',
    'mnc-performanceparts' -- optional
}