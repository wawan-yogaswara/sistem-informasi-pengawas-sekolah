// 🔧 SETUP TEST DATA FOR FRONTEND
// Script untuk memastikan ada user login dan test data

console.log('🔧 SETUP TEST DATA FOR FRONTEND');
console.log('===============================');

// Script untuk browser console
const browserScript = `
// 1. Setup auth user di localStorage
const testUser = {
  id: 'user-wawan-test-123',
  username: 'wawan',
  name: 'Wawan Setiawan',
  role: 'user',
  nip: '196801011990031001',
  position: 'Pengawas Sekolah'
};

localStorage.setItem('auth_user', JSON.stringify(testUser));
console.log('✅ Auth user set:', testUser);

// 2. Test Supabase connection
if (typeof supabase !== 'undefined') {
  console.log('✅ Supabase client available');
  
  // Test tasks query
  supabase.from('tasks').select('*').limit(5).then(result => {
    console.log('📊 Tasks test query:', result);
  });
  
  // Test schools query  
  supabase.from('schools').select('*').limit(5).then(result => {
    console.log('🏫 Schools test query:', result);
  });
} else {
  console.log('❌ Supabase client not available');
}

// 3. Refresh page to trigger React Query
setTimeout(() => {
  console.log('🔄 Refreshing page to trigger queries...');
  window.location.reload();
}, 2000);
`;

console.log('📋 BROWSER CONSOLE SCRIPT:');
console.log('==========================');
console.log(browserScript);

console.log('');
console.log('📝 INSTRUKSI:');
console.log('1. Buka http://localhost:5173/tasks');
console.log('2. Buka DevTools (F12)');
console.log('3. Paste script di atas ke Console tab');
console.log('4. Tekan Enter');
console.log('5. Tunggu page refresh otomatis');
console.log('6. Lihat apakah data muncul');

console.log('');
console.log('🔍 ALTERNATIVE MANUAL STEPS:');
console.log('1. Login dulu di /login dengan user: wawan, pass: wawan123');
console.log('2. Kemudian buka /tasks');
console.log('3. Lihat console untuk debug logs');