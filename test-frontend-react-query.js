// 🔍 TEST FRONTEND REACT QUERY ISSUES
// Script untuk menguji masalah React Query dan rendering

console.log('🔍 TESTING FRONTEND REACT QUERY ISSUES');
console.log('=====================================');

// Test 1: Cek apakah server berjalan
console.log('1️⃣ Testing server connection...');

fetch('http://localhost:5173/')
  .then(response => {
    console.log('✅ Frontend server accessible:', response.status);
    return response.text();
  })
  .then(html => {
    if (html.includes('React')) {
      console.log('✅ React app loaded');
    } else {
      console.log('❌ React app not loaded properly');
    }
  })
  .catch(error => {
    console.error('❌ Frontend server error:', error.message);
  });

// Test 2: Cek Supabase connection dari Node.js
console.log('2️⃣ Testing Supabase connection from Node...');

const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'https://glhaliktsrcvnznbgxqt.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdsaGFsaWt0c3Jjdm56bmJneHF0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjYzNjYyMjQsImV4cCI6MjA4MTk0MjIyNH0._kaFo2h7rCdouJp2rpb1lmEvlR6gAc0c3AnRjM_PhP4';

const supabase = createClient(supabaseUrl, supabaseKey);

// Test tasks query
supabase
  .from('tasks')
  .select(`
    *,
    schools (
      id,
      name
    )
  `)
  .order('created_at', { ascending: false })
  .then(result => {
    console.log('📊 Tasks query from Node.js:', {
      error: result.error,
      count: result.data?.length || 0,
      sample: result.data?.[0] || null
    });
  })
  .catch(error => {
    console.error('❌ Tasks query error:', error);
  });

// Test schools query
supabase
  .from('schools')
  .select('id, name')
  .order('name', { ascending: true })
  .then(result => {
    console.log('🏫 Schools query from Node.js:', {
      error: result.error,
      count: result.data?.length || 0,
      sample: result.data?.[0] || null
    });
  })
  .catch(error => {
    console.error('❌ Schools query error:', error);
  });

console.log('');
console.log('📋 DEBUGGING STEPS:');
console.log('1. Jalankan: npm run dev');
console.log('2. Buka http://localhost:5173/tasks');
console.log('3. Buka DevTools (F12)');
console.log('4. Paste script debug-frontend-tasks.js ke Console');
console.log('5. Lihat Network tab untuk request details');
console.log('6. Cek apakah ada error di Console tab');