# 🧪 INSTRUKSI TEST EDGE - SEKOLAH BARU

## 🎯 Yang Sudah Diperbaiki

1. ✅ **Import schoolsApi** ditambahkan ke `client/src/pages/schools.tsx`
2. ✅ **User ID mismatch** diperbaiki di API
3. ✅ **Server restart** dengan perubahan terbaru
4. ✅ **Test script** siap untuk Edge browser

## 🚀 Cara Test di Edge

### 1. Buka File Test
```
Buka file: TEST_SEKOLAH_BARU_EDGE_LANGSUNG.html
```

### 2. Jalankan Test Otomatis
- File akan auto-test koneksi Supabase
- Cek data sekolah existing
- Fix user ID jika diperlukan

### 3. Test Input Manual
- Isi form sekolah baru
- Klik "📤 Input Sekolah Sekarang"
- Lihat log untuk konfirmasi

### 4. Test di Aplikasi Utama
```
1. Buka: http://localhost:5173
2. Login sebagai wawan (password: wawan123)
3. Pergi ke halaman Sekolah
4. Klik "Tambah Sekolah"
5. Isi data sekolah baru
6. Klik Simpan
```

## 🔍 Yang Harus Dicek

### ✅ Indikator Berhasil:
- Console log: "✅ School saved to Supabase"
- Data muncul di halaman sekolah
- Data tersimpan di Supabase dashboard

### ❌ Indikator Gagal:
- Console error: "schoolsApi is not defined"
- Console error: "foreign key constraint"
- Data tidak muncul di halaman

## 🛠️ Troubleshooting

### Jika schoolsApi not defined:
```javascript
// Cek di console browser:
console.log(typeof schoolsApi);
// Harus return: "object"
```

### Jika user ID error:
```javascript
// Jalankan di console:
const user = JSON.parse(localStorage.getItem('auth_user'));
console.log('User ID:', user.id);
// Harus format UUID dengan tanda "-"
```

### Jika data tidak masuk Supabase:
1. Cek network tab untuk API calls
2. Lihat console untuk error messages
3. Jalankan test script untuk debug

## 📊 Expected Results

### Test Script Results:
```
🟢 Connected to Supabase
✅ Total sekolah di Supabase: X
✅ User ID sudah benar
✅ Insert successful!
✅ Data juga disimpan ke localStorage
```

### Aplikasi Results:
```
Console Log:
📝 Submitting school to Supabase: {name: "...", ...}
✅ School saved to Supabase: {id: "...", ...}
✅ Data updated in localStorage
```

## 🎯 Next Steps

Setelah test berhasil:
1. ✅ Konfirmasi data masuk Supabase
2. ✅ Konfirmasi data muncul di aplikasi
3. ✅ Test dengan beberapa sekolah baru
4. ✅ Verifikasi sinkronisasi data

---

**🚀 READY TO TEST! Buka TEST_SEKOLAH_BARU_EDGE_LANGSUNG.html di Edge browser.**