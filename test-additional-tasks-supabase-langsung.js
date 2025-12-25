// TEST ADDITIONAL TASKS LANGSUNG KE SUPABASE
// Jalankan di console browser untuk test input tugas tambahan

console.log('🧪 TEST ADDITIONAL TASKS SUPABASE - LANGSUNG');

async function testAdditionalTasksInput() {
  try {
    console.log('📝 Testing additional tasks input to Supabase...');
    
    // Get current user
    const userData = localStorage.getItem('auth_user');
    if (!userData) {
      console.error('❌ No user data found');
      return;
    }
    
    const currentUser = JSON.parse(userData);
    console.log('👤 Current user:', currentUser.id);
    
    // Test data
    const testTask = {
      user_id: currentUser.id,
      school_id: '1cd40355-1b07-402d-8309-b243c098cfe9', // SDN 1 Garut
      title: 'Test Kegiatan Tambahan',
      description: 'Ini adalah test kegiatan tambahan untuk memastikan input ke Supabase berfungsi',
      date: new Date().toISOString().split('T')[0],
      status: 'completed',
      photo: null,
      photo2: null
    };
    
    console.log('📋 Test data:', testTask);
    
    // Insert to Supabase
    const { data, error } = await supabase
      .from('additional_tasks')
      .insert([testTask])
      .select()
      .single();
    
    if (error) {
      console.error('❌ Supabase error:', error);
      throw error;
    }
    
    console.log('✅ Additional task inserted successfully:', data);
    
    // Test fetch with join
    const { data: fetchData, error: fetchError } = await supabase
      .from('additional_tasks')
      .select(`
        *,
        schools (
          id,
          name
        )
      `)
      .eq('id', data.id)
      .single();
    
    if (fetchError) {
      console.error('❌ Fetch error:', fetchError);
      throw fetchError;
    }
    
    console.log('✅ Additional task fetched successfully:', fetchData);
    
    return data;
    
  } catch (error) {
    console.error('❌ Test failed:', error);
    throw error;
  }
}

// Jalankan test
testAdditionalTasksInput()
  .then(result => {
    console.log('🎉 TEST BERHASIL!');
    console.log('📊 Result:', result);
  })
  .catch(error => {
    console.error('💥 TEST GAGAL!');
    console.error('📋 Error details:', error);
  });