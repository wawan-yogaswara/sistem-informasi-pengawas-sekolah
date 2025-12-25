@echo off
echo 🔄 Restarting server dan testing foto...

echo.
echo 📋 Step 1: Stopping existing server...
taskkill /f /im node.exe 2>nul
timeout /t 2 >nul

echo.
echo 📋 Step 2: Starting server...
cd server
start "Backend Server" cmd /k "npm start"

echo.
echo 📋 Step 3: Waiting for server to start...
timeout /t 5 >nul

echo.
echo 📋 Step 4: Starting frontend...
cd ..\client
start "Frontend Dev" cmd /k "npm run dev"

echo.
echo 📋 Step 5: Waiting for frontend to start...
timeout /t 5 >nul

echo.
echo ✅ Server dan frontend sudah running!
echo.
echo 🌐 Buka browser ke: http://localhost:5173
echo 📊 Test endpoints: http://localhost:5000/api/health
echo.
echo 📋 Langkah selanjutnya:
echo 1. Buka http://localhost:5173
echo 2. Login sebagai wawan
echo 3. Masuk ke halaman Laporan Aktivitas
echo 4. Buka Console Browser (F12)
echo 5. Jalankan script TEST_ENDPOINT_TANPA_AUTH.js
echo.
pause