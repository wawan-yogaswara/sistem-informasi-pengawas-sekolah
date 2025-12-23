// Script sederhana untuk memastikan user Wawan tersimpan dengan benar
console.log('🔧 Fixing user Wawan data...');

// Set user Wawan
const wawaUser = {
    id: "1762696525337",
    username: "wawan",
    fullName: "Wawan Setiawan",
    role: "user",
    nip: "196801011990031001"
};

localStorage.setItem('auth_user', JSON.stringify(wawaUser));
localStorage.setItem('currentUser', JSON.stringify(wawaUser));
localStorage.setItem('user_data', JSON.stringify(wawaUser));

console.log('✅ User Wawan data fixed!');
console.log('🔄 Please refresh the dashboard to see the changes.');

// Trigger storage event
window.dispatchEvent(new StorageEvent('storage', {
    key: 'auth_user',
    newValue: JSON.stringify(wawaUser)
}));