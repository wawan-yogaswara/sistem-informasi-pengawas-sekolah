// CEK SEMUA TABEL SUPABASE LENGKAP
// Jalankan di console browser untuk cek semua tabel

console.log('🔍 CEK SEMUA TABEL SUPABASE LENGKAP');

async function cekSemuaTabel() {
  try {
    console.log('📊 Checking all table structures and permissions...');
    
    // Test koneksi Supabase
    console.log('🔗 Supabase client:', supabase);
    
    // Get user data
    const userData = localStorage.getItem('auth_user');
    const currentUser = userData ? JSON.parse(userData) : null;
    console.log('👤 Current user:', currentUser?.id || 'No user');
    
    const tables = [
      { name: 'tasks', displayName: 'TASKS (Tugas Harian)' },
      { name: 'supervisions', displayName: 'SUPERVISIONS (Supervisi)' },
      { name: 'additional_tasks', displayName: 'ADDITIONAL_TASKS (Tugas Tambahan)' },
      { name: 'schools', displayName: 'SCHOOLS (Sekolah)' }
    ];
    
    for (const table of tables) {
      console.log(`\n📋 ${table.displayName}:`);
      
      try {
        // Test read access
        const { data: readData, error: readError } = await supabase
          .from(table.name)
          .select('*')
          .limit(3);
        
        if (readError) {
          console.error(`❌ Read error for ${table.name}:`, readError);
        } else {
          console.log(`✅ Read access OK - ${readData.length} records found`);
          if (readData.length > 0) {
            console.log('📄 Sample structure:', Object.keys(readData[0]));
          }
        }
        
        // Test insert permission (only for non-schools tables)
        if (table.name !== 'schools' && currentUser) {
          try {
            let testData = {};
            
            switch (table.name) {
              case 'tasks':
                testData = {
                  user_id: currentUser.id,
                  title: 'Test Permission',
                  description: 'Testing insert permission',
                  completed: false,
                  date: new Date().toISOString().split('T')[0]
                };
                break;
              case 'supervisions':
                testData = {
                  user_id: currentUser.id,
                  school: 'Test School',
                  type: 'Akademik',
                  date: new Date().toISOString().split('T')[0],
                  findings: 'Test findings'
                };
                break;
              case 'additional_tasks':
                testData = {
                  user_id: currentUser.id,
                  school_id: '1cd40355-1b07-402d-8309-b243c098cfe9',
                  title: 'Test Permission',
                  description: 'Testing insert permission',
                  date: new Date().toISOString().split('T')[0],
                  status: 'completed'
                };
                break;
            }
            
            const { data: insertTest, error: insertError } = await supabase
              .from(table.name)
              .insert([testData])
              .select()
              .single();
            
            if (insertError) {
              console.error(`❌ Insert permission denied for ${table.name}:`, insertError);
            } else {
              console.log(`✅ Insert permission OK for ${table.name}`);
              
              // Clean up test data
              await supabase.from(table.name).delete().eq('id', insertTest.id);
              console.log('🧹 Test data cleaned up');
            }
          } catch (error) {
            console.error(`❌ Insert test failed for ${table.name}:`, error);
          }
        }
        
      } catch (error) {
        console.error(`💥 Error checking ${table.name}:`, error);
      }
    }
    
    // Test specific queries that might be used in the app
    console.log('\n🔍 TESTING SPECIFIC QUERIES:');
    
    // Test additional_tasks with schools join
    try {
      const { data: joinData, error: joinError } = await supabase
        .from('additional_tasks')
        .select(`
          *,
          schools (
            id,
            name
          )
        `)
        .limit(1);
      
      if (joinError) {
        console.error('❌ Additional tasks with schools join failed:', joinError);
      } else {
        console.log('✅ Additional tasks with schools join OK');
      }
    } catch (error) {
      console.error('❌ Join query test failed:', error);
    }
    
    console.log('\n🎉 SEMUA TABEL CHECK SELESAI');
    
  } catch (error) {
    console.error('💥 Error checking tables:', error);
  }
}

// Jalankan check
cekSemuaTabel();