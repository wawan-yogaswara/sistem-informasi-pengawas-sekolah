// 🚀 FORCE LOAD ALL SUPABASE DATA
// Script untuk memastikan SEMUA data dari Supabase dimuat ke halaman laporan

console.log('🚀 FORCE LOAD ALL SUPABASE DATA');
console.log('===============================');

const WAWAN_USER_ID = '421cdb28-f2af-4f1f-aa5f-c59a3d661a2e';

async function forceLoadAllSupabaseData() {
  console.log('🔍 Starting comprehensive data loading from Supabase...');
  
  // 1. Clear any existing cache first
  console.log('\n1️⃣ CLEARING EXISTING CACHE');
  localStorage.removeItem('reports_activities_cache');
  console.log('✅ Cache cleared');
  
  // 2. Fix user authentication
  console.log('\n2️⃣ FIXING USER AUTHENTICATION');
  const authUser = localStorage.getItem('auth_user');
  if (authUser) {
    const userData = JSON.parse(authUser);
    userData.id = WAWAN_USER_ID;
    localStorage.setItem('auth_user', JSON.stringify(userData));
    console.log('✅ User ID fixed:', WAWAN_USER_ID);
  }
  
  // 3. Test all API endpoints with detailed logging
  console.log('\n3️⃣ TESTING ALL API ENDPOINTS');
  
  const allActivities = [];
  const apiResults = {};
  
  // Test Tasks endpoint
  try {
    console.log('📋 Testing Tasks API...');
    const tasksUrl = `/api/tasks-daily?user_id=${encodeURIComponent(WAWAN_USER_ID)}`;
    console.log('📋 URL:', tasksUrl);
    
    const tasksResponse = await fetch(tasksUrl);
    console.log('📋 Response status:', tasksResponse.status);
    console.log('📋 Response headers:', Object.fromEntries(tasksResponse.headers.entries()));
    
    if (tasksResponse.ok) {
      const tasksData = await tasksResponse.json();
      console.log(`📋 Tasks found: ${tasksData.length}`);
      console.log('📋 Raw tasks data:', tasksData);
      
      apiResults.tasks = tasksData;
      
      // Transform tasks data
      tasksData.forEach((task, index) => {
        console.log(`📋 Processing task ${index + 1}:`, {
          id: task.id,
          title: task.title,
          date: task.date,
          created_at: task.created_at,
          user_id: task.user_id || task.userId,
          photo1: task.photo1 ? 'has photo1' : 'no photo1',
          photo2: task.photo2 ? 'has photo2' : 'no photo2'
        });
        
        allActivities.push({
          id: task.id,
          type: 'Tugas Pokok',
          title: task.title || 'Tugas Harian',
          date: task.date || task.created_at,
          location: task.location || task.school || 'Sekolah Binaan',
          organizer: 'Pengawas Sekolah',
          description: task.description || '',
          photo1: task.photo1,
          photo2: task.photo2,
          createdAt: task.created_at,
          source: 'supabase-tasks'
        });
      });
    } else {
      const errorText = await tasksResponse.text();
      console.error('📋 Tasks API error:', tasksResponse.status, errorText);
      apiResults.tasks = { error: `${tasksResponse.status}: ${errorText}` };
    }
  } catch (error) {
    console.error('📋 Tasks fetch error:', error);
    apiResults.tasks = { error: error.message };
  }
  
  // Test Supervisions endpoint
  try {
    console.log('\n🔍 Testing Supervisions API...');
    const supervisionsUrl = `/api/supervisions?user_id=${encodeURIComponent(WAWAN_USER_ID)}`;
    console.log('🔍 URL:', supervisionsUrl);
    
    const supervisionsResponse = await fetch(supervisionsUrl);
    console.log('🔍 Response status:', supervisionsResponse.status);
    console.log('🔍 Response headers:', Object.fromEntries(supervisionsResponse.headers.entries()));
    
    if (supervisionsResponse.ok) {
      const supervisionsData = await supervisionsResponse.json();
      console.log(`🔍 Supervisions found: ${supervisionsData.length}`);
      console.log('🔍 Raw supervisions data:', supervisionsData);
      
      apiResults.supervisions = supervisionsData;
      
      // Get schools data for location names
      let schoolsData = [];
      try {
        const schoolsResponse = await fetch('/api/schools');
        if (schoolsResponse.ok) {
          schoolsData = await schoolsResponse.json();
          console.log(`🏫 Schools loaded: ${schoolsData.length}`);
        }
      } catch (error) {
        console.log('🏫 Schools fetch failed:', error.message);
      }
      
      // Transform supervisions data
      supervisionsData.forEach((supervision, index) => {
        console.log(`🔍 Processing supervision ${index + 1}:`, {
          id: supervision.id,
          school_id: supervision.school_id,
          school_name: supervision.school_name,
          date: supervision.date,
          created_at: supervision.created_at,
          user_id: supervision.user_id,
          photo1: supervision.photo1 ? 'has photo1' : 'no photo1',
          photo2: supervision.photo2 ? 'has photo2' : 'no photo2'
        });
        
        // Get school name
        const school = schoolsData.find(s => s.id === supervision.school_id);
        const schoolName = supervision.school_name || school?.name || 'Sekolah Binaan';
        
        allActivities.push({
          id: supervision.id,
          type: 'Supervisi',
          title: `Supervisi ${schoolName}`,
          date: supervision.date || supervision.created_at,
          location: schoolName,
          organizer: 'Pengawas Sekolah',
          description: supervision.findings || supervision.recommendations || supervision.notes || '',
          photo1: supervision.photo1,
          photo2: supervision.photo2,
          createdAt: supervision.created_at,
          source: 'supabase-supervisions'
        });
      });
    } else {
      const errorText = await supervisionsResponse.text();
      console.error('🔍 Supervisions API error:', supervisionsResponse.status, errorText);
      apiResults.supervisions = { error: `${supervisionsResponse.status}: ${errorText}` };
    }
  } catch (error) {
    console.error('🔍 Supervisions fetch error:', error);
    apiResults.supervisions = { error: error.message };
  }
  
  // Test Activities endpoint
  try {
    console.log('\n➕ Testing Activities API...');
    const activitiesUrl = `/api/activities?user_id=${encodeURIComponent(WAWAN_USER_ID)}`;
    console.log('➕ URL:', activitiesUrl);
    
    const activitiesResponse = await fetch(activitiesUrl);
    console.log('➕ Response status:', activitiesResponse.status);
    console.log('➕ Response headers:', Object.fromEntries(activitiesResponse.headers.entries()));
    
    if (activitiesResponse.ok) {
      const activitiesData = await activitiesResponse.json();
      console.log(`➕ Activities found: ${activitiesData.length}`);
      console.log('➕ Raw activities data:', activitiesData);
      
      apiResults.activities = activitiesData;
      
      // Transform activities data
      activitiesData.forEach((activity, index) => {
        console.log(`➕ Processing activity ${index + 1}:`, {
          id: activity.id,
          title: activity.title,
          name: activity.name,
          date: activity.date,
          created_at: activity.created_at,
          user_id: activity.user_id || activity.userId,
          photo1: activity.photo1 ? 'has photo1' : 'no photo1',
          photo2: activity.photo2 ? 'has photo2' : 'no photo2'
        });
        
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
          source: 'supabase-activities'
        });
      });
    } else {
      const errorText = await activitiesResponse.text();
      console.error('➕ Activities API error:', activitiesResponse.status, errorText);
      apiResults.activities = { error: `${activitiesResponse.status}: ${errorText}` };
    }
  } catch (error) {
    console.error('➕ Activities fetch error:', error);
    apiResults.activities = { error: error.message };
  }
  
  // 4. Sort all activities by date
  console.log('\n4️⃣ SORTING AND PROCESSING DATA');
  const sortedActivities = allActivities.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  
  console.log(`📊 TOTAL ACTIVITIES LOADED: ${sortedActivities.length}`);
  
  // Group by type for detailed logging
  const byType = {
    'Tugas Pokok': sortedActivities.filter(a => a.type === 'Tugas Pokok'),
    'Supervisi': sortedActivities.filter(a => a.type === 'Supervisi'),
    'Tugas Tambahan': sortedActivities.filter(a => a.type === 'Tugas Tambahan')
  };
  
  Object.entries(byType).forEach(([type, activities]) => {
    console.log(`\n📋 ${type}: ${activities.length} items`);
    activities.forEach((activity, index) => {
      console.log(`   ${index + 1}. ${activity.title} (${activity.date}) - Source: ${activity.source}`);
    });
  });
  
  // 5. Update React state and UI
  console.log('\n5️⃣ UPDATING REACT STATE AND UI');
  
  // Cache for React
  localStorage.setItem('reports_activities_cache', JSON.stringify(sortedActivities));
  console.log('✅ Data cached for React');
  
  // Dispatch events for React
  window.dispatchEvent(new CustomEvent('updateReportsData', { 
    detail: { activities: sortedActivities } 
  }));
  console.log('✅ React event dispatched');
  
  // Force React re-render by triggering storage event
  window.dispatchEvent(new StorageEvent('storage', {
    key: 'reports_activities_cache',
    newValue: JSON.stringify(sortedActivities),
    url: window.location.href
  }));
  console.log('✅ Storage event dispatched');
  
  // 6. Update current page UI immediately
  console.log('\n6️⃣ UPDATING CURRENT PAGE UI');
  updateCurrentPageUI(sortedActivities);
  
  // 7. Show comprehensive results
  console.log('\n7️⃣ SHOWING RESULTS');
  showComprehensiveResults(sortedActivities, apiResults);
  
  console.log('\n✅ FORCE LOAD COMPLETED!');
  console.log('🔄 Refresh halaman untuk melihat semua data di React components');
  
  return {
    success: true,
    totalActivities: sortedActivities.length,
    byType: {
      tugasPokok: byType['Tugas Pokok'].length,
      supervisi: byType['Supervisi'].length,
      tugasTambahan: byType['Tugas Tambahan'].length
    },
    withPhotos: sortedActivities.filter(a => a.photo1 || a.photo2).length,
    apiResults: apiResults,
    activities: sortedActivities
  };
}

