// CEK STRUKTUR TABEL SUPABASE
// Script untuk memeriksa struktur tabel additional_tasks yang sebenarnya

import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
dotenv.config();

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_ANON_KEY
);

async function cekStrukturTabel() {
  console.log('🔍 CEK STRUKTUR TABEL ADDITIONAL_TASKS...\n');
  
  try {
    // 1. Cek data yang ada untuk melihat struktur
    console.log('1. CEK DATA YANG ADA:');
    const { data: existingData, error: dataError } = await supabase
      .from('additional_tasks')
      .select('*')
      .limit(1);
    
    if (dataError) {
      console.error('❌ Error mengambil data:', dataError);
    } else {
      console.log('📊 Sample data:', JSON.stringify(existingData, null, 2));
    }
    
    // 2. Test insert dengan data minimal
    console.log('\n2. TEST INSERT DENGAN DATA MINIMAL:');
    
    // Get first school
    const { data: schools, error: schoolError } = await supabase
      .from('schools')
      .select('id, name')
      .limit(1)
      .single();
    
    if (schoolError || !schools) {
      console.error('❌ Error mengambil school:', schoolError);
      return;
    }
    
    console.log('🏫 Using school:', schools.name, '(', schools.id, ')');
    
    // Get first user
    const { data: users, error: userError } = await supabase
      .from('users')
      .select('id, username')
      .limit(1)
      .single();
    
    if (userError || !users) {
      console.error('❌ Error mengambil user:', userError);
      return;
    }
    
    console.log('👤 Using user:', users.username, '(', users.id, ')');
    
    // Test different data structures
    const testCases = [
      {
        name: 'Test 1: Minimal data',
        data: {
          title: 'Test Task Minimal',
          description: 'Test description'
        }
      },
      {
        name: 'Test 2: With school_id',
        data: {
          school_id: schools.id,
          title: 'Test Task With School',
          description: 'Test description with school'
        }
      },
      {
        name: 'Test 3: With user_id',
        data: {
          user_id: users.id,
          title: 'Test Task With User',
          description: 'Test description with user'
        }
      },
      {
        name: 'Test 4: With date',
        data: {
          user_id: users.id,
          school_id: schools.id,
          title: 'Test Task With Date',
          description: 'Test description with date',
          date: new Date().toISOString().split('T')[0]
        }
      },
      {
        name: 'Test 5: Complete data',
        data: {
          user_id: users.id,
          school_id: schools.id,
          title: 'Test Task Complete',
          description: 'Test description complete',
          date: new Date().toISOString().split('T')[0],
          status: 'completed'
        }
      }
    ];
    
    for (let i = 0; i < testCases.length; i++) {
      const testCase = testCases[i];
      console.log(`\n${testCase.name}:`);
      console.log('Data:', JSON.stringify(testCase.data, null, 2));
      
      const { data: insertResult, error: insertError } = await supabase
        .from('additional_tasks')
        .insert([testCase.data])
        .select()
        .single();
      
      if (insertError) {
        console.log('❌ Error:', insertError.message);
        console.log('   Code:', insertError.code);
        if (insertError.details) {
          console.log('   Details:', insertError.details);
        }
      } else {
        console.log('✅ Success! ID:', insertResult.id);
        
        // Delete the test data immediately
        await supabase
          .from('additional_tasks')
          .delete()
          .eq('id', insertResult.id);
        console.log('🗑️ Test data deleted');
      }
    }
    
    console.log('\n✅ Struktur tabel check selesai!');
    
  } catch (error) {
    console.error('❌ Error dalam check:', error);
  }
}

// Jalankan check
cekStrukturTabel();