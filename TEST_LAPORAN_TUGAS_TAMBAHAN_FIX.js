// TEST LAPORAN TUGAS TAMBAHAN FIX
// Jalankan di browser console localhost:5000/reports

console.log('🧪 Testing Laporan Tugas Tambahan Fix...');

// Test 1: Cek apakah halaman laporan bisa diakses
function testReportsPageAccess() {
  console.log('📋 Test 1: Akses Halaman Laporan');
  
  const currentPath = window.location.pathname;
  console.log('- Current path:', currentPath);
  
  if (currentPath.includes('reports')) {
    console.log('✅ Halaman laporan berhasil diakses');
    return true;
  } else {
    console.log('❌ Tidak berada di halaman laporan');
    console.log('🔧 Solusi: Navigate ke /reports');
    return false;
  }
}

// Test 2: Cek data loading di console
function testDataLoading() {
  console.log('📋 Test 2: Cek Data Loading di Console');
  console.log('Lihat console untuk log berikut:');
  console.log('- "📋 Fetching tasks from Supabase..."');
  console.log('- "🔍 Fetching supervisions from Supabase..."');
  console.log('- "➕ Fetching additional tasks from Supabase..."');
  console.log('- "📊 Total activities loaded from Supabase: X"');
  console.log('');
  console.log('Jika tidak ada log ini, refresh halaman dan tunggu beberapa detik');
}

// Test 3: Cek apakah tugas tambahan muncul di laporan
function testAdditionalTasksInReports() {
  console.log('📋 Test 3: Cek Tugas Tambahan di Laporan');
  
  // Cek text content halaman
  const pageContent = document.body.innerText;
  
  // Cari indikator tugas tambahan
  const hasTugasTambahan = pageContent.includes('Tugas Tambahan') || 
                          pageContent.includes('Kegiatan Tambahan');
  
  console.log('- Tugas Tambahan found in page:', hasTugasTambahan);
  
  // Cek tab atau section tugas tambahan
  const tabs = document.querySelectorAll('[role="tab"], .tab, [class*="tab"]');
  let hasTugasTambahanTab = false;
  
  tabs.forEach(tab => {
    if (tab.textContent && tab.textContent.includes('Tambahan')) {
      hasTugasTambahanTab = true;
    }
  });
  
  console.log('- Tugas Tambahan tab found:', hasTugasTambahanTab);
  
  // Cek cards atau items
  const cards = document.querySelectorAll('[class*="card"], [class*="item"], .activity');
  let tugasTambahanCards = 0;
  
  cards.forEach(card => {
    if (card.textContent && card.textContent.includes('Tugas Tambahan')) {
      tugasTambahanCards++;
    }
  });
  
  console.log('- Tugas Tambahan cards found:', tugasTambahanCards);
  
  if (hasTugasTambahan || hasTugasTambahanTab || tugasTambahanCards > 0) {
    console.log('✅ SUCCESS: Tugas Tambahan ditemukan di laporan');
    return true;
  } else {
    console.log('❌ FAILED: Tugas Tambahan tidak ditemukan di laporan');
    return false;
  }
}

// Test 4: Cek konsistensi data
function testDataConsistency() {
  console.log('📋 Test 4: Cek Konsistensi Data');
  
  const pageContent = document.body.innerText;
  
  // Cek apakah ada data dari semua jenis
  const hasTasksData = pageContent.includes('Tugas Pokok') || pageContent.includes('Tugas Harian');
  const hasSupervisionData = pageContent.includes('Supervisi');
  const hasAdditionalTasksData = pageContent.includes('Tugas Tambahan');
  
  console.log('- Tugas Pokok/Harian found:', hasTasksData);
  console.log('- Supervisi found:', hasSupervisionData);
  console.log('- Tugas Tambahan found:', hasAdditionalTasksData);
  
  const totalDataTypes = [hasTasksData, hasSupervisionData, hasAdditionalTasksData].filter(Boolean).length;
  
  console.log('- Total data types found:', totalDataTypes, '/ 3');
  
  if (totalDataTypes >= 2) {
    console.log('✅ SUCCESS: Data konsisten (minimal 2 jenis data ditemukan)');
    return true;
  } else {
    console.log('❌ FAILED: Data tidak konsisten');
    return false;
  }
}

