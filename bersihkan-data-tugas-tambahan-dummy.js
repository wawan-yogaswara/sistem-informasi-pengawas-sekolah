// BERSIHKAN DATA TUGAS TAMBAHAN DUMMY
// Script untuk menghapus data yang bukan input user asli

import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
dotenv.config();

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_ANON_KEY
);

async function bersihkanDataDummy() {
  console.log('🧹 MEMBERSIHKAN DATA TUGAS TAMBAHAN DUMMY...\n');
  
  try {
    // 1. Ambil semua data untuk analisis
    const { data: allTasks, error: fetchError } = await supabase
      .from('additional_tasks')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (fetchError) {
      console.error('❌ Error mengambil data:', fetchError);
      return;
    }
    
    console.log(`📊 Total data saat ini: ${allTasks.length}`);
    
    // 2. Identifikasi data dummy berdasarkan pattern
    const dummyData = allTasks.filter(task => {
      const isDummy = 
        // Data dengan kata "test" atau "API"
        task.title?.toLowerCase().includes('test') ||
        task.title?.toLowerCase().includes('api') ||
        task.description?.toLowerCase().includes('test') ||
        task.description?.toLowerCase().includes('testing') ||
        task.description?.toLowerCase().includes('additional task') ||
        // Data dengan format ID yang aneh
        task.school_id?.includes('-') && task.school_id?.length > 10 ||
        // Data dengan deskripsi generic
        task.description?.toLowerCase().includes('dipimpin oleh') ||
        task.description?.toLowerCase().includes('silaturahim');
      
      return isDummy;
    });
    
    console.log(`🚨 Data dummy teridentifikasi: ${dummyData.length}`);
    
    if (dummyData.length === 0) {
      console.log('✅ Tidak ada data dummy yang perlu dihapus');
      return;
    }
    
    // 3. Tampilkan data yang akan dihapus
    console.log('\n📋 DATA YANG AKAN DIHAPUS:');
    dummyData.forEach((task, index) => {
      console.log(`\n${index + 1}. ID: ${task.id}`);
      console.log(`   School ID: ${task.school_id}`);
      console.log(`   Title: ${task.title}`);
      console.log(`   Description: ${task.description?.substring(0, 100)}...`);
    });
    
    // 4. Konfirmasi sebelum menghapus
    console.log('\n⚠️  PERINGATAN: Script ini akan menghapus data di atas!');
    console.log('Untuk melanjutkan, ubah CONFIRM_DELETE menjadi true\n');
    
    const CONFIRM_DELETE = true; // Ubah ke true untuk menghapus
    
    if (!CONFIRM_DELETE) {
      console.log('❌ Penghapusan dibatalkan (CONFIRM_DELETE = false)');
      console.log('Ubah CONFIRM_DELETE menjadi true jika yakin ingin menghapus');
      return;
    }
    
    // 5. Hapus data dummy
    console.log('🗑️  Menghapus data dummy...');
    
    const idsToDelete = dummyData.map(task => task.id);
    
    const { error: deleteError } = await supabase
      .from('additional_tasks')
      .delete()
      .in('id', idsToDelete);
    
    if (deleteError) {
      console.error('❌ Error menghapus data:', deleteError);
      return;
    }
    
    console.log(`✅ Berhasil menghapus ${idsToDelete.length} data dummy`);
    
    // 6. Verifikasi hasil
    const { data: remainingTasks, error: verifyError } = await supabase
      .from('additional_tasks')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (verifyError) {
      console.error('❌ Error verifikasi:', verifyError);
      return;
    }
    
    console.log(`\n📊 Data tersisa setelah pembersihan: ${remainingTasks.length}`);
    
    if (remainingTasks.length > 0) {
      console.log('\n📋 DATA YANG TERSISA:');
      remainingTasks.forEach((task, index) => {
        console.log(`\n${index + 1}. ID: ${task.id}`);
        console.log(`   School ID: ${task.school_id}`);
        console.log(`   Title: ${task.title}`);
        console.log(`   Description: ${task.description?.substring(0, 100)}...`);
      });
    }
    
    console.log('\n✅ Pembersihan selesai!');
    console.log('\n📝 LANGKAH SELANJUTNYA:');
    console.log('1. Test input data tugas tambahan baru');
    console.log('2. Verifikasi data tersimpan dengan benar');
    console.log('3. Cek tampilan di aplikasi');
    
  } catch (error) {
    console.error('❌ Error dalam pembersihan:', error);
  }
}

// Jalankan pembersihan
bersihkanDataDummy();