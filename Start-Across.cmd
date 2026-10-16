@echo off
cd /d "%~dp0across"
echo Across preview: http://127.0.0.1:4173
echo Keep this window open while using the app. Press Ctrl+C to stop.
node server.mjs
pause
