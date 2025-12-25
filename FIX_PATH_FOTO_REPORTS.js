// FIX PATH FOTO DI REPORTS - APEL PAGI DAN MONITORING BPMU
// Copy paste ke browser console dan jalankan

const fixPathFotoReports = async () => {
  console.log('🔧 FIX PATH FOTO DI REPORTS...');
  
  try {
    // 1. Cek apakah kita di halaman reports
    if (!window.location.pathname.includes('reports')) {
      console.log('❌ Bukan di halaman reports. Silakan buka halaman reports terlebih dahulu.');
      return;
    }
    
    // 2. Ambil data activities yang sedang dimuat
    const activities = window.allActivities || [];
    console.log(`📋 Total activities: ${activities.length}`);
    
    // 3. Filter activities yang mengandung "apel" atau "monitoring"
    const targetActivities = activities.filter(activity => {
      const title = (activity.title || '').toLowerCase();
      return title.includes('apel') || title.includes('monitoring') || title.includes('bpmu');
    });
    
    console.log(`🎯 Target activities (Apel Pagi & Monitoring): ${targetActivities.length}`);
    
    // 4. Analisis masalah foto
    let fixedCount = 0;
    
    targetActivities.forEach((activity, index) => {
      console.log(`\n📋 Activity ${index + 1}: ${activity.title}`);
      console.log(`📅 Date: ${activity.date}`);
      console.log(`📸 Photo1: ${activity.photo1 || 'TIDAK ADA'}`);
      console.log(`📸 Photo2: ${activity.photo2 || 'TIDAK ADA'}`);
      
      let needsFix = false;
      
      // Cek apakah foto1 perlu diperbaiki
      if (activity.photo1) {
        if (!activity.photo1.startsWith('data:') && !activity.photo1.startsWith('http') && !activity.photo1.startsWith('/uploads/')) {
          console.log(`🔧 Photo1 needs path fix: ${activity.photo1}`);
          activity.photo1 = `/uploads/${activity.photo1}`;
          needsFix = true;
        }
      }
      
      // Cek apakah foto2 perlu diperbaiki
      if (activity.photo2) {
        if (!activity.photo2.startsWith('data:') && !activity.photo2.startsWith('http') && !activity.photo2.startsWith('/uploads/')) {
          console.log(`🔧 Photo2 needs path fix: ${activity.photo2}`);
          activity.photo2 = `/uploads/${activity.photo2}`;
          needsFix = true;
        }
      }
      
      if (needsFix) {
        fixedCount++;
        console.log(`✅ Fixed paths for: ${activity.title}`);
      }
    });
    
    console.log(`\n🔧 Fixed ${fixedCount} activities`);
    
    // 5. Update window.allActivities jika ada
    if (window.allActivities) {
      window.allActivities = activities;
      console.log('✅ Updated window.allActivities');
    }
    
    // 6. Trigger re-render jika ada React component
    if (window.React && window.ReactDOM) {
      console.log('🔄 Triggering React re-render...');
      // Dispatch custom event untuk trigger re-render
      window.dispatchEvent(new CustomEvent('updateReportsData', {
        detail: { activities: activities }
      }));
    }
    
    // 7. Cek foto yang sekarang bisa ditampilkan
    setTimeout(() => {
      const photoElements = document.querySelectorAll('img[src*="data:"], img[src*="/uploads/"], img[src*="base64"]');
      console.log(`📸 Photo elements found in DOM: ${photoElements.length}`);
      
      // Log broken images
      const brokenImages = Array.from(document.querySelectorAll('img')).filter(img => 
        img.naturalWidth === 0 && img.complete
      );
      
      console.log(`❌ Broken images: ${brokenImages.length}`);
      brokenImages.forEach((img, index) => {
        console.log(`❌ Broken image ${index + 1}: ${img.src}`);
      });
      
      // Test foto dengan path yang diperbaiki
      targetActivities.forEach(activity => {
        if (activity.photo1) {
          const testImg = new Image();
          testImg.onload = () => console.log(`✅ Photo1 accessible: ${activity.title}`);
          testImg.onerror = () => console.log(`❌ Photo1 not accessible: ${activity.title} - ${activity.photo1}`);
          testImg.src = activity.photo1;
        }
        
        if (activity.photo2) {
          const testImg = new Image();
          testImg.onload = () => console.log(`✅ Photo2 accessible: ${activity.title}`);
          testImg.onerror = () => console.log(`❌ Photo2 not accessible: ${activity.title} - ${activity.photo2}`);
          testImg.src = activity.photo2;
        }
      });
    }, 1000);
    
    // 8. Alternatif: Coba ambil foto dari localStorage jika masih tidak ada
    console.log('\n🔍 CHECKING LOCALSTORAGE FOR MISSING PHOTOS...');
    
    const localData = JSON.parse(localStorage.getItem('local_database') || '{}');
    const localAdditionalTasks = localData.additionalTasks || [];
    
    targetActivities.forEach(activity => {
      if (!activity.photo1 && !activity.photo2) {
        console.log(`🔍 Looking for photos for: ${activity.title}`);
        
        // Cari di localStorage berdasarkan nama yang mirip
        const localMatch = localAdditionalTasks.find(local => {
          const localName = (local.name || '').toLowerCase();
          const activityTitle = activity.title.toLowerCase();
          return localName.includes('apel') && activityTitle.includes('apel') ||
                 localName.includes('monitoring') && activityTitle.includes('monitoring');
        });
        
        if (localMatch && (localMatch.photo1 || localMatch.photo2)) {
          console.log(`✅ Found photos in localStorage for: ${activity.title}`);
          
          if (localMatch.photo1) {
            activity.photo1 = localMatch.photo1.startsWith('data:') ? localMatch.photo1 : `/uploads/${localMatch.photo1}`;
          }
          
          if (localMatch.photo2) {
            activity.photo2 = localMatch.photo2.startsWith('data:') ? localMatch.photo2 : `/uploads/${localMatch.photo2}`;
          }
          
          console.log(`📸 Updated photos: photo1=${!!activity.photo1}, photo2=${!!activity.photo2}`);
        }
      }
    });
    
    console.log('\n✅ FIX PATH FOTO SELESAI');
    console.log('📋 Silakan cek apakah foto sekarang muncul di halaman reports');
    console.log('🔄 Jika masih belum muncul, coba refresh halaman');
    
  } catch (error) {
    console.error('❌ Error during fix:', error);
  }
};

// Jalankan fix
fixPathFotoReports();