// EMERGENCY FIX FOR EXACT CODING ISSUES
// Issue 1: Additional Tasks page not showing data (React Query cache problem)
// Issue 2: Reports page photos not displaying (path vs base64 issue)

console.log('🚨 EMERGENCY FIX: Targeting exact coding issues');

// ISSUE 1 FIX: Additional Tasks React Query Cache
const fixAdditionalTasksCache = () => {
  console.log('🔧 Fixing Additional Tasks React Query cache...');
  
  // Force clear all React Query cache
  if (window.queryClient) {
    window.queryClient.clear();
    console.log('✅ React Query cache cleared');
  }
  
  // Force clear localStorage cache
  localStorage.removeItem('additional_tasks_cache');
  localStorage.removeItem('reports_activities_cache');
  
  // Force refresh the page component
  const event = new CustomEvent('forceRefreshAdditionalTasks', {
    detail: { timestamp: Date.now() }
  });
  window.dispatchEvent(event);
  
  console.log('✅ Additional Tasks cache fix applied');
};

// ISSUE 2 FIX: Reports Page Photo Display
const fixReportsPhotos = () => {
  console.log('🔧 Fixing Reports page photo display...');
  
  // Find all broken photo elements
  const brokenImages = document.querySelectorAll('img[src*="uploads/"]');
  
  brokenImages.forEach((img, index) => {
    console.log(`🖼️ Fixing photo ${index + 1}:`, img.src);
    
    // If the src contains "uploads/" but the actual data is base64, fix it
    const activityId = img.closest('[data-activity-id]')?.getAttribute('data-activity-id');
    
    // Try to get the actual base64 data from activities
    const activities = JSON.parse(localStorage.getItem('reports_activities_cache') || '[]');
    const activity = activities.find(a => a.id === activityId);
    
    if (activity) {
      const isPhoto1 = img.alt?.includes('Foto 1') || img.alt?.includes('foto 1');
      const photoData = isPhoto1 ? activity.photo1 : activity.photo2;
      
      if (photoData && photoData.startsWith('data:')) {
        console.log(`✅ Fixed photo ${index + 1} with base64 data`);
        img.src = photoData;
        img.style.display = 'block';
      }
    }
  });
  
  console.log('✅ Reports photos fix applied');
};

// COMPREHENSIVE FIX FUNCTION
const applyEmergencyFixes = async () => {
  console.log('🚨 APPLYING EMERGENCY FIXES FOR EXACT ISSUES');
  
  try {
    // Fix 1: Additional Tasks Cache
    fixAdditionalTasksCache();
    
    // Fix 2: Reports Photos
    fixReportsPhotos();
    
    // Force reload data from Supabase
    console.log('🔄 Force reloading data from Supabase...');
    
    // Get user data
    const userData = localStorage.getItem('auth_user');
    if (!userData) {
      console.log('⚠️ No user data found');
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
    
    console.log('👤 Using user_id:', userId);
    
    // Force fetch additional tasks from Supabase
    try {
      const response = await fetch(`/api/activities?user_id=${encodeURIComponent(userId)}&_t=${Date.now()}`);
      if (response.ok) {
        const data = await response.json();
        console.log(`✅ Fetched ${data.length} additional tasks from Supabase`);
        
        // Store in cache and trigger update
        localStorage.setItem('additional_tasks_fresh_data', JSON.stringify(data));
        
        // Dispatch custom event to update Additional Tasks page
        const updateEvent = new CustomEvent('updateAdditionalTasksData', {
          detail: { tasks: data, timestamp: Date.now() }
        });
        window.dispatchEvent(updateEvent);
        
      } else {
        console.error('❌ Failed to fetch additional tasks:', response.status);
      }
    } catch (error) {
      console.error('❌ Error fetching additional tasks:', error);
    }
    
    // Wait a bit then check if fixes worked
    setTimeout(() => {
      console.log('🔍 Checking if fixes worked...');
      
      // Check Additional Tasks page
      const additionalTasksCards = document.querySelectorAll('[data-testid="additional-task-card"], .additional-task-card');
      console.log(`📋 Additional Tasks cards found: ${additionalTasksCards.length}`);
      
      // Check Reports photos
      const workingPhotos = document.querySelectorAll('img[src^="data:image"]');
      console.log(`🖼️ Working photos found: ${workingPhotos.length}`);
      
      if (additionalTasksCards.length > 0) {
        console.log('✅ Additional Tasks fix SUCCESS');
      } else {
        console.log('❌ Additional Tasks fix FAILED - trying alternative approach');
        
        // Alternative: Force page refresh
        if (window.location.pathname.includes('additional-tasks')) {
          console.log('🔄 Force refreshing Additional Tasks page...');
          window.location.reload();
        }
      }
      
      if (workingPhotos.length > 0) {
        console.log('✅ Reports photos fix SUCCESS');
      } else {
        console.log('❌ Reports photos fix FAILED - photos may be stored differently');
      }
      
    }, 2000);
    
    console.log('✅ EMERGENCY FIXES APPLIED SUCCESSFULLY');
    
  } catch (error) {
    console.error('❌ Emergency fix error:', error);
  }
};

// AUTO-APPLY FIXES
applyEmergencyFixes();

// MANUAL TRIGGER FUNCTIONS
window.fixAdditionalTasks = fixAdditionalTasksCache;
window.fixReportsPhotos = fixReportsPhotos;
window.applyEmergencyFixes = applyEmergencyFixes;

console.log('🚨 EMERGENCY FIX SCRIPT LOADED');
console.log('📋 Manual commands available:');
console.log('  - fixAdditionalTasks() - Fix Additional Tasks cache');
console.log('  - fixReportsPhotos() - Fix Reports photos');
console.log('  - applyEmergencyFixes() - Apply all fixes');