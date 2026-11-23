@echo off
title Stop FoodSave
echo ============================================
echo   Stopping FoodSave Services (Ports 8000 & 5173)...
echo ============================================
echo.
powershell -Command "Get-NetTCPConnection -LocalPort 8000, 5173 -ErrorAction SilentlyContinue | ForEach-Object { Stop-Process -Id $_.OwningProcess -Force -ErrorAction SilentlyContinue }"
echo All FoodSave background services have been stopped.
timeout /t 3 >nul
