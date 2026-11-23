@echo off
title FoodSave - Full Stack Platform Launcher
echo ===================================================
echo   Starting FoodSave - Save Food, Share Hope (Ahmedabad)
echo ===================================================
echo.

cd /d "%~dp0backend"
echo [1/2] Launching FastAPI Backend on http://localhost:8000 ...
start "FoodSave Backend (FastAPI)" cmd /k "python -m uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload"

timeout /t 3 /nobreak >nul

cd /d "%~dp0frontend"
echo [2/2] Launching Vite Frontend on http://localhost:5173 ...
start "FoodSave Frontend (Vite)" cmd /k "npm run dev"

timeout /t 3 /nobreak >nul
echo Opening FoodSave in your web browser...
start http://localhost:5173

echo.
echo ===================================================
echo FoodSave is running!
echo Frontend: http://localhost:5173
echo Backend API Docs: http://localhost:8000/docs
echo ===================================================
echo Press any key to exit launcher window (servers stay open)...
pause >nul
