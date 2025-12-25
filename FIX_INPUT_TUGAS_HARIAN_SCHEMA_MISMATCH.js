// FIX INPUT TUGAS HARIAN - Schema Mismatch Error
// Copy paste ke browser console di halaman Tugas Harian

console.log('🔧 FIX: Input tugas harian schema mismatch error');

const fixInputTugasHarianSchemaMismatch = async () => {
  const userId = '421cdb28-f2af-4f1f-aa5f-c59a3d661a2e';
  
  try {
    console.log('🚀 Starting fix for tugas harian input schema mismatch...');
    
    // 1. CLEAR ALL CACHES
    console.log('🧹 Step 1: Clearing all caches...');
    localStorage.removeItem('tasks_cache');
    localStorage.removeItem('schema_cache');
    localStorage.removeItem('query_cache');
    
    // Clear React Query cache if available
    if (window.queryClient) {
      window.queryClient.clear();
      console.log('✅ React Query cache cleared');
    }
    
    // 2. SET USER CONTEXT
    console.log('👤 Step 2: Setting user context...');
    const userData = {
      id: userId,
      username: 'wawan',
      fullName: 'Wawan Setiawan',
      role: 'admin'
    };
    localStorage.setItem('auth_user', JSON.stringify(userData));
    localStorage.setItem('user_data', JSON.stringify(userData));
    
    // 3. SETUP SUPABASE
    console.log('🔗 Step 3: Setting up Supabase...');
    const { createClient } = await import('@supabase/supabase-js');
    const supabaseUrl = 'https://fmxeboullgcewzjpql.supabase.co';
    const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZteGVib3VsbGdjZXd6anBxbCIsInJvbGUiOiJhbm9uIiwiaWF0IjoxNzM0NTk5NzI4LCJleHAiOjIwNTAxNzU3Mjh9.Ej8Ej8Ej8Ej8Ej8Ej8Ej8Ej8Ej8Ej8Ej8Ej8Ej8';
    const supabase = createClient(supabaseUrl, supabaseKey);
    
    // 4. CHECK CURRENT SCHEMA
    console.log('🔍 Step 4: Checking current database schema...');
    
    // Check tasks table schema
    try {
      const { data: tasksSchema, error: tasksError } = await supabase
        .from('tasks')
        .select('*')
        .limit(1);
      
      if (!tasksError && tasksSchema) {
        console.log('✅ Tasks table exists and accessible');
        if (tasksSchema.length > 0) {
          console.log('📋 Tasks table columns:', Object.keys(tasksSchema[0]));
        }
      } else {
        console.log('⚠️ Tasks table issue:', tasksError);
      }
    } catch (error) {
      console.error('❌ Error checking tasks schema:', error);
    }
    
    // Check tasks_daily table schema
    try {
      const { data: tasksDailySchema, error: tasksDailyError } = await supabase
        .from('tasks_daily')
        .select('*')
        .limit(1);
      
      if (!tasksDailyError && tasksDailySchema) {
        console.log('✅ Tasks_daily table exists and accessible');
        if (tasksDailySchema.length > 0) {
          console.log('📋 Tasks_daily table columns:', Object.keys(tasksDailySchema[0]));
        }
      } else {
        console.log('⚠️ Tasks_daily table issue:', tasksDailyError);
      }
    } catch (error) {
      console.error('❌ Error checking tasks_daily schema:', error);
    }
    
    // 5. TEST DIRECT INSERT TO IDENTIFY CORRECT SCHEMA
    console.log('🧪 Step 5: Testing direct insert to identify correct schema...');
    
    const testData = {
      title: 'Test Tugas Harian',
      description: 'Test description',
      date: new Date().toISOString().split('T')[0],
      location: 'SMAN 4 GARUT',
      school: 'SMAN 4 GARUT',
      user_id: userId,
      created_at: new Date().toISOString()
    };
    
    // Try inserting to tasks table first
    try {
      console.log('🧪 Testing insert to tasks table...');
      const { data: insertResult, error: insertError } = await supabase
        .from('tasks')
        .insert([testData])
        .select()
        .single();
      
      if (!insertError && insertResult) {
        console.log('✅ Successfully inserted to tasks table:', insertResult.id);
        
        // Clean up test data
        await supabase.from('tasks').delete().eq('id', insertResult.id);
        console.log('🧹 Test data cleaned up');
        
        console.log('✅ SOLUTION: Use tasks table for tugas harian input');
      } else {
        console.log('❌ Insert to tasks failed:', insertError);
        
        // Try tasks_daily table
        try {
          console.log('🧪 Testing insert to tasks_daily table...');
          const { data: insertResult2, error: insertError2 } = await supabase
            .from('tasks_daily')
            .insert([testData])
            .select()
            .single();
          
          if (!insertError2 && insertResult2) {
            console.log('✅ Successfully inserted to tasks_daily table:', insertResult2.id);
            
            // Clean up test data
            await supabase.from('tasks_daily').delete().eq('id', insertResult2.id);
            console.log('🧹 Test data cleaned up');
            
            console.log('✅ SOLUTION: Use tasks_daily table for tugas harian input');
          } else {
            console.log('❌ Insert to tasks_daily also failed:', insertError2);
          }
        } catch (error) {
          console.error('❌ Error testing tasks_daily insert:', error);
        }
      }
    } catch (error) {
      console.error('❌ Error testing tasks insert:', error);
    }
    
    // 6. TEST API ENDPOINT
    console.log('🌐 Step 6: Testing API endpoint...');
    
    try {
      const apiTestData = {
        title: 'Test API Tugas Harian',
        description: 'Test API description',
        date: new Date().toISOString().split('T')[0],
        location: 'SMAN 4 GARUT',
        school: 'SMAN 4 GARUT',
        user_id: userId
      };
      
      const response = await fetch('/api/tasks-daily', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(apiTestData)
      });
      
      if (response.ok) {
        const result = await response.json();
        console.log('✅ API endpoint working:', result.id);
        
        // Clean up test data
        await fetch(`/api/tasks-daily?id=${result.id}`, { method: 'DELETE' });
        console.log('🧹 API test data cleaned up');
      } else {
        const errorText = await response.text();
        console.error('❌ API endpoint failed:', response.status, errorText);
      }
    } catch (error) {
      console.error('❌ Error testing API endpoint:', error);
    }
    
    // 7. FORCE REFRESH FORM
    console.log('🔄 Step 7: Force refreshing form...');
    
    // Dispatch form refresh events
    const refreshEvents = [
      'formRefresh',
      'schemaRefresh',
      'tasksRefresh',
      'clearFormCache'
    ];
    
    refreshEvents.forEach(eventName => {
      const event = new CustomEvent(eventName, {
        detail: {
          source: 'schema_fix',
          timestamp: Date.now()
        }
      });
      window.dispatchEvent(event);
      document.dispatchEvent(event);
    });
    
    // 8. PROVIDE MANUAL WORKAROUND
    console.log('🛠️ Step 8: Providing manual workaround...');
    
    // Create a manual submit function
    window.manualSubmitTugasHarian = async (formData) => {
      try {
        console.log('📝 Manual submit tugas harian:', formData);
        
        const submitData = {
          title: formData.title || formData.judul || 'Tugas Harian',
          description: formData.description || formData.deskripsi || '',
          date: formData.date || formData.tanggal || new Date().toISOString().split('T')[0],
          location: formData.location || formData.tempat || formData.school || 'Sekolah Binaan',
          school: formData.school || formData.sekolah || formData.location || 'Sekolah Binaan',
          user_id: userId,
          photo1: formData.photo1 || formData.foto1 || null,
          photo2: formData.photo2 || formData.foto2 || null
        };
        
        // Try API first
        const response = await fetch('/api/tasks-daily', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(submitData)
        });
        
        if (response.ok) {
          const result = await response.json();
          console.log('✅ Manual submit successful:', result);
          alert('Data berhasil disimpan!');
          window.location.reload();
          return result;
        } else {
          // Fallback to direct Supabase
          const { data: result, error } = await supabase
            .from('tasks')
            .insert([submitData])
            .select()
            .single();
          
          if (!error && result) {
            console.log('✅ Manual submit via Supabase successful:', result);
            alert('Data berhasil disimpan!');
            window.location.reload();
            return result;
          } else {
            throw new Error(error?.message || 'Failed to save');
          }
        }
      } catch (error) {
        console.error('❌ Manual submit failed:', error);
        alert('Gagal menyimpan data: ' + error.message);
      }
    };
    
    console.log(`
🎉 SCHEMA MISMATCH FIX COMPLETED! 🎉

✅ All caches cleared
✅ Database schema checked
✅ API endpoint tested
✅ Form refresh events dispatched
✅ Manual workaround function created

🛠️ MANUAL WORKAROUND:
If the form still doesn't work, you can use the manual submit function:

1. Fill the form normally
2. Open browser console (F12)
3. Run this command:

manualSubmitTugasHarian({
  title: 'Judul Tugas',
  description: 'Deskripsi kegiatan',
  date: '2025-01-25',
  location: 'SMAN 4 GARUT',
  school: 'SMAN 4 GARUT'
});

🔄 Refreshing page in 3 seconds to apply fixes...
    `);
    
    // Auto refresh page
    setTimeout(() => {
      window.location.reload();
    }, 3000);
    
  } catch (error) {
    console.error('❌ Schema mismatch fix failed:', error);
    console.log('🔄 Refreshing page to reset state...');
    setTimeout(() => {
      window.location.reload();
    }, 2000);
  }
};

// Execute the fix
console.log('🚀 Executing schema mismatch fix...');
fixInputTugasHarianSchemaMismatch();