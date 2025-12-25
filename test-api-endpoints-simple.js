// 🧪 Simple API Endpoints Test
// Test all API endpoints to verify they're working correctly

const WAWAN_USER_ID = '421cdb28-f2af-4f1f-aa5f-c59a3d661a2e';

async function testAPIEndpoints() {
  console.log('🧪 Testing API Endpoints');
  console.log('========================');
  
  const endpoints = [
    { name: 'Tasks Daily', url: `/api/tasks-daily?user_id=${WAWAN_USER_ID}` },
    { name: 'Supervisions', url: `/api/supervisions?user_id=${WAWAN_USER_ID}` },
    { name: 'Activities (Additional Tasks)', url: `/api/activities?user_id=${WAWAN_USER_ID}` },
    { name: 'Schools', url: '/api/schools' }
  ];
  
  const results = {};
  
  for (const endpoint of endpoints) {
    try {
      console.log(`\n📡 Testing ${endpoint.name}...`);
      console.log(`🔗 URL: ${endpoint.url}`);
      
      const response = await fetch(endpoint.url);
      console.log(`📊 Status: ${response.status} ${response.statusText}`);
      
      if (response.ok) {
        const data = await response.json();
        console.log(`✅ Success: ${data.length} items returned`);
        
        // Show sample data
        if (data.length > 0) {
          console.log('📋 Sample item:', {
            id: data[0].id,
            title: data[0].title || data[0].name,
            user_id: data[0].user_id,
            created_at: data[0].created_at
          });
        }
        
        results[endpoint.name] = {
          success: true,
          count: data.length,
          data: data
        };
      } else {
        const errorText = await response.text();
        console.error(`❌ Error: ${response.status} - ${errorText}`);
        results[endpoint.name] = {
          success: false,
          error: `${response.status}: ${errorText}`
        };
      }
    } catch (error) {
      console.error(`❌ Fetch failed for ${endpoint.name}:`, error.message);
      results[endpoint.name] = {
        success: false,
        error: error.message
      };
    }
  }
  
  // Summary
  console.log('\n📊 SUMMARY');
  console.log('==========');
  
  const successful = Object.values(results).filter(r => r.success).length;
  const total = Object.keys(results).length;
  
  console.log(`✅ Successful: ${successful}/${total}`);
  
  Object.entries(results).forEach(([name, result]) => {
    if (result.success) {
      console.log(`✅ ${name}: ${result.count} items`);
    } else {
      console.log(`❌ ${name}: ${result.error}`);
    }
  });
  
  // Check specific issue: Activities endpoint
  const activitiesResult = results['Activities (Additional Tasks)'];
  if (activitiesResult && activitiesResult.success && activitiesResult.count > 0) {
    console.log('\n🎯 ADDITIONAL TASKS ANALYSIS');
    console.log('============================');
    console.log(`✅ Found ${activitiesResult.count} additional tasks in API`);
    console.log('📋 Tasks:', activitiesResult.data.map(task => ({
      id: task.id,
      title: task.title || task.name,
      date: task.date,
      user_id: task.user_id
    })));
    
    // Check if we're on the additional tasks page
    if (window.location.pathname.includes('additional') || window.location.pathname.includes('tugas-tambahan')) {
      console.log('📍 Currently on Additional Tasks page');
      
      // Check if tasks are visible in DOM
      const taskContainers = document.querySelectorAll('.grid.gap-6, [data-testid="tasks-grid"]');
      const taskCards = document.querySelectorAll('.hover\\:shadow-md, [data-testid="task-card"]');
      
      console.log(`📦 Found ${taskContainers.length} task containers in DOM`);
      console.log(`📋 Found ${taskCards.length} task cards in DOM`);
      
      if (taskCards.length === 0) {
        console.log('❌ ISSUE CONFIRMED: Data exists in API but not visible in UI');
        console.log('💡 Recommendation: Run the fix script');
      } else {
        console.log('✅ Tasks are visible in UI');
      }
    }
  } else if (activitiesResult && activitiesResult.success && activitiesResult.count === 0) {
    console.log('\n⚠️ No additional tasks found in database');
    console.log('💡 This explains why the Additional Tasks page is empty');
  }
  
  return results;
}

// Run the test
testAPIEndpoints().then(results => {
  // Create a visual summary
  const notification = document.createElement('div');
  notification.style.cssText = `
    position: fixed;
    bottom: 20px;
    right: 20px;
    background: linear-gradient(135deg, #059669, #047857);
    color: white;
    padding: 1.5rem;
    border-radius: 12px;
    box-shadow: 0 8px 25px rgba(5, 150, 105, 0.4);
    z-index: 9999;
    max-width: 400px;
    font-family: system-ui, -apple-system, sans-serif;
    max-height: 400px;
    overflow-y: auto;
  `;
  
  const successful = Object.values(results).filter(r => r.success).length;
  const total = Object.keys(results).length;
  const activitiesCount = results['Activities (Additional Tasks)']?.count || 0;
  
  notification.innerHTML = `
    <div style="font-weight: bold; font-size: 1.2rem; margin-bottom: 1rem;">
      🧪 API Test Results
    </div>
    <div style="font-size: 0.9rem; margin-bottom: 1rem;">
      <strong>Status:</strong> ${successful}/${total} endpoints working<br>
      <strong>Additional Tasks:</strong> ${activitiesCount} found
    </div>
    <div style="font-size: 0.8rem; line-height: 1.4;">
      ${Object.entries(results).map(([name, result]) => 
        `${result.success ? '✅' : '❌'} ${name}: ${result.success ? `${result.count} items` : 'Failed'}`
      ).join('<br>')}
    </div>
    <div style="margin-top: 1rem; display: flex; gap: 0.5rem;">
      ${activitiesCount > 0 && (window.location.pathname.includes('additional') || window.location.pathname.includes('tugas-tambahan')) ? 
        '<button onclick="eval(document.querySelector(\'script[src*=\\\'fix-additional-tasks\\\']\')?.textContent || \'console.log(\\\'Fix script not found\\\')\'); this.parentElement.parentElement.remove();" style="background: white; color: #059669; border: none; padding: 0.5rem 1rem; border-radius: 6px; cursor: pointer; font-size: 0.8rem;">Run Fix</button>' : 
        ''
      }
      <button onclick="this.parentElement.parentElement.remove()" style="background: rgba(255,255,255,0.2); color: white; border: 1px solid rgba(255,255,255,0.3); padding: 0.5rem 1rem; border-radius: 6px; cursor: pointer; font-size: 0.8rem;">Close</button>
    </div>
  `;
  
  document.body.appendChild(notification);
  
  // Auto remove after 15 seconds
  setTimeout(() => {
    if (notification.parentElement) {
      notification.remove();
    }
  }, 15000);
  
}).catch(error => {
  console.error('❌ API test failed:', error);
});