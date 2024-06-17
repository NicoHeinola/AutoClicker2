@echo off
setlocal enabledelayedexpansion

set backend_name=AutoClicker2

REM Go to backend folder 
cd /d %~dp0
cd ../backend

REM set correct venv
IF EXIST .\.venv\Scripts\activate.bat (
    call .\.venv\Scripts\activate.bat
)

REM Hidden imports
set "HiddenImportsList=engineio.async_drivers.threading logging.config"
set "HiddenImports="
for %%a in (%HiddenImportsList%) do (
    REM Concatenate the strings with "--hidden-import"
    set "HiddenImports=!HiddenImports! --hidden-import=%%a"
)

REM Excluded modules
set "ExcludedModuleList=tkinter pyinstaller pyinstaller-hooks-contrib"
set "ExcludedModules="
for %%a in (%ExcludedModuleList%) do (
    REM Concatenate the strings with "--hidden-import"
    set "ExcludedModules=!ExcludedModules! --exclude-module=%%a"
)

pyinstaller --noconfirm --onedir --optimize=2 --noconsole --clean --add-data="./images;./images" --icon="./images/icons/icon_clicking.ico" --name=%backend_name% %HiddenImports% %ExcludedModules% app.py

copy "./.env_release" "./dist/%backend_name%/_internal/.env"
copy "../version" "./dist/%backend_name%/_internal/version"
robocopy "./migrations" "./dist/%backend_name%/migrations" /E /COPY:DAT /R:2 /W:5 /NFL /NDL /NJH /NJS >nul

cd /d %~dp0
