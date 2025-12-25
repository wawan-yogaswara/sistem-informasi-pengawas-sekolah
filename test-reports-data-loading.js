// Test script to verify reports data loading from Supabase
console.log('🧪 Testing Reports Data Loading from Supabase');
console.log('================================================');

const WAWAN_USER_ID = '421cdb28-f2af-4f1f-aa5f-c59a3d661a2e';

async function testDataLoading() {
  try {
    console.log('🔍 Testing API endpoints with user_id:', WAWAN_USER_ID);
    
    // Test tasks endpoint
    console.log('\n📋 Testing tasks endpoint...');
    const tasksResponse = await fetch(`http://localhost:5000/api/tasks-daily?user_id=${encodeURIComponent(WAWAN_USER_ID)}`);
    if (tasksResponse.ok) {
      const tasksData = await tasksResponse.json();
      console.log(`✅ Tasks: Found ${tasksData.length} tasks`);
      tasksData.forEach((task, index) => {
        console.log(`   ${index + 1}. ${task.title} (${task.date}) - ID: ${task.id}`);
      });
    } else {
      console.log('❌ Tasks endpoint failed:', tasksResponse.status);
    }
    
    // Test supervisions endpoint
    console.log('\n🔍 Testing supervisions endpoint...');
    const supervisionsResponse = await fetch(`http://localhost:5000/api/supervisions?user_id=${encodeURIComponent(WAWAN_USER_ID)}`);
    if (supervisionsResponse.ok) {
      const supervisionsData = await supervisionsResponse.json();
      console.log(`✅ Supervisions: Found ${supervisionsData.length} supervisions`);
      supervisionsData.forEach((supervision, index) => {
        console.log(`   ${index + 1}. ${supervision.school_name || 'Unknown School'} (${supervision.date}) - ID: ${supervision.id}`);
      });
    } else {
      console.log('❌ Supervisions endpoint failed:', supervisionsResponse.status);
    }
    
    // Test activities endpoint
    console.log('\n➕ Testing activities endpoint...');
    const activitiesResponse = await fetch(`http://localhost:5000/api/activities?user_id=${encodeURIComponent(WAWAN_USER_ID)}`);
    if (activitiesResponse.ok) {
      const activitiesData = await activitiesResponse.json();
      console.log(`✅ Activities: Found ${activitiesData.length} activities`);
      activitiesData.forEach((activity, index) => {
        console.log(`   ${index + 1}. ${activity.title || activity.name} (${activity.date}) - ID: ${activity.id}`);
      });
    } else {
      console.log('❌ Activities endpoint failed:', activitiesResponse.status);
    }
    
    // Test schools endpoint (for location names)
    console.log('\n🏫 Testing schools endpoint...');
    const schoolsResponse = await fetch('http://localhost:5000/api/schools');
    if (schoolsResponse.ok) {
      const schoolsData = await schoolsResponse.json();
      console.log(`✅ Schools: Found ${schoolsData.length} schools`);
    } else {
      console.log('❌ Schools endpoint failed:', schoolsResponse.status);
    }
    
    console.log('\n📊 Summary:');
    console.log('- If all endpoints return data, the issue is in the frontend');
    console.log('- If endpoints return empty arrays, the issue is in the database or user_id mapping');
    console.log('- Check the browser console in the reports page for more details');
    
  } catch (error) {
    console.error('❌ Test failed:', error);
  }
}

// Run the test
testDataLoading();