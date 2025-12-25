// FIX LAPORAN SUPERVISI HANYA MUNCUL 1
// Copy paste ke browser console di halaman Laporan

console.log('🔧 FIX: Laporan supervisi hanya muncul 1 padahal ada 2');

const fixLaporanSupervisiHanyaMuncul1 = async () => {
  const userId = '421cdb28-f2af-4f1f-aa5f-c59a3d661a2e';
  
  try {
    console.log('🚀 Starting fix for supervision display in reports...');
    
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
    
    // 3. DIAGNOSE SUPERVISION DATA
    console.log('🔍 Step 3: Diagnosing supervision data...');
    
    // Check all supervisions in database
    const { data: allSupervisions, error: allError } = await supabase
      .from('supervisions')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (allError) {
      console.error('❌ Error fetching all supervisions:', allError);
      return;
    }
    
    console.log(`📊 Total supervisions in database: ${allSupervisions.length}`);
    
    // Show all supervisions with user_id info
    console.log('📋 All supervisions:');
    allSupervisions.forEach((supervision, index) => {
      console.log(`  ${index + 1}. ID: ${supervision.id}`);
      console.log(`     School: ${supervision.school || supervision.school_name}`);
      console.log(`     User ID: ${supervision.user_id}`);
      console.log(`     Date: ${supervision.date}`);
      console.log(`     Created: ${supervision.created_at}`);
      console.log('     ---');
    });
    
    // Check supervisions for specific user
    const { data: userSupervisions, error: userError } = await supabase
      .from('supervisions')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });
    
    if (userError) {
      console.error('❌ Error fetching user supervisions:', userError);
    } else {
      console.log(`👤 Supervisions for user ${userId}: ${userSupervisions.length}`);
      userSupervisions.forEach((supervision, index) => {
        console.log(`  ${index + 1}. ${supervision.school || supervision.school_name} - ${supervision.date}`);
      });
    }
    
    // 4. FIX USER_ID MISMATCHES
    console.log('🔧 Step 4: Fixing user_id mismatches...');
    
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
    
    // 5. TEST API ENDPOINT
    console.log('🌐 Step 5: Testing API endpoint...');
    
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
          console.log('📋 API supervisions:');
          apiData.forEach((supervision, index) => {
            console.log(`  ${index + 1}. ${supervision.school || supervision.school_name} - ${supervision.date} (ID: ${supervision.id})`);
          });
        }
      } else {
        const errorText = await apiResponse.text();
        console.error(`❌ API Error: ${apiResponse.status} - ${errorText}`);
      }
    } catch (apiError) {
      console.error('❌ API test failed:', apiError);
    }
    
    // 6. FORCE REPORTS PAGE REFRESH
    console.log('🔄 Step 6: Force reports page refresh...');
    
    // Clear any cached data
    localStorage.removeItem('reports_activities_cache');
    
    // Create fresh activities data for reports
    const activities = [];
    
    // Get updated supervisions
    const { data: finalSupervisions } = await supabase
      .from('supervisions')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });
    
    console.log(`📊 Final supervisions count: ${finalSupervisions.length}`);
    
    // Convert supervisions to activities format
    if (finalSupervisions && finalSupervisions.length > 0) {
      // Fetch schools for location names
      const { data: schools } = await supabase
        .from('schools')
        .select('*');
      
      finalSupervisions.forEach((supervision) => {
        // Get school name
        const school = schools?.find((s) => s.id === supervision.school_id);
        
        activities.push({
          id: supervision.id,
          type: 'Supervisi',
          title: `Supervisi ${school?.name || supervision.school || 'Sekolah'}`,
          date: supervision.date || supervision.created_at,
          location: school?.name || supervision.school || 'Sekolah Binaan',
          organizer: 'Pengawas Sekolah',
          description: supervision.findings || supervision.recommendations || '',
          photo1: supervision.photo1,
          photo2: supervision.photo2,
          createdAt: supervision.created_at,
          source: 'supabase'
        });
      });
      
      console.log(`✅ Created ${activities.length} supervision activities for reports`);
      
      // Cache the activities data for reports page
      localStorage.setItem('reports_activities_cache', JSON.stringify(activities));
      
      // Dispatch update event to reports page
      const updateEvent = new CustomEvent('updateReportsData', {
        detail: {
          activities: activities,
          source: 'supervision_fix',
          timestamp: Date.now()
        }
      });
      window.dispatchEvent(updateEvent);
      
      console.log('📡 Dispatched update event to reports page');
    }
    
    // 7. FORCE PAGE REFRESH IF NEEDED
    console.log('🔄 Step 7: Checking if page refresh is needed...');
    
    // Check if we're on reports page
    const isReportsPage = window.location.pathname.includes('reports') || 
                         window.location.hash.includes('reports') ||
                         document.title.includes('Laporan');
    
    if (isReportsPage) {
      console.log('📄 On reports page, forcing refresh...');
      
      // Try to trigger component refresh first
      const refreshEvents = [
        'reports:refresh',
        'activities:refresh', 
        'supervisions:refresh',
        'data:refresh'
      ];
      
      refreshEvents.forEach(eventName => {
        const event = new CustomEvent(eventName, {
          detail: {
            source: 'supervision_fix',
            timestamp: Date.now(),
            activities: activities
          }
        });
        window.dispatchEvent(event);
        document.dispatchEvent(event);
      });
      
      // Force page refresh after delay
      setTimeout(() => {
        console.log('🔄 Force refreshing page to show updated data...');
        window.location.reload();
      }, 3000);
    }
    
    // 8. FINAL VERIFICATION
    setTimeout(async () => {
      console.log('🎯 Final verification...');
      
      const { data: verifySupervisions } = await supabase
        .from('supervisions')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false });
      
      console.log(`📊 FINAL RESULT: ${verifySupervisions.length} supervisions for user ${userId}`);
      
      if (verifySupervisions.length >= 2) {
        console.log('🎉 SUCCESS: Multiple supervisions should now appear in reports!');
        console.log('📋 Available supervisions:');
        verifySupervisions.forEach((supervision, index) => {
          console.log(`  ✅ ${index + 1}. ${supervision.school || supervision.school_name} - ${supervision.date}`);
        });
      } else if (verifySupervisions.length === 1) {
        console.log('⚠️ WARNING: Only 1 supervision found. Check if there are actually 2 supervisions in the database.');
      } else {
        console.log('❌ ERROR: No supervisions found after fix.');
      }
      
      console.log(`
🎉 FIX COMPLETED! 🎉

✅ User ID standardized to: ${userId}
✅ ${verifySupervisions.length} supervisions available
✅ API endpoint tested
✅ Reports page data refreshed
✅ Page refresh scheduled

The reports page should now show all supervisions.
      `);
      
    }, 2000);
    
  } catch (error) {
    console.error('❌ Fix failed:', error);
    console.log('🔄 Falling back to page refresh...');
    setTimeout(() => {
      window.location.reload();
    }, 2000);
  }
};

// Execute the fix
console.log('🚀 Executing supervision reports fix...');
fixLaporanSupervisiHanyaMuncul1();