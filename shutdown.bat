@echo off

:: Stop the service using port 3000
netstat -ano | find "3000" > nul
if %errorlevel% equ 0 (
    for /f "tokens=5" %%a in ('netstat -ano ^| find "3000"') do (
        taskkill /F /PID %%a
        echo Service running on port 3000 has been stopped.
    )
) else (
    echo No service found on port 3000.
)

pause
