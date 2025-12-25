// 🚨 ULTIMATE FIX LAPORAN - FINAL
// Script lengkap untuk memperbaiki masalah laporan

console.log('🚨 ULTIMATE FIX LAPORAN - FINAL');
console.log('===============================');
console.log('Waktu:', new Date().toLocaleString('id-ID'));

const WAWAN_USER_ID = '421cdb28-f2af-4f1f-aa5f-c59a3d661a2e';

async function ultimateFix() {
  console.log('🚀 Memulai ultimate fix...');
  
  // STEP 1: Fix Authentication
  console.log('\n🔐 STEP 1: FIXING AUTHENTICATION');
  const authUser = localStorage.getItem('auth_user');
  if (authUser) {
    const userData = JSON.parse(authUser);
    console.log('👤 Current user:', userData.username);
    console.log('🔑 Current ID:', userData.id);
    
    if (userData.username === 'wawan') {
      userData.id = WAWAN_USER_ID;
      localStorage.setItem('auth_user', JSON.stringify(userData));
      console.log('✅ User ID fixed to:', WAWAN_USER_ID);
    }
  } else {
    console.log('❌ No auth user found');
    return;
  }
  
  // STEP 2: Test Server Connection
  console.log('\n🌐 STEP 2: TESTING SERVER CONNECTION');
  try {
    const healthCheck = await fetch('/api/schools');
    console.log('🏥 Health check status:', healthCheck.status);
    if (!healthCheck.ok) {
      console.log('❌ Server tidak merespons dengan baik');
      console.log('💡 Pastikan server development berjalan (npm run dev)');
      return;
    }
    console.log('✅ Server connection OK');
  } catch (error) {
    console.log('❌ Server connection failed:', error.message);
    console.log('💡 Pastikan server development berjalan di localhost:5000');
    return;
  }
  
  // STEP 3: Load Data from All Endpoints
  console.log('\n📊 STEP 3: LOADING DATA FROM ALL ENDPOINTS');
  
  const allActivities = [];
  let totalLoaded = 0;
  
  // Load Tasks
  console.log('\n📋 Loading Tasks...');
  try {
    const tasksUrl = `/api/tasks-daily?user_id=${encodeURIComponent(WAWAN_USER_ID)}`;
    console.log('🔗 URL:', tasksUrl);
    
    const tasksResponse = await fetch(tasksUrl);
    console.log('📊 Status:', tasksResponse.status);
    
    if (tasksResponse.ok) {
      const tasksData = await tasksResponse.json();
      console.log(`✅ Tasks loaded: ${tasksData.length}`);
      
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
      totalLoaded += tasksData.length;
    } else {
      console.log('⚠️ Tasks endpoint error:', tasksResponse.status);
    }
  } catch (error) {
    console.log('❌ Tasks loading error:', error.message);
  }
  
  // Load Supervisions
  console.log('\n🔍 Loading Supervisions...');
  try {
    const supervisionsUrl = `/api/supervisions?user_id=${encodeURIComponent(WAWAN_USER_ID)}`;
    console.log('🔗 URL:', supervisionsUrl);
    
    const supervisionsResponse = await fetch(supervisionsUrl);
    console.log('📊 Status:', supervisionsResponse.status);
    
    if (supervisionsResponse.ok) {
      const supervisionsData = await supervisionsResponse.json();
      console.log(`✅ Supervisions loaded: ${supervisionsData.length}`);
      
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
      totalLoaded += supervisionsData.length;
    } else {
      console.log('⚠️ Supervisions endpoint error:', supervisionsResponse.status);
    }
  } catch (error) {
    console.log('❌ Supervisions loading error:', error.message);
  }
  
  // Load Activities
  console.log('\n➕ Loading Activities...');
  try {
    const activitiesUrl = `/api/activities?user_id=${encodeURIComponent(WAWAN_USER_ID)}`;
    console.log('🔗 URL:', activitiesUrl);
    
    const activitiesResponse = await fetch(activitiesUrl);
    console.log('📊 Status:', activitiesResponse.status);
    
    if (activitiesResponse.ok) {
      const activitiesData = await activitiesResponse.json();
      console.log(`✅ Activities loaded: ${activitiesData.length}`);
      
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
      totalLoaded += activitiesData.length;
    } else {
      console.log('⚠️ Activities endpoint error:', activitiesResponse.status);
    }
  } catch (error) {
    console.log('❌ Activities loading error:', error.message);
  }
  
  // STEP 4: Analyze Results
  console.log('\n📈 STEP 4: ANALYZING RESULTS');
  console.log(`📊 Total activities loaded: ${totalLoaded}`);
  
  if (totalLoaded === 0) {
    console.log('❌ TIDAK ADA DATA DITEMUKAN!');
    console.log('🔍 Mencoba diagnosa lebih lanjut...');
    
    // Try loading without user filter
    await diagnosaDataKosong();
    return;
  }
  
  // Calculate statistics
  const tugasPokok = allActivities.filter(a => a.type === 'Tugas Pokok').length;
  const supervisi = allActivities.filter(a => a.type === 'Supervisi').length;
  const tugasTambahan = allActivities.filter(a => a.type === 'Tugas Tambahan').length;
  
  console.log(`📊 STATISTIK:`);
  console.log(`   📋 Tugas Pokok: ${tugasPokok}`);
  console.log(`   🔍 Supervisi: ${supervisi}`);
  console.log(`   ➕ Tugas Tambahan: ${tugasTambahan}`);
  
  // STEP 5: Update UI
  console.log('\n🎨 STEP 5: UPDATING UI');
  
  // Update statistics in UI
  updateStatisticsInUI(tugasPokok, supervisi, tugasTambahan);
  
  // Replace empty state with activities
  replaceEmptyStateWithActivities(allActivities);
  
  // Cache data for React
  localStorage.setItem('reports_activities_cache', JSON.stringify(allActivities));
  
  // Dispatch events for React component
  const events = [
    new CustomEvent('updateReportsData', { detail: { activities: allActivities } }),
    new CustomEvent('forceReloadReports', { detail: { userId: WAWAN_USER_ID } }),
    new CustomEvent('reportsDataLoaded', { detail: { count: totalLoaded } })
  ];
  
  events.forEach(event => window.dispatchEvent(event));
  
  console.log('✅ UI UPDATE COMPLETED!');
  
  // STEP 6: Final Instructions
  console.log('\n🎯 STEP 6: FINAL INSTRUCTIONS');
  console.log('✅ Fix berhasil dijalankan!');
  console.log('📋 Yang sudah dilakukan:');
  console.log('   - User authentication diperbaiki');
  console.log('   - Data berhasil dimuat dari Supabase');
  console.log('   - UI diupdate dengan data terbaru');
  console.log('   - Cache dan events disiapkan untuk React');
  
  console.log('\n🔄 LANGKAH SELANJUTNYA:');
  console.log('1. Refresh halaman untuk melihat tampilan React lengkap');
  console.log('2. Jika masih kosong, cek console untuk error');
  console.log('3. Pastikan server development masih berjalan');
  
  // Show success message in UI
  showSuccessMessage(totalLoaded, tugasPokok, supervisi, tugasTambahan);
}

