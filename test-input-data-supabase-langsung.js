// Test input data langsung ke Supabase dengan user ID yang benar
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://glhaliktsrcvnznbgxqt.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdsaGFsaWt0c3Jjdm56bmJneHF0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjYzNjYyMjQsImV4cCI6MjA4MTk0MjIyNH0._kaFo2h7rCdouJp2rpb1lmEvlR6gAc0c3AnRjM_PhP4';

const supabase = createClient(supabaseUrl, supabaseKey);

// User IDs yang benar dari Supabase
const correctUserIds = {
  admin: 'a7c7a9de-9ec8-4416-9aa3-59dab24b620b',
  wawan: '421cdb28-f2af-4f1f-aa5f-c59a3d661a2e'
};

// School IDs dari Supabase
const schoolIds = {
  'SDN 1 Garut': '1cd40355-1b07-402d-8309-b243c098cfe9',
  'SMPN 2 Garut': 'c9b2f6b5-ab65-44e2-a7bb-5e75a635241f',
  'SMAN 1 Garut': 'fd270001-7032-444e-8b1c-a095c9b6cc2c'
};

async function testInputDataLangsung() {
  console.log('🚀 Testing input data langsung ke Supabase...\n');
  
  try {
    // 1. Test input task
    console.log('1. Testing task input...');
    const testTask = {
      user_id: correctUserIds.wawan,
      title: 'Test Task dari Wawan - ' + new Date().toLocaleString(),
      description: 'Test task dengan user ID yang benar dari script',
      date: new Date().toISOString().split('T')[0],
      completed: false,
      category: 'Testing'
    };
    
    const { data: taskData, error: taskError } = await supabase
      .from('tasks')
      .insert([testTask])
      .select()
      .single();
    
    if (taskError) {
      console.error('❌ Task insert failed:', taskError);
    } else {
      console.log('✅ Task insert successful!');
      console.log('   Title:', taskData.title);
      console.log('   ID:', taskData.id);
      console.log('   User ID:', taskData.user_id);
      console.log('   Date:', taskData.date);
    }
    
    // 2. Test input additional task
    console.log('\n2. Testing additional task input...');
    const testAdditionalTask = {
      user_id: correctUserIds.wawan,
      school_id: schoolIds['SDN 1 Garut'],
      title: 'Test Tugas Tambahan dari Wawan - ' + new Date().toLocaleString(),
      description: 'Test tugas tambahan dengan user ID dan school ID yang benar',
      date: new Date().toISOString().split('T')[0],
      status: 'completed'
    };
    
    const { data: additionalTaskData, error: additionalTaskError } = await supabase
      .from('additional_tasks')
      .insert([testAdditionalTask])
      .select()
      .single();
    
    if (additionalTaskError) {
      console.error('❌ Additional task insert failed:', additionalTaskError);
    } else {
      console.log('✅ Additional task insert successful!');
      console.log('   Title:', additionalTaskData.title);
      console.log('   ID:', additionalTaskData.id);
      console.log('   User ID:', additionalTaskData.user_id);
      console.log('   School ID:', additionalTaskData.school_id);
      console.log('   Date:', additionalTaskData.date);
    }
    
    // 3. Test multiple data input
    console.log('\n3. Testing multiple data input...');
    
    const multipleTasks = [
      {
        user_id: correctUserIds.wawan,
        title: 'Supervisi Akademik SDN 1',
        description: 'Melakukan supervisi pembelajaran di kelas 1-6',
        date: new Date().toISOString().split('T')[0],
        completed: true,
        category: 'Supervisi'
      },
      {
        user_id: correctUserIds.wawan,
        title: 'Rapat Koordinasi Kepala Sekolah',
        description: 'Rapat bulanan dengan kepala sekolah binaan',
        date: new Date().toISOString().split('T')[0],
        completed: true,
        category: 'Rapat'
      },
      {
        user_id: correctUserIds.wawan,
        title: 'Monitoring Kurikulum Merdeka',
        description: 'Monitoring implementasi kurikulum merdeka',
        date: new Date().toISOString().split('T')[0],
        completed: false,
        category: 'Monitoring'
      }
    ];
    
    const { data: multipleTasksData, error: multipleTasksError } = await supabase
      .from('tasks')
      .insert(multipleTasks)
      .select();
    
    if (multipleTasksError) {
      console.error('❌ Multiple tasks insert failed:', multipleTasksError);
    } else {
      console.log('✅ Multiple tasks insert successful!');
      console.log(`   Inserted ${multipleTasksData.length} tasks`);
      multipleTasksData.forEach((task, index) => {
        console.log(`   ${index + 1}. ${task.title} (${task.category})`);
      });
    }
    
    // 4. Test multiple additional tasks
    console.log('\n4. Testing multiple additional tasks...');
    
    const multipleAdditionalTasks = [
      {
        user_id: correctUserIds.wawan,
        school_id: schoolIds['SDN 1 Garut'],
        title: 'Pendampingan Guru Baru',
        description: 'Memberikan pendampingan kepada guru baru di SDN 1 Garut',
        date: new Date().toISOString().split('T')[0],
        status: 'completed'
      },
      {
        user_id: correctUserIds.wawan,
        school_id: schoolIds['SMPN 2 Garut'],
        title: 'Workshop Pembelajaran Digital',
        description: 'Mengadakan workshop pembelajaran digital untuk guru SMPN 2',
        date: new Date().toISOString().split('T')[0],
        status: 'completed'
      },
      {
        user_id: correctUserIds.wawan,
        school_id: schoolIds['SMAN 1 Garut'],
        title: 'Evaluasi Program Sekolah',
        description: 'Melakukan evaluasi program sekolah semester ini',
        date: new Date().toISOString().split('T')[0],
        status: 'pending'
      }
    ];
    
    const { data: multipleAdditionalTasksData, error: multipleAdditionalTasksError } = await supabase
      .from('additional_tasks')
      .insert(multipleAdditionalTasks)
      .select();
    
    if (multipleAdditionalTasksError) {
      console.error('❌ Multiple additional tasks insert failed:', multipleAdditionalTasksError);
    } else {
      console.log('✅ Multiple additional tasks insert successful!');
      console.log(`   Inserted ${multipleAdditionalTasksData.length} additional tasks`);
      multipleAdditionalTasksData.forEach((task, index) => {
        console.log(`   ${index + 1}. ${task.title} (${task.status})`);
      });
    }
    
    // 5. Check final database status
    console.log('\n5. Final database status:');
    
    const { data: finalTasks } = await supabase
      .from('tasks')
      .select('*')
      .order('created_at', { ascending: false });
    
    const { data: finalAdditionalTasks } = await supabase
      .from('additional_tasks')
      .select('*')
      .order('created_at', { ascending: false });
    
    console.log(`✅ Total tasks in database: ${finalTasks?.length || 0}`);
    console.log(`✅ Total additional tasks in database: ${finalAdditionalTasks?.length || 0}`);
    
    if (finalTasks?.length > 0) {
      console.log('\n📋 Recent tasks:');
      finalTasks.slice(0, 5).forEach((task, index) => {
        console.log(`   ${index + 1}. ${task.title} (${task.date}) - ${task.completed ? 'Selesai' : 'Belum selesai'}`);
      });
    }
    
    if (finalAdditionalTasks?.length > 0) {
      console.log('\n📋 Recent additional tasks:');
      finalAdditionalTasks.slice(0, 5).forEach((task, index) => {
        console.log(`   ${index + 1}. ${task.title} (${task.date}) - ${task.status}`);
      });
    }
    
    console.log('\n🎉 Test input data completed successfully!');
    console.log('✅ Data berhasil masuk ke Supabase dengan user ID yang benar');
    
  } catch (error) {
    console.error('❌ Error during test:', error);
  }
}

