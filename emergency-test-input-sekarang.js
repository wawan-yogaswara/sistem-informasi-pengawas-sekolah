// EMERGENCY TEST INPUT SEKARANG
// Jalankan di console browser untuk test langsung

console.log('🚨 EMERGENCY TEST INPUT - SEKARANG');

async function emergencyTestInput() {
  try {
    console.log('🧪 Testing emergency input fixes...');
    
    // Get current user
    const userData = localStorage.getItem('auth_user');
    if (!userData) {
      console.error('❌ No user data found');
      return;
    }
    
    const currentUser = JSON.parse(userData);
    console.log('👤 Current user:', currentUser);
    
    // Generate proper user ID
    let userId = currentUser.id;
    if (!userId || typeof userId !== 'string' || userId.length < 10) {
      userId = `user-${currentUser.username || 'anonymous'}-${Date.now()}`;
    }
    console.log('🆔 Using user ID:', userId);
    
    // Test 1: Tasks
    console.log('\n📝 Testing Tasks...');
    try {
      const { data: taskData, error: taskError } = await supabase
        .from('tasks')
        .insert([{
          user_id: userId,
          title: 'Emergency Test Task',
          description: 'Testing emergency fix',
          completed: false,
          date: new Date().toISOString().split('T')[0]
        }])
        .select()
        .single();
      
      if (taskError) {
        console.error('❌ Tasks error:', taskError);
      } else {
        console.log('✅ Tasks insert successful:', taskData);
      }
    } catch (error) {
      console.error('❌ Tasks test failed:', error);
    }
    
    // Test 2: Supervisions
    console.log('\n🏫 Testing Supervisions...');
    try {
      const { data: supervisionData, error: supervisionError } = await supabase
        .from('supervisions')
        .insert([{
          user_id: userId,
          school: 'Test School Emergency',
          type: 'Akademik',
          date: new Date().toISOString().split('T')[0],
          findings: 'Emergency test findings',
          teacher_name: 'Test Teacher',
          teacher_nip: '123456789',
          recommendations: 'Test recommendations',
          photo1: null,
          photo2: null
        }])
        .select()
        .single();
      
      if (supervisionError) {
        console.error('❌ Supervisions error:', supervisionError);
      } else {
        console.log('✅ Supervisions insert successful:', supervisionData);
      }
    } catch (error) {
      console.error('❌ Supervisions test failed:', error);
    }
    
    // Test 3: Additional Tasks
    console.log('\n📋 Testing Additional Tasks...');
    try {
      const { data: additionalTaskData, error: additionalTaskError } = await supabase
        .from('additional_tasks')
        .insert([{
          user_id: userId,
          school_id: '1cd40355-1b07-402d-8309-b243c098cfe9',
          title: 'Emergency Test Additional Task',
          description: 'Testing emergency fix for additional tasks',
          date: new Date().toISOString().split('T')[0],
          status: 'completed'
        }])
        .select()
        .single();
      
      if (additionalTaskError) {
        console.error('❌ Additional Tasks error:', additionalTaskError);
      } else {
        console.log('✅ Additional Tasks insert successful:', additionalTaskData);
      }
    } catch (error) {
      console.error('❌ Additional Tasks test failed:', error);
    }
    
    console.log('\n🎉 EMERGENCY TEST SELESAI');
    
  } catch (error) {
    console.error('💥 Emergency test failed:', error);
  }
}

// Jalankan test
emergencyTestInput();