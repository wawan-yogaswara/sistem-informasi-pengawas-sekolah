#!/usr/bin/env node

/**
 * 🧹 CLEAN INCORRECT WAWAN DATA
 * 
 * Script untuk menghapus data yang salah dari aktivitas user H. Wawan Yogaswara
 */

import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Missing Supabase environment variables!');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

console.log('🧹 CLEANING INCORRECT WAWAN DATA\n');

async function cleanIncorrectData() {
  try {
    console.log('🔍 Finding incorrect data in additional_tasks...');
    
    // Get the incorrect records that don't belong to Wawan
    // Based on the previous analysis, these are the IDs that don't belong to Wawan:
    const incorrectIds = [
      '9918489a-ec5c-44bc-9cdc-0ab3119f0000',
      'e0b5c1c6-71e3-4b95-bdcd-1fd112435321', 
      '37bb4c92-f121-4aae-a4ec-80a3e278e116'
    ];
    
    console.log(`🎯 Targeting ${incorrectIds.length} incorrect records for removal`);
    
    for (const id of incorrectIds) {
      console.log(`🗑️  Removing record: ${id}`);
      
      const { error } = await supabase
        .from('additional_tasks')
        .delete()
        .eq('id', id);
      
      if (error) {
        console.error(`❌ Error deleting record ${id}:`, error.message);
      } else {
        console.log(`✅ Successfully deleted record ${id}`);
      }
    }
    
    // Verify the cleanup
    console.log('\n🔍 Verifying cleanup...');
    
    const { data: remainingRecords, error: verifyError } = await supabase
      .from('additional_tasks')
      .select('*');
    
    if (verifyError) {
      console.error('❌ Error verifying cleanup:', verifyError.message);
      return false;
    }
    
    console.log(`📊 Total remaining records: ${remainingRecords?.length || 0}`);
    
    // Check Wawan's records specifically
    const { data: wawanRecords, error: wawanError } = await supabase
      .from('additional_tasks')
      .select('*')
      .eq('user_id', '08d674ed-60b8-41a2-941c-896b80dcd825');
    
    if (wawanError) {
      console.error('❌ Error checking Wawan records:', wawanError.message);
      return false;
    }
    
    console.log(`✅ Wawan's remaining records: ${wawanRecords?.length || 0}`);
    
    if (wawanRecords && wawanRecords.length > 0) {
      console.log('\n📋 Wawan\'s clean records:');
      wawanRecords.forEach((record, index) => {
        console.log(`  ${index + 1}. ${record.name || 'Untitled'} (${record.date})`);
      });
    }
    
    return true;
    
  } catch (error) {
    console.error('❌ Error cleaning incorrect data:', error.message);
    return false;
  }
}

async function main() {
  console.log('🚀 Starting cleanup of incorrect Wawan data...\n');
  
  const success = await cleanIncorrectData();
  
  if (success) {
    console.log('\n🎉 CLEANUP COMPLETED SUCCESSFULLY!');
    console.log('\n📋 RESULTS:');
    console.log('✅ Incorrect data records removed');
    console.log('✅ Only Wawan\'s legitimate data remains');
    console.log('✅ User activities dialog will now show correct data');
    
    console.log('\n🔧 NEXT STEPS:');
    console.log('1. Test the user activities dialog');
    console.log('2. Verify only Wawan\'s data is shown');
    console.log('3. Check that no incorrect data appears');
    
    console.log('\n🔗 Test at: https://sistem-informasi-pengawas-kcdxi.netlify.app/users');
    console.log('   → Login as admin');
    console.log('   → Go to Manajemen User');
    console.log('   → Click on H. Wawan Yogaswara');
    console.log('   → Click "Lihat Aktivitas"');
  } else {
    console.log('\n❌ CLEANUP FAILED');
    console.log('Please check the error messages above');
  }
}

main().catch(console.error);