#!/usr/bin/env node

/**
 * Script untuk memverifikasi data sudah masuk ke Supabase
 */

import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config();

const supabaseUrl = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_ANON_KEY || process.env.VITE_SUPABASE_ANON_KEY;

const supabase = createClient(supabaseUrl, supabaseKey);

async function verifyData() {
  console.log('🔍 VERIFYING DATA IN SUPABASE');
  console.log('============================');
  
  try {
    // Check latest tasks
    const { data: tasks, error: tasksError } = await supabase
      .from('tasks')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(3);
    
    if (tasksError) {
      console.log('❌ Tasks error:', tasksError.message);
    } else {
      console.log(`✅ Latest Tasks (${tasks?.length || 0}):`);
      tasks?.forEach((task, index) => {
        console.log(`   ${index + 1}. ${task.title} (${new Date(task.created_at).toLocaleString()})`);
      });
    }
    
    // Check latest additional tasks
    const { data: additionalTasks, error: additionalError } = await supabase
      .from('additional_tasks')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(3);
    
    if (additionalError) {
      console.log('❌ Additional tasks error:', additionalError.message);
    } else {
      console.log(`\n✅ Latest Additional Tasks (${additionalTasks?.length || 0}):`);
      additionalTasks?.forEach((task, index) => {
        console.log(`   ${index + 1}. ${task.title || task.name} (${new Date(task.created_at).toLocaleString()})`);
      });
    }
    
    // Check users
    const { data: users, error: usersError } = await supabase
      .from('users')
      .select('id, username, name, role')
      .order('created_at', { ascending: false })
      .limit(5);
    
    if (usersError) {
      console.log('❌ Users error:', usersError.message);
    } else {
      console.log(`\n✅ Users (${users?.length || 0}):`);
      users?.forEach((user, index) => {
        console.log(`   ${index + 1}. ${user.username} (${user.name}) - ${user.role}`);
      });
    }
    
    console.log('\n🎉 DATA VERIFICATION COMPLETE!');
    console.log('\n📊 Summary:');
    console.log(`- Tasks: ${tasks?.length || 0} records`);
    console.log(`- Additional Tasks: ${additionalTasks?.length || 0} records`);
    console.log(`- Users: ${users?.length || 0} records`);
    
    if ((tasks?.length || 0) > 0 && (additionalTasks?.length || 0) > 0) {
      console.log('\n✅ SUCCESS: Data is flowing to Supabase!');
      console.log('🚀 Your application is ready for production!');
    }
    
  } catch (err) {
    console.log('❌ Verification failed:', err.message);
  }
}

verifyData();