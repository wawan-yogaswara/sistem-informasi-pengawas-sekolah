
// Browser Sync Script untuk Opera, Chrome, Edge
// Jalankan di console browser untuk sync data localStorage

console.log('🔄 Starting Browser Sync...');

// Function to get localStorage data
function getLocalStorageData() {
    const data = {};
    for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        data[key] = localStorage.getItem(key);
    }
    return data;
}

// Function to set localStorage data
function setLocalStorageData(data) {
    Object.keys(data).forEach(key => {
        localStorage.setItem(key, data[key]);
    });
}

// Check current data
const currentData = getLocalStorageData();
console.log('📦 Current localStorage keys:', Object.keys(currentData));

// Check if local-database exists
const localDatabase = localStorage.getItem('local-database');
if (!localDatabase) {
    console.log('❌ No local-database found!');
    console.log('💡 Please copy data from working browser:');
    console.log('1. Open working browser (Chrome/Edge)');
    console.log('2. Go to Developer Tools > Console');
    console.log('3. Run: JSON.stringify(localStorage.getItem("local-database"))');
    console.log('4. Copy the result');
    console.log('5. In this browser, run: localStorage.setItem("local-database", [PASTE_HERE])');
} else {
    try {
        const database = JSON.parse(localDatabase);
        console.log('✅ local-database found');
        console.log('📊 Data structure:', {
            users: database.users?.length || 0,
            tasks: database.tasks?.length || 0,
            supervisions: database.supervisions?.length || 0,
            additionalTasks: database.additionalTasks?.length || 0
        });
        
        // Check wawan user data
        const wawan = database.users?.find(u => u.username === 'wawan');
        if (wawan) {
            const wawaUserId = '1762696525337';
            const wawaActivities = {
                tasks: database.tasks?.filter(t => t.userId === wawaUserId) || [],
                supervisions: database.supervisions?.filter(s => s.userId === wawaUserId) || [],
                additionalTasks: database.additionalTasks?.filter(t => t.userId === wawaUserId) || []
            };
            
            console.log('👤 Wawan activities:', {
                tasks: wawaActivities.tasks.length,
                supervisions: wawaActivities.supervisions.length,
                additionalTasks: wawaActivities.additionalTasks.length
            });
            
            // Count photos
            let totalPhotos = 0;
            [...wawaActivities.tasks, ...wawaActivities.supervisions, ...wawaActivities.additionalTasks].forEach(activity => {
                if (activity.photo1) totalPhotos++;
                if (activity.photo2) totalPhotos++;
            });
            
            console.log('📸 Total photos:', totalPhotos);
            
            if (totalPhotos === 0) {
                console.log('❌ No photos found in data!');
            } else {
                console.log('✅ Photos found in data');
            }
        } else {
            console.log('❌ Wawan user not found!');
        }
        
    } catch (error) {
        console.log('❌ Error parsing local-database:', error.message);
    }
}

// Check auth_user
const authUser = localStorage.getItem('auth_user');
if (!authUser) {
    console.log('❌ No auth_user found!');
    console.log('💡 Please login again');
} else {
    try {
        const user = JSON.parse(authUser);
        console.log('✅ auth_user found:', user.username);
    } catch (error) {
        console.log('❌ Error parsing auth_user:', error.message);
    }
}

console.log('🔄 Browser Sync Check Complete');
console.log('📋 Browser Info:', {
    userAgent: navigator.userAgent,
    browser: navigator.userAgent.includes('Chrome') ? 'Chrome' : 
             navigator.userAgent.includes('Firefox') ? 'Firefox' : 
             navigator.userAgent.includes('Safari') ? 'Safari' : 
             navigator.userAgent.includes('Edge') ? 'Edge' : 
             navigator.userAgent.includes('Opera') ? 'Opera' : 'Unknown',
    localStorage: typeof(Storage) !== "undefined",
    currentURL: window.location.href
});
