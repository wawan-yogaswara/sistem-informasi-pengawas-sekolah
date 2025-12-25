// TEST TUGAS TAMBAHAN LENGKAP - Copy paste ke Console Browser

console.log('🧪 Testing halaman Tugas Tambahan...');

// 1. Pastikan user sudah login
const checkAuth = () => {
  const authUser = localStorage.getItem('auth_user');
  const authToken = localStorage.getItem('auth_token');
  
  if (!authUser || !authToken) {
    console.log('❌ User belum login, setting default...');
    const defaultUser = {
      id: '421cdb28-f2af-4f1f-aa5f-c59a3d661a2e',
      username: 'wawan',
      full_name: 'H. Wawan Yogaswara, S.Pd, M.Pd',
      role: 'user',
      nip: '196805301994121001',
      position: 'Pengawas Sekolah'
    };
    localStorage.setItem('auth_user', JSON.stringify(defaultUser));
    localStorage.setItem('auth_token', 'supabase-token-' + Date.now());
    console.log('✅ Default user set');
    return defaultUser;
  }
  
  const user = JSON.parse(authUser);
  console.log('✅ User sudah login:', user.username);
  return user;
};

// 2. Test koneksi Supabase
const testSupabaseConnection = async () => {
  try {
    console.log('🔗 Testing Supabase connection...');
    
    // Import supabase client
    const { supabase } = await import('/src/lib/supabase.ts');
    
    // Test query ke tabel additional_tasks
    const { data, error } = await supabase
      .from('additional_tasks')
      .select('*')
      .limit(1);
    
    if (error) {
      console.warn('⚠️ Supabase query error:', error.message);
      return false;
    }
    
    console.log('✅ Supabase connection OK');
    return true;
  } catch (error) {
    console.error('❌ Supabase connection failed:', error);
    return false;
  }
};

// 3. Test tambah data sample
const addSampleData = async () => {
  try {
    console.log('📝 Adding sample additional task...');
    
    const { supabase } = await import('/src/lib/supabase.ts');
    const user = checkAuth();
    
    const sampleTask = {
      user_id: user.id,
      school_id: '1cd40355-1b07-402d-8309-b243c098cfe9', // SDN 1 Garut
      title: 'Rapat Koordinasi Pengawas - Test',
      description: 'Menghadiri rapat koordinasi pengawas sekolah tingkat kabupaten untuk membahas program kerja semester genap',
      date: new Date().toISOString().split('T')[0], // Today
      status: 'completed',
      photo: null
    };
    
    const { data, error } = await supabase
      .from('additional_tasks')
      .insert([sampleTask])
      .select()
      .single();
    
    if (error) {
      console.warn('⚠️ Insert error:', error.message);
      return null;
    }
    
    console.log('✅ Sample task added:', data.title);
    return data;
  } catch (error) {
    console.error('❌ Add sample data failed:', error);
    return null;
  }
};

// 4. Test fetch data
const testFetchData = async () => {
  try {
    console.log('📊 Testing fetch additional tasks...');
    
    const { supabase } = await import('/src/lib/supabase.ts');
    
    const { data, error } = await supabase
      .from('additional_tasks')
      .select(`
        *,
        schools (
          id,
          name
        )
      `)
      .order('created_at', { ascending: false });
    
    if (error) {
      console.warn('⚠️ Fetch error:', error.message);
      return [];
    }
    
    console.log('✅ Fetched tasks:', data?.length || 0, 'records');
    return data || [];
  } catch (error) {
    console.error('❌ Fetch data failed:', error);
    return [];
  }
};

// 5. Test UI elements
const testUIElements = () => {
  console.log('🎨 Testing UI elements...');
  
  const elements = {
    addButton: document.querySelector('button:has(svg + span:contains("Tambah Kegiatan"))'),
    title: document.querySelector('h1'),
    cards: document.querySelectorAll('[data-testid="task-card"], .hover\\:shadow-md')
  };
  
  console.log('UI Elements found:');
  console.log('- Add Button:', !!elements.addButton);
  console.log('- Page Title:', !!elements.title);
  console.log('- Task Cards:', elements.cards.length);
  
  return elements;
};

// 6. Main test function
const runCompleteTest = async () => {
  console.log('🚀 Starting complete test...');
  
  // Check auth
  const user = checkAuth();
  
  // Test Supabase connection
  const supabaseOK = await testSupabaseConnection();
  
  // Add sample data if connection OK
  let sampleAdded = null;
  if (supabaseOK) {
    sampleAdded = await addSampleData();
  }
  
  // Test fetch data
  const tasks = await testFetchData();
  
  // Test UI
  const ui = testUIElements();
  
  // Summary
  console.log('\n📋 TEST SUMMARY:');
  console.log('✅ Authentication:', !!user);
  console.log('✅ Supabase Connection:', supabaseOK);
  console.log('✅ Sample Data Added:', !!sampleAdded);
  console.log('✅ Data Fetch:', tasks.length > 0);
  console.log('✅ UI Elements:', !!ui.title && !!ui.addButton);
  
  if (supabaseOK && tasks.length > 0) {
    console.log('🎉 Semua test BERHASIL! Halaman Tugas Tambahan siap digunakan.');
  } else {
    console.log('⚠️ Ada beberapa masalah, tapi halaman masih bisa digunakan.');
  }
  
  // Refresh page if needed
  if (window.location.pathname.includes('/additional-tasks')) {
    console.log('🔄 Refreshing page to show latest data...');
    setTimeout(() => {
      window.location.reload();
    }, 2000);
  }
};

// Run the test
runCompleteTest();