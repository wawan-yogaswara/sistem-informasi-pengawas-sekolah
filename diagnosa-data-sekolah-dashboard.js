// Script untuk mendiagnosa kenapa data sekolah di dashboard tidak sama dengan halaman sekolah
// Jalankan di browser console (F12 -> Console)

console.log('🔍 Mendiagnosa data sekolah dashboard vs halaman sekolah...');

function diagnosaDataSekolah() {
  console.log('=== DIAGNOSA DATA SEKOLAH ===');
  
  // 1. Cek semua sumber data sekolah
  console.log('📊 Mengecek semua sumber data sekolah...');
  
  const localDatabase = JSON.parse(localStorage.getItem('local-database') || '{}');
  const schoolsData = JSON.parse(localStorage.getItem('schools_data') || '[]');
  const authUser = JSON.parse(localStorage.getItem('auth_user') || '{}');
  const currentUser = JSON.parse(localStorage.getItem('currentUser') || '{}');
  
  console.log('📋 Data dari local-database.schools:', localDatabase.schools?.length || 0);
  if (localDatabase.schools) {
    localDatabase.schools.forEach((school, index) => {
      console.log(`  ${index + 1}. ${school.name} (userId: ${school.userId || school.user_id || 'tidak ada'})`);
    });
  }
  
  console.log('📋 Data dari schools_data:', schoolsData.length);
  schoolsData.forEach((school, index) => {
    console.log(`  ${index + 1}. ${school.name} (userId: ${school.userId || school.user_id || 'tidak ada'})`);
  });
  
  console.log('👤 User yang sedang login:');
  console.log('  auth_user:', authUser.username || 'tidak ada', 'id:', authUser.id || 'tidak ada');
  console.log('  currentUser:', currentUser.username || 'tidak ada', 'id:', currentUser.id || 'tidak ada');
  
  // 2. Cek filtering yang digunakan dashboard
  console.log('\n🔍 Mengecek filtering dashboard...');
  
  const user = authUser.username ? authUser : currentUser;
  console.log('👤 User untuk filtering:', user.username, 'id:', user.id);
  
  // Ambil data sekolah dari sumber yang sama dengan dashboard
  let schools = localDatabase.schools || [];
  if (schools.length === 0) {
    schools = schoolsData;
  }
  
  console.log('📊 Total sekolah sebelum filtering:', schools.length);
  
  // Filter seperti yang dilakukan dashboard
  let userSchools = schools;
  if (user.role !== 'admin' && (user.username || user.id)) {
    userSchools = schools.filter((school) => 
      school.userId === user.id ||
      school.user_id === user.id ||
      school.assignedTo === user.username ||
      school.assignedTo === user.id ||
      school.supervisor === user.username ||
      school.supervisor === user.id ||
      // Special case for wawan user
      (user.username === 'wawan' && (
        school.userId === '1762696525337' ||
        school.user_id === '1762696525337'
      ))
    );
    
    console.log('📊 Sekolah setelah filtering untuk user:', userSchools.length);
    userSchools.forEach((school, index) => {
      console.log(`  ${index + 1}. ${school.name}`);
      console.log(`     userId: ${school.userId || 'tidak ada'}`);
      console.log(`     user_id: ${school.user_id || 'tidak ada'}`);
      console.log(`     assignedTo: ${school.assignedTo || 'tidak ada'}`);
      console.log(`     supervisor: ${school.supervisor || 'tidak ada'}`);
    });
  } else {
    console.log('👑 User admin - menampilkan semua sekolah');
  }
  
  // 3. Cek data yang ditampilkan di halaman sekolah
  console.log('\n🏫 Mengecek data di halaman sekolah...');
  
  // Simulasi cara halaman sekolah mengambil data
  const schoolsPageData = schools; // Halaman sekolah biasanya tidak filter berdasarkan user
  console.log('📊 Data di halaman sekolah (tanpa filter user):', schoolsPageData.length);
  schoolsPageData.forEach((school, index) => {
    console.log(`  ${index + 1}. ${school.name}`);
  });
  
  // 4. Identifikasi masalah
  console.log('\n❗ IDENTIFIKASI MASALAH:');
  
  if (userSchools.length !== schoolsPageData.length) {
    console.log('🔴 MASALAH DITEMUKAN:');
    console.log(`   Dashboard menampilkan: ${userSchools.length} sekolah`);
    console.log(`   Halaman sekolah menampilkan: ${schoolsPageData.length} sekolah`);
    console.log('   Kemungkinan penyebab:');
    console.log('   1. Dashboard memfilter berdasarkan user, halaman sekolah tidak');
    console.log('   2. Data sekolah tidak memiliki userId yang sesuai dengan user login');
    console.log('   3. Field userId/user_id/assignedTo/supervisor tidak terisi dengan benar');
    
    // Cek apakah sekolah memiliki userId yang sesuai
    const schoolsWithoutUserId = schools.filter(school => 
      !school.userId && !school.user_id && !school.assignedTo && !school.supervisor
    );
    
    if (schoolsWithoutUserId.length > 0) {
      console.log(`   4. ${schoolsWithoutUserId.length} sekolah tidak memiliki userId/assignedTo`);
    }
    
  } else {
    console.log('✅ Tidak ada masalah - jumlah sekolah sama');
  }
  
  return {
    totalSchools: schools.length,
    userSchools: userSchools.length,
    schoolsPageData: schoolsPageData.length,
    user: user,
    schools: schools,
    userSchools: userSchools
  };
}

// Jalankan diagnosa
const result = diagnosaDataSekolah();

console.log('\n📊 RINGKASAN:');
console.log(`Total sekolah di database: ${result.totalSchools}`);
console.log(`Sekolah untuk user ${result.user.username}: ${result.userSchools}`);
console.log(`Sekolah di halaman sekolah: ${result.schoolsPageData}`);

// Saran perbaikan
console.log('\n💡 SARAN PERBAIKAN:');
if (result.userSchools < result.totalSchools) {
  console.log('1. Tambahkan userId ke semua data sekolah');
  console.log('2. Atau ubah dashboard untuk tidak memfilter berdasarkan user');
  console.log('3. Atau pastikan user wawan memiliki akses ke semua sekolah');
}

alert('🔍 Diagnosa selesai! Lihat console untuk detail lengkap.');