// TEST TUGAS HARIAN LANGSUNG - Jalankan di Console Browser (F12)
// Script untuk debug masalah tugas harian tidak muncul

console.log('🔍 MULAI TEST TUGAS HARIAN...');

// 1. Cek konfigurasi Supabase
console.log('📋 CEK KONFIGURASI SUPABASE:');
try {
  const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
  const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
  
  console.log('✅ SUPABASE_URL:', supabaseUrl ? 'ADA' : '❌ TIDAK ADA');
  console.log('✅ SUPABASE_KEY:', supabaseKey ? 'ADA' : '❌ TIDAK ADA');
  
  if (!supabaseUrl || !supabaseKey) {
    console.error('❌ KONFIGURASI SUPABASE TIDAK LENGKAP!');
    console.log('💡 Cek file .env dan pastikan ada VITE_SUPABASE_URL dan VITE_SUPABASE_ANON_KEY');
  }
} catch (error) {
  console.error('❌ Error cek konfigurasi:', error);
}

// 2. Test koneksi ke API tasks
console.log('\n🌐 TEST KONEKSI API TASKS:');
async function testTasksAPI() {
  try {
    const response = await fetch('/api/tasks', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      }
    });
    
    console.log('📡 Response status:', response.status);
    
    if (response.ok) {
      const data = await response.json();
      console.log('✅ API TASKS BERHASIL!');
      console.log('📊 Jumlah data:', data.length || 0);
      console.log('📋 Sample data:', data.slice(0, 2));
    } else {
      console.error('❌ API TASKS GAGAL!');
      console.log('📄 Response:', await response.text());
    }
  } catch (error) {
    console.error('❌ Error koneksi API:', error);
    console.log('💡 Pastikan server berjalan di port yang benar');
  }
}

// 3. Test localStorage
console.log('\n💾 CEK LOCALSTORAGE:');
try {
  const userData = localStorage.getItem('user');
  const tasksData = localStorage.getItem('tasks');
  
  console.log('👤 User data:', userData ? 'ADA' : 'TIDAK ADA');
  console.log('📝 Tasks data:', tasksData ? 'ADA' : 'TIDAK ADA');
  
  if (userData) {
    const user = JSON.parse(userData);
    console.log('👤 User ID:', user.id);
    console.log('👤 Username:', user.username);
  }
  
  if (tasksData) {
    const tasks = JSON.parse(tasksData);
    console.log('📝 Jumlah tasks di localStorage:', tasks.length);
  }
} catch (error) {
  console.error('❌ Error cek localStorage:', error);
}

// 4. Test input data baru
console.log('\n➕ TEST INPUT DATA BARU:');
async function testInputTask() {
  try {
    const userData = localStorage.getItem('user');
    if (!userData) {
      console.error('❌ User tidak login!');
      return;
    }
    
    const user = JSON.parse(userData);
    const testTask = {
      user_id: user.id,
      title: 'Test Task ' + new Date().toLocaleTimeString(),
      description: 'Test deskripsi tugas',
      date: new Date().toISOString().split('T')[0],
      activity_type: 'Perencanaan'
    };
    
    console.log('📤 Mengirim data test:', testTask);
    
    const response = await fetch('/api/tasks', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(testTask)
    });
    
    if (response.ok) {
      const result = await response.json();
      console.log('✅ INPUT BERHASIL!');
      console.log('📋 Data tersimpan:', result);
    } else {
      console.error('❌ INPUT GAGAL!');
      console.log('📄 Error response:', await response.text());
    }
  } catch (error) {
    console.error('❌ Error input data:', error);
  }
}

// 5. Jalankan semua test
async function runAllTests() {
  await testTasksAPI();
  await new Promise(resolve => setTimeout(resolve, 1000)); // Delay 1 detik
  await testInputTask();
  
  console.log('\n🎯 TEST SELESAI!');
  console.log('💡 Jika ada error, screenshot dan kirim ke developer');
}

// Jalankan test otomatis
runAllTests();

// Fungsi helper untuk manual test
window.testTugasHarian = {
  testAPI: testTasksAPI,
  testInput: testInputTask,
  clearLocalStorage: () => {
    localStorage.removeItem('tasks');
    console.log('🗑️ LocalStorage tasks dibersihkan');
  },
  showUserData: () => {
    const userData = localStorage.getItem('user');
    console.log('👤 User data:', userData ? JSON.parse(userData) : 'Tidak ada');
  }
};

console.log('\n🛠️ FUNGSI HELPER TERSEDIA:');
console.log('- testTugasHarian.testAPI() - Test koneksi API');
console.log('- testTugasHarian.testInput() - Test input data');
console.log('- testTugasHarian.clearLocalStorage() - Bersihkan localStorage');
console.log('- testTugasHarian.showUserData() - Lihat data user');