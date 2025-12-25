// DIAGNOSA MASALAH QUERY DAN MAPPING DATA
// Issue: Data masuk Supabase tapi tidak muncul di Additional Tasks page
// Issue: Foto tidak muncul di Reports page

console.log('🔍 DIAGNOSA QUERY DAN MAPPING DATA');

const diagnoseDataFlow = async () => {
  console.log('📊 Memulai diagnosa alur data...');
  
  try {
    // 1. CEK USER DATA
    const userData = localStorage.getItem('auth_user');
    if (!userData) {
      console.log('❌ No user data found');
      return;
    }
    
    const currentUser = JSON.parse(userData);
    let userId = currentUser.id;
    
    // For wawan user, use correct UUID
    if (currentUser.username === 'wawan' || !userId || typeof userId !== 'string' || userId.length < 10) {
      userId = '421cdb28-f2af-4f1f-aa5f-c59a3d661a2e';
      currentUser.id = userId;
      localStorage.setItem('auth_user', JSON.stringify(currentUser));
    }
    
    console.log('👤 User Info:', {
      username: currentUser.username,
      userId: userId,
      userIdLength: userId.length,
      userIdType: typeof userId
    });
    
    // 2. TEST API ACTIVITIES ENDPOINT
    console.log('🔗 Testing /api/activities endpoint...');
    const activitiesResponse = await fetch(`/api/activities?user_id=${encodeURIComponent(userId)}`);
    console.log('📡 Activities API Response Status:', activitiesResponse.status);
    
    if (activitiesResponse.ok) {
      const activitiesData = await activitiesResponse.json();
      console.log(`✅ Activities API returned ${activitiesData.length} items`);
      
      // Analyze each activity
      activitiesData.forEach((activity, index) => {
        console.log(`📋 Activity ${index + 1}:`, {
          id: activity.id,
          title: activity.title || activity.name,
          user_id: activity.user_id,
          photo1: activity.photo1 ? (activity.photo1.startsWith('data:') ? 'base64' : 'file path') : 'none',
          photo2: activity.photo2 ? (activity.photo2.startsWith('data:') ? 'base64' : 'file path') : 'none',
          created_at: activity.created_at,
          table_source: 'activities API'
        });
      });
      
      // Check for user_id mismatch
      const userIdMismatches = activitiesData.filter(a => a.user_id !== userId);
      if (userIdMismatches.length > 0) {
        console.log('⚠️ USER_ID MISMATCH DETECTED:', userIdMismatches.length, 'activities have different user_id');
        userIdMismatches.forEach(activity => {
          console.log(`❌ Mismatch: Activity "${activity.title}" has user_id: ${activity.user_id}, expected: ${userId}`);
        });
      }
      
    } else {
      const errorText = await activitiesResponse.text();
      console.log('❌ Activities API Error:', errorText);
    }
    
    // 3. TEST DIRECT SUPABASE QUERY
    console.log('🔗 Testing direct Supabase query...');
    
    // Check if we have supabase client available
    if (window.supabase) {
      console.log('✅ Supabase client available');
      
      const { data: supabaseData, error } = await window.supabase
        .from('additional_tasks')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false });
      
      if (error) {
        console.log('❌ Direct Supabase query error:', error);
      } else {
        console.log(`✅ Direct Supabase query returned ${supabaseData.length} items`);
        
        supabaseData.forEach((task, index) => {
          console.log(`📋 Supabase Task ${index + 1}:`, {
            id: task.id,
            title: task.title,
            user_id: task.user_id,
            photo: task.photo ? (task.photo.startsWith('data:') ? 'base64' : 'file path') : 'none',
            photo2: task.photo2 ? (task.photo2.startsWith('data:') ? 'base64' : 'file path') : 'none',
            created_at: task.created_at,
            table_source: 'direct supabase'
          });
        });
      }
    } else {
      console.log('⚠️ Supabase client not available in window');
    }
    
    // 4. CHECK REACT QUERY CACHE
    console.log('🔗 Checking React Query cache...');
    if (window.queryClient) {
      const cacheData = window.queryClient.getQueryData(['additional-tasks']);
      console.log('📦 React Query cache data:', cacheData ? cacheData.length : 'null');
      
      if (cacheData && cacheData.length > 0) {
        console.log('✅ React Query has cached data');
        cacheData.forEach((task, index) => {
          console.log(`📋 Cached Task ${index + 1}:`, {
            id: task.id,
            title: task.title,
            user_id: task.user_id,
            source: 'react query cache'
          });
        });
      } else {
        console.log('❌ React Query cache is empty or null');
      }
    } else {
      console.log('⚠️ React Query client not available');
    }
    
    // 5. CHECK DOM ELEMENTS
    console.log('🔗 Checking DOM elements...');
    const taskCards = document.querySelectorAll('[data-testid="task-card"], .task-card, .additional-task-card, .hover\\:shadow-md');
    console.log(`🎯 Found ${taskCards.length} task cards in DOM`);
    
    if (taskCards.length === 0) {
      console.log('❌ NO TASK CARDS FOUND IN DOM - This is the main issue!');
      
      // Check for loading state
      const loadingElements = document.querySelectorAll('[data-testid="loading"], .animate-spin');
      console.log(`⏳ Found ${loadingElements.length} loading elements`);
      
      // Check for empty state
      const emptyStateElements = document.querySelectorAll('*');
      const emptyStateText = Array.from(emptyStateElements).find(el => 
        el.textContent && el.textContent.includes('Belum ada kegiatan tambahan')
      );
      
      if (emptyStateText) {
        console.log('📭 Empty state is showing - React Query is not loading data properly');
      }
    }
    
    // 6. MAPPING ANALYSIS
    console.log('🔗 Analyzing data mapping...');
    
    // Check if API data structure matches frontend expectations
    if (activitiesResponse.ok) {
      const activitiesData = await activitiesResponse.json();
      
      if (activitiesData.length > 0) {
        const sampleActivity = activitiesData[0];
        const expectedFields = ['id', 'title', 'description', 'date', 'photo', 'photo2', 'user_id'];
        const actualFields = Object.keys(sampleActivity);
        
        console.log('📊 Data Structure Analysis:');
        console.log('Expected fields:', expectedFields);
        console.log('Actual fields:', actualFields);
        
        const missingFields = expectedFields.filter(field => !actualFields.includes(field));
        const extraFields = actualFields.filter(field => !expectedFields.includes(field));
        
        if (missingFields.length > 0) {
          console.log('❌ Missing fields:', missingFields);
        }
        
        if (extraFields.length > 0) {
          console.log('ℹ️ Extra fields:', extraFields);
        }
        
        // Check photo field mapping
        if (sampleActivity.photo1 && !sampleActivity.photo) {
          console.log('⚠️ PHOTO MAPPING ISSUE: API returns photo1/photo2 but frontend expects photo/photo2');
        }
      }
    }
    
    // 7. GENERATE DIAGNOSIS SUMMARY
    console.log('📋 DIAGNOSIS SUMMARY:');
    console.log('='.repeat(50));
    
    const issues = [];
    
    if (activitiesResponse.ok) {
      const activitiesData = await activitiesResponse.json();
      if (activitiesData.length === 0) {
        issues.push('❌ API returns no data for user');
      } else if (taskCards.length === 0) {
        issues.push('❌ Data exists in API but not rendered in DOM');
      }
    } else {
      issues.push('❌ API endpoint is failing');
    }
    
    if (issues.length === 0) {
      console.log('✅ No major issues detected');
    } else {
      console.log('🚨 ISSUES DETECTED:');
      issues.forEach(issue => console.log(issue));
    }
    
    return {
      apiWorking: activitiesResponse.ok,
      dataCount: activitiesResponse.ok ? (await activitiesResponse.json()).length : 0,
      domElements: taskCards.length,
      issues: issues
    };
    
  } catch (error) {
    console.error('❌ Diagnosis error:', error);
    return { error: error.message };
  }
};

