// NUCLEAR FIX - FINAL SOLUTION
// Copy paste ke browser console di halaman Additional Tasks

console.log('💥 NUCLEAR FIX - FINAL SOLUTION');

// 1. FORCE USER ID
const userData = localStorage.getItem('auth_user');
if (userData) {
  const user = JSON.parse(userData);
  user.id = '421cdb28-f2af-4f1f-aa5f-c59a3d661a2e';
  user.username = 'wawan';
  localStorage.setItem('auth_user', JSON.stringify(user));
  console.log('✅ User ID forced');
}

// 2. CLEAR EVERYTHING
localStorage.clear();
if (window.queryClient) {
  window.queryClient.clear();
}
console.log('✅ All cache cleared');

// 3. FORCE REFRESH PAGE
setTimeout(() => {
  window.location.reload();
}, 1000);

console.log('🔄 Page will refresh in 1 second...');