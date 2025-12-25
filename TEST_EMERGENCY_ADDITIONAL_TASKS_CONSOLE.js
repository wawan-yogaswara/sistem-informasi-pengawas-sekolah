// EMERGENCY TEST: Script untuk test langsung di browser console
// Copy paste script ini di browser console halaman Additional Tasks

console.log('🚨 EMERGENCY TEST: Additional Tasks Data');

// Test 1: Cek user data di localStorage
const userData = localStorage.getItem('auth_user');
if (userData) {
  const currentUser = JSON.parse(userData);
  console.log('👤 Current user:', currentUser);
  console.log('🔑 Username:', currentUser.username);
  console.log('🆔 ID:', currentUser.id);
} else {
  console.log('❌ No user data in localStorage');
}

// Test 2: Test query langsung ke Supabase
async function testAdditionalTasksQuery() {
  try {
    console.log('🔍 Testing direct Supabase query...');
    
    const userData = localStorage.getItem('auth_user');
    if (!userData) {
      console.log('❌ No user data');
      return;
    }
    
    const currentUser = JSON.parse(userData);
    const userId = currentUser.username || currentUser.id;
    console.log('🔑 Using userId:', userId);
    
    // Import Supabase client (assuming it's available globally)
    if (typeof supabase === 'undefined') {
      console.log('❌ Supabase client not available');
      return;
    }
    
    // Test query
    const { data, error } = await supabase
      .from('additional_tasks')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });
    
    if (error) {
      console.error('❌ Query error:', error);
    } else {
      console.log('✅ Query success!');
      console.log('📊 Data count:', data?.length || 0);
      console.log('📋 Data:', data);
    }
    
  } catch (error) {
    console.error('❌ Test error:', error);
  }
}

// Test 3: Cek semua data tanpa filter user
async function testAllAdditionalTasks() {
  try {
    console.log('🔍 Testing query without user filter...');
    
    if (typeof supabase === 'undefined') {
      console.log('❌ Supabase client not available');
      return;
    }
    
    const { data, error } = await supabase
      .from('additional_tasks')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (error) {
      console.error('❌ Query error:', error);
    } else {
      console.log('✅ All data query success!');
      console.log('📊 Total data count:', data?.length || 0);
      console.log('📋 All data:', data);
      
      // Cek user_id yang ada
      const userIds = [...new Set(data?.map(item => item.user_id))];
      console.log('👥 User IDs in database:', userIds);
    }
    
  } catch (error) {
    console.error('❌ Test error:', error);
  }
}

// Jalankan test
console.log('\n🧪 Running tests...');
testAdditionalTasksQuery();
testAllAdditionalTasks();

console.log('\n📝 INSTRUKSI:');
console.log('1. Copy paste script ini di browser console');
console.log('2. Lihat hasil test di console');
console.log('3. Jika ada data, berarti query bekerja');
console.log('4. Jika tidak ada data, cek user_id di database');