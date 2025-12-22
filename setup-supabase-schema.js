import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Fungsi untuk setup schema Supabase
async function setupSupabaseSchema() {
    console.log('🛠️ Setup Schema Supabase Database\n');
    console.log('=' .repeat(50));
    
    // Baca konfigurasi dari .env
    const envPath = path.join(__dirname, '.env');
    const envContent = fs.readFileSync(envPath, 'utf8');
    
    const urlMatch = envContent.match(/SUPABASE_URL=(.+)/);
    const keyMatch = envContent.match(/SUPABASE_ANON_KEY=(.+)/);
    
    if (!urlMatch || !keyMatch) {
        console.log('❌ Konfigurasi Supabase tidak ditemukan di .env');
        return false;
    }
    
    const supabaseUrl = urlMatch[1].trim();
    const supabaseKey = keyMatch[1].trim();
    
    console.log('📋 Menggunakan konfigurasi:');
    console.log(`URL: ${supabaseUrl}`);
    console.log(`Key: ${supabaseKey.substring(0, 20)}...`);
    console.log('');
    
    // Periksa key valid
    if (supabaseKey.includes('Ej8Ej8Ej8')) {
        console.log('❌ Supabase key tidak valid');
        console.log('💡 Silakan update .env dengan key yang benar');
        console.log('📖 Lihat CARA_FIX_SUPABASE_CONNECTION_STEP_BY_STEP.md');
        return false;
    }
    
    try {
        const supabase = createClient(supabaseUrl, supabaseKey);
        
        console.log('🔄 Menguji koneksi...');
        
        // Test koneksi dasar
        const { data: testData, error: testError } = await supabase
            .from('users')
            .select('count')
            .limit(1);
            
        if (testError && testError.message.includes('relation "users" does not exist')) {
            console.log('📝 Tabel belum ada, akan dibuat...\n');
            
            // SQL untuk membuat semua tabel
            const createTablesSQL = `
            -- Buat tabel users
            CREATE TABLE IF NOT EXISTS users (
              id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
              username VARCHAR(50) UNIQUE NOT NULL,
              password VARCHAR(255) NOT NULL,
              role VARCHAR(20) DEFAULT 'user',
              name VARCHAR(100) NOT NULL,
              nip VARCHAR(50),
              position VARCHAR(100),
              photo TEXT,
              created_at TIMESTAMP DEFAULT NOW()
            );

            -- Buat tabel schools
            CREATE TABLE IF NOT EXISTS schools (
              id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
              name VARCHAR(200) NOT NULL,
              address TEXT,
              principal VARCHAR(100),
              phone VARCHAR(20),
              email VARCHAR(100),
              created_at TIMESTAMP DEFAULT NOW()
            );

            -- Buat tabel tasks
            CREATE TABLE IF NOT EXISTS tasks (
              id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
              user_id UUID REFERENCES users(id),
              title VARCHAR(200) NOT NULL,
              description TEXT,
              date DATE NOT NULL,
              completed BOOLEAN DEFAULT FALSE,
              photo TEXT,
              created_at TIMESTAMP DEFAULT NOW()
            );

            -- Buat tabel supervisions
            CREATE TABLE IF NOT EXISTS supervisions (
              id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
              user_id UUID REFERENCES users(id),
              school_id UUID REFERENCES schools(id),
              type VARCHAR(20) DEFAULT 'academic',
              date DATE NOT NULL,
              findings TEXT,
              recommendations TEXT,
              photo TEXT,
              created_at TIMESTAMP DEFAULT NOW()
            );

            -- Buat tabel additional_tasks
            CREATE TABLE IF NOT EXISTS additional_tasks (
              id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
              user_id UUID REFERENCES users(id),
              school_id UUID REFERENCES schools(id),
              title VARCHAR(200) NOT NULL,
              description TEXT,
              date DATE NOT NULL,
              status VARCHAR(20) DEFAULT 'pending',
              photo TEXT,
              created_at TIMESTAMP DEFAULT NOW()
            );
            `;
            
            console.log('⚠️ Tidak dapat membuat tabel melalui anon key');
            console.log('💡 Silakan jalankan SQL berikut di Supabase SQL Editor:');
            console.log('');
            console.log('🔗 https://supabase.com/dashboard/project/[your-project]/sql');
            console.log('');
            console.log('📋 SQL untuk di-copy:');
            console.log('-'.repeat(50));
            console.log(createTablesSQL);
            console.log('-'.repeat(50));
            
            // Simpan SQL ke file
            fs.writeFileSync('supabase-schema.sql', createTablesSQL);
            console.log('💾 SQL disimpan ke file: supabase-schema.sql');
            
            return false;
        }
        
        if (testError) {
            console.log('❌ Error koneksi:', testError.message);
            return false;
        }
        
        console.log('✅ Koneksi berhasil!');
        console.log('✅ Tabel sudah ada dan siap digunakan');
        
        // Test insert data sample
        console.log('\n🧪 Testing insert data...');
        
        const { data: insertData, error: insertError } = await supabase
            .from('users')
            .insert({
                username: 'test_connection',
                password: 'test123',
                name: 'Test Connection',
                role: 'user'
            })
            .select();
            
        if (insertError) {
            console.log('⚠️ Warning insert test:', insertError.message);
            if (insertError.message.includes('duplicate key')) {
                console.log('💡 Data test sudah ada (normal)');
            }
        } else {
            console.log('✅ Insert test berhasil');
            
            // Hapus data test
            await supabase
                .from('users')
                .delete()
                .eq('username', 'test_connection');
            console.log('🧹 Data test dibersihkan');
        }
        
        console.log('\n🎉 Setup Supabase berhasil!');
        console.log('📊 Database siap menerima data dari aplikasi');
        
        return true;
        
    } catch (err) {
        console.log('❌ Error setup:', err.message);
        
        if (err.message.includes('fetch')) {
            console.log('💡 Kemungkinan masalah koneksi internet atau DNS');
            console.log('🔧 Coba:');
            console.log('   - Periksa koneksi internet');
            console.log('   - Gunakan VPN jika ada blocking');
            console.log('   - Periksa firewall/antivirus');
        }
        
        return false;
    }
}

