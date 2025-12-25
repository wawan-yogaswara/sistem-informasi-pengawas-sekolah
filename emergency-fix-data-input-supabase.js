// EMERGENCY FIX: Data Input Tidak Masuk Supabase
// Jalankan script ini di console browser (F12 → Console)

console.log('🚨 EMERGENCY FIX: Data Input Tidak Masuk Supabase');
console.log('================================================');

// Konfigurasi Supabase
const SUPABASE_URL = 'https://glhaliktsrcvnznbgxqt.supabase.co';
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdsaGFsaWt0c3Jjdm56bmJneHF0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjYzNjYyMjQsImV4cCI6MjA4MTk0MjIyNH0._kaFo2h7rCdouJp2rpb1lmEvlR6gAc0c3AnRjM_PhP4';

// 1. Diagnosis masalah
async function diagnosisEmergency() {
  console.log('\n🔍 DIAGNOSIS EMERGENCY...');
  
  try {
    // Cek user session
    const authUser = localStorage.getItem('auth_user');
    if (!authUser) {
      console.error('❌ Tidak ada user session - silakan login dulu');
      return false;
    }
    
    const user = JSON.parse(authUser);
    console.log(`✅ User: ${user.username} (ID: ${user.id})`);
    
    // Test koneksi Supabase
    const response = await fetch(`${SUPABASE_URL}/rest/v1/users?select=count`, {
      headers: {
        'apikey': SUPABASE_KEY,
        'Authorization': `Bearer ${SUPABASE_KEY}`
      }
    });
    
    if (response.ok) {
      console.log('✅ Koneksi Supabase OK');
    } else {
      console.error('❌ Koneksi Supabase gagal:', response.status);
      return false;
    }
    
    // Cek data di Supabase vs localStorage
    const tasksResponse = await fetch(`${SUPABASE_URL}/rest/v1/tasks?select=*&order=created_at.desc&limit=5`, {
      headers: {
        'apikey': SUPABASE_KEY,
        'Authorization': `Bearer ${SUPABASE_KEY}`
      }
    });
    
    if (tasksResponse.ok) {
      const supabaseTasks = await tasksResponse.json();
      const localTasks = JSON.parse(localStorage.getItem('tasks_data') || '[]');
      
      console.log(`📊 Tasks - Supabase: ${supabaseTasks.length}, localStorage: ${localTasks.length}`);
      
      if (supabaseTasks.length > 0) {
        console.log(`📝 Data terbaru di Supabase: "${supabaseTasks[0].title}"`);
        
        // Cek apakah data migrasi lama
        const migratedTitles = ['Silaturahmi', 'Pisah sambut', 'Apel Pagi'];
        const isOldData = migratedTitles.some(title => 
          supabaseTasks[0].title && supabaseTasks[0].title.includes(title)
        );
        
        if (isOldData) {
          console.log('⚠️ Data terbaru adalah hasil migrasi lama!');
          return 'OLD_DATA';
        }
      }
    }
    
    return true;
  } catch (error) {
    console.error('❌ Error diagnosis:', error);
    return false;
  }
}

// 2. Hapus data migrasi lama
async function hapusDataMigrasiLama() {
  console.log('\n🗑️ MENGHAPUS DATA MIGRASI LAMA...');
  
  try {
    const migratedPatterns = [
      'Silaturahmi dan perkenalan kepala SMKN',
      'Pisah sambut kepala SMKN 14 Garut',
      'Apel Pagi'
    ];
    
    let totalDeleted = 0;
    
    for (const pattern of migratedPatterns) {
      // Hapus dari tasks
      const deleteTasksResponse = await fetch(`${SUPABASE_URL}/rest/v1/tasks?title=ilike.*${pattern}*`, {
        method: 'DELETE',
        headers: {
          'apikey': SUPABASE_KEY,
          'Authorization': `Bearer ${SUPABASE_KEY}`
        }
      });
      
      if (deleteTasksResponse.ok) {
        console.log(`✅ Dihapus dari tasks: ${pattern}`);
        totalDeleted++;
      }
      
      // Hapus dari additional_tasks
      const deleteAdditionalResponse = await fetch(`${SUPABASE_URL}/rest/v1/additional_tasks?name=ilike.*${pattern}*`, {
        method: 'DELETE',
        headers: {
          'apikey': SUPABASE_KEY,
          'Authorization': `Bearer ${SUPABASE_KEY}`
        }
      });
      
      if (deleteAdditionalResponse.ok) {
        console.log(`✅ Dihapus dari additional_tasks: ${pattern}`);
        totalDeleted++;
      }
    }
    
    console.log(`✅ Total data migrasi dihapus: ${totalDeleted}`);
    return true;
  } catch (error) {
    console.error('❌ Error hapus data migrasi:', error);
    return false;
  }
}

