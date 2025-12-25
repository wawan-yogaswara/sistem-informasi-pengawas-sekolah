// Auto-sync script untuk memastikan data selalu tersinkronisasi dengan Supabase
// Jalankan script ini di console browser atau tambahkan ke aplikasi

console.log('🔄 MEMULAI AUTO-SYNC SUPABASE');
console.log('==============================');

// Konfigurasi Supabase
const SUPABASE_URL = 'https://glhaliktsrcvnznbgxqt.supabase.co';
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdsaGFsaWt0c3Jjdm56bmJneHF0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjYzNjYyMjQsImV4cCI6MjA4MTk0MjIyNH0._kaFo2h7rCdouJp2rpb1lmEvlR6gAc0c3AnRjM_PhP4';

// Interval sync (dalam milidetik)
const SYNC_INTERVAL = 30000; // 30 detik
const FORCE_SYNC_INTERVAL = 300000; // 5 menit

let syncTimer = null;
let forceSyncTimer = null;

// Fungsi untuk mendapatkan user session
function getCurrentUser() {
  const authUser = localStorage.getItem('auth_user');
  return authUser ? JSON.parse(authUser) : null;
}

// Fungsi untuk sync data ke Supabase
async function syncToSupabase(dataType, data, tableName) {
  try {
    const user = getCurrentUser();
    if (!user) {
      console.log('⚠️ No user session - skipping sync');
      return false;
    }

    const response = await fetch(`${SUPABASE_URL}/rest/v1/${tableName}`, {
      method: 'POST',
      headers: {
        'apikey': SUPABASE_KEY,
        'Authorization': `Bearer ${SUPABASE_KEY}`,
        'Content-Type': 'application/json',
        'Prefer': 'resolution=ignore-duplicates'
      },
      body: JSON.stringify({
        ...data,
        user_id: user.id
      })
    });

    if (response.ok) {
      console.log(`✅ Synced ${dataType} to Supabase:`, data.title || data.name);
      return true;
    } else {
      console.log(`⚠️ Failed to sync ${dataType}:`, response.status);
      return false;
    }
  } catch (error) {
    console.error(`❌ Error syncing ${dataType}:`, error);
    return false;
  }
}

// Fungsi untuk sync pending data
async function syncPendingData() {
  console.log('🔄 Checking for pending sync data...');
  
  try {
    // Sync pending tasks
    const pendingTasks = JSON.parse(localStorage.getItem('pending_sync_tasks') || '[]');
    if (pendingTasks.length > 0) {
      console.log(`📋 Syncing ${pendingTasks.length} pending tasks...`);
      
      const syncedTasks = [];
      for (const task of pendingTasks) {
        const success = await syncToSupabase('task', {
          title: task.title,
          category: task.category || 'Umum',
          description: task.description || '',
          completed: task.completed || false,
          date: task.date,
          photo1: task.photo1 || null
        }, 'tasks');
        
        if (success) {
          syncedTasks.push(task);
        }
      }
      
      // Remove synced tasks from pending
      const remainingTasks = pendingTasks.filter(task => !syncedTasks.includes(task));
      localStorage.setItem('pending_sync_tasks', JSON.stringify(remainingTasks));
      
      if (syncedTasks.length > 0) {
        console.log(`✅ Synced ${syncedTasks.length} pending tasks`);
      }
    }
    
    // Sync pending additional tasks
    const pendingAdditionalTasks = JSON.parse(localStorage.getItem('pending_sync_additional_tasks') || '[]');
    if (pendingAdditionalTasks.length > 0) {
      console.log(`📋 Syncing ${pendingAdditionalTasks.length} pending additional tasks...`);
      
      const syncedTasks = [];
      for (const task of pendingAdditionalTasks) {
        const success = await syncToSupabase('additional_task', {
          name: task.name,
          date: task.date,
          location: task.location || '',
          organizer: task.organizer || '',
          description: task.description || '',
          photo1: task.photo1 || null
        }, 'additional_tasks');
        
        if (success) {
          syncedTasks.push(task);
        }
      }
      
      // Remove synced tasks from pending
      const remainingTasks = pendingAdditionalTasks.filter(task => !syncedTasks.includes(task));
      localStorage.setItem('pending_sync_additional_tasks', JSON.stringify(remainingTasks));
      
      if (syncedTasks.length > 0) {
        console.log(`✅ Synced ${syncedTasks.length} pending additional tasks`);
      }
    }
    
  } catch (error) {
    console.error('❌ Error syncing pending data:', error);
  }
}

