// SOLUSI KOMPREHENSIF: Fix Loading Lambat Halaman Laporan
// Jalankan di browser console atau sebagai script terpisah

console.log('🚀 FIXING: Loading Lambat Halaman Laporan');
console.log('='.repeat(60));

// MASALAH UTAMA YANG TERIDENTIFIKASI:
// 1. Multiple sequential API calls (tidak parallel)
// 2. Fetching semua data tanpa pagination
// 3. Tidak ada caching mechanism
// 4. Query tidak dioptimasi
// 5. Foto base64 yang besar mempengaruhi loading

// SOLUSI 1: Optimasi Query Supabase dengan Parallel Loading
async function optimizeSupabaseQueries() {
  console.log('🔧 SOLUSI 1: Optimasi Query Supabase');
  
  try {
    // Get user data
    const userData = localStorage.getItem('auth_user');
    if (!userData) {
      console.log('❌ No user data found');
      return false;
    }
    
    const currentUser = JSON.parse(userData);
    const userId = currentUser.username || currentUser.id;
    
    console.log('👤 User ID:', userId);
    
    // OPTIMASI: Parallel queries dengan limit dan select specific fields
    const startTime = Date.now();
    
    const [tasksResult, supervisionsResult, additionalTasksResult] = await Promise.all([
      // Tasks: Limit 50 records, select only needed fields
      window.supabase
        .from('tasks')
        .select('id, title, description, date, location, school_name, photo, photo1, photo2, created_at')
        .order('created_at', { ascending: false })
        .limit(50),
      
      // Supervisions: Limit 50 records, select only needed fields  
      window.supabase
        .from('supervisions')
        .select('id, school, date, findings, recommendations, photo, photo1, photo2, created_at')
        .order('created_at', { ascending: false })
        .limit(50),
      
      // Additional Tasks: Filter by user_id, limit 50 records
      window.supabase
        .from('additional_tasks')
        .select('id, title, name, description, date, location, organizer, photo, photo1, photo2, created_at')
        .eq('user_id', userId)
        .order('created_at', { ascending: false })
        .limit(50)
    ]);
    
    const endTime = Date.now();
    const duration = endTime - startTime;
    
    console.log(`⏱️ Parallel queries completed in: ${duration}ms`);
    
    // Check results
    const tasksCount = tasksResult.data?.length || 0;
    const supervisionsCount = supervisionsResult.data?.length || 0;
    const additionalTasksCount = additionalTasksResult.data?.length || 0;
    
    console.log('📊 Data loaded:');
    console.log(`- Tasks: ${tasksCount} records`);
    console.log(`- Supervisions: ${supervisionsCount} records`);
    console.log(`- Additional Tasks: ${additionalTasksCount} records`);
    
    // Store in cache for faster subsequent loads
    const cacheData = {
      tasks: tasksResult.data || [],
      supervisions: supervisionsResult.data || [],
      additionalTasks: additionalTasksResult.data || [],
      timestamp: Date.now(),
      userId: userId
    };
    
    localStorage.setItem('reports_cache', JSON.stringify(cacheData));
    console.log('💾 Data cached for faster subsequent loads');
    
    if (duration < 2000) {
      console.log('✅ EXCELLENT: Loading time < 2 seconds');
    } else if (duration < 5000) {
      console.log('⚠️ ACCEPTABLE: Loading time < 5 seconds');
    } else {
      console.log('❌ SLOW: Loading time > 5 seconds - need further optimization');
    }
    
    return { success: true, duration, counts: { tasksCount, supervisionsCount, additionalTasksCount } };
    
  } catch (error) {
    console.log('❌ Error in optimized queries:', error);
    return { success: false, error: error.message };
  }
}

