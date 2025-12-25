// FIX: Photo mapping issue in reports page
// Problem: Only 1 photo shows instead of 2 in reports page
// Root Cause: Incorrect field mapping from database schema

console.log('🔧 FIXING PHOTO MAPPING ISSUE IN REPORTS PAGE');

// The issue was in client/src/pages/reports.tsx
// Database schema has columns: 'photo' and 'photo2'
// But the code was trying to map: 'photo1' and 'photo2'

// FIXED MAPPING:
// Before: photo1: task.photo1  ❌ (field doesn't exist)
// After:  photo1: task.photo   ✅ (correct field name)

// Before: photo1: supervision.photo1  ❌ (field doesn't exist)  
// After:  photo1: supervision.photo   ✅ (correct field name)

console.log('✅ Fixed photo mapping in reports.tsx:');
console.log('   - Tasks: photo1 now maps to task.photo');
console.log('   - Supervisions: photo1 now maps to supervision.photo');
console.log('   - Additional tasks: already correct (uses fallback logic)');

console.log('🎯 Expected Result: Both photos should now display in reports page');
console.log('📋 Test: Go to Reports page and check if 2 photos show for activities that have them');