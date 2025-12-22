// Script untuk memperbaiki foto profil dashboard
// Jalankan di browser console: copy-paste script ini dan tekan Enter

console.log('🔧 FOTO DASHBOARD - SOLUSI SEDERHANA');

// Function untuk cek foto
function cekFoto() {
    console.log('📷 Checking photos...');
    
    const profileData = localStorage.getItem('profile_data');
    const authUser = localStorage.getItem('auth_user');
    
    console.log('profile_data exists:', !!profileData);
    console.log('auth_user exists:', !!authUser);
    
    if (profileData) {
        try {
            const parsed = JSON.parse(profileData);
            console.log('profile_data.photoUrl exists:', !!parsed.photoUrl);
            if (parsed.photoUrl) {
                console.log('Photo length:', parsed.photoUrl.length);
            }
        } catch (e) {
            console.log('Error parsing profile_data');
        }
    }
    
    if (authUser) {
        try {
            const parsed = JSON.parse(authUser);
            console.log('auth_user.photo_url exists:', !!parsed.photo_url);
            if (parsed.photo_url) {
                console.log('Photo length:', parsed.photo_url.length);
            }
        } catch (e) {
            console.log('Error parsing auth_user');
        }
    }
}

// Function untuk set foto dummy (untuk testing)
function setFotoDummy() {
    console.log('📷 Setting dummy photo...');
    
    // Create a simple colored circle as base64
    const canvas = document.createElement('canvas');
    canvas.width = 80;
    canvas.height = 80;
    const ctx = canvas.getContext('2d');
    
    // Draw colored circle
    ctx.fillStyle = '#6366F1';
    ctx.beginPath();
    ctx.arc(40, 40, 40, 0, 2 * Math.PI);
    ctx.fill();
    
    // Draw letter
    ctx.fillStyle = 'white';
    ctx.font = '32px Arial';
    ctx.textAlign = 'center';
    ctx.fillText('P', 40, 50);
    
    const photoUrl = canvas.toDataURL('image/png');
    
    // Save to profile_data
    const profileData = JSON.parse(localStorage.getItem('profile_data') || '{}');
    profileData.photoUrl = photoUrl;
    localStorage.setItem('profile_data', JSON.stringify(profileData));
    
    console.log('✅ Dummy photo saved to profile_data');
    console.log('🔄 Refresh page to see photo');
}

// Auto-run
cekFoto();

// Export functions
window.cekFoto = cekFoto;
window.setFotoDummy = setFotoDummy;

console.log('✅ Functions available:');
console.log('- cekFoto() - Check photo data');
console.log('- setFotoDummy() - Set dummy photo for testing');