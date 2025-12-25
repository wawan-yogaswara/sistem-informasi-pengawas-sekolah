// Debug script untuk memeriksa data tugas tambahan di laporan
// Jalankan di browser console saat di halaman laporan

console.log('🔍 DEBUG: Checking additional tasks data for reports...');

// 1. Check current user
const userData = localStorage.getItem('auth_user');
if (!userData) {
  console.log('❌ No user data found in localStorage');
} else {
  const currentUser = JSON.parse(userData);
  const userId = currentUser.username || currentUser.id;
  console.log('👤 Current user:', currentUser.username);
  console.log('🔑 Using user_id:', userId);
  
  // 2. Check Supabase connection
  if (typeof supabase === 'undefined') {
    console.log('❌ Supabase not available');
  } else {
    console.log('✅ Supabase available');
    
    // 3. Test direct query to additional_tasks
    supabase
      .from('additional_tasks')
      .select(`
        *,
        schools (
          id,
          name
        )
      `)
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
      .then(({ data, error }) => {
        if (error) {
          console.error('❌ Query error:', error);
        } else {
          console.log(`✅ Found ${data?.length || 0} additional tasks for user ${userId}`);
          
          if (data && data.length > 0) {
            console.log('📋 Additional tasks data:');
            data.forEach((task, index) => {
              console.log(`  ${index + 1}. ${task.name || task.title} (${task.date})`);
              console.log(`     - Location: ${task.location || task.schools?.name || 'N/A'}`);
              console.log(`     - Photos: ${task.photo ? 'photo1' : ''}${task.photo2 ? ' photo2' : ''}`);
              console.log(`     - User ID: ${task.user_id}`);
            });
          } else {
            console.log('📋 No additional tasks found');
            
            // Check if there are any additional_tasks at all
            supabase
              .from('additional_tasks')
              .select('*')
              .limit(5)
              .then(({ data: allTasks, error: allError }) => {
                if (allError) {
                  console.error('❌ Error checking all tasks:', allError);
                } else {
                  console.log(`📊 Total additional_tasks in database: ${allTasks?.length || 0}`);
                  if (allTasks && allTasks.length > 0) {
                    console.log('📋 Sample tasks (first 5):');
                    allTasks.forEach((task, index) => {
                      console.log(`  ${index + 1}. ${task.name || task.title} (user_id: ${task.user_id})`);
                    });
                    
                    // Check if user_id format matches
                    const sampleUserIds = [...new Set(allTasks.map(t => t.user_id))];
                    console.log('🔑 User IDs in database:', sampleUserIds);
                    console.log('🔑 Current user ID:', userId);
                    console.log('🔍 ID match found:', sampleUserIds.includes(userId));
                  }
                }
              });
          }
        }
      });
  }
}

// 4. Check if reports page is loading data correctly
setTimeout(() => {
  console.log('🔍 Checking reports page state...');
  
  // Look for activities data in React state (if available)
  const reportElements = document.querySelectorAll('[data-testid="activity-card"], .activity-item, .card');
  console.log(`📊 Found ${reportElements.length} activity elements on page`);
  
  // Check for "Tugas Tambahan" activities
  const tugasTambahanElements = Array.from(reportElements).filter(el => 
    el.textContent?.includes('Tugas Tambahan')
  );
  console.log(`➕ Found ${tugasTambahanElements.length} "Tugas Tambahan" elements on page`);
  
  if (tugasTambahanElements.length === 0) {
    console.log('⚠️ No "Tugas Tambahan" activities visible on reports page');
  }
}, 2000);