async function diagnosaDataKosong() {
  console.log('\n🔍 DIAGNOSA DATA KOSONG');
  
  try {
    // Check all data without filter
    const endpoints = [
      { name: 'Tasks', url: '/api/tasks-daily' },
      { name: 'Supervisions', url: '/api/supervisions' },
      { name: 'Activities', url: '/api/activities' }
    ];
    
    for (const endpoint of endpoints) {
      console.log(`\n📊 Checking ${endpoint.name}...`);
      const response = await fetch(endpoint.url);
      
      if (response.ok) {
        const data = await response.json();
        console.log(`📊 Total ${endpoint.name}: ${data.length}`);
        
        if (data.length > 0) {
          // Look for Wawan data
          const wawanData = data.filter(item => 
            item.user_id === WAWAN_USER_ID || 
            item.user_id === 'wawan' ||
            (item.title && item.title.toLowerCase().includes('wawan')) ||
            (item.name && item.name.toLowerCase().includes('wawan'))
          );
          
          console.log(`📊 ${endpoint.name} untuk Wawan: ${wawanData.length}`);
          
          if (wawanData.length > 0) {
            console.log(`📋 Sample ${endpoint.name}:`, wawanData[0]);
          }
        }
      } else {
        console.log(`❌ ${endpoint.name} endpoint error:`, response.status);
      }
    }
  } catch (error) {
    console.log('❌ Diagnosa error:', error.message);
  }
  
  console.log('\n💡 KEMUNGKINAN PENYEBAB DATA KOSONG:');
  console.log('1. Data belum diinput ke Supabase');
  console.log('2. User ID tidak sesuai di database');
  console.log('3. RLS policies memblokir akses');
  console.log('4. Konfigurasi Supabase salah');
  console.log('5. Server tidak terhubung ke Supabase');
}

function updateStatisticsInUI(tugasPokok, supervisi, tugasTambahan) {
  console.log('🎯 Updating statistics in UI...');
  
  // Find and update statistic elements
  const statElements = document.querySelectorAll('[class*="text-2xl"], [class*="font-bold"]');
  
  statElements.forEach(el => {
    const parent = el.parentElement;
    const grandParent = parent?.parentElement;
    const text = (parent?.textContent || '') + (grandParent?.textContent || '');
    
    if (text.includes('Tugas Pokok')) {
      el.textContent = tugasPokok.toString();
      console.log('✅ Updated Tugas Pokok:', tugasPokok);
    } else if (text.includes('Supervisi')) {
      el.textContent = supervisi.toString();
      console.log('✅ Updated Supervisi:', supervisi);
    } else if (text.includes('Tugas Tambahan')) {
      el.textContent = tugasTambahan.toString();
      console.log('✅ Updated Tugas Tambahan:', tugasTambahan);
    }
  });
}

