// 🧪 TEST ADDITIONAL TASKS PAGE REFRESH
// Script untuk menguji dan memperbaiki refresh data di halaman Kegiatan Tambahan

console.log('🧪 TEST ADDITIONAL TASKS PAGE REFRESH');
console.log('====================================');

const WAWAN_USER_ID = '421cdb28-f2af-4f1f-aa5f-c59a3d661a2e';

async function testAdditionalTasksPageRefresh() {
  console.log('🔧 Testing additional tasks page refresh...');
  
  // 1. Test API endpoint directly
  console.log('\n1️⃣ TESTING API ENDPOINT');
  
  try {
    const response = await fetch(`/api/activities?user_id=${WAWAN_USER_ID}`);
    console.log('📋 API Response status:', response.status);
    
    if (response.ok) {
      const data = await response.json();
      console.log(`✅ API returned ${data.length} additional tasks`);
      
      // Show each task
      data.forEach((task, index) => {
        console.log(`  ${index + 1}. ${task.title}`);
        console.log(`     Date: ${task.date}`);
        console.log(`     ID: ${task.id}`);
        console.log(`     User ID: ${task.user_id}`);
        console.log(`     School: ${task.schools?.name || 'N/A'}`);
        console.log('     ---');
      });
      
      // Store in cache
      localStorage.setItem('additional_tasks_test_cache', JSON.stringify(data));
      
    } else {
      const errorText = await response.text();
      console.error('❌ API Error:', response.status, errorText);
      return { success: false, error: `API Error: ${response.status}` };
    }
    
  } catch (error) {
    console.error('❌ API Test failed:', error);
    return { success: false, error: error.message };
  }
  
  // 2. Check React Query state
  console.log('\n2️⃣ CHECKING REACT QUERY STATE');
  
  if (window.queryClient) {
    console.log('✅ React Query client found');
    
    // Get current query data
    const queryData = window.queryClient.getQueryData(['additional-tasks']);
    console.log('📋 Current query data:', queryData ? `${queryData.length} items` : 'null');
    
    // Invalidate and refetch
    console.log('🔄 Invalidating queries...');
    await window.queryClient.invalidateQueries({ queryKey: ['additional-tasks'] });
    
    // Force refetch
    console.log('🔄 Forcing refetch...');
    await window.queryClient.refetchQueries({ queryKey: ['additional-tasks'] });
    
    // Check again
    const newQueryData = window.queryClient.getQueryData(['additional-tasks']);
    console.log('📋 New query data:', newQueryData ? `${newQueryData.length} items` : 'null');
    
  } else {
    console.log('⚠️ React Query client not found');
  }
  
  // 3. Clear all caches
  console.log('\n3️⃣ CLEARING ALL CACHES');
  
  const cacheKeys = [
    'additional_tasks_cache',
    'reports_activities_cache',
    'react-query-cache',
    'additional_tasks_test_cache'
  ];
  
  cacheKeys.forEach(key => {
    if (localStorage.getItem(key)) {
      localStorage.removeItem(key);
      console.log(`✅ Cleared ${key}`);
    }
  });
  
  // 4. Force component refresh
  console.log('\n4️⃣ FORCING COMPONENT REFRESH');
  
  // Dispatch multiple events
  const events = [
    'additional-tasks-refresh',
    'data-updated',
    'cache-invalidated',
    'supabase-data-changed'
  ];
  
  events.forEach(eventName => {
    window.dispatchEvent(new CustomEvent(eventName, {
      detail: { 
        timestamp: Date.now(),
        source: 'test-script',
        action: 'refresh'
      }
    }));
    console.log(`✅ Dispatched ${eventName}`);
  });
  
  // 5. Try to find and click refresh elements
  console.log('\n5️⃣ LOOKING FOR REFRESH ELEMENTS');
  
  const refreshSelectors = [
    '[data-testid="refresh"]',
    'button[title*="refresh"]',
    'button[title*="reload"]',
    'button[aria-label*="refresh"]',
    '.refresh-button',
    '[data-refresh]'
  ];
  
  let refreshFound = false;
  refreshSelectors.forEach(selector => {
    const element = document.querySelector(selector);
    if (element) {
      console.log(`✅ Found refresh element: ${selector}`);
      element.click();
      refreshFound = true;
    }
  });
  
  if (!refreshFound) {
    console.log('⚠️ No refresh elements found');
  }
  
  // 6. Check current page and suggest actions
  console.log('\n6️⃣ CHECKING CURRENT PAGE');
  
  const currentPath = window.location.pathname;
  console.log('Current path:', currentPath);
  
  if (currentPath.includes('additional') || currentPath.includes('tugas-tambahan')) {
    console.log('✅ On additional tasks page');
    
    // Try to find the tasks container
    const tasksContainer = document.querySelector('.grid, [data-testid="tasks-grid"], .tasks-container');
    if (tasksContainer) {
      console.log(`✅ Found tasks container with ${tasksContainer.children.length} items`);
    } else {
      console.log('⚠️ Tasks container not found');
    }
    
    // Show reload suggestion
    showReloadSuggestion();
    
  } else {
    console.log('ℹ️ Not on additional tasks page');
    showNavigationSuggestion();
  }
  
  console.log('\n✅ TEST COMPLETED!');
  return { 
    success: true, 
    message: 'Additional tasks page refresh test completed',
    onCorrectPage: currentPath.includes('additional') || currentPath.includes('tugas-tambahan')
  };
}

