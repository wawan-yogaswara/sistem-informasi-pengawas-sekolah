// 🔍 SIMPLE FRONTEND TEST
console.log('🔍 TESTING FRONTEND ISSUES');
console.log('==========================');

// Test 1: Cek apakah server berjalan
console.log('1️⃣ Testing frontend server...');

fetch('http://localhost:5173/')
  .then(response => {
    console.log('✅ Frontend server status:', response.status);
    if (response.ok) {
      console.log('✅ Frontend server accessible');
    } else {
      console.log('❌ Frontend server error:', response.status);
    }
  })
  .catch(error => {
    console.error('❌ Frontend server not accessible:', error.message);
    console.log('💡 Solusi: Jalankan "npm run dev" untuk start server');
  });

// Test 2: Cek tasks endpoint
console.log('2️⃣ Testing tasks page...');

fetch('http://localhost:5173/tasks')
  .then(response => {
    console.log('✅ Tasks page status:', response.status);
    if (response.ok) {
      console.log('✅ Tasks page accessible');
    } else {
      console.log('❌ Tasks page error:', response.status);
    }
  })
  .catch(error => {
    console.error('❌ Tasks page not accessible:', error.message);
  });

console.log('');
console.log('📋 MANUAL DEBUGGING STEPS:');
console.log('1. Jalankan: npm run dev');
console.log('2. Buka http://localhost:5173/tasks');
console.log('3. Buka DevTools (F12)');
console.log('4. Lihat Console tab untuk error messages');
console.log('5. Lihat Network tab untuk failed requests');
console.log('6. Paste script debug-frontend-tasks.js ke Console');

console.log('');
console.log('🔧 COMMON ISSUES & SOLUTIONS:');
console.log('- Data tidak muncul: Cek authentication di localStorage');
console.log('- Error 401/403: Login ulang atau cek credentials');
console.log('- Error 500: Cek Supabase connection atau RLS policies');
console.log('- Loading terus: Cek network requests di DevTools');