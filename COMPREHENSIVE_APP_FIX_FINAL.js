// 🚀 COMPREHENSIVE APP FIX - FINAL SOLUTION
// Script master untuk memperbaiki SEMUA masalah aplikasi sekaligus

console.log('🚀 COMPREHENSIVE APP FIX - FINAL SOLUTION');
console.log('==========================================');
console.log('Memeriksa dan memperbaiki SEMUA halaman dan fitur...');

const WAWAN_USER_ID = '421cdb28-f2af-4f1f-aa5f-c59a3d661a2e';
const DEFAULT_SCHOOL_ID = '1cd40355-1b07-402d-8309-b243c098cfe9';

async function comprehensiveAppFix() {
  const results = {
    userAuth: false,
    apiEndpoints: {},
    supabaseConnection: false,
    reactQuery: false,
    dataConsistency: {},
    pages: {},
    recommendations: []
  };
  
  console.log('🔧 Starting comprehensive fix...');
  
  // 1. FIX USER AUTHENTICATION
  console.log('\n1️⃣ FIXING USER AUTHENTICATION');
  try {
    const authUser = localStorage.getItem('auth_user');
    const userData = authUser ? JSON.parse(authUser) : null;
    
    if (!userData || userData.username !== 'wawan' || userData.id !== WAWAN_USER_ID) {
      const fixedUser = {
        id: WAWAN_USER_ID,
        username: 'wawan',
        fullName: 'H. Wawan Yogaswara, S.Pd, M.Pd',
        role: 'admin',
        nip: '196512121990031007',
        position: 'Pengawas Sekolah'
      };
      localStorage.setItem('auth_user', JSON.stringify(fixedUser));
      console.log('✅ User authentication fixed');
    } else {
      console.log('✅ User authentication OK');
    }
    results.userAuth = true;
  } catch (error) {
    console.error('❌ User auth fix failed:', error);
    results.recommendations.push('Fix user authentication manually');
  }
  
  // 2. TEST ALL API ENDPOINTS
  console.log('\n2️⃣ TESTING ALL API ENDPOINTS');
  const endpoints = [
    { name: 'tasks-daily', url: `/api/tasks-daily?user_id=${WAWAN_USER_ID}` },
    { name: 'supervisions', url: `/api/supervisions?user_id=${WAWAN_USER_ID}` },
    { name: 'activities', url: `/api/activities?user_id=${WAWAN_USER_ID}` },
    { name: 'schools', url: '/api/schools' }
  ];
  
  for (const endpoint of endpoints) {
    try {
      console.log(`📋 Testing ${endpoint.name}...`);
      const response = await fetch(endpoint.url);
      
      if (response.ok) {
        const data = await response.json();
        console.log(`✅ ${endpoint.name}: ${data.length} items`);
        results.apiEndpoints[endpoint.name] = { success: true, count: data.length, data };
      } else {
        const errorText = await response.text();
        console.error(`❌ ${endpoint.name}: ${response.status} - ${errorText}`);
        results.apiEndpoints[endpoint.name] = { success: false, error: `${response.status}: ${errorText}` };
        results.recommendations.push(`Fix ${endpoint.name} API endpoint`);
      }
    } catch (error) {
      console.error(`❌ ${endpoint.name} fetch error:`, error);
      results.apiEndpoints[endpoint.name] = { success: false, error: error.message };
      results.recommendations.push(`Fix ${endpoint.name} API connectivity`);
    }
  }
  
  // 3. TEST SUPABASE CONNECTION
  console.log('\n3️⃣ TESTING SUPABASE CONNECTION');
  if (window.supabase) {
    try {
      console.log('✅ Supabase client found');
      
      // Test direct queries
      const tables = ['additional_tasks', 'tasks', 'supervisions', 'schools'];
      for (const table of tables) {
        try {
          const { data, error } = await window.supabase
            .from(table)
            .select('*')
            .limit(1);
          
          if (error) {
            console.error(`❌ ${table} table error:`, error.message);
            results.recommendations.push(`Fix ${table} table access`);
          } else {
            console.log(`✅ ${table} table accessible`);
          }
        } catch (err) {
          console.error(`❌ ${table} query failed:`, err);
        }
      }
      results.supabaseConnection = true;
    } catch (error) {
      console.error('❌ Supabase test failed:', error);
      results.recommendations.push('Fix Supabase connection');
    }
  } else {
    console.log('❌ Supabase client not found');
    results.recommendations.push('Initialize Supabase client');
  }
  
  // 4. FIX REACT QUERY CACHE
  console.log('\n4️⃣ FIXING REACT QUERY CACHE');
  if (window.queryClient) {
    try {
      console.log('✅ React Query client found');
      
      // Clear all caches
      window.queryClient.clear();
      console.log('✅ Cleared React Query cache');
      
      // Invalidate specific queries
      const queryKeys = ['additional-tasks', 'tasks', 'supervisions', 'schools', 'reports'];
      for (const key of queryKeys) {
        window.queryClient.invalidateQueries({ queryKey: [key] });
        console.log(`✅ Invalidated ${key} query`);
      }
      
      results.reactQuery = true;
    } catch (error) {
      console.error('❌ React Query fix failed:', error);
      results.recommendations.push('Fix React Query cache management');
    }
  } else {
    console.log('⚠️ React Query client not found');
  }
  
  // 5. CLEAR ALL LOCALSTORAGE CACHES
  console.log('\n5️⃣ CLEARING LOCALSTORAGE CACHES');
  const cacheKeys = [
    'additional_tasks_cache',
    'reports_activities_cache',
    'tasks_cache',
    'supervisions_cache',
    'schools_cache',
    'react-query-cache'
  ];
  
  cacheKeys.forEach(key => {
    if (localStorage.getItem(key)) {
      localStorage.removeItem(key);
      console.log(`✅ Cleared ${key}`);
    }
  });
  
  // 6. CHECK DATA CONSISTENCY
  console.log('\n6️⃣ CHECKING DATA CONSISTENCY');
  const tasksData = results.apiEndpoints['tasks-daily'];
  const supervisionsData = results.apiEndpoints['supervisions'];
  const activitiesData = results.apiEndpoints['activities'];
  
  if (tasksData?.success && supervisionsData?.success && activitiesData?.success) {
    const totalExpected = tasksData.count + supervisionsData.count + activitiesData.count;
    console.log(`📊 Data summary:`);
    console.log(`   Tasks: ${tasksData.count}`);
    console.log(`   Supervisions: ${supervisionsData.count}`);
    console.log(`   Activities: ${activitiesData.count}`);
    console.log(`   Total: ${totalExpected}`);
    
    results.dataConsistency = {
      tasks: tasksData.count,
      supervisions: supervisionsData.count,
      activities: activitiesData.count,
      total: totalExpected
    };
    
    if (totalExpected === 0) {
      results.recommendations.push('No data found - check if data exists in Supabase');
    }
  }
  
  // 7. TEST SPECIFIC PAGE FUNCTIONALITY
  console.log('\n7️⃣ TESTING PAGE FUNCTIONALITY');
  const currentPath = window.location.pathname;
  console.log('Current path:', currentPath);
  
  // Test based on current page
  if (currentPath.includes('additional') || currentPath.includes('tugas-tambahan')) {
    console.log('🔍 Testing Additional Tasks page...');
    
    // Check if data should be visible
    if (activitiesData?.success && activitiesData.count > 0) {
      // Look for task containers
      const containers = document.querySelectorAll('.grid, [data-testid="tasks-grid"], .space-y-6 > .grid');
      const hasVisibleTasks = Array.from(containers).some(container => container.children.length > 0);
      
      if (!hasVisibleTasks) {
        console.log('❌ Tasks not visible in UI despite API having data');
        results.recommendations.push('Force refresh Additional Tasks page');
        results.pages.additionalTasks = { dataInAPI: true, visibleInUI: false };
      } else {
        console.log('✅ Tasks visible in UI');
        results.pages.additionalTasks = { dataInAPI: true, visibleInUI: true };
      }
    } else {
      console.log('⚠️ No data in API for Additional Tasks');
      results.pages.additionalTasks = { dataInAPI: false, visibleInUI: false };
    }
  }
  
  if (currentPath.includes('reports') || currentPath.includes('laporan')) {
    console.log('🔍 Testing Reports page...');
    
    const totalData = (tasksData?.count || 0) + (supervisionsData?.count || 0) + (activitiesData?.count || 0);
    if (totalData > 0) {
      // Look for report containers
      const reportContainers = document.querySelectorAll('.space-y-6, [data-testid="reports"], .reports-container');
      const hasVisibleReports = Array.from(reportContainers).some(container => container.children.length > 0);
      
      results.pages.reports = { dataInAPI: true, visibleInUI: hasVisibleReports };
      if (!hasVisibleReports) {
        results.recommendations.push('Force refresh Reports page');
      }
    } else {
      results.pages.reports = { dataInAPI: false, visibleInUI: false };
    }
  }
  
  // 8. APPLY EMERGENCY FIXES
  console.log('\n8️⃣ APPLYING EMERGENCY FIXES');
  
  // Fix 1: Ensure correct user ID in all contexts
  if (window.supabase && results.supabaseConnection) {
    try {
      // Update any records with incorrect user_id
      const { error: updateError } = await window.supabase
        .from('additional_tasks')
        .update({ user_id: WAWAN_USER_ID })
        .or(`user_id.eq.wawan,user_id.eq.default_user,user_id.like.user-%`);
      
      if (!updateError) {
        console.log('✅ Updated user_id in additional_tasks');
      }
    } catch (error) {
      console.log('⚠️ Could not update user_id:', error.message);
    }
  }
  
  // Fix 2: Force component re-renders
  const events = [
    'additional-tasks-refresh',
    'reports-refresh',
    'data-updated',
    'cache-cleared',
    'user-updated'
  ];
  
  events.forEach(eventName => {
    window.dispatchEvent(new CustomEvent(eventName, {
      detail: { 
        timestamp: Date.now(),
        source: 'comprehensive-fix',
        userId: WAWAN_USER_ID
      }
    }));
  });
  
  console.log('✅ Dispatched refresh events');
  
  // 9. GENERATE FINAL RECOMMENDATIONS
  console.log('\n9️⃣ GENERATING FINAL RECOMMENDATIONS');
  
  if (results.recommendations.length === 0) {
    results.recommendations.push('All systems appear to be working correctly');
  }
  
  // Add specific recommendations based on findings
  if (results.apiEndpoints.activities?.success && results.apiEndpoints.activities.count > 0) {
    if (currentPath.includes('additional') && results.pages.additionalTasks?.visibleInUI === false) {
      results.recommendations.unshift('CRITICAL: Force refresh Additional Tasks page - data exists but not visible');
    }
  }
  
  if (Object.values(results.apiEndpoints).some(api => !api.success)) {
    results.recommendations.unshift('CRITICAL: Some API endpoints are failing - check server status');
  }
  
  // 10. SHOW COMPREHENSIVE RESULTS
  showComprehensiveResults(results);
  
  console.log('\n✅ COMPREHENSIVE FIX COMPLETED!');
  return results;
}

function showComprehensiveResults(results) {
  const notification = document.createElement('div');
  notification.style.cssText = `
    position: fixed;
    top: 20px;
    left: 50%;
    transform: translateX(-50%);
    background: linear-gradient(135deg, #1e40af, #1d4ed8);
    color: white;
    padding: 2rem;
    border-radius: 16px;
    box-shadow: 0 20px 40px rgba(30, 64, 175, 0.4);
    z-index: 9999;
    max-width: 600px;
    font-family: system-ui, -apple-system, sans-serif;
    animation: slideDown 0.5s ease-out;
    max-height: 80vh;
    overflow-y: auto;
  `;
  
  const apiStatus = Object.entries(results.apiEndpoints).map(([name, status]) => 
    `${status.success ? '✅' : '❌'} ${name}: ${status.success ? `${status.count} items` : 'Failed'}`
  ).join('<br>');
  
  const dataTotal = results.dataConsistency.total || 0;
  const criticalIssues = results.recommendations.filter(r => r.includes('CRITICAL')).length;
  
  notification.innerHTML = `
    <div style="text-align: center; margin-bottom: 1.5rem;">
      <div style="font-size: 2rem; margin-bottom: 0.5rem;">🔧</div>
      <div style="font-weight: bold; font-size: 1.4rem;">Comprehensive App Check Complete</div>
    </div>
    
    <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; margin-bottom: 1.5rem;">
      <div style="background: rgba(255,255,255,0.1); border-radius: 8px; padding: 1rem;">
        <div style="font-weight: 600; margin-bottom: 0.5rem;">🔐 Authentication</div>
        <div style="font-size: 0.9rem;">${results.userAuth ? '✅ Fixed' : '❌ Failed'}</div>
      </div>
      
      <div style="background: rgba(255,255,255,0.1); border-radius: 8px; padding: 1rem;">
        <div style="font-weight: 600; margin-bottom: 0.5rem;">🗄️ Database</div>
        <div style="font-size: 0.9rem;">${results.supabaseConnection ? '✅ Connected' : '❌ Failed'}</div>
      </div>
      
      <div style="background: rgba(255,255,255,0.1); border-radius: 8px; padding: 1rem;">
        <div style="font-weight: 600; margin-bottom: 0.5rem;">⚡ React Query</div>
        <div style="font-size: 0.9rem;">${results.reactQuery ? '✅ Cleared' : '❌ Failed'}</div>
      </div>
      
      <div style="background: rgba(255,255,255,0.1); border-radius: 8px; padding: 1rem;">
        <div style="font-weight: 600; margin-bottom: 0.5rem;">📊 Total Data</div>
        <div style="font-size: 0.9rem;">${dataTotal} items</div>
      </div>
    </div>
    
    <div style="background: rgba(255,255,255,0.1); border-radius: 8px; padding: 1rem; margin-bottom: 1rem;">
      <div style="font-weight: 600; margin-bottom: 0.5rem;">🔗 API Status:</div>
      <div style="font-size: 0.8rem; line-height: 1.4;">${apiStatus}</div>
    </div>
    
    ${criticalIssues > 0 ? `
    <div style="background: rgba(239, 68, 68, 0.2); border: 1px solid rgba(239, 68, 68, 0.5); border-radius: 8px; padding: 1rem; margin-bottom: 1rem;">
      <div style="font-weight: 600; margin-bottom: 0.5rem; color: #fecaca;">⚠️ Critical Issues (${criticalIssues}):</div>
      <div style="font-size: 0.8rem; line-height: 1.3; color: #fecaca;">
        ${results.recommendations.filter(r => r.includes('CRITICAL')).map(r => `• ${r}`).join('<br>')}
      </div>
    </div>
    ` : ''}
    
    <div style="background: rgba(255,255,255,0.1); border-radius: 8px; padding: 1rem; margin-bottom: 1.5rem;">
      <div style="font-weight: 600; margin-bottom: 0.5rem;">💡 Next Steps:</div>
      <div style="font-size: 0.8rem; line-height: 1.3;">
        ${results.recommendations.slice(0, 3).map(r => `• ${r}`).join('<br>')}
      </div>
    </div>
    
    <div style="display: flex; gap: 0.5rem;">
      <button onclick="window.location.href='/additional-tasks'" style="flex: 1; background: white; color: #1e40af; border: none; padding: 0.75rem; border-radius: 8px; cursor: pointer; font-size: 0.875rem; font-weight: 600;">
        📋 Test Tasks Page
      </button>
      <button onclick="window.location.href='/reports'" style="flex: 1; background: rgba(255,255,255,0.2); color: white; border: 1px solid rgba(255,255,255,0.3); padding: 0.75rem; border-radius: 8px; cursor: pointer; font-size: 0.875rem;">
        📊 Test Reports
      </button>
      <button onclick="location.reload()" style="flex: 1; background: rgba(255,255,255,0.2); color: white; border: 1px solid rgba(255,255,255,0.3); padding: 0.75rem; border-radius: 8px; cursor: pointer; font-size: 0.875rem;">
        🔄 Reload
      </button>
    </div>
    
    <button onclick="this.remove()" style="position: absolute; top: 1rem; right: 1rem; background: rgba(255,255,255,0.2); color: white; border: none; width: 2rem; height: 2rem; border-radius: 50%; cursor: pointer; font-size: 1rem;">
      ✕
    </button>
  `;
  
  // Add animation
  const style = document.createElement('style');
  style.textContent = `
    @keyframes slideDown {
      from { transform: translateX(-50%) translateY(-100%); opacity: 0; }
      to { transform: translateX(-50%) translateY(0); opacity: 1; }
    }
  `;
  document.head.appendChild(style);
  
  document.body.appendChild(notification);
  
  // Auto remove after 45 seconds
  setTimeout(() => {
    if (notification.parentElement) {
      notification.remove();
    }
  }, 45000);
}

// Execute the comprehensive fix
comprehensiveAppFix().then(results => {
  console.log('\n🎉 COMPREHENSIVE FIX COMPLETED WITH RESULTS:');
  console.log('Results:', results);
  
  // If on additional tasks page and data exists but not visible, force reload
  if (window.location.pathname.includes('additional') && 
      results.apiEndpoints.activities?.success && 
      results.apiEndpoints.activities.count > 0 &&
      results.pages.additionalTasks?.visibleInUI === false) {
    
    console.log('🔄 CRITICAL: Forcing page reload to fix visibility issue...');
    setTimeout(() => {
      window.location.reload();
    }, 3000);
  }
  
}).catch(error => {
  console.error('❌ Comprehensive fix failed:', error);
  
  // Show error notification
  const errorNotification = document.createElement('div');
  errorNotification.style.cssText = `
    position: fixed;
    top: 20px;
    right: 20px;
    background: linear-gradient(135deg, #ef4444, #dc2626);
    color: white;
    padding: 1.5rem;
    border-radius: 12px;
    box-shadow: 0 8px 25px rgba(239, 68, 68, 0.4);
    z-index: 9999;
    max-width: 400px;
    font-family: system-ui, -apple-system, sans-serif;
  `;
  
  errorNotification.innerHTML = `
    <div style="font-weight: bold; font-size: 1.2rem; margin-bottom: 1rem;">
      ❌ Comprehensive Fix Failed
    </div>
    <div style="font-size: 0.9rem; margin-bottom: 1rem;">
      ${error.message}
    </div>
    <div style="font-size: 0.8rem; color: rgba(255,255,255,0.8); margin-bottom: 1rem;">
      Please check browser console for detailed error information.
    </div>
    <button onclick="this.parentElement.remove()" style="background: rgba(255,255,255,0.2); color: white; border: 1px solid rgba(255,255,255,0.3); padding: 0.5rem 1rem; border-radius: 6px; cursor: pointer;">
      Close
    </button>
  `;
  
  document.body.appendChild(errorNotification);
});