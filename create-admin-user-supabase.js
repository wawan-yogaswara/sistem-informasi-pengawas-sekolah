#!/usr/bin/env node

/**
 * Script untuk membuat user admin di Supabase
 */

import { createClient } from '@supabase/supabase-js';
import crypto from 'crypto';
import dotenv from 'dotenv';

dotenv.config();

const supabaseUrl = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_ANON_KEY || process.env.VITE_SUPABASE_ANON_KEY;

const supabase = createClient(supabaseUrl, supabaseKey);

// Simple hash function (for demo purposes - in production use bcrypt)
function hashPassword(password) {
  return crypto.createHash('sha256').update(password + 'salt').digest('hex');
}

async function createAdminUser() {
  console.log('🔧 CREATING ADMIN USER IN SUPABASE');
  console.log('==================================');
  
  try {
    // Check if admin user already exists
    const { data: existingAdmin, error: checkError } = await supabase
      .from('users')
      .select('*')
      .eq('username', 'admin')
      .single();
    
    if (checkError && checkError.code !== 'PGRST116') {
      console.log('❌ Error checking existing admin:', checkError.message);
      return;
    }
    
    if (existingAdmin) {
      console.log('✅ Admin user already exists');
      console.log('   Username:', existingAdmin.username);
      console.log('   Role:', existingAdmin.role);
      return;
    }
    
    // Create admin user
    console.log('Creating admin user...');
    
    const hashedPassword = hashPassword('admin');
    
    const { data: newAdmin, error: createError } = await supabase
      .from('users')
      .insert([{
        username: 'admin',
        password: hashedPassword,
        role: 'admin',
        name: 'Administrator',
        nip: null,
        position: null,
        photo: null,
      }])
      .select()
      .single();
    
    if (createError) {
      console.log('❌ Error creating admin user:', createError.message);
      return;
    }
    
    console.log('✅ Admin user created successfully!');
    console.log('   ID:', newAdmin.id);
    console.log('   Username:', newAdmin.username);
    console.log('   Role:', newAdmin.role);
    console.log('   Name:', newAdmin.name);
    
    console.log('\n🔐 Login credentials:');
    console.log('   Username: admin');
    console.log('   Password: admin');
    
  } catch (err) {
    console.log('❌ Failed to create admin user:', err.message);
  }
}

createAdminUser();