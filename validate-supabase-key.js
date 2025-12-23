// Validasi format Supabase API key
const keyFromScreenshot = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdsaGFsaXRrc3R2bXpicXZxdCIsInJvbGUiOiJhbm9uIiwiaWF0IjoxNzM0NTk5NzI4LCJleHAiOjIwNTAxNzU3Mjh9.eyJ3pc6tOi3IUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdsaGFsaXRrc3R2bXpicXZxdCIsInJvbGUiOiJhbm9uIiwiaWF0IjoxNzM0NTk5NzI4LCJleHAiOjIwNTAxNzU3Mjh9.eyJ3pc6tOi3IUzI1NiIsInR5cCI6IkpXVCJ9';

console.log('🔍 VALIDATING SUPABASE API KEY');
console.log('==============================');

console.log('Key length:', keyFromScreenshot.length);
console.log('Key parts:', keyFromScreenshot.split('.').length);

// JWT should have 3 parts separated by dots
const parts = keyFromScreenshot.split('.');
console.log('\nJWT Parts:');
parts.forEach((part, index) => {
    console.log(`Part ${index + 1}: ${part.substring(0, 20)}... (${part.length} chars)`);
});

// Try to decode header
try {
    const header = JSON.parse(atob(parts[0]));
    console.log('\nDecoded Header:', header);
} catch (e) {
    console.log('\n❌ Cannot decode header:', e.message);
}

// Try to decode payload
try {
    const payload = JSON.parse(atob(parts[1]));
    console.log('\nDecoded Payload:', payload);
} catch (e) {
    console.log('\n❌ Cannot decode payload:', e.message);
}

console.log('\n📋 ANALYSIS:');
if (parts.length !== 3) {
    console.log('❌ Invalid JWT format - should have 3 parts');
} else {
    console.log('✅ JWT format looks correct');
}

console.log('\n🔧 NEXT STEPS:');
console.log('1. Copy API key langsung dari Supabase Dashboard');
console.log('2. Pastikan key tidak terpotong');
console.log('3. Cek apakah project Supabase masih aktif');