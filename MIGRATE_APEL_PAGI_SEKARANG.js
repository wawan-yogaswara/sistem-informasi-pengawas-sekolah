// MIGRATE APEL PAGI SEKARANG - Copy paste ke console
const migrateApelPagiSekarang = async () => {
  console.log('🚀 MIGRASI APEL PAGI DIMULAI...');
  
  try {
    // 1. Ambil data dari localStorage
    const localData = JSON.parse(localStorage.getItem('local-database') || '{}');
    
    if (!localData.additionalTasks) {
      console.log('❌ Tidak ada data additionalTasks di localStorage');
      return;
    }
    
    // 2. Filter data Apel Pagi
    const apelTasks = localData.additionalTasks.filter(task => 
      task.name && task.name.toLowerCase().includes('apel')
    );
    
    console.log(`📋 Ditemukan ${apelTasks.length} data Apel Pagi di localStorage`);
    
    if (apelTasks.length === 0) {
      console.log('❌ Tidak ada data Apel Pagi di localStorage');
      return;
    }
    
    // 3. Tampilkan data yang akan dimigrasi
    apelTasks.forEach((task, i) => {
      console.log(`${i+1}. ${task.name} - ${task.date}`);
    });
    
    // 4. Get user ID yang benar
    const authUser = localStorage.getItem('auth_user');
    let userId = 'wawan-user'; // default
    
    if (authUser) {
      const user = JSON.parse(authUser);
      userId = user.id || user.username || 'wawan-user';
    }
    
    console.log('👤 User ID untuk migrasi:', userId);
    
    // 5. Migrasi setiap data Apel Pagi
    let berhasil = 0;
    let gagal = 0;
    
    for (const task of apelTasks) {
      try {
        console.log(`📤 Migrasi: ${task.name}...`);
        
        const response = await fetch('/api/tasks', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
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
          const result = await response.json();
          console.log(`✅ Berhasil: ${task.name} (ID: ${result.id})`);
          berhasil++;
        } else {
          const error = await response.text();
          console.log(`❌ Gagal: ${task.name} - ${error}`);
          gagal++;
        }
        
        // Delay untuk menghindari rate limiting
        await new Promise(resolve => setTimeout(resolve, 500));
        
      } catch (error) {
        console.error(`❌ Error migrasi ${task.name}:`, error);
        gagal++;
      }
    }
    
    // 6. Hasil migrasi
    console.log('\n📊 HASIL MIGRASI:');
    console.log(`✅ Berhasil: ${berhasil}`);
    console.log(`❌ Gagal: ${gagal}`);
    console.log(`📋 Total: ${apelTasks.length}`);
    
    if (berhasil > 0) {
      console.log('\n🎉 MIGRASI SELESAI!');
      console.log('🔄 Refresh halaman dalam 3 detik...');
      
      // Auto refresh setelah 3 detik
      setTimeout(() => {
        window.location.reload();
      }, 3000);
    } else {
      console.log('\n❌ Tidak ada data yang berhasil dimigrasi');
    }
    
  } catch (error) {
    console.error('❌ Error migrasi:', error);
  }
};

// JALANKAN MIGRASI
migrateApelPagiSekarang();