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

async function updateConfigProjectBaru() {
    console.log('🚀 Update Konfigurasi untuk Project Supabase Baru\n');
    console.log('=' .repeat(60));
    
    console.log('📋 Setelah membuat project baru di Supabase:');
    console.log('   1. Pergi ke Settings > API');
    console.log('   2. Copy Project URL dan anon public key');
    console.log('   3. Masukkan di form berikut:\n');
    
    // Input konfigurasi project baru
    const newUrl = await question('🔗 Masukkan Project URL baru: ');
    if (!newUrl.trim()) {
        console.log('❌ URL tidak boleh kosong');
        rl.close();
        return;
    }
    
    const newKey = await question('🔑 Masukkan anon public key baru: ');
    if (!newKey.trim()) {
        console.log('❌ Key tidak boleh kosong');
        rl.close();
        return;
    }
    
    // Input service role key (opsional)
    const serviceKey = await question('🔐 Masukkan service role key (opsional, tekan Enter untuk skip): ');
    
    // Validasi input
    if (!newUrl.includes('supabase.co')) {
        console.log('❌ URL tidak valid - harus berisi "supabase.co"');
        rl.close();
        return;
    }
    
    if (newKey.includes('Ej8Ej8Ej8') || newKey.length < 100) {
        console.log('❌ Key tidak valid - pastikan copy dari dashboard');
        rl.close();
        return;
    }
    
    // Validasi format URL
    const urlPattern = /^https:\/\/[a-z0-9]+\.supabase\.co$/;
    if (!urlPattern.test(newUrl.trim())) {
        console.log('❌ Format URL tidak valid. Contoh: https://abcdefgh.supabase.co');
        rl.close();
        return;
    }
    
    try {
        console.log('\n🔧 Mengupdate konfigurasi...\n');
        
        // 1. Update file .env
        console.log('📝 1. Update file .env...');
        const envPath = path.join(__dirname, '.env');
        let envContent = fs.readFileSync(envPath, 'utf8');
        
        envContent = envContent.replace(/SUPABASE_URL=.+/g, `SUPABASE_URL=${newUrl.trim()}`);
        envContent = envContent.replace(/SUPABASE_ANON_KEY=.+/g, `SUPABASE_ANON_KEY=${newKey.trim()}`);
        envContent = envContent.replace(/VITE_SUPABASE_URL=.+/g, `VITE_SUPABASE_URL=${newUrl.trim()}`);
        envContent = envContent.replace(/VITE_SUPABASE_ANON_KEY=.+/g, `VITE_SUPABASE_ANON_KEY=${newKey.trim()}`);
        
        // Tambahkan service role key jika ada
        if (serviceKey.trim()) {
            if (envContent.includes('SUPABASE_SERVICE_ROLE_KEY=')) {
                envContent = envContent.replace(/SUPABASE_SERVICE_ROLE_KEY=.+/g, `SUPABASE_SERVICE_ROLE_KEY=${serviceKey.trim()}`);
            } else {
                envContent += `\nSUPABASE_SERVICE_ROLE_KEY=${serviceKey.trim()}`;
            }
        }
        
        fs.writeFileSync(envPath, envContent);
        console.log('   ✅ File .env berhasil diupdate');
        
        // 2. Update client Supabase
        console.log('📝 2. Update client Supabase...');
        const clientPath = path.join(__dirname, 'client/src/lib/supabase.ts');
        let clientContent = fs.readFileSync(clientPath, 'utf8');
        
        clientContent = clientContent.replace(
            /const supabaseUrl = .+;/,
            `const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '${newUrl.trim()}';`
        );
        
        clientContent = clientContent.replace(
            /const supabaseAnonKey = .+;/,
            `const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '${newKey.trim()}';`
        );
        
        fs.writeFileSync(clientPath, clientContent);
        console.log('   ✅ Client Supabase berhasil diupdate');
        
        // 3. Generate konfigurasi Netlify
        console.log('📝 3. Generate konfigurasi Netlify...');
        const netlifyConfig = `VITE_SUPABASE_URL=${newUrl.trim()}
VITE_SUPABASE_ANON_KEY=${newKey.trim()}`;
        
        fs.writeFileSync('netlify-env-vars-new.txt', netlifyConfig);
        console.log('   ✅ Konfigurasi Netlify disimpan ke: netlify-env-vars-new.txt');
        
        // 3.1 Generate konfigurasi Vercel
        console.log('📝 3.1 Generate konfigurasi Vercel...');
        const vercelConfig = `VITE_SUPABASE_URL="${newUrl.trim()}"
VITE_SUPABASE_ANON_KEY="${newKey.trim()}"`;
        
        fs.writeFileSync('vercel-env-vars-new.txt', vercelConfig);
        console.log('   ✅ Konfigurasi Vercel disimpan ke: vercel-env-vars-new.txt');
        
        // 4. Update SQL schema dengan project baru
        console.log('📝 4. Update SQL schema...');
        const projectRef = newUrl.match(/https:\/\/(.+)\.supabase\.co/)[1];
        
        let sqlContent = fs.readFileSync('supabase-schema-setup.sql', 'utf8');
        sqlContent = sqlContent.replace(
            /project\/[^\/]+\/sql/g,
            `project/${projectRef}/sql`
        );
        
        fs.writeFileSync(`supabase-schema-${projectRef}.sql`, sqlContent);
        console.log(`   ✅ SQL schema disimpan ke: supabase-schema-${projectRef}.sql`);
        
        // 4.1 Generate quick setup script
        console.log('📝 4.1 Generate quick setup script...');
        const quickSetupScript = `#!/bin/bash
# Quick Setup Script untuk Project Supabase Baru
# Generated by update-config-project-baru.js

echo "🚀 Quick Setup - School Guard Manager"
echo "Project URL: ${newUrl.trim()}"
echo "Project Ref: ${projectRef}"
echo ""

echo "📝 1. Test koneksi..."
node test-supabase-connection-simple.js

echo "📝 2. Setup database schema..."
echo "Buka: https://supabase.com/dashboard/project/${projectRef}/sql"
echo "Copy paste isi file: supabase-schema-${projectRef}.sql"
echo ""

echo "📝 3. Test aplikasi..."
npm run dev

echo "✅ Setup selesai!"
`;
        
        fs.writeFileSync(`quick-setup-${projectRef}.sh`, quickSetupScript);
        console.log(`   ✅ Quick setup script: quick-setup-${projectRef}.sh`);
        
        // 4.2 Generate dokumentasi setup
        console.log('📝 4.2 Generate dokumentasi setup...');
        const docFile = generateSetupDocumentation(projectRef, newUrl.trim(), newKey.trim());
        console.log(`   ✅ Dokumentasi setup: ${docFile}`);
        
        // 5. Test koneksi otomatis
        console.log('📝 5. Test koneksi ke project baru...');
        
        try {
            // Import dynamic untuk test koneksi
            const testResult = await testSupabaseConnection(newUrl.trim(), newKey.trim());
            if (testResult.success) {
                console.log('   ✅ Koneksi ke Supabase berhasil!');
            } else {
                console.log('   ⚠️ Koneksi berhasil tapi ada warning:', testResult.message);
            }
        } catch (error) {
            console.log('   ⚠️ Test koneksi gagal:', error.message);
            console.log('   💡 Silakan test manual dengan: node test-supabase-connection-simple.js');
        }
        
        // 6. Ringkasan
        console.log('\n🎉 UPDATE KONFIGURASI SELESAI!\n');
        console.log('📋 Yang sudah diupdate:');
        console.log(`   ✅ .env file`);
        console.log(`   ✅ client/src/lib/supabase.ts`);
        console.log(`   ✅ netlify-env-vars-new.txt`);
        console.log(`   ✅ vercel-env-vars-new.txt`);
        console.log(`   ✅ supabase-schema-${projectRef}.sql`);
        console.log(`   ✅ quick-setup-${projectRef}.sh`);
        console.log(`   ✅ SETUP_${projectRef.toUpperCase()}.md`);
        
        console.log('\n🎯 Langkah selanjutnya:');
        console.log(`1. Setup database schema:`);
        console.log(`   https://supabase.com/dashboard/project/${projectRef}/sql`);
        console.log(`   Copy isi file: supabase-schema-${projectRef}.sql`);
        console.log('');
        console.log('2. Test koneksi:');
        console.log('   node test-supabase-connection-simple.js');
        console.log('');
        console.log('3. Setup Netlify environment variables:');
        console.log('   Copy isi file: netlify-env-vars-new.txt');
        console.log('   Paste di Netlify Dashboard > Environment Variables');
        console.log('');
        console.log('4. Setup Vercel environment variables (jika pakai Vercel):');
        console.log('   Copy isi file: vercel-env-vars-new.txt');
        console.log('   Paste di Vercel Dashboard > Settings > Environment Variables');
        console.log('');
        console.log('5. Test aplikasi:');
        console.log('   npm run dev');
        
        console.log('\n📚 Dokumentasi lengkap tersedia di:');
        console.log(`   📖 SETUP_${projectRef.toUpperCase()}.md`);
        console.log(`   🚀 quick-setup-${projectRef}.sh`);
        
        console.log('\n💡 Project baru siap digunakan!');
        console.log('🎯 Next: Setup database schema dan test aplikasi');
        
    } catch (error) {
        console.log(`❌ Error update konfigurasi: ${error.message}`);
        console.log('\n🔧 Troubleshooting:');
        
        if (error.message.includes('ENOENT')) {
            console.log('   - Pastikan file .env dan client/src/lib/supabase.ts ada');
            console.log('   - Jalankan script dari root directory project');
        } else if (error.message.includes('permission')) {
            console.log('   - Pastikan Anda punya permission write ke file');
            console.log('   - Coba jalankan sebagai administrator');
        } else {
            console.log('   - Cek apakah semua file yang diperlukan ada');
            console.log('   - Pastikan format URL dan key benar');
        }
        
        console.log('\n💡 Jika masih error, silakan update manual:');
        console.log('   1. Edit .env file');
        console.log('   2. Edit client/src/lib/supabase.ts');
        console.log('   3. Setup database schema di Supabase dashboard');
    }
    
    rl.close();
}

