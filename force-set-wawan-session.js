// Script untuk memaksa set user session wawan dan refresh dashboard
console.log('🔧 Memaksa set user session wawan...');

// 1. Ambil data user wawan dari local-database
const localData = JSON.parse(localStorage.getItem('local-database') || '{}');
console.log('📊 Local database loaded:', Object.keys(localData));

if (localData.users && localData.users.length > 0) {
    const wawaUser = localData.users.find(u => u.username === 'wawan');
    
    if (wawaUser) {
        console.log('✅ Found wawan user:', wawaUser);
        
        // Set user session
        localStorage.setItem('auth_user', JSON.stringify(wawaUser));
        localStorage.setItem('currentUser', JSON.stringify(wawaUser));
        localStorage.setItem('user_data', JSON.stringify(wawaUser));
        
        console.log('✅ User session set for wawan');
        
        // Trigger dashboard refresh
        window.dispatchEvent(new StorageEvent('storage', {
            key: 'auth_user',
            newValue: JSON.stringify(wawaUser)
        }));
        
        // Force reload halaman
        setTimeout(() => {
            console.log('🔄 Reloading page...');
            window.location.reload();
        }, 1000);
        
    } else {
        console.log('❌ Wawan user not found in local-database');
        console.log('Available users:', localData.users.map(u => u.username));
    }
} else {
    console.log('❌ No users found in local-database');
}

console.log('✅ Script completed');