// SPECIFIC FIXES BASED ON DIAGNOSIS
const applyTargetedFixes = async () => {
  console.log('🔧 Applying targeted fixes...');
  
  try {
    // Fix 1: Clear all caches
    console.log('🧹 Clearing all caches...');
    localStorage.removeItem('additional_tasks_cache');
    localStorage.removeItem('reports_activities_cache');
    
    if (window.queryClient) {
      window.queryClient.clear();
      console.log('✅ React Query cache cleared');
    }
    
    // Fix 2: Force correct user_id
    const userData = localStorage.getItem('auth_user');
    if (userData) {
      const currentUser = JSON.parse(userData);
      if (currentUser.username === 'wawan') {
        currentUser.id = '421cdb28-f2af-4f1f-aa5f-c59a3d661a2e';
        localStorage.setItem('auth_user', JSON.stringify(currentUser));
        console.log('✅ User ID corrected for Wawan');
      }
    }
    
    // Fix 3: Force React Query refetch
    if (window.queryClient) {
      await window.queryClient.invalidateQueries({ queryKey: ['additional-tasks'] });
      await window.queryClient.refetchQueries({ queryKey: ['additional-tasks'] });
      console.log('✅ React Query refetch triggered');
    }
    
    // Fix 4: Trigger component re-render
    const event = new CustomEvent('forceAdditionalTasksRefresh', {
      detail: { timestamp: Date.now() }
    });
    window.dispatchEvent(event);
    console.log('✅ Component refresh event dispatched');
    
    console.log('🎉 Targeted fixes applied');
    
  } catch (error) {
    console.error('❌ Fix application error:', error);
  }
};

// AUTO-RUN DIAGNOSIS
diagnoseDataFlow().then(result => {
  console.log('📊 Diagnosis completed:', result);
  
  if (result.issues && result.issues.length > 0) {
    console.log('🔧 Applying fixes automatically...');
    applyTargetedFixes();
  }
});

// MANUAL FUNCTIONS
window.diagnoseDataFlow = diagnoseDataFlow;
window.applyTargetedFixes = applyTargetedFixes;

console.log('🔍 DIAGNOSIS SCRIPT LOADED');
console.log('📋 Manual commands:');
console.log('  - diagnoseDataFlow() - Run full diagnosis');
console.log('  - applyTargetedFixes() - Apply targeted fixes');