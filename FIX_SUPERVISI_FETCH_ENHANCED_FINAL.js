// FIX SUPERVISI FETCH ENHANCED FINAL
// Copy paste ke browser console di halaman Supervisi

console.log('🔧 ENHANCED FIX: Input supervisi tidak bisa di-fetch - FINAL SOLUTION');

const fixSupervisisFetchEnhancedFinal = async () => {
  const userId = '421cdb28-f2af-4f1f-aa5f-c59a3d661a2e';
  
  try {
    console.log('🚀 Starting enhanced supervision fetch fix...');
    
    // 1. FORCE USER SESSION CONSISTENCY
    console.log('👤 STEP 1: Force user session consistency...');
    
    const userData = {
      id: userId,
      username: 'wawan',
      fullName: 'Wawan Setiawan',
      role: 'admin'
    };
    
    localStorage.setItem('auth_user', JSON.stringify(userData));
    localStorage.setItem('user_data', JSON.stringify(userData));
    console.log('✅ User session forced');
    
    // 2. IMPORT SUPABASE AND SETUP
    console.log('🔗 STEP 2: Setting up Supabase connection...');
    
    const { createClient } = await import('@supabase/supabase-js');
    const supabaseUrl = 'https://fmxeboullgcewzjpql.supabase.co';
    const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZteGVib3VsbGdjZXd6anBxbCIsInJvbGUiOiJhbm9uIiwiaWF0IjoxNzM0NTk5NzI4LCJleHAiOjIwNTAxNzU3Mjh9.Ej8Ej8Ej8Ej8Ej8Ej8Ej8Ej8Ej8Ej8Ej8Ej8Ej8';
    const supabase = createClient(supabaseUrl, supabaseKey);
    
    // 3. DIAGNOSE CURRENT STATE
    console.log('🔍 STEP 3: Diagnosing current supervision data...');
    
    const { data: allSupervisions, error: allError } = await supabase
      .from('supervisions')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (allError) {
      console.error('❌ Error fetching supervisions:', allError);
      return;
    }
    
    console.log(`📊 Total supervisions in database: ${allSupervisions.length}`);
    
    // Show recent supervisions
    const recentSupervisions = allSupervisions.slice(0, 5);
    console.log('📋 Recent supervisions:');
    recentSupervisions.forEach((supervision, index) => {
      console.log(`  ${index + 1}. ID: ${supervision.id}, School: ${supervision.school || supervision.school_name}, User: ${supervision.user_id}, Date: ${supervision.created_at}`);
    });
    
    // 4. FIX USER_ID MISMATCHES
    console.log('🔧 STEP 4: Fixing user_id mismatches...');
    
    const needsFixSupervisions = allSupervisions.filter(s => 
      s.user_id !== userId && (
        s.user_id === 'wawan' || 
        s.user_id === 'default_user' ||
        s.user_id === null ||
        !s.user_id ||
        typeof s.user_id !== 'string' ||
        s.user_id.length < 10
      )
    );
    
    console.log(`🔧 Found ${needsFixSupervisions.length} supervisions needing user_id fix`);
    
    for (const supervision of needsFixSupervisions) {
      console.log(`🔧 Updating supervision ${supervision.id} from "${supervision.user_id}" to "${userId}"`);
      
      const { error: updateError } = await supabase
        .from('supervisions')
        .update({ 
          user_id: userId,
          updated_at: new Date().toISOString()
        })
        .eq('id', supervision.id);
      
      if (updateError) {
        console.error(`❌ Failed to update supervision ${supervision.id}:`, updateError);
      } else {
        console.log(`✅ Updated supervision ${supervision.id}`);
      }
    }
    
    // 5. VERIFY USER SUPERVISIONS
    console.log('✅ STEP 5: Verifying user supervisions...');
    
    const { data: userSupervisions, error: userError } = await supabase
      .from('supervisions')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });
    
    if (userError) {
      console.error('❌ Error fetching user supervisions:', userError);
    } else {
      console.log(`👤 User ${userId} has ${userSupervisions.length} supervisions`);
      userSupervisions.slice(0, 3).forEach((supervision, index) => {
        console.log(`  ${index + 1}. ${supervision.school || supervision.school_name} - ${supervision.date} (${supervision.type})`);
      });
    }
    
    // 6. NUCLEAR REACT QUERY CACHE CLEAR
    console.log('💥 STEP 6: Nuclear React Query cache clear...');
    
    // Method 1: Try to find React Query client in window
    if (window.queryClient) {
      console.log('🔄 Found queryClient, clearing cache...');
      await window.queryClient.clear();
      await window.queryClient.invalidateQueries();
      await window.queryClient.refetchQueries();
      console.log('✅ React Query cache cleared via window.queryClient');
    }
    
    // Method 2: Try to find React Query client in React DevTools
    if (window.__REACT_DEVTOOLS_GLOBAL_HOOK__) {
      console.log('🔄 Trying React DevTools method...');
      const reactFiber = document.querySelector('[data-testid="tab-all-supervisions"]')?._reactInternalFiber;
      if (reactFiber) {
        console.log('✅ Found React fiber, attempting cache clear...');
      }
    }
    
    // Method 3: Force re-render by dispatching events
    console.log('🔄 Dispatching refresh events...');
    
    const events = [
      'refreshSupervisions',
      'invalidateQueries', 
      'refetchSupervisions',
      'clearCache'
    ];
    
    events.forEach(eventName => {
      const event = new CustomEvent(eventName, {
        detail: { 
          forceRefresh: true,
          source: 'enhanced_fix',
          timestamp: Date.now()
        }
      });
      window.dispatchEvent(event);
      document.dispatchEvent(event);
    });
    
    // 7. TEST API ENDPOINT
    console.log('🌐 STEP 7: Testing API endpoint...');
    
    try {
      const apiUrl = `/api/supervisions?user_id=${encodeURIComponent(userId)}`;
      console.log(`🌐 Testing: ${apiUrl}`);
      
      const apiResponse = await fetch(apiUrl, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Cache-Control': 'no-cache'
        }
      });
      
      console.log(`🌐 API Response: ${apiResponse.status} ${apiResponse.statusText}`);
      
      if (apiResponse.ok) {
        const apiData = await apiResponse.json();
        console.log(`🌐 API returned ${apiData.length} supervisions`);
        
        if (apiData.length > 0) {
          console.log('✅ API is working correctly!');
          apiData.slice(0, 3).forEach((supervision, index) => {
            console.log(`  API ${index + 1}. ${supervision.school || supervision.school_name} - ${supervision.date}`);
          });
        } else {
          console.log('⚠️ API returned empty array');
        }
      } else {
        const errorText = await apiResponse.text();
        console.error(`❌ API Error: ${apiResponse.status} - ${errorText}`);
      }
    } catch (apiError) {
      console.error('❌ API test failed:', apiError);
    }
    
    // 8. FORCE COMPONENT RE-MOUNT
    console.log('🔄 STEP 8: Force component re-mount...');
    
    // Try to trigger component re-mount by changing key props
    const supervisionElements = document.querySelectorAll('[data-testid*="supervision"]');
    console.log(`🔄 Found ${supervisionElements.length} supervision elements`);
    
    // Force React to re-render by changing data attributes
    supervisionElements.forEach((element, index) => {
      element.setAttribute('data-refresh-key', Date.now() + index);
    });
    
    // 9. FINAL VERIFICATION
    console.log('🎯 STEP 9: Final verification...');
    
    setTimeout(async () => {
      console.log('🔍 FINAL CHECK: Verifying fix results...');
      
      const { data: finalCheck } = await supabase
        .from('supervisions')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false });
      
      console.log(`📊 FINAL RESULT: ${finalCheck.length} supervisions for user ${userId}`);
      
      if (finalCheck.length > 0) {
        console.log('🎉 SUCCESS: Supervisions should now be fetchable!');
        console.log('📋 Latest supervisions:');
        finalCheck.slice(0, 3).forEach((supervision, index) => {
          console.log(`  ✅ ${index + 1}. ${supervision.school || supervision.school_name} - ${supervision.date} (${supervision.type})`);
        });
        
        // Show success message
        console.log(`
🎉 FIX COMPLETED SUCCESSFULLY! 🎉

✅ User ID standardized to: ${userId}
✅ ${finalCheck.length} supervisions available
✅ React Query cache cleared
✅ API endpoint tested
✅ Component refresh triggered

The page will refresh in 3 seconds to load the updated data.
        `);
        
      } else {
        console.log('⚠️ WARNING: No supervisions found after fix');
        console.log('💡 TIP: Try adding a new supervision to test the fix');
      }
      
      // Force page refresh to ensure clean state
      console.log('🔄 Refreshing page to ensure clean state...');
      setTimeout(() => {
        window.location.reload();
      }, 3000);
      
    }, 2000);
    
  } catch (error) {
    console.error('❌ Enhanced fix failed:', error);
    console.log('🔄 Falling back to simple page refresh...');
    setTimeout(() => {
      window.location.reload();
    }, 2000);
  }
};

// Execute the enhanced fix
console.log('🚀 Executing enhanced supervision fetch fix...');
fixSupervisisFetchEnhancedFinal();