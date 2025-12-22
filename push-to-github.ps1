# Script untuk push ke GitHub repository
# School Guard Manager

param(
    [Parameter(Mandatory=$true)]
    [string]$RepoUrl
)

Write-Host "🚀 Push to GitHub - School Guard Manager" -ForegroundColor Green
Write-Host "=" * 60

# Validasi URL
if (-not ($RepoUrl -match "github\.com")) {
    Write-Host "❌ URL tidak valid. Harus berisi 'github.com'" -ForegroundColor Red
    Write-Host "Contoh: https://github.com/username/school-guard-manager.git" -ForegroundColor Gray
    exit 1
}

Write-Host "📝 Repository URL: $RepoUrl" -ForegroundColor Yellow

# Cek apakah sudah ada remote origin
$remoteExists = git remote get-url origin 2>$null
if ($remoteExists) {
    Write-Host "⚠️ Remote origin sudah ada: $remoteExists" -ForegroundColor Yellow
    $replace = Read-Host "Ganti dengan URL baru? (y/n)"
    if ($replace -eq "y" -or $replace -eq "Y") {
        git remote set-url origin $RepoUrl
        Write-Host "✅ Remote origin berhasil diupdate" -ForegroundColor Green
    }
} else {
    Write-Host "📝 Menambahkan remote origin..." -ForegroundColor Yellow
    git remote add origin $RepoUrl
    Write-Host "✅ Remote origin berhasil ditambahkan" -ForegroundColor Green
}

# Set branch ke main
Write-Host "📝 Set branch ke main..." -ForegroundColor Yellow
git branch -M main

# Push ke GitHub
Write-Host "📤 Push ke GitHub..." -ForegroundColor Yellow
try {
    git push -u origin main
    Write-Host "✅ Push berhasil!" -ForegroundColor Green
    
    # Extract username dan repo name dari URL
    if ($RepoUrl -match "github\.com[:/]([^/]+)/([^/.]+)") {
        $username = $matches[1]
        $reponame = $matches[2]
        
        Write-Host "`n🎉 Repository berhasil di-push!" -ForegroundColor Green
        Write-Host "🔗 GitHub Repository: https://github.com/$username/$reponame" -ForegroundColor Cyan
        Write-Host "📚 README: https://github.com/$username/$reponame#readme" -ForegroundColor Cyan
        
        Write-Host "`n🎯 Next Steps:" -ForegroundColor Yellow
        Write-Host "1. Setup GitHub Pages (jika ingin hosting gratis)" -ForegroundColor White
        Write-Host "2. Setup environment variables di hosting platform" -ForegroundColor White
        Write-Host "3. Deploy ke Netlify/Vercel untuk production" -ForegroundColor White
        Write-Host "4. Setup Supabase project dan database schema" -ForegroundColor White
        
        Write-Host "`n📋 Files yang ter-commit:" -ForegroundColor Yellow
        git ls-files | Select-Object -First 10 | ForEach-Object { Write-Host "   ✅ $_" -ForegroundColor Gray }
        $totalFiles = (git ls-files | Measure-Object).Count
        if ($totalFiles -gt 10) {
            Write-Host "   ... dan $($totalFiles - 10) file lainnya" -ForegroundColor Gray
        }
    }
    
} catch {
    Write-Host "❌ Error saat push: $($_.Exception.Message)" -ForegroundColor Red
    Write-Host "`n🔧 Troubleshooting:" -ForegroundColor Yellow
    Write-Host "1. Pastikan repository sudah dibuat di GitHub" -ForegroundColor White
    Write-Host "2. Cek apakah Anda sudah login git (git config --global user.name)" -ForegroundColor White
    Write-Host "3. Pastikan URL repository benar" -ForegroundColor White
    Write-Host "4. Coba: git push --set-upstream origin main --force" -ForegroundColor White
}

Write-Host "`n💡 Untuk update selanjutnya:" -ForegroundColor Yellow
Write-Host "git add ." -ForegroundColor Gray
Write-Host "git commit -m 'Update: description'" -ForegroundColor Gray
Write-Host "git push" -ForegroundColor Gray