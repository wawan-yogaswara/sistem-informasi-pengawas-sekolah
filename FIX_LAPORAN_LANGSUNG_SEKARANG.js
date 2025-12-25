// 🚨 FIX LAPORAN LANGSUNG - SEKARANG
// Script untuk memperbaiki masalah laporan secara langsung

console.log('🚨 FIX LAPORAN LANGSUNG - SEKARANG');
console.log('==================================');

const WAWAN_USER_ID = '421cdb28-f2af-4f1f-aa5f-c59a3d661a2e';

async function fixLaporanLangsung() {
  console.log('🔧 Memulai perbaikan langsung...');
  
  // 1. Fix user authentication
  console.log('\n1️⃣ MEMPERBAIKI USER AUTHENTICATION');
  const authUser = localStorage.getItem('auth_user');
  if (authUser) {
    const userData = JSON.parse(authUser);
    userData.id = WAWAN_USER_ID;
    localStorage.setItem('auth_user', JSON.stringify(userData));
    console.log('✅ User ID diperbaiki:', WAWAN_USER_ID);
  }
  
  // 2. Load data langsung dari API
  console.log('\n2️⃣ LOADING DATA LANGSUNG DARI API');
  
  const allActivities = [];
  
  try {
    // Load tasks
    console.log('📋 Loading tasks...');
    const tasksResponse = await fetch(`/api/tasks-daily?user_id=${encodeURIComponent(WAWAN_USER_ID)}`);
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
    }
    
    // Load supervisions
    console.log('🔍 Loading supervisions...');
    const supervisionsResponse = await fetch(`/api/supervisions?user_id=${encodeURIComponent(WAWAN_USER_ID)}`);
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
    }
    
    // Load activities
    console.log('➕ Loading activities...');
    const activitiesResponse = await fetch(`/api/activities?user_id=${encodeURIComponent(WAWAN_USER_ID)}`);
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
    }
    
    console.log(`📊 Total activities loaded: ${allActivities.length}`);
    
    // 3. Update UI langsung
    console.log('\n3️⃣ UPDATE UI LANGSUNG');
    
    if (allActivities.length > 0) {
      // Hitung statistik
      const tugasPokok = allActivities.filter(a => a.type === 'Tugas Pokok').length;
      const supervisi = allActivities.filter(a => a.type === 'Supervisi').length;
      const tugasTambahan = allActivities.filter(a => a.type === 'Tugas Tambahan').length;
      
      console.log(`📊 Statistik: ${tugasPokok} Tugas Pokok, ${supervisi} Supervisi, ${tugasTambahan} Tugas Tambahan`);
      
      // Update statistik di UI
      updateStatistikUI(tugasPokok, supervisi, tugasTambahan);
      
      // Update daftar aktivitas
      updateDaftarAktivitas(allActivities);
      
      // Cache data untuk React component
      localStorage.setItem('reports_activities_cache', JSON.stringify(allActivities));
      
      // Dispatch event untuk React component
      const updateEvent = new CustomEvent('updateReportsData', {
        detail: { activities: allActivities }
      });
      window.dispatchEvent(updateEvent);
      
      console.log('✅ UI berhasil diupdate!');
      
    } else {
      console.log('⚠️ Tidak ada data ditemukan');
      
      // Coba load data tanpa user_id filter
      console.log('\n🔄 Mencoba load data tanpa filter...');
      await loadDataTanpaFilter();
    }
    
  } catch (error) {
    console.error('❌ Error loading data:', error);
  }
}

function updateStatistikUI(tugasPokok, supervisi, tugasTambahan) {
  console.log('🎯 Updating statistik UI...');
  
  // Cari elemen statistik
  const statsElements = document.querySelectorAll('[class*="text-2xl"], [class*="font-bold"]');
  
  statsElements.forEach(el => {
    const parent = el.parentElement;
    if (parent && parent.textContent.includes('Tugas Tambahan')) {
      el.textContent = tugasTambahan.toString();
      console.log('✅ Updated Tugas Tambahan:', tugasTambahan);
    } else if (parent && parent.textContent.includes('Supervisi')) {
      el.textContent = supervisi.toString();
      console.log('✅ Updated Supervisi:', supervisi);
    } else if (parent && parent.textContent.includes('Tugas Pokok')) {
      el.textContent = tugasPokok.toString();
      console.log('✅ Updated Tugas Pokok:', tugasPokok);
    }
  });
}