// 3. Test save data baru
async function testSaveDataBaru() {
  console.log('\n🧪 TEST SAVE DATA BARU...');
  
  try {
    const authUser = localStorage.getItem('auth_user');
    const user = JSON.parse(authUser);
    
    // Test save task baru
    const testTask = {
      user_id: user.id,
      title: `Test Emergency Fix - ${new Date().toLocaleTimeString()}`,
      category: 'Emergency Test',
      description: 'Test apakah data baru bisa masuk Supabase',
      completed: false,
      date: new Date().toISOString().split('T')[0],
      photo1: null,
      created_at: new Date().toISOString()
    };
    
    console.log('📤 Menyimpan test task ke Supabase...');
    
    const response = await fetch(`${SUPABASE_URL}/rest/v1/tasks`, {
      method: 'POST',
      headers: {
        'apikey': SUPABASE_KEY,
        'Authorization': `Bearer ${SUPABASE_KEY}`,
        'Content-Type': 'application/json',
        'Prefer': 'return=representation'
      },
      body: JSON.stringify(testTask)
    });
    
    if (response.ok) {
      const savedTask = await response.json();
      console.log(`✅ Test save berhasil: "${savedTask[0].title}"`);
      console.log(`📝 Task ID: ${savedTask[0].id}`);
      
      // Update localStorage
      const localTasks = JSON.parse(localStorage.getItem('tasks_data') || '[]');
      localTasks.unshift(savedTask[0]);
      localStorage.setItem('tasks_data', JSON.stringify(localTasks));
      
      return true;
    } else {
      const errorText = await response.text();
      console.error(`❌ Test save gagal: ${response.status} - ${errorText}`);
      return false;
    }
  } catch (error) {
    console.error('❌ Error test save:', error);
    return false;
  }
}

// 4. Fix API configuration
function fixApiConfiguration() {
  console.log('\n🔧 FIXING API CONFIGURATION...');
  
  try {
    // Set flags untuk force direct save ke Supabase
    localStorage.setItem('force_direct_supabase_save', 'true');
    localStorage.setItem('disable_localStorage_fallback', 'true');
    localStorage.setItem('emergency_fix_applied', new Date().toISOString());
    
    console.log('✅ API configuration fixed');
    console.log('💡 Data baru akan langsung disimpan ke Supabase');
    
    return true;
  } catch (error) {
    console.error('❌ Error fix API config:', error);
    return false;
  }
}

// 5. Refresh data dari Supabase
async function refreshDataFromSupabase() {
  console.log('\n🔄 REFRESH DATA DARI SUPABASE...');
  
  try {
    // Refresh tasks
    const tasksResponse = await fetch(`${SUPABASE_URL}/rest/v1/tasks?select=*&order=created_at.desc`, {
      headers: {
        'apikey': SUPABASE_KEY,
        'Authorization': `Bearer ${SUPABASE_KEY}`
      }
    });
    
    if (tasksResponse.ok) {
      const tasks = await tasksResponse.json();
      localStorage.setItem('tasks_data', JSON.stringify(tasks));
      console.log(`✅ Refreshed ${tasks.length} tasks`);
    }
    
    // Refresh additional tasks
    const additionalTasksResponse = await fetch(`${SUPABASE_URL}/rest/v1/additional_tasks?select=*&order=created_at.desc`, {
      headers: {
        'apikey': SUPABASE_KEY,
        'Authorization': `Bearer ${SUPABASE_KEY}`
      }
    });
    
    if (additionalTasksResponse.ok) {
      const additionalTasks = await additionalTasksResponse.json();
      localStorage.setItem('additional_tasks_data', JSON.stringify(additionalTasks));
      console.log(`✅ Refreshed ${additionalTasks.length} additional tasks`);
    }
    
    // Refresh schools
    const schoolsResponse = await fetch(`${SUPABASE_URL}/rest/v1/schools?select=*&order=created_at.desc`, {
      headers: {
        'apikey': SUPABASE_KEY,
        'Authorization': `Bearer ${SUPABASE_KEY}`
      }
    });
    
    if (schoolsResponse.ok) {
      const schools = await schoolsResponse.json();
      localStorage.setItem('schools_data', JSON.stringify(schools));
      console.log(`✅ Refreshed ${schools.length} schools`);
    }
    
    return true;
  } catch (error) {
    console.error('❌ Error refresh data:', error);
    return false;
  }
}

