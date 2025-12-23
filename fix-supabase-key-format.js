// Fix format API key yang duplikat
const duplicatedKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdsaGFsaXRrc3R2bXpicXZxdCIsInJvbGUiOiJhbm9uIiwiaWF0IjoxNzM0NTk5NzI4LCJleHAiOjIwNTAxNzU3Mjh9.eyJ3pc6tOi3IUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdsaGFsaXRrc3R2bXpicXZxdCIsInJvbGUiOiJhbm9uIiwiaWF0IjoxNzM0NTk5NzI4LCJleHAiOjIwNTAxNzU3Mjh9.eyJ3pc6tOi3IUzI1NiIsInR5cCI6IkpXVCJ9';

const parts = duplicatedKey.split('.');

// Ambil 3 bagian pertama (format JWT yang benar)
const correctKey = `${parts[0]}.${parts[1]}.${parts[2]}`;

// Project ID yang benar dari payload
const correctProjectId = 'glhalitkstvmzbqvqt';
const correctUrl = `https://${correctProjectId}.supabase.co`;

console.log('🔧 FIXING SUPABASE CREDENTIALS');
console.log('===============================');
console.log('Correct URL:', correctUrl);
console.log('Correct Key:', correctKey);
console.log('Key length:', correctKey.length);
console.log('Key parts:', correctKey.split('.').length);

// Validate the corrected key
try {
    const payload = JSON.parse(atob(parts[1]));
    console.log('\n✅ Validated Payload:', payload);
} catch (e) {
    console.log('\n❌ Validation failed:', e.message);
}

export { correctUrl, correctKey };