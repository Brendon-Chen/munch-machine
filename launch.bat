@echo off
REM Munch Machine landing — local launcher (LAN-accessible)
setlocal EnableDelayedExpansion

set "HERE=%~dp0"
set "PY=%HERE%venv\Scripts\python.exe"
set "PORT=5050"
set "LOCAL_URL=http://127.0.0.1:%PORT%/"

if not exist "%PY%" (
  echo [launch] venv missing at %PY%
  echo [launch] create with: python -m venv venv ^&^& venv\Scripts\pip install flask
  pause
  exit /b 1
)

REM Detect LAN IPv4 (skip 127.* and link-local 169.254.*)
set "LAN_IP="
for /f "tokens=2 delims=:" %%a in ('ipconfig ^| findstr /R /C:"IPv4 Address"') do (
  set "ip=%%a"
  set "ip=!ip: =!"
  echo !ip! | findstr /B /C:"127." /C:"169.254." >nul
  if errorlevel 1 (
    if not defined LAN_IP set "LAN_IP=!ip!"
  )
)

echo.
echo ============================================================
echo   MUNCH MACHINE — DEV SERVER
echo ============================================================
echo   Local      %LOCAL_URL%
if defined LAN_IP (
  echo   Network    http://!LAN_IP!:%PORT%/      ^(open on phone^)
) else (
  echo   Network    not detected — check WiFi
)
echo   VS Code    starting tunnel... ^(see new window^)
echo ============================================================
echo   Stop: Ctrl+C
echo.

REM Start VS Code tunnel in separate window (keeps its own output)
set "CODE=D:\Dev\VSCode\bin\code.cmd"
if exist "%CODE%" (
  start "VS Code Tunnel" cmd /K "echo Starting VS Code tunnel... && "%CODE%" tunnel --accept-server-license-terms"
) else (
  echo [launch] VS Code not found at %CODE% — skipping tunnel
)

REM Open desktop browser ~2s after boot
start "" /B cmd /C "timeout /t 2 /nobreak >nul && start "" %LOCAL_URL%"

"%PY%" "%HERE%app.py"

endlocal
