// FIX SEMUA FOTO TIDAK MUNCUL DI LAPORAN
// Copy paste ke browser console dan jalankan

const fixSemuaFotoTidakMunculLaporan = async () => {
  console.log('🔧 FIX SEMUA FOTO TIDAK MUNCUL DI LAPORAN...');
  
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
    
    let totalFixed = 0;
    let totalErrors = 0;
    
    // 4. FIX TASKS (TUGAS HARIAN)
    console.log('\n🔧 FIXING TASKS (TUGAS HARIAN)...');
    
    const { data: tasksData, error: tasksError } = await supabase
      .from('tasks')
      .select('*')
      .eq('user_id', userId);
    
    if (!tasksError && tasksData) {
      for (const task of tasksData) {
        let needsUpdate = false;
        const updateData = {};
        
        // Cek apakah task tidak memiliki foto
        if (!task.photo && !task.photo1 && !task.photo2) {
          console.log(`🔧 Fixing task: ${task.title}`);
          
          // Cari di localStorage berdasarkan title dan tanggal
          const localTasks = localData.tasks || [];
          const localMatch = localTasks.find(local => {
            const titleMatch = (local.title || '').toLowerCase().includes((task.title || '').toLowerCase().split(' ')[0]);
            const dateMatch = new Date(local.date).toDateString() === new Date(task.date).toDateString();
            return titleMatch && dateMatch;
          });
          
          if (localMatch && (localMatch.photo || localMatch.photo1 || localMatch.photo2)) {
            console.log(`✅ Found photos in localStorage for: ${task.title}`);
            
            if (localMatch.photo) {
              updateData.photo = localMatch.photo.startsWith('data:') ? localMatch.photo : `/uploads/${localMatch.photo}`;
              needsUpdate = true;
            }
            
            if (localMatch.photo1) {
              updateData.photo1 = localMatch.photo1.startsWith('data:') ? localMatch.photo1 : `/uploads/${localMatch.photo1}`;
              needsUpdate = true;
            }
            
            if (localMatch.photo2) {
              updateData.photo2 = localMatch.photo2.startsWith('data:') ? localMatch.photo2 : `/uploads/${localMatch.photo2}`;
              needsUpdate = true;
            }
          }
        }
        
        // Perbaiki mapping: jika ada photo1/photo2 tapi tidak ada photo
        if ((task.photo1 || task.photo2) && !task.photo) {
          updateData.photo = task.photo1 || task.photo2;
          needsUpdate = true;
          console.log(`🔧 Fixed mapping for task: ${task.title}`);
        }
        
        // Update jika ada perubahan
        if (needsUpdate) {
          const { error: updateError } = await supabase
            .from('tasks')
            .update(updateData)
            .eq('id', task.id);
          
          if (updateError) {
            console.error(`❌ Error updating task ${task.title}:`, updateError);
            totalErrors++;
          } else {
            console.log(`✅ Successfully updated task: ${task.title}`);
            totalFixed++;
          }
        }
      }
    }
    
    // 5. FIX SUPERVISIONS (SUPERVISI)
    console.log('\n🔧 FIXING SUPERVISIONS (SUPERVISI)...');
    
    const { data: supervisionsData, error: supervisionsError } = await supabase
      .from('supervisions')
      .select('*')
      .eq('user_id', userId);
    
    if (!supervisionsError && supervisionsData) {
      for (const supervision of supervisionsData) {
        let needsUpdate = false;
        const updateData = {};
        
        // Cek apakah supervision tidak memiliki foto
        if (!supervision.photo && !supervision.photo1 && !supervision.photo2) {
          console.log(`🔧 Fixing supervision: ${supervision.school_name}`);
          
          // Cari di localStorage berdasarkan school dan tanggal
          const localSupervisions = localData.supervisions || [];
          const localMatch = localSupervisions.find(local => {
            const schoolMatch = (local.school || '').toLowerCase().includes((supervision.school_name || '').toLowerCase());
            const dateMatch = new Date(local.date).toDateString() === new Date(supervision.date).toDateString();
            return schoolMatch && dateMatch;
          });
          
          if (localMatch && (localMatch.photo || localMatch.photo1 || localMatch.photo2)) {
            console.log(`✅ Found photos in localStorage for supervision: ${supervision.school_name}`);
            
            if (localMatch.photo) {
              updateData.photo = localMatch.photo.startsWith('data:') ? localMatch.photo : `/uploads/${localMatch.photo}`;
              needsUpdate = true;
            }
            
            if (localMatch.photo1) {
              updateData.photo1 = localMatch.photo1.startsWith('data:') ? localMatch.photo1 : `/uploads/${localMatch.photo1}`;
              needsUpdate = true;
            }
            
            if (localMatch.photo2) {
              updateData.photo2 = localMatch.photo2.startsWith('data:') ? localMatch.photo2 : `/uploads/${localMatch.photo2}`;
              needsUpdate = true;
            }
          }
        }
        
        // Perbaiki mapping: jika ada photo1/photo2 tapi tidak ada photo
        if ((supervision.photo1 || supervision.photo2) && !supervision.photo) {
          updateData.photo = supervision.photo1 || supervision.photo2;
          needsUpdate = true;
          console.log(`🔧 Fixed mapping for supervision: ${supervision.school_name}`);
        }
        
        // Update jika ada perubahan
        if (needsUpdate) {
          const { error: updateError } = await supabase
            .from('supervisions')
            .update(updateData)
            .eq('id', supervision.id);
          
          if (updateError) {
            console.error(`❌ Error updating supervision ${supervision.school_name}:`, updateError);
            totalErrors++;
          } else {
            console.log(`✅ Successfully updated supervision: ${supervision.school_name}`);
            totalFixed++;
          }
        }
      }
    }
    
    // 6. FIX ADDITIONAL TASKS (TUGAS TAMBAHAN)
    console.log('\n🔧 FIXING ADDITIONAL TASKS (TUGAS TAMBAHAN)...');
    
    const { data: additionalTasksData, error: additionalTasksError } = await supabase
      .from('additional_tasks')
      .select('*')
      .eq('user_id', userId);
    
    if (!additionalTasksError && additionalTasksData) {
      for (const task of additionalTasksData) {
        let needsUpdate = false;
        const updateData = {};
        
        // Cek apakah additional task tidak memiliki foto
        if (!task.photo && !task.photo1 && !task.photo2) {
          console.log(`🔧 Fixing additional task: ${task.name || task.title}`);
          
          // Cari di localStorage berdasarkan nama dan tanggal
          const localAdditionalTasks = localData.additionalTasks || [];
          const localMatch = localAdditionalTasks.find(local => {
            const nameMatch = (local.name || '').toLowerCase().includes((task.name || task.title || '').toLowerCase().split(' ')[0]);
            const dateMatch = new Date(local.date).toDateString() === new Date(task.date).toDateString();
            return nameMatch && dateMatch;
          });
          
          if (localMatch && (localMatch.photo || localMatch.photo1 || localMatch.photo2)) {
            console.log(`✅ Found photos in localStorage for additional task: ${task.name || task.title}`);
            
            if (localMatch.photo) {
              updateData.photo = localMatch.photo.startsWith('data:') ? localMatch.photo : `/uploads/${localMatch.photo}`;
              needsUpdate = true;
            }
            
            if (localMatch.photo1) {
              updateData.photo1 = localMatch.photo1.startsWith('data:') ? localMatch.photo1 : `/uploads/${localMatch.photo1}`;
              needsUpdate = true;
            }
            
            if (localMatch.photo2) {
              updateData.photo2 = localMatch.photo2.startsWith('data:') ? localMatch.photo2 : `/uploads/${localMatch.photo2}`;
              needsUpdate = true;
            }
          }
        }
        
        // Perbaiki mapping: pastikan ada fallback yang benar
        if (!task.photo && task.photo1) {
          updateData.photo = task.photo1;
          needsUpdate = true;
          console.log(`🔧 Fixed mapping for additional task: ${task.name || task.title}`);
        }
        
        // Update jika ada perubahan
        if (needsUpdate) {
          const { error: updateError } = await supabase
            .from('additional_tasks')
            .update(updateData)
            .eq('id', task.id);
          
          if (updateError) {
            console.error(`❌ Error updating additional task ${task.name || task.title}:`, updateError);
            totalErrors++;
          } else {
            console.log(`✅ Successfully updated additional task: ${task.name || task.title}`);
            totalFixed++;
          }
        }
      }
    }
    
    // 7. Verifikasi hasil perbaikan
    console.log('\n🔍 VERIFIKASI HASIL PERBAIKAN...');
    
    // Re-fetch data untuk verifikasi
    const { data: verifyTasks } = await supabase.from('tasks').select('*').eq('user_id', userId);
    const { data: verifySupervisions } = await supabase.from('supervisions').select('*').eq('user_id', userId);
    const { data: verifyAdditionalTasks } = await supabase.from('additional_tasks').select('*').eq('user_id', userId);
    
    const totalActivitiesAfter = (verifyTasks?.length || 0) + (verifySupervisions?.length || 0) + (verifyAdditionalTasks?.length || 0);
    
    const activitiesWithPhotosAfter = [
      ...(verifyTasks || []).filter(t => t.photo || t.photo1 || t.photo2),
      ...(verifySupervisions || []).filter(s => s.photo || s.photo1 || s.photo2),
      ...(verifyAdditionalTasks || []).filter(a => a.photo || a.photo1 || a.photo2)
    ].length;
    
    const photoRateAfter = totalActivitiesAfter > 0 ? Math.round((activitiesWithPhotosAfter / totalActivitiesAfter) * 100) : 0;
    
    console.log(`📊 Total kegiatan setelah perbaikan: ${totalActivitiesAfter}`);
    console.log(`📸 Kegiatan dengan foto setelah perbaikan: ${activitiesWithPhotosAfter} (${photoRateAfter}%)`);
    console.log(`✅ Total berhasil diperbaiki: ${totalFixed}`);
    console.log(`❌ Total error: ${totalErrors}`);
    
    // 8. Refresh halaman reports jika ada
    if (typeof window !== 'undefined' && window.location.pathname.includes('reports')) {
      console.log('🔄 Refreshing reports page...');
      setTimeout(() => {
        window.location.reload();
      }, 2000);
    }
    
    // 9. Trigger update event untuk React
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('updateReportsData', {
        detail: { 
          message: 'Photos fixed',
          totalFixed,
          photoRate: photoRateAfter
        }
      }));
    }
    
    console.log('\n✅ FIX SEMUA FOTO SELESAI');
    console.log('📋 Silakan cek halaman reports untuk melihat hasilnya');
    console.log('📈 Kualitas kegiatan akan meningkat dengan dokumentasi foto yang lebih lengkap');
    
    return {
      totalFixed,
      totalErrors,
      photoRateAfter,
      totalActivitiesAfter,
      activitiesWithPhotosAfter
    };
    
  } catch (error) {
    console.error('❌ Error during fix:', error);
  }
};

// Jalankan fix
fixSemuaFotoTidakMunculLaporan();