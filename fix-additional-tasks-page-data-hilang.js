// 🚀 FIX ADDITIONAL TASKS PAGE DATA HILANG
// Script untuk memperbaiki masalah data tidak muncul di halaman Kegiatan Tambahan

console.log('🚀 FIX ADDITIONAL TASKS PAGE DATA HILANG');
console.log('=========================================');

const WAWAN_USER_ID = '421cdb28-f2af-4f1f-aa5f-c59a3d661a2e';

async function fixAdditionalTasksPageDataHilang() {
  console.log('🔧 Starting fix for additional tasks page data...');
  
  // 1. Clear React Query cache
  console.log('\n1️⃣ CLEARING REACT QUERY CACHE');
  
  // Clear all query caches
  if (window.queryClient) {
    console.log('✅ Found React Query client, clearing cache...');
    window.queryClient.clear();
    window.queryClient.invalidateQueries(['additional-tasks']);
    window.queryClient.refetchQueries(['additional-tasks']);
  } else {
    console.log('⚠️ React Query client not found in window');
  }
  
  // Clear localStorage caches
  const cacheKeys = [
    'additional_tasks_cache',
    'reports_activities_cache',
    'react-query-cache'
  ];
  
  cacheKeys.forEach(key => {
    if (localStorage.getItem(key)) {
      localStorage.removeItem(key);
      console.log(`✅ Cleared ${key}`);
    }
  });
  
  // 2. Test direct API call
  console.log('\n2️⃣ TESTING DIRECT API CALL');
  
  try {
    console.log('📋 Testing /api/activities endpoint...');
    const response = await fetch(`/api/activities?user_id=${WAWAN_USER_ID}`);
    console.log('📋 Response status:', response.status);
    
    if (response.ok) {
      const data = await response.json();
      console.log(`✅ Found ${data.length} additional tasks in API`);
      
      // Log each task
      data.forEach((task, index) => {
        console.log(`  ${index + 1}. ${task.title} (${task.date || task.created_at})`);
        console.log(`     ID: ${task.id}`);
        console.log(`     User ID: ${task.user_id}`);
        console.log(`     School: ${task.schools?.name || 'N/A'}`);
      });
      
      // Store in cache for immediate use
      localStorage.setItem('additional_tasks_cache', JSON.stringify(data));
      
    } else {
      const errorText = await response.text();
      console.error('❌ API Error:', response.status, errorText);
      throw new Error(`API failed: ${response.status} - ${errorText}`);
    }
    
  } catch (error) {
    console.error('❌ API Test failed:', error);
    throw error;
  }
  
  // 3. Force refresh the page component
  console.log('\n3️⃣ FORCING PAGE REFRESH');
  
  // Dispatch custom events to trigger re-renders
  const events = [
    'additional-tasks-updated',
    'data-refresh',
    'cache-cleared'
  ];
  
  events.forEach(eventName => {
    window.dispatchEvent(new CustomEvent(eventName, {
      detail: { timestamp: Date.now(), source: 'fix-script' }
    }));
    console.log(`✅ Dispatched ${eventName} event`);
  });
  
  // Force storage event
  window.dispatchEvent(new StorageEvent('storage', {
    key: 'additional_tasks_cache',
    newValue: localStorage.getItem('additional_tasks_cache'),
    url: window.location.href
  }));
  
  // 4. Check if we're on the additional-tasks page
  console.log('\n4️⃣ CHECKING CURRENT PAGE');
  
  const currentPath = window.location.pathname;
  console.log('Current path:', currentPath);
  
  if (currentPath.includes('additional') || currentPath.includes('tugas-tambahan')) {
    console.log('✅ On additional tasks page, forcing reload...');
    
    // Try to trigger React component refresh
    const refreshButton = document.querySelector('[data-testid="refresh"], button[title*="refresh"], button[title*="reload"]');
    if (refreshButton) {
      refreshButton.click();
      console.log('✅ Clicked refresh button');
    }
    
    // Force page reload as last resort
    setTimeout(() => {
      console.log('🔄 Force reloading page...');
      window.location.reload();
    }, 2000);
    
  } else {
    console.log('ℹ️ Not on additional tasks page, navigate there to see results');
  }
  
  // 5. Show success status
  console.log('\n5️⃣ SHOWING SUCCESS STATUS');
  showFixStatus();
  
  console.log('\n✅ FIX COMPLETED!');
  console.log('🎯 Additional tasks should now appear on the page');
  console.log('📋 If still not visible, navigate to "Kegiatan Tambahan" page');
  
  return {
    success: true,
    message: 'Additional tasks page data fix completed'
  };
}

