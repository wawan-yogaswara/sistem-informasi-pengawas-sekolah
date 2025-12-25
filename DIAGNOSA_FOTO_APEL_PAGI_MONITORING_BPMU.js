// DIAGNOSA FOTO APEL PAGI DAN MONITORING BPMU TIDAK MUNCUL
// Copy paste ke browser console dan jalankan

const diagnoseFotoApelPagiMonitoringBPMU = async () => {
  console.log('🔍 DIAGNOSA FOTO APEL PAGI DAN MONITORING BPMU...');
  
  try {
    // 1. Cek user yang sedang login
    const userData = localStorage.getItem('auth_user');
    if (!userData) {
      console.log('❌ Tidak ada user yang login');
      return;
    }
    
    const currentUser = JSON.parse(userData);
    console.log('👤 Current user:', currentUser.username);
    
    // For wawan user, use the correct ID from Supabase
    let userId = currentUser.id;
    if (currentUser.username === 'wawan') {
      userId = '421cdb28-f2af-4f1f-aa5f-c59a3d661a2e';
    }
    
    console.log('🔑 Using user_id:', userId);
    
    // 2. Cek data di localStorage
    console.log('\n📦 CHECKING LOCALSTORAGE DATA...');
    const localData = JSON.parse(localStorage.getItem('local_database') || '{}');
    
    if (localData.additionalTasks) {
      const apelPagiTasks = localData.additionalTasks.filter(task => 
        task.name && task.name.toLowerCase().includes('apel')
      );
      
      const monitoringTasks = localData.additionalTasks.filter(task => 
        task.name && task.name.toLowerCase().includes('monitoring')
      );
      
      console.log(`📋 LocalStorage - Apel Pagi: ${apelPagiTasks.length} items`);
      console.log(`📋 LocalStorage - Monitoring: ${monitoringTasks.length} items`);
      
      // Log detail foto untuk Apel Pagi
      apelPagiTasks.forEach((task, index) => {
        console.log(`📸 Apel Pagi ${index + 1}:`, {
          name: task.name,
          date: task.date,
          photo1: task.photo1 || 'TIDAK ADA',
          photo2: task.photo2 || 'TIDAK ADA',
          hasPhoto1: !!task.photo1,
          hasPhoto2: !!task.photo2
        });
      });
      
      // Log detail foto untuk Monitoring
      monitoringTasks.forEach((task, index) => {
        console.log(`📸 Monitoring ${index + 1}:`, {
          name: task.name,
          date: task.date,
          photo1: task.photo1 || 'TIDAK ADA',
          photo2: task.photo2 || 'TIDAK ADA',
          hasPhoto1: !!task.photo1,
          hasPhoto2: !!task.photo2
        });
      });
    }
    
    // 3. Cek data di Supabase via API
    console.log('\n🌐 CHECKING SUPABASE VIA API...');
    try {
      const apiResponse = await fetch(`/api/activities?user_id=${encodeURIComponent(userId)}`);
      if (apiResponse.ok) {
        const apiData = await apiResponse.json();
        console.log(`📋 API returned ${apiData.length} additional tasks`);
        
        const apelPagiAPI = apiData.filter(task => 
          (task.name || task.title || '').toLowerCase().includes('apel')
        );
        
        const monitoringAPI = apiData.filter(task => 
          (task.name || task.title || '').toLowerCase().includes('monitoring')
        );
        
        console.log(`📋 API - Apel Pagi: ${apelPagiAPI.length} items`);
        console.log(`📋 API - Monitoring: ${monitoringAPI.length} items`);
        
        // Log detail foto dari API
        apelPagiAPI.forEach((task, index) => {
          console.log(`📸 API Apel Pagi ${index + 1}:`, {
            name: task.name || task.title,
            date: task.date,
            photo: task.photo || 'TIDAK ADA',
            photo1: task.photo1 || 'TIDAK ADA',
            photo2: task.photo2 || 'TIDAK ADA',
            hasPhoto: !!task.photo,
            hasPhoto1: !!task.photo1,
            hasPhoto2: !!task.photo2
          });
        });
        
        monitoringAPI.forEach((task, index) => {
          console.log(`📸 API Monitoring ${index + 1}:`, {
            name: task.name || task.title,
            date: task.date,
            photo: task.photo || 'TIDAK ADA',
            photo1: task.photo1 || 'TIDAK ADA',
            photo2: task.photo2 || 'TIDAK ADA',
            hasPhoto: !!task.photo,
            hasPhoto1: !!task.photo1,
            hasPhoto2: !!task.photo2
          });
        });
      } else {
        console.error('❌ API Error:', apiResponse.status);
      }
    } catch (apiError) {
      console.error('❌ API Failed:', apiError);
    }
    
    // 4. Cek data di Supabase direct
    console.log('\n🔗 CHECKING SUPABASE DIRECT...');
    try {
      const { createClient } = await import('@supabase/supabase-js');
      const supabaseUrl = 'https://fmxeboullgcewzjpql.supabase.co';
      const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZteGVib3VsbGdjZXd6anBxbCIsInJvbGUiOiJhbm9uIiwiaWF0IjoxNzM0NTk5NzI4LCJleHAiOjIwNTAxNzU3Mjh9.Ej8Ej8Ej8Ej8Ej8Ej8Ej8Ej8Ej8Ej8Ej8Ej8Ej8';
      const supabase = createClient(supabaseUrl, supabaseKey);
      
      const { data: supabaseData, error } = await supabase
        .from('additional_tasks')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false });
      
      if (!error && supabaseData) {
        console.log(`📋 Supabase direct returned ${supabaseData.length} additional tasks`);
        
        const apelPagiSupabase = supabaseData.filter(task => 
          (task.name || task.title || '').toLowerCase().includes('apel')
        );
        
        const monitoringSupabase = supabaseData.filter(task => 
          (task.name || task.title || '').toLowerCase().includes('monitoring')
        );
        
        console.log(`📋 Supabase - Apel Pagi: ${apelPagiSupabase.length} items`);
        console.log(`📋 Supabase - Monitoring: ${monitoringSupabase.length} items`);
        
        // Log detail foto dari Supabase
        apelPagiSupabase.forEach((task, index) => {
          console.log(`📸 Supabase Apel Pagi ${index + 1}:`, {
            name: task.name || task.title,
            date: task.date,
            photo: task.photo || 'TIDAK ADA',
            photo1: task.photo1 || 'TIDAK ADA',
            photo2: task.photo2 || 'TIDAK ADA',
            hasPhoto: !!task.photo,
            hasPhoto1: !!task.photo1,
            hasPhoto2: !!task.photo2,
            allFields: Object.keys(task)
          });
        });
        
        monitoringSupabase.forEach((task, index) => {
          console.log(`📸 Supabase Monitoring ${index + 1}:`, {
            name: task.name || task.title,
            date: task.date,
            photo: task.photo || 'TIDAK ADA',
            photo1: task.photo1 || 'TIDAK ADA',
            photo2: task.photo2 || 'TIDAK ADA',
            hasPhoto: !!task.photo,
            hasPhoto1: !!task.photo1,
            hasPhoto2: !!task.photo2,
            allFields: Object.keys(task)
          });
        });
      } else {
        console.error('❌ Supabase direct error:', error);
      }
    } catch (supabaseError) {
      console.error('❌ Supabase direct failed:', supabaseError);
    }
    
    // 5. Cek bagaimana data diproses di reports page
    console.log('\n📊 CHECKING REPORTS PAGE PROCESSING...');
    
    // Simulate the same processing logic as reports.tsx
    const activities = [];
    
    // Check if there are activities in the current reports page
    const reportsActivities = window.allActivities || [];
    console.log(`📋 Current reports activities: ${reportsActivities.length}`);
    
    const apelPagiReports = reportsActivities.filter(activity => 
      activity.title && activity.title.toLowerCase().includes('apel')
    );
    
    const monitoringReports = reportsActivities.filter(activity => 
      activity.title && activity.title.toLowerCase().includes('monitoring')
    );
    
    console.log(`📋 Reports - Apel Pagi: ${apelPagiReports.length} items`);
    console.log(`📋 Reports - Monitoring: ${monitoringReports.length} items`);
    
    // Log detail foto di reports
    apelPagiReports.forEach((activity, index) => {
      console.log(`📸 Reports Apel Pagi ${index + 1}:`, {
        title: activity.title,
        type: activity.type,
        date: activity.date,
        photo1: activity.photo1 ? (activity.photo1.startsWith('data:') ? 'base64' : activity.photo1) : 'TIDAK ADA',
        photo2: activity.photo2 ? (activity.photo2.startsWith('data:') ? 'base64' : activity.photo2) : 'TIDAK ADA',
        hasPhoto1: !!activity.photo1,
        hasPhoto2: !!activity.photo2,
        source: activity.source
      });
    });
    
    monitoringReports.forEach((activity, index) => {
      console.log(`📸 Reports Monitoring ${index + 1}:`, {
        title: activity.title,
        type: activity.type,
        date: activity.date,
        photo1: activity.photo1 ? (activity.photo1.startsWith('data:') ? 'base64' : activity.photo1) : 'TIDAK ADA',
        photo2: activity.photo2 ? (activity.photo2.startsWith('data:') ? 'base64' : activity.photo2) : 'TIDAK ADA',
        hasPhoto1: !!activity.photo1,
        hasPhoto2: !!activity.photo2,
        source: activity.source
      });
    });
    
    console.log('\n✅ DIAGNOSA SELESAI');
    console.log('📋 Ringkasan:');
    console.log('- Periksa apakah data ada di localStorage, API, dan Supabase');
    console.log('- Periksa apakah foto tersimpan dengan field yang benar');
    console.log('- Periksa apakah mapping foto di reports.tsx sudah benar');
    
  } catch (error) {
    console.error('❌ Error during diagnosis:', error);
  }
};

// Jalankan diagnosa
diagnoseFotoApelPagiMonitoringBPMU();