function updateDaftarAktivitas(activities) {
  console.log('📋 Updating daftar aktivitas...');
  
  // Cari container untuk daftar aktivitas
  const containers = document.querySelectorAll('[class*="space-y"], main, [class*="container"]');
  
  containers.forEach(container => {
    const emptyMessage = container.querySelector('h3');
    if (emptyMessage && emptyMessage.textContent.includes('Belum ada aktivitas')) {
      console.log('🎯 Found empty message, replacing...');
      
      // Buat HTML untuk daftar aktivitas
      const activitiesHTML = activities.map(activity => `
        <div style="background: white; border: 1px solid #e5e7eb; border-radius: 8px; padding: 1rem; margin: 1rem 0;">
          <div style="display: flex; align-items: center; gap: 0.5rem; margin-bottom: 0.5rem;">
            <span style="background: ${getTypeColor(activity.type)}; color: white; padding: 0.25rem 0.5rem; border-radius: 4px; font-size: 0.75rem; font-weight: 600;">
              ${activity.type}
            </span>
          </div>
          <h3 style="font-size: 1.125rem; font-weight: 600; margin-bottom: 0.75rem;">${activity.title}</h3>
          <div style="display: flex; flex-wrap: wrap; gap: 1rem; font-size: 0.875rem; color: #6b7280;">
            <div>📅 ${formatDate(activity.date)}</div>
            <div>📍 ${activity.location}</div>
            <div>👥 ${activity.organizer}</div>
            ${activity.photo1 || activity.photo2 ? '<div>📸 ' + [activity.photo1, activity.photo2].filter(Boolean).length + ' foto</div>' : ''}
          </div>
          ${activity.description ? `<p style="margin-top: 0.75rem; font-size: 0.875rem; color: #6b7280;">${activity.description}</p>` : ''}
        </div>
      `).join('');
      
      // Replace empty message dengan daftar aktivitas
      const newDiv = document.createElement('div');
      newDiv.innerHTML = `
        <div style="margin: 2rem 0;">
          <h2 style="font-size: 1.5rem; font-weight: bold; margin-bottom: 1rem; color: #10b981;">✅ Data Berhasil Dimuat!</h2>
          <p style="color: #6b7280; margin-bottom: 2rem;">Total ${activities.length} aktivitas ditemukan dari Supabase</p>
          ${activitiesHTML}
          <div style="margin-top: 2rem; padding: 1rem; background: #f0f9ff; border: 2px solid #0ea5e9; border-radius: 8px;">
            <p style="color: #0c4a6e; font-weight: 600;">🔄 Refresh halaman untuk melihat tampilan React yang lengkap</p>
          </div>
        </div>
      `;
      
      container.appendChild(newDiv);
      console.log('✅ Daftar aktivitas berhasil ditambahkan!');
    }
  });
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

async function loadDataTanpaFilter() {
  console.log('🔄 Loading data tanpa user filter...');
  
  try {
    // Test tanpa filter
    const tasksResponse = await fetch('/api/tasks-daily');
    if (tasksResponse.ok) {
      const allTasks = await tasksResponse.json();
      console.log(`📋 Total tasks di database: ${allTasks.length}`);
      
      // Cari tasks untuk user wawan
      const wawanTasks = allTasks.filter(task => 
        task.user_id === WAWAN_USER_ID || 
        task.user_id === 'wawan' ||
        (task.title && task.title.toLowerCase().includes('wawan'))
      );
      console.log(`📋 Tasks untuk Wawan: ${wawanTasks.length}`);
      
      if (wawanTasks.length > 0) {
        console.log('📋 Sample Wawan task:', wawanTasks[0]);
      }
    }
    
    const supervisionsResponse = await fetch('/api/supervisions');
    if (supervisionsResponse.ok) {
      const allSupervisions = await supervisionsResponse.json();
      console.log(`🔍 Total supervisions di database: ${allSupervisions.length}`);
      
      const wawanSupervisions = allSupervisions.filter(supervision => 
        supervision.user_id === WAWAN_USER_ID || 
        supervision.user_id === 'wawan'
      );
      console.log(`🔍 Supervisions untuk Wawan: ${wawanSupervisions.length}`);
      
      if (wawanSupervisions.length > 0) {
        console.log('🔍 Sample Wawan supervision:', wawanSupervisions[0]);
      }
    }
    
  } catch (error) {
    console.error('❌ Error loading data tanpa filter:', error);
  }
}

// Jalankan fix
fixLaporanLangsung();