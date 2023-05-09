@echo off

tasklist /fi "ImageName eq Ultimaker-Cura.exe" /fo csv 2>NUL | find /I "Ultimaker-Cura.exe">NUL
if "%ERRORLEVEL%"=="0" (
    echo UltiMaker Cura is running and is known to cause problems when rooting. Please close it before proceeding.
    pause
    exit /b 666
)

tasklist /fi "ImageName eq prusa-slicer.exe" /fo csv 2>NUL | find /I "prusa-slicer.exe">NUL
if "%ERRORLEVEL%"=="0" (
    echo PrusaSlicer is running and is known to cause problems when rooting. Please close it before proceeding.
    pause
    exit /b 666
)

tasklist /fi "ImageName eq DJIService.exe" /fo csv 2>NUL | find /I "DJIService.exe">NUL
if "%ERRORLEVEL%"=="0" (
    echo DJI Assistant is running and is known to cause problems when rooting. Please close it before proceeding.
    pause
    exit /b 666
)

pause
echo Please connect your powered off(!) goggles via USB.
pause
echo Please power on your goggles now.

set Rootable=01.00.0606
set /p Latest=<data/latest || goto :error
set Device=gp150

bin\butter-x86_64-w64-mingw32.exe %Device% || goto :error

cd %Rootable%
..\bin\fastboot.exe erase blackbox || goto :error
..\bin\fastboot.exe erase upgrade || goto :error
for /F "tokens=*" %%A in (partitions) do ..\bin\fastboot.exe flash %%A || goto :error
..\bin\fastboot.exe reboot || goto :error
cd ..

bin\margerine.exe wait || goto :error
bin\margerine.exe unlock || goto :error

bin\margerine.exe wait || goto :error
bin\margerine.exe reboot || goto :error

bin\butter-x86_64-w64-mingw32.exe %Device% || goto :error

cd %Latest%
..\bin\fastboot.exe erase blackbox || goto :error
for /F "tokens=*" %%A in (partitions) do ..\bin\fastboot.exe flash %%A || goto :error
..\bin\fastboot.exe reboot || goto :error
cd ..

echo.
echo Waiting for one final reboot
bin\margerine.exe wait || goto :error

echo.
echo Rooting and flasing %Latest% complete. Will open browser to https://fpv.wtf/wtfos/install.
pause
start https://fpv.wtf/wtfos/install
goto :EOF

:error
echo Failed with error #%errorlevel%.
pause
exit /b %errorlevel%