@echo off
title Push FoodSave - All Code & Live Website to GitHub
color 0A
echo ==============================================================================
echo       FOODSAVE - PUSH ALL CODE AND DEPLOY LIVE TO GITHUB
echo ==============================================================================
echo.
echo Make sure you have created an empty repository on GitHub:
echo   https://github.com/new  (Name it: foodsave)
echo.
echo Enter or paste your GitHub repository URL below.
echo Example: https://github.com/your-username/foodsave.git
echo.
set /p REPO_URL="GitHub Repository URL: "

if "%REPO_URL%"=="" (
    echo [ERROR] No URL entered. Exiting...
    pause
    exit /b
)

echo.
echo [*] Staging all frontend, backend, and configuration code files...
git init
git config user.name "Mayank Prajapati"
git config user.email "mayankprajapati@foodsave.org"
git branch -M main
git remote remove origin >nul 2>&1
git remote add origin %REPO_URL%

git add .
git commit -m "Upload complete FoodSave platform: backend, frontend, responsive mobile UI, and live deployment workflow"

echo.
echo [*] Uploading all code files to GitHub main branch...
git push -u origin main

if %errorlevel% equ 0 (
    echo.
    echo ==============================================================================
    echo [SUCCESS] All code files have been successfully uploaded to GitHub!
    echo ==============================================================================
    echo.
    echo TO GET YOUR LIVE WEBSITE LINK FOR USERS:
    echo 1. Open your repository on https://github.com in your web browser.
    echo 2. Click "Settings" (top tab) -^> "Pages" (left sidebar).
    echo 3. Under "Build and deployment" -^> "Source", select "GitHub Actions".
    echo 4. Wait 1-2 minutes. GitHub will display your LIVE WEBSITE LINK:
    echo    https://your-username.github.io/foodsave/
    echo.
    echo Anyone can open that link on their mobile phone, tablet, or laptop!
    echo ==============================================================================
) else (
    echo.
    echo ==============================================================================
    echo [NOTE] If you were prompted for GitHub login, please sign in.
    echo If you already pushed previously, try pushing again.
    echo ==============================================================================
)
echo.
pause
