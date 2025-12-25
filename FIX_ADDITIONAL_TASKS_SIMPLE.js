// SIMPLE FIX - Copy paste ke browser console di halaman Additional Tasks

console.log('🔧 SIMPLE FIX - Additional Tasks Field Mapping');

// 1. Fix User ID
const userData = localStorage.getItem('auth_user');
if (userData) {
  const user = JSON.parse(userData);
  if (user.username === 'wawan') {
    user.id = '421cdb28-f2af-4f1f-aa5f-c59a3d661a2e';
    localStorage.setItem('auth_user', JSON.stringify(user));
    console.log('✅ User ID fixed');
  }
}

// 2. Clear cache
localStorage.removeItem('additional_tasks_cache');
if (window.queryClient) {
  window.queryClient.clear();
  console.log('✅ Cache cleared');
}

// 3. Force refresh
if (window.queryClient) {
  window.queryClient.invalidateQueries({ queryKey: ['additional-tasks'] });
  window.queryClient.refetchQueries({ queryKey: ['additional-tasks'] });
  console.log('✅ React Query refreshed');
}

// 4. Test API
fetch('/api/activities?user_id=421cdb28-f2af-4f1f-aa5f-c59a3d661a2e')
  .then(r => r.json())
  .then(data => {
    console.log(`✅ API returned ${data.length} activities`);
    if (data.length > 0) {
      console.log('Sample:', {
        title: data[0].title,
        photo: data[0].photo ? 'EXISTS' : 'MISSING'
      });
    }
  });

console.log('🎉 Fix completed - refresh page if needed');