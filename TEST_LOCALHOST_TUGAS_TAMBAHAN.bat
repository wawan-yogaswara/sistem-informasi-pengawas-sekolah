@echo off
echo ========================================
echo TEST TUGAS TAMBAHAN DI LOCALHOST:5000
echo ========================================

echo.
echo 1. Starting server...
start "Server" cmd /k "npm run dev"

echo.
echo 2. Waiting for server to start...
timeout /t 10 /nobreak

echo.
echo 3. Opening browser...
start http://localhost:5000

echo.
echo 4. INSTRUKSI TEST:
echo    - Login dengan user wawan
echo    - Buka halaman Tugas Tambahan
echo    - Buka browser console (F12)
echo    - Copy paste script dari DEBUG_LOCALHOST_TUGAS_TAMBAHAN.js
echo    - Lihat hasil debug di console

echo.
echo 5. YANG HARUS DICEK:
echo    - Apakah server berjalan di port 5000?
echo    - Apakah user data ada di localStorage?
echo    - Apakah query Supabase berhasil?
echo    - Apakah ada data di database?

echo.
pause