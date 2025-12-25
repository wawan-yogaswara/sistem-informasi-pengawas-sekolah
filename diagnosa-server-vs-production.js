#!/usr/bin/env node

/**
 * Script untuk mendiagnosa kenapa test production bisa masuk tapi server aplikasi tidak
 */

import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import fs from 'fs';

dotenv.config();

const supabaseUrl = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_ANON_KEY || process.env.VITE_SUPABASE_ANON_KEY;

console.log('🔍 DIAGNOSA: SERVER vs PRODUCTION TEST');
console.log('=====================================');

const supabase = createClient(supabaseUrl, supabaseKey);

async function checkEnvironmentConfig() {
  console.log('\n📋 Environment Configuration:');
  
  const envContent = fs.readFileSync('.env', 'utf-8');
  const lines = envContent.split('\n');
  
  console.log('Current .env settings:');
  lines.forEach(line => {
    if (line.includes('USE_LOCAL_STORAGE') || 
        line.includes('NODE_ENV') || 
        line.includes('DATABASE_URL') ||
        line.includes('SUPABASE_URL') ||
        line.includes('VITE_SUPABASE')) {
      console.log(`  ${line}`);
    }
  });
  
  // Check if server is using local storage
  const useLocalStorage = process.env.USE_LOCAL_STORAGE;
  console.log(`\n🔧 USE_LOCAL_STORAGE: ${useLocalStorage}`);
  
  if (useLocalStorage === 'true') {
    console.log('❌ MASALAH DITEMUKAN: Server masih menggunakan local storage!');
    return false;
  } else {
    console.log('✅ Server dikonfigurasi untuk menggunakan Supabase');
    return true;
  }
}

async function checkDatabaseConnection() {
  console.log('\n🔗 Testing Database Connection...');
  
  try {
    // Test dengan cara yang sama seperti server
    const { data, error } = await supabase
      .from('users')
      .select('id, username')
      .limit(1);
    
    if (error) {
      console.log('❌ Database connection error:', error.message);
      return false;
    }
    
    console.log('✅ Database connection successful');
    console.log(`   Found ${data?.length || 0} users`);
    return true;
    
  } catch (err) {
    console.log('❌ Connection failed:', err.message);
    return false;
  }
}

async function testServerStyleInsert() {
  console.log('\n🧪 Testing Server-Style Insert...');
  
  try {
    // Get existing user (seperti yang dilakukan server)
    const { data: users, error: userError } = await supabase
      .from('users')
      .select('id')
      .limit(1);
    
    if (userError || !users || users.length === 0) {
      console.log('❌ No users found for testing');
      return false;
    }
    
    const userId = users[0].id;
    console.log('Using user ID:', userId);
    
    // Test insert task (seperti API endpoint)
    const taskData = {
      user_id: userId,
      title: 'Server Style Test Task',
      description: 'Testing insert dengan format server',
      date: new Date().toISOString(),
      completed: false
    };
    
    console.log('Inserting task data:', taskData);
    
    const { data: taskResult, error: taskError } = await supabase
      .from('tasks')
      .insert([taskData])
      .select();
    
    if (taskError) {
      console.log('❌ Task insert failed:', taskError.message);
      console.log('   Error details:', taskError);
      return false;
    }
    
    console.log('✅ Task insert successful!');
    console.log('   Task ID:', taskResult[0]?.id);
    
    // Clean up
    if (taskResult && taskResult[0]) {
      await supabase.from('tasks').delete().eq('id', taskResult[0].id);
      console.log('✅ Test data cleaned up');
    }
    
    return true;
    
  } catch (err) {
    console.log('❌ Server-style test failed:', err.message);
    return false;
  }
}

async function checkLocalDatabaseFile() {
  console.log('\n📁 Checking Local Database File...');
  
  try {
    if (fs.existsSync('local-database.json')) {
      const localData = JSON.parse(fs.readFileSync('local-database.json', 'utf-8'));
      
      console.log('Local database file exists:');
      console.log(`  Users: ${localData.users?.length || 0}`);
      console.log(`  Tasks: ${localData.tasks?.length || 0}`);
      console.log(`  Additional Tasks: ${localData.additionalTasks?.length || 0}`);
      
      if (localData.tasks?.length > 0) {
        console.log('⚠️  Local database has data - server might be using this instead!');
        return false;
      }
    } else {
      console.log('✅ No local database file found');
    }
    
    return true;
    
  } catch (err) {
    console.log('❌ Error checking local database:', err.message);
    return false;
  }
}

async function checkServerConfiguration() {
  console.log('\n⚙️  Checking Server Configuration...');
  
  try {
    // Check if server/db.ts is configured correctly
    if (fs.existsSync('server/db.ts')) {
      const dbContent = fs.readFileSync('server/db.ts', 'utf-8');
      
      if (dbContent.includes('isDatabaseConfigured')) {
        console.log('✅ Database configuration check exists');
        
        // Check if DATABASE_URL is properly set
        const databaseUrl = process.env.DATABASE_URL;
        if (databaseUrl && !databaseUrl.includes('dummy') && !databaseUrl.includes('example')) {
          console.log('✅ DATABASE_URL is properly configured');
        } else {
          console.log('❌ DATABASE_URL is not properly configured');
          return false;
        }
      }
    }
    
    // Check if server/local-storage.ts might be interfering
    if (fs.existsSync('server/local-storage.ts')) {
      const localStorageContent = fs.readFileSync('server/local-storage.ts', 'utf-8');
      
      if (localStorageContent.includes('isLocalStorageEnabled')) {
        console.log('⚠️  Local storage fallback exists - check if it\'s being used');
      }
    }
    
    return true;
    
  } catch (err) {
    console.log('❌ Error checking server config:', err.message);
    return false;
  }
}

async function main() {
  console.log('🎯 Goal: Find why production test works but server app doesn\'t');
  
  const envOk = await checkEnvironmentConfig();
  const dbOk = await checkDatabaseConnection();
  const insertOk = await testServerStyleInsert();
  const localDbOk = await checkLocalDatabaseFile();
  const serverConfigOk = await checkServerConfiguration();
  
  console.log('\n📊 DIAGNOSIS RESULTS:');
  console.log(`Environment Config: ${envOk ? '✅' : '❌'}`);
  console.log(`Database Connection: ${dbOk ? '✅' : '❌'}`);
  console.log(`Server-Style Insert: ${insertOk ? '✅' : '❌'}`);
  console.log(`Local Database Check: ${localDbOk ? '✅' : '❌'}`);
  console.log(`Server Configuration: ${serverConfigOk ? '✅' : '❌'}`);
  
  if (envOk && dbOk && insertOk && localDbOk && serverConfigOk) {
    console.log('\n🎉 ALL CHECKS PASSED!');
    console.log('Server should be able to save to Supabase.');
    console.log('\n🔄 Next steps:');
    console.log('1. Restart server: npm run dev');
    console.log('2. Test aplikasi web');
    console.log('3. Check browser network tab for API errors');
  } else {
    console.log('\n❌ ISSUES FOUND!');
    console.log('\n🔧 Recommended fixes:');
    
    if (!envOk) {
      console.log('- Set USE_LOCAL_STORAGE=false in .env');
    }
    if (!dbOk) {
      console.log('- Check Supabase credentials');
    }
    if (!insertOk) {
      console.log('- Check Supabase schema and permissions');
    }
    if (!localDbOk) {
      console.log('- Remove or rename local-database.json');
    }
    if (!serverConfigOk) {
      console.log('- Check server database configuration');
    }
  }
}

main().catch(console.error);