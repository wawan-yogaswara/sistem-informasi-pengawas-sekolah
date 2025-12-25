// FIX SUPABASE USER CONTEXT
// Jalankan di console browser untuk set user context

console.log('🔧 FIX SUPABASE USER CONTEXT');

async function fixSupabaseUserContext() {
  try {
    console.log('👤 Setting up user context for Supabase...');
    
    // Get current user
    const userData = localStorage.getItem('auth_user');
    if (!userData) {
      console.error('❌ No user data found');
      return;
    }
    
    const currentUser = JSON.parse(userData);
    console.log('👤 Current user:', currentUser.id);
    
    // Set user context in Supabase
    const { error } = await supabase.rpc('set_config', {
      setting_name: 'app.current_user_id',
      setting_value: currentUser.id
    });
    
    if (error) {
      console.error('❌ Error setting user context:', error);
      
      // Alternative: Try direct SQL
      console.log('🔄 Trying alternative method...');
      
      const { error: sqlError } = await supabase
        .from('tasks') // Use any table to execute SQL
        .select('id')
        .limit(0); // Don't actually fetch data
      
      if (sqlError) {
        console.error('❌ SQL test failed:', sqlError);
      } else {
        console.log('✅ Basic SQL access works');
      }
    } else {
      console.log('✅ User context set successfully');
    }
    
    // Test with user context
    console.log('🧪 Testing queries with user context...');
    
    // Test tasks
    const { data: tasksData, error: tasksError } = await supabase
      .from('tasks')
      .select('*')
      .limit(1);
    
    if (tasksError) {
      console.error('❌ Tasks query failed:', tasksError);
    } else {
      console.log('✅ Tasks query successful:', tasksData.length, 'records');
    }
    
    // Test supervisions
    const { data: supervisionsData, error: supervisionsError } = await supabase
      .from('supervisions')
      .select('*')
      .limit(1);
    
    if (supervisionsError) {
      console.error('❌ Supervisions query failed:', supervisionsError);
    } else {
      console.log('✅ Supervisions query successful:', supervisionsData.length, 'records');
    }
    
    // Test additional_tasks
    const { data: additionalTasksData, error: additionalTasksError } = await supabase
      .from('additional_tasks')
      .select('*')
      .limit(1);
    
    if (additionalTasksError) {
      console.error('❌ Additional tasks query failed:', additionalTasksError);
    } else {
      console.log('✅ Additional tasks query successful:', additionalTasksData.length, 'records');
    }
    
    console.log('🎉 USER CONTEXT SETUP SELESAI');
    
  } catch (error) {
    console.error('💥 Error setting up user context:', error);
  }
}

// Jalankan fix
fixSupabaseUserContext();