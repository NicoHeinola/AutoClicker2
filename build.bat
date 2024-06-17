@echo off 
setlocal enabledelayedexpansion

set seperatorLvl1=------------------------------------------------
set seperatorLvl2=+------------------+

rmdir /s /q build

REM Navigate to the project directory
cd /d %~dp0
cd backend

REM Remove old .spec files and build/dist folders

if exist *.spec (
    del /q *.spec
)
rmdir /s /q build
rmdir /s /q dist

REM Default variables
set name=AutoClicker2

REM Hidden imports
set "HiddenImportsList=engineio.async_drivers.threading dns.asyncbackend dns.asyncquery dns.asyncresolver dns.e164 dns.namedict dns.tsigkeyring dns.versioned dns.dnssec logging.config"
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

REM set correct venv
IF EXIST .\.venv\Scripts\activate.bat (
    call .\.venv\Scripts\activate.bat
)

REM Install PyInstaller if it is not already installed
pip show pyinstaller >nul 2>&1
if %errorlevel% neq 0 (
    echo Installing PyInstaller...
    pip install pyinstaller
)

echo %seperatorLvl1%
echo Building backend
echo %seperatorLvl2%
echo Hidden imports: %HiddenImports%
echo %seperatorLvl2%
echo Excluded modules: %ExcludedModules%
echo %seperatorLvl2%

pyinstaller --onedir --optimize=2 --console --clean --add-data="./images;./images" --icon="./images/icons/icon_clicking.ico" --name=%name% %HiddenImports% %ExcludedModules% app.py

copy "./.env_release" "./dist/%name%/_internal/.env"
copy "../version" "./dist/%name%/_internal/version"
robocopy "./migrations" "./dist/%name%/migrations" /E /COPY:DAT /R:2 /W:5 /NFL /NDL /NJH /NJS >nul

echo %seperatorLvl2%
echo Backend is built
echo %seperatorLvl1%
echo Building updater
echo %seperatorLvl2%

REM Build updater
cd ../
cd ./updater

REM set correct venv
IF EXIST .\.venv\Scripts\activate.bat (
    call .\.venv\Scripts\activate.bat
)

if exist *.spec (
    del /q *.spec
)
rmdir /s /q build
rmdir /s /q dist

pyinstaller --onedir --optimize=2 --console --clean --name=updater %ExcludedModules% main.py
copy "../version" "./dist/updater/_internal/version"

echo %seperatorLvl2%
echo Updater is built
echo %seperatorLvl1%
echo Building frontend
echo %seperatorLvl2%

REM Build and copy frontend
cd ../
cd ./frontend

call npm run tauri build
echo Frontend build is complete
echo %seperatorLvl1%
echo Moving everything into a single build

cd ../
robocopy "./backend/dist/%name%" "./build/%name%" /E /COPY:DAT /R:2 /W:5 /NFL /NDL /NJH /NJS >nul

mkdir ".\build\%name%\updater"
robocopy "./updater/dist/updater" "./build/%name%/updater" /E /COPY:DAT /R:2 /W:5 /NFL /NDL /NJH /NJS >nul

mkdir ".\build\%name%\frontend"
copy ".\frontend\src-tauri\target\release\%name%.exe" ".\build\%name%\frontend\%name%_frontend.exe"

echo %seperatorLvl2%
echo Creating a release zip
powershell -command "Compress-Archive -Path '.\build\%name%\*' -DestinationPath '.\build\%name%_portable.zip'"
echo %seperatorLvl1%
echo Build is complete
echo %seperatorLvl1%
echo Building installer
echo %seperatorLvl2%
call ./build_installer.bat

pause