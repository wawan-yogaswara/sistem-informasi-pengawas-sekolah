// Update semua konfigurasi dengan Project ID yang benar
import fs from 'fs';

const CORRECT_PROJECT_ID = 'glhaliktsrcvnznbgxqt';
const CORRECT_URL = `https://${CORRECT_PROJECT_ID}.supabase.co`;
const CORRECT_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdsaGFsaWtrc3R2bXpicXZxdCIsInJvbGUiOiJhbm9uIiwiaWF0IjoxNzM0NTk5NzI4LCJleHAiOjIwNTAxNzU3Mjh9.eyJ3pc6tOi3IUzI1NiIsInR5cCI6IkpXVCJ9';

console.log('🔧 UPDATING SUPABASE WITH CORRECT PROJECT ID');
console.log('=============================================');
console.log(`Project ID: ${CORRECT_PROJECT_ID}`);
console.log(`URL: ${CORRECT_URL}`);
console.log(`Key: ${CORRECT_KEY.substring(0, 20)}...`);

// Update .env file
function updateEnvFile() {
    console.log('\n🔄 Updating .env file...');
    
    let envContent = fs.readFileSync('.env', 'utf8');
    
    // Update URLs
    envContent = envContent.replace(
        /SUPABASE_URL=https:\/\/.*\.supabase\.co/g,
        `SUPABASE_URL=${CORRECT_URL}`
    );
    
    envContent = envContent.replace(
        /VITE_SUPABASE_URL=https:\/\/.*\.supabase\.co/g,
        `VITE_SUPABASE_URL=${CORRECT_URL}`
    );
    
    // Update keys
    envContent = envContent.replace(
        /SUPABASE_ANON_KEY=.*/g,
        `SUPABASE_ANON_KEY=${CORRECT_KEY}`
    );
    
    envContent = envContent.replace(
        /VITE_SUPABASE_ANON_KEY=.*/g,
        `VITE_SUPABASE_ANON_KEY=${CORRECT_KEY}`
    );
    
    fs.writeFileSync('.env', envContent);
    console.log('✅ .env updated');
}

// Update Supabase client
function updateSupabaseClient() {
    console.log('🔄 Updating Supabase client...');
    
    let clientContent = fs.readFileSync('client/src/lib/supabase.ts', 'utf8');
    
    // Update URL
    clientContent = clientContent.replace(
        /https:\/\/.*\.supabase\.co/g,
        CORRECT_URL
    );
    
    // Update key
    clientContent = clientContent.replace(
        /eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9\.[^']+/g,
        CORRECT_KEY
    );
    
    fs.writeFileSync('client/src/lib/supabase.ts', clientContent);
    console.log('✅ Supabase client updated');
}

// Update Netlify env vars
function updateNetlifyEnvVars() {
    console.log('🔄 Updating Netlify env vars...');
    
    let netlifyContent = fs.readFileSync('netlify-env-vars.txt', 'utf8');
    
    netlifyContent = netlifyContent.replace(
        /VITE_SUPABASE_URL=https:\/\/.*\.supabase\.co/g,
        `VITE_SUPABASE_URL=${CORRECT_URL}`
    );
    
    netlifyContent = netlifyContent.replace(
        /VITE_SUPABASE_ANON_KEY=.*/g,
        `VITE_SUPABASE_ANON_KEY=${CORRECT_KEY}`
    );
    
    fs.writeFileSync('netlify-env-vars.txt', netlifyContent);
    console.log('✅ Netlify env vars updated');
}

// Execute updates
try {
    updateEnvFile();
    updateSupabaseClient();
    updateNetlifyEnvVars();
    
    console.log('\n🎉 ALL FILES UPDATED SUCCESSFULLY!');
    console.log('\n📋 UPDATED CREDENTIALS:');
    console.log(`URL: ${CORRECT_URL}`);
    console.log(`Key: ${CORRECT_KEY.substring(0, 30)}...`);
    
    console.log('\n🔍 FILES UPDATED:');
    console.log('✅ .env');
    console.log('✅ client/src/lib/supabase.ts');
    console.log('✅ netlify-env-vars.txt');
    
    console.log('\n🚀 NEXT STEP: Test connection');
    console.log('Run: node test-supabase-final-correct.js');
    
} catch (error) {
    console.error('❌ Error updating files:', error.message);
}