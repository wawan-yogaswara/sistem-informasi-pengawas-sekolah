// Script untuk mengatasi masalah data tidak muncul di frontend
// Masalah: Data ada di Supabase tapi tidak muncul di halaman tugas harian dan tugas tambahan

const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'https://glhaliktsrcvnznbgxqt.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdsaGFsaWt0c3Jjdm56bmJneHF0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjYzNjYyMjQsImV4cCI6MjA4MTk0MjIyNH0._kaFo2h7rCdouJp2rpb1lmEvlR6gAc0c3AnRjM_PhP4';

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function diagnoseMasalah() {
  console.log('🔍 DIAGNOSA MASALAH DATA TIDAK MUNCUL DI FRONTEND');
  console.log('='.repeat(60));
  
  try {
    // 1. Test koneksi dasar
    console.log('1️⃣ Testing basic connection...');
    const { data: testData, error: testError } = await supabase
      .from('tasks')
      .select('count')
      .limit(1);
    
    if (testError) {
      console.error('❌ Basic connection failed:', testError);
      return;
    }
    console.log('✅ Basic connection OK');
    
    // 2. Test RLS policies
    console.log('\n2️⃣ Testing RLS policies...');
    
    // Test tasks table
    const { data: tasksData, error: tasksError } = await supabase
      .from('tasks')
      .select('*')
      .limit(5);
    
    if (tasksError) {
      console.error('❌ Tasks RLS error:', tasksError);
      console.log('🔧 Kemungkinan masalah: RLS policy terlalu ketat');
    } else {
      console.log('✅ Tasks accessible:', tasksData?.length || 0, 'records');
    }
    
    // Test additional_tasks table
    const { data: additionalData, error: additionalError } = await supabase
      .from('additional_tasks')
      .select('*')
      .limit(5);
    
    if (additionalError) {
      console.error('❌ Additional tasks RLS error:', additionalError);
      console.log('🔧 Kemungkinan masalah: RLS policy terlalu ketat');
    } else {
      console.log('✅ Additional tasks accessible:', additionalData?.length || 0, 'records');
    }
    
    // 3. Test dengan join schools
    console.log('\n3️⃣ Testing with schools join...');
    
    const { data: tasksWithSchools, error: joinError } = await supabase
      .from('tasks')
      .select('*, schools(id, name)')
      .limit(3);
    
    if (joinError) {
      console.error('❌ Join error:', joinError);
      console.log('🔧 Kemungkinan masalah: Foreign key atau RLS pada schools table');
    } else {
      console.log('✅ Join query works:', tasksWithSchools?.length || 0, 'records');
      if (tasksWithSchools && tasksWithSchools.length > 0) {
        console.log('📝 Sample with school:', {
          id: tasksWithSchools[0].id,
          title: tasksWithSchools[0].title,
          school: tasksWithSchools[0].schools
        });
      }
    }
    
    // 4. Test schools table access
    console.log('\n4️⃣ Testing schools table access...');
    
    const { data: schoolsData, error: schoolsError } = await supabase
      .from('schools')
      .select('id, name')
      .limit(5);
    
    if (schoolsError) {
      console.error('❌ Schools access error:', schoolsError);
    } else {
      console.log('✅ Schools accessible:', schoolsData?.length || 0, 'records');
    }
    
    console.log('\n' + '='.repeat(60));
    console.log('📋 RINGKASAN DIAGNOSA:');
    
    if (!tasksError && !additionalError) {
      console.log('✅ Data dapat diakses dari backend');
      console.log('🔧 Masalah kemungkinan di frontend React Query atau state management');
      console.log('💡 Solusi: Periksa browser console dan network tab');
    } else {
      console.log('❌ Ada masalah RLS policy di Supabase');
      console.log('🔧 Solusi: Disable RLS atau update policies');
    }
    
  } catch (error) {
    console.error('❌ Diagnosa failed:', error);
  }
}

async function fixRLSPolicies() {
  console.log('\n🔧 MENCOBA MEMPERBAIKI RLS POLICIES...');
  
  try {
    // Disable RLS untuk testing (HANYA UNTUK DEVELOPMENT)
    console.log('⚠️  Disabling RLS for development testing...');
    
    const queries = [
      'ALTER TABLE tasks DISABLE ROW LEVEL SECURITY;',
      'ALTER TABLE additional_tasks DISABLE ROW LEVEL SECURITY;',
      'ALTER TABLE schools DISABLE ROW LEVEL SECURITY;'
    ];
    
    for (const query of queries) {
      console.log('Executing:', query);
      const { error } = await supabase.rpc('exec_sql', { sql: query });
      if (error) {
        console.error('❌ SQL Error:', error);
      } else {
        console.log('✅ Success');
      }
    }
    
  } catch (error) {
    console.error('❌ Fix RLS failed:', error);
    console.log('💡 Jalankan SQL ini manual di Supabase Dashboard:');
    console.log('ALTER TABLE tasks DISABLE ROW LEVEL SECURITY;');
    console.log('ALTER TABLE additional_tasks DISABLE ROW LEVEL SECURITY;');
    console.log('ALTER TABLE schools DISABLE ROW LEVEL SECURITY;');
  }
}

// Jalankan diagnosa
diagnoseMasalah().then(() => {
  console.log('\n🔧 Ingin mencoba fix RLS? (Uncomment baris berikut)');
  // fixRLSPolicies();
});