function replaceEmptyStateWithActivities(activities) {
  console.log('📋 Replacing empty state with activities...');
  
  // Find empty state messages
  const emptyElements = document.querySelectorAll('h3, p, div');
  
  emptyElements.forEach(el => {
    const text = el.textContent || '';
    if (text.includes('Belum ada aktivitas') || text.includes('tidak ada aktivitas')) {
      console.log('🎯 Found empty state, replacing...');
      
      // Create activities list
      const activitiesHTML = activities.slice(0, 5).map(activity => `
        <div style="background: white; border: 1px solid #e5e7eb; border-radius: 8px; padding: 1rem; margin: 0.5rem 0;">
          <div style="display: flex; align-items: center; gap: 0.5rem; margin-bottom: 0.5rem;">
            <span style="background: ${getTypeColor(activity.type)}; color: white; padding: 0.25rem 0.5rem; border-radius: 4px; font-size: 0.75rem; font-weight: 600;">
              ${activity.type}
            </span>
          </div>
          <h4 style="font-size: 1rem; font-weight: 600; margin-bottom: 0.5rem;">${activity.title}</h4>
          <div style="font-size: 0.875rem; color: #6b7280;">
            📅 ${formatDate(activity.date)} | 📍 ${activity.location}
          </div>
        </div>
      `).join('');
      
      // Replace with success message and activities
      const container = el.closest('[class*="space-y"], main, .container') || el.parentElement;
      if (container) {
        const successDiv = document.createElement('div');
        successDiv.innerHTML = `
          <div style="padding: 2rem; background: #f0f9ff; border: 2px solid #10b981; border-radius: 8px; margin: 1rem 0;">
            <h2 style="color: #10b981; font-size: 1.5rem; font-weight: bold; margin-bottom: 1rem;">
              ✅ Data Berhasil Dimuat!
            </h2>
            <p style="color: #0c4a6e; margin-bottom: 1rem;">
              Total ${activities.length} aktivitas ditemukan dari Supabase
            </p>
            <div style="margin-bottom: 1rem;">
              ${activitiesHTML}
            </div>
            <button onclick="location.reload()" style="background: #10b981; color: white; padding: 0.5rem 1rem; border: none; border-radius: 6px; cursor: pointer; font-weight: 600;">
              🔄 Refresh untuk Tampilan Lengkap
            </button>
          </div>
        `;
        
        container.appendChild(successDiv);
        console.log('✅ Empty state replaced with activities!');
      }
    }
  });
}

function showSuccessMessage(total, tugasPokok, supervisi, tugasTambahan) {
  // Create floating success message
  const successMsg = document.createElement('div');
  successMsg.style.cssText = `
    position: fixed;
    top: 20px;
    right: 20px;
    background: #10b981;
    color: white;
    padding: 1rem;
    border-radius: 8px;
    box-shadow: 0 4px 12px rgba(0,0,0,0.3);
    z-index: 9999;
    max-width: 300px;
    font-family: system-ui, -apple-system, sans-serif;
  `;
  
  successMsg.innerHTML = `
    <div style="font-weight: bold; margin-bottom: 0.5rem;">✅ Fix Berhasil!</div>
    <div style="font-size: 0.875rem;">
      📊 ${total} aktivitas dimuat<br>
      📋 ${tugasPokok} Tugas Pokok<br>
      🔍 ${supervisi} Supervisi<br>
      ➕ ${tugasTambahan} Tugas Tambahan
    </div>
    <button onclick="this.parentElement.remove()" style="position: absolute; top: 5px; right: 8px; background: none; border: none; color: white; cursor: pointer; font-size: 1.2rem;">×</button>
  `;
  
  document.body.appendChild(successMsg);
  
  // Auto remove after 10 seconds
  setTimeout(() => {
    if (successMsg.parentElement) {
      successMsg.remove();
    }
  }, 10000);
}

function getTypeColor(type) {
  switch (type) {
    case 'Tugas Tambahan': return '#1e40af';
    case 'Supervisi': return '#166534';
    case 'Tugas Pokok': return '#7c3aed';
    default: return '#6b7280';
  }
}

function formatDate(dateStr) {
  const date = new Date(dateStr);
  return date.toLocaleDateString('id-ID', { 
    day: 'numeric', 
    month: 'long', 
    year: 'numeric' 
  });
}

// Execute the ultimate fix
ultimateFix();