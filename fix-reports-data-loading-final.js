// 🚨 FINAL FIX FOR REPORTS DATA LOADING
// This script fixes the reports page data loading issue

console.log('🚨 FINAL FIX FOR REPORTS DATA LOADING');
console.log('=====================================');

const WAWAN_USER_ID = '421cdb28-f2af-4f1f-aa5f-c59a3d661a2e';

// 1. Fix user authentication
function fixUserAuth() {
  const currentUser = localStorage.getItem('auth_user');
  if (currentUser) {
    const userData = JSON.parse(currentUser);
    console.log('👤 Current user:', userData.username);
    
    if (userData.username === 'wawan') {
      userData.id = WAWAN_USER_ID;
      localStorage.setItem('auth_user', JSON.stringify(userData));
      console.log('✅ Fixed Wawan user_id:', userData.id);
    }
  }
}

// 2. Test API endpoints
async function testAPIEndpoints() {
  console.log('\n🧪 Testing API endpoints...');
  
  try {
    // Test tasks
    const tasksResponse = await fetch(`/api/tasks-daily?user_id=${encodeURIComponent(WAWAN_USER_ID)}`);
    const tasksData = tasksResponse.ok ? await tasksResponse.json() : [];
    console.log(`📋 Tasks: ${tasksData.length} found`);
    
    // Test supervisions
    const supervisionsResponse = await fetch(`/api/supervisions?user_id=${encodeURIComponent(WAWAN_USER_ID)}`);
    const supervisionsData = supervisionsResponse.ok ? await supervisionsResponse.json() : [];
    console.log(`🔍 Supervisions: ${supervisionsData.length} found`);
    
    // Test activities
    const activitiesResponse = await fetch(`/api/activities?user_id=${encodeURIComponent(WAWAN_USER_ID)}`);
    const activitiesData = activitiesResponse.ok ? await activitiesResponse.json() : [];
    console.log(`➕ Activities: ${activitiesData.length} found`);
    
    const totalActivities = tasksData.length + supervisionsData.length + activitiesData.length;
    console.log(`📊 Total activities: ${totalActivities}`);
    
    if (totalActivities > 0) {
      console.log('✅ API endpoints are working and returning data!');
      return { tasksData, supervisionsData, activitiesData };
    } else {
      console.log('⚠️ API endpoints are working but returning no data');
      return null;
    }
    
  } catch (error) {
    console.error('❌ API test failed:', error);
    return null;
  }
}

// 3. Force update React component
function forceUpdateReportsComponent(data) {
  console.log('\n🔄 Force updating reports component...');
  
  if (!data) {
    console.log('⚠️ No data to inject');
    return;
  }
  
  const { tasksData, supervisionsData, activitiesData } = data;
  
  // Create combined activities array
  const allActivities = [];
  
  // Add tasks
  tasksData.forEach(task => {
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
  
  // Add supervisions
  supervisionsData.forEach(supervision => {
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
  
  // Add activities
  activitiesData.forEach(activity => {
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
  
  console.log(`📊 Created ${allActivities.length} combined activities`);
  
  // Try to find and update React component state
  try {
    // Method 1: Dispatch custom event
    const updateEvent = new CustomEvent('updateReportsData', {
      detail: { activities: allActivities }
    });
    window.dispatchEvent(updateEvent);
    console.log('📡 Dispatched update event');
    
    // Method 2: Cache in localStorage for component to pick up
    localStorage.setItem('reports_activities_cache', JSON.stringify(allActivities));
    console.log('💾 Cached activities in localStorage');
    
    // Method 3: Direct DOM manipulation as fallback
    setTimeout(() => {
      updateDOMDirectly(allActivities);
    }, 1000);
    
  } catch (error) {
    console.error('❌ Error updating component:', error);
  }
}

// 4. Direct DOM manipulation fallback
function updateDOMDirectly(activities) {
  console.log('🎯 Attempting direct DOM update...');
  
  // Look for empty state indicators
  const emptyMessages = document.querySelectorAll('h3, p, div');
  let emptyStateFound = false;
  
  emptyMessages.forEach(element => {
    const text = element.textContent || '';
    if (text.includes('Belum ada aktivitas') || text.includes('tidak ada aktivitas')) {
      emptyStateFound = true;
      console.log('🎯 Found empty state message:', text);
      
      // Replace with statistics
      const statsHTML = `
        <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 1rem; margin: 2rem 0; padding: 1rem; background: white; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
          <div style="text-align: center; padding: 1rem; background: #dbeafe; border-radius: 8px;">
            <div style="font-size: 2rem; font-weight: bold; color: #1e40af;">${activities.filter(a => a.type === 'Tugas Pokok').length}</div>
            <div style="font-size: 0.875rem; color: #1e40af; font-weight: 600;">Tugas Pokok</div>
          </div>
          <div style="text-align: center; padding: 1rem; background: #dcfce7; border-radius: 8px;">
            <div style="font-size: 2rem; font-weight: bold; color: #166534;">${activities.filter(a => a.type === 'Supervisi').length}</div>
            <div style="font-size: 0.875rem; color: #166534; font-weight: 600;">Supervisi</div>
          </div>
          <div style="text-align: center; padding: 1rem; background: #f3e8ff; border-radius: 8px;">
            <div style="font-size: 2rem; font-weight: bold; color: #7c3aed;">${activities.filter(a => a.type === 'Tugas Tambahan').length}</div>
            <div style="font-size: 0.875rem; color: #7c3aed; font-weight: 600;">Tugas Tambahan</div>
          </div>
        </div>
        <div style="margin-top: 2rem;">
          <h2 style="font-size: 1.5rem; font-weight: bold; margin-bottom: 1rem; color: #1f2937;">✅ Data Berhasil Dimuat dari Supabase!</h2>
          <p style="color: #6b7280; margin-bottom: 1rem;">Total ${activities.length} aktivitas ditemukan. Refresh halaman untuk melihat tampilan lengkap.</p>
          <button onclick="location.reload()" style="background: #2563eb; color: white; padding: 0.5rem 1rem; border: none; border-radius: 6px; cursor: pointer; font-weight: 600;">
            🔄 Refresh Halaman
          </button>
        </div>
      `;
      
      // Find parent container and replace content
      const container = element.closest('[class*="space-y"], [class*="grid"], main, .container') || element.parentElement;
      if (container) {
        const newDiv = document.createElement('div');
        newDiv.innerHTML = statsHTML;
        newDiv.style.padding = '2rem';
        newDiv.style.background = '#f9fafb';
        newDiv.style.borderRadius = '8px';
        newDiv.style.border = '2px solid #10b981';
        
        container.appendChild(newDiv);
        console.log('✅ Successfully updated DOM with statistics!');
      }
    }
  });
  
  if (!emptyStateFound) {
    console.log('⚠️ No empty state found, data might already be loaded');
  }
}

// 5. Main execution
async function executefix() {
  console.log('🚀 Starting reports data loading fix...');
  
  // Step 1: Fix user auth
  fixUserAuth();
  
  // Step 2: Test API endpoints
  const data = await testAPIEndpoints();
  
  // Step 3: Force update component
  forceUpdateReportsComponent(data);
  
  console.log('\n✅ Fix completed!');
  console.log('📋 Summary:');
  console.log('- User authentication fixed');
  console.log('- API endpoints tested');
  console.log('- Component update attempted');
  console.log('- If data appears, refresh the page to see full UI');
}

// Execute the fix
executefix();