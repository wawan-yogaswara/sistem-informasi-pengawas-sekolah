// 🔍 DIAGNOSA LANGSUNG TUGAS TAMBAHAN
// Script sederhana untuk menemukan masalah sebenarnya

console.log('🔍 DIAGNOSA LANGSUNG TUGAS TAMBAHAN');
console.log('==================================');

const WAWAN_USER_ID = '421cdb28-f2af-4f1f-aa5f-c59a3d661a2e';

async function diagnosaTugasTambahan() {
  console.log('🔍 Memulai diagnosa...');
  
  // 1. CEK USER AUTHENTICATION
  console.log('\n1️⃣ CEK USER AUTHENTICATION');
  const authUser = localStorage.getItem('auth_user');
  if (authUser) {
    const userData = JSON.parse(authUser);
    console.log('✅ User data ditemukan:', userData);
    console.log('👤 User ID:', userData.id);
    console.log('👤 Username:', userData.username);
    
    if (userData.id !== WAWAN_USER_ID) {
      console.log('⚠️ User ID tidak sesuai, akan diperbaiki...');
      userData.id = WAWAN_USER_ID;
      localStorage.setItem('auth_user', JSON.stringify(userData));
      console.log('✅ User ID diperbaiki');
    }
  } else {
    console.log('❌ User data tidak ditemukan');
    const userData = {
      id: WAWAN_USER_ID,
      username: 'wawan',
      fullName: 'H. Wawan Yogaswara, S.Pd, M.Pd',
      role: 'admin'
    };
    localStorage.setItem('auth_user', JSON.stringify(userData));
    console.log('✅ User data dibuat');
  }
  
  // 2. CEK API ENDPOINT
  console.log('\n2️⃣ CEK API ENDPOINT');
  try {
    const apiUrl = `/api/activities?user_id=${WAWAN_USER_ID}`;
    console.log('📡 Testing API:', apiUrl);
    
    const response = await fetch(apiUrl);
    console.log('📊 Response status:', response.status);
    console.log('📊 Response headers:', Object.fromEntries(response.headers.entries()));
    
    if (response.ok) {
      const data = await response.json();
      console.log('✅ API berhasil, data:', data);
      console.log('📋 Jumlah data:', data.length);
      
      if (data.length > 0) {
        console.log('📋 Sample data:', data[0]);
        console.log('📋 Data dengan foto:', data.filter(item => item.photo || item.photo1 || item.photo2).length);
      } else {
        console.log('⚠️ API mengembalikan array kosong');
      }
      
      return { apiSuccess: true, data: data };
    } else {
      const errorText = await response.text();
      console.error('❌ API error:', response.status, errorText);
      return { apiSuccess: false, error: `${response.status}: ${errorText}` };
    }
  } catch (error) {
    console.error('❌ API fetch error:', error);
    return { apiSuccess: false, error: error.message };
  }
}

// 3. CEK SUPABASE LANGSUNG
async function cekSupabaseLangsung() {
  console.log('\n3️⃣ CEK SUPABASE LANGSUNG');
  
  if (window.supabase) {
    try {
      console.log('✅ Supabase client ditemukan');
      
      // Test query langsung ke additional_tasks
      const { data, error } = await window.supabase
        .from('additional_tasks')
        .select('*')
        .eq('user_id', WAWAN_USER_ID)
        .order('created_at', { ascending: false });
      
      if (error) {
        console.error('❌ Supabase query error:', error);
        return { supabaseSuccess: false, error: error.message };
      } else {
        console.log('✅ Supabase query berhasil');
        console.log('📋 Data dari Supabase:', data);
        console.log('📋 Jumlah data:', data?.length || 0);
        return { supabaseSuccess: true, data: data };
      }
    } catch (error) {
      console.error('❌ Supabase error:', error);
      return { supabaseSuccess: false, error: error.message };
    }
  } else {
    console.log('❌ Supabase client tidak ditemukan');
    return { supabaseSuccess: false, error: 'Supabase client not found' };
  }
}

