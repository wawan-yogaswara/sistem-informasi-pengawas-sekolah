// Test berbagai kemungkinan Project ID
const possibleIds = [
    'glhalitkstvmzbqvqt',  // yang saya baca dari payload
    'glhalitkstcvmzbqvqt', // typo pertama saya
    'glhalitkstcvmzbqvqt', // kemungkinan lain
    'glhalitkstcvmzbqvqt', // kemungkinan lain
    'glhalitkstcvmzbqvqt', // kemungkinan lain
];

console.log('🔍 TESTING PROJECT ID VARIANTS');
console.log('===============================');

// Test dengan ping/nslookup sederhana
for (const id of possibleIds) {
    const url = `https://${id}.supabase.co`;
    console.log(`\n🔄 Testing: ${id}`);
    console.log(`URL: ${url}`);
    
    // Kita tidak bisa test langsung di Node.js karena network issue
    // Tapi kita bisa memberikan instruksi untuk test manual
}

console.log('\n📋 MANUAL TEST INSTRUCTIONS:');
console.log('Buka browser dan coba akses URL berikut:');

possibleIds.forEach(id => {
    console.log(`- https://${id}.supabase.co/rest/v1/`);
});

console.log('\n✅ URL yang berhasil diakses adalah Project ID yang benar');
console.log('❌ URL yang error 404/tidak bisa diakses adalah salah');

console.log('\n🔧 ALTERNATIVE SOLUTION:');
console.log('1. Buka Supabase Dashboard');
console.log('2. Klik Settings > General');
console.log('3. Copy "Reference ID" atau "Project URL"');
console.log('4. Paste di sini untuk update konfigurasi');