@echo off
setlocal
where node >nul 2>&1
if errorlevel 1 (
  echo Node.js was not found. Install Node.js and run this file again.
  pause
  exit /b 1
)
echo Kvadrat design library
echo Open http://127.0.0.1:4317 in your browser.
echo Keep this window open. Press Ctrl+C to stop the server.
echo If port 4317 is already in use, the server may already be running.
echo.
node "%~dp0scripts\serve.mjs"
if errorlevel 1 pause
