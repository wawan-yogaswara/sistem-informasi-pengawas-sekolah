#!/usr/bin/env node

/**
 * 🔍 CEK SUPERVISI WAWAN DETAIL
 * Script untuk melihat semua data supervisi di Supabase
 */

import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config();

const supabaseUrl = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_ANON_KEY || process.env.VITE_SUPABASE_ANON_KEY;

const supabase = createClient(supabaseUrl, supabaseKey);

async function cekSupervisiWawanDetail() {
  console.log('🔍 CEK SUPERVISI WAWAN DETAIL');
  console.log('============================');
  
  try {
    // 1. Cek semua data supervisi (tanpa filter user_id dulu)
    console.log('1. 📋 Checking ALL supervisions in database...');
    const { data: allSupervisions, error: allError } = await supabase
      .from('supervisions')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (allError) {
      console.log('❌ Error fetching all supervisions:', allError.message);
      return;
    }
    
    console.log(`✅ Found ${allSupervisions?.length || 0} total supervisions:`);
    allSupervisions?.forEach((supervision, index) => {
      console.log(`   ${index + 1}. ID: ${supervision.id}`);
      console.log(`      User ID: ${supervision.user_id}`);
      console.log(`      School ID: ${supervision.school_id || 'N/A'}`);
      console.log(`      Date: ${supervision.date || supervision.created_at}`);
      console.log(`      Created: ${new Date(supervision.created_at).toLocaleString()}`);
      console.log(`      Photos: ${supervision.photo1 ? 'Yes' : 'No'} / ${supervision.photo2 ? 'Yes' : 'No'}`);
      console.log('');
    });
    
    // 2. Cek user_id yang ada di supervisions
    const uniqueUserIds = [...new Set(allSupervisions?.map(s => s.user_id) || [])];
    console.log('2. 👥 Unique user_ids in supervisions:');
    uniqueUserIds.forEach((userId, index) => {
      const count = allSupervisions?.filter(s => s.user_id === userId).length || 0;
      console.log(`   ${index + 1}. ${userId} (${count} supervisions)`);
    });
    
    // 3. Cek apakah ada supervisi dengan user_id Wawan yang benar
    const wawanUserId = '421cdb28-f2af-4f1f-aa5f-c59a3d661a2e';
    console.log(`\n3. 🎯 Checking supervisions for Wawan user_id: ${wawanUserId}`);
    
    const wawanSupervisions = allSupervisions?.filter(s => s.user_id === wawanUserId) || [];
    console.log(`✅ Found ${wawanSupervisions.length} supervisions for Wawan`);
    
    // 4. Cek dengan user_id alternatif
    const alternativeUserIds = ['1762696525337', 'wawan', '2', '3'];
    
    for (const altUserId of alternativeUserIds) {
      const altSupervisions = allSupervisions?.filter(s => s.user_id === altUserId) || [];
      if (altSupervisions.length > 0) {
        console.log(`\n🔍 Found ${altSupervisions.length} supervisions with user_id: ${altUserId}`);
        altSupervisions.forEach((supervision, index) => {
          console.log(`   ${index + 1}. ID: ${supervision.id}, Date: ${supervision.date || supervision.created_at}`);
        });
      }
    }
    
    // 5. Generate updated fix script
    const totalSupervisions = allSupervisions?.length || 0;
    if (totalSupervisions > 0) {
      console.log('\n🔧 UPDATED FIX SCRIPT FOR FRONTEND:');
      console.log('=' .repeat(50));
      
      const fixScript = `
// 🔧 UPDATED FIX SCRIPT - COPY PASTE KE CONSOLE BROWSER DI HALAMAN LAPORAN

console.log('🔧 FIXING WAWAN DATA WITH SUPERVISIONS...');

// 1. Update user data di localStorage
const currentUser = localStorage.getItem('auth_user');
if (currentUser) {
  const userData = JSON.parse(currentUser);
  console.log('Current user data:', userData);
  
  if (userData.username === 'wawan') {
    userData.id = '421cdb28-f2af-4f1f-aa5f-c59a3d661a2e';
    localStorage.setItem('auth_user', JSON.stringify(userData));
    console.log('✅ Updated Wawan user_id to:', userData.id);
  }
}

// 2. Test load supervisions directly
async function testLoadSupervisions() {
  try {
    const response = await fetch('/api/supervisions');
    if (response.ok) {
      const data = await response.json();
      console.log('📋 All supervisions from API:', data.length);
      
      // Filter for Wawan
      const wawanSupervisions = data.filter(s => s.user_id === '421cdb28-f2af-4f1f-aa5f-c59a3d661a2e');
      console.log('🎯 Wawan supervisions:', wawanSupervisions.length);
      
      if (wawanSupervisions.length === 0) {
        console.log('⚠️ No supervisions found for Wawan, checking all user_ids...');
        const uniqueUserIds = [...new Set(data.map(s => s.user_id))];
        uniqueUserIds.forEach(userId => {
          const count = data.filter(s => s.user_id === userId).length;
          console.log(\`   User ID \${userId}: \${count} supervisions\`);
        });
      }
    }
  } catch (error) {
    console.error('Error loading supervisions:', error);
  }
}

testLoadSupervisions();

// 3. Force refresh after 3 seconds
setTimeout(() => {
  console.log('🔄 Refreshing page...');
  location.reload();
}, 3000);
`;
      
      console.log(fixScript);
      console.log('=' .repeat(50));
    }
    
    // 6. Summary
    console.log('\n📊 SUMMARY:');
    console.log(`- Total supervisions in database: ${totalSupervisions}`);
    console.log(`- Supervisions for Wawan (correct user_id): ${wawanSupervisions.length}`);
    console.log(`- Unique user_ids in supervisions: ${uniqueUserIds.length}`);
    
    if (totalSupervisions > 0 && wawanSupervisions.length === 0) {
      console.log('\n⚠️ WARNING: Supervisions exist but none for Wawan user_id');
      console.log('💡 SOLUTION: Check if supervisions have different user_id');
      console.log('   - Update supervisions user_id to match Wawan');
      console.log('   - Or update Wawan user_id to match supervisions');
    }
    
  } catch (error) {
    console.error('❌ Error:', error.message);
  }
}

cekSupervisiWawanDetail();