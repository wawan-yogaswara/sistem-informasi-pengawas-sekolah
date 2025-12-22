import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Path ke file database lokal
const DB_FILE = path.join(__dirname, 'local-database.json');

async function fixDashboardProfilePhoto() {
    try {
        console.log('📷 Memperbaiki foto profil dashboard...');
        
        // Baca database
        if (!fs.existsSync(DB_FILE)) {
            console.error('❌ File local-database.json tidak ditemukan!');
            return;
        }
        
        const data = JSON.parse(fs.readFileSync(DB_FILE, 'utf-8'));
        console.log('📖 Database berhasil dibaca');
        
        // Cari user wawan
        const wawanUser = data.users.find(u => u.username === 'wawan');
        
        if (!wawanUser) {
            console.error('❌ User wawan tidak ditemukan!');
            return;
        }
        
        console.log('👤 User wawan ditemukan:', wawanUser.fullName);
        console.log('📷 Photo URL:', wawanUser.photoUrl ? 'Ada' : 'Tidak ada');
        
        if (wawanUser.photoUrl) {
            // Jika foto ada di database, pastikan tersimpan di localStorage juga
            console.log('💾 Menyimpan foto ke localStorage untuk dashboard...');
            
            // Buat script untuk dijalankan di browser
            const browserScript = `
// Script untuk memperbaiki foto profil dashboard
console.log('📷 Fixing dashboard profile photo...');

// Data user wawan dengan foto
const wawanUserData = ${JSON.stringify(wawanUser)};

// Simpan ke berbagai key localStorage yang digunakan dashboard
localStorage.setItem('auth_user', JSON.stringify(wawanUserData));
localStorage.setItem('currentUser', JSON.stringify(wawanUserData));
localStorage.setItem('user_data', JSON.stringify(wawanUserData));
localStorage.setItem('profile_data', JSON.stringify({
    fullName: wawanUserData.fullName,
    nip: wawanUserData.nip,
    photoUrl: wawanUserData.photoUrl,
    role: wawanUserData.role
}));
localStorage.setItem('dashboard_photo', wawanUserData.photoUrl);

console.log('✅ Foto profil berhasil disimpan ke localStorage');
console.log('📷 Photo URL length:', wawanUserData.photoUrl.length, 'characters');

// Trigger event untuk refresh dashboard
window.dispatchEvent(new Event('photoUpdated'));
window.dispatchEvent(new StorageEvent('storage', {
    key: 'profile_data',
    newValue: JSON.stringify({
        fullName: wawanUserData.fullName,
        nip: wawanUserData.nip,
        photoUrl: wawanUserData.photoUrl,
        role: wawanUserData.role
    })
}));

console.log('🔄 Dashboard refresh events triggered');
alert('✅ Foto profil dashboard berhasil diperbaiki! Refresh halaman jika perlu.');
            `;
            
            // Simpan script ke file HTML untuk dijalankan di browser
            const htmlContent = `
<!DOCTYPE html>
<html>
<head>
    <title>Fix Dashboard Profile Photo</title>
</head>
<body>
    <h1>Fix Dashboard Profile Photo</h1>
    <p>Klik tombol di bawah untuk memperbaiki foto profil dashboard:</p>
    <button onclick="fixPhoto()">🔧 Perbaiki Foto Profil Dashboard</button>
    
    <script>
        function fixPhoto() {
            ${browserScript}
        }
        
        // Auto-run when page loads
        window.onload = function() {
            fixPhoto();
        };
    </script>
</body>
</html>
            `;
            
            fs.writeFileSync('fix-dashboard-photo.html', htmlContent);
            console.log('✅ File fix-dashboard-photo.html berhasil dibuat');
            console.log('🌐 Buka file fix-dashboard-photo.html di browser untuk memperbaiki foto profil');
            
        } else {
            console.log('⚠️ User wawan tidak memiliki foto profil');
            console.log('💡 Silakan upload foto profil di halaman Profile terlebih dahulu');
        }
        
        // Tampilkan informasi user
        console.log('\n📋 INFORMASI USER WAWAN:');
        console.log(`   Nama: ${wawanUser.fullName}`);
        console.log(`   NIP: ${wawanUser.nip}`);
        console.log(`   Role: ${wawanUser.role}`);
        console.log(`   Foto: ${wawanUser.photoUrl ? '✅ Ada' : '❌ Tidak ada'}`);
        
        if (wawanUser.photoUrl) {
            console.log(`   Foto Length: ${wawanUser.photoUrl.length} characters`);
            console.log(`   Foto Type: ${wawanUser.photoUrl.substring(0, 30)}...`);
        }
        
    } catch (error) {
        console.error('❌ Error saat memperbaiki foto profil dashboard:', error);
    }
}

// Jalankan perbaikan
fixDashboardProfilePhoto();