// Fungsi untuk test koneksi Supabase
async function testSupabaseConnection(url, key) {
    try {
        const response = await fetch(`${url}/rest/v1/`, {
            headers: {
                'apikey': key,
                'Authorization': `Bearer ${key}`
            }
        });
        
        if (response.ok) {
            return { success: true, message: 'Koneksi berhasil' };
        } else {
            return { success: false, message: `HTTP ${response.status}` };
        }
    } catch (error) {
        return { success: false, message: error.message };
    }
}

// Fungsi untuk backup konfigurasi lama
function backupOldConfig() {
    console.log('💾 Backup konfigurasi lama...\n');
    
    try {
        const envPath = path.join(__dirname, '.env');
        const envContent = fs.readFileSync(envPath, 'utf8');
        
        const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
        fs.writeFileSync(`.env.backup.${timestamp}`, envContent);
        
        console.log(`✅ Backup disimpan ke: .env.backup.${timestamp}`);
        
        const clientPath = path.join(__dirname, 'client/src/lib/supabase.ts');
        const clientContent = fs.readFileSync(clientPath, 'utf8');
        fs.writeFileSync(`supabase.ts.backup.${timestamp}`, clientContent);
        
        console.log(`✅ Backup client disimpan ke: supabase.ts.backup.${timestamp}`);
        
    } catch (error) {
        console.log(`⚠️ Warning backup: ${error.message}`);
    }
}

