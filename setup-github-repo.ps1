# Script untuk setup GitHub repository baru
# School Guard Manager

Write-Host "Setup GitHub Repository - School Guard Manager" -ForegroundColor Green
Write-Host "============================================================"

# Cek apakah git sudah diinisialisasi
if (-not (Test-Path ".git")) {
    Write-Host "Inisialisasi Git repository..." -ForegroundColor Yellow
    git init
    Write-Host "Git repository berhasil diinisialisasi" -ForegroundColor Green
}

# Cek status git
Write-Host ""
Write-Host "Status Git saat ini:" -ForegroundColor Yellow
git status --short

# Tambahkan semua file kecuali yang di .gitignore
Write-Host ""
Write-Host "Menambahkan file ke staging..." -ForegroundColor Yellow
git add .

# Commit perubahan
Write-Host ""
Write-Host "Commit perubahan..." -ForegroundColor Yellow
$commitMessage = "Initial commit: School Guard Manager v1.0

Features:
- Dashboard analytics dengan statistik real-time
- Manajemen user (admin & pengawas)
- Data sekolah dan supervisi
- Generate laporan PDF dengan foto
- Authentication dengan Supabase
- Responsive design

Tech Stack:
- Frontend: React + TypeScript + Vite + Tailwind
- Backend: Node.js + Express + Supabase
- Database: PostgreSQL (Supabase)

Documentation:
- Setup guide dan deployment ready
- API documentation lengkap
- Troubleshooting guide"

git commit -m "$commitMessage"

Write-Host ""
Write-Host "Commit berhasil!" -ForegroundColor Green

# Instruksi untuk GitHub
Write-Host ""
Write-Host "Langkah selanjutnya:" -ForegroundColor Cyan
Write-Host "1. Buat repository baru di GitHub:" -ForegroundColor White
Write-Host "   https://github.com/new" -ForegroundColor Gray
Write-Host ""
Write-Host "2. Copy URL repository (contoh: https://github.com/username/school-guard-manager.git)" -ForegroundColor White
Write-Host ""
Write-Host "3. Jalankan command berikut:" -ForegroundColor White
Write-Host "   git remote add origin https://github.com/username/school-guard-manager.git" -ForegroundColor Gray
Write-Host "   git branch -M main" -ForegroundColor Gray
Write-Host "   git push -u origin main" -ForegroundColor Gray
Write-Host ""
Write-Host "4. Atau jalankan script push-to-github.ps1 setelah setup remote" -ForegroundColor White

Write-Host ""
Write-Host "Tips:" -ForegroundColor Yellow
Write-Host "- Pastikan file .env tidak ter-commit (sudah ada di .gitignore)" -ForegroundColor White
Write-Host "- Gunakan .env.example sebagai template" -ForegroundColor White
Write-Host "- Setup environment variables di hosting platform" -ForegroundColor White

Write-Host ""
Write-Host "Repository siap untuk di-push ke GitHub!" -ForegroundColor Green