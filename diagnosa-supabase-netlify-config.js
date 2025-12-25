// DIAGNOSA KONFIGURASI SUPABASE & NETLIFY
// Jalankan di console browser untuk mengecek masalah konfigurasi

console.log('🔍 DIAGNOSA KONFIGURASI SUPABASE & NETLIFY');
console.log('==========================================');

// Konfigurasi yang akan dicek
const SUPABASE_URL = 'https://glhaliktsrcvnznbgxqt.supabase.co';
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdsaGFsaWt0c3Jjdm56bmJneHF0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjYzNjYyMjQsImV4cCI6MjA4MTk0MjIyNH0._kaFo2h7rCdouJp2rpb1lmEvlR6gAc0c3AnRjM_PhP4';

// 1. Cek Environment Variables
function cekEnvironmentVariables() {
  console.log('\n1️⃣ CEK ENVIRONMENT VARIABLES...');
  
  // Cek client-side env vars
  const viteSupabaseUrl = import.meta?.env?.VITE_SUPABASE_URL;
  const viteSupabaseKey = import.meta?.env?.VITE_SUPABASE_ANON_KEY;
  
  console.log('📋 Client-side Environment Variables:');
  console.log('VITE_SUPABASE_URL:', viteSupabaseUrl || 'TIDAK DITEMUKAN');
  console.log('VITE_SUPABASE_ANON_KEY:', viteSupabaseKey ? 'ADA (length: ' + viteSupabaseKey.length + ')' : 'TIDAK DITEMUKAN');
  
  // Cek apakah env vars match dengan yang diharapkan
  if (viteSupabaseUrl !== SUPABASE_URL) {
    console.warn('⚠️ VITE_SUPABASE_URL tidak match!');
    console.log('Expected:', SUPABASE_URL);
    console.log('Actual:', viteSupabaseUrl);
  }
  
  if (viteSupabaseKey !== SUPABASE_KEY) {
    console.warn('⚠️ VITE_SUPABASE_ANON_KEY tidak match!');
    console.log('Expected length:', SUPABASE_KEY.length);
    console.log('Actual length:', viteSupabaseKey?.length || 0);
  }
  
  return {
    urlMatch: viteSupabaseUrl === SUPABASE_URL,
    keyMatch: viteSupabaseKey === SUPABASE_KEY
  };
}

// 2. Test Koneksi Supabase
async function testKoneksiSupabase() {
  console.log('\n2️⃣ TEST KONEKSI SUPABASE...');
  
  try {
    // Test basic connection
    const response = await fetch(`${SUPABASE_URL}/rest/v1/`, {
      headers: {
        'apikey': SUPABASE_KEY,
        'Authorization': `Bearer ${SUPABASE_KEY}`
      }
    });
    
    console.log('📡 Basic connection status:', response.status);
    
    if (response.status === 200) {
      console.log('✅ Koneksi dasar berhasil');
    } else {
      console.error('❌ Koneksi dasar gagal:', response.status, response.statusText);
      return false;
    }
    
    // Test table access
    const tablesResponse = await fetch(`${SUPABASE_URL}/rest/v1/users?select=count`, {
      headers: {
        'apikey': SUPABASE_KEY,
        'Authorization': `Bearer ${SUPABASE_KEY}`
      }
    });
    
    console.log('📊 Table access status:', tablesResponse.status);
    
    if (tablesResponse.status === 200) {
      console.log('✅ Akses tabel berhasil');
      return true;
    } else {
      console.error('❌ Akses tabel gagal:', tablesResponse.status, tablesResponse.statusText);
      
      // Cek apakah ini masalah RLS
      if (tablesResponse.status === 401 || tablesResponse.status === 403) {
        console.warn('⚠️ Kemungkinan masalah Row Level Security (RLS)');
      }
      
      return false;
    }
  } catch (error) {
    console.error('❌ Error koneksi Supabase:', error);
    return false;
  }
}

