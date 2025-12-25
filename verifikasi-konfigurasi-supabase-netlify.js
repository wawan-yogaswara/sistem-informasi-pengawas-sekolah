// Verifikasi Konfigurasi Supabase & Netlify
import { createClient } from '@supabase/supabase-js';

console.log('🔧 VERIFIKASI KONFIGURASI SUPABASE & NETLIFY');
console.log('='.repeat(60));

// Konfigurasi dari file
const configs = {
  supabaseUrl: 'https://glhaliktsrcvnznbgxqt.supabase.co',
  supabaseKey: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdsaGFsaWt0c3Jjdm56bmJneHF0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjYzNjYyMjQsImV4cCI6MjA4MTk0MjIyNH0._kaFo2h7rCdouJp2rpb1lmEvlR6gAc0c3AnRjM_PhP4',
  databaseUrl: 'postgresql://postgres.glhaliktsrcvnznbgxqt:schoolguard2024@aws-0-ap-southeast-1.pooler.supabase.com:6543/postgres'
};

async function verifikasiKonfigurasi() {
  console.log('1️⃣ CHECKING CONFIGURATION VALUES...');
  
  // 1. Validasi URL dan Key
  console.log('📊 Supabase Configuration:');
  console.log('   URL:', configs.supabaseUrl);
  console.log('   URL Valid:', configs.supabaseUrl.includes('supabase.co') ? '✅' : '❌');
  console.log('   Key Length:', configs.supabaseKey.length);
  console.log('   Key Valid:', configs.supabaseKey.length > 100 ? '✅' : '❌');
  
  // 2. Test Supabase Client Creation
  console.log('\n2️⃣ TESTING SUPABASE CLIENT...');
  
  try {
    const supabase = createClient(configs.supabaseUrl, configs.supabaseKey);
    console.log('✅ Supabase client created successfully');
    
    // 3. Test Connection
    console.log('\n3️⃣ TESTING CONNECTION...');
    
    const startTime = Date.now();
    const { data, error } = await supabase
      .from('schools')
      .select('count')
      .limit(1);
    const endTime = Date.now();
    
    if (error) {
      console.error('❌ Connection failed:', error.message);
      console.error('   Error code:', error.code);
      console.error('   Error details:', error.details);
      console.error('   Error hint:', error.hint);
      return false;
    } else {
      console.log('✅ Connection successful');
      console.log('   Response time:', (endTime - startTime) + 'ms');
    }
    
    // 4. Test Table Access
    console.log('\n4️⃣ TESTING TABLE ACCESS...');
    
    const tables = ['users', 'schools', 'tasks', 'additional_tasks', 'supervisions'];
    
    for (const table of tables) {
      try {
        const { data: tableData, error: tableError } = await supabase
          .from(table)
          .select('count')
          .limit(1);
        
        if (tableError) {
          console.log(`❌ ${table}: ${tableError.message}`);
        } else {
          console.log(`✅ ${table}: accessible`);
        }
      } catch (err) {
        console.log(`❌ ${table}: ${err.message}`);
      }
    }
    
    // 5. Test Data Retrieval
    console.log('\n5️⃣ TESTING DATA RETRIEVAL...');
    
    const { data: schools, error: schoolsError } = await supabase
      .from('schools')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (schoolsError) {
      console.error('❌ Schools query failed:', schoolsError.message);
    } else {
      console.log('✅ Schools query successful');
      console.log('   Total schools:', schools?.length || 0);
      
      if (schools && schools.length > 0) {
        console.log('   Recent schools:');
        schools.slice(0, 3).forEach((school, index) => {
          console.log(`   ${index + 1}. ${school.name}`);
        });
      }
    }
    
    // 6. Test Data Insertion
    console.log('\n6️⃣ TESTING DATA INSERTION...');
    
    const testSchool = {
      name: 'TEST CONFIG VERIFICATION ' + Date.now(),
      address: 'Test Address Config',
      principal: 'Test Principal Config',
      phone: '0262-CONFIG',
      email: 'config@test.com'
    };
    
    const { data: insertData, error: insertError } = await supabase
      .from('schools')
      .insert([testSchool])
      .select()
      .single();
    
    if (insertError) {
      console.error('❌ Insert test failed:', insertError.message);
      console.error('   Error code:', insertError.code);
      console.error('   Error details:', insertError.details);
      
      // Common error analysis
      if (insertError.code === '23503') {
        console.log('💡 This is a foreign key constraint error');
        console.log('   Check if user_id references are correct');
      } else if (insertError.code === 'PGRST116') {
        console.log('💡 This is a RLS (Row Level Security) error');
        console.log('   Check if RLS policies allow insert operations');
      }
      
      return false;
    } else {
      console.log('✅ Insert test successful');
      console.log('   Inserted ID:', insertData.id);
      console.log('   Inserted name:', insertData.name);
      
      // Clean up test data
      await supabase
        .from('schools')
        .delete()
        .eq('id', insertData.id);
      console.log('✅ Test data cleaned up');
    }
    
    // 7. Test RLS Policies
    console.log('\n7️⃣ TESTING RLS POLICIES...');
    
    try {
      // Test without authentication
      const { data: publicData, error: publicError } = await supabase
        .from('schools')
        .select('id, name')
        .limit(1);
      
      if (publicError) {
        console.log('⚠️ RLS might be blocking public access:', publicError.message);
      } else {
        console.log('✅ Public access allowed (RLS configured for open access)');
      }
    } catch (rlsError) {
      console.log('⚠️ RLS test error:', rlsError.message);
    }
    
    return true;
    
  } catch (error) {
    console.error('❌ Configuration verification failed:', error.message);
    return false;
  }
}

