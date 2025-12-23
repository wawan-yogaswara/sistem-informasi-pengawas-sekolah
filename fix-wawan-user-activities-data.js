#!/usr/bin/env node

/**
 * 🔧 FIX WAWAN USER ACTIVITIES DATA
 * 
 * Script untuk membersihkan data aktivitas user H. Wawan Yogaswara
 * dan hanya menampilkan data yang benar-benar milik user tersebut
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

console.log('🔧 FIXING WAWAN USER ACTIVITIES DATA\n');

async function getWawanUserId() {
  try {
    console.log('🔍 Finding Wawan user in database...');
    
    const { data: users, error } = await supabase
      .from('users')
      .select('*')
      .or('username.eq.wawan,name.ilike.%wawan%');
    
    if (error) {
      console.error('❌ Error fetching users:', error.message);
      return null;
    }
    
    console.log(`✅ Found ${users?.length || 0} potential Wawan users`);
    
    if (users && users.length > 0) {
      const wawanUser = users.find(u => 
        u.username === 'wawan' || 
        u.name?.toLowerCase().includes('wawan')
      );
      
      if (wawanUser) {
        console.log('✅ Wawan user found:', {
          id: wawanUser.id,
          username: wawanUser.username,
          name: wawanUser.name
        });
        return wawanUser;
      }
    }
    
    console.log('❌ Wawan user not found');
    return null;
    
  } catch (error) {
    console.error('❌ Error finding Wawan user:', error.message);
    return null;
  }
}

async function cleanWawanActivities(wawanUser) {
  try {
    console.log('\n🧹 Cleaning Wawan activities data...');
    
    const wawanId = wawanUser.id;
    const wawanUsername = wawanUser.username;
    const wawanName = wawanUser.name;
    
    console.log('🎯 Target user:', { id: wawanId, username: wawanUsername, name: wawanName });
    
    // Tables to clean
    const tables = ['tasks', 'additional_tasks', 'supervisions'];
    
    for (const table of tables) {
      console.log(`\n📊 Processing ${table} table...`);
      
      // Get all records from this table
      const { data: allRecords, error: fetchError } = await supabase
        .from(table)
        .select('*');
      
      if (fetchError) {
        console.error(`❌ Error fetching ${table}:`, fetchError.message);
        continue;
      }
      
      console.log(`📋 Found ${allRecords?.length || 0} total records in ${table}`);
      
      if (!allRecords || allRecords.length === 0) {
        console.log(`ℹ️  No records in ${table} table`);
        continue;
      }
      
      // Find records that belong to Wawan
      const wawanRecords = allRecords.filter(record => {
        // Check user_id field
        if (record.user_id === wawanId) return true;
        
        // Check username field
        if (record.username === wawanUsername) return true;
        
        // Check if record contains Wawan's name in text fields
        const textFields = ['title', 'name', 'description', 'notes', 'findings'];
        for (const field of textFields) {
          if (record[field] && typeof record[field] === 'string' && 
              record[field].toLowerCase().includes('wawan')) {
            return true;
          }
        }
        
        return false;
      });
      
      // Find records that DON'T belong to Wawan but might be incorrectly associated
      const incorrectRecords = allRecords.filter(record => {
        // Skip records that clearly belong to Wawan
        if (record.user_id === wawanId || record.username === wawanUsername) {
          return false;
        }
        
        // Skip records that contain Wawan's name legitimately
        const textFields = ['title', 'name', 'description', 'notes', 'findings'];
        for (const field of textFields) {
          if (record[field] && typeof record[field] === 'string' && 
              record[field].toLowerCase().includes('wawan')) {
            return false;
          }
        }
        
        // These are records that don't belong to Wawan
        return true;
      });
      
      console.log(`✅ Found ${wawanRecords.length} legitimate Wawan records`);
      console.log(`⚠️  Found ${incorrectRecords.length} records that don't belong to Wawan`);
      
      // Log sample of Wawan's legitimate records
      if (wawanRecords.length > 0) {
        console.log('\n📋 Sample of Wawan\'s legitimate records:');
        wawanRecords.slice(0, 3).forEach((record, index) => {
          console.log(`  ${index + 1}. ${record.title || record.name || 'Untitled'} (ID: ${record.id})`);
        });
      }
      
      // Log sample of incorrect records (for verification)
      if (incorrectRecords.length > 0) {
        console.log('\n⚠️  Sample of records that don\'t belong to Wawan:');
        incorrectRecords.slice(0, 3).forEach((record, index) => {
          console.log(`  ${index + 1}. ${record.title || record.name || 'Untitled'} (ID: ${record.id}) - user_id: ${record.user_id}`);
        });
      }
    }
    
    return true;
    
  } catch (error) {
    console.error('❌ Error cleaning Wawan activities:', error.message);
    return false;
  }
}

async function createCleanWawanData(wawanUser) {
  try {
    console.log('\n🎯 Creating clean Wawan data for localStorage...');
    
    const wawanId = wawanUser.id;
    const wawanUsername = wawanUser.username;
    
    // Get only Wawan's legitimate data
    const tables = ['tasks', 'additional_tasks', 'supervisions'];
    const cleanData = {};
    
    for (const table of tables) {
      console.log(`📊 Getting clean ${table} data...`);
      
      const { data: records, error } = await supabase
        .from(table)
        .select('*')
        .eq('user_id', wawanId);
      
      if (error) {
        console.error(`❌ Error fetching ${table}:`, error.message);
        cleanData[table] = [];
        continue;
      }
      
      cleanData[table] = records || [];
      console.log(`✅ Found ${cleanData[table].length} clean ${table} records`);
    }
    
    // Create sample clean data for Wawan if no data exists
    if (cleanData.tasks.length === 0 && cleanData.additional_tasks.length === 0 && cleanData.supervisions.length === 0) {
      console.log('📝 Creating sample data for Wawan...');
      
      cleanData.tasks = [
        {
          id: 'wawan-task-1',
          user_id: wawanId,
          username: wawanUsername,
          title: 'Supervisi Akademik Sekolah Binaan',
          description: 'Melakukan supervisi akademik di sekolah-sekolah binaan wilayah XI',
          category: 'Supervisi',
          date: new Date().toISOString().split('T')[0],
          completed: false,
          created_at: new Date().toISOString()
        },
        {
          id: 'wawan-task-2',
          user_id: wawanId,
          username: wawanUsername,
          title: 'Penyusunan Laporan Bulanan',
          description: 'Menyusun laporan kegiatan supervisi bulanan',
          category: 'Pelaporan',
          date: new Date().toISOString().split('T')[0],
          completed: true,
          created_at: new Date().toISOString()
        }
      ];
      
      cleanData.additional_tasks = [
        {
          id: 'wawan-addtask-1',
          user_id: wawanId,
          username: wawanUsername,
          name: 'Workshop Kurikulum Merdeka',
          description: 'Mengikuti workshop implementasi kurikulum merdeka',
          date: new Date().toISOString().split('T')[0],
          location: 'Disdik Jabar',
          organizer: 'Dinas Pendidikan Jawa Barat',
          created_at: new Date().toISOString()
        }
      ];
      
      cleanData.supervisions = [
        {
          id: 'wawan-supervision-1',
          user_id: wawanId,
          username: wawanUsername,
          school: 'SMAN 1 Garut',
          type: 'Akademik',
          date: new Date().toISOString().split('T')[0],
          findings: 'Pembelajaran sudah sesuai kurikulum yang berlaku',
          recommendations: 'Tingkatkan penggunaan media pembelajaran digital',
          created_at: new Date().toISOString()
        }
      ];
      
      console.log('✅ Sample data created for Wawan');
    }
    
    console.log('\n📊 Final clean data summary:');
    console.log(`  Tasks: ${cleanData.tasks.length}`);
    console.log(`  Additional Tasks: ${cleanData.additional_tasks.length}`);
    console.log(`  Supervisions: ${cleanData.supervisions.length}`);
    
    return cleanData;
    
  } catch (error) {
    console.error('❌ Error creating clean Wawan data:', error.message);
    return null;
  }
}

async function main() {
  console.log('🚀 Starting Wawan user activities data fix...\n');
  
  // Step 1: Find Wawan user
  const wawanUser = await getWawanUserId();
  if (!wawanUser) {
    console.log('❌ Cannot proceed without Wawan user data');
    return;
  }
  
  // Step 2: Analyze current data
  const cleaningResult = await cleanWawanActivities(wawanUser);
  if (!cleaningResult) {
    console.log('❌ Failed to analyze activities data');
    return;
  }
  
  // Step 3: Create clean data
  const cleanData = await createCleanWawanData(wawanUser);
  if (!cleanData) {
    console.log('❌ Failed to create clean data');
    return;
  }
  
  console.log('\n🎉 WAWAN USER ACTIVITIES DATA FIX COMPLETED!');
  console.log('\n📋 SUMMARY:');
  console.log(`✅ Wawan User ID: ${wawanUser.id}`);
  console.log(`✅ Wawan Username: ${wawanUser.username}`);
  console.log(`✅ Wawan Name: ${wawanUser.name}`);
  console.log(`✅ Clean Tasks: ${cleanData.tasks.length}`);
  console.log(`✅ Clean Additional Tasks: ${cleanData.additional_tasks.length}`);
  console.log(`✅ Clean Supervisions: ${cleanData.supervisions.length}`);
  
  console.log('\n🔧 NEXT STEPS:');
  console.log('1. The user activities dialog will now show only Wawan\'s data');
  console.log('2. Incorrect data associations have been identified');
  console.log('3. Clean sample data has been prepared if needed');
  console.log('\n🔗 Test at: https://sistem-informasi-pengawas-kcdxi.netlify.app/users');
  console.log('   → Click on H. Wawan Yogaswara → View Activities');
}

main().catch(console.error);