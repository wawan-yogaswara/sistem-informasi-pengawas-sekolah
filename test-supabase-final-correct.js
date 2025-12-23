// Test koneksi Supabase dengan kredensial yang sudah diperbaiki
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://glhaliktsrcvnznbgxqt.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdsaGFsaWt0c3Jjdm56bmJneHF0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjYzNjYyMjQsImV4cCI6MjA4MTk0MjIyNH0._kaFo2h7rCdouJp2rpb1lmEvlR6gAc0c3AnRjM_PhP4';

console.log('🔍 TESTING CORRECTED SUPABASE CONNECTION');
console.log('=========================================');
console.log(`URL: ${supabaseUrl}`);
console.log(`Key: ${supabaseKey.substring(0, 20)}...`);

const supabase = createClient(supabaseUrl, supabaseKey);

async function testConnection() {
    try {
        console.log('\n🔄 Testing basic connection...');
        
        // Test basic connection dengan query sederhana
        const { data, error } = await supabase
            .from('users')
            .select('count')
            .limit(1);
        
        if (error) {
            console.log('❌ Connection failed:', error.message);
            
            if (error.message.includes('Could not find the table') || error.message.includes('relation "users" does not exist')) {
                console.log('\n📊 DATABASE SCHEMA ISSUE:');
                console.log('✅ Connection to Supabase: SUCCESS');
                console.log('❌ Table "users" does not exist');
                console.log('🔧 Need to setup database schema');
                return 'schema_needed';
            }
            
            return false;
        }
        
        console.log('✅ Connection successful!');
        console.log('✅ Database accessible');
        console.log('✅ Users table exists');
        
        return true;
        
    } catch (err) {
        console.log('❌ Connection error:', err.message);
        return false;
    }
}

// Run test
testConnection().then(result => {
    console.log('\n🎯 RESULT SUMMARY:');
    
    if (result === true) {
        console.log('🎉 PERFECT! Supabase fully ready');
        console.log('✅ URL: Correct');
        console.log('✅ API Key: Valid');
        console.log('✅ Database: Accessible');
        console.log('✅ Schema: Ready');
        
    } else if (result === 'schema_needed') {
        console.log('🔧 SUPABASE CONNECTION OK - SCHEMA NEEDED');
        console.log('✅ URL: Correct');
        console.log('✅ API Key: Valid');
        console.log('✅ Database: Accessible');
        console.log('⚠️  Schema: Need to setup tables');
        
        console.log('\n📋 NEXT STEPS:');
        console.log('1. Run: node setup-supabase-schema.js');
        console.log('2. Update Netlify environment variables');
        console.log('3. Deploy to production');
        
    } else {
        console.log('❌ CONNECTION FAILED');
        console.log('🔧 Check credentials and network');
    }
});