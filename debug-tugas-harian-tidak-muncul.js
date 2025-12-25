// DEBUG: Tugas Harian Tidak Muncul di Halaman
// Jalankan script ini di browser console untuk diagnosa

console.log('🔍 DEBUGGING: Tugas Harian Tidak Muncul');

// 1. Cek koneksi Supabase
async function cekKoneksiSupabase() {
  console.log('\n1️⃣ CEK KONEKSI SUPABASE');
  
  try {
    // Import supabase (sesuaikan dengan path aplikasi)
    const { supabase } = await import('/src/lib/supabase.ts');
    
    const { data, error } = await supabase
      .from('tasks')
      .select('count')
      .limit(1);
    
    if (error) {
      console.error('❌ Error koneksi Supabase:', error);
      return false;
    }
    
    console.log('✅ Koneksi Supabase berhasil');
    return true;
  } catch (err) {
    console.error('❌ Error import Supabase:', err);
    return false;
  }
}

// 2. Cek data di tabel tasks
async function cekDataTasks() {
  console.log('\n2️⃣ CEK DATA DI TABEL TASKS');
  
  try {
    const { supabase } = await import('/src/lib/supabase.ts');
    
    const { data, error } = await supabase
      .from('tasks')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (error) {
      console.error('❌ Error query tasks:', error);
      return;
    }
    
    console.log(`📊 Total data tasks: ${data?.length || 0}`);
    
    if (data && data.length > 0) {
      console.log('📋 Sample data tasks:');
      console.table(data.slice(0, 3));
      
      // Cek struktur kolom
      const sampleTask = data[0];
      console.log('\n🏗️ Struktur kolom tasks:');
      Object.keys(sampleTask).forEach(key => {
        console.log(`- ${key}: ${typeof sampleTask[key]}`);
      });
    } else {
      console.log('⚠️ Tidak ada data di tabel tasks');
    }
    
    return data;
  } catch (err) {
    console.error('❌ Error cek data tasks:', err);
  }
}

// 3. Cek user authentication
function cekUserAuth() {
  console.log('\n3️⃣ CEK USER AUTHENTICATION');
  
  const userData = localStorage.getItem('auth_user');
  
  if (!userData) {
    console.error('❌ User tidak login (auth_user tidak ada di localStorage)');
    return null;
  }
  
  try {
    const user = JSON.parse(userData);
    console.log('✅ User login:', user);
    return user;
  } catch (err) {
    console.error('❌ Error parse user data:', err);
    return null;
  }
}

// 4. Cek filter user_id
async function cekFilterUserId() {
  console.log('\n4️⃣ CEK FILTER USER_ID');
  
  const user = cekUserAuth();
  if (!user) return;
  
  try {
    const { supabase } = await import('/src/lib/supabase.ts');
    
    // Cek semua tasks tanpa filter
    const { data: allTasks, error: allError } = await supabase
      .from('tasks')
      .select('*');
    
    if (allError) {
      console.error('❌ Error query all tasks:', allError);
      return;
    }
    
    console.log(`📊 Total semua tasks: ${allTasks?.length || 0}`);
    
    // Cek tasks dengan user_id yang sama
    let userId = user.id;
    if (!userId || typeof userId !== 'string' || userId.length < 10) {
      userId = `user-${user.username || 'anonymous'}-${Date.now()}`;
    }
    
    const { data: userTasks, error: userError } = await supabase
      .from('tasks')
      .select('*')
      .eq('user_id', userId);
    
    if (userError) {
      console.error('❌ Error query user tasks:', userError);
      return;
    }
    
    console.log(`📊 Tasks untuk user ${userId}: ${userTasks?.length || 0}`);
    
    if (allTasks && allTasks.length > 0) {
      console.log('\n🔍 User IDs yang ada di database:');
      const userIds = [...new Set(allTasks.map(t => t.user_id))];
      userIds.forEach(id => {
        const count = allTasks.filter(t => t.user_id === id).length;
        console.log(`- ${id}: ${count} tasks`);
      });
    }
    
  } catch (err) {
    console.error('❌ Error cek filter user_id:', err);
  }
}

// 5. Cek React Query cache
function cekReactQueryCache() {
  console.log('\n5️⃣ CEK REACT QUERY CACHE');
  
  // Cek apakah ada React Query di window
  if (window.__REACT_QUERY_DEVTOOLS_GLOBAL_HOOK__) {
    console.log('✅ React Query DevTools tersedia');
  }
  
  // Cek localStorage untuk cache
  const cacheKeys = Object.keys(localStorage).filter(key => 
    key.includes('react-query') || key.includes('tanstack')
  );
  
  if (cacheKeys.length > 0) {
    console.log('📦 React Query cache keys:', cacheKeys);
  } else {
    console.log('⚠️ Tidak ada React Query cache di localStorage');
  }
}

// 6. Cek network requests
function cekNetworkRequests() {
  console.log('\n6️⃣ CEK NETWORK REQUESTS');
  console.log('🌐 Buka Network tab di DevTools dan refresh halaman');
  console.log('🔍 Cari request ke Supabase dengan endpoint tasks');
  console.log('📊 Periksa response data dan status code');
}

// 7. Jalankan semua diagnosa
async function diagnosaLengkap() {
  console.log('🚀 MEMULAI DIAGNOSA LENGKAP...\n');
  
  const koneksiOk = await cekKoneksiSupabase();
  if (!koneksiOk) {
    console.log('\n❌ DIAGNOSA BERHENTI: Koneksi Supabase gagal');
    return;
  }
  
  await cekDataTasks();
  cekUserAuth();
  await cekFilterUserId();
  cekReactQueryCache();
  cekNetworkRequests();
  
  console.log('\n✅ DIAGNOSA SELESAI');
  console.log('📋 Periksa hasil di atas untuk menemukan masalah');
}

// Auto run
diagnosaLengkap();

// Export functions untuk manual testing
window.debugTugasHarian = {
  cekKoneksiSupabase,
  cekDataTasks,
  cekUserAuth,
  cekFilterUserId,
  cekReactQueryCache,
  diagnosaLengkap
};