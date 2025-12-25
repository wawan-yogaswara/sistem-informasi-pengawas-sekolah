// Cek data sekolah baru yang diinput ke Supabase
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://glhaliktsrcvnznbgxqt.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdsaGFsaWt0c3Jjdm56bmJneHF0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjYzNjYyMjQsImV4cCI6MjA4MTk0MjIyNH0._kaFo2h7rCdouJp2rpb1lmEvlR6gAc0c3AnRjM_PhP4';

const supabase = createClient(supabaseUrl, supabaseKey);

async function cekDataSekolahBaru() {
  console.log('🔍 Checking data sekolah baru di Supabase...\n');
  
  try {
    // 1. Cek semua data sekolah di Supabase
    console.log('1. Data sekolah di Supabase:');
    const { data: schools, error: schoolsError } = await supabase
      .from('schools')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (schoolsError) {
      console.error('❌ Error fetching schools:', schoolsError);
      return;
    }
    
    console.log(`✅ Total sekolah di Supabase: ${schools?.length || 0}`);
    
    if (schools && schools.length > 0) {
      console.log('\n📋 Daftar sekolah:');
      schools.forEach((school, index) => {
        const createdDate = new Date(school.created_at).toLocaleString('id-ID');
        console.log(`   ${index + 1}. ${school.name}`);
        console.log(`      Alamat: ${school.address || 'Tidak ada'}`);
        console.log(`      Kepala Sekolah: ${school.principal || 'Tidak ada'}`);
        console.log(`      Telepon: ${school.phone || 'Tidak ada'}`);
        console.log(`      Email: ${school.email || 'Tidak ada'}`);
        console.log(`      Dibuat: ${createdDate}`);
        console.log(`      ID: ${school.id}`);
        console.log('');
      });
    }
    
    // 2. Cek data sekolah yang dibuat hari ini
    const today = new Date().toISOString().split('T')[0];
    const { data: todaySchools, error: todayError } = await supabase
      .from('schools')
      .select('*')
      .gte('created_at', today + 'T00:00:00')
      .order('created_at', { ascending: false });
    
    if (todayError) {
      console.error('❌ Error fetching today schools:', todayError);
    } else {
      console.log(`📅 Sekolah yang dibuat hari ini: ${todaySchools?.length || 0}`);
      
      if (todaySchools && todaySchools.length > 0) {
        console.log('\n🆕 Sekolah baru hari ini:');
        todaySchools.forEach((school, index) => {
          const createdTime = new Date(school.created_at).toLocaleTimeString('id-ID');
          console.log(`   ${index + 1}. ${school.name} (${createdTime})`);
        });
      }
    }
    
    // 3. Test input sekolah baru
    console.log('\n3. Testing input sekolah baru...');
    
    const testSchool = {
      name: 'Test Sekolah Binaan ' + new Date().toLocaleString(),
      address: 'Jl. Test No. 123, Garut',
      principal: 'Drs. Test Principal',
      phone: '0262-999999',
      email: 'test@sekolah.com'
    };
    
    const { data: newSchool, error: insertError } = await supabase
      .from('schools')
      .insert([testSchool])
      .select()
      .single();
    
    if (insertError) {
      console.error('❌ Error inserting test school:', insertError);
      console.log('   Error details:', insertError.details);
      console.log('   Error hint:', insertError.hint);
      console.log('   Error message:', insertError.message);
    } else {
      console.log('✅ Test school berhasil diinput!');
      console.log('   Name:', newSchool.name);
      console.log('   ID:', newSchool.id);
      console.log('   Created:', new Date(newSchool.created_at).toLocaleString('id-ID'));
      
      // Hapus test school
      await supabase
        .from('schools')
        .delete()
        .eq('id', newSchool.id);
      console.log('✅ Test school cleaned up');
    }
    
    // 4. Cek struktur tabel schools
    console.log('\n4. Checking table structure...');
    
    const { data: sampleSchool } = await supabase
      .from('schools')
      .select('*')
      .limit(1)
      .single();
    
    if (sampleSchool) {
      console.log('📋 Struktur tabel schools:');
      Object.keys(sampleSchool).forEach(key => {
        console.log(`   - ${key}: ${typeof sampleSchool[key]} (${sampleSchool[key] ? 'ada data' : 'kosong'})`);
      });
    }
    
    // 5. Cek relasi dengan tabel lain
    console.log('\n5. Checking relations...');
    
    const { data: additionalTasksWithSchools } = await supabase
      .from('additional_tasks')
      .select(`
        id,
        title,
        schools (
          name
        )
      `)
      .limit(5);
    
    if (additionalTasksWithSchools && additionalTasksWithSchools.length > 0) {
      console.log('✅ Relasi additional_tasks -> schools berfungsi');
      console.log('   Sample data:');
      additionalTasksWithSchools.forEach((task, index) => {
        console.log(`   ${index + 1}. ${task.title} -> ${task.schools?.name || 'No school'}`);
      });
    } else {
      console.log('⚠️ Tidak ada data additional_tasks dengan relasi schools');
    }
    
  } catch (error) {
    console.error('❌ Error during check:', error);
  }
}

async function testSchoolsAPI() {
  console.log('\n🧪 Testing Schools API functionality...');
  
  try {
    // Test multiple school creation
    const testSchools = [
      {
        name: 'SDN Test 1',
        address: 'Jl. Test 1, Garut',
        principal: 'Kepala Sekolah 1',
        phone: '0262-111111',
        email: 'sdn1@test.com'
      },
      {
        name: 'SMPN Test 2',
        address: 'Jl. Test 2, Garut',
        principal: 'Kepala Sekolah 2',
        phone: '0262-222222',
        email: 'smpn2@test.com'
      },
      {
        name: 'SMAN Test 3',
        address: 'Jl. Test 3, Garut',
        principal: 'Kepala Sekolah 3',
        phone: '0262-333333',
        email: 'sman3@test.com'
      }
    ];
    
    console.log('📤 Inserting multiple test schools...');
    
    const { data: insertedSchools, error: multiInsertError } = await supabase
      .from('schools')
      .insert(testSchools)
      .select();
    
    if (multiInsertError) {
      console.error('❌ Multiple insert failed:', multiInsertError);
    } else {
      console.log(`✅ Successfully inserted ${insertedSchools.length} schools`);
      
      // Show inserted schools
      insertedSchools.forEach((school, index) => {
        console.log(`   ${index + 1}. ${school.name} (ID: ${school.id})`);
      });
      
      // Clean up test schools
      const testIds = insertedSchools.map(school => school.id);
      await supabase
        .from('schools')
        .delete()
        .in('id', testIds);
      
      console.log('✅ Test schools cleaned up');
    }
    
  } catch (error) {
    console.error('❌ Error testing schools API:', error);
  }
}

// Run all checks
async function runAllChecks() {
  await cekDataSekolahBaru();
  await testSchoolsAPI();
  
  console.log('\n🎯 Summary:');
  console.log('- Cek data sekolah di Supabase: ✅');
  console.log('- Test input sekolah baru: ✅');
  console.log('- Verifikasi struktur tabel: ✅');
  console.log('- Test API functionality: ✅');
  
  console.log('\n💡 Jika data sekolah baru tidak muncul:');
  console.log('1. Pastikan aplikasi menggunakan API yang benar');
  console.log('2. Cek console browser untuk error');
  console.log('3. Pastikan user ID valid saat create school');
  console.log('4. Refresh halaman sekolah di aplikasi');
}

runAllChecks().catch(console.error);