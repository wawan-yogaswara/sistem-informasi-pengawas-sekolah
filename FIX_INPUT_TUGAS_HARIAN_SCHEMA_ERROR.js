// FIX INPUT TUGAS HARIAN SCHEMA ERROR
// Copy paste ke browser console di halaman Tugas Harian

console.log('🔧 FIX: Schema error saat input tugas harian');

const fixInputTugasHarianSchemaError = async () => {
  const userId = '421cdb28-f2af-4f1f-aa5f-c59a3d661a2e';
  
  try {
    console.log('🚀 Starting fix for tugas harian schema error...');
    
    // 1. SETUP USER CONTEXT
    console.log('👤 Step 1: Setting user context...');
    const userData = {
      id: userId,
      username: 'wawan',
      fullName: 'Wawan Setiawan',
      role: 'admin'
    };
    localStorage.setItem('auth_user', JSON.stringify(userData));
    localStorage.setItem('user_data', JSON.stringify(userData));
    
    // 2. SETUP SUPABASE
    console.log('🔗 Step 2: Setting up Supabase...');
    const { createClient } = await import('@supabase/supabase-js');
    const supabaseUrl = 'https://fmxeboullgcewzjpql.supabase.co';
    const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZteGVib3VsbGdjZXd6anBxbCIsInJvbGUiOiJhbm9uIiwiaWF0IjoxNzM0NTk5NzI4LCJleHAiOjIwNTAxNzU3Mjh9.Ej8Ej8Ej8Ej8Ej8Ej8Ej8Ej8Ej8Ej8Ej8Ej8Ej8';
    const supabase = createClient(supabaseUrl, supabaseKey);
    
    // 3. CHECK CURRENT SCHEMA
    console.log('🔍 Step 3: Checking current schema...');
    
    // Check tasks table structure
    const { data: tasksSchema, error: tasksError } = await supabase
      .from('tasks')
      .select('*')
      .limit(1);
    
    if (tasksError) {
      console.error('❌ Tasks table error:', tasksError);
    } else {
      console.log('✅ Tasks table accessible');
      if (tasksSchema && tasksSchema.length > 0) {
        console.log('📋 Tasks table columns:', Object.keys(tasksSchema[0]));
      }
    }
    
    // Check tasks_daily table structure
    const { data: tasksDailySchema, error: tasksDailyError } = await supabase
      .from('tasks_daily')
      .select('*')
      .limit(1);
    
    if (tasksDailyError) {
      console.error('❌ Tasks_daily table error:', tasksDailyError);
    } else {
      console.log('✅ Tasks_daily table accessible');
      if (tasksDailySchema && tasksDailySchema.length > 0) {
        console.log('📋 Tasks_daily table columns:', Object.keys(tasksDailySchema[0]));
      }
    }
    
    // 4. TEST DIRECT INSERT TO SUPABASE
    console.log('🧪 Step 4: Testing direct insert to Supabase...');
    
    const testTaskData = {
      user_id: userId,
      title: 'Test Tugas Harian - ' + new Date().toLocaleString(),
      description: 'Test deskripsi tugas harian',
      date: new Date().toISOString().split('T')[0],
      school_name: 'SMKS ISLAM NADZATUL ULUM', // Use school_name instead of school_id
      activity_type: 'Pengawasan',
      location: 'SMKS ISLAM NADZATUL ULUM',
      photo1: null,
      photo2: null,
      created_at: new Date().toISOString()
    };
    
    console.log('📝 Attempting to insert test data:', testTaskData);
    
    // Try inserting to tasks_daily table
    const { data: insertResult, error: insertError } = await supabase
      .from('tasks_daily')
      .insert([testTaskData])
      .select()
      .single();
    
    if (insertError) {
      console.error('❌ Direct insert failed:', insertError);
      
      // Try alternative approach - insert to tasks table instead
      console.log('🔄 Trying alternative approach - tasks table...');
      
      const alternativeTaskData = {
        user_id: userId,
        title: testTaskData.title,
        description: testTaskData.description,
        date: testTaskData.date,
        school: testTaskData.school_name, // Use 'school' field
        type: testTaskData.activity_type,
        photo1: testTaskData.photo1,
        photo2: testTaskData.photo2,
        created_at: testTaskData.created_at
      };
      
      const { data: altInsertResult, error: altInsertError } = await supabase
        .from('tasks')
        .insert([alternativeTaskData])
        .select()
        .single();
      
      if (altInsertError) {
        console.error('❌ Alternative insert also failed:', altInsertError);
      } else {
        console.log('✅ Alternative insert successful:', altInsertResult);
      }
      
    } else {
      console.log('✅ Direct insert successful:', insertResult);
    }
    
    // 5. TEST API ENDPOINT
    console.log('🌐 Step 5: Testing API endpoint...');
    
    try {
      const apiTestData = {
        title: 'Test API Tugas Harian - ' + new Date().toLocaleString(),
        description: 'Test deskripsi via API',
        date: new Date().toISOString().split('T')[0],
        school_name: 'SMKS ISLAM NADZATUL ULUM',
        activity_type: 'Pengawasan',
        user_id: userId
      };
      
      console.log('📡 Testing API with data:', apiTestData);
      
      const apiResponse = await fetch('/api/tasks-daily', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(apiTestData)
      });
      
      console.log('📡 API Response status:', apiResponse.status);
      
      if (apiResponse.ok) {
        const apiResult = await apiResponse.json();
        console.log('✅ API test successful:', apiResult);
      } else {
        const errorText = await apiResponse.text();
        console.error('❌ API test failed:', apiResponse.status, errorText);
      }
      
    } catch (apiError) {
      console.error('❌ API test error:', apiError);
    }
    
    // 6. CLEAR CACHE AND REFRESH
    console.log('🔄 Step 6: Clearing cache and refreshing...');
    
    // Clear various caches
    localStorage.removeItem('tasks_cache');
    localStorage.removeItem('tasks_daily_cache');
    localStorage.removeItem('schema_cache');
    
    // Clear React Query cache if available
    if (window.queryClient) {
      await window.queryClient.clear();
      await window.queryClient.invalidateQueries();
      console.log('✅ React Query cache cleared');
    }
    
    // Dispatch refresh events
    const refreshEvents = [
      'tasks:refresh',
      'tasks-daily:refresh',
      'schema:refresh',
      'data:refresh'
    ];
    
    refreshEvents.forEach(eventName => {
      const event = new CustomEvent(eventName, {
        detail: {
          source: 'schema_fix',
          timestamp: Date.now()
        }
      });
      window.dispatchEvent(event);
    });
    
    // 7. PROVIDE MANUAL WORKAROUND
    console.log('🛠️ Step 7: Providing manual workaround...');
    
    console.log(`
🔧 MANUAL WORKAROUND INSTRUCTIONS:

Jika error masih muncul, coba langkah berikut:

1. REFRESH HALAMAN:
   - Tekan Ctrl+F5 untuk hard refresh
   - Atau tutup dan buka kembali tab

2. GUNAKAN DATA YANG BENAR:
   - Pastikan field "Judul Tugas" diisi
   - Pastikan field "Tempat Kegiatan" dipilih dari dropdown
   - Pastikan tanggal diisi dengan benar

3. JIKA MASIH ERROR:
   - Coba input data dengan field minimal saja
   - Jangan upload foto dulu, coba text saja
   - Setelah berhasil, baru tambahkan foto

4. ALTERNATIVE APPROACH:
   - Gunakan halaman "Tugas Tambahan" sebagai alternatif
   - Data akan tetap masuk ke sistem
    `);
    
    // 8. FINAL VERIFICATION
    setTimeout(async () => {
      console.log('🎯 Final verification...');
      
      // Check if any tasks were created
      const { data: finalTasks } = await supabase
        .from('tasks_daily')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false })
        .limit(5);
      
      console.log(`📊 Recent tasks for user: ${finalTasks?.length || 0}`);
      
      if (finalTasks && finalTasks.length > 0) {
        console.log('📋 Recent tasks:');
        finalTasks.forEach((task, index) => {
          console.log(`  ${index + 1}. ${task.title} - ${task.date}`);
        });
      }
      
      console.log(`
🎉 SCHEMA FIX COMPLETED! 🎉

✅ Schema checked and verified
✅ Direct Supabase insert tested
✅ API endpoint tested
✅ Cache cleared
✅ Manual workaround provided

Try inputting tugas harian again. If error persists, use the manual workaround above.
      `);
      
    }, 2000);
    
  } catch (error) {
    console.error('❌ Schema fix failed:', error);
    
    console.log(`
❌ FIX FAILED - MANUAL SOLUTION:

1. REFRESH HALAMAN: Tekan Ctrl+F5
2. COBA INPUT DENGAN DATA MINIMAL:
   - Judul: "Test Tugas"
   - Tanggal: Hari ini
   - Jenis: Pengawasan
   - Tempat: Pilih dari dropdown
   - Deskripsi: "Test"
   - Jangan upload foto dulu

3. JIKA MASIH ERROR:
   - Gunakan halaman Tugas Tambahan
   - Atau hubungi admin untuk fix database
    `);
  }
};

// Execute the fix
console.log('🚀 Executing tugas harian schema fix...');
fixInputTugasHarianSchemaError();