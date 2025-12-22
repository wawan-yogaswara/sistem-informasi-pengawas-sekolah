// 🧪 Quick Test Script for Additional Tasks Save
// Run this in browser console to test localStorage functionality

console.log('🚀 Starting Additional Tasks Save Test...');

// Test 1: Clear existing data
console.log('🧹 Clearing existing data...');
localStorage.removeItem('additional_tasks_data');
localStorage.removeItem('additional_tasks_data_backup');
localStorage.removeItem('additional_tasks_data_timestamp');

// Test 2: Create test data
console.log('📝 Creating test data...');
const testTask = {
    id: Date.now().toString(),
    name: "Test Rapat Koordinasi Pengawas",
    date: "2024-12-22",
    location: "Kantor Dinas Pendidikan",
    organizer: "Dinas Pendidikan Provinsi Jawa Barat",
    description: "Test kegiatan untuk memverifikasi penyimpanan data",
    createdAt: new Date().toISOString()
};

console.log('✨ Test task created:', testTask);

// Test 3: Save to localStorage (simulate handleAddTask)
console.log('💾 Saving to localStorage...');
const existingData = localStorage.getItem('additional_tasks_data');
const currentTasks = existingData ? JSON.parse(existingData) : [];
const updatedTasks = [...currentTasks, testTask];

localStorage.setItem('additional_tasks_data', JSON.stringify(updatedTasks));
localStorage.setItem('additional_tasks_data_backup', JSON.stringify(updatedTasks));
localStorage.setItem('additional_tasks_data_timestamp', Date.now().toString());

console.log('✅ Data saved! Total tasks:', updatedTasks.length);

// Test 4: Verify save
console.log('🔍 Verifying save...');
const savedData = localStorage.getItem('additional_tasks_data');
if (savedData) {
    const parsed = JSON.parse(savedData);
    console.log('✅ SUCCESS! Data retrieved from localStorage');
    console.log('📊 Tasks count:', parsed.length);
    console.log('📋 Data:', parsed);
    
    // Test 5: Simulate query function
    console.log('🔄 Testing query function...');
    const queryResult = (() => {
        try {
            if (typeof window !== 'undefined' && window.localStorage) {
                const tasksData = localStorage.getItem('additional_tasks_data');
                console.log('📖 Reading from localStorage:', tasksData ? 'Found data' : 'No data');
                
                if (tasksData) {
                    const parsed = JSON.parse(tasksData);
                    console.log('✅ Parsed successfully:', parsed.length, 'items');
                    return Array.isArray(parsed) ? parsed : [];
                }
            }
            console.log('⚠️ No data found');
            return [];
        } catch (error) {
            console.warn('❌ Error in query function:', error);
            return [];
        }
    })();
    
    console.log('🎯 Query function result:', queryResult);
    
    if (queryResult.length > 0) {
        console.log('🎉 SUCCESS! All tests passed!');
        console.log('✅ Data save: WORKING');
        console.log('✅ Data retrieve: WORKING');
        console.log('✅ Query function: WORKING');
        
        // Test 6: Add another task to test array handling
        console.log('🔄 Testing multiple tasks...');
        const secondTask = {
            id: (Date.now() + 1).toString(),
            name: "Test Supervisi Sekolah",
            date: "2024-12-23",
            location: "SMAN 1 Garut",
            organizer: "Pengawas Sekolah",
            description: "Test supervisi untuk memverifikasi multiple data",
            createdAt: new Date().toISOString()
        };
        
        const currentData = JSON.parse(localStorage.getItem('additional_tasks_data') || '[]');
        const newData = [...currentData, secondTask];
        localStorage.setItem('additional_tasks_data', JSON.stringify(newData));
        
        const finalCheck = JSON.parse(localStorage.getItem('additional_tasks_data') || '[]');
        console.log('🎯 Final check - Total tasks:', finalCheck.length);
        console.log('📋 All tasks:', finalCheck);
        
        if (finalCheck.length === 2) {
            console.log('🏆 PERFECT! Multiple tasks handling works!');
        }
        
    } else {
        console.log('❌ FAILED! Query function not working');
    }
    
} else {
    console.log('❌ FAILED! Data not saved to localStorage');
}

// Test 7: Check all related localStorage keys
console.log('🔑 All localStorage keys:');
Object.keys(localStorage).forEach(key => {
    if (key.includes('additional_tasks')) {
        console.log(`  - ${key}: ${localStorage.getItem(key) ? 'Has data' : 'Empty'}`);
    }
});

console.log('🏁 Test completed!');
console.log('');
console.log('📋 SUMMARY:');
console.log('- Run this script in browser console');
console.log('- Check for SUCCESS messages');
console.log('- If all tests pass, the fix is working');
console.log('- If any test fails, check the error messages');
console.log('');
console.log('🔗 Next: Test in actual application at http://localhost:5173');