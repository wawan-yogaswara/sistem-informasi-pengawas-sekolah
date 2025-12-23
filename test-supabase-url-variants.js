// Test berbagai kemungkinan URL Supabase
import { createClient } from '@supabase/supabase-js';

const projectId = 'glhalitkstcvmzbqvqt';
const anonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdsaGFsaXRrc3R2bXpicXZxdCIsInJvbGUiOiJhbm9uIiwiaWF0IjoxNzM0NTk5NzI4LCJleHAiOjIwNTAxNzU3Mjh9.eyJ3pc6tOi3IUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdsaGFsaXRrc3R2bXpicXZxdCIsInJvbGUiOiJhbm9uIiwiaWF0IjoxNzM0NTk5NzI4LCJleHAiOjIwNTAxNzU3Mjh9.eyJ3pc6tOi3IUzI1NiIsInR5cCI6IkpXVCJ9';

const urlVariants = [
    `https://${projectId}.supabase.co`,
    `https://${projectId}.supabase.io`,
    'https://fmxeboullgcewzjpql.supabase.co', // URL lama dari file
];

console.log('🔍 TESTING SUPABASE URL VARIANTS');
console.log('=================================');

async function testUrl(url) {
    try {
        console.log(`\n🔄 Testing: ${url}`);
        
        const supabase = createClient(url, anonKey);
        
        // Test basic connection
        const { data, error } = await supabase
            .from('users')
            .select('count')
            .limit(1);
        
        if (error) {
            console.log(`❌ Error: ${error.message}`);
            return false;
        }
        
        console.log(`✅ SUCCESS: ${url}`);
        return true;
        
    } catch (err) {
        console.log(`❌ Failed: ${err.message}`);
        return false;
    }
}

// Test semua URL variants
for (const url of urlVariants) {
    await testUrl(url);
}

console.log('\n📋 CATATAN:');
console.log('- Jika semua URL gagal, kemungkinan API key tidak valid');
console.log('- Atau database schema belum di-setup');
console.log('- Periksa kembali Project ID di dashboard Supabase');