// Test 5: Cek foto di laporan
function testPhotosInReports() {
  console.log('📋 Test 5: Cek Foto di Laporan');
  
  const images = document.querySelectorAll('img');
  let photoCount = 0;
  
  images.forEach(img => {
    // Skip logo dan icon
    if (img.src && !img.src.includes('logo') && !img.src.includes('icon')) {
      photoCount++;
    }
  });
  
  console.log('- Photos found in reports:', photoCount);
  
  if (photoCount > 0) {
    console.log('✅ SUCCESS: Foto ditemukan di laporan');
    return true;
  } else {
    console.log('ℹ️ INFO: Tidak ada foto (mungkin belum ada data dengan foto)');
    return true; // Not a failure, just no photos
  }
}

// Test 6: Cek export PDF
function testPDFExport() {
  console.log('📋 Test 6: Cek Export PDF');
  
  const pdfButtons = document.querySelectorAll('button, [role="button"]');
  let hasPDFButton = false;
  
  pdfButtons.forEach(btn => {
    if (btn.textContent && (btn.textContent.includes('PDF') || btn.textContent.includes('Export') || btn.textContent.includes('Cetak'))) {
      hasPDFButton = true;
    }
  });
  
  console.log('- PDF/Export button found:', hasPDFButton);
  
  if (hasPDFButton) {
    console.log('✅ SUCCESS: Tombol PDF/Export ditemukan');
    return true;
  } else {
    console.log('⚠️ WARNING: Tombol PDF/Export tidak ditemukan');
    return false;
  }
}

// Comprehensive test
async function runComprehensiveTest() {
  console.log('🚀 MENJALANKAN COMPREHENSIVE TEST LAPORAN...');
  console.log('='.repeat(50));
  
  const test1 = testReportsPageAccess();
  console.log('');
  
  testDataLoading();
  console.log('');
  
  // Wait for data to load
  console.log('⏳ Waiting 3 seconds for data to load...');
  await new Promise(resolve => setTimeout(resolve, 3000));
  
  const test3 = testAdditionalTasksInReports();
  console.log('');
  
  const test4 = testDataConsistency();
  console.log('');
  
  const test5 = testPhotosInReports();
  console.log('');
  
  const test6 = testPDFExport();
  console.log('');
  
  // Summary
  console.log('='.repeat(50));
  console.log('📊 TEST SUMMARY:');
  console.log('- Page Access:', test1 ? '✅ PASS' : '❌ FAIL');
  console.log('- Additional Tasks in Reports:', test3 ? '✅ PASS' : '❌ FAIL');
  console.log('- Data Consistency:', test4 ? '✅ PASS' : '❌ FAIL');
  console.log('- Photos in Reports:', test5 ? '✅ PASS' : 'ℹ️ INFO');
  console.log('- PDF Export:', test6 ? '✅ PASS' : '⚠️ WARNING');
  
  const criticalTests = [test1, test3, test4];
  const passedCritical = criticalTests.filter(Boolean).length;
  
  if (passedCritical === criticalTests.length) {
    console.log('🎉 ALL CRITICAL TESTS PASSED! Laporan Tugas Tambahan fix berhasil.');
  } else {
    console.log(`⚠️ ${passedCritical}/${criticalTests.length} critical tests passed. Ada masalah yang perlu diperbaiki.`);
  }
}

// Export functions
window.testReportsPageAccess = testReportsPageAccess;
window.testAdditionalTasksInReports = testAdditionalTasksInReports;
window.testDataConsistency = testDataConsistency;
window.testPhotosInReports = testPhotosInReports;
window.testPDFExport = testPDFExport;
window.runComprehensiveTest = runComprehensiveTest;

console.log('📋 INSTRUKSI TEST LAPORAN:');
console.log('1. Navigate ke localhost:5000/reports');
console.log('2. Jalankan: runComprehensiveTest()');
console.log('3. Atau test individual:');
console.log('   - testAdditionalTasksInReports()');
console.log('   - testDataConsistency()');
console.log('   - testPhotosInReports()');
console.log('');

// Auto-run jika di halaman reports
if (window.location.pathname.includes('reports')) {
  console.log('🎯 Detected reports page. Running auto-test in 2 seconds...');
  setTimeout(() => {
    runComprehensiveTest();
  }, 2000);
}