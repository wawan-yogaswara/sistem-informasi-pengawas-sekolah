import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

function verifikasiSetup() {
    console.log('🔍 Verifikasi Setup Netlify-Supabase Final\n');
    console.log('=' .repeat(60));
    
    let allGood = true;
    const issues = [];
    const success = [];
    
    // 1. Periksa file .env
    console.log('📋 1. Memeriksa File .env...');
    try {
        const envPath = path.join(__dirname, '.env');
        const envContent = fs.readFileSync(envPath, 'utf8');
        
        const urlMatch = envContent.match(/SUPABASE_URL=(.+)/);
        const keyMatch = envContent.match(/SUPABASE_ANON_KEY=(.+)/);
        const viteUrlMatch = envContent.match(/VITE_SUPABASE_URL=(.+)/);
        const viteKeyMatch = envContent.match(/VITE_SUPABASE_ANON_KEY=(.+)/);
        
        if (urlMatch && keyMatch && viteUrlMatch && viteKeyMatch) {
            const key = keyMatch[1].trim();
            
            if (key.includes('Ej8Ej8Ej8')) {
                issues.push('❌ .env: Key masih berulang (tidak valid)');
                allGood = false;
            } else if (key.length < 100) {
                issues.push('⚠️ .env: Key terlalu pendek, mungkin belum asli');
            } else {
                success.push('✅ .env: Konfigurasi format valid');
            }
        } else {
            issues.push('❌ .env: Konfigurasi tidak lengkap');
            allGood = false;
        }
    } catch (err) {
        issues.push('❌ .env: File tidak ditemukan atau error');
        allGood = false;
    }
    
    // 2. Periksa client Supabase
    console.log('📋 2. Memeriksa Client Supabase...');
    try {
        const clientPath = path.join(__dirname, 'client/src/lib/supabase.ts');
        const clientContent = fs.readFileSync(clientPath, 'utf8');
        
        if (clientContent.includes('import.meta.env.VITE_SUPABASE_URL')) {
            success.push('✅ Client: Menggunakan environment variables');
        } else {
            issues.push('⚠️ Client: Tidak menggunakan environment variables');
        }
        
        if (clientContent.includes('Ej8Ej8Ej8')) {
            issues.push('❌ Client: Fallback key tidak valid');
            allGood = false;
        } else {
            success.push('✅ Client: Fallback configuration OK');
        }
    } catch (err) {
        issues.push('❌ Client: File tidak ditemukan atau error');
        allGood = false;
    }
    
    // 3. Periksa file SQL schema
    console.log('📋 3. Memeriksa SQL Schema...');
    const schemaPath = path.join(__dirname, 'supabase-schema-setup.sql');
    if (fs.existsSync(schemaPath)) {
        const schemaContent = fs.readFileSync(schemaPath, 'utf8');
        if (schemaContent.includes('CREATE TABLE IF NOT EXISTS users')) {
            success.push('✅ Schema: File SQL siap untuk dijalankan');
        } else {
            issues.push('⚠️ Schema: File SQL tidak lengkap');
        }
    } else {
        issues.push('❌ Schema: File SQL tidak ditemukan');
        allGood = false;
    }
    
    // 4. Periksa file Netlify config
    console.log('📋 4. Memeriksa Netlify Config...');
    const netlifyConfigPath = path.join(__dirname, 'netlify-env-vars.txt');
    if (fs.existsSync(netlifyConfigPath)) {
        success.push('✅ Netlify: File konfigurasi tersedia');
    } else {
        issues.push('⚠️ Netlify: File konfigurasi tidak ditemukan');
    }
    
    // 5. Periksa struktur project
    console.log('📋 5. Memeriksa Struktur Project...');
    const requiredFiles = [
        'package.json',
        'client/src/lib/supabase.ts',
        'client/src/lib/api.ts',
        'server/index.ts'
    ];
    
    requiredFiles.forEach(file => {
        const filePath = path.join(__dirname, file);
        if (fs.existsSync(filePath)) {
            success.push(`✅ Project: ${file} ada`);
        } else {
            issues.push(`❌ Project: ${file} tidak ditemukan`);
            allGood = false;
        }
    });
    
    // Tampilkan hasil
    console.log('\n📊 HASIL VERIFIKASI:\n');
    
    if (success.length > 0) {
        console.log('🎉 BERHASIL:');
        success.forEach(item => console.log(`   ${item}`));
        console.log('');
    }
    
    if (issues.length > 0) {
        console.log('⚠️ PERLU PERHATIAN:');
        issues.forEach(item => console.log(`   ${item}`));
        console.log('');
    }
    
    // Status keseluruhan
    if (allGood) {
        console.log('🎉 STATUS: SETUP SIAP UNTUK PRODUCTION!');
        console.log('');
        console.log('📋 Langkah selanjutnya:');
        console.log('1. Dapatkan key asli dari Supabase dashboard (jika belum)');
        console.log('2. Jalankan SQL schema di Supabase SQL Editor');
        console.log('3. Set environment variables di Netlify');
        console.log('4. Redeploy Netlify site');
        console.log('5. Test aplikasi di production');
    } else {
        console.log('⚠️ STATUS: MASIH ADA MASALAH YANG PERLU DIPERBAIKI');
        console.log('');
        console.log('🔧 Prioritas perbaikan:');
        if (issues.some(issue => issue.includes('.env'))) {
            console.log('1. Perbaiki konfigurasi .env');
        }
        if (issues.some(issue => issue.includes('Client'))) {
            console.log('2. Perbaiki client Supabase');
        }
        if (issues.some(issue => issue.includes('Schema'))) {
            console.log('3. Siapkan SQL schema');
        }
    }
    
    return { allGood, success: success.length, issues: issues.length };
}

