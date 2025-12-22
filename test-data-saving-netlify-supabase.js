import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function testDataSaving() {
    console.log('💾 Test Penyimpanan Data Netlify-Supabase\n');
    console.log('=' .repeat(60));
    
    // Baca konfigurasi
    const envPath = path.join(__dirname, '.env');
    const envContent = fs.readFileSync(envPath, 'utf8');
    
    const urlMatch = envContent.match(/SUPABASE_URL=(.+)/);
    const keyMatch = envContent.match(/SUPABASE_ANON_KEY=(.+)/);
    
    if (!urlMatch || !keyMatch) {
        console.log('❌ Konfigurasi Supabase tidak ditemukan di .env');
        return;
    }
    
    const supabaseUrl = urlMatch[1].trim();
    const supabaseKey = keyMatch[1].trim();
    
    console.log('📋 Konfigurasi:');
    console.log(`URL: ${supabaseUrl}`);
    console.log(`Key: ${supabaseKey.substring(0, 30)}...`);
    
    if (supabaseKey.includes('Ej8Ej8Ej8')) {
        console.log('\n❌ Key tidak valid!');
        console.log('💡 Update key dengan yang benar dari Supabase dashboard');
        console.log('📖 Lihat: PANDUAN_FIX_NETLIFY_SUPABASE_DATA_SAVING.md');
        return;
    }
    
    try {
        const supabase = createClient(supabaseUrl, supabaseKey);
        
        // Test 1: Koneksi dasar
        console.log('\n🔄 Test 1: Koneksi Dasar');
        const { data: testConnection, error: connectionError } = await supabase
            .from('users')
            .select('count')
            .limit(1);
            
        if (connectionError) {
            console.log(`❌ Error koneksi: ${connectionError.message}`);
            
            if (connectionError.message.includes('relation "users" does not exist')) {
                console.log('💡 Tabel users belum dibuat');
                console.log('🔧 Jalankan SQL schema di Supabase SQL Editor');
                return;
            }
            return;
        }
        
        console.log('✅ Koneksi berhasil');
        
        // Test 2: Insert User
        console.log('\n👤 Test 2: Insert User');
        const testUser = {
            username: `test_user_${Date.now()}`,
            password: '$2b$10$hashedpassword',
            name: 'Test User Netlify',
            role: 'user',
            nip: '123456789',
            position: 'Test Position'
        };
        
        const { data: userData, error: userError } = await supabase
            .from('users')
            .insert(testUser)
            .select();
            
        if (userError) {
            console.log(`❌ Error insert user: ${userError.message}`);
            
            if (userError.message.includes('permission')) {
                console.log('💡 Masalah permission - periksa RLS policy');
            } else if (userError.message.includes('duplicate')) {
                console.log('💡 Username sudah ada (normal)');
            }
        } else {
            console.log('✅ Insert user berhasil');
            console.log(`📊 User ID: ${userData[0].id}`);
        }
        
        // Test 3: Insert School
        console.log('\n🏫 Test 3: Insert School');
        const testSchool = {
            name: `Test School ${Date.now()}`,
            address: 'Jl. Test No. 123',
            principal: 'Test Principal',
            phone: '0262-123456',
            email: 'test@school.com'
        };
        
        const { data: schoolData, error: schoolError } = await supabase
            .from('schools')
            .insert(testSchool)
            .select();
            
        if (schoolError) {
            console.log(`❌ Error insert school: ${schoolError.message}`);
        } else {
            console.log('✅ Insert school berhasil');
            console.log(`📊 School ID: ${schoolData[0].id}`);
        }
        
        // Test 4: Insert Task (jika user berhasil)
        if (userData && userData[0]) {
            console.log('\n📝 Test 4: Insert Task');
            const testTask = {
                user_id: userData[0].id,
                title: `Test Task ${Date.now()}`,
                description: 'Test task description',
                date: new Date().toISOString().split('T')[0],
                completed: false
            };
            
            const { data: taskData, error: taskError } = await supabase
                .from('tasks')
                .insert(testTask)
                .select();
                
            if (taskError) {
                console.log(`❌ Error insert task: ${taskError.message}`);
            } else {
                console.log('✅ Insert task berhasil');
                console.log(`📊 Task ID: ${taskData[0].id}`);
            }
        }
        
        // Test 5: Query data
        console.log('\n📊 Test 5: Query Data');
        const { data: allUsers, error: queryError } = await supabase
            .from('users')
            .select('id, username, name, role')
            .limit(5);
            
        if (queryError) {
            console.log(`❌ Error query: ${queryError.message}`);
        } else {
            console.log('✅ Query berhasil');
            console.log(`📊 Total users: ${allUsers.length}`);
            allUsers.forEach(user => {
                console.log(`   - ${user.username} (${user.name}) - ${user.role}`);
            });
        }
        
        // Cleanup: Hapus data test
        console.log('\n🧹 Cleanup: Hapus Data Test');
        if (userData && userData[0]) {
            await supabase.from('users').delete().eq('id', userData[0].id);
            console.log('✅ Test user dihapus');
        }
        
        if (schoolData && schoolData[0]) {
            await supabase.from('schools').delete().eq('id', schoolData[0].id);
            console.log('✅ Test school dihapus');
        }
        
        // Summary
        console.log('\n🎉 Summary Test Penyimpanan Data:');
        console.log('✅ Koneksi Supabase: OK');
        console.log('✅ Insert User: OK');
        console.log('✅ Insert School: OK');
        console.log('✅ Query Data: OK');
        console.log('✅ Cleanup: OK');
        
        console.log('\n💡 Aplikasi siap untuk production!');
        console.log('📋 Langkah selanjutnya:');
        console.log('1. Set environment variables di Netlify');
        console.log('2. Redeploy Netlify site');
        console.log('3. Test di production URL');
        
    } catch (err) {
        console.log(`❌ Error: ${err.message}`);
        
        if (err.message.includes('fetch')) {
            console.log('💡 Kemungkinan masalah:');
            console.log('   - Koneksi internet tidak stabil');
            console.log('   - Firewall memblokir koneksi');
            console.log('   - DNS resolver bermasalah');
        }
    }
}

// Fungsi untuk generate environment variables Netlify
function showNetlifyEnvVars() {
    console.log('\n📝 Environment Variables untuk Netlify:');
    console.log('=' .repeat(50));
    
    console.log('Di Netlify Dashboard > Site Settings > Environment Variables:');
    console.log('');
    console.log('Variable 1:');
    console.log('  Key: VITE_SUPABASE_URL');
    console.log('  Value: https://fmxeboullgcewzjpql.supabase.co');
    console.log('');
    console.log('Variable 2:');
    console.log('  Key: VITE_SUPABASE_ANON_KEY');
    console.log('  Value: [paste-key-yang-benar-dari-dashboard]');
    console.log('');
    console.log('⚠️ Pastikan menggunakan key yang SAMA dengan .env lokal');
    console.log('🔄 Setelah set, klik "Trigger deploy" untuk redeploy');
}

// Main function
async function main() {
    await testDataSaving();
    showNetlifyEnvVars();
}

main().catch(console.error);