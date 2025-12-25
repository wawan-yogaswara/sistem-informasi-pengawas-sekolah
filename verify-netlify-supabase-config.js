// Script untuk verifikasi konfigurasi Netlify dan Supabase
// Pastikan environment variables di Netlify sesuai dengan local

console.log('🔍 VERIFIKASI KONFIGURASI NETLIFY & SUPABASE');
console.log('='.repeat(50));

// Environment variables yang harus ada di Netlify
const requiredEnvVars = {
  'DATABASE_URL': 'postgresql://postgres.glhaliktsrcvnznbgxqt:schoolguard2024@aws-0-ap-southeast-1.pooler.supabase.com:6543/postgres',
  'JWT_SECRET': 'schoolguard-secret-key-2024',
  'NODE_ENV': 'production',
  'SUPABASE_URL': 'https://glhaliktsrcvnznbgxqt.supabase.co',
  'SUPABASE_ANON_KEY': 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdsaGFsaWt0c3Jjdm56bmJneHF0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjYzNjYyMjQsImV4cCI6MjA4MTk0MjIyNH0._kaFo2h7rCdouJp2rpb1lmEvlR6gAc0c3AnRjM_PhP4',
  'USE_LOCAL_STORAGE': 'false'
};

console.log('📋 ENVIRONMENT VARIABLES YANG HARUS ADA DI NETLIFY:');
console.log('-'.repeat(50));

Object.entries(requiredEnvVars).forEach(([key, value]) => {
  console.log(`${key}:`);
  if (key.includes('KEY') || key.includes('SECRET') || key.includes('URL')) {
    console.log(`  ${value.substring(0, 20)}...`);
  } else {
    console.log(`  ${value}`);
  }
  console.log('');
});

console.log('🚀 LANGKAH-LANGKAH VERIFIKASI:');
console.log('-'.repeat(50));
console.log('1. Buka Netlify Dashboard: https://app.netlify.com');
console.log('2. Pilih project: sistem-informasi-pengawas-kcdo');
console.log('3. Masuk ke Site settings > Environment variables');
console.log('4. Pastikan semua variable di atas sudah ada');
console.log('5. Jika belum ada, tambahkan satu per satu');
console.log('');

console.log('⚠️  PENTING:');
console.log('-'.repeat(50));
console.log('- NODE_ENV harus "production" di Netlify (bukan "development")');
console.log('- USE_LOCAL_STORAGE harus "false"');
console.log('- Semua URL dan KEY harus sama persis dengan local');
console.log('');

// Test Supabase connection
async function testSupabaseConnection() {
  console.log('🧪 TESTING SUPABASE CONNECTION...');
  console.log('-'.repeat(50));
  
  try {
    const supabaseUrl = requiredEnvVars.SUPABASE_URL;
    const supabaseKey = requiredEnvVars.SUPABASE_ANON_KEY;
    
    // Test basic connection
    const response = await fetch(`${supabaseUrl}/rest/v1/`, {
      headers: {
        'apikey': supabaseKey,
        'Authorization': `Bearer ${supabaseKey}`
      }
    });
    
    if (response.ok) {
      console.log('✅ Supabase connection: SUCCESS');
    } else {
      console.log('❌ Supabase connection: FAILED');
      console.log('Response status:', response.status);
    }
    
    // Test specific table
    const schoolsResponse = await fetch(`${supabaseUrl}/rest/v1/schools?select=*&limit=1`, {
      headers: {
        'apikey': supabaseKey,
        'Authorization': `Bearer ${supabaseKey}`
      }
    });
    
    if (schoolsResponse.ok) {
      const schools = await schoolsResponse.json();
      console.log('✅ Schools table access: SUCCESS');
      console.log(`📊 Found ${schools.length} school(s)`);
    } else {
      console.log('❌ Schools table access: FAILED');
      console.log('Response status:', schoolsResponse.status);
    }
    
  } catch (error) {
    console.log('❌ Connection test failed:', error.message);
  }
}

// Run the test
testSupabaseConnection();

console.log('');
console.log('🔧 JIKA ADA MASALAH:');
console.log('-'.repeat(50));
console.log('1. Periksa kembali semua environment variables di Netlify');
console.log('2. Pastikan tidak ada typo dalam URL atau KEY');
console.log('3. Deploy ulang setelah mengubah environment variables');
console.log('4. Test kembali dengan script ini');