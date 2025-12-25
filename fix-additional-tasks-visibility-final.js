// 🎯 TARGETED FIX: Additional Tasks Page Visibility Issue
// This script specifically fixes the issue where data exists in Supabase and Reports page
// but doesn't appear in the Additional Tasks page

console.log('🎯 TARGETED FIX: Additional Tasks Page Visibility Issue');
console.log('==================================================');

const WAWAN_USER_ID = '421cdb28-f2af-4f1f-aa5f-c59a3d661a2e';

async function fixAdditionalTasksVisibility() {
  console.log('🔍 Diagnosing Additional Tasks page issue...');
  
  // Step 1: Check if we're on the right page
  const currentPath = window.location.pathname;
  console.log('📍 Current page:', currentPath);
  
  if (!currentPath.includes('additional') && !currentPath.includes('tugas-tambahan')) {
    console.log('⚠️ Not on Additional Tasks page. Redirecting...');
    window.location.href = '/additional-tasks';
    return;
  }
  
  // Step 2: Fix user authentication
  console.log('🔐 Fixing user authentication...');
  const authUser = localStorage.getItem('auth_user');
  let userData = authUser ? JSON.parse(authUser) : null;
  
  if (!userData || userData.id !== WAWAN_USER_ID) {
    userData = {
      id: WAWAN_USER_ID,
      username: 'wawan',
      fullName: 'H. Wawan Yogaswara, S.Pd, M.Pd',
      role: 'admin',
      nip: '196512121990031007',
      position: 'Pengawas Sekolah'
    };
    localStorage.setItem('auth_user', JSON.stringify(userData));
    console.log('✅ User authentication fixed');
  }
  
  // Step 3: Test API endpoint directly
  console.log('🔗 Testing activities API endpoint...');
  try {
    const response = await fetch(`/api/activities?user_id=${WAWAN_USER_ID}`);
    console.log('📡 API Response status:', response.status);
    
    if (response.ok) {
      const data = await response.json();
      console.log(`✅ API returned ${data.length} activities`);
      console.log('📋 Activities data:', data);
      
      if (data.length === 0) {
        console.log('⚠️ No data in API - this is the root cause');
        return { issue: 'no_data_in_api', data: [] };
      }
      
      // Step 4: Check if React Query is working
      console.log('⚡ Checking React Query...');
      if (window.queryClient) {
        console.log('✅ React Query client found');
        
        // Clear and invalidate cache
        window.queryClient.clear();
        await window.queryClient.invalidateQueries({ queryKey: ['additional-tasks'] });
        console.log('✅ Cleared React Query cache');
        
        // Force refetch
        await window.queryClient.refetchQueries({ queryKey: ['additional-tasks'] });
        console.log('✅ Forced refetch');
      }
      
      // Step 5: Check DOM for task containers
      console.log('🔍 Checking DOM for task containers...');
      const taskContainers = document.querySelectorAll('.grid.gap-6, [data-testid="tasks-grid"]');
      console.log(`📦 Found ${taskContainers.length} task containers`);
      
      let hasVisibleTasks = false;
      taskContainers.forEach((container, index) => {
        const taskCards = container.querySelectorAll('.hover\\:shadow-md, [data-testid="task-card"]');
        console.log(`📦 Container ${index + 1}: ${taskCards.length} task cards`);
        if (taskCards.length > 0) hasVisibleTasks = true;
      });
      
      if (!hasVisibleTasks) {
        console.log('❌ Data exists in API but not visible in UI');
        
        // Step 6: Force component re-render
        console.log('🔄 Forcing component re-render...');
        
        // Dispatch custom events
        const events = [
          'additional-tasks-refresh',
          'data-updated',
          'cache-cleared',
          'user-updated'
        ];
        
        events.forEach(eventName => {
          window.dispatchEvent(new CustomEvent(eventName, {
            detail: { 
              timestamp: Date.now(),
              userId: WAWAN_USER_ID,
              data: data
            }
          }));
        });
        
        // Clear localStorage caches
        const cacheKeys = [
          'additional_tasks_cache',
          'react-query-cache'
        ];
        
        cacheKeys.forEach(key => {
          if (localStorage.getItem(key)) {
            localStorage.removeItem(key);
            console.log(`✅ Cleared ${key}`);
          }
        });
        
        // Wait a moment then check again
        setTimeout(() => {
          const updatedContainers = document.querySelectorAll('.grid.gap-6');
          let nowHasVisibleTasks = false;
          updatedContainers.forEach(container => {
            if (container.children.length > 0) nowHasVisibleTasks = true;
          });
          
          if (!nowHasVisibleTasks) {
            console.log('🔄 Still not visible, forcing page reload...');
            window.location.reload();
          } else {
            console.log('✅ Tasks now visible after refresh!');
          }
        }, 2000);
        
        return { issue: 'data_not_visible', data: data, fixed: true };
      } else {
        console.log('✅ Tasks are visible in UI');
        return { issue: 'none', data: data };
      }
      
    } else {
      const errorText = await response.text();
      console.error('❌ API Error:', response.status, errorText);
      return { issue: 'api_error', error: `${response.status}: ${errorText}` };
    }
    
  } catch (error) {
    console.error('❌ API fetch failed:', error);
    return { issue: 'api_fetch_failed', error: error.message };
  }
}

