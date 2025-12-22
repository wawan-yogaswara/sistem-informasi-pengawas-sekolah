import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import readline from 'readline';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

function question(prompt) {
    return new Promise((resolve) => {
        rl.question(prompt, resolve);
    });
}

async function updateSupabaseConfig() {
    console.log('🔧 Update Konfigurasi Supabase\n');
    console.log('=' .repeat(50));
    
    console.log('📋 Dapatkan konfigurasi dari:');
    console.log('   https://supabase.com/dashboard');
    console.log('   Settings > API\n');
    
    // Input URL
    const url = await question('🔗 Masukkan Supabase URL: ');
    if (!url.trim()) {
        console.log('❌ URL tidak boleh kosong');
        rl.close();
        return;
    }
    
    // Input Key
    const key = await question('🔑 Masukkan Supabase Anon Key: ');
    if (!key.trim()) {
        console.log('❌ Key tidak boleh kosong');
        rl.close();
        return;
    }
    
    // Validasi key
    if (key.includes('Ej8Ej8Ej8')) {
        console.log('❌ Key tidak valid (berulang)');
        console.log('💡 Pastikan menggunakan "anon public" key yang benar');
        rl.close();
        return;
    }
    
    try {
        // Baca file .env
        const envPath = path.join(__dirname, '.env');
        let envContent = fs.readFileSync(envPath, 'utf8');
        
        // Update konfigurasi
        envContent = envContent.replace(/SUPABASE_URL=.+/g, `SUPABASE_URL=${url.trim()}`);
        envContent = envContent.replace(/SUPABASE_ANON_KEY=.+/g, `SUPABASE_ANON_KEY=${key.trim()}`);
        envContent = envContent.replace(/VITE_SUPABASE_URL=.+/g, `VITE_SUPABASE_URL=${url.trim()}`);
        envContent = envContent.replace(/VITE_SUPABASE_ANON_KEY=.+/g, `VITE_SUPABASE_ANON_KEY=${key.trim()}`);
        
        // Simpan file .env
        fs.writeFileSync(envPath, envContent);
        
        console.log('\n✅ Konfigurasi berhasil diupdate!');
        console.log('📁 File .env telah diperbarui');
        
        // Test koneksi otomatis
        console.log('\n🔄 Testing koneksi...');
        
        const { testSupabaseConnection } = await import('./fix-supabase-connection.js');
        const connectionOk = await testSupabaseConnection();
        
        if (connectionOk) {
            console.log('\n🎉 Konfigurasi berhasil dan koneksi berfungsi!');
            console.log('✅ Aplikasi sekarang dapat menggunakan Supabase');
        } else {
            console.log('\n⚠️ Konfigurasi tersimpan tapi koneksi masih bermasalah');
            console.log('💡 Periksa koneksi internet atau setup schema database');
        }
        
    } catch (err) {
        console.log('❌ Error update konfigurasi:', err.message);
    }
    
    rl.close();
}

// Jalankan script
updateSupabaseConfig().catch(console.error);