async function main() {
    console.log('🔄 Setup Project Supabase Baru - School Guard Manager\n');
    
    // Cek apakah file yang diperlukan ada
    const requiredFiles = ['.env', 'client/src/lib/supabase.ts', 'supabase-schema-setup.sql'];
    const missingFiles = requiredFiles.filter(file => !fs.existsSync(file));
    
    if (missingFiles.length > 0) {
        console.log('❌ File yang diperlukan tidak ditemukan:');
        missingFiles.forEach(file => console.log(`   - ${file}`));
        console.log('\n💡 Pastikan Anda menjalankan script ini dari root directory project');
        rl.close();
        return;
    }
    
    // Backup konfigurasi lama
    backupOldConfig();
    
    console.log('\n📋 Pastikan Anda sudah:');
    console.log('   ✅ Membuat project baru di Supabase dashboard');
    console.log('   ✅ Project sudah ready (tidak loading)');
    console.log('   ✅ Sudah mendapat URL dan key dari Settings > API');
    console.log('');
    
    const ready = await question('Apakah project baru sudah siap? (y/n): ');
    
    if (ready.toLowerCase() === 'y' || ready.toLowerCase() === 'yes') {
        await updateConfigProjectBaru();
    } else {
        console.log('\n💡 Silakan buat project Supabase baru terlebih dahulu:');
        console.log('   1. Buka https://supabase.com/dashboard');
        console.log('   2. Klik "New Project"');
        console.log('   3. Isi detail project');
        console.log('   4. Tunggu sampai ready');
        console.log('   5. Jalankan script ini lagi');
        rl.close();
    }
}