// 6. Override API functions untuk force save ke Supabase
function overrideApiFunctions() {
  console.log('\n⚙️ OVERRIDING API FUNCTIONS...');
  
  try {
    // Override window functions jika ada
    if (window.tasksApi) {
      const originalCreate = window.tasksApi.create;
      window.tasksApi.create = async function(taskData) {
        console.log('🔄 Force saving to Supabase:', taskData.title);
        
        const authUser = localStorage.getItem('auth_user');
        const user = JSON.parse(authUser);
        
        const supabaseTask = {
          user_id: user.id,
          title: taskData.title,
          category: taskData.category || 'Umum',
          description: taskData.description || '',
          completed: taskData.completed || false,
          date: taskData.date,
          photo1: taskData.photo1 || '',
          created_at: new Date().toISOString()
        };
        
        const response = await fetch(`${SUPABASE_URL}/rest/v1/tasks`, {
          method: 'POST',
          headers: {
            'apikey': SUPABASE_KEY,
            'Authorization': `Bearer ${SUPABASE_KEY}`,
            'Content-Type': 'application/json',
            'Prefer': 'return=representation'
          },
          body: JSON.stringify(supabaseTask)
        });
        
        if (response.ok) {
          const savedTask = await response.json();
          console.log('✅ Task saved to Supabase:', savedTask[0].title);
          
          // Update localStorage
          const localTasks = JSON.parse(localStorage.getItem('tasks_data') || '[]');
          localTasks.unshift(savedTask[0]);
          localStorage.setItem('tasks_data', JSON.stringify(localTasks));
          
          return savedTask[0];
        } else {
          throw new Error(`Failed to save to Supabase: ${response.status}`);
        }
      };
      
      console.log('✅ Tasks API overridden');
    }
    
    return true;
  } catch (error) {
    console.error('❌ Error override API:', error);
    return false;
  }
}

// 7. Fungsi utama emergency fix
async function emergencyFixAll() {
  console.log('\n🚨 MEMULAI EMERGENCY FIX LENGKAP...');
  
  try {
    // Step 1: Diagnosis
    const diagnosisResult = await diagnosisEmergency();
    if (!diagnosisResult) {
      console.error('❌ Diagnosis gagal - tidak bisa melanjutkan');
      return false;
    }
    
    // Step 2: Hapus data migrasi lama jika ada
    if (diagnosisResult === 'OLD_DATA') {
      await hapusDataMigrasiLama();
    }
    
    // Step 3: Fix API configuration
    fixApiConfiguration();
    
    // Step 4: Override API functions
    overrideApiFunctions();
    
    // Step 5: Test save data baru
    const testResult = await testSaveDataBaru();
    if (!testResult) {
      console.error('❌ Test save gagal');
      return false;
    }
    
    // Step 6: Refresh data
    await refreshDataFromSupabase();
    
    console.log('\n🎉 EMERGENCY FIX SELESAI!');
    console.log('✅ Data input baru sekarang akan masuk ke Supabase');
    console.log('💡 Coba input data baru untuk memverifikasi');
    console.log('💡 Buka browser lain untuk test sinkronisasi');
    
    return true;
  } catch (error) {
    console.error('❌ Emergency fix error:', error);
    return false;
  }
}

// 8. Fungsi untuk test manual
async function testManualInput() {
  console.log('\n🧪 TEST MANUAL INPUT...');
  
  const taskTitle = prompt('Masukkan judul task untuk test:') || `Manual Test ${Date.now()}`;
  
  try {
    const authUser = localStorage.getItem('auth_user');
    const user = JSON.parse(authUser);
    
    const testTask = {
      user_id: user.id,
      title: taskTitle,
      category: 'Manual Test',
      description: 'Test manual input setelah emergency fix',
      completed: false,
      date: new Date().toISOString().split('T')[0],
      photo1: null,
      created_at: new Date().toISOString()
    };
    
    const response = await fetch(`${SUPABASE_URL}/rest/v1/tasks`, {
      method: 'POST',
      headers: {
        'apikey': SUPABASE_KEY,
        'Authorization': `Bearer ${SUPABASE_KEY}`,
        'Content-Type': 'application/json',
        'Prefer': 'return=representation'
      },
      body: JSON.stringify(testTask)
    });
    
    if (response.ok) {
      const savedTask = await response.json();
      console.log(`✅ Manual test berhasil: "${savedTask[0].title}"`);
      console.log('💡 Sekarang cek di Supabase dashboard - data harus muncul');
      console.log('💡 Buka browser lain dan refresh - data harus sinkron');
      return true;
    } else {
      console.error('❌ Manual test gagal:', response.status);
      return false;
    }
  } catch (error) {
    console.error('❌ Error manual test:', error);
    return false;
  }
}

// Export functions untuk akses manual
window.emergencyFix = {
  runAll: emergencyFixAll,
  diagnosis: diagnosisEmergency,
  cleanOldData: hapusDataMigrasiLama,
  testSave: testSaveDataBaru,
  fixApi: fixApiConfiguration,
  refresh: refreshDataFromSupabase,
  testManual: testManualInput
};

// Auto-run emergency fix
console.log('\n🚀 MENJALANKAN EMERGENCY FIX OTOMATIS...');
emergencyFixAll().then(success => {
  if (success) {
    console.log('\n💡 CARA PENGGUNAAN MANUAL:');
    console.log('- window.emergencyFix.runAll() - Jalankan semua fix');
    console.log('- window.emergencyFix.testManual() - Test input manual');
    console.log('- window.emergencyFix.refresh() - Refresh data dari Supabase');
    console.log('\n🎯 LANGKAH SELANJUTNYA:');
    console.log('1. Coba input data baru di aplikasi');
    console.log('2. Cek console - harus ada log "✅ Task saved to Supabase"');
    console.log('3. Buka Supabase dashboard - data baru harus muncul');
    console.log('4. Buka browser lain - data harus sinkron');
  }
});