// CEK STRUKTUR FOTO ADDITIONAL TASKS DI SUPABASE
// Copy paste ke browser console dan jalankan

const cekStrukturFotoAdditionalTasks = async () => {
  console.log('🔍 CEK STRUKTUR FOTO ADDITIONAL TASKS...');
  
  try {
    // Import Supabase client
    const { createClient } = await import('@supabase/supabase-js');
    const supabaseUrl = 'https://fmxeboullgcewzjpql.supabase.co';
    const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZteGVib3VsbGdjZXd6anBxbCIsInJvbGUiOiJhbm9uIiwiaWF0IjoxNzM0NTk5NzI4LCJleHAiOjIwNTAxNzU3Mjh9.Ej8Ej8Ej8Ej8Ej8Ej8Ej8Ej8Ej8Ej8Ej8Ej8Ej8';
    const supabase = createClient(supabaseUrl, supabaseKey);
    
    // 1. Ambil satu record untuk melihat struktur
    const { data: sampleData, error: sampleError } = await supabase
      .from('additional_tasks')
      .select('*')
      .limit(1);
    
    if (sampleError) {
      console.error('❌ Error getting sample data:', sampleError);
      return;
    }
    
    if (sampleData && sampleData.length > 0) {
      console.log('📋 Sample additional_tasks record structure:');
      console.log('🔑 Available fields:', Object.keys(sampleData[0]));
      console.log('📸 Photo-related fields:');
      
      const photoFields = Object.keys(sampleData[0]).filter(key => 
        key.toLowerCase().includes('photo') || key.toLowerCase().includes('image')
      );
      
      console.log('📸 Photo fields found:', photoFields);
      
      // Show sample values for photo fields
      photoFields.forEach(field => {
        const value = sampleData[0][field];
        console.log(`📸 ${field}:`, value ? (value.startsWith('data:') ? 'base64 data' : value) : 'NULL');
      });
    }
    
    // 2. Cek semua data untuk user wawan
    const userId = '421cdb28-f2af-4f1f-aa5f-c59a3d661a2e';
    
    const { data: allData, error: allError } = await supabase
      .from('additional_tasks')
      .select('*')
      .eq('user_id', userId);
    
    if (allError) {
      console.error('❌ Error getting all data:', allError);
      return;
    }
    
    console.log(`\n📊 Total additional_tasks for user: ${allData.length}`);
    
    // 3. Analisis foto untuk setiap record
    let recordsWithPhoto = 0;
    let recordsWithPhoto1 = 0;
    let recordsWithPhoto2 = 0;
    let recordsWithPhotoField = 0;
    
    allData.forEach((record, index) => {
      const hasPhoto = !!record.photo;
      const hasPhoto1 = !!record.photo1;
      const hasPhoto2 = !!record.photo2;
      
      if (hasPhoto) recordsWithPhotoField++;
      if (hasPhoto1) recordsWithPhoto1++;
      if (hasPhoto2) recordsWithPhoto2++;
      if (hasPhoto || hasPhoto1 || hasPhoto2) recordsWithPhoto++;
      
      // Log records yang mengandung "apel" atau "monitoring"
      const name = record.name || record.title || '';
      if (name.toLowerCase().includes('apel') || name.toLowerCase().includes('monitoring')) {
        console.log(`\n📸 Record ${index + 1}: ${name}`);
        console.log('📅 Date:', record.date);
        console.log('📸 photo:', record.photo ? (record.photo.startsWith('data:') ? 'base64 data' : record.photo) : 'NULL');
        console.log('📸 photo1:', record.photo1 ? (record.photo1.startsWith('data:') ? 'base64 data' : record.photo1) : 'NULL');
        console.log('📸 photo2:', record.photo2 ? (record.photo2.startsWith('data:') ? 'base64 data' : record.photo2) : 'NULL');
        console.log('🔑 All fields:', Object.keys(record));
      }
    });
    
    console.log('\n📊 STATISTIK FOTO:');
    console.log(`📸 Records with any photo: ${recordsWithPhoto}/${allData.length}`);
    console.log(`📸 Records with 'photo' field: ${recordsWithPhotoField}/${allData.length}`);
    console.log(`📸 Records with 'photo1' field: ${recordsWithPhoto1}/${allData.length}`);
    console.log(`📸 Records with 'photo2' field: ${recordsWithPhoto2}/${allData.length}`);
    
    // 4. Cek apakah ada masalah dengan field mapping
    console.log('\n🔍 ANALISIS FIELD MAPPING:');
    console.log('📋 Reports.tsx menggunakan mapping:');
    console.log('   photo1: task.photo || task.photo1');
    console.log('   photo2: task.photo2');
    
    const problemRecords = allData.filter(record => {
      const name = record.name || record.title || '';
      return (name.toLowerCase().includes('apel') || name.toLowerCase().includes('monitoring')) && 
             (!record.photo && !record.photo1 && !record.photo2);
    });
    
    console.log(`❌ Records without photos: ${problemRecords.length}`);
    problemRecords.forEach(record => {
      console.log(`❌ ${record.name || record.title} - No photos found`);
    });
    
    console.log('\n✅ ANALISIS SELESAI');
    
  } catch (error) {
    console.error('❌ Error during analysis:', error);
  }
};

// Jalankan analisis
cekStrukturFotoAdditionalTasks();