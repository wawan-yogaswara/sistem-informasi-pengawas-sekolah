// Fix user ID mismatch antara localStorage dan Supabase
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://glhaliktsrcvnznbgxqt.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdsaGFsaWt0c3Jjdm56bmJneHF0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjYzNjYyMjQsImV4cCI6MjA4MTk0MjIyNH0._kaFo2h7rCdouJp2rpb1lmEvlR6gAc0c3AnRjM_PhP4';

const supabase = createClient(supabaseUrl, supabaseKey);

async function fixUserIdMismatch() {
  console.log('🔧 Fixing user ID mismatch...');
  
  try {
    // 1. Get users from Supabase
    const { data: supabaseUsers, error: usersError } = await supabase
      .from('users')
      .select('*');
    
    if (usersError) {
      console.error('❌ Error fetching users:', usersError);
      return;
    }
    
    console.log('✅ Users in Supabase:');
    supabaseUsers.forEach(user => {
      console.log(`   - ${user.username} (${user.role}): ${user.id}`);
    });
    
    // 2. Update localStorage dengan user ID yang benar
    const adminUser = supabaseUsers.find(u => u.username === 'admin');
    const wawanUser = supabaseUsers.find(u => u.username === 'wawan');
    
    if (adminUser) {
      const adminData = {
        id: adminUser.id,
        username: adminUser.username,
        full_name: adminUser.name || adminUser.username,
        role: adminUser.role || 'admin',
        nip: adminUser.nip || '',
        position: adminUser.position || 'Administrator'
      };
      
      console.log('\n🔄 Updating admin user data in localStorage...');
      console.log('   New admin ID:', adminUser.id);
      
      // Update localStorage jika user sedang login sebagai admin
      const currentUser = localStorage.getItem('auth_user');
      if (currentUser) {
        const parsed = JSON.parse(currentUser);
        if (parsed.username === 'admin') {
          localStorage.setItem('auth_user', JSON.stringify(adminData));
          console.log('✅ Admin user data updated in localStorage');
        }
      }
    }
    
    if (wawanUser) {
      const wawanData = {
        id: wawanUser.id,
        username: wawanUser.username,
        full_name: wawanUser.name || wawanUser.username,
        role: wawanUser.role || 'user',
        nip: wawanUser.nip || '',
        position: wawanUser.position || 'Pengawas Sekolah'
      };
      
      console.log('\n🔄 Updating wawan user data in localStorage...');
      console.log('   New wawan ID:', wawanUser.id);
      
      // Update localStorage jika user sedang login sebagai wawan
      const currentUser = localStorage.getItem('auth_user');
      if (currentUser) {
        const parsed = JSON.parse(currentUser);
        if (parsed.username === 'wawan') {
          localStorage.setItem('auth_user', JSON.stringify(wawanData));
          console.log('✅ Wawan user data updated in localStorage');
        }
      }
    }
    
    // 3. Test input data dengan user ID yang benar
    console.log('\n🔄 Testing data input with correct user IDs...');
    
    if (wawanUser) {
      // Test task input
      const testTask = {
        user_id: wawanUser.id,
        title: 'Test Task dari Wawan ' + Date.now(),
        description: 'Test task dengan user ID yang benar',
        date: new Date().toISOString().split('T')[0],
        completed: false
      };
      
      const { data: taskData, error: taskError } = await supabase
        .from('tasks')
        .insert([testTask])
        .select()
        .single();
      
      if (taskError) {
        console.error('❌ Task insert still failed:', taskError);
      } else {
        console.log('✅ Task insert successful:', taskData.title);
        console.log('   Task ID:', taskData.id);
      }
      
      // Test additional task input
      const schoolId = '1cd40355-1b07-402d-8309-b243c098cfe9'; // SDN 1 Garut
      const testAdditionalTask = {
        user_id: wawanUser.id,
        school_id: schoolId,
        title: 'Test Tugas Tambahan dari Wawan ' + Date.now(),
        description: 'Test tugas tambahan dengan user ID yang benar',
        date: new Date().toISOString().split('T')[0],
        status: 'completed'
      };
      
      const { data: additionalTaskData, error: additionalTaskError } = await supabase
        .from('additional_tasks')
        .insert([testAdditionalTask])
        .select()
        .single();
      
      if (additionalTaskError) {
        console.error('❌ Additional task insert still failed:', additionalTaskError);
      } else {
        console.log('✅ Additional task insert successful:', additionalTaskData.title);
        console.log('   Additional task ID:', additionalTaskData.id);
      }
    }
    
    // 4. Show final status
    console.log('\n📊 Final database status:');
    
    const { data: finalTasks } = await supabase.from('tasks').select('*');
    const { data: finalAdditionalTasks } = await supabase.from('additional_tasks').select('*');
    
    console.log(`   Tasks: ${finalTasks?.length || 0}`);
    console.log(`   Additional Tasks: ${finalAdditionalTasks?.length || 0}`);
    
    if (finalTasks?.length > 0) {
      console.log('\n   Recent tasks:');
      finalTasks.slice(-3).forEach(task => {
        console.log(`   - ${task.title} (${task.date})`);
      });
    }
    
    if (finalAdditionalTasks?.length > 0) {
      console.log('\n   Recent additional tasks:');
      finalAdditionalTasks.slice(-3).forEach(task => {
        console.log(`   - ${task.title} (${task.date})`);
      });
    }
    
  } catch (error) {
    console.error('❌ Error fixing user ID mismatch:', error);
  }
}

