// TEST SUPERVISI DENGAN UUID FIX
// Copy paste ke console di halaman supervisi

console.log('🔧 TEST SUPERVISI DENGAN UUID FIX');

// Function untuk generate UUID yang valid
function generateUUID() {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
}

// Test 1: Cek user data
console.log('👤 Step 1: Cek user data...');
const userData = localStorage.getItem('auth_user');
if (userData) {
  const user = JSON.parse(userData);
  console.log('User:', user);
  console.log('Current user.id:', user.id);
  console.log('Is valid UUID?', /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(user.id));
} else {
  console.log('❌ No user data found');
}

// Test 2: Generate valid UUID
console.log('🆔 Step 2: Generate valid UUID...');
const validUUID = generateUUID();
console.log('Generated UUID:', validUUID);
console.log('Is valid?', /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(validUUID));

// Test 3: Test insert dengan UUID yang benar
console.log('📝 Step 3: Test insert dengan UUID yang benar...');
setTimeout(async () => {
  try {
    const testData = {
      user_id: validUUID,
      school: 'Test School - UUID Fixed',
      type: 'Akademik', 
      date: '2024-12-24',
      findings: 'Test supervisi dengan UUID yang benar - ' + new Date().toLocaleString(),
      recommendations: 'Test rekomendasi',
      teacher_name: 'Test Teacher',
      teacher_nip: '123456789',
      photo1: null,
      photo2: null
    };
    
    console.log('📋 Inserting data:', testData);
    
    const { data, error } = await supabase
      .from('supervisions')
      .insert([testData])
      .select()
      .single();
    
    if (error) {
      console.error('❌ Insert error:', error);
      if (error.message.includes('uuid')) {
        console.log('🚨 Masih ada masalah UUID. Coba refresh halaman dan jalankan lagi.');
      }
    } else {
      console.log('✅ SUCCESS! Insert berhasil:', data);
      console.log('🎉 Supervisi berhasil disimpan dengan UUID yang valid!');
      
      // Refresh halaman untuk melihat data baru
      setTimeout(() => {
        console.log('🔄 Refreshing halaman...');
        window.location.reload();
      }, 2000);
    }
  } catch (e) {
    console.error('❌ Test failed:', e);
  }
}, 1000);

console.log('📋 CATATAN:');
console.log('- Jika masih error, refresh halaman dulu');
console.log('- Pastikan sudah login');
console.log('- UUID harus format: xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx');