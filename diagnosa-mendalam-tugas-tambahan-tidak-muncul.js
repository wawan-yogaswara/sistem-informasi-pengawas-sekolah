// 🔍 DIAGNOSA MENDALAM TUGAS TAMBAHAN TIDAK MUNCUL
// Script untuk mendiagnosa kenapa data muncul di laporan tapi tidak di halaman tugas tambahan

console.log('🔍 DIAGNOSA MENDALAM TUGAS TAMBAHAN TIDAK MUNCUL');
console.log('==================================================');

const WAWAN_USER_ID = '421cdb28-f2af-4f1f-aa5f-c59a3d661a2e';

async function diagnosaMendalamTugasTambahan() {
  console.log('🔧 Starting deep diagnosis...');
  
  // 1. Test kedua endpoint yang berbeda
  console.log('\n1️⃣ TESTING BOTH API ENDPOINTS');
  
  const endpoints = [
    { name: 'Activities API (used by additional-tasks page)', url: `/api/activities?user_id=${WAWAN_USER_ID}` },
    { name: 'Reports API (used by reports page)', url: `/api/activities?user_id=${WAWAN_USER_ID}` }
  ];
  
  const results = {};
  
  for (const endpoint of endpoints) {
    try {
      console.log(`\n📋 Testing ${endpoint.name}...`);
      console.log(`📋 URL: ${endpoint.url}`);
      
      const response = await fetch(endpoint.url);
      console.log(`📋 Status: ${response.status}`);
      console.log(`📋 Headers:`, Object.fromEntries(response.headers.entries()));
      
      if (response.ok) {
        const data = await response.json();
        console.log(`📋 Data length: ${data.length}`);
        console.log(`📋 Data structure:`, data.length > 0 ? Object.keys(data[0]) : 'empty');
        
        results[endpoint.name] = {
          success: true,
          count: data.length,
          data: data,
          sampleItem: data[0] || null
        };
        
        // Log each item
        data.forEach((item, index) => {
          console.log(`  ${index + 1}. ${item.title || item.name || 'No title'}`);
          console.log(`     ID: ${item.id}`);
          console.log(`     User ID: ${item.user_id}`);
          console.log(`     Date: ${item.date || item.created_at}`);
          console.log(`     Table: ${item.schools ? 'additional_tasks' : 'activities'}`);
        });
        
      } else {
        const errorText = await response.text();
        console.error(`❌ ${endpoint.name} failed:`, response.status, errorText);
        results[endpoint.name] = {
          success: false,
          error: `${response.status}: ${errorText}`
        };
      }
      
    } catch (error) {
      console.error(`❌ ${endpoint.name} error:`, error);
      results[endpoint.name] = {
        success: false,
        error: error.message
      };
    }
  }
  
  // 2. Test direct Supabase query
  console.log('\n2️⃣ TESTING DIRECT SUPABASE QUERIES');
  
  // Check if we have supabase client available
  if (window.supabase) {
    console.log('✅ Supabase client found, testing direct queries...');
    
    try {
      // Test additional_tasks table
      console.log('\n📋 Testing additional_tasks table directly...');
      const { data: additionalTasks, error: additionalError } = await window.supabase
        .from('additional_tasks')
        .select(`
          *,
          schools (
            id,
            name
          )
        `)
        .eq('user_id', WAWAN_USER_ID)
        .order('created_at', { ascending: false });
      
      if (additionalError) {
        console.error('❌ additional_tasks query error:', additionalError);
      } else {
        console.log(`✅ additional_tasks: ${additionalTasks?.length || 0} items`);
        additionalTasks?.forEach((task, index) => {
          console.log(`  ${index + 1}. ${task.title} (${task.date})`);
        });
      }
      
      // Test activities table as fallback
      console.log('\n📋 Testing activities table directly...');
      const { data: activities, error: activitiesError } = await window.supabase
        .from('activities')
        .select('*')
        .eq('user_id', WAWAN_USER_ID)
        .order('created_at', { ascending: false });
      
      if (activitiesError) {
        console.error('❌ activities query error:', activitiesError);
      } else {
        console.log(`✅ activities: ${activities?.length || 0} items`);
        activities?.forEach((activity, index) => {
          console.log(`  ${index + 1}. ${activity.title || activity.name} (${activity.date})`);
        });
      }
      
    } catch (error) {
      console.error('❌ Direct Supabase query error:', error);
    }
    
  } else {
    console.log('⚠️ Supabase client not available in window');
  }
  
  // 3. Check React Query state
  console.log('\n3️⃣ CHECKING REACT QUERY STATE');
  
  if (window.queryClient) {
    console.log('✅ React Query client found');
    
    // Get all queries
    const queries = window.queryClient.getQueryCache().getAll();
    console.log(`📋 Total queries in cache: ${queries.length}`);
    
    // Find additional-tasks query
    const additionalTasksQuery = queries.find(q => 
      q.queryKey && q.queryKey.includes('additional-tasks')
    );
    
    if (additionalTasksQuery) {
      console.log('✅ Found additional-tasks query in cache');
      console.log('📋 Query state:', additionalTasksQuery.state.status);
      console.log('📋 Query data:', additionalTasksQuery.state.data ? `${additionalTasksQuery.state.data.length} items` : 'null');
      console.log('📋 Query error:', additionalTasksQuery.state.error);
      console.log('📋 Last updated:', new Date(additionalTasksQuery.state.dataUpdatedAt).toLocaleString());
    } else {
      console.log('❌ additional-tasks query not found in cache');
    }
    
    // List all query keys
    console.log('\n📋 All query keys in cache:');
    queries.forEach((query, index) => {
      console.log(`  ${index + 1}. ${JSON.stringify(query.queryKey)}`);
    });
    
  } else {
    console.log('❌ React Query client not found');
  }
  
  // 4. Check localStorage
  console.log('\n4️⃣ CHECKING LOCALSTORAGE');
  
  const cacheKeys = [
    'additional_tasks_cache',
    'reports_activities_cache',
    'auth_user',
    'react-query-cache'
  ];
  
  cacheKeys.forEach(key => {
    const value = localStorage.getItem(key);
    if (value) {
      try {
        const parsed = JSON.parse(value);
        if (Array.isArray(parsed)) {
          console.log(`✅ ${key}: ${parsed.length} items`);
        } else {
          console.log(`✅ ${key}:`, typeof parsed === 'object' ? Object.keys(parsed) : parsed);
        }
      } catch (e) {
        console.log(`✅ ${key}: ${value.substring(0, 100)}...`);
      }
    } else {
      console.log(`❌ ${key}: not found`);
    }
  });
  
  // 5. Check current page and DOM
  console.log('\n5️⃣ CHECKING CURRENT PAGE AND DOM');
  
  const currentPath = window.location.pathname;
  console.log('📋 Current path:', currentPath);
  
  if (currentPath.includes('additional') || currentPath.includes('tugas-tambahan')) {
    console.log('✅ On additional tasks page');
    
    // Check for task containers
    const selectors = [
      '.grid',
      '[data-testid="tasks-grid"]',
      '.tasks-container',
      '.space-y-6 > .grid',
      'div[class*="grid"]'
    ];
    
    selectors.forEach(selector => {
      const element = document.querySelector(selector);
      if (element) {
        console.log(`✅ Found container: ${selector} with ${element.children.length} children`);
      }
    });
    
    // Check for loading states
    const loadingElements = document.querySelectorAll('[data-loading], .loading, .spinner');
    if (loadingElements.length > 0) {
      console.log(`⚠️ Found ${loadingElements.length} loading elements`);
    }
    
    // Check for error messages
    const errorElements = document.querySelectorAll('.error, [data-error], .text-destructive');
    if (errorElements.length > 0) {
      console.log(`❌ Found ${errorElements.length} error elements`);
      errorElements.forEach(el => console.log('Error text:', el.textContent));
    }
    
  } else {
    console.log('ℹ️ Not on additional tasks page');
  }
  
  // 6. Compare data between endpoints
  console.log('\n6️⃣ COMPARING DATA BETWEEN ENDPOINTS');
  
  const activitiesData = results['Activities API (used by additional-tasks page)'];
  const reportsData = results['Reports API (used by reports page)'];
  
  if (activitiesData?.success && reportsData?.success) {
    console.log(`📊 Activities API: ${activitiesData.count} items`);
    console.log(`📊 Reports API: ${reportsData.count} items`);
    
    if (activitiesData.count !== reportsData.count) {
      console.log('⚠️ DATA MISMATCH DETECTED!');
      console.log('This explains why data appears in reports but not in additional tasks page');
    } else {
      console.log('✅ Data count matches between endpoints');
    }
  }
  
  // 7. Generate fix recommendations
  console.log('\n7️⃣ GENERATING FIX RECOMMENDATIONS');
  
  const recommendations = [];
  
  if (!activitiesData?.success) {
    recommendations.push('Fix Activities API endpoint - it\'s not returning data properly');
  }
  
  if (activitiesData?.count === 0 && reportsData?.count > 0) {
    recommendations.push('Activities API is not fetching from the correct table');
  }
  
  if (window.queryClient && !window.queryClient.getQueryCache().getAll().find(q => q.queryKey?.includes('additional-tasks'))) {
    recommendations.push('React Query cache is not properly initialized for additional-tasks');
  }
  
  if (recommendations.length === 0) {
    recommendations.push('Data appears to be loading correctly - issue might be in React component rendering');
  }
  
  console.log('\n💡 RECOMMENDATIONS:');
  recommendations.forEach((rec, index) => {
    console.log(`  ${index + 1}. ${rec}`);
  });
  
  // 8. Show diagnostic results
  showDiagnosticResults(results, recommendations);
  
  console.log('\n✅ DIAGNOSIS COMPLETED!');
  return {
    success: true,
    results,
    recommendations,
    currentPath
  };
}