function updateCurrentPageUI(activities) {
  console.log('🎨 Updating current page UI...');
  
  // Update statistics
  const tugasPokok = activities.filter(a => a.type === 'Tugas Pokok').length;
  const supervisi = activities.filter(a => a.type === 'Supervisi').length;
  const tugasTambahan = activities.filter(a => a.type === 'Tugas Tambahan').length;
  
  // Find and update statistic elements
  const statElements = document.querySelectorAll('[class*="text-2xl"], [class*="font-bold"]');
  
  statElements.forEach(el => {
    const parent = el.parentElement;
    const grandParent = parent?.parentElement;
    const text = (parent?.textContent || '') + (grandParent?.textContent || '');
    
    if (text.includes('Tugas Pokok')) {
      el.textContent = tugasPokok.toString();
      console.log('✅ Updated Tugas Pokok stat:', tugasPokok);
    } else if (text.includes('Supervisi')) {
      el.textContent = supervisi.toString();
      console.log('✅ Updated Supervisi stat:', supervisi);
    } else if (text.includes('Tugas Tambahan')) {
      el.textContent = tugasTambahan.toString();
      console.log('✅ Updated Tugas Tambahan stat:', tugasTambahan);
    }
  });
  
  // Find empty state messages and replace them
  const emptyElements = document.querySelectorAll('h3, p, div');
  
  emptyElements.forEach(el => {
    const text = el.textContent || '';
    if (text.includes('Belum ada aktivitas') || text.includes('tidak ada aktivitas')) {
      console.log('🎯 Found empty state, replacing with data preview...');
      
      const container = el.closest('[class*="space-y"], main, .container') || el.parentElement;
      if (container) {
        const previewDiv = document.createElement('div');
        previewDiv.innerHTML = generateDataPreview(activities);
        container.appendChild(previewDiv);
        console.log('✅ Data preview added to UI');
      }
    }
  });
}

