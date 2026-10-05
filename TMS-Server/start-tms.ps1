$env:HOSTNAME = "0.0.0.0"
$env:PORT = "3000"
$env:NODE_ENV = "production"

Set-Location "C:\TMS-Server"

& "C:\Program Files\nodejs\node.exe" "C:\TMS-Server\server.js"