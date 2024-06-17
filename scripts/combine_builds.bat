@echo off

set app_name=AutoClicker2
set backend_name=AutoClicker2
set updater_name=Updater
set frontend_name=AutoClicker2

cd /d %~dp0
cd ../

mkdir ".\build\%app_name%"

robocopy "./backend/dist/%backend_name%" "./build/%app_name%" /E /COPY:DAT /R:2 /W:5 /NFL /NDL /NJH /NJS >nul
robocopy "./backend/updater/dist/%updater_name%" "./build/%app_name%" /E /XC /XN /XO /COPY:DAT /R:2 /W:5 /NFL /NDL /NJH /NJS >nul

mkdir ".\build\%app_name%\frontend"
copy ".\frontend\src-tauri\target\release\%frontend_name%.exe" ".\build\%app_name%\frontend\%app_name%_frontend.exe"
copy "./version" "./build/%app_name%/_internal/version"

cd /d %~dp0