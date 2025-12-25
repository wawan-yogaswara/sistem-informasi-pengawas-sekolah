#!/usr/bin/env node

/**
 * 🔧 FIX USER ID INCONSISTENCY SUPABASE
 * Script untuk memperbaiki inkonsistensi user_id di Supabase
 */

import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config();

const supabaseUrl = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_ANON_KEY || process.env.VITE_SUPABASE_ANON_KEY;

const supabase = createClient(supabaseUrl, supabaseKey);

async function fixUserIdInconsistency() {
  console.log('🔧 FIX USER ID INCONSISTENCY SUPABASE');
  console.log('====================================');
  
  try {
    const wawanCorrectId = '421cdb28-f2af-4f1f-aa5f-c59a3d661a2e';
    const wawanStringId = 'wawan';
    
    console.log(`🎯 Correct Wawan UUID: ${wawanCorrectId}`);
    console.log(`🔍 String ID to fix: ${wawanStringId}`);
    
    // 1. Check and fix supervisions
    console.log('\n1. 📋 Fixing supervisions...');
    const { data: supervisions, error: supervisionsError } = await supabase
      .from('supervisions')
      .select('*')
      .eq('user_id', wawanStringId);
    
    if (supervisionsError) {
      console.log('❌ Error fetching supervisions:', supervisionsError.message);
    } else {
      console.log(`✅ Found ${supervisions?.length || 0} supervisions with string user_id`);
      
      if (supervisions && supervisions.length > 0) {
        // Update supervisions user_id
        const { data: updatedSupervisions, error: updateError } = await supabase
          .from('supervisions')
          .update({ user_id: wawanCorrectId })
          .eq('user_id', wawanStringId)
          .select();
        
        if (updateError) {
          console.log('❌ Error updating supervisions:', updateError.message);
        } else {
          console.log(`✅ Updated ${updatedSupervisions?.length || 0} supervisions with correct user_id`);
        }
      }
    }
    
    // 2. Check and fix tasks
    console.log('\n2. 📋 Fixing tasks...');
    const { data: tasks, error: tasksError } = await supabase
      .from('tasks')
      .select('*')
      .eq('user_id', wawanStringId);
    
    if (tasksError) {
      console.log('❌ Error fetching tasks:', tasksError.message);
    } else {
      console.log(`✅ Found ${tasks?.length || 0} tasks with string user_id`);
      
      if (tasks && tasks.length > 0) {
        const { data: updatedTasks, error: updateError } = await supabase
          .from('tasks')
          .update({ user_id: wawanCorrectId })
          .eq('user_id', wawanStringId)
          .select();
        
        if (updateError) {
          console.log('❌ Error updating tasks:', updateError.message);
        } else {
          console.log(`✅ Updated ${updatedTasks?.length || 0} tasks with correct user_id`);
        }
      }
    }
    
    // 3. Check and fix additional_tasks
    console.log('\n3. 📋 Fixing additional_tasks...');
    const { data: additionalTasks, error: additionalError } = await supabase
      .from('additional_tasks')
      .select('*')
      .eq('user_id', wawanStringId);
    
    if (additionalError) {
      console.log('❌ Error fetching additional_tasks:', additionalError.message);
    } else {
      console.log(`✅ Found ${additionalTasks?.length || 0} additional_tasks with string user_id`);
      
      if (additionalTasks && additionalTasks.length > 0) {
        const { data: updatedAdditional, error: updateError } = await supabase
          .from('additional_tasks')
          .update({ user_id: wawanCorrectId })
          .eq('user_id', wawanStringId)
          .select();
        
        if (updateError) {
          console.log('❌ Error updating additional_tasks:', updateError.message);
        } else {
          console.log(`✅ Updated ${updatedAdditional?.length || 0} additional_tasks with correct user_id`);
        }
      }
    }
    
    // 4. Verify the fix
    console.log('\n4. 🔍 Verifying the fix...');
    
    // Count activities with correct user_id
    const { data: verifyTasks } = await supabase
      .from('tasks')
      .select('*')
      .eq('user_id', wawanCorrectId);
    
    const { data: verifyAdditional } = await supabase
      .from('additional_tasks')
      .select('*')
      .eq('user_id', wawanCorrectId);
    
    const { data: verifySupervisions } = await supabase
      .from('supervisions')
      .select('*')
      .eq('user_id', wawanCorrectId);
    
    const totalActivities = (verifyTasks?.length || 0) + (verifyAdditional?.length || 0) + (verifySupervisions?.length || 0);
    
    console.log('📊 VERIFICATION RESULTS:');
    console.log(`   - Tasks: ${verifyTasks?.length || 0}`);
    console.log(`   - Additional Tasks: ${verifyAdditional?.length || 0}`);
    console.log(`   - Supervisions: ${verifySupervisions?.length || 0}`);
    console.log(`   - TOTAL: ${totalActivities}`);
    
    // 5. Generate updated frontend fix script
    console.log('\n🔧 UPDATED FRONTEND FIX SCRIPT:');
    console.log('=' .repeat(50));
    
    const frontendScript = `
// 🔧 FINAL FIX SCRIPT - COPY PASTE KE CONSOLE BROWSER DI HALAMAN LAPORAN

console.log('🔧 FINAL FIX - WAWAN DATA WITH ALL ACTIVITIES...');

// 1. Update user data di localStorage dengan UUID yang benar
const currentUser = localStorage.getItem('auth_user');
if (currentUser) {
  const userData = JSON.parse(currentUser);
  console.log('Current user data:', userData);
  
  if (userData.username === 'wawan') {
    userData.id = '${wawanCorrectId}';
    localStorage.setItem('auth_user', JSON.stringify(userData));
    console.log('✅ Updated Wawan user_id to UUID:', userData.id);
  }
}

// 2. Test load all data
async function testLoadAllWawanData() {
  const userId = '${wawanCorrectId}';
  
  try {
    // Test tasks
    const tasksResponse = await fetch('/api/tasks-daily');
    const tasksData = tasksResponse.ok ? await tasksResponse.json() : [];
    const wawanTasks = tasksData.filter(t => t.user_id === userId);
    console.log('📋 Wawan tasks:', wawanTasks.length);
    
    // Test additional tasks
    const additionalResponse = await fetch('/api/activities');
    const additionalData = additionalResponse.ok ? await additionalResponse.json() : [];
    const wawanAdditional = additionalData.filter(t => t.user_id === userId);
    console.log('➕ Wawan additional tasks:', wawanAdditional.length);
    
    // Test supervisions
    const supervisionsResponse = await fetch('/api/supervisions');
    const supervisionsData = supervisionsResponse.ok ? await supervisionsResponse.json() : [];
    const wawanSupervisions = supervisionsData.filter(s => s.user_id === userId);
    console.log('🔍 Wawan supervisions:', wawanSupervisions.length);
    
    const total = wawanTasks.length + wawanAdditional.length + wawanSupervisions.length;
    console.log('📊 TOTAL WAWAN ACTIVITIES:', total);
    
    if (total > 0) {
      console.log('✅ SUCCESS! Data will appear in reports');
    } else {
      console.log('❌ Still no data found');
    }
    
  } catch (error) {
    console.error('Error testing data:', error);
  }
}

testLoadAllWawanData();

// 3. Refresh page after 3 seconds
setTimeout(() => {
  console.log('🔄 Refreshing page to show updated data...');
  location.reload();
}, 3000);
`;
    
    console.log(frontendScript);
    console.log('=' .repeat(50));
    
    // 6. Final summary
    console.log('\n🎉 FIX COMPLETED!');
    console.log('================');
    
    if (totalActivities > 0) {
      console.log('✅ SUCCESS: All Wawan activities now use consistent user_id');
      console.log(`📊 Total activities: ${totalActivities}`);
      console.log('🚀 Data should now appear in reports page');
      console.log('');
      console.log('📋 NEXT STEPS:');
      console.log('1. Open reports page in browser');
      console.log('2. Open console (F12)');
      console.log('3. Copy paste the frontend fix script above');
      console.log('4. Watch data appear in reports!');
    } else {
      console.log('⚠️ No activities found after fix');
      console.log('💡 Check if data migration is needed');
    }
    
  } catch (error) {
    console.error('❌ Error:', error.message);
  }
}

fixUserIdInconsistency();