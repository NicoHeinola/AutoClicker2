@echo off

REM Go to frontend folder 
cd /d %~dp0
cd ../frontend

call npm run tauri build

cd /d %~dp0