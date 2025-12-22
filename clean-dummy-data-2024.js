// Script untuk membersihkan data dummy tahun 2024 dari localStorage
console.log('🧹 Membersihkan data dummy tahun 2024...');

// Fungsi untuk membersihkan data berdasarkan tahun
function cleanDummyData2024() {
  try {
    // Ambil data dari localStorage
    const localData = JSON.parse(localStorage.getItem('local-database') || '{}');
    
    let cleaned = false;
    
    // Bersihkan tasks dengan tahun 2024
    if (localData.tasks) {
      const originalTasksCount = localData.tasks.length;
      localData.tasks = localData.tasks.filter(task => {
        const taskDate = new Date(task.date || task.createdAt || task.created_at);
        const isDummy2024 = taskDate.getFullYear() === 2024;
        return !isDummy2024;
      });
      
      if (localData.tasks.length !== originalTasksCount) {
        console.log(`🗑️ Menghapus ${originalTasksCount - localData.tasks.length} tugas dummy tahun 2024`);
        cleaned = true;
      }
    }
    
    // Bersihkan supervisions dengan tahun 2024
    if (localData.supervisions) {
      const originalSupervisionsCount = localData.supervisions.length;
      localData.supervisions = localData.supervisions.filter(supervision => {
        const supervisionDate = new Date(supervision.date || supervision.createdAt || supervision.created_at);
        const isDummy2024 = supervisionDate.getFullYear() === 2024;
        return !isDummy2024;
      });
      
      if (localData.supervisions.length !== originalSupervisionsCount) {
        console.log(`🗑️ Menghapus ${originalSupervisionsCount - localData.supervisions.length} supervisi dummy tahun 2024`);
        cleaned = true;
      }
    }
    
    // Bersihkan additional tasks dengan tahun 2024
    if (localData.additionalTasks) {
      const originalAdditionalTasksCount = localData.additionalTasks.length;
      localData.additionalTasks = localData.additionalTasks.filter(task => {
        const taskDate = new Date(task.date || task.createdAt || task.created_at);
        const isDummy2024 = taskDate.getFullYear() === 2024;
        return !isDummy2024;
      });
      
      if (localData.additionalTasks.length !== originalAdditionalTasksCount) {
        console.log(`🗑️ Menghapus ${originalAdditionalTasksCount - localData.additionalTasks.length} tugas tambahan dummy tahun 2024`);
        cleaned = true;
      }
    }
    
    // Bersihkan schools dengan created_at tahun 2024 (jika ada)
    if (localData.schools) {
      const originalSchoolsCount = localData.schools.length;
      localData.schools = localData.schools.filter(school => {
        const schoolDate = new Date(school.createdAt || school.created_at);
        const isDummy2024 = schoolDate.getFullYear() === 2024;
        return !isDummy2024;
      });
      
      if (localData.schools.length !== originalSchoolsCount) {
        console.log(`🗑️ Menghapus ${originalSchoolsCount - localData.schools.length} sekolah dummy tahun 2024`);
        cleaned = true;
      }
    }
    
    if (cleaned) {
      // Simpan data yang sudah dibersihkan
      localStorage.setItem('local-database', JSON.stringify(localData));
      
      // Update individual localStorage keys juga
      if (localData.tasks) {
        localStorage.setItem('tasks_data', JSON.stringify(localData.tasks));
      }
      if (localData.supervisions) {
        localStorage.setItem('supervisions_data', JSON.stringify(localData.supervisions));
      }
      if (localData.additionalTasks) {
        localStorage.setItem('additional_tasks_data', JSON.stringify(localData.additionalTasks));
      }
      if (localData.schools) {
        localStorage.setItem('schools_data', JSON.stringify(localData.schools));
      }
      
      console.log('✅ Data dummy tahun 2024 berhasil dibersihkan!');
      console.log('📊 Data tersisa:', {
        tasks: localData.tasks?.length || 0,
        supervisions: localData.supervisions?.length || 0,
        additionalTasks: localData.additionalTasks?.length || 0,
        schools: localData.schools?.length || 0
      });
      
      // Refresh halaman untuk memperbarui dashboard
      if (confirm('Data dummy tahun 2024 telah dibersihkan. Refresh halaman untuk melihat perubahan?')) {
        window.location.reload();
      }
    } else {
      console.log('✅ Tidak ada data dummy tahun 2024 yang ditemukan');
    }
    
  } catch (error) {
    console.error('❌ Error saat membersihkan data dummy:', error);
  }
}

// Jalankan pembersihan
cleanDummyData2024();

// Juga bersihkan data dari individual localStorage keys
console.log('🧹 Membersihkan individual localStorage keys...');

['tasks_data', 'supervisions_data', 'additional_tasks_data', 'schools_data'].forEach(key => {
  try {
    const data = JSON.parse(localStorage.getItem(key) || '[]');
    if (Array.isArray(data)) {
      const originalCount = data.length;
      const cleanedData = data.filter(item => {
        const itemDate = new Date(item.date || item.createdAt || item.created_at);
        const isDummy2024 = itemDate.getFullYear() === 2024;
        return !isDummy2024;
      });
      
      if (cleanedData.length !== originalCount) {
        localStorage.setItem(key, JSON.stringify(cleanedData));
        console.log(`🗑️ Membersihkan ${originalCount - cleanedData.length} item dummy dari ${key}`);
      }
    }
  } catch (error) {
    console.log(`⚠️ Error membersihkan ${key}:`, error);
  }
});

console.log('🎉 Pembersihan data dummy tahun 2024 selesai!');
console.log('📅 Dashboard sekarang hanya menampilkan aktivitas user yang sebenarnya dengan tahun dinamis');