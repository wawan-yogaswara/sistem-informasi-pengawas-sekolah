// Script untuk mendapatkan kredensial Supabase yang benar
// Berdasarkan Project ID: glhalitkstcvmzbqvqt

console.log('🔍 SUPABASE PROJECT CREDENTIALS');
console.log('================================');

// URL Supabase yang benar berdasarkan Project ID
const correctSupabaseUrl = 'https://glhalitkstcvmzbqvqt.supabase.co';

console.log('✅ Supabase URL yang benar:');
console.log(correctSupabaseUrl);

console.log('\n📋 LANGKAH SELANJUTNYA:');
console.log('1. Buka Supabase Dashboard: https://supabase.com/dashboard');
console.log('2. Pilih project: wawan-yogaswara-kepengawasan');
console.log('3. Klik "Settings" > "API"');
console.log('4. Copy "anon public" key');
console.log('5. Update file .env dengan kredensial yang benar');

console.log('\n🔧 UPDATE YANG DIPERLUKAN:');
console.log('File .env:');
console.log(`SUPABASE_URL=${correctSupabaseUrl}`);
console.log('SUPABASE_ANON_KEY=[copy dari dashboard]');
console.log(`VITE_SUPABASE_URL=${correctSupabaseUrl}`);
console.log('VITE_SUPABASE_ANON_KEY=[copy dari dashboard]');

console.log('\n⚠️  MASALAH SAAT INI:');
console.log('- URL lama: https://fmxeboullgcewzjpql.supabase.co (SALAH)');
console.log(`- URL benar: ${correctSupabaseUrl}`);
console.log('- API Key: menggunakan key palsu dengan pattern berulang');

console.log('\n🎯 SOLUSI:');
console.log('1. Ambil anon key dari dashboard Supabase');
console.log('2. Update semua file konfigurasi');
console.log('3. Test koneksi ke Supabase');