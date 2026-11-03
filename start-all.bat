@echo off
title FUCHSIUS Vehicle Service Booking System
echo =========================================================================
echo Launching FUCHSIUS Vehicle Service Booking System (MERN Stack)...
echo =========================================================================
start "FUCHSIUS Backend API" cmd /k "cd /d "%~dp0backend" && npm start"
timeout /t 3 /nobreak >nul
start "FUCHSIUS Frontend Client" cmd /k "cd /d "%~dp0frontend" && npm run dev"
echo Backend and Frontend instances started in new windows.
echo Frontend URL: http://localhost:5173
echo Backend API:  http://localhost:5000
echo.
pause