function tampilkanPanduanLengkap() {
    console.log('\n📖 PANDUAN LENGKAP SETUP:\n');
    
    console.log('🔑 1. DAPATKAN KEY SUPABASE ASLI:');
    console.log('   - Buka: https://supabase.com/dashboard');
    console.log('   - Login dan pilih project: fmxeboullgcewzjpql');
    console.log('   - Settings > API > Copy "anon public" key');
    console.log('   - Update .env dengan key tersebut');
    console.log('');
    
    console.log('🗄️ 2. SETUP DATABASE SCHEMA:');
    console.log('   - Buka: https://supabase.com/dashboard/project/fmxeboullgcewzjpql/sql');
    console.log('   - Copy isi file: supabase-schema-setup.sql');
    console.log('   - Paste dan jalankan di SQL Editor');
    console.log('   - Verifikasi tabel dibuat di Table Editor');
    console.log('');
    
    console.log('🌐 3. SETUP NETLIFY ENVIRONMENT VARIABLES:');
    console.log('   - Buka: https://app.netlify.com');
    console.log('   - Pilih site > Site settings > Environment variables');
    console.log('   - Tambahkan: VITE_SUPABASE_URL dan VITE_SUPABASE_ANON_KEY');
    console.log('   - Redeploy site setelah menambah variables');
    console.log('');
    
    console.log('🧪 4. TEST APLIKASI:');
    console.log('   - Test lokal: npm run dev');
    console.log('   - Login dengan: admin/admin123 atau wawan/wawan123');
    console.log('   - Coba input data dan periksa di Supabase Table Editor');
    console.log('   - Test production di URL Netlify');
    console.log('');
    
    console.log('📁 5. FILE REFERENSI:');
    console.log('   - supabase-schema-setup.sql (untuk database)');
    console.log('   - netlify-env-vars.txt (untuk Netlify)');
    console.log('   - SOLUSI_FINAL_NETLIFY_SUPABASE_SETUP.md (panduan lengkap)');
}

function main() {
    console.log('🚀 Verifikasi Setup Final - Netlify Supabase\n');
    
    const result = verifikasiSetup();
    tampilkanPanduanLengkap();
    
    console.log('\n🎯 RINGKASAN:');
    console.log(`✅ Berhasil: ${result.success} item`);
    console.log(`⚠️ Perlu perhatian: ${result.issues} item`);
    
    if (result.allGood) {
        console.log('\n🎉 SETUP SIAP! Lanjut ke production deployment.');
    } else {
        console.log('\n🔧 PERBAIKI MASALAH di atas, lalu jalankan verifikasi ulang.');
    }
    
    console.log('\n💡 Untuk bantuan lebih lanjut, buka:');
    console.log('   - netlify-supabase-helper.html (helper interaktif)');
    console.log('   - SOLUSI_FINAL_NETLIFY_SUPABASE_SETUP.md (panduan detail)');
}

main();