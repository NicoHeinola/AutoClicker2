@echo off
REM Set paths
set INNO_SETUP_PATH="C:\Program Files (x86)\Inno Setup 6\ISCC.exe"
set SCRIPT_PATH=".\installer_script.iss"
set BUILD_DIR=.\build

REM Check if Inno Setup is installed
if not exist %INNO_SETUP_PATH% (
    echo Inno Setup is not installed at %INNO_SETUP_PATH%
    pause
    exit /b 1
)

REM Create the build directory if it doesn't exist
if not exist %BUILD_DIR% (
    mkdir %BUILD_DIR%
)

REM Compile the installer
%INNO_SETUP_PATH% %SCRIPT_PATH%

REM Check if the installer was created
if exist "%BUILD_DIR%\AutoClicker2Setup.exe" (
    echo Installer created successfully in %BUILD_DIR%.
) else (
    echo Failed to create the installer.
    pause
    exit /b 1
)

pause