function generateDataPreview(activities) {
  const tugasPokok = activities.filter(a => a.type === 'Tugas Pokok').length;
  const supervisi = activities.filter(a => a.type === 'Supervisi').length;
  const tugasTambahan = activities.filter(a => a.type === 'Tugas Tambahan').length;
  const withPhotos = activities.filter(a => a.photo1 || a.photo2).length;
  
  return `
    <div style="padding: 2rem; background: linear-gradient(135deg, #10b981, #059669); color: white; border-radius: 12px; margin: 1rem 0; box-shadow: 0 4px 12px rgba(16, 185, 129, 0.3);">
      <div style="text-align: center; margin-bottom: 2rem;">
        <h2 style="font-size: 1.75rem; font-weight: bold; margin-bottom: 0.5rem;">
          ✅ Semua Data Supabase Berhasil Dimuat!
        </h2>
        <p style="font-size: 1rem; opacity: 0.9;">
          ${activities.length} aktivitas ditemukan dari database Supabase
        </p>
      </div>
      
      <div style="background: rgba(255,255,255,0.1); border-radius: 8px; padding: 1rem; margin-bottom: 2rem;">
        <h3 style="font-size: 1.25rem; font-weight: 600; margin-bottom: 1rem; text-align: center;">📊 Detail Lengkap</h3>
        <div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 1rem; text-align: center;">
          <div>
            <div style="font-size: 2rem; font-weight: bold;">${tugasPokok}</div>
            <div style="font-size: 0.875rem; opacity: 0.9;">Tugas Pokok</div>
          </div>
          <div>
            <div style="font-size: 2rem; font-weight: bold;">${supervisi}</div>
            <div style="font-size: 0.875rem; opacity: 0.9;">Supervisi</div>
          </div>
          <div>
            <div style="font-size: 2rem; font-weight: bold;">${tugasTambahan}</div>
            <div style="font-size: 0.875rem; opacity: 0.9;">Tugas Tambahan</div>
          </div>
          <div>
            <div style="font-size: 2rem; font-weight: bold;">${withPhotos}</div>
            <div style="font-size: 0.875rem; opacity: 0.9;">Dengan Foto</div>
          </div>
        </div>
      </div>
      
      <div style="background: rgba(255,255,255,0.1); border-radius: 8px; padding: 1rem; margin-bottom: 2rem;">
        <h4 style="font-weight: 600; margin-bottom: 0.5rem;">📋 Aktivitas Terbaru:</h4>
        <div style="font-size: 0.9rem; line-height: 1.4;">
          ${activities.slice(0, 5).map(activity => `
            • ${activity.title} (${activity.type}) - ${formatDate(activity.date)}
          `).join('<br>')}
          ${activities.length > 5 ? `<br>... dan ${activities.length - 5} aktivitas lainnya` : ''}
        </div>
      </div>
      
      <div style="text-align: center;">
        <button onclick="location.reload()" style="background: white; color: #10b981; padding: 0.75rem 2rem; border: none; border-radius: 8px; cursor: pointer; font-weight: 600; font-size: 1rem; box-shadow: 0 2px 4px rgba(0,0,0,0.1); margin-right: 1rem;">
          🔄 Refresh untuk Tampilan React Lengkap
        </button>
        <button onclick="window.print()" style="background: rgba(255,255,255,0.2); color: white; padding: 0.75rem 2rem; border: 1px solid rgba(255,255,255,0.3); border-radius: 8px; cursor: pointer; font-weight: 600; font-size: 1rem;">
          📄 Print Laporan
        </button>
      </div>
    </div>
  `;
}

