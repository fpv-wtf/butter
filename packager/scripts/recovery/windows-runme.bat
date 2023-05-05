@echo off
echo Please connect and power on your device
set /p Device=<firmware\device || exit /b 666
bin\butter-x86_64-w64-mingw32.exe %Device%

cd firmware
..\bin\fastboot.exe erase blackbox || exit /b 666
for /F "tokens=*" %%A in (partitions) do ..\bin\fastboot.exe flash %%A || exit /b 666
..\bin\fastboot.exe reboot || exit /b 666

echo Flashing complete
pause