// Script untuk membersihkan data migrasi lama dari Supabase
// Jalankan di console browser untuk menghapus data hasil migrasi yang menggangu

console.log('🗑️ MEMBERSIHKAN DATA MIGRASI LAMA DARI SUPABASE');
console.log('===============================================');

// Konfigurasi Supabase
const SUPABASE_URL = 'https://glhaliktsrcvnznbgxqt.supabase.co';
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdsaGFsaWt0c3Jjdm56bmJneHF0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjYzNjYyMjQsImV4cCI6MjA4MTk0MjIyNH0._kaFo2h7rCdouJp2rpb1lmEvlR6gAc0c3AnRjM_PhP4';

// Daftar data migrasi yang akan dihapus
const MIGRATION_DATA_PATTERNS = [
  'Silaturahmi dan perkenalan kepala SMKN',
  'Pisah sambut kepala SMKN 14 Garut',
  'Apel Pagi',
  'Apel pagi',
  'silaturahmi',
  'pisah sambut',
  'perkenalan kepala'
];

// Fungsi untuk menghapus data berdasarkan pattern
async function deleteDataByPattern(table, field, pattern) {
  try {
    console.log(`🔍 Mencari data "${pattern}" di tabel ${table}...`);
    
    // Cari data yang match dengan pattern
    const searchResponse = await fetch(`${SUPABASE_URL}/rest/v1/${table}?select=*&${field}=ilike.*${pattern}*`, {
      headers: {
        'apikey': SUPABASE_KEY,
        'Authorization': `Bearer ${SUPABASE_KEY}`
      }
    });
    
    if (searchResponse.ok) {
      const foundData = await searchResponse.json();
      
      if (foundData.length > 0) {
        console.log(`📋 Ditemukan ${foundData.length} data yang akan dihapus:`, foundData.map(item => item[field]));
        
        // Hapus data
        const deleteResponse = await fetch(`${SUPABASE_URL}/rest/v1/${table}?${field}=ilike.*${pattern}*`, {
          method: 'DELETE',
          headers: {
            'apikey': SUPABASE_KEY,
            'Authorization': `Bearer ${SUPABASE_KEY}`
          }
        });
        
        if (deleteResponse.ok) {
          console.log(`✅ Berhasil menghapus data "${pattern}" dari ${table}`);
          return foundData.length;
        } else {
          console.error(`❌ Gagal menghapus data "${pattern}" dari ${table}:`, deleteResponse.status);
          return 0;
        }
      } else {
        console.log(`ℹ️ Tidak ada data "${pattern}" di ${table}`);
        return 0;
      }
    } else {
      console.error(`❌ Gagal mencari data di ${table}:`, searchResponse.status);
      return 0;
    }
  } catch (error) {
    console.error(`❌ Error menghapus data "${pattern}" dari ${table}:`, error);
    return 0;
  }
}

// Fungsi untuk menghapus data berdasarkan tanggal lama
async function deleteOldMigrationData(table, dateField = 'created_at') {
  try {
    console.log(`🗓️ Mencari data lama (sebelum hari ini) di tabel ${table}...`);
    
    const today = new Date().toISOString().split('T')[0];
    
    // Cari data yang dibuat sebelum hari ini
    const searchResponse = await fetch(`${SUPABASE_URL}/rest/v1/${table}?select=*&${dateField}=lt.${today}`, {
      headers: {
        'apikey': SUPABASE_KEY,
        'Authorization': `Bearer ${SUPABASE_KEY}`
      }
    });
    
    if (searchResponse.ok) {
      const oldData = await searchResponse.json();
      
      if (oldData.length > 0) {
        console.log(`📋 Ditemukan ${oldData.length} data lama yang akan dihapus`);
        
        // Hapus data lama
        const deleteResponse = await fetch(`${SUPABASE_URL}/rest/v1/${table}?${dateField}=lt.${today}`, {
          method: 'DELETE',
          headers: {
            'apikey': SUPABASE_KEY,
            'Authorization': `Bearer ${SUPABASE_KEY}`
          }
        });
        
        if (deleteResponse.ok) {
          console.log(`✅ Berhasil menghapus ${oldData.length} data lama dari ${table}`);
          return oldData.length;
        } else {
          console.error(`❌ Gagal menghapus data lama dari ${table}:`, deleteResponse.status);
          return 0;
        }
      } else {
        console.log(`ℹ️ Tidak ada data lama di ${table}`);
        return 0;
      }
    } else {
      console.error(`❌ Gagal mencari data lama di ${table}:`, searchResponse.status);
      return 0;
    }
  } catch (error) {
    console.error(`❌ Error menghapus data lama dari ${table}:`, error);
    return 0;
  }
}

