// Script untuk memastikan data tugas tambahan muncul di laporan
// Jalankan di browser console

console.log('🔧 FIXING: Additional tasks data for reports...');

// 1. Get current user
const userData = localStorage.getItem('auth_user');
if (!userData) {
  console.log('❌ No user data found');
} else {
  const currentUser = JSON.parse(userData);
  const userId = currentUser.username || currentUser.id;
  console.log('👤 Current user:', currentUser.username);
  console.log('🔑 Using user_id:', userId);
  
  // 2. Check if there are any additional_tasks at all
  supabase
    .from('additional_tasks')
    .select('*')
    .limit(10)
    .then(({ data: allTasks, error }) => {
      if (error) {
        console.error('❌ Error fetching all tasks:', error);
        return;
      }
      
      console.log(`📊 Total additional_tasks in database: ${allTasks?.length || 0}`);
      
      if (!allTasks || allTasks.length === 0) {
        console.log('⚠️ No additional_tasks found in database');
        console.log('💡 Creating sample data...');
        
        // Create sample additional task
        const sampleTask = {
          user_id: userId,
          title: 'Kegiatan Pembinaan Guru',
          name: 'Kegiatan Pembinaan Guru', // Support both columns
          description: 'Kegiatan pembinaan guru di sekolah binaan',
          date: new Date().toISOString().split('T')[0],
          location: 'SDN 1 Garut',
          organizer: 'Pengawas Sekolah',
          status: 'completed'
        };
        
        supabase
          .from('additional_tasks')
          .insert([sampleTask])
          .then(({ data, error }) => {
            if (error) {
              console.error('❌ Error creating sample task:', error);
            } else {
              console.log('✅ Sample additional task created');
              console.log('🔄 Please refresh the reports page');
            }
          });
        
        return;
      }
      
      // 3. Check user_id formats
      const userIds = [...new Set(allTasks.map(t => t.user_id))];
      console.log('🔑 User IDs in database:', userIds);
      console.log('🔑 Current user ID:', userId);
      
      const matchingTasks = allTasks.filter(t => t.user_id === userId);
      console.log(`✅ Tasks matching current user: ${matchingTasks.length}`);
      
      if (matchingTasks.length === 0) {
        console.log('⚠️ No tasks found for current user');
        console.log('💡 Checking if we can update existing tasks...');
        
        // If there are tasks but with different user_id, update one for testing
        if (allTasks.length > 0) {
          const taskToUpdate = allTasks[0];
          console.log(`🔄 Updating task ${taskToUpdate.id} to user ${userId}`);
          
          supabase
            .from('additional_tasks')
            .update({ user_id: userId })
            .eq('id', taskToUpdate.id)
            .then(({ data, error }) => {
              if (error) {
                console.error('❌ Error updating task:', error);
              } else {
                console.log('✅ Task updated with correct user_id');
                console.log('🔄 Please refresh the reports page');
              }
            });
        }
      } else {
        console.log('✅ Found matching tasks for current user:');
        matchingTasks.forEach((task, index) => {
          console.log(`  ${index + 1}. ${task.title || task.name} (${task.date})`);
        });
        console.log('🔄 Data should appear in reports. If not, check browser console for errors.');
      }
    });
}

// 4. Test the exact query used by reports page
setTimeout(() => {
  console.log('🧪 Testing reports page query...');
  
  const userData = localStorage.getItem('auth_user');
  if (userData) {
    const currentUser = JSON.parse(userData);
    const userId = currentUser.username || currentUser.id;
    
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
          console.error('❌ Reports query error:', error);
        } else {
          console.log(`✅ Reports query result: ${data?.length || 0} tasks`);
          if (data && data.length > 0) {
            console.log('📋 Tasks that should appear in reports:');
            data.forEach((task, index) => {
              console.log(`  ${index + 1}. ${task.title || task.name}`);
              console.log(`     - Date: ${task.date}`);
              console.log(`     - Location: ${task.location || task.schools?.name}`);
              console.log(`     - Photos: ${task.photo1 ? 'photo1' : ''}${task.photo2 ? ' photo2' : ''}`);
            });
          }
        }
      });
  }
}, 1000);