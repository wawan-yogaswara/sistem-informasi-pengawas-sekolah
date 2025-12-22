# 🚀 Push ke GitHub dengan Git Bash

## 📋 Langkah-Langkah

### 1. Buka Git Bash
- Klik kanan di folder project
- Pilih "Git Bash Here"
- Atau buka Git Bash dan navigasi ke folder project

### 2. Cek Status Repository
```bash
git status
```

### 3. Setup Remote (jika belum)
```bash
# Cek remote yang ada
git remote -v

# Update remote URL
git remote set-url origin https://github.com/wawan-yogaswara/sistem-informasi-pengawas-sekolah.git

# Atau tambah remote baru jika belum ada
git remote add origin https://github.com/wawan-yogaswara/sistem-informasi-pengawas-sekolah.git
```

### 4. Set Branch ke Main
```bash
git branch -M main
```

### 5. Push ke GitHub
```bash
git push -u origin main
```

## 🔐 Jika Diminta Authentication

### Opsi 1: Username & Personal Access Token
Ketika diminta credentials:
- **Username**: `wawan-yogaswara`
- **Password**: Masukkan Personal Access Token (bukan password GitHub)

### Opsi 2: Buat Personal Access Token
1. Buka: https://github.com/settings/tokens/new
2. **Note**: `School Guard Manager - Git Bash`
3. **Expiration**: 90 days
4. **Scopes**: ✅ Centang `repo`
5. Generate dan copy token
6. Gunakan token sebagai password saat diminta

### Opsi 3: Update URL dengan Token
```bash
# Ganti YOUR_TOKEN dengan token yang sudah dibuat
git remote set-url origin https://YOUR_TOKEN@github.com/wawan-yogaswara/sistem-informasi-pengawas-sekolah.git
git push -u origin main
```

## 📝 Commands Lengkap untuk Copy-Paste

```bash
# 1. Cek status
git status

# 2. Update remote
git remote set-url origin https://github.com/wawan-yogaswara/sistem-informasi-pengawas-sekolah.git

# 3. Set branch
git branch -M main

# 4. Push
git push -u origin main
```

## 🎯 Jika Berhasil

Anda akan melihat output seperti:
```
Enumerating objects: 150, done.
Counting objects: 100% (150/150), done.
Delta compression using up to 8 threads
Compressing objects: 100% (140/140), done.
Writing objects: 100% (150/150), 2.5 MiB | 1.2 MiB/s, done.
Total 150 (delta 45), reused 0 (delta 0)
remote: Resolving deltas: 100% (45/45), done.
To https://github.com/wawan-yogaswara/sistem-informasi-pengawas-sekolah.git
 * [new branch]      main -> main
Branch 'main' set up to track remote branch 'main' from 'origin'.
```

## 🔧 Troubleshooting

### Error: Authentication failed
```bash
# Gunakan token sebagai password
# Atau update URL dengan token:
git remote set-url origin https://YOUR_TOKEN@github.com/wawan-yogaswara/sistem-informasi-pengawas-sekolah.git
```

### Error: Repository not found
- Pastikan repository sudah dibuat di GitHub
- Cek spelling nama repository
- Pastikan Anda login dengan akun yang benar

### Error: Permission denied
- Pastikan Anda punya akses ke repository
- Cek apakah repository public atau private
- Pastikan token punya scope yang benar

## 💡 Tips Git Bash

### Navigasi Folder
```bash
# Lihat folder saat ini
pwd

# Pindah ke folder project
cd /d/Data\ Ibu/SchoolGuardManager

# Lihat isi folder
ls -la
```

### Git Commands Berguna
```bash
# Lihat history commit
git log --oneline

# Lihat remote
git remote -v

# Lihat branch
git branch -a

# Cek konfigurasi
git config --list
```

### Untuk Update Selanjutnya
```bash
git add .
git commit -m "Update: description"
git push
```

## 🎉 Setelah Push Berhasil

1. **Verifikasi**: Buka https://github.com/wawan-yogaswara/sistem-informasi-pengawas-sekolah
2. **Cek Files**: Pastikan semua file ter-upload
3. **README**: Pastikan README.md tampil dengan baik
4. **Setup Repository**: Add description, topics, dll

---

**🚀 Selamat! Repository berhasil di-push ke GitHub!**