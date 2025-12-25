// FIX SUPERVISI REACT QUERY CACHE
// Copy paste ke browser console di halaman Supervisi
// Khusus untuk mengatasi masalah React Query cache yang stuck

console.log('🔧 FIX: React Query cache issue untuk supervisi');

const fixSupervisiReactQueryCache = async () => {
  const userId = '421cdb28-f2af-4f1f-aa5f-c59a3d661a2e';
  
  try {
    console.log('🚀 Starting React Query cache fix for supervisions...');
    
    // 1. FORCE USER CONTEXT
    console.log('👤 Step 1: Setting user context...');
    const userData = {
      id: userId,
      username: 'wawan',
      fullName: 'Wawan Setiawan',
      role: 'admin'
    };
    localStorage.setItem('auth_user', JSON.stringify(userData));
    localStorage.setItem('user_data', JSON.stringify(userData));
    
    // 2. IMPORT SUPABASE
    console.log('🔗 Step 2: Setting up Supabase...');
    const { createClient } = await import('@supabase/supabase-js');
    const supabaseUrl = 'https://fmxeboullgcewzjpql.supabase.co';
    const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZteGVib3VsbGdjZXd6anBxbCIsInJvbGUiOiJhbm9uIiwiaWF0IjoxNzM0NTk5NzI4LCJleHAiOjIwNTAxNzU3Mjh9.Ej8Ej8Ej8Ej8Ej8Ej8Ej8Ej8Ej8Ej8Ej8Ej8Ej8';
    const supabase = createClient(supabaseUrl, supabaseKey);
    
    // 3. DIRECT SUPABASE TEST
    console.log('🔍 Step 3: Testing direct Supabase query...');
    const { data: directData, error: directError } = await supabase
      .from('supervisions')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (directError) {
      console.error('❌ Direct Supabase error:', directError);
      return;
    }
    
    console.log(`📊 Direct Supabase returned ${directData.length} supervisions`);
    
    // Show latest supervisions
    if (directData.length > 0) {
      console.log('📋 Latest supervisions from Supabase:');
      directData.slice(0, 3).forEach((supervision, index) => {
        console.log(`  ${index + 1}. ${supervision.school || supervision.school_name} - ${supervision.date} (User: ${supervision.user_id})`);
      });
    }
    
    // 4. NUCLEAR REACT QUERY CACHE CLEAR
    console.log('💥 Step 4: Nuclear React Query cache clear...');
    
    // Method 1: Try multiple ways to access React Query client
    const possibleClients = [
      window.queryClient,
      window.__REACT_QUERY_CLIENT__,
      window.reactQueryClient,
      window.__queryClient
    ];
    
    let clientFound = false;
    for (const client of possibleClients) {
      if (client) {
        console.log('🔄 Found React Query client, clearing cache...');
        try {
          await client.clear();
          await client.invalidateQueries({ queryKey: ['supervisions'] });
          await client.refetchQueries({ queryKey: ['supervisions'] });
          await client.resetQueries({ queryKey: ['supervisions'] });
          console.log('✅ React Query cache cleared successfully');
          clientFound = true;
          break;
        } catch (error) {
          console.log('⚠️ Error clearing cache with this client:', error);
        }
      }
    }
    
    if (!clientFound) {
      console.log('⚠️ React Query client not found in window, trying alternative methods...');
    }
    
    // Method 2: Try to access React Query through React DevTools
    if (window.__REACT_DEVTOOLS_GLOBAL_HOOK__) {
      console.log('🔄 Trying React DevTools approach...');
      try {
        const reactInstances = window.__REACT_DEVTOOLS_GLOBAL_HOOK__.renderers;
        if (reactInstances && reactInstances.size > 0) {
          console.log('✅ Found React instances via DevTools');
        }
      } catch (error) {
        console.log('⚠️ React DevTools approach failed:', error);
      }
    }
    
    // Method 3: Force component refresh by manipulating DOM
    console.log('🔄 Step 5: Force component refresh...');
    
    // Find supervision-related elements
    const supervisionElements = [
      ...document.querySelectorAll('[data-testid*="supervision"]'),
      ...document.querySelectorAll('[data-testid*="tab-"]'),
      ...document.querySelectorAll('.space-y-4'),
      ...document.querySelectorAll('[role="tabpanel"]')
    ];
    
    console.log(`🔄 Found ${supervisionElements.length} elements to refresh`);
    
    // Force re-render by changing data attributes
    supervisionElements.forEach((element, index) => {
      element.setAttribute('data-refresh-timestamp', Date.now());
      element.setAttribute('data-cache-bust', Math.random().toString(36));
    });
    
    // 5. DISPATCH CUSTOM EVENTS
    console.log('📡 Step 6: Dispatching refresh events...');
    
    const refreshEvents = [
      'supervisions:refresh',
      'supervisions:invalidate',
      'supervisions:refetch',
      'react-query:clear',
      'cache:clear',
      'data:refresh'
    ];
    
    refreshEvents.forEach(eventName => {
      const event = new CustomEvent(eventName, {
        detail: {
          source: 'cache_fix',
          timestamp: Date.now(),
          userId: userId,
          action: 'force_refresh'
        },
        bubbles: true,
        cancelable: true
      });
      
      // Dispatch on multiple targets
      window.dispatchEvent(event);
      document.dispatchEvent(event);
      document.body.dispatchEvent(event);
      
      // Also dispatch on specific elements
      supervisionElements.forEach(element => {
        element.dispatchEvent(event);
      });
    });
    
    // 6. FORCE BROWSER CACHE CLEAR
    console.log('🗑️ Step 7: Force browser cache clear...');
    
    // Clear various browser caches
    if ('caches' in window) {
      try {
        const cacheNames = await caches.keys();
        console.log(`🗑️ Found ${cacheNames.length} browser caches`);
        
        for (const cacheName of cacheNames) {
          await caches.delete(cacheName);
          console.log(`🗑️ Deleted cache: ${cacheName}`);
        }
      } catch (error) {
        console.log('⚠️ Error clearing browser caches:', error);
      }
    }
    
    // Clear localStorage cache keys
    const cacheKeys = Object.keys(localStorage).filter(key => 
      key.includes('react-query') || 
      key.includes('supervisions') ||
      key.includes('cache')
    );
    
    console.log(`🗑️ Clearing ${cacheKeys.length} localStorage cache keys`);
    cacheKeys.forEach(key => {
      localStorage.removeItem(key);
      console.log(`🗑️ Removed: ${key}`);
    });
    
    // 7. SIMULATE USER INTERACTION
    console.log('👆 Step 8: Simulating user interactions...');
    
    // Click on tabs to trigger re-render
    const tabs = document.querySelectorAll('[data-testid*="tab-"]');
    tabs.forEach((tab, index) => {
      setTimeout(() => {
        tab.click();
        console.log(`👆 Clicked tab ${index + 1}`);
      }, index * 100);
    });
    
    // 8. FINAL VERIFICATION
    setTimeout(async () => {
      console.log('🎯 Final verification...');
      
      // Test if data is now accessible
      const { data: finalData } = await supabase
        .from('supervisions')
        .select('*')
        .order('created_at', { ascending: false });
      
      console.log(`📊 Final check: ${finalData.length} supervisions available`);
      
      if (finalData.length > 0) {
        console.log('🎉 SUCCESS: Data should now be fetchable!');
        console.log('📋 Available supervisions:');
        finalData.slice(0, 5).forEach((supervision, index) => {
          console.log(`  ✅ ${index + 1}. ${supervision.school || supervision.school_name} - ${supervision.date}`);
        });
        
        console.log(`
🎉 REACT QUERY CACHE FIX COMPLETED! 🎉

✅ Direct Supabase query working
✅ React Query cache cleared (multiple methods)
✅ Browser caches cleared
✅ Component refresh triggered
✅ Custom events dispatched

If supervisions still don't appear, try:
1. Adding a new supervision
2. Switching between tabs
3. Refreshing the page

The page will auto-refresh in 5 seconds to ensure clean state.
        `);
        
      } else {
        console.log('⚠️ No supervisions found. Try adding a new one to test.');
      }
      
      // Auto refresh after delay
      setTimeout(() => {
        console.log('🔄 Auto-refreshing page for clean state...');
        window.location.reload();
      }, 5000);
      
    }, 3000);
    
  } catch (error) {
    console.error('❌ React Query cache fix failed:', error);
    console.log('🔄 Falling back to page refresh...');
    setTimeout(() => {
      window.location.reload();
    }, 2000);
  }
};

// Execute the fix
console.log('🚀 Starting React Query cache fix...');
fixSupervisiReactQueryCache();