main().catch(console.error);
// Fung
si untuk generate dokumentasi setup
function generateSetupDocumentation(projectRef, newUrl, newKey) {
    const documentation = `# Setup Project Supabase Baru - ${projectRef}

## 📋 Informasi Project
- **Project URL**: ${newUrl}
- **Project Reference**: ${projectRef}
- **Generated**: ${new Date().toLocaleString('id-ID')}

## 🚀 Langkah Setup

### 1. Database Schema
1. Buka Supabase Dashboard: https://supabase.com/dashboard/project/${projectRef}/sql
2. Copy paste isi file: \`supabase-schema-${projectRef}.sql\`
3. Klik "Run" untuk execute schema

### 2. Environment Variables

#### Untuk Netlify:
\`\`\`
VITE_SUPABASE_URL=${newUrl}
VITE_SUPABASE_ANON_KEY=${newKey}
\`\`\`

#### Untuk Vercel:
\`\`\`
VITE_SUPABASE_URL="${newUrl}"
VITE_SUPABASE_ANON_KEY="${newKey}"
\`\`\`

### 3. Test Setup
\`\`\`bash
# Test koneksi
node test-supabase-connection-simple.js

# Test aplikasi
npm run dev
\`\`\`

### 4. Deploy
\`\`\`bash
# Deploy ke Netlify
npm run build
# Upload dist folder ke Netlify

# Deploy ke Vercel
vercel --prod
\`\`\`

## 🔧 Troubleshooting

### Koneksi Gagal
- Pastikan URL dan key benar
- Cek apakah project Supabase sudah ready
- Pastikan tidak ada typo di environment variables

### Database Error
- Pastikan schema sudah di-execute
- Cek apakah ada error di SQL query
- Pastikan RLS (Row Level Security) sudah dikonfigurasi

### Deploy Error
- Pastikan environment variables sudah di-set
- Cek build logs untuk error detail
- Pastikan semua dependencies ter-install

## 📞 Support
Jika ada masalah, silakan cek:
1. File log error
2. Browser console
3. Network tab di developer tools

---
Generated by School Guard Manager Setup Tool
`;

    fs.writeFileSync(`SETUP_${projectRef.toUpperCase()}.md`, documentation);
    return `SETUP_${projectRef.toUpperCase()}.md`;
}