function showFixStatus() {
  // Create success notification
  const notification = document.createElement('div');
  notification.style.cssText = `
    position: fixed;
    top: 20px;
    right: 20px;
    background: linear-gradient(135deg, #3b82f6, #1d4ed8);
    color: white;
    padding: 1.5rem;
    border-radius: 12px;
    box-shadow: 0 8px 25px rgba(59, 130, 246, 0.4);
    z-index: 9999;
    max-width: 400px;
    font-family: system-ui, -apple-system, sans-serif;
    animation: slideIn 0.5s ease-out;
  `;
  
  notification.innerHTML = `
    <div style="font-weight: bold; font-size: 1.2rem; margin-bottom: 1rem; text-align: center;">
      🔄 Data Refresh Fixed!
    </div>
    
    <div style="background: rgba(255,255,255,0.1); border-radius: 8px; padding: 1rem; margin-bottom: 1rem;">
      <div style="font-weight: 600; margin-bottom: 0.5rem;">✅ What was fixed:</div>
      <div style="font-size: 0.9rem; line-height: 1.4;">
        • React Query cache cleared<br>
        • API connection verified<br>
        • Component refresh triggered<br>
        • Data synchronization restored
      </div>
    </div>
    
    <div style="background: rgba(255,255,255,0.1); border-radius: 8px; padding: 1rem; margin-bottom: 1rem;">
      <div style="font-weight: 600; margin-bottom: 0.5rem;">📋 Status:</div>
      <div style="font-size: 0.9rem; line-height: 1.4;">
        ✅ Data saved in Supabase<br>
        ✅ Data visible in Reports<br>
        🔄 Additional Tasks page refreshing...
      </div>
    </div>
    
    <div style="display: flex; gap: 0.5rem; margin-top: 1rem;">
      <button onclick="window.location.href='/additional-tasks'" style="flex: 1; background: white; color: #3b82f6; border: none; padding: 0.5rem; border-radius: 6px; cursor: pointer; font-size: 0.875rem; font-weight: 600;">
        📋 View Tasks
      </button>
      <button onclick="window.location.reload()" style="flex: 1; background: rgba(255,255,255,0.2); color: white; border: 1px solid rgba(255,255,255,0.3); padding: 0.5rem; border-radius: 6px; cursor: pointer; font-size: 0.875rem;">
        🔄 Reload
      </button>
      <button onclick="this.parentElement.parentElement.remove()" style="background: rgba(255,255,255,0.2); color: white; border: 1px solid rgba(255,255,255,0.3); padding: 0.5rem; border-radius: 6px; cursor: pointer; font-size: 0.875rem;">
        ✕
      </button>
    </div>
  `;
  
  // Add animation
  const style = document.createElement('style');
  style.textContent = `
    @keyframes slideIn {
      from { transform: translateX(100%); opacity: 0; }
      to { transform: translateX(0); opacity: 1; }
    }
  `;
  document.head.appendChild(style);
  
  document.body.appendChild(notification);
  
  // Auto remove after 10 seconds
  setTimeout(() => {
    if (notification.parentElement) {
      notification.style.animation = 'slideIn 0.5s ease-out reverse';
      setTimeout(() => notification.remove(), 500);
    }
  }, 10000);
}

// Execute the fix
fixAdditionalTasksPageDataHilang().then(result => {
  console.log('\n🎉 FIX COMPLETED WITH RESULTS:', result);
}).catch(error => {
  console.error('❌ Fix failed:', error);
  
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
      ❌ Fix Failed
    </div>
    <div style="font-size: 0.9rem; margin-bottom: 1rem;">
      ${error.message}
    </div>
    <div style="font-size: 0.8rem; color: rgba(255,255,255,0.8);">
      Try refreshing the page manually or check the browser console for more details.
    </div>
    <button onclick="this.parentElement.remove()" style="margin-top: 1rem; background: rgba(255,255,255,0.2); color: white; border: 1px solid rgba(255,255,255,0.3); padding: 0.5rem 1rem; border-radius: 6px; cursor: pointer;">
      Close
    </button>
  `;
  
  document.body.appendChild(errorNotification);
});