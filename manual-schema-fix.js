#!/usr/bin/env node

/**
 * Script untuk menjalankan ALTER TABLE secara manual
 */

import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config();

const supabaseUrl = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_ANON_KEY || process.env.VITE_SUPABASE_ANON_KEY;

const supabase = createClient(supabaseUrl, supabaseKey);

async function manualSchemaFix() {
  console.log('🔧 MANUAL SCHEMA FIX');
  console.log('===================');
  
  try {
    // Check current schema
    console.log('\n📊 Checking current schema...');
    
    // Check tasks table
    const { data: tasksData, error: tasksError } = await supabase
      .from('tasks')
      .select('*')
      .limit(1);
    
    if (tasksError) {
      console.log('❌ Tasks table error:', tasksError.message);
    } else {
      console.log('✅ Tasks table accessible');
      if (tasksData && tasksData.length > 0) {
        console.log('   Columns:', Object.keys(tasksData[0]));
      }
    }
    
    // Check additional_tasks table
    const { data: additionalData, error: additionalError } = await supabase
      .from('additional_tasks')
      .select('*')
      .limit(1);
    
    if (additionalError) {
      console.log('❌ Additional tasks table error:', additionalError.message);
    } else {
      console.log('✅ Additional tasks table accessible');
      if (additionalData && additionalData.length > 0) {
        console.log('   Columns:', Object.keys(additionalData[0]));
      }
    }
    
    // Test insert without problematic columns
    console.log('\n🧪 Testing insert without problematic columns...');
    
    // Test task without category
    const taskData = {
      user_id: '1b140328-6087-4673-9e1f-c7e744d58e94',
      title: 'Manual Test Task - ' + new Date().toISOString(),
      description: 'Testing without category column',
      date: new Date().toISOString(),
      completed: false
    };
    
    const { data: taskResult, error: taskInsertError } = await supabase
      .from('tasks')
      .insert([taskData])
      .select();
    
    if (taskInsertError) {
      console.log('❌ Task insert failed:', taskInsertError.message);
    } else {
      console.log('✅ Task insert successful!');
      console.log('   Task ID:', taskResult[0]?.id);
      
      // Clean up
      if (taskResult && taskResult[0]) {
        await supabase.from('tasks').delete().eq('id', taskResult[0].id);
        console.log('✅ Test task cleaned up');
      }
    }
    
    // Test additional task without photo columns
    const additionalTaskData = {
      user_id: '1b140328-6087-4673-9e1f-c7e744d58e94',
      title: 'Manual Test Additional Task',
      name: 'Manual Test Additional Task',
      description: 'Testing without photo columns',
      date: new Date().toISOString(),
      location: 'Test Location',
      organizer: 'Test Organizer'
    };
    
    const { data: additionalResult, error: additionalInsertError } = await supabase
      .from('additional_tasks')
      .insert([additionalTaskData])
      .select();
    
    if (additionalInsertError) {
      console.log('❌ Additional task insert failed:', additionalInsertError.message);
    } else {
      console.log('✅ Additional task insert successful!');
      console.log('   Task ID:', additionalResult[0]?.id);
      
      // Clean up
      if (additionalResult && additionalResult[0]) {
        await supabase.from('additional_tasks').delete().eq('id', additionalResult[0].id);
        console.log('✅ Test additional task cleaned up');
      }
    }
    
  } catch (err) {
    console.log('❌ Manual schema fix failed:', err.message);
  }
}

manualSchemaFix();