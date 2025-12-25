// FIX FOTO APEL PAGI DAN MONITORING BPMU TIDAK MUNCUL
// Copy paste ke browser console dan jalankan

const fixFotoApelPagiMonitoringBPMU = async () => {
  console.log('🔧 FIX FOTO APEL PAGI DAN MONITORING BPMU...');
  
  try {
    // 1. Cek user yang sedang login
    const userData = localStorage.getItem('auth_user');
    if (!userData) {
      console.log('❌ Tidak ada user yang login');
      return;
    }
    
    const currentUser = JSON.parse(userData);
    let userId = currentUser.id;
    if (currentUser.username === 'wawan') {
      userId = '421cdb28-f2af-4f1f-aa5f-c59a3d661a2e';
    }
    
    console.log('👤 User:', currentUser.username, 'ID:', userId);
    
    // 2. Import Supabase client
    const { createClient } = await import('@supabase/supabase-js');
    const supabaseUrl = 'https://fmxeboullgcewzjpql.supabase.co';
    const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZteGVib3VsbGdjZXd6anBxbCIsInJvbGUiOiJhbm9uIiwiaWF0IjoxNzM0NTk5NzI4LCJleHAiOjIwNTAxNzU3Mjh9.Ej8Ej8Ej8Ej8Ej8Ej8Ej8Ej8Ej8Ej8Ej8Ej8Ej8';
    const supabase = createClient(supabaseUrl, supabaseKey);
    
    // 3. Ambil data dari localStorage untuk referensi
    const localData = JSON.parse(localStorage.getItem('local_database') || '{}');
    const localAdditionalTasks = localData.additionalTasks || [];
    
    // Filter data Apel Pagi dan Monitoring dari localStorage
    const apelPagiLocal = localAdditionalTasks.filter(task => 
      task.name && task.name.toLowerCase().includes('apel')
    );
    
    const monitoringLocal = localAdditionalTasks.filter(task => 
      task.name && (task.name.toLowerCase().includes('monitoring') || task.name.toLowerCase().includes('bpmu'))
    );
    
    console.log(`📋 LocalStorage - Apel Pagi: ${apelPagiLocal.length}, Monitoring: ${monitoringLocal.length}`);
    
    // 4. Ambil data dari Supabase
    const { data: supabaseData, error } = await supabase
      .from('additional_tasks')
      .select('*')
      .eq('user_id', userId);
    
    if (error) {
      console.error('❌ Error fetching from Supabase:', error);
      return;
    }
    
    console.log(`📋 Supabase total: ${supabaseData.length} records`);
    
    // Filter data Apel Pagi dan Monitoring dari Supabase
    const apelPagiSupabase = supabaseData.filter(task => 
      (task.name || task.title || '').toLowerCase().includes('apel')
    );
    
    const monitoringSupabase = supabaseData.filter(task => {
      const name = (task.name || task.title || '').toLowerCase();
      return name.includes('monitoring') || name.includes('bpmu');
    });
    
    console.log(`📋 Supabase - Apel Pagi: ${apelPagiSupabase.length}, Monitoring: ${monitoringSupabase.length}`);
    
    // 5. Perbaiki data yang tidak memiliki foto
    const recordsToFix = [...apelPagiSupabase, ...monitoringSupabase].filter(record => 
      !record.photo && !record.photo1 && !record.photo2
    );
    
    console.log(`🔧 Records to fix: ${recordsToFix.length}`);
    
    for (const record of recordsToFix) {
      console.log(`\n🔧 Fixing: ${record.name || record.title}`);
      
      // Cari data yang sesuai di localStorage berdasarkan nama dan tanggal
      const localMatch = localAdditionalTasks.find(local => {
        const localName = (local.name || '').toLowerCase();
        const recordName = (record.name || record.title || '').toLowerCase();
        const localDate = new Date(local.date).toDateString();
        const recordDate = new Date(record.date).toDateString();
        
        return localName.includes(recordName.split(' ')[0]) && localDate === recordDate;
      });
      
      if (localMatch && (localMatch.photo1 || localMatch.photo2)) {
        console.log(`✅ Found matching local data with photos`);
        
        // Update record di Supabase dengan foto dari localStorage
        const updateData = {};
        
        if (localMatch.photo1) {
          // Jika foto1 adalah filename, convert ke base64 atau path yang benar
          if (localMatch.photo1.startsWith('data:')) {
            updateData.photo = localMatch.photo1;
            updateData.photo1 = localMatch.photo1;
          } else {
            // Jika filename, coba ambil dari uploads folder
            const photoPath = `/uploads/${localMatch.photo1}`;
            updateData.photo = photoPath;
            updateData.photo1 = photoPath;
          }
        }
        
        if (localMatch.photo2) {
          if (localMatch.photo2.startsWith('data:')) {
            updateData.photo2 = localMatch.photo2;
          } else {
            updateData.photo2 = `/uploads/${localMatch.photo2}`;
          }
        }
        
        console.log('📸 Updating with photos:', Object.keys(updateData));
        
        const { error: updateError } = await supabase
          .from('additional_tasks')
          .update(updateData)
          .eq('id', record.id);
        
        if (updateError) {
          console.error(`❌ Error updating ${record.name}:`, updateError);
        } else {
          console.log(`✅ Successfully updated ${record.name}`);
        }
      } else {
        console.log(`❌ No matching local data with photos found`);
      }
    }
    
    // 6. Verifikasi hasil perbaikan
    console.log('\n🔍 VERIFIKASI HASIL...');
    
    const { data: verifyData, error: verifyError } = await supabase
      .from('additional_tasks')
      .select('*')
      .eq('user_id', userId);
    
    if (!verifyError) {
      const apelPagiFixed = verifyData.filter(task => {
        const name = (task.name || task.title || '').toLowerCase();
        return name.includes('apel') && (task.photo || task.photo1 || task.photo2);
      });
      
      const monitoringFixed = verifyData.filter(task => {
        const name = (task.name || task.title || '').toLowerCase();
        return (name.includes('monitoring') || name.includes('bpmu')) && (task.photo || task.photo1 || task.photo2);
      });
      
      console.log(`✅ Apel Pagi with photos: ${apelPagiFixed.length}`);
      console.log(`✅ Monitoring with photos: ${monitoringFixed.length}`);
      
      // Log detail foto yang berhasil diperbaiki
      [...apelPagiFixed, ...monitoringFixed].forEach(task => {
        console.log(`📸 ${task.name || task.title}:`, {
          photo: task.photo ? 'YES' : 'NO',
          photo1: task.photo1 ? 'YES' : 'NO',
          photo2: task.photo2 ? 'YES' : 'NO'
        });
      });
    }
    
    // 7. Refresh halaman reports jika ada
    if (typeof window !== 'undefined' && window.location.pathname.includes('reports')) {
      console.log('🔄 Refreshing reports page...');
      window.location.reload();
    }
    
    console.log('\n✅ FIX SELESAI');
    console.log('📋 Silakan cek halaman reports untuk melihat hasilnya');
    
  } catch (error) {
    console.error('❌ Error during fix:', error);
  }
};

// Jalankan fix
fixFotoApelPagiMonitoringBPMU();