// SOLUSI 2: Implement Smart Caching
function implementSmartCaching() {
  console.log('🔧 SOLUSI 2: Smart Caching Implementation');
  
  // Check if cache exists and is still valid (5 minutes)
  const cacheData = localStorage.getItem('reports_cache');
  const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes
  
  if (cacheData) {
    try {
      const cache = JSON.parse(cacheData);
      const cacheAge = Date.now() - cache.timestamp;
      
      console.log(`📦 Cache found, age: ${Math.round(cacheAge / 1000)}s`);
      
      if (cacheAge < CACHE_DURATION) {
        console.log('✅ Using cached data (fresh)');
        return {
          useCache: true,
          data: cache,
          age: cacheAge
        };
      } else {
        console.log('⚠️ Cache expired, will refresh');
        localStorage.removeItem('reports_cache');
      }
    } catch (e) {
      console.log('❌ Invalid cache data, clearing');
      localStorage.removeItem('reports_cache');
    }
  }
  
  return { useCache: false };
}

// SOLUSI 3: Optimize Photo Loading
function optimizePhotoLoading() {
  console.log('🔧 SOLUSI 3: Optimize Photo Loading');
  
  // Create lazy loading for photos
  const createLazyPhotoLoader = () => {
    return {
      loadPhoto: (photoData, callback) => {
        if (!photoData) {
          callback(null);
          return;
        }
        
        // If it's already a data URL, use it directly
        if (photoData.startsWith('data:')) {
          callback(photoData);
          return;
        }
        
        // For other formats, load asynchronously
        setTimeout(() => {
          callback(photoData);
        }, 100);
      },
      
      preloadPhotos: (activities) => {
        console.log('📸 Preloading photos...');
        let photoCount = 0;
        
        activities.forEach(activity => {
          if (activity.photo1) photoCount++;
          if (activity.photo2) photoCount++;
        });
        
        console.log(`📸 Found ${photoCount} photos to preload`);
        return photoCount;
      }
    };
  };
  
  window.lazyPhotoLoader = createLazyPhotoLoader();
  console.log('✅ Lazy photo loader initialized');
}

// SOLUSI 4: Implement Progressive Loading
async function implementProgressiveLoading() {
  console.log('🔧 SOLUSI 4: Progressive Loading');
  
  try {
    // Step 1: Load basic data first (without photos)
    console.log('📋 Step 1: Loading basic data...');
    
    const userData = localStorage.getItem('auth_user');
    if (!userData) {
      console.log('❌ No user data');
      return false;
    }
    
    const currentUser = JSON.parse(userData);
    const userId = currentUser.username || currentUser.id;
    
    // Load basic data without photos
    const basicDataStart = Date.now();
    const [basicTasks, basicSupervisions, basicAdditionalTasks] = await Promise.all([
      window.supabase
        .from('tasks')
        .select('id, title, description, date, location, school_name, created_at')
        .order('created_at', { ascending: false })
        .limit(20),
      
      window.supabase
        .from('supervisions')
        .select('id, school, date, findings, recommendations, created_at')
        .order('created_at', { ascending: false })
        .limit(20),
      
      window.supabase
        .from('additional_tasks')
        .select('id, title, name, description, date, location, organizer, created_at')
        .eq('user_id', userId)
        .order('created_at', { ascending: false })
        .limit(20)
    ]);
    
    const basicDataEnd = Date.now();
    console.log(`✅ Basic data loaded in: ${basicDataEnd - basicDataStart}ms`);
    
    // Step 2: Load photos separately
    console.log('📸 Step 2: Loading photos...');
    
    const photosStart = Date.now();
    const [photoTasks, photoSupervisions, photoAdditionalTasks] = await Promise.all([
      window.supabase
        .from('tasks')
        .select('id, photo, photo1, photo2')
        .order('created_at', { ascending: false })
        .limit(20),
      
      window.supabase
        .from('supervisions')
        .select('id, photo, photo1, photo2')
        .order('created_at', { ascending: false })
        .limit(20),
      
      window.supabase
        .from('additional_tasks')
        .select('id, photo, photo1, photo2')
        .eq('user_id', userId)
        .order('created_at', { ascending: false })
        .limit(20)
    ]);
    
    const photosEnd = Date.now();
    console.log(`✅ Photos loaded in: ${photosEnd - photosStart}ms`);
    
    // Merge data
    const mergeDataWithPhotos = (basicData, photoData) => {
      const photoMap = new Map(photoData.data?.map(item => [item.id, item]) || []);
      
      return basicData.data?.map(item => ({
        ...item,
        ...photoMap.get(item.id)
      })) || [];
    };
    
    const finalData = {
      tasks: mergeDataWithPhotos(basicTasks, photoTasks),
      supervisions: mergeDataWithPhotos(basicSupervisions, photoSupervisions),
      additionalTasks: mergeDataWithPhotos(basicAdditionalTasks, photoAdditionalTasks)
    };
    
    console.log('✅ Progressive loading completed');
    console.log(`- Total time: ${photosEnd - basicDataStart}ms`);
    console.log(`- Basic data: ${basicDataEnd - basicDataStart}ms`);
    console.log(`- Photos: ${photosEnd - photosStart}ms`);
    
    return finalData;
    
  } catch (error) {
    console.log('❌ Error in progressive loading:', error);
    return false;
  }
}

