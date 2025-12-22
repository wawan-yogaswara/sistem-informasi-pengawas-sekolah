import bcrypt from 'bcryptjs';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Path ke file database lokal
const DB_FILE = path.join(__dirname, 'local-database.json');

async function verifyAuthFix() {
    try {
        console.log('🔍 Memverifikasi perbaikan autentikasi...\n');
        
        // Baca database
        if (!fs.existsSync(DB_FILE)) {
            console.error('❌ File local-database.json tidak ditemukan!');
            return;
        }
        
        const data = JSON.parse(fs.readFileSync(DB_FILE, 'utf-8'));
        
        // Cari user admin dan wawan
        const adminUser = data.users.find(u => u.username === 'admin');
        const wawanUser = data.users.find(u => u.username === 'wawan');
        
        if (!adminUser) {
            console.error('❌ User admin tidak ditemukan!');
            return;
        }
        
        if (!wawanUser) {
            console.error('❌ User wawan tidak ditemukan!');
            return;
        }
        
        console.log('📋 HASIL VERIFIKASI AUTENTIKASI:\n');
        
        // Test 1: Admin login dengan password admin
        const test1 = await bcrypt.compare('admin', adminUser.password);
        console.log(`1. Admin (admin/admin) → Role: ${adminUser.role} → ${test1 ? '✅ BERHASIL' : '❌ GAGAL'}`);
        
        // Test 2: Wawan login dengan password wawan123
        const test2 = await bcrypt.compare('wawan123', wawanUser.password);
        console.log(`2. Wawan (wawan/wawan123) → Role: ${wawanUser.role} → ${test2 ? '✅ BERHASIL' : '❌ GAGAL'}`);
        
        // Test 3: Admin dengan password wawan (harus gagal)
        const test3 = await bcrypt.compare('wawan123', adminUser.password);
        console.log(`3. Admin (admin/wawan123) → ${test3 ? '❌ BERHASIL (MASALAH!)' : '✅ GAGAL (BENAR)'}`);
        
        // Test 4: Wawan dengan password admin (harus gagal)
        const test4 = await bcrypt.compare('admin', wawanUser.password);
        console.log(`4. Wawan (wawan/admin) → ${test4 ? '❌ BERHASIL (MASALAH!)' : '✅ GAGAL (BENAR)'}`);
        
        // Test 5: Verifikasi role assignment
        const roleTest1 = adminUser.role === 'admin';
        const roleTest2 = wawanUser.role === 'pengawas';
        console.log(`5. Admin role check → ${roleTest1 ? '✅ BENAR (admin)' : '❌ SALAH (' + adminUser.role + ')'}`);
        console.log(`6. Wawan role check → ${roleTest2 ? '✅ BENAR (pengawas)' : '❌ SALAH (' + wawanUser.role + ')'}`);
        
        // Kesimpulan
        const allTestsPassed = test1 && test2 && !test3 && !test4 && roleTest1 && roleTest2;
        
        console.log('\n' + '='.repeat(50));
        if (allTestsPassed) {
            console.log('🎉 SEMUA TEST BERHASIL! Masalah autentikasi sudah teratasi.');
            console.log('✅ Admin hanya bisa login sebagai admin');
            console.log('✅ Wawan hanya bisa login sebagai pengawas');
            console.log('✅ Cross-authentication sudah diblokir');
            console.log('✅ Role assignment sudah benar');
        } else {
            console.log('❌ MASIH ADA MASALAH! Beberapa test gagal.');
            if (!test1) console.log('   - Admin tidak bisa login dengan password admin');
            if (!test2) console.log('   - Wawan tidak bisa login dengan password wawan123');
            if (test3) console.log('   - Admin masih bisa login dengan password wawan123');
            if (test4) console.log('   - Wawan masih bisa login dengan password admin');
            if (!roleTest1) console.log('   - Role admin salah: ' + adminUser.role);
            if (!roleTest2) console.log('   - Role wawan salah: ' + wawanUser.role);
        }
        console.log('='.repeat(50));
        
        // Informasi tambahan
        console.log('\n📋 INFORMASI USER:');
        console.log(`👤 Admin: ${adminUser.fullName} (ID: ${adminUser.id})`);
        console.log(`👤 Wawan: ${wawanUser.fullName} (ID: ${wawanUser.id})`);
        
        console.log('\n🔄 Jika semua test berhasil, restart server dengan: npm run dev');
        
    } catch (error) {
        console.error('❌ Error saat verifikasi:', error);
    }
}

// Jalankan verifikasi
verifyAuthFix();