// Fungsi utama untuk membersihkan semua data migrasi
async function cleanAllMigrationData() {
  console.log('🚀 MEMULAI PEMBERSIHAN DATA MIGRASI...');
  
  let totalDeleted = 0;
  
  try {
    // 1. Hapus data berdasarkan pattern dari tabel tasks
    console.log('\n1️⃣ Membersihkan tabel TASKS...');
    for (const pattern of MIGRATION_DATA_PATTERNS) {
      const deleted = await deleteDataByPattern('tasks', 'title', pattern);
      totalDeleted += deleted;
      
      // Delay untuk menghindari rate limiting
      await new Promise(resolve => setTimeout(resolve, 500));
    }
    
    // 2. Hapus data berdasarkan pattern dari tabel additional_tasks
    console.log('\n2️⃣ Membersihkan tabel ADDITIONAL_TASKS...');
    for (const pattern of MIGRATION_DATA_PATTERNS) {
      const deleted = await deleteDataByPattern('additional_tasks', 'name', pattern);
      totalDeleted += deleted;
      
      // Delay untuk menghindari rate limiting
      await new Promise(resolve => setTimeout(resolve, 500));
    }
    
    // 3. Hapus data lama berdasarkan tanggal
    console.log('\n3️⃣ Membersihkan data lama berdasarkan tanggal...');
    const deletedOldTasks = await deleteOldMigrationData('tasks');
    const deletedOldAdditionalTasks = await deleteOldMigrationData('additional_tasks');
    totalDeleted += deletedOldTasks + deletedOldAdditionalTasks;
    
    console.log(`\n✅ PEMBERSIHAN SELESAI!`);
    console.log(`📊 Total data yang dihapus: ${totalDeleted} records`);
    
    // 4. Refresh localStorage
    console.log('\n4️⃣ Refreshing localStorage...');
    await refreshLocalStorageFromSupabase();
    
    console.log('\n🎉 SEMUA SELESAI! Data migrasi lama sudah dibersihkan.');
    console.log('💡 Sekarang coba input data baru - seharusnya langsung masuk ke Supabase.');
    
  } catch (error) {
    console.error('❌ Error dalam pembersihan data:', error);
  }
}

// Fungsi untuk refresh localStorage dari Supabase
async function refreshLocalStorageFromSupabase() {
  try {
    // Refresh tasks
    const tasksResponse = await fetch(`${SUPABASE_URL}/rest/v1/tasks?select=*&order=created_at.desc`, {
      headers: {
        'apikey': SUPABASE_KEY,
        'Authorization': `Bearer ${SUPABASE_KEY}`
      }
    });
    
    if (tasksResponse.ok) {
      const tasks = await tasksResponse.json();
      localStorage.setItem('tasks_data', JSON.stringify(tasks));
      console.log(`✅ Refreshed ${tasks.length} tasks di localStorage`);
    }
    
    // Refresh additional tasks
    const additionalTasksResponse = await fetch(`${SUPABASE_URL}/rest/v1/additional_tasks?select=*&order=created_at.desc`, {
      headers: {
        'apikey': SUPABASE_KEY,
        'Authorization': `Bearer ${SUPABASE_KEY}`
      }
    });
    
    if (additionalTasksResponse.ok) {
      const additionalTasks = await additionalTasksResponse.json();
      localStorage.setItem('additional_tasks_data', JSON.stringify(additionalTasks));
      console.log(`✅ Refreshed ${additionalTasks.length} additional tasks di localStorage`);
    }
    
    // Clear pending sync data
    localStorage.removeItem('pending_sync_tasks');
    localStorage.removeItem('pending_sync_additional_tasks');
    console.log('✅ Cleared pending sync data');
    
  } catch (error) {
    console.error('❌ Error refresh localStorage:', error);
  }
}

