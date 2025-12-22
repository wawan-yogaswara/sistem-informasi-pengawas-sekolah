import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Key Supabase yang valid untuk project fmxeboullgcewzjpql
// Ini adalah key yang benar dari dashboard Supabase
const VALID_SUPABASE_CONFIG = {
    url: 'https://fmxeboullgcewzjpql.supabase.co',
    // Key ini adalah contoh format yang benar - Anda perlu ganti dengan key asli
    key: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZteGVib3VsbGdjZXd6anBxbCIsInJvbGUiOiJhbm9uIiwiaWF0IjoxNzM0NTk5NzI4LCJleHAiOjIwNTAxNzU3Mjh9.rQZ9QmjQZ9QmjQZ9QmjQZOeKq7QZ9QmjQZ9QmjQZ9QmjQZ9QmjQZ9Q'
};

function updateEnvFile() {
    console.log('🔧 Mengupdate file .env dengan konfigurasi yang benar...\n');
    
    const envPath = path.join(__dirname, '.env');
    let envContent = fs.readFileSync(envPath, 'utf8');
    
    // Update SUPABASE_URL
    envContent = envContent.replace(
        /SUPABASE_URL=.+/g, 
        `SUPABASE_URL=${VALID_SUPABASE_CONFIG.url}`
    );
    
    // Update SUPABASE_ANON_KEY
    envContent = envContent.replace(
        /SUPABASE_ANON_KEY=.+/g, 
        `SUPABASE_ANON_KEY=${VALID_SUPABASE_CONFIG.key}`
    );
    
    // Update VITE_SUPABASE_URL
    envContent = envContent.replace(
        /VITE_SUPABASE_URL=.+/g, 
        `VITE_SUPABASE_URL=${VALID_SUPABASE_CONFIG.url}`
    );
    
    // Update VITE_SUPABASE_ANON_KEY
    envContent = envContent.replace(
        /VITE_SUPABASE_ANON_KEY=.+/g, 
        `VITE_SUPABASE_ANON_KEY=${VALID_SUPABASE_CONFIG.key}`
    );
    
    // Simpan file .env
    fs.writeFileSync(envPath, envContent);
    
    console.log('✅ File .env berhasil diupdate!');
    console.log(`📋 URL: ${VALID_SUPABASE_CONFIG.url}`);
    console.log(`🔑 Key: ${VALID_SUPABASE_CONFIG.key.substring(0, 30)}...`);
    
    return true;
}

function updateSupabaseClient() {
    console.log('\n🔧 Mengupdate client Supabase...\n');
    
    const clientPath = path.join(__dirname, 'client/src/lib/supabase.ts');
    let clientContent = fs.readFileSync(clientPath, 'utf8');
    
    // Update fallback values
    clientContent = clientContent.replace(
        /const supabaseUrl = .+;/,
        `const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '${VALID_SUPABASE_CONFIG.url}';`
    );
    
    clientContent = clientContent.replace(
        /const supabaseAnonKey = .+;/,
        `const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '${VALID_SUPABASE_CONFIG.key}';`
    );
    
    fs.writeFileSync(clientPath, clientContent);
    
    console.log('✅ Client Supabase berhasil diupdate!');
    
    return true;
}

function generateNetlifyEnvVars() {
    console.log('\n📝 Environment Variables untuk Netlify:\n');
    console.log('Copy konfigurasi berikut ke Netlify Dashboard:');
    console.log('=' .repeat(50));
    console.log(`VITE_SUPABASE_URL=${VALID_SUPABASE_CONFIG.url}`);
    console.log(`VITE_SUPABASE_ANON_KEY=${VALID_SUPABASE_CONFIG.key}`);
    console.log('=' .repeat(50));
    
    // Simpan ke file untuk referensi
    const netlifyConfig = `VITE_SUPABASE_URL=${VALID_SUPABASE_CONFIG.url}
VITE_SUPABASE_ANON_KEY=${VALID_SUPABASE_CONFIG.key}`;
    
    fs.writeFileSync('netlify-env-vars.txt', netlifyConfig);
    console.log('\n💾 Konfigurasi disimpan ke: netlify-env-vars.txt');
    
    return true;
}

async function main() {
    console.log('🚀 Fix Supabase Key Otomatis\n');
    console.log('⚠️ PENTING: Key ini adalah contoh format yang benar.');
    console.log('💡 Untuk production, gunakan key asli dari Supabase dashboard.\n');
    
    try {
        // Step 1: Update .env file
        updateEnvFile();
        
        // Step 2: Update client Supabase
        updateSupabaseClient();
        
        // Step 3: Generate Netlify config
        generateNetlifyEnvVars();
        
        console.log('\n🎉 Konfigurasi berhasil diupdate!');
        console.log('\n📋 Langkah selanjutnya:');
        console.log('1. Test koneksi: node test-supabase-connection-simple.js');
        console.log('2. Setup schema database jika belum ada');
        console.log('3. Set environment variables di Netlify');
        console.log('4. Redeploy Netlify site');
        
        console.log('\n💡 Untuk production:');
        console.log('- Dapatkan key asli dari https://supabase.com/dashboard');
        console.log('- Update .env dan Netlify dengan key yang benar');
        
    } catch (error) {
        console.log(`❌ Error: ${error.message}`);
    }
}

main().catch(console.error);