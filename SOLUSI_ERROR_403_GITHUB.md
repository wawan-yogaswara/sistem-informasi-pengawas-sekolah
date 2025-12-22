# 🔧 Solusi Error 403 GitHub - Permission Denied

## ❌ Error yang Terjadi
```
remote: Permission to wawan-yogaswara/sistem-informasi-pengawas-sekolah.git denied to wanyora68-debug.
fatal: unable to access 'https://github.com/wawan-yogaswara/sistem-informasi-pengawas-sekolah.git/': The requested URL returned error: 403
```

## 🎯 Penyebab Masalah
1. **Authentication Issue**: Git menggunakan credentials lama (`wanyora68-debug`)
2. **Token Expired**: Personal Access Token mungkin sudah expired
3. **Wrong Credentials**: Username/password tidak sesuai dengan repository owner

## 🚀 Solusi Langkah-demi-Langkah

### Langkah 1: Buat Personal Access Token Baru
1. **Buka GitHub**: https://github.com/settings/tokens/new
2. **Token Name**: `School Guard Manager - 2024`
3. **Expiration**: 90 days
4. **Scopes**: ✅ Centang `repo` (Full control of private repositories)
5. **Generate Token** dan **COPY** (hanya muncul sekali!)

### Langkah 2: Update Remote URL dengan Token
```bash
# Di Git Bash, jalankan command ini:
# Ganti YOUR_TOKEN dengan token yang sudah di-copy
git remote set-url origin https://YOUR_TOKEN@github.com/wawan-yogaswara/sistem-informasi-pengawas-sekolah.git
```

### Langkah 3: Push Ulang
```bash
git push -u origin main
```

## 🔐 Alternatif: Clear Git Credentials

### Opsi A: Clear Credential Manager (Windows)
```bash
# Hapus credentials lama
git config --global --unset credential.helper
git config --system --unset credential.helper

# Set credential helper baru
git config --global credential.helper manager-core
```

### Opsi B: Manual Authentication
```bash
# Push dengan force authentication
git push -u origin main

# Ketika diminta:
# Username: wawan-yogaswara
# Password: [Personal Access Token]
```

## 📝 Commands Lengkap untuk Copy-Paste

```bash
# 1. Bersihkan credentials lama
git config --global --unset credential.helper

# 2. Set credential helper baru
git config --global credential.helper manager-core

# 3. Update remote dengan format yang benar
git remote set-url origin https://github.com/wawan-yogaswara/sistem-informasi-pengawas-sekolah.git

# 4. Push (akan minta authentication)
git push -u origin main
```

## 🎯 Jika Masih Error

### Cek Konfigurasi Git
```bash
# Cek user config
git config --list | grep user

# Update jika perlu
git config --global user.name "Wawan Yogaswara"
git config --global user.email "wanyora@gmail.com"
```

### Force dengan Token di URL
```bash
# Langsung masukkan token di URL
git remote set-url origin https://YOUR_TOKEN@github.com/wawan-yogaswara/sistem-informasi-pengawas-sekolah.git
git push -u origin main
```

## 💡 Tips Mencegah Error di Masa Depan

### 1. Gunakan SSH (Recommended)
```bash
# Generate SSH key
ssh-keygen -t ed25519 -C "wanyora@gmail.com"

# Add ke GitHub: Settings > SSH and GPG keys
# Update remote ke SSH
git remote set-url origin git@github.com:wawan-yogaswara/sistem-informasi-pengawas-sekolah.git
```

### 2. Set Token dengan Expiration yang Panjang
- Buat token dengan expiration 1 tahun
- Simpan di password manager
- Set reminder sebelum expired

### 3. Gunakan GitHub CLI
```bash
# Install GitHub CLI
# Login sekali saja
gh auth login

# Push menggunakan gh
gh repo create --source=. --remote=origin --push
```

## 🆘 Emergency Solution

Jika semua cara di atas tidak berhasil:

```bash
# 1. Hapus remote lama
git remote remove origin

# 2. Add remote baru dengan token
git remote add origin https://YOUR_TOKEN@github.com/wawan-yogaswara/sistem-informasi-pengawas-sekolah.git

# 3. Force push
git push -u origin main --force
```

---

**🎯 Langkah Paling Mudah:**
1. Buat Personal Access Token di GitHub
2. Jalankan: `git remote set-url origin https://TOKEN@github.com/wawan-yogaswara/sistem-informasi-pengawas-sekolah.git`
3. Jalankan: `git push -u origin main`

**📞 Jika masih error, silakan share screenshot error yang baru!**