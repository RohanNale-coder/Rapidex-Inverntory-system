@echo off
echo ============================================
echo Inventory ERP System - Setup Script
echo ============================================
echo.

echo Step 1: Installing root dependencies...
call npm install
if errorlevel 1 (
    echo Error installing root dependencies
    pause
    exit /b 1
)

echo.
echo Step 2: Installing backend dependencies...
cd backend
call npm install
if errorlevel 1 (
    echo Error installing backend dependencies
    pause
    exit /b 1
)
cd ..

echo.
echo Step 3: Installing frontend dependencies...
cd frontend
call npm install
if errorlevel 1 (
    echo Error installing frontend dependencies
    pause
    exit /b 1
)
cd ..

echo.
echo ============================================
echo Setup Complete!
echo ============================================
echo.
echo To start the application:
echo   1. Build frontend: npm run build
echo   2. Start server: npm start
echo.
echo Or simply run: npm run dev
echo.
pause