// Fungsi untuk migrasi data dari local ke Supabase
async function migrateLocalToSupabase() {
    console.log('\n📦 Migrasi Data Local ke Supabase\n');
    
    // Baca data local
    const localDbPath = path.join(__dirname, 'local-database.json');
    if (!fs.existsSync(localDbPath)) {
        console.log('❌ File local-database.json tidak ditemukan');
        return false;
    }
    
    const localData = JSON.parse(fs.readFileSync(localDbPath, 'utf8'));
    console.log('📋 Data local ditemukan:');
    console.log(`   Users: ${localData.users?.length || 0}`);
    console.log(`   Schools: ${localData.schools?.length || 0}`);
    console.log(`   Tasks: ${localData.tasks?.length || 0}`);
    console.log(`   Supervisions: ${localData.supervisions?.length || 0}`);
    console.log(`   Additional Tasks: ${localData.additionalTasks?.length || 0}`);
    
    // Setup Supabase client
    const envPath = path.join(__dirname, '.env');
    const envContent = fs.readFileSync(envPath, 'utf8');
    
    const urlMatch = envContent.match(/SUPABASE_URL=(.+)/);
    const keyMatch = envContent.match(/SUPABASE_ANON_KEY=(.+)/);
    
    if (!urlMatch || !keyMatch) {
        console.log('❌ Konfigurasi Supabase tidak ditemukan');
        return false;
    }
    
    const supabase = createClient(urlMatch[1].trim(), keyMatch[1].trim());
    
    try {
        // Migrasi users
        if (localData.users && localData.users.length > 0) {
            console.log('\n🔄 Migrasi users...');
            for (const user of localData.users) {
                const { error } = await supabase
                    .from('users')
                    .upsert({
                        id: user.id,
                        username: user.username,
                        password: user.password,
                        role: user.role,
                        name: user.name,
                        nip: user.nip,
                        position: user.position,
                        photo: user.photo
                    });
                    
                if (error) {
                    console.log(`⚠️ Error migrasi user ${user.username}:`, error.message);
                } else {
                    console.log(`✅ User ${user.username} berhasil`);
                }
            }
        }
        
        // Migrasi schools
        if (localData.schools && localData.schools.length > 0) {
            console.log('\n🔄 Migrasi schools...');
            for (const school of localData.schools) {
                const { error } = await supabase
                    .from('schools')
                    .upsert({
                        id: school.id,
                        name: school.name,
                        address: school.address,
                        principal: school.principal,
                        phone: school.phone,
                        email: school.email
                    });
                    
                if (error) {
                    console.log(`⚠️ Error migrasi school ${school.name}:`, error.message);
                } else {
                    console.log(`✅ School ${school.name} berhasil`);
                }
            }
        }
        
        console.log('\n🎉 Migrasi data selesai!');
        return true;
        
    } catch (err) {
        console.log('❌ Error migrasi:', err.message);
        return false;
    }
}

// Main function
async function main() {
    console.log('🚀 Setup Supabase Schema & Migration\n');
    
    const setupOk = await setupSupabaseSchema();
    
    if (setupOk) {
        console.log('\n📦 Lanjut migrasi data? (y/n)');
        // Untuk demo, langsung migrasi
        await migrateLocalToSupabase();
    }
}

// Jalankan script
main().catch(console.error);

export { setupSupabaseSchema, migrateLocalToSupabase };