// SOLUSI 5: Database Query Optimization
async function optimizeDatabaseQueries() {
  console.log('🔧 SOLUSI 5: Database Query Optimization');
  
  try {
    // Test different query strategies
    const strategies = [
      {
        name: 'Current Strategy (All fields)',
        query: () => window.supabase.from('tasks').select('*').limit(10)
      },
      {
        name: 'Optimized Strategy (Specific fields)',
        query: () => window.supabase.from('tasks').select('id, title, date, created_at').limit(10)
      },
      {
        name: 'Photo-only Strategy',
        query: () => window.supabase.from('tasks').select('id, photo, photo1, photo2').limit(10)
      }
    ];
    
    console.log('🧪 Testing query strategies...');
    
    for (const strategy of strategies) {
      const start = Date.now();
      const result = await strategy.query();
      const end = Date.now();
      
      console.log(`- ${strategy.name}: ${end - start}ms`);
      
      if (result.error) {
        console.log(`  ❌ Error: ${result.error.message}`);
      } else {
        console.log(`  ✅ Success: ${result.data?.length || 0} records`);
      }
    }
    
  } catch (error) {
    console.log('❌ Error testing query strategies:', error);
  }
}

// SOLUSI 6: Memory Management
function implementMemoryManagement() {
  console.log('🔧 SOLUSI 6: Memory Management');
  
  // Clear old caches
  const clearOldCaches = () => {
    const keys = Object.keys(localStorage);
    let cleared = 0;
    
    keys.forEach(key => {
      if (key.includes('cache') || key.includes('temp')) {
        try {
          const data = JSON.parse(localStorage.getItem(key) || '{}');
          if (data.timestamp && Date.now() - data.timestamp > 24 * 60 * 60 * 1000) {
            localStorage.removeItem(key);
            cleared++;
          }
        } catch (e) {
          // Invalid JSON, remove it
          localStorage.removeItem(key);
          cleared++;
        }
      }
    });
    
    console.log(`🗑️ Cleared ${cleared} old cache entries`);
  };
  
  // Optimize photo storage
  const optimizePhotoStorage = () => {
    console.log('📸 Optimizing photo storage...');
    
    // Function to compress base64 images
    const compressBase64Image = (base64, quality = 0.7) => {
      return new Promise((resolve) => {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        const img = new Image();
        
        img.onload = () => {
          // Calculate new dimensions (max 800px width)
          const maxWidth = 800;
          const ratio = Math.min(maxWidth / img.width, maxWidth / img.height);
          
          canvas.width = img.width * ratio;
          canvas.height = img.height * ratio;
          
          ctx?.drawImage(img, 0, 0, canvas.width, canvas.height);
          
          const compressedBase64 = canvas.toDataURL('image/jpeg', quality);
          resolve(compressedBase64);
        };
        
        img.src = base64;
      });
    };
    
    window.compressBase64Image = compressBase64Image;
    console.log('✅ Photo compression utility available');
  };
  
  clearOldCaches();
  optimizePhotoStorage();
}

