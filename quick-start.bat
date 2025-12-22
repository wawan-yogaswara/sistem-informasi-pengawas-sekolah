@echo off
echo ========================================
echo   SISTEM INFORMASI PENGAWAS SEKOLAH
echo ========================================
echo.
echo Starting development server...
echo.

REM Start the server
start "Backend Server" cmd /k "npm run dev"

REM Wait for server to start
echo Waiting for server to start...
timeout /t 5 /nobreak > nul

REM Open browser
echo Opening browser...
start http://localhost:5000/login

echo.
echo ========================================
echo Server is running at: http://localhost:5000
echo Login page: http://localhost:5000/login
echo.
echo Default credentials:
echo Username: admin
echo Password: admin123
echo ========================================
echo.
echo Press any key to exit...
pause > nul