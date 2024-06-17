@echo off

set app_name=AutoClicker2
set zip_exe=C:\Program Files\7-Zip\7z.exe

REM Go to build folder
cd /d %~dp0
cd ../

set source_folder=".\build\%app_name%"
set destination_file_path=".\build\%app_name%_portable_win"

"%zip_exe%" a -t7z -mx8 "%destination_file_path%.7z" "%source_folder%\*"
"%zip_exe%" a -tzip -mx9 "%destination_file_path%.zip" "%source_folder%\*"

REM powershell -command "Compress-Archive -Path  -DestinationPath '.\build\%app_name%_portable.zip'"

cd /d %~dp0