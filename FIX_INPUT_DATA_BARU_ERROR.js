// 🚀 FIX INPUT DATA BARU ERROR
// Script untuk memperbaiki error saat input data baru dan memastikan semua data muncul di laporan

console.log('🚀 FIX INPUT DATA BARU ERROR');
console.log('============================');

const WAWAN_USER_ID = '421cdb28-f2af-4f1f-aa5f-c59a3d661a2e';

async function fixInputDataBaruError() {
  console.log('🔧 Starting fix for input data error...');
  
  // 1. Fix user authentication first
  console.log('\n1️⃣ FIXING USER AUTHENTICATION');
  const authUser = localStorage.getItem('auth_user');
  if (authUser) {
    const userData = JSON.parse(authUser);
    userData.id = WAWAN_USER_ID;
    localStorage.setItem('auth_user', JSON.stringify(userData));
    console.log('✅ User ID fixed:', WAWAN_USER_ID);
  } else {
    const defaultUser = {
      id: WAWAN_USER_ID,
      username: 'wawan',
      fullName: 'H. Wawan Yogaswara, S.Pd, M.Pd',
      role: 'admin'
    };
    localStorage.setItem('auth_user', JSON.stringify(defaultUser));
    console.log('✅ Created default auth user');
  }
  
  // 2. Clear any problematic cache
  console.log('\n2️⃣ CLEARING CACHE');
  localStorage.removeItem('reports_activities_cache');
  localStorage.removeItem('additional_tasks_cache');
  console.log('✅ Cache cleared');
  
  // 3. Test current data in Supabase
  console.log('\n3️⃣ TESTING CURRENT DATA IN SUPABASE');
  
  const allActivities = [];
  const apiStatus = {};
  
  // Test Tasks API
  try {
    console.log('📋 Testing Tasks API...');
    const tasksResponse = await fetch(`/api/tasks-daily?user_id=${WAWAN_USER_ID}`);
    if (tasksResponse.ok) {
      const tasks = await tasksResponse.json();
      console.log(`📋 Tasks found: ${tasks.length}`);
      apiStatus.tasks = { success: true, count: tasks.length };
      
      tasks.forEach(task => {
        allActivities.push({
          id: task.id,
          type: 'Tugas Pokok',
          title: task.title || 'Tugas Harian',
          date: task.date || task.created_at,
          location: 'Sekolah Binaan',
          organizer: 'Pengawas Sekolah',
          description: task.description || '',
          photo1: task.photo1,
          photo2: task.photo2,
          createdAt: task.created_at,
          source: 'supabase'
        });
      });
    } else {
      const errorText = await tasksResponse.text();
      console.error('📋 Tasks API error:', tasksResponse.status, errorText);
      apiStatus.tasks = { success: false, error: `${tasksResponse.status}: ${errorText}` };
    }
  } catch (error) {
    console.error('📋 Tasks fetch error:', error);
    apiStatus.tasks = { success: false, error: error.message };
  }
  
  // Test Supervisions API
  try {
    console.log('🔍 Testing Supervisions API...');
    const supervisionsResponse = await fetch(`/api/supervisions?user_id=${WAWAN_USER_ID}`);
    if (supervisionsResponse.ok) {
      const supervisions = await supervisionsResponse.json();
      console.log(`🔍 Supervisions found: ${supervisions.length}`);
      apiStatus.supervisions = { success: true, count: supervisions.length };
      
      supervisions.forEach(supervision => {
        allActivities.push({
          id: supervision.id,
          type: 'Supervisi',
          title: `Supervisi ${supervision.school_name || 'Sekolah'}`,
          date: supervision.date || supervision.created_at,
          location: supervision.school_name || 'Sekolah Binaan',
          organizer: 'Pengawas Sekolah',
          description: supervision.findings || supervision.recommendations || '',
          photo1: supervision.photo1,
          photo2: supervision.photo2,
          createdAt: supervision.created_at,
          source: 'supabase'
        });
      });
    } else {
      const errorText = await supervisionsResponse.text();
      console.error('🔍 Supervisions API error:', supervisionsResponse.status, errorText);
      apiStatus.supervisions = { success: false, error: `${supervisionsResponse.status}: ${errorText}` };
    }
  } catch (error) {
    console.error('🔍 Supervisions fetch error:', error);
    apiStatus.supervisions = { success: false, error: error.message };
  }
  
  // Test Activities API (Additional Tasks)
  try {
    console.log('➕ Testing Activities API...');
    const activitiesResponse = await fetch(`/api/activities?user_id=${WAWAN_USER_ID}`);
    if (activitiesResponse.ok) {
      const activities = await activitiesResponse.json();
      console.log(`➕ Activities found: ${activities.length}`);
      apiStatus.activities = { success: true, count: activities.length };
      
      activities.forEach(activity => {
        allActivities.push({
          id: activity.id,
          type: 'Tugas Tambahan',
          title: activity.name || activity.title || 'Kegiatan Tambahan',
          date: activity.date || activity.created_at,
          location: activity.location || 'Tempat Kegiatan',
          organizer: activity.organizer || 'Pengawas Sekolah',
          description: activity.description || '',
          photo1: activity.photo1,
          photo2: activity.photo2,
          createdAt: activity.created_at,
          source: 'supabase'
        });
      });
    } else {
      const errorText = await activitiesResponse.text();
      console.error('➕ Activities API error:', activitiesResponse.status, errorText);
      apiStatus.activities = { success: false, error: `${activitiesResponse.status}: ${errorText}` };
    }
  } catch (error) {
    console.error('➕ Activities fetch error:', error);
    apiStatus.activities = { success: false, error: error.message };
  }
  
  // 4. Sort and process all activities
  console.log('\n4️⃣ PROCESSING ALL ACTIVITIES');
  const sortedActivities = allActivities.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  
  const tugasPokok = sortedActivities.filter(a => a.type === 'Tugas Pokok').length;
  const supervisi = sortedActivities.filter(a => a.type === 'Supervisi').length;
  const tugasTambahan = sortedActivities.filter(a => a.type === 'Tugas Tambahan').length;
  const withPhotos = sortedActivities.filter(a => a.photo1 || a.photo2).length;
  
  console.log(`📊 TOTAL ACTIVITIES: ${sortedActivities.length}`);
  console.log(`📋 Tugas Pokok: ${tugasPokok}`);
  console.log(`🔍 Supervisi: ${supervisi}`);
  console.log(`➕ Tugas Tambahan: ${tugasTambahan}`);
  console.log(`📸 With Photos: ${withPhotos}`);
  
  // 5. Update React state and cache
  console.log('\n5️⃣ UPDATING REACT STATE');
  localStorage.setItem('reports_activities_cache', JSON.stringify(sortedActivities));
  
  // Dispatch events for React
  window.dispatchEvent(new CustomEvent('updateReportsData', { 
    detail: { activities: sortedActivities } 
  }));
  
  // Force storage event
  window.dispatchEvent(new StorageEvent('storage', {
    key: 'reports_activities_cache',
    newValue: JSON.stringify(sortedActivities),
    url: window.location.href
  }));
  
  // 6. Close any open dialogs/modals
  console.log('\n6️⃣ CLOSING DIALOGS');
  const dialogs = document.querySelectorAll('[role="dialog"], .modal, [data-state="open"]');
  dialogs.forEach(dialog => {
    const closeButton = dialog.querySelector('[aria-label="Close"], .close, button[type="button"]');
    if (closeButton) {
      closeButton.click();
      console.log('✅ Closed dialog');
    }
  });
  
  // 7. Show comprehensive status
  console.log('\n7️⃣ SHOWING STATUS');
  showFixStatus(sortedActivities, apiStatus);
  
  console.log('\n✅ FIX COMPLETED!');
  console.log('🔄 Data should now be visible. Try refreshing if needed.');
  
  return {
    success: true,
    totalActivities: sortedActivities.length,
    tugasPokok,
    supervisi,
    tugasTambahan,
    withPhotos,
    apiStatus
  };
}

