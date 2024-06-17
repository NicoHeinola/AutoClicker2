@echo off
setlocal enabledelayedexpansion

set updater_name=Updater

REM Go to updater folder 
cd /d %~dp0
cd ../backend/updater

REM set correct venv
IF EXIST .\.venv\Scripts\activate.bat (
    call .\.venv\Scripts\activate.bat
)

REM Hidden imports
set "HiddenImportsList="
set "HiddenImports="
for %%a in (%HiddenImportsList%) do (
    REM Concatenate the strings with "--hidden-import"
    set "HiddenImports=!HiddenImports! --hidden-import=%%a"
)

REM Excluded modules
set "ExcludedModuleList=pyinstaller pyinstaller-hooks-contrib"
set "ExcludedModules="
for %%a in (%ExcludedModuleList%) do (
    REM Concatenate the strings with "--hidden-import"
    set "ExcludedModules=!ExcludedModules! --exclude-module=%%a"
)

pyinstaller --noconfirm --onedir --optimize=2 --console --clean --name=%updater_name% %ExcludedModules% main.py
copy "../../version" "./dist/%updater_name%/_internal/version"

cd /d %~dp0