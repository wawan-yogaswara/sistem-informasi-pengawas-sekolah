#!/usr/bin/env node

/**
 * 🔧 FIX LAPORAN WAWAN DATA SUPABASE
 * Script untuk memastikan data aktivitas user Wawan muncul di halaman laporan
 */

import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config();

const supabaseUrl = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_ANON_KEY || process.env.VITE_SUPABASE_ANON_KEY;

const supabase = createClient(supabaseUrl, supabaseKey);

async function fixLaporanWawanData() {
  console.log('🔧 FIXING LAPORAN WAWAN DATA SUPABASE');
  console.log('=====================================');
  
  try {
    // 1. Cek user Wawan di database
    console.log('1. 👤 Checking user Wawan...');
    const { data: users, error: usersError } = await supabase
      .from('users')
      .select('*')
      .or('username.eq.wawan,name.ilike.%wawan%');
    
    if (usersError) {
      console.log('❌ Error fetching users:', usersError.message);
      return;
    }
    
    console.log(`✅ Found ${users?.length || 0} users matching 'wawan':`);
    users?.forEach((user, index) => {
      console.log(`   ${index + 1}. ID: ${user.id}, Username: ${user.username}, Name: ${user.name}`);
    });
    
    // Tentukan user_id yang benar untuk Wawan
    let wawanUserId = null;
    const wawanUser = users?.find(u => u.username === 'wawan') || users?.[0];
    
    if (wawanUser) {
      wawanUserId = wawanUser.id;
      console.log(`🎯 Using Wawan user_id: ${wawanUserId}`);
    } else {
      console.log('❌ No Wawan user found!');
      return;
    }
    
    // 2. Cek semua data aktivitas untuk user Wawan
    console.log('\n2. 📋 Checking Wawan activities...');
    
    // Check tasks
    const { data: tasks, error: tasksError } = await supabase
      .from('tasks')
      .select('*')
      .eq('user_id', wawanUserId)
      .order('created_at', { ascending: false });
    
    if (tasksError) {
      console.log('❌ Error fetching tasks:', tasksError.message);
    } else {
      console.log(`✅ Found ${tasks?.length || 0} tasks for Wawan:`);
      tasks?.forEach((task, index) => {
        console.log(`   ${index + 1}. ${task.title} (${new Date(task.created_at).toLocaleDateString()})`);
      });
    }
    
    // Check additional_tasks
    const { data: additionalTasks, error: additionalError } = await supabase
      .from('additional_tasks')
      .select('*')
      .eq('user_id', wawanUserId)
      .order('created_at', { ascending: false });
    
    if (additionalError) {
      console.log('❌ Error fetching additional tasks:', additionalError.message);
    } else {
      console.log(`✅ Found ${additionalTasks?.length || 0} additional tasks for Wawan:`);
      additionalTasks?.forEach((task, index) => {
        console.log(`   ${index + 1}. ${task.name || task.title} (${new Date(task.created_at).toLocaleDateString()})`);
      });
    }
    
    // Check supervisions
    const { data: supervisions, error: supervisionsError } = await supabase
      .from('supervisions')
      .select('*')
      .eq('user_id', wawanUserId)
      .order('created_at', { ascending: false });
    
    if (supervisionsError) {
      console.log('❌ Error fetching supervisions:', supervisionsError.message);
    } else {
      console.log(`✅ Found ${supervisions?.length || 0} supervisions for Wawan:`);
      supervisions?.forEach((supervision, index) => {
        console.log(`   ${index + 1}. Supervision ID: ${supervision.id} (${new Date(supervision.created_at).toLocaleDateString()})`);
      });
    }
    
    // 3. Total aktivitas
    const totalActivities = (tasks?.length || 0) + (additionalTasks?.length || 0) + (supervisions?.length || 0);
    console.log(`\n📊 TOTAL ACTIVITIES FOR WAWAN: ${totalActivities}`);
    
    // 4. Jika tidak ada data, coba cari dengan user_id alternatif
    if (totalActivities === 0) {
      console.log('\n🔍 No activities found, trying alternative user_ids...');
      
      // Coba dengan user_id yang mungkin digunakan di localStorage
      const alternativeUserIds = ['1762696525337', 'wawan', '2', '3'];
      
      for (const altUserId of alternativeUserIds) {
        console.log(`\n🔍 Trying user_id: ${altUserId}`);
        
        const { data: altTasks } = await supabase
          .from('tasks')
          .select('*')
          .eq('user_id', altUserId);
        
        const { data: altAdditional } = await supabase
          .from('additional_tasks')
          .select('*')
          .eq('user_id', altUserId);
        
        const { data: altSupervisions } = await supabase
          .from('supervisions')
          .select('*')
          .eq('user_id', altUserId);
        
        const altTotal = (altTasks?.length || 0) + (altAdditional?.length || 0) + (altSupervisions?.length || 0);
        
        if (altTotal > 0) {
          console.log(`✅ Found ${altTotal} activities with user_id: ${altUserId}`);
          console.log(`   - Tasks: ${altTasks?.length || 0}`);
          console.log(`   - Additional Tasks: ${altAdditional?.length || 0}`);
          console.log(`   - Supervisions: ${altSupervisions?.length || 0}`);
          
          // Update user_id di localStorage jika perlu
          console.log(`\n💡 SOLUTION: Update localStorage auth_user with user_id: ${altUserId}`);
          break;
        }
      }
    }
    
    // 5. Generate fix script untuk frontend
    console.log('\n🔧 GENERATING FIX SCRIPT FOR FRONTEND...');
    
    const fixScript = `
// 🔧 COPY PASTE SCRIPT INI KE CONSOLE BROWSER DI HALAMAN LAPORAN
// Script untuk fix data Wawan di halaman laporan

console.log('🔧 FIXING WAWAN DATA IN REPORTS...');

// 1. Update user data di localStorage
const currentUser = localStorage.getItem('auth_user');
if (currentUser) {
  const userData = JSON.parse(currentUser);
  console.log('Current user data:', userData);
  
  // Update dengan user_id yang benar
  if (userData.username === 'wawan') {
    userData.id = '${wawanUserId}'; // User ID yang benar dari Supabase
    localStorage.setItem('auth_user', JSON.stringify(userData));
    console.log('✅ Updated Wawan user_id to:', userData.id);
  }
}

// 2. Force refresh data
console.log('🔄 Refreshing page to load new data...');
setTimeout(() => {
  location.reload();
}, 1000);
`;
    
    console.log('📋 COPY SCRIPT BERIKUT KE CONSOLE BROWSER:');
    console.log('=' .repeat(50));
    console.log(fixScript);
    console.log('=' .repeat(50));
    
    // 6. Summary dan rekomendasi
    console.log('\n📋 SUMMARY & RECOMMENDATIONS:');
    console.log('============================');
    
    if (totalActivities > 0) {
      console.log('✅ SUCCESS: Wawan has activities in Supabase!');
      console.log(`   - Total activities: ${totalActivities}`);
      console.log('   - Data should appear in reports page');
      console.log('   - If not showing, copy the fix script above to browser console');
    } else {
      console.log('⚠️  WARNING: No activities found for Wawan');
      console.log('   - Check if data was migrated correctly');
      console.log('   - Try alternative user_ids shown above');
      console.log('   - Run migration script again if needed');
    }
    
    console.log('\n🎯 NEXT STEPS:');
    console.log('1. Open reports page in browser');
    console.log('2. Open browser console (F12)');
    console.log('3. Copy paste the fix script above');
    console.log('4. Check if data appears in reports');
    
  } catch (error) {
    console.error('❌ Error:', error.message);
  }
}

fixLaporanWawanData();