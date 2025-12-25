// FIX SUPERVISI USER ID - JALANKAN DI CONSOLE
// Copy paste ke console browser di halaman supervisi

console.log('🔧 FIX SUPERVISI USER ID');

// Function untuk generate UUID yang valid
function generateUUID() {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
}

// Test insert dengan UUID yang benar
async function testSupervisiWithValidUUID() {
  try {
    console.log('📝 Testing supervisi dengan UUID yang valid...');
    
    // Get user data
    const userData = localStorage.getItem('auth_user');
    if (!userData) {
      console.log('❌ No user data found');
      return;
    }
    
    const user = JSON.parse(userData);
    const validUserId = generateUUID(); // Generate UUID yang valid
    
    console.log('👤 Valid User ID:', validUserId);
    
    const testData = {
      user_id: validUserId,
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
    
    console.log('📋 Test data:', testData);
    
    const { data, error } = await supabase
      .from('supervisions')
      .insert([testData])
      .select()
      .single();
    
    if (error) {
      console.error('❌ Insert error:', error);
      
      if (error.message.includes('uuid')) {
        console.log('🚨 ERROR: Masih ada masalah dengan format UUID');
      } else {
        console.log('🚨 ERROR: Masalah lain:', error.message);
      }
    } else {
      console.log('✅ Insert berhasil dengan UUID yang valid!', data);
      
      // Refresh data di halaman
      setTimeout(() => {
        window.location.reload();
      }, 2000);
    }
  } catch (e) {
    console.error('❌ Test failed:', e);
  }
}

// Jalankan test
testSupervisiWithValidUUID();

console.log('📋 SOLUSI:');
console.log('1. Gunakan UUID yang valid untuk user_id');
console.log('2. Format: xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx');
console.log('3. Jangan gunakan string seperti "THOM66055337"');