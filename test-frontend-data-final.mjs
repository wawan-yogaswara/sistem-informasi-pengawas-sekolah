// 🔍 TEST FRONTEND DATA FINAL
import { createClient } from '@supabase/supabase-js';

console.log('🔍 TESTING FRONTEND DATA FINAL');
console.log('==============================');

const supabaseUrl = 'https://glhaliktsrcvnznbgxqt.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdsaGFsaWt0c3Jjdm56bmJneHF0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjYzNjYyMjQsImV4cCI6MjA4MTk0MjIyNH0._kaFo2h7rCdouJp2rpb1lmEvlR6gAc0c3AnRjM_PhP4';

const supabase = createClient(supabaseUrl, supabaseKey);

console.log('1️⃣ Testing Supabase connection...');

try {
  // Test tasks query
  const { data: tasks, error: tasksError } = await supabase
    .from('tasks')
    .select(`
      *,
      schools (
        id,
        name
      )
    `)
    .order('created_at', { ascending: false });

  if (tasksError) {
    console.error('❌ Tasks error:', tasksError);
  } else {
    console.log('✅ Tasks loaded:', tasks?.length || 0);
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
    console.log('✅ Schools loaded:', schools?.length || 0);
  }

  console.log('');
  console.log('📋 HASIL TEST:');
  console.log(`Tasks: ${tasks?.length || 0} records`);
  console.log(`Schools: ${schools?.length || 0} records`);
  
  if (tasks && tasks.length > 0 && schools && schools.length > 0) {
    console.log('✅ Backend data accessible - Frontend should work');
  } else {
    console.log('❌ No data found - Check database or RLS policies');
  }

} catch (error) {
  console.error('❌ Connection error:', error);
}

console.log('');
console.log('📝 NEXT STEPS:');
console.log('1. Buka http://localhost:5173/tasks');
console.log('2. Lihat apakah data muncul dengan perbaikan yang sudah dibuat');
console.log('3. Jika masih kosong, cek browser console untuk error messages');
console.log('4. Gunakan debug script di browser console jika perlu');