// Execute the fix
fixAdditionalTasksVisibility().then(result => {
  console.log('\n🎉 DIAGNOSIS COMPLETE');
  console.log('Result:', result);
  
  // Show user-friendly notification
  const notification = document.createElement('div');
  notification.style.cssText = `
    position: fixed;
    top: 20px;
    right: 20px;
    background: linear-gradient(135deg, #1e40af, #1d4ed8);
    color: white;
    padding: 1.5rem;
    border-radius: 12px;
    box-shadow: 0 8px 25px rgba(30, 64, 175, 0.4);
    z-index: 9999;
    max-width: 400px;
    font-family: system-ui, -apple-system, sans-serif;
    animation: slideIn 0.5s ease-out;
  `;
  
  let title, message, action;
  
  switch (result.issue) {
    case 'no_data_in_api':
      title = '⚠️ No Data Found';
      message = 'No additional tasks found in database. Try adding some tasks first.';
      action = '<button onclick="window.location.href=\'/additional-tasks\'" style="background: white; color: #1e40af; border: none; padding: 0.5rem 1rem; border-radius: 6px; cursor: pointer; margin-top: 1rem;">Add Tasks</button>';
      break;
      
    case 'data_not_visible':
      title = '🔄 Fixed Visibility Issue';
      message = `Found ${result.data.length} tasks in database. Applied fixes to make them visible.`;
      action = '<button onclick="window.location.reload()" style="background: rgba(255,255,255,0.2); color: white; border: 1px solid rgba(255,255,255,0.3); padding: 0.5rem 1rem; border-radius: 6px; cursor: pointer; margin-top: 1rem;">Reload Page</button>';
      break;
      
    case 'api_error':
      title = '❌ API Error';
      message = `API endpoint failed: ${result.error}`;
      action = '<button onclick="window.location.reload()" style="background: rgba(255,255,255,0.2); color: white; border: 1px solid rgba(255,255,255,0.3); padding: 0.5rem 1rem; border-radius: 6px; cursor: pointer; margin-top: 1rem;">Retry</button>';
      break;
      
    case 'none':
      title = '✅ Everything Working';
      message = `Found ${result.data.length} tasks and they are visible in the UI.`;
      action = '';
      break;
      
    default:
      title = '❌ Unknown Issue';
      message = 'An unexpected issue occurred. Check browser console for details.';
      action = '<button onclick="window.location.reload()" style="background: rgba(255,255,255,0.2); color: white; border: 1px solid rgba(255,255,255,0.3); padding: 0.5rem 1rem; border-radius: 6px; cursor: pointer; margin-top: 1rem;">Reload</button>';
  }
  
  notification.innerHTML = `
    <div style="font-weight: bold; font-size: 1.2rem; margin-bottom: 1rem;">
      ${title}
    </div>
    <div style="font-size: 0.9rem; line-height: 1.4; margin-bottom: 1rem;">
      ${message}
    </div>
    ${action}
    <button onclick="this.parentElement.remove()" style="position: absolute; top: 0.5rem; right: 0.5rem; background: rgba(255,255,255,0.2); color: white; border: none; width: 1.5rem; height: 1.5rem; border-radius: 50%; cursor: pointer; font-size: 0.8rem;">
      ✕
    </button>
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
      notification.remove();
    }
  }, 10000);
  
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
    <button onclick="this.parentElement.remove()" style="background: rgba(255,255,255,0.2); color: white; border: 1px solid rgba(255,255,255,0.3); padding: 0.5rem 1rem; border-radius: 6px; cursor: pointer;">
      Close
    </button>
  `;
  
  document.body.appendChild(errorNotification);
});