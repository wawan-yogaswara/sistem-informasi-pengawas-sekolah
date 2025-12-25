#!/usr/bin/env node

/**
 * Script untuk mengecek struktur schema Supabase yang sebenarnya
 */

import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config();

const supabaseUrl = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_ANON_KEY || process.env.VITE_SUPABASE_ANON_KEY;

const supabase = createClient(supabaseUrl, supabaseKey);

async function checkTableStructure() {
  console.log('🔍 CHECKING SUPABASE SCHEMA STRUCTURE');
  console.log('====================================');
  
  // Check users table structure
  console.log('\n👥 USERS TABLE:');
  try {
    const { data: users, error } = await supabase
      .from('users')
      .select('*')
      .limit(1);
    
    if (error) {
      console.log('❌ Users error:', error.message);
    } else if (users && users.length > 0) {
      console.log('✅ Users columns:', Object.keys(users[0]));
      console.log('   Sample data:', users[0]);
    } else {
      console.log('⚠️  No users found');
    }
  } catch (err) {
    console.log('❌ Users check failed:', err.message);
  }
  
  // Check tasks table structure
  console.log('\n📋 TASKS TABLE:');
  try {
    const { data: tasks, error } = await supabase
      .from('tasks')
      .select('*')
      .limit(1);
    
    if (error) {
      console.log('❌ Tasks error:', error.message);
    } else if (tasks && tasks.length > 0) {
      console.log('✅ Tasks columns:', Object.keys(tasks[0]));
    } else {
      console.log('⚠️  No tasks found');
    }
  } catch (err) {
    console.log('❌ Tasks check failed:', err.message);
  }
  
  // Check additional_tasks table structure
  console.log('\n➕ ADDITIONAL_TASKS TABLE:');
  try {
    const { data: additionalTasks, error } = await supabase
      .from('additional_tasks')
      .select('*')
      .limit(1);
    
    if (error) {
      console.log('❌ Additional tasks error:', error.message);
    } else if (additionalTasks && additionalTasks.length > 0) {
      console.log('✅ Additional tasks columns:', Object.keys(additionalTasks[0]));
      console.log('   Sample data:', additionalTasks[0]);
    } else {
      console.log('⚠️  No additional tasks found');
    }
  } catch (err) {
    console.log('❌ Additional tasks check failed:', err.message);
  }
  
  // Check supervisions table structure
  console.log('\n👁️ SUPERVISIONS TABLE:');
  try {
    const { data: supervisions, error } = await supabase
      .from('supervisions')
      .select('*')
      .limit(1);
    
    if (error) {
      console.log('❌ Supervisions error:', error.message);
    } else if (supervisions && supervisions.length > 0) {
      console.log('✅ Supervisions columns:', Object.keys(supervisions[0]));
    } else {
      console.log('⚠️  No supervisions found');
    }
  } catch (err) {
    console.log('❌ Supervisions check failed:', err.message);
  }
  
  // Check schools table structure
  console.log('\n🏫 SCHOOLS TABLE:');
  try {
    const { data: schools, error } = await supabase
      .from('schools')
      .select('*')
      .limit(1);
    
    if (error) {
      console.log('❌ Schools error:', error.message);
    } else if (schools && schools.length > 0) {
      console.log('✅ Schools columns:', Object.keys(schools[0]));
    } else {
      console.log('⚠️  No schools found');
    }
  } catch (err) {
    console.log('❌ Schools check failed:', err.message);
  }
}

async function testCorrectInsert() {
  console.log('\n🧪 TESTING CORRECT INSERT FORMAT');
  console.log('=================================');
  
  try {
    // Get existing user
    const { data: users } = await supabase
      .from('users')
      .select('id')
      .limit(1);
    
    if (!users || users.length === 0) {
      console.log('❌ No users found for testing');
      return;
    }
    
    const userId = users[0].id;
    console.log('Using user ID:', userId);
    
    // Test additional task with correct format
    const additionalTaskData = {
      user_id: userId,
      title: 'Test Additional Task - ' + new Date().toISOString(), // Gunakan title bukan name
      description: 'Testing with correct column names',
      date: new Date().toISOString(),
      location: 'Test Location',
      organizer: 'Test Organizer'
    };
    
    console.log('\nTesting additional task insert...');
    console.log('Data:', additionalTaskData);
    
    const { data: result, error } = await supabase
      .from('additional_tasks')
      .insert([additionalTaskData])
      .select();
    
    if (error) {
      console.log('❌ Insert failed:', error.message);
      console.log('   Error details:', error);
    } else {
      console.log('✅ Insert successful!');
      console.log('   Result:', result[0]);
      
      // Clean up
      if (result && result[0]) {
        await supabase.from('additional_tasks').delete().eq('id', result[0].id);
        console.log('✅ Test data cleaned up');
      }
    }
    
  } catch (err) {
    console.log('❌ Test failed:', err.message);
  }
}

async function main() {
  await checkTableStructure();
  await testCorrectInsert();
  
  console.log('\n🏁 Schema Check Complete!');
}

main().catch(console.error);