// Fungsi untuk membuat script HTML yang bisa dijalankan di browser
function generateBrowserScript() {
  const script = `
<!DOCTYPE html>
<html>
<head>
    <title>Fix User ID Mismatch</title>
    <style>
        body { font-family: Arial, sans-serif; padding: 20px; }
        .log { background: #f5f5f5; padding: 10px; margin: 10px 0; border-radius: 5px; }
        .success { color: green; }
        .error { color: red; }
        .info { color: blue; }
    </style>
</head>
<body>
    <h1>Fix User ID Mismatch - Browser Version</h1>
    <div id="output"></div>
    
    <script>
        const output = document.getElementById('output');
        
        function log(message, type = 'info') {
            const div = document.createElement('div');
            div.className = 'log ' + type;
            div.textContent = message;
            output.appendChild(div);
            console.log(message);
        }
        
        async function fixUserIds() {
            log('🔧 Starting user ID fix...', 'info');
            
            try {
                // Correct user IDs from Supabase
                const correctUserIds = {
                    admin: 'a7c7a9de-9ec8-4416-9aa3-59dab24b620b',
                    wawan: '421cdb28-f2af-4f1f-aa5f-c59a3d661a2e'
                };
                
                // Update current user session if exists
                const currentUser = localStorage.getItem('auth_user');
                if (currentUser) {
                    const parsed = JSON.parse(currentUser);
                    
                    if (parsed.username === 'admin') {
                        parsed.id = correctUserIds.admin;
                        localStorage.setItem('auth_user', JSON.stringify(parsed));
                        log('✅ Admin user ID updated: ' + correctUserIds.admin, 'success');
                    } else if (parsed.username === 'wawan') {
                        parsed.id = correctUserIds.wawan;
                        localStorage.setItem('auth_user', JSON.stringify(parsed));
                        log('✅ Wawan user ID updated: ' + correctUserIds.wawan, 'success');
                    }
                }
                
                // Update any existing data with wrong user IDs
                const dataKeys = ['tasks_data', 'additional_tasks_data', 'supervisions_data'];
                
                dataKeys.forEach(key => {
                    const data = localStorage.getItem(key);
                    if (data) {
                        try {
                            const parsed = JSON.parse(data);
                            if (Array.isArray(parsed)) {
                                let updated = false;
                                parsed.forEach(item => {
                                    if (item.user_id && !item.user_id.includes('-')) {
                                        // Old format user ID, update it
                                        item.user_id = correctUserIds.wawan; // Default to wawan
                                        updated = true;
                                    }
                                });
                                
                                if (updated) {
                                    localStorage.setItem(key, JSON.stringify(parsed));
                                    log('✅ Updated ' + key + ' with correct user IDs', 'success');
                                }
                            }
                        } catch (e) {
                            log('❌ Error updating ' + key + ': ' + e.message, 'error');
                        }
                    }
                });
                
                log('✅ User ID fix completed! Please refresh the page.', 'success');
                
            } catch (error) {
                log('❌ Error: ' + error.message, 'error');
            }
        }
        
        // Auto-run the fix
        fixUserIds();
    </script>
</body>
</html>`;
  
  return script;
}

// Generate browser script
console.log('\n📝 Generating browser script...');
const browserScript = generateBrowserScript();

// Save browser script
import { writeFileSync } from 'fs';
writeFileSync('fix-user-id-browser.html', browserScript);
console.log('✅ Browser script saved as: fix-user-id-browser.html');

// Run the main fix
fixUserIdMismatch().catch(console.error);