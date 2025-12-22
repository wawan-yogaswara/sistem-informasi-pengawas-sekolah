# Script untuk setup GitHub Personal Access Token
# School Guard Manager

Write-Host "Setup GitHub Personal Access Token" -ForegroundColor Green
Write-Host "============================================"

Write-Host ""
Write-Host "Langkah 1: Buat Personal Access Token" -ForegroundColor Yellow
Write-Host "1. Buka: https://github.com/settings/tokens/new" -ForegroundColor White
Write-Host "2. Note: School Guard Manager - Local Development" -ForegroundColor White
Write-Host "3. Expiration: 90 days" -ForegroundColor White
Write-Host "4. Scopes: Centang 'repo' (full control)" -ForegroundColor White
Write-Host "5. Generate token dan COPY!" -ForegroundColor White

Write-Host ""
$token = Read-Host "Masukkan Personal Access Token"

if (-not $token.Trim()) {
    Write-Host "Token tidak boleh kosong!" -ForegroundColor Red
    exit 1
}

# Validasi token format
if ($token.Length -lt 20) {
    Write-Host "Token terlalu pendek. Pastikan copy dengan benar!" -ForegroundColor Red
    exit 1
}

Write-Host ""
Write-Host "Langkah 2: Update Remote URL..." -ForegroundColor Yellow

try {
    $repoUrl = "https://$token@github.com/wawan-yogaswara/sistem-informasi-pengawas-sekolah.git"
    git remote set-url origin $repoUrl
    Write-Host "Remote URL berhasil diupdate" -ForegroundColor Green
    
    Write-Host ""
    Write-Host "Langkah 3: Push ke GitHub..." -ForegroundColor Yellow
    git push -u origin main
    
    Write-Host ""
    Write-Host "Push berhasil!" -ForegroundColor Green
    Write-Host "Repository: https://github.com/wawan-yogaswara/sistem-informasi-pengawas-sekolah" -ForegroundColor Cyan
    
} catch {
    Write-Host "Error: $($_.Exception.Message)" -ForegroundColor Red
    Write-Host ""
    Write-Host "Troubleshooting:" -ForegroundColor Yellow
    Write-Host "1. Pastikan token valid dan tidak expired" -ForegroundColor White
    Write-Host "2. Cek apakah repository sudah dibuat di GitHub" -ForegroundColor White
    Write-Host "3. Pastikan scope 'repo' sudah dicentang" -ForegroundColor White
}

Write-Host ""
Write-Host "Selesai!" -ForegroundColor Green