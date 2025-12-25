// Script untuk test apakah tugas tambahan sudah muncul di laporan
// Jalankan di browser console setelah refresh halaman laporan

console.log('🧪 TESTING: Tugas tambahan di halaman laporan...');

// 1. Check if we're on reports page
const currentPath = window.location.pathname;
console.log('📍 Current page:', currentPath);

if (!currentPath.includes('reports')) {
  console.log('⚠️ Please navigate to reports page first');
} else {
  console.log('✅ On reports page');
  
  // 2. Wait for page to load and check for activities
  setTimeout(() => {
    // Check for activity cards
    const activityCards = document.querySelectorAll('[class*="card"], .card');
    console.log(`📊 Found ${activityCards.length} activity cards on page`);
    
    // Check specifically for "Tugas Tambahan" activities
    let tugasTambahanCount = 0;
    let tugasPokokCount = 0;
    let supervisiCount = 0;
    
    activityCards.forEach(card => {
      const cardText = card.textContent || '';
      if (cardText.includes('Tugas Tambahan')) {
        tugasTambahanCount++;
      } else if (cardText.includes('Tugas Pokok')) {
        tugasPokokCount++;
      } else if (cardText.includes('Supervisi')) {
        supervisiCount++;
      }
    });
    
    console.log('📋 Activity breakdown:');
    console.log(`  - Tugas Tambahan: ${tugasTambahanCount}`);
    console.log(`  - Tugas Pokok: ${tugasPokokCount}`);
    console.log(`  - Supervisi: ${supervisiCount}`);
    
    // Check summary statistics
    const statElements = document.querySelectorAll('[class*="stat"], [class*="text-2xl"]');
    console.log(`📊 Found ${statElements.length} stat elements`);
    
    statElements.forEach((el, index) => {
      const text = el.textContent || '';
      const parent = el.parentElement?.textContent || '';
      if (parent.toLowerCase().includes('tambahan')) {
        console.log(`📈 Tugas Tambahan stat: ${text}`);
      }
    });
    
    // Overall result
    if (tugasTambahanCount > 0) {
      console.log('✅ SUCCESS: Tugas Tambahan activities found in reports!');
      console.log('🎉 Fix berhasil - data tugas tambahan sudah muncul di laporan');
    } else {
      console.log('❌ ISSUE: No Tugas Tambahan activities found');
      console.log('🔍 Running additional diagnostics...');
      
      // Additional diagnostics
      const userData = localStorage.getItem('auth_user');
      if (userData) {
        const currentUser = JSON.parse(userData);
        const userId = currentUser.username || currentUser.id;
        
        // Test direct query
        supabase
          .from('additional_tasks')
          .select('*')
          .eq('user_id', userId)
          .then(({ data, error }) => {
            if (error) {
              console.error('❌ Direct query error:', error);
            } else {
              console.log(`🔍 Direct query result: ${data?.length || 0} tasks for user ${userId}`);
              if (data && data.length > 0) {
                console.log('⚠️ Data exists but not showing in UI - possible React state issue');
                console.log('💡 Try hard refresh (Ctrl+F5) or clear browser cache');
              } else {
                console.log('⚠️ No data found for current user');
                console.log('💡 Check if user_id matches between localStorage and database');
              }
            }
          });
      }
    }
    
    // Check for loading states
    const loadingElements = document.querySelectorAll('[class*="loading"], [class*="spinner"]');
    if (loadingElements.length > 0) {
      console.log('⏳ Page still loading, wait a moment and run test again');
    }
    
  }, 2000);
}

// 3. Test export functionality
setTimeout(() => {
  console.log('🧪 Testing export functionality...');
  
  const exportButtons = document.querySelectorAll('button[class*="red"], button:contains("PDF")');
  console.log(`📄 Found ${exportButtons.length} potential export buttons`);
  
  if (exportButtons.length > 0) {
    console.log('✅ Export buttons found - PDF export should include tugas tambahan');
  }
  
}, 3000);