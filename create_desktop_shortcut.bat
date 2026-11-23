@echo off
title Create FoodSave Desktop Shortcut
echo Creating 1-Click Desktop Shortcut for FoodSave...
powershell -NoProfile -Command "$ws = New-Object -ComObject WScript.Shell; $desktop = [System.Environment]::GetFolderPath('Desktop'); $shortcut = $ws.CreateShortcut([System.IO.Path]::Combine($desktop, 'FoodSave.lnk')); $shortcut.TargetPath = Join-Path '%~dp0' 'launch_foodsave.vbs'; $shortcut.WorkingDirectory = '%~dp0'; $shortcut.Description = 'FoodSave – Smart Food Waste Management Platform'; $shortcut.IconLocation = 'shell32.dll,13'; $shortcut.Save()"
echo.
echo ========================================================
echo  Success! 'FoodSave' shortcut has been added to Desktop.
echo  You can now simply double-click it to open the website!
echo ========================================================
timeout /t 4 >nul
