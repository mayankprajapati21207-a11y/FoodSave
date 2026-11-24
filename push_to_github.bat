@echo off
title Push FoodSave - Deploy Live Website to GitHub
color 0A
echo ==============================================================================
echo       FOODSAVE - PUSH ALL CODE AND DEPLOY LIVE TO GITHUB
echo ==============================================================================
echo.

set DEFAULT_URL=https://github.com/mayankprajapati21207-a11y/FoodSave.git
echo Current GitHub Repository:
echo   %DEFAULT_URL%
echo.
echo Press ENTER to use this repository, or paste a new URL below:
set /p USER_URL="Repository URL [%DEFAULT_URL%]: "

if "%USER_URL%"=="" (
    set REPO_URL=%DEFAULT_URL%
) else (
    set REPO_URL=%USER_URL%
)

echo.
echo [*] Staging all files and fixes...
git remote remove origin >nul 2>&1
git remote add origin %REPO_URL%
git branch -M main

git add .
git commit -m "Update FoodSave: Client-side registration, login, and Netlify configuration" >nul 2>&1

echo.
echo [*] Pushing to GitHub main branch...
git push -u origin main

if %errorlevel% equ 0 (
    echo.
    echo ==============================================================================
    echo [SUCCESS] All code and fixes pushed to GitHub successfully!
    echo ==============================================================================
    echo.
    echo GitHub Actions will now automatically build and publish your website.
    echo.
    echo TO SEE YOUR LIVE WEBSITE:
    echo 1. Open: https://github.com/mayankprajapati21207-a11y/FoodSave/settings/pages
    echo 2. Under "Build and deployment" -^> "Source":
    echo    - Select: "Deploy from a branch"
    echo    - Branch: "gh-pages" (Folder: /root)
    echo    - Click "Save"
    echo.
    echo 3. Wait 30 seconds. Your LIVE WEBSITE LINK will be active:
    echo    https://mayankprajapati21207-a11y.github.io/FoodSave/
    echo ==============================================================================
) else (
    echo.
    echo ==============================================================================
    echo [NOTE] Push requires login. If GitHub opened a browser window, please sign in.
    echo ==============================================================================
)
echo.
pause