async function checkDataIntegrity() {
  console.log('\n🔍 Checking data integrity...');
  
  try {
    // Check for orphaned data (data without valid user_id or school_id)
    const { data: tasksWithInvalidUsers } = await supabase
      .from('tasks')
      .select('id, title, user_id')
      .not('user_id', 'in', `(${Object.values(correctUserIds).join(',')})`);
    
    if (tasksWithInvalidUsers?.length > 0) {
      console.log(`⚠️ Found ${tasksWithInvalidUsers.length} tasks with invalid user IDs`);
    } else {
      console.log('✅ All tasks have valid user IDs');
    }
    
    const { data: additionalTasksWithInvalidUsers } = await supabase
      .from('additional_tasks')
      .select('id, title, user_id, school_id')
      .not('user_id', 'in', `(${Object.values(correctUserIds).join(',')})`);
    
    if (additionalTasksWithInvalidUsers?.length > 0) {
      console.log(`⚠️ Found ${additionalTasksWithInvalidUsers.length} additional tasks with invalid user IDs`);
    } else {
      console.log('✅ All additional tasks have valid user IDs');
    }
    
    const { data: additionalTasksWithInvalidSchools } = await supabase
      .from('additional_tasks')
      .select('id, title, school_id')
      .not('school_id', 'in', `(${Object.values(schoolIds).join(',')})`);
    
    if (additionalTasksWithInvalidSchools?.length > 0) {
      console.log(`⚠️ Found ${additionalTasksWithInvalidSchools.length} additional tasks with invalid school IDs`);
    } else {
      console.log('✅ All additional tasks have valid school IDs');
    }
    
  } catch (error) {
    console.error('❌ Error checking data integrity:', error);
  }
}

// Run all tests
async function runAllTests() {
  await testInputDataLangsung();
  await checkDataIntegrity();
}

runAllTests().catch(console.error);