// 4. CEK DOM ELEMENTS
function cekDOMElements() {
  console.log('\n4️⃣ CEK DOM ELEMENTS');
  
  // Cek apakah di halaman yang benar
  const currentPath = window.location.pathname;
  console.log('📍 Current path:', currentPath);
  
  if (!currentPath.includes('additional') && !currentPath.includes('tugas-tambahan')) {
    console.log('⚠️ Tidak di halaman tugas tambahan');
    return { onCorrectPage: false };
  }
  
  // Cek loading state
  const loadingElements = document.querySelectorAll('[data-testid="loading"], .loading, .spinner');
  console.log('⏳ Loading elements:', loadingElements.length);
  
  // Cek task containers
  const taskContainers = document.querySelectorAll('.grid.gap-6, [data-testid="tasks-grid"]');
  console.log('📦 Task containers:', taskContainers.length);
  
  // Cek task cards
  const taskCards = document.querySelectorAll('.hover\\:shadow-md, [data-testid="task-card"]');
  console.log('📋 Task cards:', taskCards.length);
  
  // Cek empty state
  const emptyState = document.querySelectorAll('[data-testid="empty-state"], .text-center');
  console.log('🔍 Empty state elements:', emptyState.length);
  
  // Cek error messages
  const errorElements = document.querySelectorAll('.error, .text-destructive, [role="alert"]');
  console.log('❌ Error elements:', errorElements.length);
  
  return {
    onCorrectPage: true,
    loadingElements: loadingElements.length,
    taskContainers: taskContainers.length,
    taskCards: taskCards.length,
    emptyState: emptyState.length,
    errorElements: errorElements.length
  };
}

// 5. CEK REACT QUERY
function cekReactQuery() {
  console.log('\n5️⃣ CEK REACT QUERY');
  
  if (window.queryClient) {
    console.log('✅ React Query client ditemukan');
    
    // Cek cache
    const cache = window.queryClient.getQueryCache();
    console.log('📦 Query cache:', cache);
    
    // Cek specific query
    const additionalTasksQuery = window.queryClient.getQueryData(['additional-tasks']);
    console.log('📋 Additional tasks query data:', additionalTasksQuery);
    
    return { reactQueryAvailable: true, cacheData: additionalTasksQuery };
  } else {
    console.log('❌ React Query client tidak ditemukan');
    return { reactQueryAvailable: false };
  }
}

// JALANKAN SEMUA DIAGNOSA
async function jalankanSemuaDiagnosa() {
  console.log('🚀 MEMULAI DIAGNOSA LENGKAP...');
  
  const results = {};
  
  // 1. Diagnosa API
  const apiResult = await diagnosaTugasTambahan();
  results.api = apiResult;
  
  // 2. Diagnosa Supabase
  const supabaseResult = await cekSupabaseLangsung();
  results.supabase = supabaseResult;
  
  // 3. Diagnosa DOM
  const domResult = cekDOMElements();
  results.dom = domResult;
  
  // 4. Diagnosa React Query
  const reactQueryResult = cekReactQuery();
  results.reactQuery = reactQueryResult;
  
  // ANALISIS HASIL
  console.log('\n🎯 ANALISIS HASIL');
  console.log('================');
  
  if (results.api.apiSuccess && results.api.data.length > 0) {
    console.log('✅ API: Data tersedia (' + results.api.data.length + ' items)');
  } else {
    console.log('❌ API: Tidak ada data atau error');
  }
  
  if (results.supabase.supabaseSuccess && results.supabase.data.length > 0) {
    console.log('✅ Supabase: Data tersedia (' + results.supabase.data.length + ' items)');
  } else {
    console.log('❌ Supabase: Tidak ada data atau error');
  }
  
  if (results.dom.onCorrectPage && results.dom.taskCards > 0) {
    console.log('✅ DOM: Task cards tampil (' + results.dom.taskCards + ' cards)');
  } else if (results.dom.onCorrectPage) {
    console.log('❌ DOM: Tidak ada task cards yang tampil');
  } else {
    console.log('⚠️ DOM: Tidak di halaman yang benar');
  }
  
  // KESIMPULAN
  console.log('\n🎯 KESIMPULAN');
  console.log('=============');
  
  if (results.api.apiSuccess && results.api.data.length > 0) {
    if (results.dom.onCorrectPage && results.dom.taskCards === 0) {
      console.log('🔍 MASALAH DITEMUKAN: Data ada di API tapi tidak tampil di UI');
      console.log('💡 Kemungkinan penyebab:');
      console.log('   - React Query cache tidak ter-update');
      console.log('   - Component tidak re-render setelah data berubah');
      console.log('   - Ada error di rendering component');
      
      // Coba force refresh
      console.log('🔧 Mencoba force refresh...');
      if (window.queryClient) {
        window.queryClient.invalidateQueries({ queryKey: ['additional-tasks'] });
        console.log('✅ React Query cache di-invalidate');
      }
      
      // Dispatch events
      window.dispatchEvent(new CustomEvent('additional-tasks-refresh', {
        detail: { data: results.api.data }
      }));
      console.log('✅ Refresh event dikirim');
      
    } else if (results.dom.taskCards > 0) {
      console.log('✅ TIDAK ADA MASALAH: Data tampil dengan benar');
    } else {
      console.log('⚠️ Tidak di halaman tugas tambahan');
    }
  } else {
    console.log('❌ MASALAH UTAMA: Tidak ada data di API/Supabase');
    console.log('💡 Solusi: Tambahkan data terlebih dahulu');
  }
  
  return results;
}

