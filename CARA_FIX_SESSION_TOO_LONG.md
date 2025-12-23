# Cara Mengatasi Masalah "Session Too Long"

## Masalah
Aplikasi sering menampilkan pesan "session too long" yang mengganggu aktivitas pengguna.

## Penyebab
1. **Interval yang berlebihan** - Dashboard melakukan refresh foto setiap 5-30 detik
2. **Event listeners yang menumpuk** - Event listeners tidak dibersihkan dengan baik
3. **API calls yang terlalu sering** - Aplikasi melakukan terlalu banyak request dalam waktu singkat
4. **Memory leaks** - Interval dan timeout tidak dibersihkan saat komponen unmount

## Solusi yang Sudah Diterapkan

### 1. Optimasi Interval Dashboard
- **Sebelum**: Photo check setiap 5 detik
- **Sesudah**: Photo check setiap 2 menit (120 detik)
- **Benefit**: Mengurangi 96% aktivitas background

### 2. Perbaikan useEffect Dependencies
- **Sebelum**: `[userProfile?.photoUrl]` - menyebabkan re-render berlebihan
- **Sesudah**: `[]` - hanya run sekali saat mount
- **Benefit**: Mencegah infinite re-render loop

### 3. Visibility API Integration
- Interval hanya berjalan saat tab aktif (`document.visibilityState === 'visible'`)
- **Benefit**: Menghemat resource saat tab tidak aktif

## Cara Manual Fix (Jika Masih Muncul)

### Opsi 1: Jalankan Script di Browser Console
1. Buka Developer Tools (F12)
2. Masuk ke tab Console
3. Copy-paste script berikut:

```javascript
// Clear all intervals and timeouts
const highestIntervalId = setInterval(() => {}, 1);
for (let i = 0; i < highestIntervalId; i++) {
  clearInterval(i);
}

const highestTimeoutId = setTimeout(() => {}, 1);
for (let i = 0; i < highestTimeoutId; i++) {
  clearTimeout(i);
}

console.log('✅ All intervals cleared - session issue should be fixed');
```

### Opsi 2: Refresh Halaman
- Tekan `Ctrl + F5` untuk hard refresh
- Atau tutup dan buka kembali tab aplikasi

### Opsi 3: Clear Browser Cache
1. Tekan `Ctrl + Shift + Delete`
2. Pilih "Cached images and files"
3. Klik "Clear data"

## Pencegahan

### 1. Restart Server Berkala
```bash
# Stop server
npm run stop

# Start server
npm run dev
```

### 2. Monitor Console
- Buka Developer Tools untuk melihat error
- Jika ada error berulang, restart aplikasi

### 3. Update Browser
- Pastikan menggunakan browser versi terbaru
- Chrome/Edge versi 100+ direkomendasikan

## Status Perbaikan
✅ **FIXED** - Interval dashboard dikurangi dari 5 detik ke 2 menit
✅ **FIXED** - useEffect dependencies dioptimasi
✅ **FIXED** - Visibility API ditambahkan
✅ **READY** - Script manual tersedia jika diperlukan

## Hasil yang Diharapkan
- Pesan "session too long" tidak muncul lagi
- Dashboard tetap responsif dan update otomatis
- Performa aplikasi lebih baik
- Resource browser lebih efisien