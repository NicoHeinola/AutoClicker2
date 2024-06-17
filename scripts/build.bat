@echo off
cd /d %~dp0

echo Cleaning up old build files...
call .\cleanup.bat

echo Building backend...
call .\build_backend.bat

echo Building updater...
call .\build_updater.bat

echo Building frontend...
call .\build_frontend.bat

echo Combining builds into one application...
call .\combine_builds.bat

echo Creating installers...
call .\build_installer.bat

echo Creating portable versions...
call .\create_portable.bat

pause