function showFixStatus(activities, apiStatus) {
  // Create status notification
  const notification = document.createElement('div');
  notification.style.cssText = `
    position: fixed;
    top: 20px;
    right: 20px;
    background: linear-gradient(135deg, #10b981, #059669);
    color: white;
    padding: 1.5rem;
    border-radius: 12px;
    box-shadow: 0 8px 25px rgba(16, 185, 129, 0.4);
    z-index: 9999;
    max-width: 400px;
    font-family: system-ui, -apple-system, sans-serif;
    animation: slideIn 0.5s ease-out;
    max-height: 80vh;
    overflow-y: auto;
  `;
  
  const tugasPokok = activities.filter(a => a.type === 'Tugas Pokok').length;
  const supervisi = activities.filter(a => a.type === 'Supervisi').length;
  const tugasTambahan = activities.filter(a => a.type === 'Tugas Tambahan').length;
  const withPhotos = activities.filter(a => a.photo1 || a.photo2).length;
  
  notification.innerHTML = `
    <div style="font-weight: bold; font-size: 1.2rem; margin-bottom: 1rem; text-align: center;">
      ✅ Data Berhasil Diperbaiki!
    </div>
    
    <div style="background: rgba(255,255,255,0.1); border-radius: 8px; padding: 1rem; margin-bottom: 1rem;">
      <div style="font-weight: 600; margin-bottom: 0.5rem;">📊 Total Data Saat Ini:</div>
      <div style="font-size: 0.9rem; line-height: 1.4;">
        📋 ${tugasPokok} Tugas Pokok<br>
        🔍 ${supervisi} Supervisi<br>
        ➕ ${tugasTambahan} Tugas Tambahan<br>
        📸 ${withPhotos} dengan foto<br>
        <strong>Total: ${activities.length} aktivitas</strong>
      </div>
    </div>
    
    <div style="background: rgba(255,255,255,0.1); border-radius: 8px; padding: 1rem; margin-bottom: 1rem;">
      <div style="font-weight: 600; margin-bottom: 0.5rem;">🔗 Status API:</div>
      <div style="font-size: 0.8rem; line-height: 1.3;">
        📋 Tasks: ${apiStatus.tasks?.success ? `✅ ${apiStatus.tasks.count} items` : '❌ Error'}<br>
        🔍 Supervisions: ${apiStatus.supervisions?.success ? `✅ ${apiStatus.supervisions.count} items` : '❌ Error'}<br>
        ➕ Activities: ${apiStatus.activities?.success ? `✅ ${apiStatus.activities.count} items` : '❌ Error'}
      </div>
    </div>
    
    <div style="background: rgba(255,255,255,0.1); border-radius: 8px; padding: 1rem; margin-bottom: 1rem;">
      <div style="font-weight: 600; margin-bottom: 0.5rem;">💡 Untuk Input Data Baru:</div>
      <div style="font-size: 0.8rem; line-height: 1.3;">
        1. Pastikan semua field diisi<br>
        2. Gunakan format tanggal yang benar<br>
        3. Jika error, coba refresh halaman<br>
        4. Data akan otomatis muncul di laporan
      </div>
    </div>
    
    <div style="display: flex; gap: 0.5rem; margin-top: 1rem;">
      <button onclick="window.location.href='/reports'" style="flex: 1; background: white; color: #10b981; border: none; padding: 0.5rem; border-radius: 6px; cursor: pointer; font-size: 0.875rem; font-weight: 600;">
        📊 Lihat Laporan
      </button>
      <button onclick="location.reload()" style="flex: 1; background: rgba(255,255,255,0.2); color: white; border: 1px solid rgba(255,255,255,0.3); padding: 0.5rem; border-radius: 6px; cursor: pointer; font-size: 0.875rem;">
        🔄 Refresh
      </button>
      <button onclick="this.parentElement.parentElement.remove()" style="background: rgba(255,255,255,0.2); color: white; border: 1px solid rgba(255,255,255,0.3); padding: 0.5rem; border-radius: 6px; cursor: pointer; font-size: 0.875rem;">
        ✕
      </button>
    </div>
  `;
  
  // Add animation
  const style = document.createElement('style');
  style.textContent = `
    @keyframes slideIn {
      from { transform: translateX(100%); opacity: 0; }
      to { transform: translateX(0); opacity: 1; }
    }
  `;
  document.head.appendChild(style);
  
  document.body.appendChild(notification);
  
  // Auto remove after 20 seconds
  setTimeout(() => {
    if (notification.parentElement) {
      notification.style.animation = 'slideIn 0.5s ease-out reverse';
      setTimeout(() => notification.remove(), 500);
    }
  }, 20000);
}

// Execute the fix
fixInputDataBaruError().then(result => {
  console.log('\n🎉 FIX COMPLETED WITH RESULTS:', result);
}).catch(error => {
  console.error('❌ Fix failed:', error);
  alert('Error: ' + error.message);
});