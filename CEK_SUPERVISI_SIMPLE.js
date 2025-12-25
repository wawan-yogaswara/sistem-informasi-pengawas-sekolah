// CEK SUPERVISI SIMPLE
// Copy paste ke browser console di halaman mana saja

console.log('🔍 CEK SUPERVISI SIMPLE - Halaman vs Laporan');

const cekSupervisiSimple = async () => {
  const userId = '421cdb28-f2af-4f1f-aa5f-c59a3d661a2e';
  
  try {
    // 1. Cek data supervisi langsung dari API
    console.log('📡 Mengecek data supervisi dari API...');
    
    const response = await fetch(`/api/supervisions?user_id=${encodeURIComponent(userId)}`);
    if (response.ok) {
      const supervisions = await response.json();
      console.log(`📊 Total supervisi di API: ${supervisions.length}`);
      
      supervisions.forEach((supervision, index) => {
        console.log(`📊 Supervisi ${index + 1}:`, {
          id: supervision.id,
          school: supervision.school || supervision.school_name,
          date: supervision.date,
          type: supervision.type,
          user_id: supervision.user_id
        });
      });
      
      if (supervisions.length === 0) {
        console.log('⚠️ MASALAH: Tidak ada supervisi ditemukan untuk user ini');
        
        // Cek semua supervisi tanpa filter user_id
        const allResponse = await fetch('/api/supervisions');
        if (allResponse.ok) {
          const allSupervisions = await allResponse.json();
          console.log(`📋 Total semua supervisi: ${allSupervisions.length}`);
          
          allSupervisions.forEach((supervision, index) => {
            console.log(`📋 Semua supervisi ${index + 1}:`, {
              id: supervision.id,
              school: supervision.school || supervision.school_name,
              user_id: supervision.user_id,
              date: supervision.date
            });
          });
        }
      }
      
    } else {
      console.error('❌ API error:', response.status);
    }
    
    // 2. Cek data yang dimuat di halaman laporan
    console.log('📊 Mengecek data di halaman laporan...');
    
    // Simulasi loading data seperti di Reports page
    const activities = [];
    
    // Fetch supervisions
    const supervisionsResponse = await fetch(`/api/supervisions?user_id=${encodeURIComponent(userId)}`);
    if (supervisionsResponse.ok) {
      const supervisionsData = await supervisionsResponse.json();
      console.log(`📊 Supervisi untuk laporan: ${supervisionsData.length}`);
      
      // Fetch schools
      const schoolsResponse = await fetch('/api/schools');
      const schoolsData = schoolsResponse.ok ? await schoolsResponse.json() : [];
      
      supervisionsData.forEach((supervision) => {
        const school = schoolsData.find((s) => s.id === supervision.school_id);
        
        activities.push({
          id: supervision.id,
          type: 'Supervisi',
          title: `Supervisi ${school?.name || supervision.school || supervision.school_name || 'Sekolah'}`,
          date: supervision.date || supervision.created_at,
          location: school?.name || supervision.school || supervision.school_name || 'Sekolah Binaan',
          organizer: 'Pengawas Sekolah',
          description: supervision.findings || supervision.recommendations || '',
          photo1: supervision.photo1,
          photo2: supervision.photo2,
          createdAt: supervision.created_at,
          source: 'supabase'
        });
      });
      
      const supervisiCount = activities.filter(a => a.type === 'Supervisi').length;
      console.log(`📊 Supervisi yang akan muncul di laporan: ${supervisiCount}`);
      
      activities.forEach((activity, index) => {
        if (activity.type === 'Supervisi') {
          console.log(`📊 Laporan supervisi ${index + 1}:`, {
            title: activity.title,
            location: activity.location,
            date: activity.date
          });
        }
      });
    }
    
  } catch (error) {
    console.error('❌ Error:', error);
  }
};

// Jalankan pengecekan
cekSupervisiSimple();