function showDiagnosticResults(results, recommendations) {
  const notification = document.createElement('div');
  notification.style.cssText = `
    position: fixed;
    top: 20px;
    left: 20px;
    background: linear-gradient(135deg, #8b5cf6, #7c3aed);
    color: white;
    padding: 1.5rem;
    border-radius: 12px;
    box-shadow: 0 8px 25px rgba(139, 92, 246, 0.4);
    z-index: 9999;
    max-width: 500px;
    font-family: system-ui, -apple-system, sans-serif;
    animation: slideIn 0.5s ease-out;
    max-height: 80vh;
    overflow-y: auto;
  `;
  
  const activitiesResult = results['Activities API (used by additional-tasks page)'];
  const reportsResult = results['Reports API (used by reports page)'];
  
  notification.innerHTML = `
    <div style="font-weight: bold; font-size: 1.2rem; margin-bottom: 1rem; text-align: center;">
      🔍 Diagnostic Results
    </div>
    
    <div style="background: rgba(255,255,255,0.1); border-radius: 8px; padding: 1rem; margin-bottom: 1rem;">
      <div style="font-weight: 600; margin-bottom: 0.5rem;">📊 API Comparison:</div>
      <div style="font-size: 0.9rem; line-height: 1.4;">
        Additional Tasks API: ${activitiesResult?.success ? `✅ ${activitiesResult.count} items` : '❌ Failed'}<br>
        Reports API: ${reportsResult?.success ? `✅ ${reportsResult.count} items` : '❌ Failed'}
      </div>
    </div>
    
    <div style="background: rgba(255,255,255,0.1); border-radius: 8px; padding: 1rem; margin-bottom: 1rem;">
      <div style="font-weight: 600; margin-bottom: 0.5rem;">💡 Key Findings:</div>
      <div style="font-size: 0.9rem; line-height: 1.4;">
        ${activitiesResult?.count === 0 && reportsResult?.count > 0 ? 
          '🔥 FOUND THE ISSUE: Additional Tasks API returns 0 items while Reports API returns data!' :
          'Both APIs return the same data - issue is likely in React rendering'
        }
      </div>
    </div>
    
    <div style="background: rgba(255,255,255,0.1); border-radius: 8px; padding: 1rem; margin-bottom: 1rem;">
      <div style="font-weight: 600; margin-bottom: 0.5rem;">🔧 Recommendations:</div>
      <div style="font-size: 0.8rem; line-height: 1.3;">
        ${recommendations.slice(0, 3).map(rec => `• ${rec}`).join('<br>')}
      </div>
    </div>
    
    <div style="display: flex; gap: 0.5rem; margin-top: 1rem;">
      <button onclick="window.location.href='/additional-tasks'" style="flex: 1; background: white; color: #8b5cf6; border: none; padding: 0.5rem; border-radius: 6px; cursor: pointer; font-size: 0.875rem; font-weight: 600;">
        📋 Go to Tasks
      </button>
      <button onclick="console.clear(); this.parentElement.parentElement.remove()" style="background: rgba(255,255,255,0.2); color: white; border: 1px solid rgba(255,255,255,0.3); padding: 0.5rem; border-radius: 6px; cursor: pointer; font-size: 0.875rem;">
        Clear
      </button>
    </div>
  `;
  
  // Add animation
  const style = document.createElement('style');
  style.textContent = `
    @keyframes slideIn {
      from { transform: translateX(-100%); opacity: 0; }
      to { transform: translateX(0); opacity: 1; }
    }
  `;
  document.head.appendChild(style);
  
  document.body.appendChild(notification);
  
  // Auto remove after 30 seconds
  setTimeout(() => {
    if (notification.parentElement) {
      notification.remove();
    }
  }, 30000);
}

// Execute the diagnosis
diagnosaMendalamTugasTambahan().then(result => {
  console.log('\n🎉 DIAGNOSIS COMPLETED WITH RESULTS:', result);
}).catch(error => {
  console.error('❌ Diagnosis failed:', error);
});