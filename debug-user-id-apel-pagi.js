// DEBUG USER ID APEL PAGI - Jalankan di browser console
const debugUserIdApelPagi = async () => {
  try {
    console.log('🔍 Debug User ID untuk Apel Pagi...');
    
    // Check current user in localStorage
    const authUser = localStorage.getItem('auth_user');
    const currentUser = localStorage.getItem('currentUser');
    
    console.log('👤 Auth user:', authUser);
    console.log('👤 Current user:', currentUser);
    
    let userId = 'default_user';
    if (authUser) {
      const user = JSON.parse(authUser);
      userId = user.id || user.username || 'default_user';
      console.log('📋 User from auth_user:', user);
    } else if (currentUser) {
      const user = JSON.parse(currentUser);
      userId = user.id || user.username || 'default_user';
      console.log('📋 User from currentUser:', user);
    }
    
    console.log('🆔 Final User ID:', userId);
    
    // Test API with different user IDs
    const testUserIds = [
      userId,
      'wawan-user',
      'admin',
      'default_user',
      null // untuk semua data
    ];
    
    for (const testUserId of testUserIds) {
      console.log(`\n🧪 Testing with user_id: ${testUserId || 'ALL'}`);
      
      const apiUrl = testUserId 
        ? `/api/tasks?user_id=${testUserId}`
        : '/api/tasks';
      
      try {
        const response = await fetch(apiUrl);
        if (response.ok) {
          const data = await response.json();
          const apelTasks = data.filter(task => 
            (task.title && task.title.toLowerCase().includes('apel')) ||
            (task.name && task.name.toLowerCase().includes('apel'))
          );
          
          console.log(`  📊 Total tasks: ${data.length}`);
          console.log(`  🌅 Apel tasks: ${apelTasks.length}`);
          
          if (apelTasks.length > 0) {
            console.log('  ✅ Found Apel Pagi data!');
            apelTasks.forEach(task => {
              console.log(`    - ${task.title || task.name} (user: ${task.user_id})`);
            });
          }
        } else {
          console.log(`  ❌ API Error: ${response.status}`);
        }
      } catch (error) {
        console.log(`  ❌ Request Error:`, error.message);
      }
    }
    
    // Suggest fix
    console.log('\n💡 SARAN PERBAIKAN:');
    console.log('1. Jika ada data Apel Pagi dengan user_id berbeda, update user_id di Supabase');
    console.log('2. Atau gunakan user_id yang benar di localStorage');
    console.log('3. Atau hapus filter user_id untuk menampilkan semua data');
    
  } catch (error) {
    console.error('❌ Debug error:', error);
  }
};

// Jalankan debug
debugUserIdApelPagi();