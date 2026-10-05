@echo off

cd /d C:\TMS-Server

echo ============================== > C:\TMS-Server\task-log.txt
echo TMS TASK START %date% %time% >> C:\TMS-Server\task-log.txt
echo ============================== >> C:\TMS-Server\task-log.txt

echo Current directory: >> C:\TMS-Server\task-log.txt
cd >> C:\TMS-Server\task-log.txt

echo. >> C:\TMS-Server\task-log.txt
echo Node version: >> C:\TMS-Server\task-log.txt
"C:\Program Files\nodejs\node.exe" -v >> C:\TMS-Server\task-log.txt 2>&1

echo. >> C:\TMS-Server\task-log.txt
echo Starting server... >> C:\TMS-Server\task-log.txt

set HOSTNAME=0.0.0.0
set PORT=3000
set NODE_ENV=production

"C:\Program Files\nodejs\node.exe" "C:\TMS-Server\server.js" >> C:\TMS-Server\task-log.txt 2>&1

echo. >> C:\TMS-Server\task-log.txt
echo Server exited with code %ERRORLEVEL% >> C:\TMS-Server\task-log.txt