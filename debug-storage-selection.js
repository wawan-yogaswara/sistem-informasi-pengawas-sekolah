#!/usr/bin/env node

/**
 * Script untuk debug storage selection logic
 */

import dotenv from 'dotenv';

dotenv.config();

console.log('🔍 DEBUG STORAGE SELECTION LOGIC');
console.log('=================================');

const DATABASE_URL = process.env.DATABASE_URL;
console.log('DATABASE_URL:', DATABASE_URL);
console.log('DATABASE_URL exists:', !!DATABASE_URL);
console.log('DATABASE_URL includes "example":', DATABASE_URL?.includes('example'));

// Replicate the exact logic from server/local-storage.ts
const isLocalStorageEnabled = !process.env.DATABASE_URL || process.env.DATABASE_URL.includes('example');

console.log('\n📊 STORAGE SELECTION:');
console.log('isLocalStorageEnabled:', isLocalStorageEnabled);

if (isLocalStorageEnabled) {
  console.log('❌ SERVER WILL USE LOCAL STORAGE!');
  console.log('Reason:');
  if (!process.env.DATABASE_URL) {
    console.log('  - DATABASE_URL is not set');
  }
  if (process.env.DATABASE_URL?.includes('example')) {
    console.log('  - DATABASE_URL contains "example"');
  }
} else {
  console.log('✅ SERVER WILL USE SUPABASE DATABASE');
}

console.log('\n🔧 SOLUTION:');
if (isLocalStorageEnabled) {
  console.log('The server is configured to use local storage instead of Supabase!');
  console.log('This explains why data is not going to Supabase.');
  
  console.log('\nTo fix this:');
  console.log('1. Make sure DATABASE_URL is properly set in .env');
  console.log('2. Restart the server');
  console.log('3. Check server logs for "Using local file-based storage" message');
} else {
  console.log('Storage selection logic is correct.');
  console.log('Server should be using Supabase database.');
}