version '0.0.1'
author 'Fipperz Scripts'
description 'Score Board System'
fx_version 'bodacious'
game 'gta5'

files {'ui/index.html', 'ui/images/*.png'}

ui_page "ui/index.html"

client_scripts {'client.js'}

server_scripts {'@oxmysql/lib/MySQL.lua', 'server.js'}

