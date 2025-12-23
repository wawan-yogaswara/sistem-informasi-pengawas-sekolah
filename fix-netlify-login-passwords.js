#!/usr/bin/env node

/**
 * 🔧 FIX NETLIFY LOGIN PASSWORDS
 * 
 * Script untuk memverifikasi dan memperbaiki password user di Supabase
 */

import { createClient } from '@supabase/supabase-js';
import bcrypt from 'bcryptjs';
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

console.log('🔧 FIXING NETLIFY LOGIN PASSWORDS\n');

async function checkAndFixPasswords() {
  try {
    console.log('📊 Checking user passwords...');
    
    // Get all users
    const { data: users, error } = await supabase
      .from('users')
      .select('*');
    
    if (error) {
      console.error('❌ Error fetching users:', error.message);
      return false;
    }
    
    console.log(`✅ Found ${users?.length || 0} users`);
    
    // Check and fix passwords for admin and wawan
    const usersToFix = [
      { username: 'admin', correctPassword: 'admin123' },
      { username: 'wawan', correctPassword: 'wawan123' }
    ];
    
    for (const userToFix of usersToFix) {
      const user = users?.find(u => u.username === userToFix.username);
      
      if (!user) {
        console.log(`⚠️  User '${userToFix.username}' not found`);
        continue;
      }
      
      console.log(`🔍 Checking password for '${userToFix.username}'...`);
      
      // Check if current password is correct
      let isPasswordCorrect = false;
      
      try {
        // Try to compare with bcrypt
        isPasswordCorrect = await bcrypt.compare(userToFix.correctPassword, user.password);
      } catch (error) {
        // If bcrypt fails, check if it's plain text
        isPasswordCorrect = user.password === userToFix.correctPassword;
      }
      
      if (isPasswordCorrect) {
        console.log(`✅ Password for '${userToFix.username}' is correct`);
      } else {
        console.log(`🔧 Fixing password for '${userToFix.username}'...`);
        
        // Hash the correct password
        const hashedPassword = await bcrypt.hash(userToFix.correctPassword, 10);
        
        // Update the password
        const { error: updateError } = await supabase
          .from('users')
          .update({ password: hashedPassword })
          .eq('username', userToFix.username);
        
        if (updateError) {
          console.error(`❌ Error updating password for '${userToFix.username}':`, updateError.message);
        } else {
          console.log(`✅ Password updated for '${userToFix.username}'`);
        }
      }
    }
    
    return true;
    
  } catch (error) {
    console.error('❌ Error in checkAndFixPasswords:', error.message);
    return false;
  }
}

async function testLogin() {
  console.log('\n🧪 Testing login functionality...');
  
  const testUsers = [
    { username: 'admin', password: 'admin123' },
    { username: 'wawan', password: 'wawan123' }
  ];
  
  for (const testUser of testUsers) {
    try {
      console.log(`🔍 Testing login for '${testUser.username}'...`);
      
      // Get user from database
      const { data: user, error } = await supabase
        .from('users')
        .select('*')
        .eq('username', testUser.username)
        .single();
      
      if (error || !user) {
        console.log(`❌ User '${testUser.username}' not found`);
        continue;
      }
      
      // Test password
      const isPasswordValid = await bcrypt.compare(testUser.password, user.password);
      
      if (isPasswordValid) {
        console.log(`✅ Login test successful for '${testUser.username}'`);
      } else {
        console.log(`❌ Login test failed for '${testUser.username}' - password mismatch`);
      }
      
    } catch (error) {
      console.log(`❌ Login test error for '${testUser.username}':`, error.message);
    }
  }
}

async function main() {
  const passwordsFixed = await checkAndFixPasswords();
  
  if (passwordsFixed) {
    await testLogin();
    
    console.log('\n🎉 PASSWORD FIX COMPLETED!');
    console.log('\n📋 You can now login with:');
    console.log('👤 admin / admin123');
    console.log('👤 wawan / wawan123');
    console.log('\n🔗 Test at: https://sistem-informasi-pengawas-kcdxi.netlify.app/');
  } else {
    console.log('\n⚠️  Could not fix passwords automatically');
    console.log('\n📋 Manual steps may be needed');
  }
}

main().catch(console.error);