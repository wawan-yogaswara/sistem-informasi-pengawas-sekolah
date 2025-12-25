// CEK SEMUA HALAMAN SUPABASE - Jalankan di console
// Script untuk mengecek status koneksi Supabase di semua halaman

console.log('🔍 MENGECEK SEMUA HALAMAN SUPABASE...');
console.log('='.repeat(60));

const supabaseUrl = 'https://glhaliktsrcvnznbgxqt.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdsaGFsaWt0c3Jjdm56bmJneHF0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjYzNjYyMjQsImV4cCI6MjA4MTk0MjIyNH0._kaFo2h7rCdouJp2rpb1lmEvlR6gAc0c3AnRjM_PhP4';

// Check if supabase is available
if (typeof window.supabase === 'undefined') {
    console.error('❌ Supabase client tidak tersedia!');
    console.log('📝 Pastikan Supabase sudah diimport dengan benar');
    return;
}

const client = window.supabase.createClient(supabaseUrl, supabaseKey);

// Function to check table data
async function checkTable(tableName, displayName) {
    try {
        console.log(`\n📊 ${displayName.toUpperCase()}`);
        console.log('-'.repeat(40));
        
        const { data, error } = await client
            .from(tableName)
            .select('*')
            .limit(5);
        
        if (error) {
            console.error(`❌ Error ${tableName}:`, error.message);
            return { status: 'error', count: 0, error: error.message };
        }
        
        console.log(`✅ ${displayName}: ${data?.length || 0} records`);
        
        if (data && data.length > 0) {
            console.log('📋 Sample data:');
            data.forEach((item, index) => {
                const title = item.title || item.name || item.username || 'No title';
                const date = item.created_at ? new Date(item.created_at).toLocaleDateString('id-ID') : 'No date';
                console.log(`   ${index + 1}. ${title} (${date})`);
            });
        } else {
            console.log('⚪ Tidak ada data');
        }
        
        return { status: 'success', count: data?.length || 0 };
        
    } catch (error) {
        console.error(`💥 Exception ${tableName}:`, error);
        return { status: 'exception', count: 0, error: error.message };
    }
}

// Check all tables
async function checkAllTables() {
    const results = {};
    
    // Check each table
    results.schools = await checkTable('schools', 'Sekolah Binaan');
    results.tasks = await checkTable('tasks', 'Tugas Harian');
    results.additional_tasks = await checkTable('additional_tasks', 'Tugas Tambahan');
    results.supervisions = await checkTable('supervisions', 'Supervisi');
    results.users = await checkTable('users', 'Users');
    
    // Summary
    console.log('\n' + '='.repeat(60));
    console.log('📊 RINGKASAN STATUS SUPABASE');
    console.log('='.repeat(60));
    
    let totalRecords = 0;
    let successTables = 0;
    let errorTables = 0;
    
    Object.entries(results).forEach(([table, result]) => {
        const displayNames = {
            schools: 'Sekolah Binaan',
            tasks: 'Tugas Harian', 
            additional_tasks: 'Tugas Tambahan',
            supervisions: 'Supervisi',
            users: 'Users'
        };
        
        const status = result.status === 'success' ? '✅' : '❌';
        const count = result.count || 0;
        
        console.log(`${status} ${displayNames[table]}: ${count} records`);
        
        if (result.status === 'success') {
            successTables++;
            totalRecords += count;
        } else {
            errorTables++;
            if (result.error) {
                console.log(`   Error: ${result.error}`);
            }
        }
    });
    
    console.log('-'.repeat(40));
    console.log(`📈 Total Records: ${totalRecords}`);
    console.log(`✅ Success Tables: ${successTables}/5`);
    console.log(`❌ Error Tables: ${errorTables}/5`);
    
    // Recommendations
    console.log('\n🎯 REKOMENDASI:');
    
    if (errorTables === 0) {
        console.log('🎉 Semua tabel berhasil terkoneksi!');
        console.log('✅ Aplikasi siap digunakan dengan Pure Supabase');
    } else {
        console.log('⚠️ Ada masalah dengan beberapa tabel:');
        
        Object.entries(results).forEach(([table, result]) => {
            if (result.status !== 'success') {
                console.log(`   - ${table}: Perlu diperbaiki`);
            }
        });
        
        console.log('\n🔧 LANGKAH PERBAIKAN:');
        console.log('1. Pastikan tabel sudah dibuat di Supabase');
        console.log('2. Cek RLS policies untuk setiap tabel');
        console.log('3. Pastikan struktur tabel sesuai dengan frontend');
        console.log('4. Update halaman yang bermasalah ke Pure Supabase');
    }
    
    // Check localStorage conflicts
    console.log('\n🧹 CEK KONFLIK LOCALSTORAGE:');
    const localStorageKeys = [
        'schools_data',
        'tasks_data', 
        'additional_tasks_data',
        'supervisions_data',
        'users_data'
    ];
    
    let hasConflicts = false;
    localStorageKeys.forEach(key => {
        if (localStorage.getItem(key)) {
            console.log(`⚠️ Ditemukan: ${key}`);
            hasConflicts = true;
        }
    });
    
    if (hasConflicts) {
        console.log('💡 Jalankan script pembersihan localStorage untuk menghindari konflik');
    } else {
        console.log('✅ Tidak ada konflik localStorage');
    }
    
    return results;
}

// Run the check
checkAllTables().then(() => {
    console.log('\n✅ Pemeriksaan selesai!');
}).catch(error => {
    console.error('💥 Error during check:', error);
});

// Helper function to clean localStorage
window.cleanAllLocalStorage = function() {
    console.log('🧹 MEMBERSIHKAN SEMUA LOCALSTORAGE...');
    
    const keysToRemove = [
        'schools_data', 'schools_data_backup', 'schools_data_timestamp',
        'tasks_data', 'tasks_data_backup', 'tasks_data_timestamp',
        'additional_tasks_data', 'additional_tasks_data_backup', 'additional_tasks_data_timestamp',
        'supervisions_data', 'supervisions_data_backup', 'supervisions_data_timestamp',
        'users_data', 'users_data_backup', 'users_data_timestamp'
    ];
    
    let removedCount = 0;
    keysToRemove.forEach(key => {
        if (localStorage.getItem(key)) {
            localStorage.removeItem(key);
            console.log('✅ Removed:', key);
            removedCount++;
        }
    });
    
    console.log(`🎯 Selesai! ${removedCount} keys dihapus`);
    console.log('🔄 Refresh halaman untuk melihat perubahan');
    
    setTimeout(() => {
        window.location.reload();
    }, 2000);
};

console.log('\n💡 TIPS:');
console.log('- Jalankan cleanAllLocalStorage() untuk membersihkan localStorage');
console.log('- Refresh halaman setelah membersihkan localStorage');
console.log('- Coba input data baru untuk test koneksi Supabase');