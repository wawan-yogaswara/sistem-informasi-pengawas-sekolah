// Generate key yang benar berdasarkan Project ID
const correctProjectId = 'glhaliktsrcvnznbgxqt';

console.log('🔍 ANALYZING SUPABASE KEY ISSUE');
console.log('================================');
console.log(`Correct Project ID: ${correctProjectId}`);

// Key yang saya ambil dari screenshot
const keyFromScreenshot = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdsaGFsaXRrc3R2bXpicXZxdCIsInJvbGUiOiJhbm9uIiwiaWF0IjoxNzM0NTk5NzI4LCJleHAiOjIwNTAxNzU3Mjh9.eyJ3pc6tOi3IUzI1NiIsInR5cCI6IkpXVCJ9';

// Decode payload untuk cek project ref
try {
    const parts = keyFromScreenshot.split('.');
    const payload = JSON.parse(atob(parts[1]));
    
    console.log('\n📋 DECODED PAYLOAD:');
    console.log('Project ref in key:', payload.ref);
    console.log('Actual project ID:', correctProjectId);
    console.log('Match:', payload.ref === correctProjectId);
    
    if (payload.ref !== correctProjectId) {
        console.log('\n❌ MISMATCH DETECTED!');
        console.log('Key contains wrong project reference');
        
        console.log('\n🔧 SOLUTION:');
        console.log('1. Buka Supabase Dashboard');
        console.log('2. Pastikan project yang dipilih: wawan-yogaswara-kepengawasan');
        console.log('3. Klik Settings > API');
        console.log('4. Copy "anon public" key yang benar');
        console.log('5. Paste key yang baru di sini');
        
        console.log('\n⚠️  IMPORTANT:');
        console.log('Key harus mengandung project ref:', correctProjectId);
    } else {
        console.log('\n✅ Project ID in key matches!');
        console.log('Issue might be elsewhere...');
    }
    
} catch (e) {
    console.log('\n❌ Cannot decode key:', e.message);
}

console.log('\n📝 MANUAL VERIFICATION:');
console.log('Buka browser dan test URL ini:');
console.log(`https://${correctProjectId}.supabase.co/rest/v1/`);
console.log('Jika berhasil, berarti URL benar');
console.log('Jika error, berarti Project ID masih salah');