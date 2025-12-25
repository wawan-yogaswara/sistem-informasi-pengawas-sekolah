// TEST SUPERVISI LANGSUNG KE SUPABASE
// Jalankan di console browser untuk test input supervisi

console.log('🧪 TEST SUPERVISI SUPABASE - LANGSUNG');

async function testSupervisiInput() {
  try {
    console.log('📝 Testing supervision input to Supabase...');
    
    // Get current user
    const userData = localStorage.getItem('auth_user');
    if (!userData) {
      console.error('❌ No user data found');
      return;
    }
    
    const currentUser = JSON.parse(userData);
    console.log('👤 Current user:', currentUser.id);
    
    // Test data
    const testSupervision = {
      user_id: currentUser.id,
      school: 'SMKN 4 Garut',
      type: 'Akademik',
      date: new Date().toISOString().split('T')[0],
      teacher_name: 'Test Guru',
      teacher_nip: '123456789',
      findings: 'Test temuan supervisi',
      recommendations: 'Test rekomendasi',
      photo1: null,
      photo2: null
    };
    
    console.log('📋 Test data:', testSupervision);
    
    // Insert to Supabase
    const { data, error } = await supabase
      .from('supervisions')
      .insert([testSupervision])
      .select()
      .single();
    
    if (error) {
      console.error('❌ Supabase error:', error);
      throw error;
    }
    
    console.log('✅ Supervision inserted successfully:', data);
    
    // Test fetch
    const { data: fetchData, error: fetchError } = await supabase
      .from('supervisions')
      .select('*')
      .eq('id', data.id)
      .single();
    
    if (fetchError) {
      console.error('❌ Fetch error:', fetchError);
      throw fetchError;
    }
    
    console.log('✅ Supervision fetched successfully:', fetchData);
    
    return data;
    
  } catch (error) {
    console.error('❌ Test failed:', error);
    throw error;
  }
}

// Jalankan test
testSupervisiInput()
  .then(result => {
    console.log('🎉 TEST BERHASIL!');
    console.log('📊 Result:', result);
  })
  .catch(error => {
    console.error('💥 TEST GAGAL!');
    console.error('📋 Error details:', error);
  });