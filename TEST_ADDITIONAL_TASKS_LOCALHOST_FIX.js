// TEST ADDITIONAL TASKS LOCALHOST FIX
// Run this in browser console at localhost:5000 to test the fix

console.log('🧪 Testing Additional Tasks Fix in Localhost...');

// Test 1: Check if additional tasks page loads data
async function testAdditionalTasksPage() {
  console.log('📋 Test 1: Additional Tasks Page Data Loading');
  
  try {
    // Navigate to additional tasks page
    if (!window.location.pathname.includes('additional-tasks')) {
      console.log('⚠️ Please navigate to /additional-tasks page first');
      return;
    }
    
    // Wait for data to load
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Check if data is displayed
    const taskCards = document.querySelectorAll('[class*="Card"]');
    const loadingText = document.querySelector('text:contains("Memuat data")');
    const emptyText = document.querySelector('text:contains("Belum ada kegiatan")');
    
    console.log('📊 Results:');
    console.log('- Task cards found:', taskCards.length);
    console.log('- Loading state:', !!loadingText);
    console.log('- Empty state:', !!emptyText);
    
    if (taskCards.length > 0) {
      console.log('✅ SUCCESS: Additional tasks are displaying');
      return true;
    } else if (emptyText) {
      console.log('ℹ️ INFO: No tasks found (empty state)');
      return true;
    } else if (loadingText) {
      console.log('⏳ LOADING: Still loading data...');
      return false;
    } else {
      console.log('❌ FAILED: No data or loading state found');
      return false;
    }
    
  } catch (error) {
    console.error('❌ Test failed:', error);
    return false;
  }
}

// Test 2: Check console for query logs
function testConsoleQueries() {
  console.log('📋 Test 2: Check Console for Query Logs');
  console.log('Look for these logs in console:');
  console.log('- "🔍 Fetching additional tasks from Supabase..."');
  console.log('- "✅ Additional tasks loaded for user: X"');
  console.log('- Should NOT see complex join queries');
  console.log('- Should see simple select(*) queries');
}

// Test 3: Check reports page
async function testReportsPage() {
  console.log('📋 Test 3: Reports Page Additional Tasks');
  
  try {
    // Navigate to reports page
    if (!window.location.pathname.includes('reports')) {
      console.log('⚠️ Please navigate to /reports page to test');
      return;
    }
    
    // Wait for data to load
    await new Promise(resolve => setTimeout(resolve, 3000));
    
    // Check if additional tasks appear in reports
    const reportContent = document.body.innerText;
    const hasAdditionalTasks = reportContent.includes('Tugas Tambahan') || reportContent.includes('Kegiatan Tambahan');
    
    console.log('📊 Results:');
    console.log('- Additional tasks in reports:', hasAdditionalTasks);
    
    if (hasAdditionalTasks) {
      console.log('✅ SUCCESS: Additional tasks appear in reports');
      return true;
    } else {
      console.log('❌ FAILED: Additional tasks not found in reports');
      return false;
    }
    
  } catch (error) {
    console.error('❌ Test failed:', error);
    return false;
  }
}

// Run all tests
async function runAllTests() {
  console.log('🚀 Starting Additional Tasks Fix Tests...');
  console.log('');
  
  // Test console queries first
  testConsoleQueries();
  console.log('');
  
  // Test additional tasks page
  const test1Result = await testAdditionalTasksPage();
  console.log('');
  
  // Test reports page
  const test2Result = await testReportsPage();
  console.log('');
  
  // Summary
  console.log('📊 TEST SUMMARY:');
  console.log('- Additional Tasks Page:', test1Result ? '✅ PASS' : '❌ FAIL');
  console.log('- Reports Page:', test2Result ? '✅ PASS' : '❌ FAIL');
  
  if (test1Result && test2Result) {
    console.log('🎉 ALL TESTS PASSED! Additional tasks fix is working.');
  } else {
    console.log('⚠️ Some tests failed. Check the issues above.');
  }
}

// Instructions
console.log('📋 INSTRUCTIONS:');
console.log('1. Navigate to localhost:5000/additional-tasks');
console.log('2. Run: testAdditionalTasksPage()');
console.log('3. Navigate to localhost:5000/reports');
console.log('4. Run: testReportsPage()');
console.log('5. Or run: runAllTests() to test everything');
console.log('');

// Export functions for manual testing
window.testAdditionalTasksPage = testAdditionalTasksPage;
window.testReportsPage = testReportsPage;
window.runAllTests = runAllTests;