// Fungsi untuk refresh data dari Supabase
async function refreshFromSupabase() {
  console.log('🔄 Refreshing data from Supabase...');
  
  try {
    // Refresh tasks
    const tasksResponse = await fetch(`${SUPABASE_URL}/rest/v1/tasks?select=*&order=date.desc`, {
      headers: {
        'apikey': SUPABASE_KEY,
        'Authorization': `Bearer ${SUPABASE_KEY}`
      }
    });
    
    if (tasksResponse.ok) {
      const tasks = await tasksResponse.json();
      const currentTasks = JSON.parse(localStorage.getItem('tasks_data') || '[]');
      
      if (tasks.length !== currentTasks.length) {
        localStorage.setItem('tasks_data', JSON.stringify(tasks));
        console.log(`✅ Updated tasks: ${tasks.length} records`);
        
        // Trigger custom event untuk update UI
        window.dispatchEvent(new CustomEvent('dataUpdated', { 
          detail: { type: 'tasks', data: tasks } 
        }));
      }
    }
    
    // Refresh additional tasks
    const additionalTasksResponse = await fetch(`${SUPABASE_URL}/rest/v1/additional_tasks?select=*&order=date.desc`, {
      headers: {
        'apikey': SUPABASE_KEY,
        'Authorization': `Bearer ${SUPABASE_KEY}`
      }
    });
    
    if (additionalTasksResponse.ok) {
      const additionalTasks = await additionalTasksResponse.json();
      const currentAdditionalTasks = JSON.parse(localStorage.getItem('additional_tasks_data') || '[]');
      
      if (additionalTasks.length !== currentAdditionalTasks.length) {
        localStorage.setItem('additional_tasks_data', JSON.stringify(additionalTasks));
        console.log(`✅ Updated additional tasks: ${additionalTasks.length} records`);
        
        // Trigger custom event untuk update UI
        window.dispatchEvent(new CustomEvent('dataUpdated', { 
          detail: { type: 'additional_tasks', data: additionalTasks } 
        }));
      }
    }
    
    // Refresh schools
    const schoolsResponse = await fetch(`${SUPABASE_URL}/rest/v1/schools?select=*&order=created_at.desc`, {
      headers: {
        'apikey': SUPABASE_KEY,
        'Authorization': `Bearer ${SUPABASE_KEY}`
      }
    });
    
    if (schoolsResponse.ok) {
      const schools = await schoolsResponse.json();
      const currentSchools = JSON.parse(localStorage.getItem('schools_data') || '[]');
      
      if (schools.length !== currentSchools.length) {
        localStorage.setItem('schools_data', JSON.stringify(schools));
        console.log(`✅ Updated schools: ${schools.length} records`);
        
        // Trigger custom event untuk update UI
        window.dispatchEvent(new CustomEvent('dataUpdated', { 
          detail: { type: 'schools', data: schools } 
        }));
      }
    }
    
  } catch (error) {
    console.error('❌ Error refreshing from Supabase:', error);
  }
}

// Fungsi untuk memulai auto-sync
function startAutoSync() {
  console.log('🚀 Starting auto-sync...');
  
  // Sync pending data setiap 30 detik
  syncTimer = setInterval(async () => {
    await syncPendingData();
  }, SYNC_INTERVAL);
  
  // Force refresh dari Supabase setiap 5 menit
  forceSyncTimer = setInterval(async () => {
    await refreshFromSupabase();
  }, FORCE_SYNC_INTERVAL);
  
  // Initial sync
  setTimeout(async () => {
    await syncPendingData();
    await refreshFromSupabase();
  }, 2000);
  
  console.log('✅ Auto-sync started');
  console.log(`📋 Pending sync check: every ${SYNC_INTERVAL/1000} seconds`);
  console.log(`🔄 Force refresh: every ${FORCE_SYNC_INTERVAL/1000} seconds`);
}

// Fungsi untuk menghentikan auto-sync
function stopAutoSync() {
  if (syncTimer) {
    clearInterval(syncTimer);
    syncTimer = null;
  }
  
  if (forceSyncTimer) {
    clearInterval(forceSyncTimer);
    forceSyncTimer = null;
  }
  
  console.log('⏹️ Auto-sync stopped');
}

// Fungsi untuk manual sync
async function manualSync() {
  console.log('🔄 Manual sync triggered...');
  await syncPendingData();
  await refreshFromSupabase();
  console.log('✅ Manual sync completed');
}

// Override localStorage setItem untuk auto-detect perubahan data
const originalSetItem = localStorage.setItem;
localStorage.setItem = function(key, value) {
  originalSetItem.call(this, key, value);
  
  // Jika data tasks atau additional_tasks berubah, trigger sync
  if (key === 'tasks_data' || key === 'additional_tasks_data' || key === 'schools_data') {
    console.log(`📝 Data changed: ${key} - scheduling sync...`);
    
    // Delay sync sedikit untuk menghindari multiple calls
    setTimeout(async () => {
      await syncPendingData();
    }, 1000);
  }
};

// Event listener untuk visibility change (ketika user switch tab/browser)
document.addEventListener('visibilitychange', async () => {
  if (!document.hidden) {
    console.log('👁️ Page visible - refreshing data...');
    await refreshFromSupabase();
  }
});

// Event listener untuk online/offline
window.addEventListener('online', async () => {
  console.log('🌐 Back online - syncing data...');
  await manualSync();
});

window.addEventListener('offline', () => {
  console.log('📴 Offline - data will be synced when back online');
});

// Export functions untuk kontrol manual
window.autoSync = {
  start: startAutoSync,
  stop: stopAutoSync,
  manual: manualSync,
  syncPending: syncPendingData,
  refresh: refreshFromSupabase
};

// Auto-start jika ada user session
if (getCurrentUser()) {
  startAutoSync();
} else {
  console.log('⚠️ No user session - auto-sync will start after login');
  
  // Listen untuk login event
  window.addEventListener('storage', (e) => {
    if (e.key === 'auth_user' && e.newValue) {
      console.log('👤 User logged in - starting auto-sync...');
      startAutoSync();
    } else if (e.key === 'auth_user' && !e.newValue) {
      console.log('👤 User logged out - stopping auto-sync...');
      stopAutoSync();
    }
  });
}

console.log('✅ Auto-sync script loaded');
console.log('💡 Use window.autoSync.manual() untuk manual sync');
console.log('💡 Use window.autoSync.stop() untuk stop auto-sync');
console.log('💡 Use window.autoSync.start() untuk start auto-sync');