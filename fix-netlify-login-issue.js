#!/usr/bin/env node

/**
 * 🔧 FIX NETLIFY LOGIN ISSUE
 * 
 * Script untuk memperbaiki masalah "tenant or user not found" di Netlify
 * dengan memastikan user admin dan wawan ada di Supabase
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
  console.error('VITE_SUPABASE_URL:', supabaseUrl ? '✅' : '❌');
  console.error('VITE_SUPABASE_ANON_KEY:', supabaseKey ? '✅' : '❌');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

console.log('🔧 FIXING NETLIFY LOGIN ISSUE\n');
console.log(`🔗 Supabase URL: ${supabaseUrl}`);
console.log(`🔑 Supabase Key: ${supabaseKey.substring(0, 20)}...`);

async function checkAndCreateUsers() {
  try {
    console.log('\n📊 Checking existing users...');
    
    // Check if users table exists and get current users
    const { data: existingUsers, error: fetchError } = await supabase
      .from('users')
      .select('*');
    
    if (fetchError) {
      console.error('❌ Error fetching users:', fetchError.message);
      console.log('\n🔧 This might mean the users table doesn\'t exist yet.');
      console.log('📋 Let\'s create the schema first...');
      return false;
    }
    
    console.log(`✅ Found ${existingUsers?.length || 0} existing users`);
    
    // Users to ensure exist
    const requiredUsers = [
      {
        username: 'admin',
        password: 'admin123',
        name: 'Administrator',
        role: 'admin',
        nip: '123456789',
        position: 'Administrator'
      },
      {
        username: 'wawan',
        password: 'wawan123',
        name: 'Wawan Yogaswara',
        role: 'user',
        nip: '987654321',
        position: 'Pengawas Sekolah'
      }
    ];
    
    for (const user of requiredUsers) {
      // Check if user already exists
      const existingUser = existingUsers?.find(u => u.username === user.username);
      
      if (existingUser) {
        console.log(`✅ User '${user.username}' already exists`);
        continue;
      }
      
      // Hash password
      const hashedPassword = await bcrypt.hash(user.password, 10);
      
      // Create user
      const { data, error } = await supabase
        .from('users')
        .insert([{
          username: user.username,
          password: hashedPassword,
          name: user.name,
          role: user.role,
          nip: user.nip,
          position: user.position,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        }])
        .select();
      
      if (error) {
        console.error(`❌ Error creating user '${user.username}':`, error.message);
      } else {
        console.log(`✅ Created user '${user.username}' successfully`);
      }
    }
    
    return true;
    
  } catch (error) {
    console.error('❌ Error in checkAndCreateUsers:', error.message);
    return false;
  }
}

async function createSchema() {
  console.log('\n🏗️  Creating database schema...');
  
  // SQL to create users table
  const createUsersTable = `
    CREATE TABLE IF NOT EXISTS users (
      id SERIAL PRIMARY KEY,
      username VARCHAR(50) UNIQUE NOT NULL,
      password VARCHAR(255) NOT NULL,
      name VARCHAR(100) NOT NULL,
      role VARCHAR(20) DEFAULT 'user',
      nip VARCHAR(20),
      position VARCHAR(100),
      profile_photo TEXT,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
  `;
  
  // SQL to create schools table
  const createSchoolsTable = `
    CREATE TABLE IF NOT EXISTS schools (
      id SERIAL PRIMARY KEY,
      name VARCHAR(200) NOT NULL,
      address TEXT,
      principal VARCHAR(100),
      phone VARCHAR(20),
      email VARCHAR(100),
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
  `;
  
  try {
    // Execute SQL using Supabase RPC or direct SQL
    const { error: usersError } = await supabase.rpc('exec_sql', { 
      sql: createUsersTable 
    });
    
    if (usersError) {
      console.log('⚠️  Could not create users table via RPC, trying alternative method...');
      // Alternative: Use Supabase client to create table
      console.log('📝 Please create the users table manually in Supabase dashboard');
    } else {
      console.log('✅ Users table created successfully');
    }
    
    const { error: schoolsError } = await supabase.rpc('exec_sql', { 
      sql: createSchoolsTable 
    });
    
    if (schoolsError) {
      console.log('⚠️  Could not create schools table via RPC');
    } else {
      console.log('✅ Schools table created successfully');
    }
    
  } catch (error) {
    console.log('⚠️  Schema creation via RPC not available');
    console.log('📋 Please run the SQL schema manually in Supabase');
  }
}

async function testConnection() {
  console.log('\n🧪 Testing Supabase connection...');
  
  try {
    const { data, error } = await supabase
      .from('users')
      .select('count(*)')
      .limit(1);
    
    if (error) {
      console.error('❌ Connection test failed:', error.message);
      return false;
    }
    
    console.log('✅ Supabase connection successful');
    return true;
    
  } catch (error) {
    console.error('❌ Connection test error:', error.message);
    return false;
  }
}

async function main() {
  // Test connection first
  const connectionOk = await testConnection();
  
  if (!connectionOk) {
    console.log('\n🔧 Connection failed. Checking schema...');
    await createSchema();
  }
  
  // Try to check and create users
  const usersOk = await checkAndCreateUsers();
  
  if (usersOk) {
    console.log('\n🎉 SUCCESS! Users are ready');
    console.log('\n📋 You can now login with:');
    console.log('👤 admin / admin123');
    console.log('👤 wawan / wawan123');
    console.log('\n🔗 Test at: https://sistem-informasi-pengawas-kcdxi.netlify.app/');
  } else {
    console.log('\n⚠️  Could not verify users automatically');
    console.log('\n📋 Manual steps needed:');
    console.log('1. Go to Supabase dashboard');
    console.log('2. Run the SQL schema from create-supabase-schema.sql');
    console.log('3. Insert users manually or run this script again');
  }
}

main().catch(console.error);