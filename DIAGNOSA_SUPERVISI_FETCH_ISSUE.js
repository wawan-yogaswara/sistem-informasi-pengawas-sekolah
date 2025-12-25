// DIAGNOSA SUPERVISI FETCH ISSUE
// Copy paste ke browser console di halaman Supervisi untuk diagnosa mendalam

console.log('🔍 DIAGNOSA: Supervisi fetch issue - Deep analysis');

const diagnosaSupervisiFetchIssue = async () => {
  const userId = '421cdb28-f2af-4f1f-aa5f-c59a3d661a2e';
  
  try {
    console.log('🚀 Starting deep diagnosis of supervision fetch issue...');
    
    // 1. CHECK USER CONTEXT
    console.log('👤 STEP 1: Checking user context...');
    
    const authUser = localStorage.getItem('auth_user');
    const userData = localStorage.getItem('user_data');
    
    console.log('Auth user:', authUser ? JSON.parse(authUser) : 'NOT FOUND');
    console.log('User data:', userData ? JSON.parse(userData) : 'NOT FOUND');
    
    // 2. CHECK SUPABASE CONNECTION
    console.log('🔗 STEP 2: Testing Supabase connection...');
    
    const { createClient } = await import('@supabase/supabase-js');
    const supabaseUrl = 'https://fmxeboullgcewzjpql.supabase.co';
    const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZteGVib3VsbGdjZXd6anBxbCIsInJvbGUiOiJhbm9uIiwiaWF0IjoxNzM0NTk5NzI4LCJleHAiOjIwNTAxNzU3Mjh9.Ej8Ej8Ej8Ej8Ej8Ej8Ej8Ej8Ej8Ej8Ej8Ej8Ej8';
    const supabase = createClient(supabaseUrl, supabaseKey);
    
    // Test basic connection
    const { data: testData, error: testError } = await supabase
      .from('supervisions')
      .select('count(*)')
      .single();
    
    if (testError) {
      console.error('❌ Supabase connection failed:', testError);
      return;
    }
    
    console.log('✅ Supabase connection OK, total supervisions:', testData.count);
    
    // 3. CHECK ALL SUPERVISIONS
    console.log('📊 STEP 3: Analyzing all supervisions...');
    
    const { data: allSupervisions, error: allError } = await supabase
      .from('supervisions')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (allError) {
      console.error('❌ Error fetching all supervisions:', allError);
      return;
    }
    
    console.log(`📊 Total supervisions in database: ${allSupervisions.length}`);
    
    // Analyze user_id distribution
    const userIdCounts = {};
    allSupervisions.forEach(supervision => {
      const uid = supervision.user_id || 'NULL';
      userIdCounts[uid] = (userIdCounts[uid] || 0) + 1;
    });
    
    console.log('👥 User ID distribution:');
    Object.entries(userIdCounts).forEach(([uid, count]) => {
      console.log(`  ${uid}: ${count} supervisions`);
    });
    
    // 4. CHECK SPECIFIC USER SUPERVISIONS
    console.log(`🎯 STEP 4: Checking supervisions for user ${userId}...`);
    
    const { data: userSupervisions, error: userError } = await supabase
      .from('supervisions')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });
    
    if (userError) {
      console.error('❌ Error fetching user supervisions:', userError);
    } else {
      console.log(`👤 User ${userId} has ${userSupervisions.length} supervisions`);
      
      if (userSupervisions.length > 0) {
        console.log('📋 User supervisions:');
        userSupervisions.forEach((supervision, index) => {
          console.log(`  ${index + 1}. ID: ${supervision.id}`);
          console.log(`     School: ${supervision.school || supervision.school_name}`);
          console.log(`     Date: ${supervision.date}`);
          console.log(`     Type: ${supervision.type}`);
          console.log(`     Created: ${supervision.created_at}`);
          console.log(`     User ID: ${supervision.user_id}`);
          console.log('     ---');
        });
      } else {
        console.log('⚠️ No supervisions found for this user');
      }
    }
    
    // 5. CHECK REACT QUERY STATE
    console.log('⚛️ STEP 5: Checking React Query state...');
    
    // Try to find React Query client
    const possibleClients = [
      window.queryClient,
      window.__REACT_QUERY_CLIENT__,
      window.reactQueryClient,
      window.__queryClient
    ];
    
    let reactQueryClient = null;
    for (const client of possibleClients) {
      if (client) {
        reactQueryClient = client;
        console.log('✅ Found React Query client');
        break;
      }
    }
    
    if (reactQueryClient) {
      try {
        // Check cache state
        const queryCache = reactQueryClient.getQueryCache();
        const queries = queryCache.getAll();
        
        console.log(`⚛️ React Query has ${queries.length} cached queries`);
        
        // Find supervision-related queries
        const supervisionQueries = queries.filter(query => 
          query.queryKey.includes('supervisions') || 
          JSON.stringify(query.queryKey).includes('supervisions')
        );
        
        console.log(`⚛️ Found ${supervisionQueries.length} supervision-related queries`);
        
        supervisionQueries.forEach((query, index) => {
          console.log(`  Query ${index + 1}:`);
          console.log(`    Key: ${JSON.stringify(query.queryKey)}`);
          console.log(`    State: ${query.state.status}`);
          console.log(`    Data: ${query.state.data ? `${query.state.data.length} items` : 'No data'}`);
          console.log(`    Error: ${query.state.error ? query.state.error.message : 'None'}`);
          console.log(`    Last updated: ${query.state.dataUpdatedAt ? new Date(query.state.dataUpdatedAt).toLocaleString() : 'Never'}`);
          console.log('    ---');
        });
        
      } catch (error) {
        console.error('❌ Error analyzing React Query state:', error);
      }
    } else {
      console.log('⚠️ React Query client not found');
    }
    
    // 6. CHECK API ENDPOINT
    console.log('🌐 STEP 6: Testing API endpoint...');
    
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
          apiData.slice(0, 3).forEach((supervision, index) => {
            console.log(`  ${index + 1}. ${supervision.school || supervision.school_name} - ${supervision.date}`);
          });
        }
      } else {
        const errorText = await apiResponse.text();
        console.error(`❌ API Error: ${apiResponse.status} - ${errorText}`);
      }
    } catch (apiError) {
      console.error('❌ API test failed:', apiError);
    }
    
    // 7. CHECK DOM STATE
    console.log('🏠 STEP 7: Checking DOM state...');
    
    const supervisionElements = document.querySelectorAll('[data-testid*="supervision"]');
    const tabElements = document.querySelectorAll('[data-testid*="tab-"]');
    const cardElements = document.querySelectorAll('.space-y-4 > div');
    
    console.log(`🏠 Found ${supervisionElements.length} supervision elements`);
    console.log(`🏠 Found ${tabElements.length} tab elements`);
    console.log(`🏠 Found ${cardElements.length} card elements`);
    
    // Check if loading state is visible
    const loadingElements = document.querySelectorAll('*').filter(el => 
      el.textContent && el.textContent.includes('Memuat data')
    );
    console.log(`🏠 Found ${loadingElements.length} loading indicators`);
    
    // 8. SUMMARY AND RECOMMENDATIONS
    console.log('📋 STEP 8: Summary and recommendations...');
    
    const issues = [];
    const recommendations = [];
    
    if (userSupervisions.length === 0) {
      issues.push('No supervisions found for current user');
      recommendations.push('Fix user_id mismatches in database');
    }
    
    if (!reactQueryClient) {
      issues.push('React Query client not accessible');
      recommendations.push('Clear cache manually and refresh page');
    }
    
    if (supervisionElements.length === 0) {
      issues.push('No supervision elements in DOM');
      recommendations.push('Check if component is rendering correctly');
    }
    
    console.log('🚨 ISSUES FOUND:');
    issues.forEach((issue, index) => {
      console.log(`  ${index + 1}. ${issue}`);
    });
    
    console.log('💡 RECOMMENDATIONS:');
    recommendations.forEach((rec, index) => {
      console.log(`  ${index + 1}. ${rec}`);
    });
    
    // 9. PROVIDE SPECIFIC FIX
    console.log('🔧 STEP 9: Providing specific fix...');
    
    if (userSupervisions.length === 0 && allSupervisions.length > 0) {
      console.log('🔧 ISSUE: User ID mismatch detected');
      console.log('🔧 SOLUTION: Run the enhanced fix script to update user_id values');
      console.log('🔧 SCRIPT: FIX_SUPERVISI_FETCH_ENHANCED_FINAL.js');
    } else if (userSupervisions.length > 0 && supervisionElements.length === 0) {
      console.log('🔧 ISSUE: Data exists but not rendering');
      console.log('🔧 SOLUTION: React Query cache issue, run cache clear script');
      console.log('🔧 SCRIPT: FIX_SUPERVISI_REACT_QUERY_CACHE.js');
    } else if (userSupervisions.length > 0 && supervisionElements.length > 0) {
      console.log('✅ GOOD: Data exists and elements are rendered');
      console.log('💡 TIP: Issue might be with new data not appearing after input');
    } else {
      console.log('🔧 ISSUE: Complex issue detected');
      console.log('🔧 SOLUTION: Run both fix scripts in sequence');
    }
    
    console.log(`
📊 DIAGNOSIS COMPLETE 📊

Database: ${allSupervisions.length} total supervisions
User Data: ${userSupervisions.length} for current user
React Query: ${reactQueryClient ? 'Found' : 'Not found'}
DOM Elements: ${supervisionElements.length} supervision elements

Next steps:
1. Run the appropriate fix script based on the analysis above
2. If issues persist, try adding a new supervision to test
3. Check browser console for any additional errors
    `);
    
  } catch (error) {
    console.error('❌ Diagnosis failed:', error);
  }
};

// Execute diagnosis
console.log('🚀 Starting supervision fetch diagnosis...');
diagnosaSupervisiFetchIssue();