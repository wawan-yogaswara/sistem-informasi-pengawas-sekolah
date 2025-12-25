// ANALISIS MENDALAM FOTO TIDAK MUNCUL DI LAPORAN
// Copy paste ke browser console dan jalankan

const analisisMendalamFotoTidakMuncul = async () => {
  console.log('🔍 ANALISIS MENDALAM FOTO TIDAK MUNCUL DI LAPORAN...');
  
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
    
    console.log('\n📊 ANALISIS SEMUA TABEL...');
    
    // 3. Analisis Tasks (Tugas Harian)
    console.log('\n📋 ANALISIS TASKS (TUGAS HARIAN):');
    const { data: tasksData, error: tasksError } = await supabase
      .from('tasks')
      .select('*')
      .eq('user_id', userId);
    
    if (!tasksError && tasksData) {
      console.log(`📋 Total tasks: ${tasksData.length}`);
      
      let tasksWithPhoto = 0;
      let tasksWithPhoto1 = 0;
      let tasksWithPhoto2 = 0;
      let tasksWithoutPhoto = 0;
      
      tasksData.forEach((task, index) => {
        const hasPhoto = !!task.photo;
        const hasPhoto1 = !!task.photo1;
        const hasPhoto2 = !!task.photo2;
        
        if (hasPhoto) tasksWithPhoto++;
        if (hasPhoto1) tasksWithPhoto1++;
        if (hasPhoto2) tasksWithPhoto2++;
        if (!hasPhoto && !hasPhoto1 && !hasPhoto2) tasksWithoutPhoto++;
        
        // Log detail untuk tasks tanpa foto
        if (!hasPhoto && !hasPhoto1 && !hasPhoto2) {
          console.log(`❌ Task ${index + 1} TANPA FOTO:`, {
            title: task.title,
            date: task.date,
            school: task.school_name || task.school || 'N/A',
            allFields: Object.keys(task)
          });
        }
      });
      
      console.log(`📸 Tasks dengan foto: ${tasksWithPhoto}/${tasksData.length}`);
      console.log(`📸 Tasks dengan photo1: ${tasksWithPhoto1}/${tasksData.length}`);
      console.log(`📸 Tasks dengan photo2: ${tasksWithPhoto2}/${tasksData.length}`);
      console.log(`❌ Tasks TANPA foto: ${tasksWithoutPhoto}/${tasksData.length}`);
    }
    
    // 4. Analisis Supervisions (Supervisi)
    console.log('\n🔍 ANALISIS SUPERVISIONS (SUPERVISI):');
    const { data: supervisionsData, error: supervisionsError } = await supabase
      .from('supervisions')
      .select('*')
      .eq('user_id', userId);
    
    if (!supervisionsError && supervisionsData) {
      console.log(`🔍 Total supervisions: ${supervisionsData.length}`);
      
      let supervisionsWithPhoto = 0;
      let supervisionsWithPhoto1 = 0;
      let supervisionsWithPhoto2 = 0;
      let supervisionsWithoutPhoto = 0;
      
      supervisionsData.forEach((supervision, index) => {
        const hasPhoto = !!supervision.photo;
        const hasPhoto1 = !!supervision.photo1;
        const hasPhoto2 = !!supervision.photo2;
        
        if (hasPhoto) supervisionsWithPhoto++;
        if (hasPhoto1) supervisionsWithPhoto1++;
        if (hasPhoto2) supervisionsWithPhoto2++;
        if (!hasPhoto && !hasPhoto1 && !hasPhoto2) supervisionsWithoutPhoto++;
        
        // Log detail untuk supervisions tanpa foto
        if (!hasPhoto && !hasPhoto1 && !hasPhoto2) {
          console.log(`❌ Supervision ${index + 1} TANPA FOTO:`, {
            school: supervision.school_name || 'N/A',
            date: supervision.date,
            findings: supervision.findings ? supervision.findings.substring(0, 50) + '...' : 'N/A',
            allFields: Object.keys(supervision)
          });
        }
      });
      
      console.log(`📸 Supervisions dengan foto: ${supervisionsWithPhoto}/${supervisionsData.length}`);
      console.log(`📸 Supervisions dengan photo1: ${supervisionsWithPhoto1}/${supervisionsData.length}`);
      console.log(`📸 Supervisions dengan photo2: ${supervisionsWithPhoto2}/${supervisionsData.length}`);
      console.log(`❌ Supervisions TANPA foto: ${supervisionsWithoutPhoto}/${supervisionsData.length}`);
    }
    
    // 5. Analisis Additional Tasks (Tugas Tambahan)
    console.log('\n➕ ANALISIS ADDITIONAL TASKS (TUGAS TAMBAHAN):');
    const { data: additionalTasksData, error: additionalTasksError } = await supabase
      .from('additional_tasks')
      .select('*')
      .eq('user_id', userId);
    
    if (!additionalTasksError && additionalTasksData) {
      console.log(`➕ Total additional tasks: ${additionalTasksData.length}`);
      
      let additionalTasksWithPhoto = 0;
      let additionalTasksWithPhoto1 = 0;
      let additionalTasksWithPhoto2 = 0;
      let additionalTasksWithoutPhoto = 0;
      
      additionalTasksData.forEach((task, index) => {
        const hasPhoto = !!task.photo;
        const hasPhoto1 = !!task.photo1;
        const hasPhoto2 = !!task.photo2;
        
        if (hasPhoto) additionalTasksWithPhoto++;
        if (hasPhoto1) additionalTasksWithPhoto1++;
        if (hasPhoto2) additionalTasksWithPhoto2++;
        if (!hasPhoto && !hasPhoto1 && !hasPhoto2) additionalTasksWithoutPhoto++;
        
        // Log detail untuk additional tasks tanpa foto
        if (!hasPhoto && !hasPhoto1 && !hasPhoto2) {
          console.log(`❌ Additional Task ${index + 1} TANPA FOTO:`, {
            name: task.name || task.title,
            date: task.date,
            location: task.location || 'N/A',
            allFields: Object.keys(task)
          });
        }
      });
      
      console.log(`📸 Additional tasks dengan foto: ${additionalTasksWithPhoto}/${additionalTasksData.length}`);
      console.log(`📸 Additional tasks dengan photo1: ${additionalTasksWithPhoto1}/${additionalTasksData.length}`);
      console.log(`📸 Additional tasks dengan photo2: ${additionalTasksWithPhoto2}/${additionalTasksData.length}`);
      console.log(`❌ Additional tasks TANPA foto: ${additionalTasksWithoutPhoto}/${additionalTasksData.length}`);
    }
    
    // 6. Analisis Kualitas Berdasarkan Foto
    console.log('\n📊 ANALISIS DAMPAK FOTO TERHADAP KUALITAS:');
    
    const totalActivities = (tasksData?.length || 0) + (supervisionsData?.length || 0) + (additionalTasksData?.length || 0);
    const totalWithPhotos = (tasksWithPhoto || 0) + (supervisionsWithPhoto || 0) + (additionalTasksWithPhoto || 0);
    const totalWithoutPhotos = (tasksWithoutPhoto || 0) + (supervisionsWithoutPhoto || 0) + (additionalTasksWithoutPhoto || 0);
    
    const photoDocumentationRate = totalActivities > 0 ? Math.round((totalWithPhotos / totalActivities) * 100) : 0;
    
    console.log(`📊 Total kegiatan: ${totalActivities}`);
    console.log(`📸 Kegiatan dengan foto: ${totalWithPhotos} (${photoDocumentationRate}%)`);
    console.log(`❌ Kegiatan tanpa foto: ${totalWithoutPhotos} (${100 - photoDocumentationRate}%)`);
    
    // Tentukan dampak terhadap kualitas
    let qualityImpact = '';
    if (photoDocumentationRate >= 90) {
      qualityImpact = '🟢 SANGAT BAIK - Dokumentasi foto sangat lengkap';
    } else if (photoDocumentationRate >= 75) {
      qualityImpact = '🟡 BAIK - Dokumentasi foto cukup lengkap';
    } else if (photoDocumentationRate >= 50) {
      qualityImpact = '🟠 CUKUP - Dokumentasi foto perlu ditingkatkan';
    } else {
      qualityImpact = '🔴 KURANG - Dokumentasi foto sangat kurang, berpengaruh negatif pada kualitas';
    }
    
    console.log(`📈 Dampak terhadap kualitas: ${qualityImpact}`);
    
    // 7. Cek mapping foto di reports.tsx
    console.log('\n🔍 ANALISIS MAPPING FOTO DI REPORTS:');
    
    // Simulasi mapping seperti di reports.tsx
    const simulatedActivities = [];
    
    // Tasks mapping
    if (tasksData) {
      tasksData.forEach(task => {
        simulatedActivities.push({
          type: 'Tugas Pokok',
          title: task.title || 'Tugas Harian',
          photo1: task.photo, // Fixed mapping: task.photo -> photo1
          photo2: task.photo2,
          hasPhoto1: !!task.photo,
          hasPhoto2: !!task.photo2,
          source: 'tasks'
        });
      });
    }
    
    // Supervisions mapping
    if (supervisionsData) {
      supervisionsData.forEach(supervision => {
        simulatedActivities.push({
          type: 'Supervisi',
          title: `Supervisi ${supervision.school_name || 'Sekolah'}`,
          photo1: supervision.photo, // Fixed mapping: supervision.photo -> photo1
          photo2: supervision.photo2,
          hasPhoto1: !!supervision.photo,
          hasPhoto2: !!supervision.photo2,
          source: 'supervisions'
        });
      });
    }
    
    // Additional tasks mapping
    if (additionalTasksData) {
      additionalTasksData.forEach(task => {
        simulatedActivities.push({
          type: 'Tugas Tambahan',
          title: task.name || task.title || 'Kegiatan Tambahan',
          photo1: task.photo || task.photo1, // Current mapping
          photo2: task.photo2,
          hasPhoto1: !!(task.photo || task.photo1),
          hasPhoto2: !!task.photo2,
          source: 'additional_tasks'
        });
      });
    }
    
    const activitiesWithPhotosAfterMapping = simulatedActivities.filter(a => a.hasPhoto1 || a.hasPhoto2);
    const mappingPhotoRate = simulatedActivities.length > 0 ? Math.round((activitiesWithPhotosAfterMapping.length / simulatedActivities.length) * 100) : 0;
    
    console.log(`📊 Activities setelah mapping: ${simulatedActivities.length}`);
    console.log(`📸 Activities dengan foto setelah mapping: ${activitiesWithPhotosAfterMapping.length} (${mappingPhotoRate}%)`);
    
    // 8. Identifikasi masalah mapping
    console.log('\n🔧 IDENTIFIKASI MASALAH MAPPING:');
    
    const mappingIssues = [];
    
    // Cek tasks dengan foto di database tapi tidak ter-map
    if (tasksData) {
      tasksData.forEach(task => {
        if ((task.photo1 || task.photo2) && !task.photo) {
          mappingIssues.push({
            type: 'Tasks',
            issue: 'Foto tersimpan di photo1/photo2 tapi tidak di photo',
            title: task.title,
            hasPhoto1: !!task.photo1,
            hasPhoto2: !!task.photo2,
            hasPhoto: !!task.photo
          });
        }
      });
    }
    
    // Cek supervisions dengan foto di database tapi tidak ter-map
    if (supervisionsData) {
      supervisionsData.forEach(supervision => {
        if ((supervision.photo1 || supervision.photo2) && !supervision.photo) {
          mappingIssues.push({
            type: 'Supervisions',
            issue: 'Foto tersimpan di photo1/photo2 tapi tidak di photo',
            title: supervision.school_name,
            hasPhoto1: !!supervision.photo1,
            hasPhoto2: !!supervision.photo2,
            hasPhoto: !!supervision.photo
          });
        }
      });
    }
    
    console.log(`🔧 Masalah mapping ditemukan: ${mappingIssues.length}`);
    mappingIssues.forEach((issue, index) => {
      console.log(`🔧 Issue ${index + 1}:`, issue);
    });
    
    // 9. Rekomendasi perbaikan
    console.log('\n💡 REKOMENDASI PERBAIKAN:');
    
    if (totalWithoutPhotos > 0) {
      console.log(`1. 📸 Upload foto untuk ${totalWithoutPhotos} kegiatan yang belum memiliki foto`);
    }
    
    if (mappingIssues.length > 0) {
      console.log(`2. 🔧 Perbaiki mapping foto di reports.tsx untuk ${mappingIssues.length} kegiatan`);
    }
    
    if (photoDocumentationRate < 75) {
      console.log('3. 📈 Tingkatkan dokumentasi foto untuk meningkatkan kualitas kegiatan');
    }
    
    console.log('4. 🔄 Sinkronisasi data antara localStorage dan Supabase');
    console.log('5. 🧹 Bersihkan data duplikat atau tidak valid');
    
    console.log('\n✅ ANALISIS SELESAI');
    console.log('📋 Gunakan hasil analisis ini untuk memperbaiki masalah foto di laporan');
    
    // Return summary untuk digunakan script lain
    return {
      totalActivities,
      totalWithPhotos,
      totalWithoutPhotos,
      photoDocumentationRate,
      mappingIssues,
      qualityImpact
    };
    
  } catch (error) {
    console.error('❌ Error during analysis:', error);
  }
};

// Jalankan analisis
analisisMendalamFotoTidakMuncul();