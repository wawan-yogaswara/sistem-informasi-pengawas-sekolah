// QUICK FIX SUPERVISI & FOTO LAPORAN
// Copy paste ke browser console di halaman Laporan

console.log('⚡ QUICK FIX: Supervisi + Foto di Laporan');

const quickFixSupervisiDanFoto = async () => {
  const userId = '421cdb28-f2af-4f1f-aa5f-c59a3d661a2e';
  
  try {
    // 1. Force user ID
    const userData = localStorage.getItem('auth_user');
    if (userData) {
      const user = JSON.parse(userData);
      user.id = userId;
      localStorage.setItem('auth_user', JSON.stringify(user));
    }
    
    // 2. Import Supabase
    const { createClient } = await import('@supabase/supabase-js');
    const supabaseUrl = 'https://fmxeboullgcewzjpql.supabase.co';
    const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZteGVib3VsbGdjZXd6anBxbCIsInJvbGUiOiJhbm9uIiwiaWF0IjoxNzM0NTk5NzI4LCJleHAiOjIwNTAxNzU3Mjh9.Ej8Ej8Ej8Ej8Ej8Ej8Ej8Ej8Ej8Ej8Ej8Ej8Ej8';
    const supabase = createClient(supabaseUrl, supabaseKey);
    
    // 3. FIX SUPERVISI - Update user_id untuk semua supervisi
    console.log('🔧 Fixing supervisi user_id...');
    
    const { data: allSupervisions } = await supabase
      .from('supervisions')
      .select('*');
    
    console.log(`📋 Found ${allSupervisions.length} total supervisions`);
    
    // Update semua supervisi yang bukan milik user yang benar
    for (const supervision of allSupervisions) {
      if (supervision.user_id !== userId) {
        await supabase
          .from('supervisions')
          .update({ user_id: userId })
          .eq('id', supervision.id);
        console.log(`✅ Fixed supervision: ${supervision.school || supervision.school_name}`);
      }
    }
    
    // 4. Verify supervisi fix
    const { data: userSupervisions } = await supabase
      .from('supervisions')
      .select('*')
      .eq('user_id', userId);
    
    console.log(`✅ After fix - supervisions for user: ${userSupervisions.length}`);
    
    // 5. Check foto data untuk semua tabel
    console.log('📸 Checking photo data...');
    
    // Check additional_tasks photos
    const { data: additionalTasks } = await supabase
      .from('additional_tasks')
      .select('*')
      .eq('user_id', userId);
    
    console.log(`📸 Additional tasks: ${additionalTasks.length}`);
    additionalTasks.forEach((task, i) => {
      console.log(`📸 Task ${i+1}: ${task.title}`, {
        photo: task.photo ? 'YES' : 'NO',
        photo2: task.photo2 ? 'YES' : 'NO'
      });
    });
    
    // Check tasks photos
    const { data: tasks } = await supabase
      .from('tasks')
      .select('*')
      .eq('user_id', userId);
    
    console.log(`📸 Tasks: ${tasks.length}`);
    tasks.forEach((task, i) => {
      console.log(`📸 Task ${i+1}: ${task.title || 'Tugas Harian'}`, {
        photo1: task.photo1 ? 'YES' : 'NO',
        photo2: task.photo2 ? 'YES' : 'NO'
      });
    });
    
    // Check supervisions photos
    console.log(`📸 Supervisions: ${userSupervisions.length}`);
    userSupervisions.forEach((supervision, i) => {
      console.log(`📸 Supervision ${i+1}: ${supervision.school || supervision.school_name}`, {
        photo1: supervision.photo1 ? 'YES' : 'NO',
        photo2: supervision.photo2 ? 'YES' : 'NO'
      });
    });
    
    // 6. Clear cache dan refresh
    localStorage.removeItem('reports_activities_cache');
    console.log('✅ Cache cleared');
    
    console.log('🔄 Refreshing page in 2 seconds...');
    setTimeout(() => {
      window.location.reload();
    }, 2000);
    
  } catch (error) {
    console.error('❌ Error:', error);
  }
};

// Run the fix
quickFixSupervisiDanFoto();