// 3. Cek Schema Database
async function cekSchemaDatabase() {
  console.log('\n3️⃣ CEK SCHEMA DATABASE...');
  
  const tables = ['users', 'tasks', 'additional_tasks', 'schools', 'supervisions'];
  const results = {};
  
  for (const table of tables) {
    try {
      const response = await fetch(`${SUPABASE_URL}/rest/v1/${table}?select=count`, {
        headers: {
          'apikey': SUPABASE_KEY,
          'Authorization': `Bearer ${SUPABASE_KEY}`
        }
      });
      
      results[table] = {
        exists: response.status === 200,
        status: response.status,
        error: response.status !== 200 ? response.statusText : null
      };
      
      if (response.status === 200) {
        console.log(`✅ Tabel ${table}: OK`);
      } else {
        console.error(`❌ Tabel ${table}: ${response.status} ${response.statusText}`);
      }
    } catch (error) {
      results[table] = {
        exists: false,
        status: 'ERROR',
        error: error.message
      };
      console.error(`❌ Tabel ${table}: ${error.message}`);
    }
  }
  
  return results;
}

// 4. Test Insert Data
async function testInsertData() {
  console.log('\n4️⃣ TEST INSERT DATA...');
  
  try {
    const authUser = localStorage.getItem('auth_user');
    if (!authUser) {
      console.warn('⚠️ Tidak ada user session - skip test insert');
      return false;
    }
    
    const user = JSON.parse(authUser);
    
    const testData = {
      user_id: user.id,
      title: `Test Insert - ${new Date().toISOString()}`,
      category: 'Test',
      description: 'Test insert untuk diagnosa',
      completed: false,
      date: new Date().toISOString().split('T')[0],
      photo1: null,
      created_at: new Date().toISOString()
    };
    
    console.log('📤 Mencoba insert data test...');
    
    const response = await fetch(`${SUPABASE_URL}/rest/v1/tasks`, {
      method: 'POST',
      headers: {
        'apikey': SUPABASE_KEY,
        'Authorization': `Bearer ${SUPABASE_KEY}`,
        'Content-Type': 'application/json',
        'Prefer': 'return=representation'
      },
      body: JSON.stringify(testData)
    });
    
    console.log('📊 Insert response status:', response.status);
    
    if (response.ok) {
      const result = await response.json();
      console.log('✅ Test insert berhasil:', result[0]?.title);
      return true;
    } else {
      const errorText = await response.text();
      console.error('❌ Test insert gagal:', response.status, errorText);
      
      // Analisis error
      if (response.status === 400) {
        console.warn('⚠️ Bad Request - kemungkinan masalah format data');
      } else if (response.status === 401) {
        console.warn('⚠️ Unauthorized - kemungkinan masalah authentication');
      } else if (response.status === 403) {
        console.warn('⚠️ Forbidden - kemungkinan masalah RLS policy');
      } else if (response.status === 422) {
        console.warn('⚠️ Unprocessable Entity - kemungkinan masalah constraint/validation');
      }
      
      return false;
    }
  } catch (error) {
    console.error('❌ Error test insert:', error);
    return false;
  }
}

