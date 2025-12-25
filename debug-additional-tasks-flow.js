// Debug flow untuk additional tasks
console.log('🔍 Debugging Additional Tasks Flow...');

// 1. Cek data di localStorage
const localData = localStorage.getItem('additional_tasks_data');
console.log('📦 Data di localStorage:', localData ? JSON.parse(localData) : 'Kosong');

// 2. Test API call langsung
async function testSupabaseConnection() {
  try {
    console.log('🧪 Testing Supabase connection...');
    
    // Import supabase client
    const { createClient } = window.supabase || {};
    if (!createClient) {
      console.error('❌ Supabase client tidak tersedia');
      return;
    }
    
    // Cek environment variables
    console.log('🔑 Checking environment...');
    console.log('SUPABASE_URL:', window.location.origin.includes('localhost') ? 'localhost' : 'production');
    
    // Test query ke additional_tasks table
    const response = await fetch('/api/additional-tasks', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      }
    });
    
    const data = await response.json();
    console.log('📊 Data dari API:', data);
    
  } catch (error) {
    console.error('❌ Error testing connection:', error);
  }
}

// 3. Test manual insert
async function testManualInsert() {
  try {
    console.log('📝 Testing manual insert...');
    
    const testData = {
      title: 'Test Manual Insert',
      description: 'Test deskripsi manual',
      date: '2025-01-15',
      status: 'pending'
    };
    
    const response = await fetch('/api/additional-tasks', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(testData)
    });
    
    const result = await response.json();
    console.log('✅ Result manual insert:', result);
    
  } catch (error) {
    console.error('❌ Error manual insert:', error);
  }
}

// 4. Cek React Query cache
function checkReactQueryCache() {
  console.log('🔄 Checking React Query cache...');
  
  // Cek apakah ada query client
  if (window.queryClient) {
    const cache = window.queryClient.getQueryCache();
    console.log('📋 Query cache:', cache);
    
    // Invalidate cache
    window.queryClient.invalidateQueries({ queryKey: ['additional-tasks'] });
    console.log('🔄 Cache invalidated');
  } else {
    console.log('❌ Query client tidak ditemukan');
  }
}

// Jalankan semua test
testSupabaseConnection();
setTimeout(() => testManualInsert(), 1000);
setTimeout(() => checkReactQueryCache(), 2000);

console.log('🎯 Debug selesai. Cek console untuk hasil.');