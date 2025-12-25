// BERSIHKAN LOCALSTORAGE SEKOLAH - Jalankan di console
// Copy paste script ini ke console browser untuk membersihkan localStorage

console.log('🧹 MEMBERSIHKAN LOCALSTORAGE SEKOLAH...');

// Hapus semua data sekolah di localStorage
const keysToRemove = [
    'schools_data',
    'schools_data_backup', 
    'schools_data_timestamp'
];

keysToRemove.forEach(key => {
    if (localStorage.getItem(key)) {
        localStorage.removeItem(key);
        console.log('✅ Removed:', key);
    } else {
        console.log('⚪ Not found:', key);
    }
});

console.log('🎯 SELESAI! localStorage sekolah sudah bersih.');
console.log('📝 Sekarang aplikasi akan menggunakan Pure Supabase.');
console.log('🔄 Refresh halaman untuk melihat perubahan.');

// Optional: Refresh halaman otomatis
setTimeout(() => {
    console.log('🔄 Auto-refreshing page...');
    window.location.reload();
}, 2000);