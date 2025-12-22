import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Path ke file database lokal
const DB_FILE = path.join(__dirname, 'local-database.json');

async function convertPhotoToBase64() {
    try {
        console.log('📷 Mengkonversi foto profil ke base64...');
        
        // Baca database
        if (!fs.existsSync(DB_FILE)) {
            console.error('❌ File local-database.json tidak ditemukan!');
            return;
        }
        
        const data = JSON.parse(fs.readFileSync(DB_FILE, 'utf-8'));
        console.log('📖 Database berhasil dibaca');
        
        let updated = false;
        
        // Update semua user yang memiliki foto dengan path /uploads/
        data.users = data.users.map(user => {
            if (user.photoUrl && user.photoUrl.startsWith('/uploads/')) {
                const photoPath = path.join(__dirname, user.photoUrl);
                console.log(`📷 Processing photo for ${user.fullName}: ${photoPath}`);
                
                if (fs.existsSync(photoPath)) {
                    try {
                        // Baca file foto
                        const photoBuffer = fs.readFileSync(photoPath);
                        
                        // Deteksi MIME type berdasarkan ekstensi
                        const ext = path.extname(photoPath).toLowerCase();
                        let mimeType = 'image/jpeg';
                        if (ext === '.png') mimeType = 'image/png';
                        if (ext === '.gif') mimeType = 'image/gif';
                        if (ext === '.webp') mimeType = 'image/webp';
                        
                        // Konversi ke base64
                        const base64Photo = `data:${mimeType};base64,${photoBuffer.toString('base64')}`;
                        
                        console.log(`✅ Foto ${user.fullName} berhasil dikonversi ke base64`);
                        console.log(`📏 Ukuran base64: ${base64Photo.length} characters`);
                        
                        updated = true;
                        return {
                            ...user,
                            photoUrl: base64Photo
                        };
                    } catch (error) {
                        console.error(`❌ Error mengkonversi foto ${user.fullName}:`, error.message);
                        return user;
                    }
                } else {
                    console.log(`⚠️ File foto tidak ditemukan: ${photoPath}`);
                    return user;
                }
            }
            return user;
        });
        
        if (updated) {
            // Backup file lama
            const backupFile = DB_FILE + '.backup-photo.' + Date.now();
            fs.copyFileSync(DB_FILE, backupFile);
            console.log(`💾 Backup dibuat: ${backupFile}`);
            
            // Simpan database yang sudah diupdate
            fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2));
            console.log('✅ Database berhasil diupdate dengan foto base64');
            
            // Tampilkan informasi user yang diupdate
            console.log('\n📋 USER YANG DIUPDATE:');
            data.users.forEach(user => {
                if (user.photoUrl && user.photoUrl.startsWith('data:')) {
                    console.log(`👤 ${user.fullName}: Foto base64 (${user.photoUrl.length} chars)`);
                }
            });
            
        } else {
            console.log('ℹ️ Tidak ada foto yang perlu dikonversi');
        }
        
        console.log('\n🎉 Proses konversi foto selesai!');
        console.log('🔄 Restart server dan refresh dashboard untuk melihat perubahan');
        
    } catch (error) {
        console.error('❌ Error saat mengkonversi foto:', error);
    }
}

// Jalankan konversi
convertPhotoToBase64();