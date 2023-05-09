@echo off
echo Please connect and power on your device
set /p Device=<firmware\device || goto :error
bin\butter-x86_64-w64-mingw32.exe %Device% || goto :error

cd firmware
..\bin\fastboot.exe erase blackbox || goto :error
for /F "tokens=*" %%A in (partitions) do ..\bin\fastboot.exe flash %%A || goto :error
..\bin\fastboot.exe reboot || goto :error

echo Flashing complete
pause

goto :EOF

:error
echo Failed with error #%errorlevel%.
pause
exit /b %errorlevel%