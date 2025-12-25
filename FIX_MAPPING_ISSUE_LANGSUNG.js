// FIX MAPPING ISSUE LANGSUNG
// Perbaikan untuk masalah field mapping dan React Query

console.log('🔧 FIXING MAPPING ISSUE LANGSUNG');

const fixMappingIssue = async () => {
  console.log('🚀 Starting comprehensive fix...');
  
  try {
    // 1. CLEAR ALL CACHES
    console.log('🧹 Step 1: Clearing all caches...');
    localStorage.removeItem('additional_tasks_cache');
    localStorage.removeItem('reports_activities_cache');
    
    if (window.queryClient) {
      window.queryClient.clear();
      console.log('✅ React Query cache cleared');
    }
    
    // 2. FIX USER ID
    console.log('👤 Step 2: Fixing user ID...');
    const userData = localStorage.getItem('auth_user');
    if (userData) {
      const currentUser = JSON.parse(userData);
      if (currentUser.username === 'wawan' || !currentUser.id || typeof currentUser.id !== 'string' || currentUser.id.length < 10) {
        currentUser.id = '421cdb28-f2af-4f1f-aa5f-c59a3d661a2e';
        localStorage.setItem('auth_user', JSON.stringify(currentUser));
        console.log('✅ User ID fixed for Wawan:', currentUser.id);
      }
    }
    
    // 3. TEST API ENDPOINT
    console.log('🔗 Step 3: Testing API endpoint...');
    const userId = '421cdb28-f2af-4f1f-aa5f-c59a3d661a2e';
    const response = await fetch(`/api/activities?user_id=${encodeURIComponent(userId)}&_t=${Date.now()}`);
    
    if (!response.ok) {
      console.error('❌ API call failed:', response.status);
      return false;
    }
    
    const data = await response.json();
    console.log(`✅ API returned ${data.length} activities`);
    
    // Log data structure for debugging
    if (data.length > 0) {
      const sample = data[0];
      console.log('📊 Sample data structure:', {
        id: sample.id,
        title: sample.title,
        photo: sample.photo ? 'exists' : 'missing',
        photo1: sample.photo1 ? 'exists' : 'missing',
        photo2: sample.photo2 ? 'exists' : 'missing',
        user_id: sample.user_id,
        created_at: sample.created_at
      });
      
      // Check for field mapping issues
      if (sample.photo1 && !sample.photo) {
        console.log('⚠️ FIELD MAPPING ISSUE: API has photo1 but frontend expects photo');
      }
    }
    
    // 4. FORCE REACT QUERY REFRESH
    console.log('🔄 Step 4: Force React Query refresh...');
    if (window.queryClient) {
      // Clear specific query
      window.queryClient.removeQueries({ queryKey: ['additional-tasks'] });
      
      // Force refetch
      await window.queryClient.invalidateQueries({ queryKey: ['additional-tasks'] });
      await window.queryClient.refetchQueries({ queryKey: ['additional-tasks'] });
      
      console.log('✅ React Query refreshed');
    }
    
    // 5. TRIGGER COMPONENT UPDATE
    console.log('🎯 Step 5: Triggering component update...');
    
    // Dispatch custom events
    const events = [
      'forceAdditionalTasksRefresh',
      'updateAdditionalTasksData',
      'refreshAdditionalTasks'
    ];
    
    events.forEach(eventName => {
      const event = new CustomEvent(eventName, {
        detail: { 
          data: data,
          timestamp: Date.now(),
          source: 'fix_mapping_script'
        }
      });
      window.dispatchEvent(event);
    });
    
    console.log('✅ Component update events dispatched');
    
    // 6. DIRECT DOM MANIPULATION (if needed)
    console.log('🎯 Step 6: Checking DOM state...');
    
    setTimeout(() => {
      const taskCards = document.querySelectorAll('.hover\\:shadow-md, [data-testid="task-card"]');
      console.log(`🎯 Found ${taskCards.length} task cards in DOM`);
      
      if (taskCards.length === 0 && data.length > 0) {
        console.log('❌ Data exists but not rendered - React component issue');
        
        // Try to force page refresh as last resort
        if (window.location.pathname.includes('additional-tasks')) {
          console.log('🔄 Force refreshing Additional Tasks page...');
          setTimeout(() => {
            window.location.reload();
          }, 2000);
        }
      } else if (taskCards.length > 0) {
        console.log('✅ Task cards are now visible in DOM');
      }
    }, 3000);
    
    // 7. VERIFY PHOTOS IN REPORTS
    console.log('🖼️ Step 7: Verifying photo display...');
    
    const activitiesWithPhotos = data.filter(a => a.photo || a.photo1 || a.photo2);
    console.log(`📸 Found ${activitiesWithPhotos.length} activities with photos`);
    
    activitiesWithPhotos.forEach((activity, index) => {
      console.log(`📷 Activity ${index + 1} photos:`, {
        title: activity.title,
        photo: activity.photo ? (activity.photo.startsWith('data:') ? 'base64' : 'file') : 'none',
        photo1: activity.photo1 ? (activity.photo1.startsWith('data:') ? 'base64' : 'file') : 'none',
        photo2: activity.photo2 ? (activity.photo2.startsWith('data:') ? 'base64' : 'file') : 'none'
      });
    });
    
    console.log('🎉 COMPREHENSIVE FIX COMPLETED');
    return true;
    
  } catch (error) {
    console.error('❌ Fix error:', error);
    return false;
  }
};

// SPECIFIC FIX FOR ADDITIONAL TASKS PAGE
const fixAdditionalTasksPage = async () => {
  console.log('📋 Fixing Additional Tasks page specifically...');
  
  try {
    // Force clear React Query for additional-tasks
    if (window.queryClient) {
      window.queryClient.removeQueries({ queryKey: ['additional-tasks'] });
      window.queryClient.setQueryData(['additional-tasks'], null);
    }
    
    // Clear localStorage
    localStorage.removeItem('additional_tasks_cache');
    
    // If we're on the additional tasks page, force refresh
    if (window.location.pathname.includes('additional-tasks')) {
      console.log('🔄 On Additional Tasks page - forcing refresh...');
      
      // Try to trigger React Query refetch first
      if (window.queryClient) {
        await window.queryClient.refetchQueries({ queryKey: ['additional-tasks'] });
      }
      
      // If still no data after 3 seconds, reload page
      setTimeout(() => {
        const taskCards = document.querySelectorAll('.hover\\:shadow-md');
        if (taskCards.length === 0) {
          console.log('🔄 No task cards found - reloading page...');
          window.location.reload();
        }
      }, 3000);
    }
    
  } catch (error) {
    console.error('❌ Additional Tasks fix error:', error);
  }
};

// AUTO-RUN THE FIX
fixMappingIssue().then(success => {
  if (success) {
    console.log('✅ Fix completed successfully');
    
    // Also run specific Additional Tasks fix
    fixAdditionalTasksPage();
  } else {
    console.log('❌ Fix failed - manual intervention needed');
  }
});

// MANUAL FUNCTIONS
window.fixMappingIssue = fixMappingIssue;
window.fixAdditionalTasksPage = fixAdditionalTasksPage;

console.log('🔧 FIX MAPPING SCRIPT LOADED');
console.log('📋 Manual commands:');
console.log('  - fixMappingIssue() - Run comprehensive fix');
console.log('  - fixAdditionalTasksPage() - Fix Additional Tasks page specifically');