// JALANKAN DIAGNOSA
jalankanSemuaDiagnosa().then(results => {
  console.log('\n📊 HASIL LENGKAP:', results);
  
  // Show notification
  const notification = document.createElement('div');
  notification.style.cssText = `
    position: fixed;
    top: 20px;
    right: 20px;
    background: linear-gradient(135deg, #1e40af, #1d4ed8);
    color: white;
    padding: 1.5rem;
    border-radius: 12px;
    box-shadow: 0 8px 25px rgba(30, 64, 175, 0.4);
    z-index: 9999;
    max-width: 400px;
    font-family: system-ui, -apple-system, sans-serif;
    max-height: 400px;
    overflow-y: auto;
  `;
  
  const apiData = results.api?.data?.length || 0;
  const supabaseData = results.supabase?.data?.length || 0;
  const domCards = results.dom?.taskCards || 0;
  
  let status, message, action;
  
  if (apiData > 0 && domCards === 0 && results.dom?.onCorrectPage) {
    status = '🔍 Masalah Ditemukan';
    message = `Data ada di API (${apiData} items) tapi tidak tampil di UI (${domCards} cards)`;
    action = '<button onclick="window.location.reload()" style="background: white; color: #1e40af; border: none; padding: 0.5rem 1rem; border-radius: 6px; cursor: pointer; margin-top: 1rem;">Reload Halaman</button>';
  } else if (apiData > 0 && domCards > 0) {
    status = '✅ Tidak Ada Masalah';
    message = `Data tampil dengan benar (${apiData} di API, ${domCards} di UI)`;
    action = '';
  } else if (apiData === 0) {
    status = '⚠️ Tidak Ada Data';
    message = 'Tidak ada data di API/Supabase. Silakan tambahkan data terlebih dahulu.';
    action = '<button onclick="window.location.href=\'/additional-tasks\'" style="background: white; color: #1e40af; border: none; padding: 0.5rem 1rem; border-radius: 6px; cursor: pointer; margin-top: 1rem;">Tambah Data</button>';
  } else {
    status = '⚠️ Tidak di Halaman yang Benar';
    message = 'Navigasi ke halaman Tugas Tambahan untuk melihat data';
    action = '<button onclick="window.location.href=\'/additional-tasks\'" style="background: white; color: #1e40af; border: none; padding: 0.5rem 1rem; border-radius: 6px; cursor: pointer; margin-top: 1rem;">Ke Tugas Tambahan</button>';
  }
  
  notification.innerHTML = `
    <div style="font-weight: bold; font-size: 1.2rem; margin-bottom: 1rem;">
      ${status}
    </div>
    <div style="font-size: 0.9rem; margin-bottom: 1rem; line-height: 1.4;">
      ${message}
    </div>
    <div style="font-size: 0.8rem; color: rgba(255,255,255,0.8); margin-bottom: 1rem;">
      API: ${apiData} | Supabase: ${supabaseData} | DOM: ${domCards}
    </div>
    ${action}
    <button onclick="this.parentElement.remove()" style="position: absolute; top: 0.5rem; right: 0.5rem; background: rgba(255,255,255,0.2); color: white; border: none; width: 1.5rem; height: 1.5rem; border-radius: 50%; cursor: pointer; font-size: 0.8rem;">
      ✕
    </button>
  `;
  
  document.body.appendChild(notification);
  
  // Auto remove after 15 seconds
  setTimeout(() => {
    if (notification.parentElement) {
      notification.remove();
    }
  }, 15000);
  
}).catch(error => {
  console.error('❌ Diagnosa gagal:', error);
});