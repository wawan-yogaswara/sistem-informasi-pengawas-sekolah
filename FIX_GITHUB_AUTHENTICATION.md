# 🔐 Fix GitHub Authentication - Push Repository

## ❌ Masalah Saat Ini
```
remote: Permission to wawan-yogaswara/sistem-informasi-pengawas-sekolah.git denied
fatal: unable to access 'https://github.com/...': The requested URL returned error: 403
```

## 🎯 Solusi Authentication

### Opsi 1: GitHub Personal Access Token (Recommended)

#### 1. Buat Personal Access Token
1. Buka GitHub.com > Settings > Developer settings > Personal access tokens > Tokens (classic)
2. Klik **"Generate new token (classic)"**
3. Isi detail:
   - **Note**: `School Guard Manager - Local Development`
   - **Expiration**: 90 days (atau sesuai kebutuhan)
   - **Scopes**: Centang `repo` (full control of private repositories)
4. Klik **"Generate token"**
5. **COPY TOKEN** (hanya muncul sekali!)

#### 2. Update Remote URL dengan Token
```bash
git remote set-url origin https://[TOKEN]@github.com/wawan-yogaswara/sistem-informasi-pengawas-sekolah.git
```

Ganti `[TOKEN]` dengan token yang sudah di-copy.

#### 3. Push ke GitHub
```bash
git push -u origin main
```

### Opsi 2: GitHub CLI (Alternative)

#### 1. Install GitHub CLI
Download dari: https://cli.github.com/

#### 2. Login dengan GitHub CLI
```bash
gh auth login
```
Pilih:
- GitHub.com
- HTTPS
- Yes (authenticate with browser)

#### 3. Push menggunakan GitHub CLI
```bash
gh repo create wawan-yogaswara/sistem-informasi-pengawas-sekolah --public --source=. --remote=origin --push
```

### Opsi 3: SSH Key (Advanced)

#### 1. Generate SSH Key
```bash
ssh-keygen -t ed25519 -C "wanyora@gmail.com"
```

#### 2. Add SSH Key ke GitHub
1. Copy public key: `cat ~/.ssh/id_ed25519.pub`
2. GitHub > Settings > SSH and GPG keys > New SSH key
3. Paste public key

#### 3. Update Remote URL
```bash
git remote set-url origin git@github.com:wawan-yogaswara/sistem-informasi-pengawas-sekolah.git
```

## 🚀 Quick Fix (Menggunakan Token)

### Step 1: Buat Token
Buka: https://github.com/settings/tokens/new

### Step 2: Update Remote
```bash
# Ganti YOUR_TOKEN dengan token yang sudah dibuat
git remote set-url origin https://YOUR_TOKEN@github.com/wawan-yogaswara/sistem-informasi-pengawas-sekolah.git
```

### Step 3: Push
```bash
git push -u origin main
```

## 🔧 Troubleshooting

### Error: Token tidak valid
- Pastikan token di-copy dengan benar
- Cek apakah token sudah expired
- Pastikan scope `repo` sudah dicentang

### Error: Repository tidak ditemukan
- Pastikan repository sudah dibuat di GitHub
- Cek spelling nama repository
- Pastikan Anda punya akses ke repository

### Error: Branch tidak ada
```bash
git branch -M main
git push -u origin main
```

## 💡 Tips Keamanan

### Jangan Commit Token
- Token jangan di-commit ke repository
- Gunakan environment variables untuk token
- Set expiration date untuk token

### Backup Token
- Simpan token di tempat aman (password manager)
- Buat multiple tokens untuk different purposes
- Revoke token yang tidak digunakan

## 📋 Checklist Setelah Push Berhasil

- ✅ Repository ter-upload ke GitHub
- ✅ README.md tampil dengan baik
- ✅ File .env tidak ter-commit (aman)
- ✅ Documentation lengkap tersedia
- ✅ Setup environment variables untuk deployment

## 🎯 Next Steps

1. **Verifikasi di GitHub**
   - Buka: https://github.com/wawan-yogaswara/sistem-informasi-pengawas-sekolah
   - Cek semua file ter-upload

2. **Setup Repository**
   - Add description dan topics
   - Setup GitHub Pages (opsional)
   - Enable Issues dan Discussions

3. **Deploy ke Production**
   - Setup Supabase project
   - Deploy ke Netlify/Vercel
   - Setup environment variables

---

**🔐 Pilih salah satu opsi di atas untuk mengatasi masalah authentication!**