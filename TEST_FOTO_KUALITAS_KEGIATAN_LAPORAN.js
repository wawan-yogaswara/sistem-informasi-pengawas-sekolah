// TEST FOTO KUALITAS KEGIATAN DI LAPORAN
// Copy paste ke browser console di halaman reports dan jalankan

const testFotoKualitasKegiatanLaporan = async () => {
  console.log('🧪 TEST FOTO KUALITAS KEGIATAN DI LAPORAN...');
  
  try {
    // 1. Cek apakah di halaman reports
    if (!window.location.pathname.includes('reports')) {
      console.log('❌ Bukan di halaman reports. Silakan buka halaman reports terlebih dahulu.');
      return;
    }
    
    // 2. Tunggu data dimuat
    console.log('⏳ Menunggu data dimuat...');
    await new Promise(resolve => setTimeout(resolve, 3000));
    
    // 3. Ambil data activities dari window atau DOM
    let activities = window.allActivities || [];
    
    if (activities.length === 0) {
      console.log('🔍 Mencoba mengambil data dari React component...');
      // Coba ambil dari React component state jika ada
      const reactFiberKey = Object.keys(document.querySelector('#root') || {}).find(key => key.startsWith('__reactFiber'));
      if (reactFiberKey) {
        // Implementasi untuk mengambil state dari React component
        console.log('🔍 React fiber key found, trying to extract data...');
      }
    }
    
    console.log(`📊 Total activities loaded: ${activities.length}`);
    
    if (activities.length === 0) {
      console.log('❌ Tidak ada data activities. Coba refresh halaman.');
      return;
    }
    
    // 4. Analisis foto per jenis kegiatan
    console.log('\n📊 ANALISIS FOTO PER JENIS KEGIATAN:');
    
    const tugasPokok = activities.filter(a => a.type === 'Tugas Pokok');
    const supervisi = activities.filter(a => a.type === 'Supervisi');
    const tugasTambahan = activities.filter(a => a.type === 'Tugas Tambahan');
    
    // Analisis Tugas Pokok
    const tugasPokokWithPhoto = tugasPokok.filter(a => a.photo1 || a.photo2);
    const tugasPokokPhotoRate = tugasPokok.length > 0 ? Math.round((tugasPokokWithPhoto.length / tugasPokok.length) * 100) : 0;
    
    console.log(`📋 Tugas Pokok: ${tugasPokok.length} total, ${tugasPokokWithPhoto.length} dengan foto (${tugasPokokPhotoRate}%)`);
    
    // Analisis Supervisi
    const supervisiWithPhoto = supervisi.filter(a => a.photo1 || a.photo2);
    const supervisiPhotoRate = supervisi.length > 0 ? Math.round((supervisiWithPhoto.length / supervisi.length) * 100) : 0;
    
    console.log(`🔍 Supervisi: ${supervisi.length} total, ${supervisiWithPhoto.length} dengan foto (${supervisiPhotoRate}%)`);
    
    // Analisis Tugas Tambahan
    const tugasTambahanWithPhoto = tugasTambahan.filter(a => a.photo1 || a.photo2);
    const tugasTambahanPhotoRate = tugasTambahan.length > 0 ? Math.round((tugasTambahanWithPhoto.length / tugasTambahan.length) * 100) : 0;
    
    console.log(`➕ Tugas Tambahan: ${tugasTambahan.length} total, ${tugasTambahanWithPhoto.length} dengan foto (${tugasTambahanPhotoRate}%)`);
    
    // 5. Hitung kualitas keseluruhan
    const totalActivities = activities.length;
    const totalWithPhotos = tugasPokokWithPhoto.length + supervisiWithPhoto.length + tugasTambahanWithPhoto.length;
    const overallPhotoRate = totalActivities > 0 ? Math.round((totalWithPhotos / totalActivities) * 100) : 0;
    
    console.log(`\n📈 KUALITAS KESELURUHAN: ${totalWithPhotos}/${totalActivities} kegiatan dengan foto (${overallPhotoRate}%)`);
    
    // Tentukan level kualitas
    let qualityLevel = '';
    let qualityColor = '';
    if (overallPhotoRate >= 90) {
      qualityLevel = 'SANGAT BAIK';
      qualityColor = '🟢';
    } else if (overallPhotoRate >= 75) {
      qualityLevel = 'BAIK';
      qualityColor = '🟡';
    } else if (overallPhotoRate >= 50) {
      qualityLevel = 'CUKUP';
      qualityColor = '🟠';
    } else {
      qualityLevel = 'KURANG';
      qualityColor = '🔴';
    }
    
    console.log(`${qualityColor} Level Kualitas: ${qualityLevel}`);
    
    // 6. Test foto di DOM
    console.log('\n🖼️ TEST FOTO DI DOM:');
    
    // Cari semua elemen img di halaman
    const allImages = document.querySelectorAll('img');
    const photoImages = Array.from(allImages).filter(img => 
      img.src.includes('data:') || 
      img.src.includes('/uploads/') || 
      img.src.includes('base64') ||
      img.alt.toLowerCase().includes('foto')
    );
    
    console.log(`🖼️ Total elemen img di halaman: ${allImages.length}`);
    console.log(`📸 Elemen foto kegiatan: ${photoImages.length}`);
    
    // Test loading foto
    let loadedPhotos = 0;
    let brokenPhotos = 0;
    
    photoImages.forEach((img, index) => {
      if (img.complete) {
        if (img.naturalWidth > 0) {
          loadedPhotos++;
          console.log(`✅ Foto ${index + 1} loaded: ${img.src.substring(0, 50)}...`);
        } else {
          brokenPhotos++;
          console.log(`❌ Foto ${index + 1} broken: ${img.src.substring(0, 50)}...`);
        }
      } else {
        console.log(`⏳ Foto ${index + 1} loading: ${img.src.substring(0, 50)}...`);
      }
    });
    
    console.log(`✅ Foto berhasil dimuat: ${loadedPhotos}`);
    console.log(`❌ Foto gagal dimuat: ${brokenPhotos}`);
    
    // 7. Test foto untuk kegiatan spesifik
    console.log('\n🔍 TEST FOTO KEGIATAN SPESIFIK:');
    
    // Cari kegiatan yang sering bermasalah
    const apelPagi = activities.filter(a => a.title.toLowerCase().includes('apel'));
    const monitoring = activities.filter(a => a.title.toLowerCase().includes('monitoring'));
    
    console.log(`📋 Kegiatan Apel Pagi: ${apelPagi.length}`);
    apelPagi.forEach((activity, index) => {
      console.log(`📸 Apel ${index + 1}: ${activity.title}`, {
        hasPhoto1: !!activity.photo1,
        hasPhoto2: !!activity.photo2,
        photo1Type: activity.photo1 ? (activity.photo1.startsWith('data:') ? 'base64' : 'file') : 'none',
        photo2Type: activity.photo2 ? (activity.photo2.startsWith('data:') ? 'base64' : 'file') : 'none'
      });
    });
    
    console.log(`📋 Kegiatan Monitoring: ${monitoring.length}`);
    monitoring.forEach((activity, index) => {
      console.log(`📸 Monitoring ${index + 1}: ${activity.title}`, {
        hasPhoto1: !!activity.photo1,
        hasPhoto2: !!activity.photo2,
        photo1Type: activity.photo1 ? (activity.photo1.startsWith('data:') ? 'base64' : 'file') : 'none',
        photo2Type: activity.photo2 ? (activity.photo2.startsWith('data:') ? 'base64' : 'file') : 'none'
      });
    });
    
    // 8. Simulasi perhitungan kualitas PDF
    console.log('\n📊 SIMULASI KUALITAS PDF:');
    
    const activitiesWithPhotos = activities.filter(a => a.photo1 || a.photo2).length;
    const activitiesWithDescription = activities.filter(a => a.description && a.description.length > 50).length;
    const activitiesThisMonth = activities.filter(a => {
      const activityDate = new Date(a.date);
      const currentDate = new Date();
      return activityDate.getMonth() === currentDate.getMonth() && 
             activityDate.getFullYear() === currentDate.getFullYear();
    }).length;
    
    const photoDocumentationRate = totalActivities > 0 ? Math.round((activitiesWithPhotos / totalActivities) * 100) : 0;
    const descriptionCompleteness = totalActivities > 0 ? Math.round((activitiesWithDescription / totalActivities) * 100) : 0;
    const activityConsistency = totalActivities > 0 ? Math.min(100, Math.round((activitiesThisMonth / 3) * 100)) : 0;
    
    const overallQuality = Math.round((photoDocumentationRate + descriptionCompleteness + activityConsistency) / 3);
    
    console.log(`📸 Dokumentasi Foto: ${photoDocumentationRate}%`);
    console.log(`📝 Kelengkapan Deskripsi: ${descriptionCompleteness}%`);
    console.log(`📅 Konsistensi Kegiatan: ${activityConsistency}%`);
    console.log(`🎯 Skor Kualitas Keseluruhan: ${overallQuality}%`);
    
    // 9. Rekomendasi
    console.log('\n💡 REKOMENDASI:');
    
    if (photoDocumentationRate < 75) {
      console.log(`📸 Upload foto untuk ${totalActivities - activitiesWithPhotos} kegiatan yang belum memiliki foto`);
    }
    
    if (brokenPhotos > 0) {
      console.log(`🔧 Perbaiki ${brokenPhotos} foto yang gagal dimuat`);
    }
    
    if (overallPhotoRate < 90) {
      console.log('📈 Tingkatkan dokumentasi foto untuk mencapai kualitas "Sangat Baik"');
    }
    
    console.log('🔄 Refresh halaman secara berkala untuk memastikan foto terbaru dimuat');
    
    // 10. Export hasil untuk analisis lebih lanjut
    const testResults = {
      totalActivities,
      totalWithPhotos,
      overallPhotoRate,
      qualityLevel,
      tugasPokokPhotoRate,
      supervisiPhotoRate,
      tugasTambahanPhotoRate,
      loadedPhotos,
      brokenPhotos,
      photoDocumentationRate,
      overallQuality
    };
    
    console.log('\n📋 HASIL TEST:');
    console.table(testResults);
    
    console.log('\n✅ TEST SELESAI');
    console.log('📊 Gunakan hasil ini untuk meningkatkan kualitas dokumentasi kegiatan');
    
    return testResults;
    
  } catch (error) {
    console.error('❌ Error during test:', error);
  }
};

// Jalankan test
testFotoKualitasKegiatanLaporan();