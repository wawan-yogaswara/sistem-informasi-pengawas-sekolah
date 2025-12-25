# OPTIMASI FOTO LAPORAN - PEMBATASAN 6 FOTO

## Masalah
Laporan bulanan dan tahunan bisa memuat banyak foto yang membebani bandwidth Supabase dan memperlambat loading PDF.

## Solusi Diterapkan
✅ **Pembatasan maksimal 6 foto** per laporan PDF
✅ **Prioritas foto terbaru** - foto dari aktivitas terbaru diprioritaskan
✅ **Informasi yang jelas** - user diberi tahu berapa foto yang ditampilkan

## Detail Implementasi

### 1. Algoritma Prioritas Foto
- Aktivitas diurutkan berdasarkan tanggal (terbaru dulu)
- Foto diambil dari aktivitas terbaru terlebih dahulu
- Maksimal 6 foto total (photo1 dan photo2 dari berbagai aktivitas)

### 2. Feedback User
- Jika > 6 foto: "Menampilkan 6 foto terbaru dari X foto (dibatasi untuk menghemat bandwidth)"
- Jika ≤ 6 foto: "Menampilkan X foto dokumentasi kegiatan"

### 3. Manfaat
- **Bandwidth hemat** - Mengurangi beban Supabase
- **Loading cepat** - PDF generate lebih cepat
- **Kualitas terjaga** - Foto terbaru lebih relevan

## Penggunaan
Pembatasan ini otomatis berlaku untuk:
- Laporan Bulanan (Export PDF Bulanan)
- Laporan Tahunan (Export PDF Tahunan)
- Laporan Semua Aktivitas (Export ke PDF)

## Catatan Teknis
- Foto dipilih berdasarkan `activity.date` (newest first)
- Double safety check dengan `slice(0, 6)`
- Metadata foto disimpan (caption, date, type) untuk debugging