function showComprehensiveResults(activities, apiResults) {
  // Create comprehensive results notification
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
    max-width: 450px;
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
      ✅ Semua Data Supabase Dimuat!
    </div>
    
    <div style="background: rgba(255,255,255,0.1); border-radius: 8px; padding: 1rem; margin-bottom: 1rem;">
      <div style="font-weight: 600; margin-bottom: 0.5rem;">📊 Total Data:</div>
      <div style="font-size: 0.9rem; line-height: 1.4;">
        📋 ${tugasPokok} Tugas Pokok<br>
        🔍 ${supervisi} Supervisi<br>
        ➕ ${tugasTambahan} Tugas Tambahan<br>
        📸 ${withPhotos} dengan foto<br>
        <strong>Total: ${activities.length} aktivitas</strong>
      </div>
    </div>
    
    <div style="background: rgba(255,255,255,0.1); border-radius: 8px; padding: 1rem; margin-bottom: 1rem;">
      <div style="font-weight: 600; margin-bottom: 0.5rem;">🔗 API Status:</div>
      <div style="font-size: 0.8rem; line-height: 1.3;">
        📋 Tasks: ${apiResults.tasks?.error ? '❌ Error' : `✅ ${apiResults.tasks?.length || 0} items`}<br>
        🔍 Supervisions: ${apiResults.supervisions?.error ? '❌ Error' : `✅ ${apiResults.supervisions?.length || 0} items`}<br>
        ➕ Activities: ${apiResults.activities?.error ? '❌ Error' : `✅ ${apiResults.activities?.length || 0} items`}
      </div>
    </div>
    
    <div style="background: rgba(255,255,255,0.1); border-radius: 8px; padding: 1rem; margin-bottom: 1rem;">
      <div style="font-weight: 600; margin-bottom: 0.5rem;">📋 Aktivitas Terbaru:</div>
      <div style="font-size: 0.8rem; line-height: 1.3;">
        ${activities.slice(0, 3).map(activity => `
          • ${activity.title}<br>
          &nbsp;&nbsp;${activity.type} - ${formatDate(activity.date)}
        `).join('<br>')}
        ${activities.length > 3 ? `<br>... dan ${activities.length - 3} lainnya` : ''}
      </div>
    </div>
    
    <div style="display: flex; gap: 0.5rem; margin-top: 1rem;">
      <button onclick="location.reload()" style="flex: 1; background: white; color: #10b981; border: none; padding: 0.5rem; border-radius: 6px; cursor: pointer; font-size: 0.875rem; font-weight: 600;">
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
  
  // Auto remove after 25 seconds
  setTimeout(() => {
    if (notification.parentElement) {
      notification.style.animation = 'slideIn 0.5s ease-out reverse';
      setTimeout(() => notification.remove(), 500);
    }
  }, 25000);
}

