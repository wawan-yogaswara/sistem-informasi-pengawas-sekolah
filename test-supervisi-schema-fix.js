// TEST SUPERVISI SCHEMA FIX - LANGSUNG
// Jalankan di browser console saat di halaman supervisi

console.log('🧪 TEST SUPERVISI SCHEMA FIX - LANGSUNG');

// Test 1: Cek koneksi Supabase
console.log('🔗 Testing Supabase connection...');
if (typeof supabase !== 'undefined') {
  console.log('✅ Supabase tersedia');
} else {
  console.log('❌ Supabase tidak tersedia');
}

// Test 2: Cek struktur tabel supervisions
async function checkSupervisionSchema() {
  try {
    console.log('🔍 Checking supervisions table schema...');
    
    const { data, error } = await supabase
      .from('supervisions')
      .select('*')
      .limit(1);
    
    if (error) {
      console.error('❌ Schema check error:', error);
      
      // Jika error karena kolom 'school' tidak ada, tampilkan pesan khusus
      if (error.message.includes('school')) {
        console.log('🚨 MASALAH DITEMUKAN: Kolom "school" tidak ada di tabel supervisions');
        console.log('📋 SOLUSI: Jalankan SQL berikut di Supabase SQL Editor:');
        console.log(`
ALTER TABLE supervisions 
ADD COLUMN IF NOT EXISTS school TEXT,
ADD COLUMN IF NOT EXISTS photo1 TEXT,
ADD COLUMN IF NOT EXISTS photo2 TEXT,
ADD COLUMN IF NOT EXISTS teacher_name TEXT,
ADD COLUMN IF NOT EXISTS teacher_nip TEXT,
ADD COLUMN IF NOT EXISTS recommendations TEXT;

-- Buat school_id optional
ALTER TABLE supervisions 
ALTER COLUMN school_id DROP NOT NULL;
        `);
      }
    } else {
      console.log('✅ Schema check berhasil:', data);
    }
  } catch (e) {
    console.error('❌ Schema check failed:', e);
  }
}

// Test 3: Test insert supervisi dengan schema baru
async function testSupervisionInsert() {
  try {
    console.log('📝 Testing supervision insert...');
    
    // Get user data
    const userData = localStorage.getItem('auth_user');
    if (!userData) {
      console.log('❌ No user data found');
      return;
    }
    
    const user = JSON.parse(userData);
    const userId = `user-${user.username}-${Date.now()}`;
    
    console.log('👤 User ID:', userId);
    
    const testData = {
      user_id: userId,
      school: 'Test School - Schema Fix',
      type: 'Akademik',
      date: '2024-12-24',
      findings: 'Test supervisi setelah schema fix - ' + new Date().toLocaleString(),
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
      
      // Analisis error
      if (error.message.includes('school')) {
        console.log('🚨 ERROR: Kolom "school" masih belum ada. Jalankan SQL fix terlebih dahulu.');
      } else if (error.message.includes('user_id')) {
        console.log('🚨 ERROR: Masalah dengan user_id format.');
      } else {
        console.log('🚨 ERROR: Masalah lain:', error.message);
      }
    } else {
      console.log('✅ Insert berhasil:', data);
      
      // Test query kembali
      setTimeout(async () => {
        const { data: allData } = await supabase
          .from('supervisions')
          .select('*')
          .order('created_at', { ascending: false })
          .limit(5);
        
        console.log('📋 Data supervisi terbaru:', allData);
      }, 1000);
    }
  } catch (e) {
    console.error('❌ Insert test failed:', e);
  }
}

// Test 4: Test UI form
function testUIForm() {
  console.log('🖥️ Testing UI form...');
  
  const addButton = document.querySelector('[data-testid="button-add-supervision"]');
  console.log('✅ Tombol Tambah:', addButton ? 'ADA' : 'TIDAK ADA');
  
  if (addButton) {
    console.log('🎯 Klik tombol untuk test form...');
    addButton.click();
    
    setTimeout(() => {
      const schoolSelect = document.querySelector('[data-testid="select-supervision-school"]');
      const findingsInput = document.querySelector('[data-testid="input-supervision-findings"]');
      
      console.log('📝 Form elements:');
      console.log('  - School Select:', schoolSelect ? 'ADA' : 'TIDAK ADA');
      console.log('  - Findings Input:', findingsInput ? 'ADA' : 'TIDAK ADA');
      
      // Tutup dialog
      const cancelButton = document.querySelector('[data-testid="button-cancel-supervision"]');
      if (cancelButton) {
        cancelButton.click();
      }
    }, 1000);
  }
}

// Jalankan semua test
console.log('🚀 Memulai test...');
checkSupervisionSchema();
setTimeout(() => testSupervisionInsert(), 2000);
setTimeout(() => testUIForm(), 4000);

console.log('📋 INSTRUKSI:');
console.log('1. Jika ada error "school column not found", jalankan SQL fix di Supabase');
console.log('2. Refresh halaman setelah menjalankan SQL fix');
console.log('3. Jalankan script ini lagi untuk verifikasi');