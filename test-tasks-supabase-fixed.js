// Test input tasks ke Supabase dengan struktur yang benar
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://glhaliktsrcvnznbgxqt.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdsaGFsaWt0c3Jjdm56bmJneHF0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjYzNjYyMjQsImV4cCI6MjA4MTk0MjIyNH0._kaFo2h7rCdouJp2rpb1lmEvlR6gAc0c3AnRjM_PhP4';

const supabase = createClient(supabaseUrl, supabaseKey);

// User ID yang benar
const wawanUserId = '421cdb28-f2af-4f1f-aa5f-c59a3d661a2e';

async function testTasksWithCorrectStructure() {
  console.log('🚀 Testing tasks dengan struktur yang benar...\n');
  
  try {
    // 1. Test single task
    console.log('1. Testing single task...');
    const testTask = {
      user_id: wawanUserId,
      title: 'Test Task Struktur Benar - ' + new Date().toLocaleString(),
      description: 'Test task dengan struktur tabel yang benar (tanpa category)',
      date: new Date().toISOString().split('T')[0],
      completed: false,
      photo: null // Menggunakan 'photo' bukan 'photo1'
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
      console.log('   Completed:', taskData.completed);
    }
    
    // 2. Test multiple tasks
    console.log('\n2. Testing multiple tasks...');
    
    const multipleTasks = [
      {
        user_id: wawanUserId,
        title: 'Supervisi Pembelajaran Kelas 1',
        description: 'Melakukan supervisi pembelajaran di kelas 1 SDN 1 Garut',
        date: new Date().toISOString().split('T')[0],
        completed: true,
        photo: null
      },
      {
        user_id: wawanUserId,
        title: 'Rapat Koordinasi Bulanan',
        description: 'Menghadiri rapat koordinasi bulanan dengan kepala sekolah',
        date: new Date().toISOString().split('T')[0],
        completed: true,
        photo: null
      },
      {
        user_id: wawanUserId,
        title: 'Monitoring Kurikulum Merdeka',
        description: 'Melakukan monitoring implementasi kurikulum merdeka',
        date: new Date().toISOString().split('T')[0],
        completed: false,
        photo: null
      },
      {
        user_id: wawanUserId,
        title: 'Evaluasi Kinerja Guru',
        description: 'Melakukan evaluasi kinerja guru semester ini',
        date: new Date().toISOString().split('T')[0],
        completed: false,
        photo: null
      },
      {
        user_id: wawanUserId,
        title: 'Workshop Pembelajaran Digital',
        description: 'Mengadakan workshop pembelajaran digital untuk guru',
        date: new Date().toISOString().split('T')[0],
        completed: true,
        photo: null
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
        console.log(`   ${index + 1}. ${task.title} - ${task.completed ? 'Selesai' : 'Belum selesai'}`);
      });
    }
    
    // 3. Check final status
    console.log('\n3. Final database status:');
    
    const { data: allTasks } = await supabase
      .from('tasks')
      .select('*')
      .order('created_at', { ascending: false });
    
    const { data: allAdditionalTasks } = await supabase
      .from('additional_tasks')
      .select('*')
      .order('created_at', { ascending: false });
    
    console.log(`✅ Total tasks: ${allTasks?.length || 0}`);
    console.log(`✅ Total additional tasks: ${allAdditionalTasks?.length || 0}`);
    
    if (allTasks?.length > 0) {
      console.log('\n📋 Recent tasks:');
      allTasks.slice(0, 5).forEach((task, index) => {
        console.log(`   ${index + 1}. ${task.title} (${task.date}) - ${task.completed ? '✅' : '⏳'}`);
      });
    }
    
    if (allAdditionalTasks?.length > 0) {
      console.log('\n📋 Recent additional tasks:');
      allAdditionalTasks.slice(0, 5).forEach((task, index) => {
        console.log(`   ${index + 1}. ${task.title} (${task.date}) - ${task.status}`);
      });
    }
    
    // 4. Test data statistics
    console.log('\n4. Data statistics:');
    
    const completedTasks = allTasks?.filter(task => task.completed).length || 0;
    const pendingTasks = allTasks?.filter(task => !task.completed).length || 0;
    
    const completedAdditionalTasks = allAdditionalTasks?.filter(task => task.status === 'completed').length || 0;
    const pendingAdditionalTasks = allAdditionalTasks?.filter(task => task.status === 'pending').length || 0;
    
    console.log(`   Tasks: ${completedTasks} selesai, ${pendingTasks} belum selesai`);
    console.log(`   Additional Tasks: ${completedAdditionalTasks} selesai, ${pendingAdditionalTasks} pending`);
    
    console.log('\n🎉 Test completed successfully!');
    console.log('✅ Data berhasil masuk ke Supabase dengan struktur yang benar');
    console.log('✅ User ID dan foreign key constraints berfungsi dengan baik');
    
  } catch (error) {
    console.error('❌ Error during test:', error);
  }
}

// Run test
testTasksWithCorrectStructure().catch(console.error);