// Script untuk memastikan semua halaman menggunakan Supabase saja
// Jalankan di console browser untuk memastikan data konsisten

console.log('🔄 Forcing all pages to use Supabase only...');

// Clear localStorage data yang mungkin konflik
const keysToKeep = ['auth_user', 'profile_data', 'user_data'];
const allKeys = Object.keys(localStorage);

allKeys.forEach(key => {
  if (!keysToKeep.includes(key)) {
    console.log(`🗑️ Removing localStorage key: ${key}`);
    localStorage.removeItem(key);
  }
});

// Set flag untuk force Supabase
localStorage.setItem('force_supabase_only', 'true');
localStorage.setItem('data_source', 'supabase');

console.log('✅ All pages now configured to use Supabase only');
console.log('📊 Remaining localStorage keys:', Object.keys(localStorage));

// Test Supabase connection
async function testSupabaseConnection() {
  try {
    console.log('🧪 Testing Supabase connection...');
    
    const endpoints = [
      '/api/tasks-daily',
      '/api/supervisions', 
      '/api/activities',
      '/api/schools'
    ];
    
    for (const endpoint of endpoints) {
      try {
        const response = await fetch(endpoint);
        const data = await response.json();
        console.log(`✅ ${endpoint}: ${data.length} records`);
      } catch (error) {
        console.error(`❌ ${endpoint}: Error -`, error);
      }
    }
    
    console.log('🎉 Supabase connection test completed');
    
  } catch (error) {
    console.error('❌ Supabase connection test failed:', error);
  }
}

// Run test
testSupabaseConnection();

// Force refresh all data
console.log('🔄 Refreshing page to load data from Supabase...');
setTimeout(() => {
  location.reload();
}, 2000);