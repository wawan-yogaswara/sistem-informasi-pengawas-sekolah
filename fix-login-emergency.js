// 🔧 EMERGENCY LOGIN FIX - Copy paste ke console browser
// Solusi cepat untuk masalah login yang gagal

console.log('🚨 EMERGENCY LOGIN FIX DIMULAI...');

// 1. Bersihkan data lama
localStorage.clear();
console.log('✅ Data lama dibersihkan');

// 2. Data user yang valid
const validUsers = {
  admin: {
    id: 'admin-123',
    username: 'admin',
    full_name: 'Administrator',
    role: 'admin',
    nip: '123456789',
    position: 'Administrator'
  },
  wawan: {
    id: '421cdb28-f2af-4f1f-aa5f-c59a3d661a2e',
    username: 'wawan',
    full_name: 'Wawan Yogaswara',
    role: 'user',
    nip: '196505051990031007',
    position: 'Pengawas Sekolah'
  }
};

// 3. Function login darurat
window.emergencyLogin = function(username, password) {
  console.log('🔐 Mencoba emergency login:', username);
  
  // Validasi kredensial
  const validCredentials = {
    'admin': 'admin123',
    'wawan': 'wawan123'
  };
  
  if (validCredentials[username] === password) {
    const user = validUsers[username];
    
    // Set session
    localStorage.setItem('auth_user', JSON.stringify(user));
    localStorage.setItem('auth_token', username + '-token-' + Date.now());
    
    console.log('✅ Login berhasil!', user.full_name);
    
    // Redirect ke dashboard
    setTimeout(() => {
      window.location.href = '/';
    }, 500);
    
    return true;
  } else {
    console.log('❌ Username atau password salah');
    alert('Username atau password salah!');
    return false;
  }
};

// 4. Auto-login admin (langsung masuk)
window.autoLoginAdmin = function() {
  console.log('🚀 Auto-login sebagai admin...');
  emergencyLogin('admin', 'admin123');
};

// 5. Auto-login wawan
window.autoLoginWawan = function() {
  console.log('🚀 Auto-login sebagai wawan...');
  emergencyLogin('wawan', 'wawan123');
};

// 6. Fix form login yang ada
setTimeout(() => {
  const usernameInput = document.querySelector('#login-username') || 
                       document.querySelector('input[type="text"]') ||
                       document.querySelector('input[placeholder*="username"]');
  
  const passwordInput = document.querySelector('#login-password') ||
                       document.querySelector('input[type="password"]');
  
  if (usernameInput && passwordInput) {
    // Set nilai default
    usernameInput.value = 'admin';
    passwordInput.value = 'admin123';
    
    // Trigger React events
    ['input', 'change'].forEach(eventType => {
      usernameInput.dispatchEvent(new Event(eventType, { bubbles: true }));
      passwordInput.dispatchEvent(new Event(eventType, { bubbles: true }));
    });
    
    console.log('✅ Form auto-filled: admin/admin123');
    
    // Override form submit
    const form = usernameInput.closest('form');
    if (form) {
      form.addEventListener('submit', function(e) {
        e.preventDefault();
        const username = usernameInput.value;
        const password = passwordInput.value;
        emergencyLogin(username, password);
      });
      console.log('✅ Form submit di-override');
    }
  }
}, 1000);

// 7. Tampilkan instruksi
console.log('');
console.log('🎯 CARA PAKAI:');
console.log('1. autoLoginAdmin() - Login langsung sebagai admin');
console.log('2. autoLoginWawan() - Login langsung sebagai wawan');
console.log('3. emergencyLogin("admin", "admin123") - Login manual admin');
console.log('4. emergencyLogin("wawan", "wawan123") - Login manual wawan');
console.log('5. Atau klik tombol login (form sudah auto-fill)');
console.log('');
console.log('✨ SHORTCUT: Ketik "autoLoginAdmin()" untuk masuk langsung!');

// 8. Pesan sukses
console.log('🎉 Emergency login fix siap digunakan!');