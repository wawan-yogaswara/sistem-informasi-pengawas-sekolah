// FORCE LOGIN - Jalankan di Console Browser (F12)
// Script untuk bypass login jika API bermasalah

console.log('🔐 FORCE LOGIN SCRIPT');

// Pilih user yang ingin digunakan
const users = {
  admin: {
    id: 'a7c7d9e5-9ec8-4416-9aa3-59e8b24b2d0b',
    username: 'admin',
    name: 'Administrator',
    role: 'admin',
    nip: '123456789',
    position: 'Administrator Sistem'
  },
  wawan: {
    id: '421cdb28-f2af-4f1f-aa5f-c59a3d661a2e',
    username: 'wawan',
    name: 'Wawan Setiawan',
    role: 'user',
    nip: '987654321',
    position: 'Pengawas Sekolah'
  },
  test: {
    id: 'd90f01c2-43f8-4d18-9066-e3ad06734888',
    username: 'test',
    name: 'User Test',
    role: 'user',
    nip: '123456789',
    position: 'Pengawas Test'
  }
};

// Fungsi untuk login sebagai user tertentu
function loginAs(userType) {
  const userData = users[userType];
  if (!userData) {
    console.error('❌ User tidak ditemukan. Pilihan: admin, wawan, test');
    return;
  }
  
  // Simpan ke localStorage
  localStorage.setItem('user', JSON.stringify(userData));
  console.log(`✅ Login berhasil sebagai: ${userData.name}`);
  console.log('👤 Data user:', userData);
  
  // Redirect ke dashboard
  console.log('🔄 Redirect ke dashboard...');
  setTimeout(() => {
    window.location.href = '/dashboard';
  }, 1000);
}

// Fungsi untuk cek status login
function cekLogin() {
  const userData = localStorage.getItem('user');
  if (userData) {
    const user = JSON.parse(userData);
    console.log('✅ User sudah login:', user);
  } else {
    console.log('❌ Belum ada user yang login');
  }
}

// Fungsi untuk logout
function logout() {
  localStorage.removeItem('user');
  console.log('🚪 Logout berhasil');
  window.location.href = '/login';
}

// Tampilkan instruksi
console.log('\n🛠️ CARA PENGGUNAAN:');
console.log('1. loginAs("admin") - Login sebagai admin');
console.log('2. loginAs("wawan") - Login sebagai wawan');
console.log('3. loginAs("test") - Login sebagai test user');
console.log('4. cekLogin() - Cek status login saat ini');
console.log('5. logout() - Logout dari aplikasi');

console.log('\n📋 USER YANG TERSEDIA:');
console.log('- admin: Administrator (role: admin)');
console.log('- wawan: Wawan Setiawan (role: user)');
console.log('- test: User Test (role: user)');

console.log('\n💡 CONTOH PENGGUNAAN:');
console.log('loginAs("test"); // Login sebagai user test');

// Auto-check current login status
cekLogin();