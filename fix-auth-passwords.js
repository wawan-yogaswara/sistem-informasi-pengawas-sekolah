import bcrypt from 'bcryptjs';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Path ke file database lokal
const DB_FILE = path.join(__dirname, 'local-database.json');

async function fixAuthPasswords() {
    try {
        console.log('🔧 Memperbaiki masalah autentikasi...');
        
        // Baca database saat ini
        if (!fs.existsSync(DB_FILE)) {
            console.error('❌ File local-database.json tidak ditemukan!');
            return;
        }
        
        const data = JSON.parse(fs.readFileSync(DB_FILE, 'utf-8'));
        console.log('📖 Database berhasil dibaca');
        
        // Generate password hash yang benar
        const adminPasswordHash = await bcrypt.hash('admin', 10);
        const wawanPasswordHash = await bcrypt.hash('wawan123', 10);
        
        console.log('🔐 Password hash berhasil di-generate');
        
        // Update user passwords
        let adminUpdated = false;
        let wawanUpdated = false;
        
        data.users = data.users.map(user => {
            if (user.username === 'admin') {
                console.log(`👤 Memperbaiki user admin: ${user.fullName}`);
                adminUpdated = true;
                return {
                    ...user,
                    password: adminPasswordHash,
                    role: 'admin' // Pastikan role benar
                };
            } else if (user.username === 'wawan') {
                console.log(`👤 Memperbaiki user wawan: ${user.fullName}`);
                wawanUpdated = true;
                return {
                    ...user,
                    password: wawanPasswordHash,
                    role: 'pengawas' // Pastikan role benar
                };
            }
            return user;
        });
        
        if (!adminUpdated) {
            console.log('➕ Menambahkan user admin baru');
            data.users.push({
                id: Date.now().toString(),
                username: 'admin',
                password: adminPasswordHash,
                fullName: 'Administrator',
                role: 'admin',
                nip: null,
                rank: null,
                officeName: null,
                officeAddress: null,
                homeAddress: null,
                phone: null,
                photoUrl: null,
                createdAt: new Date().toISOString()
            });
        }
        
        if (!wawanUpdated) {
            console.log('➕ Menambahkan user wawan baru');
            data.users.push({
                id: Date.now().toString(),
                username: 'wawan',
                password: wawanPasswordHash,
                fullName: 'H. Wawan Yogaswara, S.Pd, M.Pd',
                role: 'pengawas',
                nip: '196805301994121001',
                rank: 'Pembina Utama Muda, IV/c',
                officeName: 'Cabang Dinas Pendidikan Wilayah XI Dinas Pendidikan Provinsi Jawa Barat',
                officeAddress: 'Jl. A.Yani No. 23 Kel. Paminggir Kec. Garut Kota Kabupaten Garut',
                homeAddress: 'Griya Surya Indah No. 50 Kel. Sukagalih Kec. Tarogong Kidul Garut',
                phone: '087733438282',
                photoUrl: null,
                createdAt: new Date().toISOString()
            });
        }
        
        // Backup file lama
        const backupFile = DB_FILE + '.backup.' + Date.now();
        fs.copyFileSync(DB_FILE, backupFile);
        console.log(`💾 Backup dibuat: ${backupFile}`);
        
        // Simpan database yang sudah diperbaiki
        fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2));
        console.log('✅ Database berhasil diperbaiki dan disimpan');
        
        // Verifikasi password
        console.log('\n🔍 Verifikasi password:');
        const adminUser = data.users.find(u => u.username === 'admin');
        const wawanUser = data.users.find(u => u.username === 'wawan');
        
        if (adminUser) {
            const adminCheck = await bcrypt.compare('admin', adminUser.password);
            console.log(`👤 Admin password check: ${adminCheck ? '✅ BENAR' : '❌ SALAH'}`);
            console.log(`👤 Admin role: ${adminUser.role}`);
        }
        
        if (wawanUser) {
            const wawanCheck = await bcrypt.compare('wawan123', wawanUser.password);
            console.log(`👤 Wawan password check: ${wawanCheck ? '✅ BENAR' : '❌ SALAH'}`);
            console.log(`👤 Wawan role: ${wawanUser.role}`);
        }
        
        // Test cross-authentication (harus gagal)
        console.log('\n🚫 Test cross-authentication (harus gagal):');
        if (adminUser) {
            const crossCheck1 = await bcrypt.compare('wawan123', adminUser.password);
            console.log(`👤 Admin dengan password wawan123: ${crossCheck1 ? '❌ BERHASIL (MASALAH!)' : '✅ GAGAL (BENAR)'}`);
        }
        
        if (wawanUser) {
            const crossCheck2 = await bcrypt.compare('admin', wawanUser.password);
            console.log(`👤 Wawan dengan password admin: ${crossCheck2 ? '❌ BERHASIL (MASALAH!)' : '✅ GAGAL (BENAR)'}`);
        }
        
        console.log('\n🎉 Perbaikan autentikasi selesai!');
        console.log('\n📋 Kredensial yang benar:');
        console.log('   👤 Admin: username="admin", password="admin", role="admin"');
        console.log('   👤 Wawan: username="wawan", password="wawan123", role="pengawas"');
        console.log('\n🔄 Silakan restart server dengan: npm run dev');
        
    } catch (error) {
        console.error('❌ Error saat memperbaiki autentikasi:', error);
    }
}

// Jalankan perbaikan
fixAuthPasswords();