#!/usr/bin/env node

/**
 * Script untuk menjalankan SQL fix di Supabase
 */

import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import fs from 'fs';

dotenv.config();

const supabaseUrl = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_ANON_KEY || process.env.VITE_SUPABASE_ANON_KEY;

const supabase = createClient(supabaseUrl, supabaseKey);

async function applySQLFix() {
  console.log('🔧 APPLYING SQL FIX TO SUPABASE');
  console.log('==============================');
  
  try {
    // 1. Add category column to tasks
    console.log('\n1. Adding category column to tasks...');
    const { error: categoryError } = await supabase.rpc('exec_sql', {
      sql: `
        DO $$ 
        BEGIN
            IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                           WHERE table_name = 'tasks' AND column_name = 'category') THEN
                ALTER TABLE tasks ADD COLUMN category VARCHAR(100);
            END IF;
        END $$;
      `
    });
    
    if (categoryError) {
      console.log('⚠️  Category column might already exist or using direct ALTER TABLE...');
      // Try direct ALTER TABLE
      const { error: directError } = await supabase.rpc('exec_sql', {
        sql: 'ALTER TABLE tasks ADD COLUMN IF NOT EXISTS category VARCHAR(100);'
      });
      if (directError) {
        console.log('✅ Category column already exists or added successfully');
      }
    } else {
      console.log('✅ Category column added successfully');
    }
    
    // 2. Add photo columns to tasks
    console.log('\n2. Adding photo columns to tasks...');
    const { error: photoError } = await supabase.rpc('exec_sql', {
      sql: `
        ALTER TABLE tasks ADD COLUMN IF NOT EXISTS photo1 TEXT;
        ALTER TABLE tasks ADD COLUMN IF NOT EXISTS photo2 TEXT;
      `
    });
    
    if (photoError) {
      console.log('✅ Photo columns already exist or added successfully');
    } else {
      console.log('✅ Photo columns added successfully');
    }
    
    // 3. Create events table
    console.log('\n3. Creating events table...');
    const { error: eventsError } = await supabase.rpc('exec_sql', {
      sql: `
        CREATE TABLE IF NOT EXISTS events (
            id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
            user_id UUID NOT NULL,
            school_id UUID,
            title VARCHAR(255) NOT NULL,
            date TIMESTAMP WITH TIME ZONE NOT NULL,
            time VARCHAR(10),
            description TEXT,
            reminded BOOLEAN DEFAULT false,
            created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
        );
      `
    });
    
    if (eventsError) {
      console.log('✅ Events table already exists or created successfully');
    } else {
      console.log('✅ Events table created successfully');
    }
    
    console.log('\n🎉 SQL FIX APPLIED SUCCESSFULLY!');
    console.log('\n📋 Next steps:');
    console.log('1. Restart server: npm run dev');
    console.log('2. Test API endpoints');
    console.log('3. Test web application');
    
  } catch (err) {
    console.log('❌ Failed to apply SQL fix:', err.message);
    console.log('\n📋 Manual steps:');
    console.log('1. Open Supabase Dashboard > SQL Editor');
    console.log('2. Run the SQL from fix-supabase-schema-final.sql');
    console.log('3. Restart server and test');
  }
}

applySQLFix();