function showReloadSuggestion() {
  const notification = document.createElement('div');
  notification.style.cssText = `
    position: fixed;
    top: 20px;
    left: 20px;
    background: linear-gradient(135deg, #f59e0b, #d97706);
    color: white;
    padding: 1.5rem;
    border-radius: 12px;
    box-shadow: 0 8px 25px rgba(245, 158, 11, 0.4);
    z-index: 9999;
    max-width: 400px;
    font-family: system-ui, -apple-system, sans-serif;
    animation: slideIn 0.5s ease-out;
  `;
  
  notification.innerHTML = `
    <div style="font-weight: bold; font-size: 1.2rem; margin-bottom: 1rem;">
      🔄 Page Refresh Needed
    </div>
    
    <div style="font-size: 0.9rem; margin-bottom: 1rem; line-height: 1.4;">
      Data has been refreshed in the background, but the page may need to reload to show the latest tasks.
    </div>
    
    <div style="display: flex; gap: 0.5rem;">
      <button onclick="window.location.reload()" style="flex: 1; background: white; color: #f59e0b; border: none; padding: 0.5rem; border-radius: 6px; cursor: pointer; font-size: 0.875rem; font-weight: 600;">
        🔄 Reload Page
      </button>
      <button onclick="this.parentElement.parentElement.remove()" style="background: rgba(255,255,255,0.2); color: white; border: 1px solid rgba(255,255,255,0.3); padding: 0.5rem; border-radius: 6px; cursor: pointer; font-size: 0.875rem;">
        ✕
      </button>
    </div>
  `;
  
  document.body.appendChild(notification);
  
  // Auto remove after 8 seconds
  setTimeout(() => {
    if (notification.parentElement) {
      notification.remove();
    }
  }, 8000);
}

function showNavigationSuggestion() {
  const notification = document.createElement('div');
  notification.style.cssText = `
    position: fixed;
    top: 20px;
    left: 20px;
    background: linear-gradient(135deg, #6366f1, #4f46e5);
    color: white;
    padding: 1.5rem;
    border-radius: 12px;
    box-shadow: 0 8px 25px rgba(99, 102, 241, 0.4);
    z-index: 9999;
    max-width: 400px;
    font-family: system-ui, -apple-system, sans-serif;
    animation: slideIn 0.5s ease-out;
  `;
  
  notification.innerHTML = `
    <div style="font-weight: bold; font-size: 1.2rem; margin-bottom: 1rem;">
      📋 Navigate to Tasks Page
    </div>
    
    <div style="font-size: 0.9rem; margin-bottom: 1rem; line-height: 1.4;">
      Data refresh completed. Navigate to the "Kegiatan Tambahan" page to see your tasks.
    </div>
    
    <div style="display: flex; gap: 0.5rem;">
      <button onclick="window.location.href='/additional-tasks'" style="flex: 1; background: white; color: #6366f1; border: none; padding: 0.5rem; border-radius: 6px; cursor: pointer; font-size: 0.875rem; font-weight: 600;">
        📋 Go to Tasks
      </button>
      <button onclick="this.parentElement.parentElement.remove()" style="background: rgba(255,255,255,0.2); color: white; border: 1px solid rgba(255,255,255,0.3); padding: 0.5rem; border-radius: 6px; cursor: pointer; font-size: 0.875rem;">
        ✕
      </button>
    </div>
  `;
  
  document.body.appendChild(notification);
  
  // Auto remove after 8 seconds
  setTimeout(() => {
    if (notification.parentElement) {
      notification.remove();
    }
  }, 8000);
}

// Add animation styles
const style = document.createElement('style');
style.textContent = `
  @keyframes slideIn {
    from { transform: translateX(-100%); opacity: 0; }
    to { transform: translateX(0); opacity: 1; }
  }
`;
document.head.appendChild(style);

// Execute the test
testAdditionalTasksPageRefresh().then(result => {
  console.log('\n🎉 TEST COMPLETED WITH RESULTS:', result);
}).catch(error => {
  console.error('❌ Test failed:', error);
});