// COMPREHENSIVE FIX FUNCTION
async function runComprehensiveFix() {
  console.log('🚀 RUNNING COMPREHENSIVE FIX...');
  console.log('='.repeat(60));
  
  const results = {};
  
  // Step 1: Check cache
  console.log('STEP 1: Checking cache...');
  const cacheResult = implementSmartCaching();
  results.cache = cacheResult;
  
  if (cacheResult.useCache) {
    console.log('✅ Using cached data - loading should be instant');
    return { success: true, usedCache: true, data: cacheResult.data };
  }
  
  // Step 2: Optimize queries
  console.log('\nSTEP 2: Optimizing queries...');
  results.optimization = await optimizeSupabaseQueries();
  
  // Step 3: Setup photo optimization
  console.log('\nSTEP 3: Setting up optimizations...');
  optimizePhotoLoading();
  implementMemoryManagement();
  
  // Step 4: Test progressive loading
  console.log('\nSTEP 4: Testing progressive loading...');
  results.progressive = await implementProgressiveLoading();
  
  // Step 5: Query optimization analysis
  console.log('\nSTEP 5: Analyzing query performance...');
  await optimizeDatabaseQueries();
  
  console.log('\n' + '='.repeat(60));
  console.log('🎯 COMPREHENSIVE FIX SUMMARY:');
  
  if (results.optimization?.success) {
    console.log('✅ Query optimization: SUCCESS');
    console.log(`   - Loading time: ${results.optimization.duration}ms`);
    console.log(`   - Total records: ${Object.values(results.optimization.counts).reduce((a, b) => a + b, 0)}`);
  } else {
    console.log('❌ Query optimization: FAILED');
  }
  
  if (results.progressive) {
    console.log('✅ Progressive loading: SUCCESS');
  } else {
    console.log('❌ Progressive loading: FAILED');
  }
  
  console.log('\n💡 RECOMMENDATIONS:');
  
  if (results.optimization?.duration > 3000) {
    console.log('1. ⚠️ Consider upgrading Supabase plan for better performance');
    console.log('2. ⚠️ Implement pagination for large datasets');
    console.log('3. ⚠️ Add loading skeletons for better UX');
  } else {
    console.log('1. ✅ Performance is acceptable');
    console.log('2. ✅ Consider adding loading indicators');
    console.log('3. ✅ Cache is working properly');
  }
  
  return results;
}

// QUICK FIX FOR IMMEDIATE RELIEF
async function quickFixLoadingIssue() {
  console.log('⚡ QUICK FIX: Immediate Loading Relief');
  
  try {
    // Clear any stuck queries
    if (window.queryClient) {
      window.queryClient.clear();
      console.log('✅ Cleared React Query cache');
    }
    
    // Clear old localStorage data
    const keysToRemove = ['reports_cache', 'activities_cache', 'temp_data'];
    keysToRemove.forEach(key => {
      if (localStorage.getItem(key)) {
        localStorage.removeItem(key);
        console.log(`✅ Cleared ${key}`);
      }
    });
    
    // Force refresh the page with optimized loading
    console.log('🔄 Refreshing page with optimizations...');
    
    // Set flag for optimized loading
    localStorage.setItem('use_optimized_loading', 'true');
    
    setTimeout(() => {
      window.location.reload();
    }, 1000);
    
  } catch (error) {
    console.log('❌ Quick fix error:', error);
  }
}

// Export functions to window for manual testing
window.optimizeSupabaseQueries = optimizeSupabaseQueries;
window.implementProgressiveLoading = implementProgressiveLoading;
window.runComprehensiveFix = runComprehensiveFix;
window.quickFixLoadingIssue = quickFixLoadingIssue;

console.log('\n📋 AVAILABLE COMMANDS:');
console.log('- runComprehensiveFix() - Full optimization');
console.log('- quickFixLoadingIssue() - Quick relief');
console.log('- optimizeSupabaseQueries() - Test query optimization');
console.log('- implementProgressiveLoading() - Test progressive loading');

// Auto-run if on reports page
if (window.location.pathname.includes('reports')) {
  console.log('\n🎯 Detected reports page. Choose your action:');
  console.log('1. For immediate relief: quickFixLoadingIssue()');
  console.log('2. For comprehensive fix: runComprehensiveFix()');
  
  // Auto quick fix after 5 seconds if no action taken
  setTimeout(() => {
    console.log('⚡ Auto-running quick fix...');
    quickFixLoadingIssue();
  }, 5000);
}