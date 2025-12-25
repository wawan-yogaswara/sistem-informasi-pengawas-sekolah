// BERSIHKAN LOCALSTORAGE ADDITIONAL TASKS - Jalankan di console
// Copy paste script ini ke console browser untuk membersihkan localStorage

console.log('🧹 MEMBERSIHKAN LOCALSTORAGE ADDITIONAL TASKS...');

// Hapus semua data additional tasks di localStorage
const keysToRemove = [
    'additional_tasks_data',
    'additional_tasks_data_backup', 
    'additional_tasks_data_timestamp'
];

keysToRemove.forEach(key => {
    if (localStorage.getItem(key)) {
        localStorage.removeItem(key);
        console.log('✅ Removed:', key);
    } else {
        console.log('⚪ Not found:', key);
    }
});

console.log('🎯 SELESAI! localStorage additional tasks sudah bersih.');
console.log('📝 Sekarang aplikasi akan menggunakan Pure Supabase.');
console.log('🔄 Refresh halaman untuk melihat perubahan.');

// Optional: Refresh halaman otomatis
setTimeout(() => {
    console.log('🔄 Auto-refreshing page...');
    window.location.reload();
}, 2000);