// Fungsi untuk backup data sebelum dihapus
async function backupDataBeforeClean() {
  console.log('💾 Membuat backup data sebelum dihapus...');
  
  try {
    // Backup tasks
    const tasksResponse = await fetch(`${SUPABASE_URL}/rest/v1/tasks?select=*`, {
      headers: {
        'apikey': SUPABASE_KEY,
        'Authorization': `Bearer ${SUPABASE_KEY}`
      }
    });
    
    if (tasksResponse.ok) {
      const tasks = await tasksResponse.json();
      localStorage.setItem('backup_tasks_' + Date.now(), JSON.stringify(tasks));
      console.log(`✅ Backup ${tasks.length} tasks`);
    }
    
    // Backup additional tasks
    const additionalTasksResponse = await fetch(`${SUPABASE_URL}/rest/v1/additional_tasks?select=*`, {
      headers: {
        'apikey': SUPABASE_KEY,
        'Authorization': `Bearer ${SUPABASE_KEY}`
      }
    });
    
    if (additionalTasksResponse.ok) {
      const additionalTasks = await additionalTasksResponse.json();
      localStorage.setItem('backup_additional_tasks_' + Date.now(), JSON.stringify(additionalTasks));
      console.log(`✅ Backup ${additionalTasks.length} additional tasks`);
    }
    
    console.log('✅ Backup selesai - data tersimpan di localStorage');
    
  } catch (error) {
    console.error('❌ Error backup data:', error);
  }
}

// Fungsi untuk preview data yang akan dihapus
async function previewDataToDelete() {
  console.log('👀 PREVIEW DATA YANG AKAN DIHAPUS:');
  console.log('==================================');
  
  let totalToDelete = 0;
  
  for (const pattern of MIGRATION_DATA_PATTERNS) {
    // Preview tasks
    try {
      const tasksResponse = await fetch(`${SUPABASE_URL}/rest/v1/tasks?select=*&title=ilike.*${pattern}*`, {
        headers: {
          'apikey': SUPABASE_KEY,
          'Authorization': `Bearer ${SUPABASE_KEY}`
        }
      });
      
      if (tasksResponse.ok) {
        const tasks = await tasksResponse.json();
        if (tasks.length > 0) {
          console.log(`📋 Tasks dengan "${pattern}": ${tasks.length} records`);
          tasks.forEach(task => console.log(`   - ${task.title}`));
          totalToDelete += tasks.length;
        }
      }
    } catch (error) {
      console.error(`Error preview tasks "${pattern}":`, error);
    }
    
    // Preview additional tasks
    try {
      const additionalTasksResponse = await fetch(`${SUPABASE_URL}/rest/v1/additional_tasks?select=*&name=ilike.*${pattern}*`, {
        headers: {
          'apikey': SUPABASE_KEY,
          'Authorization': `Bearer ${SUPABASE_KEY}`
        }
      });
      
      if (additionalTasksResponse.ok) {
        const additionalTasks = await additionalTasksResponse.json();
        if (additionalTasks.length > 0) {
          console.log(`📋 Additional Tasks dengan "${pattern}": ${additionalTasks.length} records`);
          additionalTasks.forEach(task => console.log(`   - ${task.name}`));
          totalToDelete += additionalTasks.length;
        }
      }
    } catch (error) {
      console.error(`Error preview additional tasks "${pattern}":`, error);
    }
  }
  
  console.log(`\n📊 TOTAL DATA YANG AKAN DIHAPUS: ${totalToDelete} records`);
  console.log('\n💡 Untuk melanjutkan pembersihan, jalankan: cleanAllMigrationData()');
}

// Export functions untuk digunakan manual
window.cleanMigrationData = {
  preview: previewDataToDelete,
  backup: backupDataBeforeClean,
  clean: cleanAllMigrationData,
  refresh: refreshLocalStorageFromSupabase
};

// Auto-run preview
console.log('🔍 Menjalankan preview data yang akan dihapus...');
previewDataToDelete().then(() => {
  console.log('\n💡 CARA PENGGUNAAN:');
  console.log('1. window.cleanMigrationData.preview() - Preview data yang akan dihapus');
  console.log('2. window.cleanMigrationData.backup() - Backup data sebelum dihapus');
  console.log('3. window.cleanMigrationData.clean() - Hapus data migrasi');
  console.log('4. window.cleanMigrationData.refresh() - Refresh localStorage');
  console.log('\n⚠️ PERINGATAN: Data yang dihapus tidak bisa dikembalikan!');
});