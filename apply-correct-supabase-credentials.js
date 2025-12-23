// Apply kredensial Supabase yang benar
import fs from 'fs';

const CORRECT_PROJECT_ID = 'glhaliktsrcvnznbgxqt';
const CORRECT_URL = `https://${CORRECT_PROJECT_ID}.supabase.co`;
const CORRECT_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdsaGFsaWt0c3Jjdm56bmJneHF0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjYzNjYyMjQsImV4cCI6MjA4MTk0MjIyNH0._kaFo2h7rCdouJp2rpb1lmEvlR6gAc0c3AnRjM_PhP4';

console.log('🎯 APPLYING CORRECT SUPABASE CREDENTIALS');
console.log('=========================================');
console.log(`Project ID: ${CORRECT_PROJECT_ID}`);
console.log(`URL: ${CORRECT_URL}`);
console.log(`Key: ${CORRECT_KEY.substring(0, 30)}...`);

// Validate key first
try {
    const parts = CORRECT_KEY.split('.');
    const payload = JSON.parse(atob(parts[1]));
    console.log('\n✅ Key validation:');
    console.log(`Project ref in key: ${payload.ref}`);
    console.log(`Expected project ID: ${CORRECT_PROJECT_ID}`);
    console.log(`Match: ${payload.ref === CORRECT_PROJECT_ID ? '✅' : '❌'}`);
    
    if (payload.ref !== CORRECT_PROJECT_ID) {
        console.log('❌ Key mismatch! Aborting...');
        process.exit(1);
    }
} catch (e) {
    console.log('❌ Invalid key format! Aborting...');
    process.exit(1);
}

// Update .env file
function updateEnvFile() {
    console.log('\n🔄 Updating .env file...');
    
    let envContent = fs.readFileSync('.env', 'utf8');
    
    // Replace all Supabase URLs
    envContent = envContent.replace(
        /SUPABASE_URL=https:\/\/.*\.supabase\.co/g,
        `SUPABASE_URL=${CORRECT_URL}`
    );
    
    envContent = envContent.replace(
        /VITE_SUPABASE_URL=https:\/\/.*\.supabase\.co/g,
        `VITE_SUPABASE_URL=${CORRECT_URL}`
    );
    
    // Replace all Supabase keys
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
    
    // Replace URL
    clientContent = clientContent.replace(
        /https:\/\/.*\.supabase\.co/g,
        CORRECT_URL
    );
    
    // Replace key (more specific pattern)
    clientContent = clientContent.replace(
        /eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9\.[A-Za-z0-9_-]+\.[A-Za-z0-9_-]+/g,
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

// Execute all updates
try {
    updateEnvFile();
    updateSupabaseClient();
    updateNetlifyEnvVars();
    
    console.log('\n🎉 ALL CREDENTIALS UPDATED SUCCESSFULLY!');
    console.log('\n📋 FINAL CREDENTIALS:');
    console.log(`✅ URL: ${CORRECT_URL}`);
    console.log(`✅ Key: ${CORRECT_KEY.substring(0, 50)}...`);
    
    console.log('\n🔍 FILES UPDATED:');
    console.log('✅ .env');
    console.log('✅ client/src/lib/supabase.ts');
    console.log('✅ netlify-env-vars.txt');
    
    console.log('\n🚀 READY TO TEST CONNECTION!');
    
} catch (error) {
    console.error('❌ Error updating files:', error.message);
}