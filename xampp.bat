@echo off
setlocal enabledelayedexpansion

set "portToCheck=3306"

:: Check if the port is in use
netstat -ano | find ":%portToCheck%" > nul
if %errorlevel% neq 0 (
    echo No process is using port %portToCheck%.
    exit /b
)

:: Get the PID using the port
for /f "tokens=5" %%a in ('netstat -ano ^| find ":%portToCheck%"') do (
    set "pid=%%a"
)

:: Ask for elevated permissions
cd /d "%~dp0"
>nul 2>nul "%SystemRoot%\System32\cacls.exe" "%SystemRoot%\System32\config\system" && (
    echo Elevated permissions granted.
) || (
    echo Requesting elevated permissions...
    cd /d "%~dp0"
    powershell start -verb runas '"%~0"'
    exit /b
)

:: Stop the task with elevated permissions
taskkill /F /PID %pid%

echo Task with PID %pid% has been stopped.

:end
