import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function diagnosisNetlifySupabaseConnection() {
    console.log('🔍 Diagnosa Koneksi Netlify-Supabase\n');
    console.log('=' .repeat(60));
    
    // 1. Periksa environment variables lokal
    console.log('📋 1. Memeriksa Environment Variables Lokal:');
    
    const envPath = path.join(__dirname, '.env');
    const envContent = fs.readFileSync(envPath, 'utf8');
    
    const urlMatch = envContent.match(/SUPABASE_URL=(.+)/);
    const keyMatch = envContent.match(/SUPABASE_ANON_KEY=(.+)/);
    const viteUrlMatch = envContent.match(/VITE_SUPABASE_URL=(.+)/);
    const viteKeyMatch = envContent.match(/VITE_SUPABASE_ANON_KEY=(.+)/);
    
    if (urlMatch && keyMatch) {
        const url = urlMatch[1].trim();
        const key = keyMatch[1].trim();
        
        console.log(`   SUPABASE_URL: ${url}`);
        console.log(`   SUPABASE_ANON_KEY: ${key.substring(0, 30)}...`);
        
        if (key.includes('Ej8Ej8Ej8')) {
            console.log('   ❌ Key tidak valid (berulang)');
        } else {
            console.log('   ✅ Key format valid');
        }
    }
    
    if (viteUrlMatch && viteKeyMatch) {
        const viteUrl = viteUrlMatch[1].trim();
        const viteKey = viteKeyMatch[1].trim();
        
        console.log(`   VITE_SUPABASE_URL: ${viteUrl}`);
        console.log(`   VITE_SUPABASE_ANON_KEY: ${viteKey.substring(0, 30)}...`);
        
        if (viteKey.includes('Ej8Ej8Ej8')) {
            console.log('   ❌ VITE Key tidak valid (berulang)');
        } else {
            console.log('   ✅ VITE Key format valid');
        }
    }
    
    // 2. Test koneksi dengan key yang ada
    console.log('\n📡 2. Testing Koneksi Supabase:');
    
    try {
        const supabaseUrl = urlMatch ? urlMatch[1].trim() : '';
        const supabaseKey = keyMatch ? keyMatch[1].trim() : '';
        
        if (!supabaseUrl || !supabaseKey) {
            console.log('   ❌ Konfigurasi tidak lengkap');
            return;
        }
        
        if (supabaseKey.includes('Ej8Ej8Ej8')) {
            console.log('   ❌ Tidak dapat test dengan key yang tidak valid');
            console.log('   💡 Perlu key yang benar dari Supabase dashboard');
            return;
        }
        
        const supabase = createClient(supabaseUrl, supabaseKey);
        
        console.log('   🔄 Mencoba koneksi...');
        const { data, error } = await supabase
            .from('users')
            .select('count')
            .limit(1);
            
        if (error) {
            console.log(`   ❌ Error: ${error.message}`);
            
            if (error.message.includes('relation "users" does not exist')) {
                console.log('   💡 Tabel belum dibuat - perlu setup schema');
            } else if (error.message.includes('Invalid API key')) {
                console.log('   💡 API key tidak valid');
            } else if (error.message.includes('fetch')) {
                console.log('   💡 Masalah koneksi network');
            }
        } else {
            console.log('   ✅ Koneksi berhasil!');
            console.log(`   📊 Response: ${JSON.stringify(data)}`);
        }
        
    } catch (err) {
        console.log(`   ❌ Error: ${err.message}`);
    }
    
    // 3. Periksa konfigurasi client-side
    console.log('\n🌐 3. Memeriksa Konfigurasi Client-side:');
    
    const supabaseClientPath = path.join(__dirname, 'client/src/lib/supabase.ts');
    if (fs.existsSync(supabaseClientPath)) {
        const clientContent = fs.readFileSync(supabaseClientPath, 'utf8');
        
        if (clientContent.includes('import.meta.env.VITE_SUPABASE_URL')) {
            console.log('   ✅ Menggunakan environment variables');
        } else {
            console.log('   ⚠️ Hardcoded configuration detected');
        }
        
        if (clientContent.includes('Ej8Ej8Ej8')) {
            console.log('   ❌ Fallback key tidak valid');
        } else {
            console.log('   ✅ Fallback configuration OK');
        }
    }
    
    // 4. Test penyimpanan data
    console.log('\n💾 4. Testing Penyimpanan Data:');
    
    try {
        if (supabaseKey.includes('Ej8Ej8Ej8')) {
            console.log('   ❌ Skip test - key tidak valid');
            return;
        }
        
        const supabase = createClient(supabaseUrl, supabaseKey);
        
        // Test insert data dummy
        const testData = {
            username: `test_${Date.now()}`,
            password: 'test123',
            name: 'Test User',
            role: 'user'
        };
        
        console.log('   🧪 Mencoba insert data test...');
        const { data: insertData, error: insertError } = await supabase
            .from('users')
            .insert(testData)
            .select();
            
        if (insertError) {
            console.log(`   ❌ Error insert: ${insertError.message}`);
            
            if (insertError.message.includes('relation "users" does not exist')) {
                console.log('   💡 Tabel users belum dibuat');
                console.log('   🔧 Jalankan setup schema terlebih dahulu');
            } else if (insertError.message.includes('duplicate key')) {
                console.log('   💡 Data sudah ada (normal)');
            } else if (insertError.message.includes('permission')) {
                console.log('   💡 Masalah permission - periksa RLS policy');
            }
        } else {
            console.log('   ✅ Insert berhasil!');
            console.log(`   📊 Data: ${JSON.stringify(insertData)}`);
            
            // Hapus data test
            await supabase
                .from('users')
                .delete()
                .eq('username', testData.username);
            console.log('   🧹 Data test dihapus');
        }
        
    } catch (err) {
        console.log(`   ❌ Error test insert: ${err.message}`);
    }
    
    // 5. Rekomendasi
    console.log('\n💡 5. Rekomendasi Perbaikan:');
    
    if (keyMatch && keyMatch[1].includes('Ej8Ej8Ej8')) {
        console.log('   🔧 Update key Supabase dengan yang benar:');
        console.log('      1. Buka Supabase dashboard');
        console.log('      2. Pergi ke Settings > API');
        console.log('      3. Copy "anon public" key');
        console.log('      4. Update .env file');
    }
    
    console.log('   📋 Untuk Netlify deployment:');
    console.log('      1. Set environment variables di Netlify dashboard');
    console.log('      2. Pastikan VITE_SUPABASE_URL dan VITE_SUPABASE_ANON_KEY');
    console.log('      3. Redeploy setelah update env vars');
    
    console.log('   🛠️ Setup database schema:');
    console.log('      1. Buka Supabase SQL Editor');
    console.log('      2. Jalankan SQL dari supabase-schema-complete.sql');
    console.log('      3. Atau gunakan test-supabase-interactive.html');
}

// Fungsi untuk generate environment variables untuk Netlify
function generateNetlifyEnvVars() {
    console.log('\n📝 Environment Variables untuk Netlify:');
    console.log('=' .repeat(50));
    
    console.log('Tambahkan di Netlify Dashboard > Site Settings > Environment Variables:');
    console.log('');
    console.log('VITE_SUPABASE_URL=https://[your-project-ref].supabase.co');
    console.log('VITE_SUPABASE_ANON_KEY=[your-real-anon-key]');
    console.log('');
    console.log('💡 Ganti [your-project-ref] dan [your-real-anon-key] dengan nilai yang benar');
}

// Main function
async function main() {
    await diagnosisNetlifySupabaseConnection();
    generateNetlifyEnvVars();
    
    console.log('\n🎯 Langkah Selanjutnya:');
    console.log('1. Update key Supabase yang benar');
    console.log('2. Setup database schema');
    console.log('3. Set environment variables di Netlify');
    console.log('4. Test ulang koneksi');
}

main().catch(console.error);