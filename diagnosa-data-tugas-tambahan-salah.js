// DIAGNOSA DATA TUGAS TAMBAHAN YANG SALAH
// Script untuk mengecek dan membersihkan data yang bukan input user

import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
dotenv.config();

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_ANON_KEY
);

async function diagnosaTugasTambahan() {
  console.log('🔍 DIAGNOSA DATA TUGAS TAMBAHAN...\n');
  
  try {
    // 1. Cek semua data di tabel additional_tasks
    console.log('1. CEK SEMUA DATA ADDITIONAL_TASKS:');
    const { data: allTasks, error: allError } = await supabase
      .from('additional_tasks')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (allError) {
      console.error('❌ Error mengambil data:', allError);
      return;
    }
    
    console.log(`📊 Total data: ${allTasks.length}`);
    allTasks.forEach((task, index) => {
      console.log(`\n${index + 1}. ID: ${task.id}`);
      console.log(`   School ID: ${task.school_id}`);
      console.log(`   Title: ${task.title}`);
      console.log(`   Description: ${task.description}`);
      console.log(`   Created: ${task.created_at}`);
    });
    
    // 2. Cek data schools untuk referensi
    console.log('\n\n2. CEK DATA SCHOOLS UNTUK REFERENSI:');
    const { data: schools, error: schoolError } = await supabase
      .from('schools')
      .select('*');
    
    if (schoolError) {
      console.error('❌ Error mengambil data schools:', schoolError);
    } else {
      console.log(`📊 Total schools: ${schools.length}`);
      schools.forEach((school, index) => {
        console.log(`${index + 1}. ID: ${school.id} - ${school.name}`);
      });
    }
    
    // 3. Identifikasi data yang mencurigakan
    console.log('\n\n3. IDENTIFIKASI DATA MENCURIGAKAN:');
    const suspiciousData = allTasks.filter(task => {
      // Data yang terlihat seperti test/dummy
      const isTestData = task.title?.toLowerCase().includes('test') ||
                        task.title?.toLowerCase().includes('api') ||
                        task.description?.toLowerCase().includes('test') ||
                        task.description?.toLowerCase().includes('testing');
      
      return isTestData;
    });
    
    console.log(`🚨 Data mencurigakan: ${suspiciousData.length}`);
    suspiciousData.forEach((task, index) => {
      console.log(`\n${index + 1}. SUSPICIOUS - ID: ${task.id}`);
      console.log(`   Title: ${task.title}`);
      console.log(`   Description: ${task.description}`);
    });
    
    // 4. Cek data terbaru (kemungkinan input user real)
    console.log('\n\n4. DATA TERBARU (5 TERAKHIR):');
    const recentTasks = allTasks.slice(0, 5);
    recentTasks.forEach((task, index) => {
      console.log(`\n${index + 1}. RECENT - ID: ${task.id}`);
      console.log(`   Title: ${task.title}`);
      console.log(`   Description: ${task.description}`);
      console.log(`   Created: ${task.created_at}`);
    });
    
    // 5. Rekomendasi pembersihan
    console.log('\n\n5. REKOMENDASI PEMBERSIHAN:');
    if (suspiciousData.length > 0) {
      console.log('🧹 Perlu hapus data dummy/test:');
      suspiciousData.forEach(task => {
        console.log(`   - Hapus ID: ${task.id} (${task.title})`);
      });
    }
    
    console.log('\n✅ Diagnosa selesai!');
    console.log('\n📝 LANGKAH SELANJUTNYA:');
    console.log('1. Jalankan script pembersihan data dummy');
    console.log('2. Test input data baru');
    console.log('3. Verifikasi data tersimpan dengan benar');
    
  } catch (error) {
    console.error('❌ Error dalam diagnosa:', error);
  }
}

// Jalankan diagnosa
diagnosaTugasTambahan();