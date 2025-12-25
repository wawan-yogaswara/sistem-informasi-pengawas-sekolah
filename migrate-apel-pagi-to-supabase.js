// SCRIPT MIGRASI DATA APEL PAGI KE SUPABASE - SIMPLE VERSION
// Copy paste script ini ke browser console dan jalankan

const migrateApelPagi = async () => {
  try {
    console.log('🔄 Migrasi data Apel Pagi...');
    
    // Ambil data dari localStorage
    const localData = JSON.parse(localStorage.getItem('local-database') || '{}');
    const apelTasks = localData.additionalTasks?.filter(task => 
      task.name && task.name.toLowerCase().includes('apel')
    ) || [];
    
    console.log(`📋 Ditemukan ${apelTasks.length} data Apel Pagi`);
    
    if (apelTasks.length === 0) {
      console.log('❌ Tidak ada data Apel Pagi');
      return;
    }
    
    // Get user ID
    const currentUser = JSON.parse(localStorage.getItem('auth_user') || '{}');
    const userId = currentUser.id || currentUser.username || 'wawan-user';
    
    // Migrasi setiap data
    let success = 0;
    for (const task of apelTasks) {
      try {
        const response = await fetch('/api/tasks', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            title: task.name,
            description: task.description || 'Apel pagi rutin di kantor dinas',
            date: task.date,
            location: task.location || 'KCD XI',
            organizer: task.organizer || 'KCD XI',
            user_id: userId
          })
        });
        
        if (response.ok) {
          console.log(`✅ Berhasil: ${task.name}`);
          success++;
        } else {
          console.log(`❌ Gagal: ${task.name}`);
        }
        
        await new Promise(resolve => setTimeout(resolve, 500));
      } catch (error) {
        console.error(`❌ Error: ${task.name}`, error);
      }
    }
    
    console.log(`\n📊 Hasil: ${success}/${apelTasks.length} berhasil`);
    if (success > 0) {
      console.log('🎉 Refresh halaman laporan untuk melihat data!');
    }
  } catch (error) {
    console.error('❌ Error migrasi:', error);
  }
};

// Jalankan
migrateApelPagi();