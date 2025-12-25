#!/usr/bin/env node

/**
 * Script untuk update password admin di Supabase dengan bcrypt hash
 */

import { createClient } from '@supabase/supabase-js';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';

dotenv.config();

const supabaseUrl = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_ANON_KEY || process.env.VITE_SUPABASE_ANON_KEY;

const supabase = createClient(supabaseUrl, supabaseKey);

async function updateAdminPassword() {
  console.log('🔧 UPDATING ADMIN PASSWORD IN SUPABASE');
  console.log('=====================================');
  
  try {
    // Hash password with bcrypt (same as server)
    const hashedPassword = await bcrypt.hash('admin', 10);
    console.log('Generated bcrypt hash for password "admin"');
    
    // Update admin user password
    const { data, error } = await supabase
      .from('users')
      .update({ password: hashedPassword })
      .eq('username', 'admin')
      .select();
    
    if (error) {
      console.log('❌ Error updating admin password:', error.message);
      return;
    }
    
    if (data && data.length > 0) {
      console.log('✅ Admin password updated successfully!');
      console.log('   Username: admin');
      console.log('   Password: admin');
      console.log('   Hash method: bcrypt (compatible with server)');
    } else {
      console.log('❌ Admin user not found');
    }
    
  } catch (err) {
    console.log('❌ Failed to update admin password:', err.message);
  }
}

updateAdminPassword();