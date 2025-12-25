// TEST APEL PAGI API - Jalankan di browser console
const testApelPagiAPI = async () => {
  try {
    console.log('🔍 Testing Apel Pagi API...');
    
    // Get current user
    const currentUser = JSON.parse(localStorage.getItem('auth_user') || '{}');
    const userId = currentUser.id || currentUser.username || 'wawan-user';
    
    console.log('👤 User ID:', userId);
    
    // Test API endpoint
    const baseUrl = window.location.origin;
    const apiUrl = `${baseUrl}/api/tasks?user_id=${userId}`;
    
    console.log('🌐 API URL:', apiUrl);
    
    const response = await fetch(apiUrl);
    
    if (!response.ok) {
      console.error('❌ API Error:', response.status, response.statusText);
      const errorText = await response.text();
      console.error('Error details:', errorText);
      return;
    }
    
    const data = await response.json();
    console.log('📊 Total data from API:', data.length);
    
    // Filter apel pagi
    const apelTasks = data.filter(task => 
      (task.title && task.title.toLowerCase().includes('apel')) ||
      (task.name && task.name.toLowerCase().includes('apel'))
    );
    
    console.log('🌅 Apel Pagi tasks found:', apelTasks.length);
    
    if (apelTasks.length > 0) {
      console.log('✅ Apel Pagi data:');
      apelTasks.forEach((task, index) => {
        console.log(`${index + 1}. ${task.title || task.name} (${task.date})`);
        console.log('   - ID:', task.id);
        console.log('   - Description:', task.description);
        console.log('   - Location:', task.location);
        console.log('   - User ID:', task.user_id);
      });
    } else {
      console.log('❌ No Apel Pagi data found');
      console.log('📋 All tasks:');
      data.forEach((task, index) => {
        console.log(`${index + 1}. ${task.title || task.name} (User: ${task.user_id})`);
      });
    }
    
    // Test if data appears in reports page format
    console.log('\n📄 Testing reports page format:');
    const activities = [];
    data.forEach((task) => {
      activities.push({
        id: task.id,
        type: 'Tugas Tambahan',
        title: task.title || task.name,
        date: task.date,
        location: task.location,
        organizer: task.organizer || 'Pengawas Sekolah',
        description: task.description,
        photo1: task.photo1 || task.photo,
        photo2: task.photo2,
        createdAt: task.created_at
      });
    });
    
    const apelActivities = activities.filter(activity => 
      activity.title && activity.title.toLowerCase().includes('apel')
    );
    
    console.log('📊 Formatted activities for reports:', apelActivities.length);
    apelActivities.forEach(activity => {
      console.log(`- ${activity.title} (${activity.type})`);
    });
    
  } catch (error) {
    console.error('❌ Test error:', error);
  }
};

// Jalankan test
testApelPagiAPI();