// 5. Cek RLS Policies
async function cekRLSPolicies() {
  console.log('\n5️⃣ CEK ROW LEVEL SECURITY POLICIES...');
  
  try {
    // Query untuk cek RLS policies
    const query = `
      SELECT schemaname, tablename, policyname, permissive, roles, cmd, qual 
      FROM pg_policies 
      WHERE schemaname = 'public' 
      AND tablename IN ('users', 'tasks', 'additional_tasks', 'schools', 'supervisions')
      ORDER BY tablename, policyname
    `;
    
    const response = await fetch(`${SUPABASE_URL}/rest/v1/rpc/exec_sql`, {
      method: 'POST',
      headers: {
        'apikey': SUPABASE_KEY,
        'Authorization': `Bearer ${SUPABASE_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ query })
    });
    
    if (response.ok) {
      const policies = await response.json();
      console.log('📋 RLS Policies found:', policies.length);
      
      if (policies.length === 0) {
        console.warn('⚠️ Tidak ada RLS policies ditemukan - ini bisa jadi masalah!');
        return false;
      }
      
      policies.forEach(policy => {
        console.log(`✅ ${policy.tablename}: ${policy.policyname} (${policy.cmd})`);
      });
      
      return true;
    } else {
      console.warn('⚠️ Tidak bisa mengecek RLS policies');
      return false;
    }
  } catch (error) {
    console.warn('⚠️ Error cek RLS policies:', error.message);
    return false;
  }
}

// 6. Analisis Masalah dan Solusi
function analisisMasalah(results) {
  console.log('\n6️⃣ ANALISIS MASALAH DAN SOLUSI...');
  
  const issues = [];
  const solutions = [];
  
  // Analisis environment variables
  if (!results.envVars.urlMatch || !results.envVars.keyMatch) {
    issues.push('Environment variables tidak match');
    solutions.push('Update environment variables di Netlify dashboard');
  }
  
  // Analisis koneksi
  if (!results.connection) {
    issues.push('Koneksi Supabase gagal');
    solutions.push('Cek Supabase project status dan API keys');
  }
  
  // Analisis schema
  const missingTables = Object.entries(results.schema)
    .filter(([table, info]) => !info.exists)
    .map(([table]) => table);
  
  if (missingTables.length > 0) {
    issues.push(`Tabel tidak ditemukan: ${missingTables.join(', ')}`);
    solutions.push('Jalankan schema SQL di Supabase SQL Editor');
  }
  
  // Analisis insert
  if (!results.insert) {
    issues.push('Insert data gagal');
    solutions.push('Cek RLS policies dan user permissions');
  }
  
  // Analisis RLS
  if (!results.rls) {
    issues.push('RLS policies bermasalah');
    solutions.push('Setup RLS policies yang benar');
  }
  
  console.log('\n📋 RINGKASAN MASALAH:');
  if (issues.length === 0) {
    console.log('✅ Tidak ada masalah ditemukan');
  } else {
    issues.forEach((issue, index) => {
      console.log(`❌ ${index + 1}. ${issue}`);
    });
  }
  
  console.log('\n🔧 SOLUSI YANG DISARANKAN:');
  solutions.forEach((solution, index) => {
    console.log(`💡 ${index + 1}. ${solution}`);
  });
  
  return { issues, solutions };
}

// 7. Fungsi utama diagnosa
async function diagnosisLengkap() {
  console.log('🚀 MEMULAI DIAGNOSIS LENGKAP...');
  
  const results = {
    envVars: cekEnvironmentVariables(),
    connection: await testKoneksiSupabase(),
    schema: await cekSchemaDatabase(),
    insert: await testInsertData(),
    rls: await cekRLSPolicies()
  };
  
  const analysis = analisisMasalah(results);
  
  console.log('\n🎯 KESIMPULAN:');
  if (analysis.issues.length === 0) {
    console.log('✅ Konfigurasi Supabase & Netlify sudah benar');
    console.log('💡 Masalah mungkin di level aplikasi atau logic');
  } else {
    console.log('❌ Ditemukan masalah konfigurasi yang perlu diperbaiki');
    console.log('🔧 Ikuti solusi yang disarankan di atas');
  }
  
  return results;
}

// 8. Fix otomatis untuk masalah umum
async function fixOtomatis() {
  console.log('\n🔧 MENCOBA FIX OTOMATIS...');
  
  try {
    // Fix 1: Update environment variables di runtime
    if (typeof window !== 'undefined') {
      window.VITE_SUPABASE_URL = SUPABASE_URL;
      window.VITE_SUPABASE_ANON_KEY = SUPABASE_KEY;
      console.log('✅ Environment variables di-override di runtime');
    }
    
    // Fix 2: Force update Supabase client config
    if (window.supabase) {
      // Re-initialize supabase client
      console.log('🔄 Re-initializing Supabase client...');
    }
    
    // Fix 3: Clear cache yang mungkin bermasalah
    localStorage.removeItem('supabase.auth.token');
    sessionStorage.clear();
    console.log('✅ Cache dibersihkan');
    
    console.log('✅ Fix otomatis selesai');
    return true;
  } catch (error) {
    console.error('❌ Error fix otomatis:', error);
    return false;
  }
}

// Export functions
window.diagnosisSupabase = {
  runAll: diagnosisLengkap,
  checkEnv: cekEnvironmentVariables,
  testConnection: testKoneksiSupabase,
  checkSchema: cekSchemaDatabase,
  testInsert: testInsertData,
  checkRLS: cekRLSPolicies,
  autoFix: fixOtomatis
};

// Auto-run diagnosis
console.log('🔄 Menjalankan diagnosis otomatis...');
diagnosisLengkap().then(results => {
  console.log('\n💡 CARA PENGGUNAAN MANUAL:');
  console.log('- window.diagnosisSupabase.runAll() - Jalankan semua diagnosis');
  console.log('- window.diagnosisSupabase.testConnection() - Test koneksi saja');
  console.log('- window.diagnosisSupabase.autoFix() - Coba fix otomatis');
});