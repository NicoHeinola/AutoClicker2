@echo off
REM Removes build and dist and all of those kinds of folders and files

cd ../
call :clean_up_dir
cd backend
call :clean_up_dir
cd updater
call :clean_up_dir
cd ../../frontend
call :clean_up_dir
cd ../scripts

goto :eof

:clean_up_dir

if exist *.spec (
    del /q *.spec
)
if exist build (
    rmdir /s /q build
)

if exist dist (
    rmdir /s /q dist
)

goto :eof