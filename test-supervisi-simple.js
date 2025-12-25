// TEST SUPERVISI SIMPLE - AMAN
// Copy paste SATU PER SATU ke console

console.log('🧪 TEST SUPERVISI SIMPLE');

// Step 1: Cek Supabase
console.log('Supabase tersedia:', typeof supabase !== 'undefined');

// Step 2: Test schema (JALANKAN INI DULU)
supabase.from('supervisions').select('*').limit(1).then(result => {
  if (result.error) {
    console.error('❌ Schema error:', result.error.message);
    if (result.error.message.includes('school')) {
      console.log('🚨 MASALAH: Kolom "school" tidak ada!');
      console.log('📋 SOLUSI: Buka file CARA_FIX_SUPERVISI_STEP_BY_STEP.md');
    }
  } else {
    console.log('✅ Schema OK! Data:', result.data);
  }
});

// Step 3: Cek tombol UI (JALANKAN SETELAH STEP 2)
setTimeout(() => {
  const addBtn = document.querySelector('[data-testid="button-add-supervision"]');
  console.log('Tombol Tambah:', addBtn ? 'ADA ✅' : 'TIDAK ADA ❌');
}, 1000);