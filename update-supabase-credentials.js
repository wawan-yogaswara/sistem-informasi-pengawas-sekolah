// Script untuk update kredensial Supabase yang benar
// Jalankan setelah mendapat anon key dari dashboard

import fs from 'fs';
import path from 'path';

// URL yang benar berdasarkan Project ID dari screenshot
const CORRECT_URL = 'https://glhalitkstcvmzbqvqt.supabase.co';

// Placeholder untuk anon key - akan diisi setelah user copy dari dashboard
const ANON_KEY_PLACEHOLDER = 'YOUR_ANON_KEY_HERE';

function updateEnvFile() {
    console.log('🔧 Updating .env file...');
    
    const envPath = '.env';
    let envContent = fs.readFileSync(envPath, 'utf8');
    
    // Update URL
    envContent = envContent.replace(
        /SUPABASE_URL=https:\/\/fmxeboullgcewzjpql\.supabase\.co/g,
        `SUPABASE_URL=${CORRECT_URL}`
    );
    
    envContent = envContent.replace(
        /VITE_SUPABASE_URL=https:\/\/fmxeboullgcewzjpql\.supabase\.co/g,
        `VITE_SUPABASE_URL=${CORRECT_URL}`
    );
    
    // Update keys (akan diisi manual setelah dapat key asli)
    envContent = envContent.replace(
        /SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9\.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZteGVib3VsbGdjZXd6anBxbCIsInJvbGUiOiJhbm9uIiwiaWF0IjoxNzM0NTk5NzI4LCJleHAiOjIwNTAxNzU3Mjh9\.rQZ9QmjQZ9QmjQZ9QmjQZOeKq7QZ9QmjQZ9QmjQZ9QmjQZ9QmjQZ9Q/g,
        `SUPABASE_ANON_KEY=${ANON_KEY_PLACEHOLDER}`
    );
    
    envContent = envContent.replace(
        /VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9\.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZteGVib3VsbGdjZXd6anBxbCIsInJvbGUiOiJhbm9uIiwiaWF0IjoxNzM0NTk5NzI4LCJleHAiOjIwNTAxNzU3Mjh9\.rQZ9QmjQZ9QmjQZ9QmjQZOeKq7QZ9QmjQZ9QmjQZ9QmjQZ9QmjQZ9Q/g,
        `VITE_SUPABASE_ANON_KEY=${ANON_KEY_PLACEHOLDER}`
    );
    
    fs.writeFileSync(envPath, envContent);
    console.log('✅ .env file updated');
}

function updateSupabaseClient() {
    console.log('🔧 Updating Supabase client...');
    
    const clientPath = 'client/src/lib/supabase.ts';
    let clientContent = fs.readFileSync(clientPath, 'utf8');
    
    // Update URL
    clientContent = clientContent.replace(
        /https:\/\/fmxeboullgcewzjpql\.supabase\.co/g,
        CORRECT_URL
    );
    
    // Update key placeholder
    clientContent = clientContent.replace(
        /eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9\.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZteGVib3VsbGdjZXd6anBxbCIsInJvbGUiOiJhbm9uIiwiaWF0IjoxNzM0NTk5NzI4LCJleHAiOjIwNTAxNzU3Mjh9\.rQZ9QmjQZ9QmjQZ9QmjQZOeKq7QZ9QmjQZ9QmjQZ9QmjQZ9QmjQZ9Q/g,
        ANON_KEY_PLACEHOLDER
    );
    
    fs.writeFileSync(clientPath, clientContent);
    console.log('✅ Supabase client updated');
}

function updateNetlifyEnvVars() {
    console.log('🔧 Updating Netlify env vars file...');
    
    const netlifyEnvPath = 'netlify-env-vars.txt';
    let netlifyContent = fs.readFileSync(netlifyEnvPath, 'utf8');
    
    netlifyContent = netlifyContent.replace(
        /VITE_SUPABASE_URL=https:\/\/fmxeboullgcewzjpql\.supabase\.co/g,
        `VITE_SUPABASE_URL=${CORRECT_URL}`
    );
    
    netlifyContent = netlifyContent.replace(
        /VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9\.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZteGVib3VsbGdjZXd6anBxbCIsInJvbGUiOiJhbm9uIiwiaWF0IjoxNzM0NTk5NzI4LCJleHAiOjIwNTAxNzU3Mjh9\.rQZ9QmjQZ9QmjQZ9QmjQZOeKq7QZ9QmjQZ9QmjQZ9QmjQZ9QmjQZ9Q/g,
        `VITE_SUPABASE_ANON_KEY=${ANON_KEY_PLACEHOLDER}`
    );
    
    fs.writeFileSync(netlifyEnvPath, netlifyContent);
    console.log('✅ Netlify env vars updated');
}

// Main execution
console.log('🚀 UPDATING SUPABASE CREDENTIALS');
console.log('=================================');

try {
    updateEnvFile();
    updateSupabaseClient();
    updateNetlifyEnvVars();
    
    console.log('\n✅ ALL FILES UPDATED!');
    console.log('\n📋 NEXT STEPS:');
    console.log('1. Copy anon key from Supabase Dashboard > Settings > API');
    console.log('2. Replace "YOUR_ANON_KEY_HERE" in all files with real key');
    console.log('3. Update Netlify environment variables in dashboard');
    console.log('4. Test connection');
    
    console.log('\n🔍 FILES UPDATED:');
    console.log('- .env');
    console.log('- client/src/lib/supabase.ts');
    console.log('- netlify-env-vars.txt');
    
} catch (error) {
    console.error('❌ Error updating files:', error.message);
}