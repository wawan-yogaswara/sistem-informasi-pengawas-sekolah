// 🧪 TEST FRONTEND TASKS FIXED
import { createClient } from '@supabase/supabase-js';

console.log('🧪 TESTING FRONTEND TASKS FIXED');
console.log('===============================');

const supabaseUrl = 'https://glhaliktsrcvnznbgxqt.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdsaGFsaWt0c3Jjdm56bmJneHF0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjYzNjYyMjQsImV4cCI6MjA4MTk0MjIyNH0._kaFo2h7rCdouJp2rpb1lmEvlR6gAc0c3AnRjM_PhP4';

const supabase = createClient(supabaseUrl, supabaseKey);

console.log('1️⃣ Testing fixed tasks query (no join)...');

try {
  // Test tasks query without join
  const { data: tasks, error: tasksError } = await supabase
    .from('tasks')
    .select('*')
    .order('created_at', { ascending: false });

  if (tasksError) {
    console.error('❌ Tasks error:', tasksError);
  } else {
    console.log('✅ Tasks loaded successfully:', tasks?.length || 0);
    if (tasks && tasks.length > 0) {
      console.log('📝 Sample task:', tasks[0]);
    }
  }

  // Test schools query
  const { data: schools, error: schoolsError } = await supabase
    .from('schools')
    .select('id, name')
    .order('name', { ascending: true });

  if (schoolsError) {
    console.error('❌ Schools error:', schoolsError);
  } else {
    console.log('✅ Schools loaded successfully:', schools?.length || 0);
  }

  console.log('');
  console.log('📋 HASIL TEST FIXED:');
  console.log(`Tasks: ${tasks?.length || 0} records`);
  console.log(`Schools: ${schools?.length || 0} records`);
  
  if (tasks && tasks.length > 0) {
    console.log('✅ Frontend should now work - tasks query fixed!');
    console.log('🔧 Note: School names will show as IDs until we fix the relationship');
  } else {
    console.log('⚠️ No tasks found - but query works without errors');
  }

} catch (error) {
  console.error('❌ Connection error:', error);
}

console.log('');
console.log('📝 NEXT STEPS:');
console.log('1. Buka http://localhost:5173/tasks');
console.log('2. Data tasks seharusnya muncul sekarang');
console.log('3. Nama sekolah akan tampil sebagai ID sementara');
console.log('4. Gunakan debug script di browser jika masih ada masalah');