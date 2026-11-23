Set WshShell = CreateObject("WScript.Shell")
Set fso = CreateObject("Scripting.FileSystemObject")
scriptDir = fso.GetParentFolderName(WScript.ScriptFullName)

' 1. Start FastAPI Backend silently in the background (0 = completely hidden window)
WshShell.Run "cmd.exe /c cd /d """ & scriptDir & "\backend"" && python -m uvicorn app.main:app --host 0.0.0.0 --port 8000", 0, False

' Wait 2 seconds for backend to initialize
WScript.Sleep 2000

' 2. Start Vite Frontend silently in the background (0 = completely hidden window)
WshShell.Run "cmd.exe /c cd /d """ & scriptDir & "\frontend"" && npm run dev", 0, False

' Wait 3 seconds for Vite server to be ready
WScript.Sleep 3000

' 3. Automatically open the website directly in your default web browser
WshShell.Run "explorer ""http://localhost:5173"""
