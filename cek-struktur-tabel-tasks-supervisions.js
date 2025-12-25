// CEK STRUKTUR TABEL TASKS DAN SUPERVISIONS DI SUPABASE
// Jalankan di console browser

console.log('🔍 CEK STRUKTUR TABEL SUPABASE');

async function cekStrukturTabel() {
  try {
    console.log('📊 Checking table structures...');
    
    // Test koneksi Supabase
    console.log('🔗 Supabase client:', supabase);
    
    // Cek tabel tasks
    console.log('\n📋 TABEL TASKS:');
    const { data: tasksData, error: tasksError } = await supabase
      .from('tasks')
      .select('*')
      .limit(1);
    
    if (tasksError) {
      console.error('❌ Error accessing tasks table:', tasksError);
    } else {
      console.log('✅ Tasks table accessible');
      console.log('📄 Sample data structure:', tasksData[0] || 'No data');
    }
    
    // Cek tabel supervisions
    console.log('\n🏫 TABEL SUPERVISIONS:');
    const { data: supervisionsData, error: supervisionsError } = await supabase
      .from('supervisions')
      .select('*')
      .limit(1);
    
    if (supervisionsError) {
      console.error('❌ Error accessing supervisions table:', supervisionsError);
    } else {
      console.log('✅ Supervisions table accessible');
      console.log('📄 Sample data structure:', supervisionsData[0] || 'No data');
    }
    
    // Cek user authentication
    console.log('\n👤 USER AUTHENTICATION:');
    const userData = localStorage.getItem('auth_user');
    if (userData) {
      const user = JSON.parse(userData);
      console.log('✅ User authenticated:', user.id);
      console.log('📋 User data:', user);
    } else {
      console.error('❌ No user authentication found');
    }
    
    // Test insert permission
    console.log('\n🔐 TEST INSERT PERMISSION:');
    
    // Test tasks insert
    try {
      const testTask = {
        user_id: userData ? JSON.parse(userData).id : 'test-user',
        title: 'Test Permission',
        description: 'Testing insert permission',
        completed: false,
        date: new Date().toISOString().split('T')[0]
      };
      
      const { data: insertTest, error: insertError } = await supabase
        .from('tasks')
        .insert([testTask])
        .select()
        .single();
      
      if (insertError) {
        console.error('❌ Tasks insert permission denied:', insertError);
      } else {
        console.log('✅ Tasks insert permission OK');
        
        // Clean up test data
        await supabase.from('tasks').delete().eq('id', insertTest.id);
        console.log('🧹 Test data cleaned up');
      }
    } catch (error) {
      console.error('❌ Tasks insert test failed:', error);
    }
    
    // Test supervisions insert
    try {
      const testSupervision = {
        user_id: userData ? JSON.parse(userData).id : 'test-user',
        school: 'Test School',
        type: 'Akademik',
        date: new Date().toISOString().split('T')[0],
        findings: 'Test findings'
      };
      
      const { data: insertTest, error: insertError } = await supabase
        .from('supervisions')
        .insert([testSupervision])
        .select()
        .single();
      
      if (insertError) {
        console.error('❌ Supervisions insert permission denied:', insertError);
      } else {
        console.log('✅ Supervisions insert permission OK');
        
        // Clean up test data
        await supabase.from('supervisions').delete().eq('id', insertTest.id);
        console.log('🧹 Test data cleaned up');
      }
    } catch (error) {
      console.error('❌ Supervisions insert test failed:', error);
    }
    
    console.log('\n🎉 STRUKTUR TABEL CHECK SELESAI');
    
  } catch (error) {
    console.error('💥 Error checking table structure:', error);
  }
}

// Jalankan check
cekStrukturTabel();