function formatDate(dateStr) {
  const date = new Date(dateStr);
  return date.toLocaleDateString('id-ID', { 
    day: 'numeric', 
    month: 'short', 
    year: 'numeric' 
  });
}

// Execute the force load
forceLoadAllSupabaseData().then(result => {
  console.log('\n🎉 FORCE LOAD COMPLETED WITH RESULTS:', result);
  
  // Additional verification
  console.log('\n🔍 VERIFICATION:');
  console.log('- Cache exists:', !!localStorage.getItem('reports_activities_cache'));
  console.log('- Auth user exists:', !!localStorage.getItem('auth_user'));
  
  const cachedData = localStorage.getItem('reports_activities_cache');
  if (cachedData) {
    const parsed = JSON.parse(cachedData);
    console.log('- Cached activities count:', parsed.length);
  }
  
}).catch(error => {
  console.error('❌ Force load failed:', error);
  
  // Show error notification
  const errorNotification = document.createElement('div');
  errorNotification.style.cssText = `
    position: fixed;
    top: 20px;
    right: 20px;
    background: linear-gradient(135deg, #dc2626, #b91c1c);
    color: white;
    padding: 1.5rem;
    border-radius: 12px;
    box-shadow: 0 8px 25px rgba(220, 38, 38, 0.4);
    z-index: 9999;
    max-width: 400px;
    font-family: system-ui, -apple-system, sans-serif;
  `;
  
  errorNotification.innerHTML = `
    <div style="font-weight: bold; font-size: 1.1rem; margin-bottom: 1rem;">❌ Error Loading Data</div>
    <div style="font-size: 0.9rem; line-height: 1.4; margin-bottom: 1rem;">
      ${error.message}
    </div>
    <button onclick="this.parentElement.remove()" style="background: white; color: #dc2626; border: none; padding: 0.5rem 1rem; border-radius: 6px; cursor: pointer; font-weight: 600;">
      Close
    </button>
  `;
  
  document.body.appendChild(errorNotification);
  
  setTimeout(() => errorNotification.remove(), 10000);
});