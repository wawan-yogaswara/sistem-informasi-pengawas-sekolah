import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Fungsi untuk menguji koneksi Supabase
async function testSupabaseConnection() {
    console.log('🔍 Menguji koneksi Supabase...\n');
    
    // Baca konfigurasi dari .env
    const envPath = path.join(__dirname, '.env');
    const envContent = fs.readFileSync(envPath, 'utf8');
    
    // Extract Supabase config
    const urlMatch = envContent.match(/SUPABASE_URL=(.+)/);
    const keyMatch = envContent.match(/SUPABASE_ANON_KEY=(.+)/);
    
    if (!urlMatch || !keyMatch) {
        console.log('❌ Konfigurasi Supabase tidak ditemukan di .env');
        return false;
    }
    
    const supabaseUrl = urlMatch[1].trim();
    const supabaseKey = keyMatch[1].trim();
    
    console.log('📋 Konfigurasi Supabase:');
    console.log(`URL: ${supabaseUrl}`);
    console.log(`Key: ${supabaseKey.substring(0, 20)}...`);
    console.log('');
    
    // Periksa apakah key valid (tidak berulang)
    if (supabaseKey.includes('Ej8Ej8Ej8')) {
        console.log('❌ Supabase key tidak valid (berulang)');
        console.log('💡 Silakan dapatkan key yang benar dari dashboard Supabase');
        return false;
    }
    
    try {
        // Buat client Supabase
        const supabase = createClient(supabaseUrl, supabaseKey);
        
        // Test koneksi dengan query sederhana
        console.log('🔄 Menguji koneksi ke Supabase...');
        const { data, error } = await supabase.from('users').select('count').limit(1);
        
        if (error) {
            console.log('❌ Error koneksi Supabase:', error.message);
            
            // Analisis error
            if (error.message.includes('relation "users" does not exist')) {
                console.log('💡 Tabel "users" belum dibuat di Supabase');
                console.log('📝 Jalankan setup schema terlebih dahulu');
            } else if (error.message.includes('Invalid API key')) {
                console.log('💡 API key tidak valid');
            } else if (error.message.includes('fetch')) {
                console.log('💡 Masalah koneksi internet atau DNS');
            }
            
            return false;
        }
        
        console.log('✅ Koneksi Supabase berhasil!');
        console.log('📊 Data response:', data);
        return true;
        
    } catch (err) {
        console.log('❌ Error saat menguji koneksi:', err.message);
        
        if (err.message.includes('fetch')) {
            console.log('💡 Kemungkinan masalah:');
            console.log('   - Koneksi internet tidak stabil');
            console.log('   - DNS resolver bermasalah');
            console.log('   - Firewall memblokir koneksi');
        }
        
        return false;
    }
}

// Fungsi untuk setup schema Supabase
async function setupSupabaseSchema() {
    console.log('\n🛠️ Setup Schema Supabase...\n');
    
    const envPath = path.join(__dirname, '.env');
    const envContent = fs.readFileSync(envPath, 'utf8');
    
    const urlMatch = envContent.match(/SUPABASE_URL=(.+)/);
    const keyMatch = envContent.match(/SUPABASE_ANON_KEY=(.+)/);
    
    if (!urlMatch || !keyMatch) {
        console.log('❌ Konfigurasi Supabase tidak ditemukan');
        return false;
    }
    
    const supabaseUrl = urlMatch[1].trim();
    const supabaseKey = keyMatch[1].trim();
    
    try {
        const supabase = createClient(supabaseUrl, supabaseKey);
        
        // Coba buat tabel users
        console.log('📝 Membuat tabel users...');
        const { error: usersError } = await supabase.rpc('create_users_table');
        
        if (usersError && !usersError.message.includes('already exists')) {
            console.log('⚠️ Error membuat tabel users:', usersError.message);
        } else {
            console.log('✅ Tabel users siap');
        }
        
        return true;
        
    } catch (err) {
        console.log('❌ Error setup schema:', err.message);
        return false;
    }
}

// Fungsi untuk memperbaiki konfigurasi
function fixSupabaseConfig() {
    console.log('\n🔧 Memperbaiki konfigurasi Supabase...\n');
    
    const envPath = path.join(__dirname, '.env');
    let envContent = fs.readFileSync(envPath, 'utf8');
    
    // Periksa apakah key berulang
    if (envContent.includes('Ej8Ej8Ej8')) {
        console.log('❌ Ditemukan key yang tidak valid');
        console.log('💡 Silakan update .env dengan key yang benar dari Supabase dashboard');
        console.log('');
        console.log('📋 Langkah-langkah:');
        console.log('1. Buka https://supabase.com/dashboard');
        console.log('2. Pilih project Anda');
        console.log('3. Pergi ke Settings > API');
        console.log('4. Copy "anon public" key');
        console.log('5. Update SUPABASE_ANON_KEY dan VITE_SUPABASE_ANON_KEY di .env');
        
        return false;
    }
    
    console.log('✅ Konfigurasi terlihat valid');
    return true;
}

// Main function
async function main() {
    console.log('🚀 Fix Supabase Connection - Diagnosa dan Perbaikan\n');
    console.log('=' .repeat(60));
    
    // Step 1: Periksa konfigurasi
    const configOk = fixSupabaseConfig();
    if (!configOk) {
        return;
    }
    
    // Step 2: Test koneksi
    const connectionOk = await testSupabaseConnection();
    if (!connectionOk) {
        console.log('\n❌ Koneksi Supabase gagal');
        console.log('💡 Periksa konfigurasi dan koneksi internet');
        return;
    }
    
    // Step 3: Setup schema jika perlu
    await setupSupabaseSchema();
    
    console.log('\n✅ Supabase siap digunakan!');
    console.log('🎉 Aplikasi sekarang dapat menyimpan data ke Supabase');
}

// Jalankan script
main().catch(console.error);

export { testSupabaseConnection, setupSupabaseSchema, fixSupabaseConfig };