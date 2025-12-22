# 🔧 Troubleshoot Git Push Error - GitHub

## ❌ Error yang Umum Terjadi

### 1. Authentication Failed (403 Forbidden)
```
remote: Permission to wawan-yogaswara/sistem-informasi-pengawas-sekolah.git denied
fatal: unable to access 'https://github.com/...': The requested URL returned error: 403
```

**Solusi:**
```bash
# Buat Personal Access Token di GitHub
# https://github.com/settings/tokens/new

# Update remote dengan token
git remote set-url origin https://YOUR_TOKEN@github.com/wawan-yogaswara/sistem-informasi-pengawas-sekolah.git
git push -u origin main
```

### 2. Repository Not Found (404)
```
remote: Repository not found.
fatal: repository 'https://github.com/...' not found
```

**Solusi:**
- Pastikan repository sudah dibuat di GitHub
- Cek spelling nama repository
- Pastikan Anda login dengan akun yang benar

### 3. Branch Protection Rules
```
remote: error: GH006: Protected branch update failed
```

**Solusi:**
```bash
# Push ke branch lain dulu
git checkout -b initial-commit
git push -u origin initial-commit
# Lalu buat Pull Request di GitHub
```

### 4. Large File Error
```
remote: error: File ... is 100.00 MB; this exceeds GitHub's file size limit of 100.00 MB
```

**Solusi:**
```bash
# Hapus file besar dari git history
git rm --cached path/to/large/file
git commit -m "Remove large file"
git push -u origin main
```

### 5. Network/Connection Error
```
fatal: unable to connect to github.com
```

**Solusi:**
- Cek koneksi internet
- Coba gunakan VPN jika ada blocking
- Gunakan SSH instead of HTTPS

### 6. Non-fast-forward Error
```
! [rejected] main -> main (non-fast-forward)
error: failed to push some refs
```

**Solusi:**
```bash
# Force push (hati-hati!)
git push -u origin main --force

# Atau pull dulu
git pull origin main --allow-unrelated-histories
git push -u origin main
```

## 🚀 Solusi Step-by-Step

### Langkah 1: Cek Error Detail
```bash
# Jalankan dengan verbose untuk detail error
git push -u origin main --verbose
```

### Langkah 2: Cek Konfigurasi
```bash
# Cek remote URL
git remote -v

# Cek user config
git config --list | grep user

# Cek branch
git branch -a
```

### Langkah 3: Fix Authentication
```bash
# Opsi A: Gunakan Personal Access Token
git remote set-url origin https://TOKEN@github.com/wawan-yogaswara/sistem-informasi-pengawas-sekolah.git

# Opsi B: Gunakan SSH (jika sudah setup)
git remote set-url origin git@github.com:wawan-yogaswara/sistem-informasi-pengawas-sekolah.git
```

### Langkah 4: Force Push (jika diperlukan)
```bash
# Hanya jika repository kosong dan Anda yakin
git push -u origin main --force
```

## 🔐 Setup Personal Access Token

### 1. Buat Token
1. Buka: https://github.com/settings/tokens/new
2. **Note**: `School Guard Manager - Git Push`
3. **Expiration**: 90 days
4. **Scopes**: ✅ `repo` (full control)
5. Generate dan copy token

### 2. Update Remote URL
```bash
# Ganti YOUR_TOKEN dengan token yang sudah dibuat
git remote set-url origin https://YOUR_TOKEN@github.com/wawan-yogaswara/sistem-informasi-pengawas-sekolah.git
```

### 3. Test Push
```bash
git push -u origin main
```

## 🔍 Debug Commands

### Cek Status Repository
```bash
git status
git log --oneline -5
git remote -v
```

### Cek File Size
```bash
# Cek file besar (>50MB)
find . -type f -size +50M

# Cek total size
du -sh .
```

### Cek Network
```bash
# Test koneksi ke GitHub
ping github.com

# Test SSH (jika pakai SSH)
ssh -T git@github.com
```

## 💡 Tips Mencegah Error

### 1. Sebelum Push
```bash
# Selalu cek status dulu
git status

# Cek ukuran commit
git show --stat

# Test dengan dry-run
git push --dry-run origin main
```

### 2. File yang Harus Dihindari
- File > 100MB
- File .env dengan credentials
- node_modules/
- File binary besar (video, exe, dll)

### 3. Best Practices
- Commit sering dengan pesan yang jelas
- Gunakan .gitignore yang proper
- Backup sebelum force push
- Test di branch terpisah dulu

## 🆘 Emergency Recovery

### Jika Push Gagal Total
```bash
# Reset ke commit sebelumnya
git reset --soft HEAD~1

# Atau buat branch baru
git checkout -b backup-branch
git push -u origin backup-branch
```

### Jika Repository Corrupt
```bash
# Clone fresh dari GitHub (jika sudah ada)
git clone https://github.com/wawan-yogaswara/sistem-informasi-pengawas-sekolah.git new-folder

# Copy files yang diperlukan
# Lalu push dari folder baru
```

---

**📞 Jika masih error, silakan share detail error message yang muncul untuk solusi yang lebih spesifik!**