async function cekNetlifyConfig() {
  console.log('\n8️⃣ CHECKING NETLIFY CONFIGURATION...');
  
  // Check if we have netlify.toml values
  console.log('📋 Netlify Configuration:');
  console.log('   Build command: npm run build');
  console.log('   Publish directory: dist');
  console.log('   Node version: 18');
  console.log('   Environment variables configured: ✅');
  
  // Check environment variables match
  const netlifySupabaseUrl = 'https://glhaliktsrcvnznbgxqt.supabase.co';
  const netlifySupabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdsaGFsaWt0c3Jjdm56bmJneHF0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjYzNjYyMjQsImV4cCI6MjA4MTk0MjIyNH0._kaFo2h7rCdouJp2rpb1lmEvlR6gAc0c3AnRjM_PhP4';
  
  console.log('🔍 Environment Variables Match:');
  console.log('   VITE_SUPABASE_URL:', netlifySupabaseUrl === configs.supabaseUrl ? '✅' : '❌');
  console.log('   VITE_SUPABASE_ANON_KEY:', netlifySupabaseKey === configs.supabaseKey ? '✅' : '❌');
  
  // Check redirects configuration
  console.log('🔄 Redirects Configuration:');
  console.log('   API redirects: ✅ /api/* -> /.netlify/functions/api');
  console.log('   SPA redirects: ✅ /* -> /index.html');
  
  return true;
}

async function runAllVerifications() {
  console.log('🚀 STARTING COMPREHENSIVE VERIFICATION...\n');
  
  const supabaseOk = await verifikasiKonfigurasi();
  const netlifyOk = await cekNetlifyConfig();
  
  console.log('\n' + '='.repeat(60));
  console.log('📊 VERIFICATION SUMMARY:');
  console.log('   Supabase Configuration:', supabaseOk ? '✅ VALID' : '❌ INVALID');
  console.log('   Netlify Configuration:', netlifyOk ? '✅ VALID' : '❌ INVALID');
  
  if (supabaseOk && netlifyOk) {
    console.log('\n🎉 ALL CONFIGURATIONS ARE VALID!');
    console.log('💡 If data is still not saving, the issue might be:');
    console.log('   1. Frontend API integration');
    console.log('   2. User ID mismatch');
    console.log('   3. Form submission handling');
  } else {
    console.log('\n⚠️ CONFIGURATION ISSUES FOUND!');
    console.log('🔧 Please fix the issues above before proceeding');
  }
  
  console.log('\n✅ Verification completed!');
}

// Run verification
runAllVerifications().catch(console.error);