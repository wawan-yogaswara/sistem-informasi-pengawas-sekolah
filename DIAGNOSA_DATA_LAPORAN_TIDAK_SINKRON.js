// DIAGNOSA: Data laporan tidak sama dengan input di halaman tugas harian, supervisi, dan tugas tambahan
// Problem: Reports page shows different data than what was input in other pages

console.log('🔍 DIAGNOSA DATA LAPORAN TIDAK SINKRON');
console.log('=====================================');

// POTENTIAL ISSUES IDENTIFIED:

console.log('1. 📋 FIELD MAPPING ISSUES:');
console.log('   - Tasks table: uses "photo" and "photo2" columns');
console.log('   - Reports page was mapping "photo1" (incorrect) instead of "photo" (correct)');
console.log('   - FIXED: Changed photo1: task.photo1 → photo1: task.photo');

console.log('\n2. 🔍 API ENDPOINT INCONSISTENCIES:');
console.log('   - Tasks API: /api/tasks-daily.js');
console.log('   - Supervisions API: /api/supervisions.js');
console.log('   - Additional Tasks API: /api/activities.js');
console.log('   - Each API might have different field names or data structures');

console.log('\n3. 🗄️ DATABASE SCHEMA MISMATCHES:');
console.log('   - Tasks table: title, description, date, photo, photo2, user_id');
console.log('   - Supervisions table: school_name, findings, recommendations, photo, photo2');
console.log('   - Additional_tasks table: title, description, date, photo, photo2, location');

console.log('\n4. 👤 USER ID CONSISTENCY:');
console.log('   - Wawan user ID: 421cdb28-f2af-4f1f-aa5f-c59a3d661a2e');
console.log('   - All APIs must use the same user_id for filtering');
console.log('   - Reports page must pass correct user_id to all API calls');

console.log('\n5. 📅 DATE FORMAT ISSUES:');
console.log('   - Input pages might save dates in different formats');
console.log('   - Reports page might not parse dates correctly');
console.log('   - ISO format vs local date format inconsistencies');

console.log('\n6. 🔄 CACHING ISSUES:');
console.log('   - Reports page might be using cached data');
console.log('   - localStorage cache might be outdated');
console.log('   - React Query cache might not be invalidated after new inputs');

console.log('\n🎯 RECOMMENDED FIXES:');
console.log('=====================================');

console.log('1. ✅ ALREADY FIXED: Photo field mapping in reports.tsx');

console.log('\n2. 🔧 VERIFY API RESPONSES:');
console.log('   - Test each API endpoint manually');
console.log('   - Check if data is being saved correctly');
console.log('   - Verify user_id filtering works');

console.log('\n3. 🗄️ STANDARDIZE FIELD NAMES:');
console.log('   - Ensure all tables use consistent column names');
console.log('   - Update API responses to match expected field names');

console.log('\n4. 🔄 CLEAR CACHE:');
console.log('   - Clear localStorage cache');
console.log('   - Force refresh reports data');
console.log('   - Invalidate React Query cache');

console.log('\n5. 📊 ADD DEBUG LOGGING:');
console.log('   - Log API responses in reports page');
console.log('   - Compare input data vs reports data');
console.log('   - Track data flow from input to display');

// IMMEDIATE TEST SCRIPT
console.log('\n🧪 IMMEDIATE TEST STEPS:');
console.log('========================');
console.log('1. Open browser console on Reports page');
console.log('2. Check network tab for API calls');
console.log('3. Verify API responses contain expected data');
console.log('4. Compare with data from input pages');
console.log('5. Check if user_id is consistent across all calls');

// CONSOLE COMMANDS FOR TESTING
console.log('\n💻 CONSOLE COMMANDS TO TEST:');
console.log('============================');
console.log('// Test Tasks API');
console.log('fetch("/api/tasks-daily?user_id=421cdb28-f2af-4f1f-aa5f-c59a3d661a2e").then(r=>r.json()).then(console.log)');

console.log('\n// Test Supervisions API');
console.log('fetch("/api/supervisions?user_id=421cdb28-f2af-4f1f-aa5f-c59a3d661a2e").then(r=>r.json()).then(console.log)');

console.log('\n// Test Additional Tasks API');
console.log('fetch("/api/activities?user_id=421cdb28-f2af-4f1f-aa5f-c59a3d661a2e").then(r=>r.json()).then(console.log)');

console.log('\n// Clear localStorage cache');
console.log('localStorage.removeItem("reports_activities_cache")');

console.log('\n// Force refresh reports data');
console.log('window.dispatchEvent(new CustomEvent("updateReportsData", { detail: { activities: [] } }))');