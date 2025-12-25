// TEST TUGAS LANGSUNG KE SUPABASE
// Jalankan di console browser untuk test input tugas

console.log('🧪 TEST TUGAS SUPABASE - LANGSUNG');

async function testTugasInput() {
  try {
    console.log('📝 Testing task input to Supabase...');
    
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
      title: 'Test Tugas Harian',
      description: 'Ini adalah test tugas untuk memastikan input ke Supabase berfungsi',
      completed: false,
      date: new Date().toISOString().split('T')[0],
      photo: null
    };
    
    console.log('📋 Test data:', testTask);
    
    // Insert to Supabase
    const { data, error } = await supabase
      .from('tasks')
      .insert([testTask])
      .select()
      .single();
    
    if (error) {
      console.error('❌ Supabase error:', error);
      throw error;
    }
    
    console.log('✅ Task inserted successfully:', data);
    
    // Test fetch
    const { data: fetchData, error: fetchError } = await supabase
      .from('tasks')
      .select('*')
      .eq('id', data.id)
      .single();
    
    if (fetchError) {
      console.error('❌ Fetch error:', fetchError);
      throw fetchError;
    }
    
    console.log('✅ Task fetched successfully:', fetchData);
    
    return data;
    
  } catch (error) {
    console.error('❌ Test failed:', error);
    throw error;
  }
}

// Jalankan test
testTugasInput()
  .then(result => {
    console.log('🎉 TEST BERHASIL!');
    console.log('📊 Result:', result);
  })
  .catch(error => {
    console.error('💥 TEST GAGAL!');
    console.error('📋 Error details:', error);
  });