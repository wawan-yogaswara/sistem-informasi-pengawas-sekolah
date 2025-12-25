// Verify frontend fix - check if additional-tasks.tsx uses API correctly
const fs = require('fs');
const path = require('path');

function verifyFrontendFix() {
  console.log('🔍 VERIFYING FRONTEND API INTEGRATION');
  console.log('='.repeat(50));
  
  try {
    const filePath = path.join(__dirname, 'client/src/pages/additional-tasks.tsx');
    const content = fs.readFileSync(filePath, 'utf8');
    
    // Check for API import
    const hasApiImport = content.includes('import { additionalTasksApi } from "@/lib/api"');
    console.log('1. API Import:', hasApiImport ? '✅ FOUND' : '❌ MISSING');
    
    // Check for API usage in query
    const hasApiQuery = content.includes('await additionalTasksApi.getAll()');
    console.log('2. API Query:', hasApiQuery ? '✅ FOUND' : '❌ MISSING');
    
    // Check for API create
    const hasApiCreate = content.includes('await additionalTasksApi.create(');
    console.log('3. API Create:', hasApiCreate ? '✅ FOUND' : '❌ MISSING');
    
    // Check for API delete
    const hasApiDelete = content.includes('await additionalTasksApi.delete(');
    console.log('4. API Delete:', hasApiDelete ? '✅ FOUND' : '❌ MISSING');
    
    // Check if localStorage is still primary (should be fallback only)
    const localStorageUsage = (content.match(/localStorage\.getItem/g) || []).length;
    const localStorageSet = (content.match(/localStorage\.setItem/g) || []).length;
    
    console.log('5. localStorage Usage:');
    console.log('   - getItem calls:', localStorageUsage);
    console.log('   - setItem calls:', localStorageSet);
    
    if (localStorageSet > 2) {
      console.log('   ⚠️ WARNING: Still using localStorage for primary storage');
    } else {
      console.log('   ✅ localStorage used only for fallback');
    }
    
    // Check for async/await pattern
    const hasAsyncHandlers = content.includes('const handleAddTask = async ()') && 
                             content.includes('const handleDeleteTask = async (');
    console.log('6. Async Handlers:', hasAsyncHandlers ? '✅ FOUND' : '❌ MISSING');
    
    console.log('\n📋 SUMMARY:');
    console.log('='.repeat(50));
    
    const checks = [hasApiImport, hasApiQuery, hasApiCreate, hasApiDelete, hasAsyncHandlers];
    const passed = checks.filter(Boolean).length;
    const total = checks.length;
    
    console.log(`✅ Passed: ${passed}/${total} checks`);
    
    if (passed === total) {
      console.log('🎉 FRONTEND FIX: COMPLETE');
      console.log('Frontend sekarang menggunakan Supabase API');
      console.log('');
      console.log('🚀 NEXT STEPS:');
      console.log('1. Deploy ke Netlify');
      console.log('2. Test input data manual');
      console.log('3. Verifikasi data masuk ke Supabase');
    } else {
      console.log('⚠️ FRONTEND FIX: INCOMPLETE');
      console.log('Masih ada yang perlu diperbaiki');
    }
    
  } catch (error) {
    console.error('❌ Error reading file:', error.message);
  }
}

// Test current Supabase data
async function testCurrentData() {
  console.log('\n🧪 TESTING CURRENT SUPABASE DATA');
  console.log('='.repeat(50));
  
  const supabaseUrl = 'https://glhaliktsrcvnznbgxqt.supabase.co';
  const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdsaGFsaWt0c3Jjdm56bmJneHF0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjYzNjYyMjQsImV4cCI6MjA4MTk0MjIyNH0._kaFo2h7rCdouJp2rpb1lmEvlR6gAc0c3AnRjM_PhP4';
  
  try {
    const response = await fetch(`${supabaseUrl}/rest/v1/additional_tasks?select=*&order=created_at.desc&limit=5`, {
      headers: {
        'apikey': supabaseKey,
        'Authorization': `Bearer ${supabaseKey}`
      }
    });
    
    if (response.ok) {
      const tasks = await response.json();
      console.log('✅ Current data in Supabase:');
      console.log(`📊 Total: ${tasks.length} tasks`);
      
      tasks.forEach((task, index) => {
        const name = task.name || task.title || 'No name';
        const location = task.location || 'No location';
        const date = task.date || 'No date';
        console.log(`${index + 1}. ${name} - ${location} (${date})`);
      });
      
    } else {
      console.log('❌ Failed to fetch data:', response.status);
    }
    
  } catch (error) {
    console.log('❌ Error:', error.message);
  }
}

// Run verification
verifyFrontendFix();
testCurrentData();