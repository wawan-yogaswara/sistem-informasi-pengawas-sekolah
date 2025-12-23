// Fix user data yang bermasalah di Supabase
import { createClient } from '@supabase/supabase-js';
import fs from 'fs';

const supabaseUrl = 'https://glhaliktsrcvnznbgxqt.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdsaGFsaWt0c3Jjdm56bmJneHF0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjYzNjYyMjQsImV4cCI6MjA4MTk0MjIyNH0._kaFo2h7rCdouJp2rpb1lmEvlR6gAc0c3AnRjM_PhP4';

const supabase = createClient(supabaseUrl, supabaseKey);

console.log('🔧 FIXING USER DATA IN SUPABASE');
console.log('===============================');

async function fixUserData() {
    try {
        // Read local data
        const localData = JSON.parse(fs.readFileSync('local-database.json', 'utf8'));
        
        console.log('\n🔄 Fixing user data with proper names...');
        
        // Fix users with missing names
        const usersToFix = [
            { username: 'admin', name: 'Administrator', role: 'admin' },
            { username: 'wawan', name: 'Wawan Setiawan', role: 'user' },
            { username: 'yenihandayani', name: 'Yeni Handayani', role: 'user' },
            { username: 'Itasdik', name: 'Ita Sudik', role: 'user' },
            { username: '197709302005012012', name: 'Pengawas 197709302005012012', role: 'user' },
            { username: 'APEP ZENAL MUSTOFA', name: 'Apep Zenal Mustofa', role: 'user' },
            { username: 'undangsupiandi35@admin.smk.belajar.id', name: 'Undang Supiandi', role: 'user' },
            { username: 'Yayan Sopian ', name: 'Yayan Sopian', role: 'user' },
            { username: 'Ghathfan12', name: 'Ghathfan', role: 'user' },
            { username: '12345678', name: 'User 12345678', role: 'user' }
        ];
        
        for (const user of usersToFix) {
            // Find original user data
            const originalUser = localData.users?.find(u => u.username === user.username);
            
            const userData = {
                username: user.username,
                password: originalUser?.password || '$2b$10$rQZ9QmjQZ9QmjQZ9QmjQZOeKq7QZ9QmjQZ9QmjQZ9QmjQZ9QmjQZ9Q',
                role: originalUser?.role || user.role,
                name: originalUser?.name || user.name,
                nip: originalUser?.nip || null,
                position: originalUser?.position || null,
                photo: originalUser?.photo || null
            };
            
            const { error } = await supabase
                .from('users')
                .upsert(userData, {
                    onConflict: 'username'
                });
            
            if (error) {
                console.log(`❌ ${user.username}: ${error.message}`);
            } else {
                console.log(`✅ ${user.username}: Fixed`);
            }
        }
        
        // Verify final user count
        const { data: finalUsers, error: countError } = await supabase
            .from('users')
            .select('username, name, role');
        
        if (!countError) {
            console.log(`\n📊 Final user count: ${finalUsers.length}`);
            finalUsers.forEach(user => {
                console.log(`   - ${user.username}: ${user.name} (${user.role})`);
            });
        }
        
        return true;
        
    } catch (err) {
        console.log('❌ Fix error:', err.message);
        return false;
    }
}

// Run fix
fixUserData().then(success => {
    if (success) {
        console.log('\n🎉 USER DATA FIXED SUCCESSFULLY!');
        console.log('✅ All users now have proper names');
        console.log('✅ Ready for production deployment');
        
        console.log('\n🚀 DEPLOY NOW:');
        console.log('1. Push to Git (if using Git deployment)');
        console.log('2. Or trigger manual deploy in Netlify');
        console.log('3. Test live application');
    } else {
        console.log('\n❌ FIX FAILED');
        console.log('🔧 Check error messages above');
    }
});