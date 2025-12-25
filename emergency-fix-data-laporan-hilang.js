#!/usr/bin/env node

/**
 * Emergency Fix: Data Laporan Hilang
 * Script untuk mendiagnosa dan memperbaiki masalah data hilang di halaman laporan
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

console.log('🚨 EMERGENCY FIX: DATA LAPORAN HILANG');
console.log('=====================================');

// Check localStorage data
function checkLocalStorageData() {
    console.log('\n1. 📦 Checking localStorage Data...');
    
    const dbPath = path.join(__dirname, 'local-database.json');
    
    if (!fs.existsSync(dbPath)) {
        console.log('❌ File local-database.json tidak ditemukan!');
        return false;
    }
    
    try {
        const data = JSON.parse(fs.readFileSync(dbPath, 'utf8'));
        
        console.log('✅ local-database.json loaded successfully');
        console.log(`👥 Users: ${data.users?.length || 0}`);
        console.log(`📋 Tasks: ${data.tasks?.length || 0}`);
        console.log(`🔍 Supervisions: ${data.supervisions?.length || 0}`);
        console.log(`➕ Additional Tasks: ${data.additionalTasks?.length || 0}`);
        
        // Check for wawan user specifically
        const wawan = data.users?.find(u => u.username === 'wawan');
        if (wawan) {
            console.log('✅ User wawan found:', wawan.id);
            
            const wawaUserId = '1762696525337';
            const wawaActivities = {
                tasks: data.tasks?.filter(t => t.userId === wawaUserId) || [],
                supervisions: data.supervisions?.filter(s => s.userId === wawaUserId) || [],
                additionalTasks: data.additionalTasks?.filter(t => t.userId === wawaUserId) || []
            };
            
            console.log(`📊 Wawan activities:`);
            console.log(`   - Tasks: ${wawaActivities.tasks.length}`);
            console.log(`   - Supervisions: ${wawaActivities.supervisions.length}`);
            console.log(`   - Additional Tasks: ${wawaActivities.additionalTasks.length}`);
            
            const totalActivities = wawaActivities.tasks.length + wawaActivities.supervisions.length + wawaActivities.additionalTasks.length;
            console.log(`   - TOTAL: ${totalActivities} activities`);
            
            if (totalActivities === 0) {
                console.log('❌ MASALAH DITEMUKAN: Tidak ada aktivitas untuk user wawan!');
                return false;
            } else {
                console.log('✅ Data aktivitas wawan tersedia');
                
                // Show sample activities
                console.log('\n📋 Sample activities:');
                [...wawaActivities.tasks, ...wawaActivities.supervisions, ...wawaActivities.additionalTasks]
                    .slice(0, 3)
                    .forEach((activity, i) => {
                        console.log(`   ${i+1}. ${activity.title || activity.name} (${activity.date})`);
                        if (activity.photo1) console.log(`      - Photo1: ${activity.photo1}`);
                        if (activity.photo2) console.log(`      - Photo2: ${activity.photo2}`);
                    });
                
                return true;
            }
        } else {
            console.log('❌ MASALAH DITEMUKAN: User wawan tidak ditemukan!');
            return false;
        }
        
    } catch (error) {
        console.log('❌ Error reading local-database.json:', error.message);
        return false;
    }
}

// Create emergency backup
function createEmergencyBackup() {
    console.log('\n2. 💾 Creating Emergency Backup...');
    
    const dbPath = path.join(__dirname, 'local-database.json');
    const backupPath = path.join(__dirname, `local-database.backup.${Date.now()}.json`);
    
    try {
        if (fs.existsSync(dbPath)) {
            fs.copyFileSync(dbPath, backupPath);
            console.log(`✅ Backup created: ${backupPath}`);
            return true;
        } else {
            console.log('❌ No database file to backup');
            return false;
        }
    } catch (error) {
        console.log('❌ Error creating backup:', error.message);
        return false;
    }
}

// Fix reports.tsx query
function fixReportsQuery() {
    console.log('\n3. 🔧 Fixing Reports Query...');
    
    const reportsPath = path.join(__dirname, 'client/src/pages/reports.tsx');
    
    if (!fs.existsSync(reportsPath)) {
        console.log('❌ reports.tsx not found');
        return false;
    }
    
    try {
        let content = fs.readFileSync(reportsPath, 'utf8');
        
        // Check if the query is too complex and might be failing
        if (content.includes('refetchInterval: 30000')) {
            console.log('⚠️ Found refetchInterval - might be causing issues');
            
            // Simplify the query by removing refetchInterval and retry
            content = content.replace('refetchInterval: 30000,', '');
            content = content.replace('retry: 1,', 'retry: false,');
            
            // Add staleTime to prevent too frequent refetches
            content = content.replace(
                'queryFn: async () => {',
                'staleTime: 5 * 60 * 1000, // 5 minutes\n    queryFn: async () => {'
            );
            
            fs.writeFileSync(reportsPath, content);
            console.log('✅ Simplified reports query - removed refetchInterval and retry');
            return true;
        } else {
            console.log('✅ Reports query looks normal');
            return true;
        }
        
    } catch (error) {
        console.log('❌ Error fixing reports query:', error.message);
        return false;
    }
}

// Create simple fallback query
function createFallbackQuery() {
    console.log('\n4. 🛡️ Creating Fallback Query...');
    
    const fallbackContent = `
// Emergency fallback for reports data
export const getReportsDataFallback = () => {
  try {
    const userData = localStorage.getItem('auth_user');
    if (!userData) return [];
    
    const currentUser = JSON.parse(userData);
    const userId = currentUser.username === 'wawan' ? '1762696525337' : currentUser.id;
    
    const localData = localStorage.getItem('local-database') || '{}';
    const database = JSON.parse(localData);
    
    const activities = [];
    
    // Tasks
    const tasks = database.tasks?.filter(t => t.userId === userId) || [];
    tasks.forEach(task => {
      activities.push({
        id: task.id,
        type: 'Tugas Pokok',
        title: task.title || 'Tugas Harian',
        date: task.date || task.createdAt,
        location: 'Sekolah Binaan',
        organizer: 'Pengawas Sekolah',
        description: task.description || '',
        photo1: task.photo1,
        photo2: task.photo2,
        createdAt: task.createdAt
      });
    });
    
    // Supervisions
    const supervisions = database.supervisions?.filter(s => s.userId === userId) || [];
    supervisions.forEach(supervision => {
      const school = database.schools?.find(s => s.id === supervision.schoolId);
      activities.push({
        id: supervision.id,
        type: 'Supervisi',
        title: \`Supervisi \${school?.name || 'Sekolah'}\`,
        date: supervision.date || supervision.createdAt,
        location: school?.name || 'Sekolah Binaan',
        organizer: 'Pengawas Sekolah',
        description: supervision.findings || supervision.recommendations || '',
        photo1: supervision.photo1,
        photo2: supervision.photo2,
        createdAt: supervision.createdAt
      });
    });
    
    // Additional Tasks
    const additionalTasks = database.additionalTasks?.filter(t => t.userId === userId) || [];
    additionalTasks.forEach(task => {
      activities.push({
        id: task.id,
        type: 'Tugas Tambahan',
        title: task.name || task.title || 'Kegiatan Tambahan',
        date: task.date || task.createdAt,
        location: task.location || 'Tempat Kegiatan',
        organizer: task.organizer || 'Pengawas Sekolah',
        description: task.description || '',
        photo1: task.photo1,
        photo2: task.photo2,
        createdAt: task.createdAt
      });
    });
    
    return activities.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  } catch (error) {
    console.error('Fallback query error:', error);
    return [];
  }
};
`;
    
    const fallbackPath = path.join(__dirname, 'client/src/lib/reports-fallback.ts');
    
    try {
        fs.writeFileSync(fallbackPath, fallbackContent);
        console.log('✅ Created fallback query file');
        return true;
    } catch (error) {
        console.log('❌ Error creating fallback:', error.message);
        return false;
    }
}

// Generate emergency HTML page
function generateEmergencyPage() {
    console.log('\n5. 🚑 Generating Emergency Test Page...');
    
    const emergencyHTML = `
<!DOCTYPE html>
<html>
<head>
    <title>Emergency - Test Data Laporan</title>
    <style>
        body { font-family: Arial, sans-serif; margin: 20px; }
        .activity { border: 1px solid #ddd; margin: 10px 0; padding: 15px; border-radius: 5px; }
        .photo { width: 100px; height: 100px; object-fit: cover; margin: 5px; border: 1px solid #ccc; }
        .error { background-color: #f8d7da; padding: 10px; border-radius: 5px; margin: 10px 0; }
        .success { background-color: #d4edda; padding: 10px; border-radius: 5px; margin: 10px 0; }
    </style>
</head>
<body>
    <h1>🚑 Emergency Test - Data Laporan</h1>
    
    <div id="status"></div>
    <div id="activities"></div>
    
    <script>
        function testDataLaporan() {
            const statusDiv = document.getElementById('status');
            const activitiesDiv = document.getElementById('activities');
            
            try {
                // Check localStorage
                const localData = localStorage.getItem('local-database');
                if (!localData) {
                    statusDiv.innerHTML = '<div class="error">❌ No localStorage data found</div>';
                    return;
                }
                
                const database = JSON.parse(localData);
                
                // Check user
                const userData = localStorage.getItem('auth_user');
                if (!userData) {
                    statusDiv.innerHTML = '<div class="error">❌ No user session found</div>';
                    return;
                }
                
                const currentUser = JSON.parse(userData);
                const userId = currentUser.username === 'wawan' ? '1762696525337' : currentUser.id;
                
                // Get activities
                const activities = [];
                
                // Tasks
                const tasks = database.tasks?.filter(t => t.userId === userId) || [];
                tasks.forEach(task => {
                    activities.push({
                        id: task.id,
                        type: 'Tugas Pokok',
                        title: task.title || 'Tugas Harian',
                        date: task.date || task.createdAt,
                        photo1: task.photo1,
                        photo2: task.photo2
                    });
                });
                
                // Supervisions
                const supervisions = database.supervisions?.filter(s => s.userId === userId) || [];
                supervisions.forEach(supervision => {
                    const school = database.schools?.find(s => s.id === supervision.schoolId);
                    activities.push({
                        id: supervision.id,
                        type: 'Supervisi',
                        title: \`Supervisi \${school?.name || 'Sekolah'}\`,
                        date: supervision.date || supervision.createdAt,
                        photo1: supervision.photo1,
                        photo2: supervision.photo2
                    });
                });
                
                // Additional Tasks
                const additionalTasks = database.additionalTasks?.filter(t => t.userId === userId) || [];
                additionalTasks.forEach(task => {
                    activities.push({
                        id: task.id,
                        type: 'Tugas Tambahan',
                        title: task.name || task.title || 'Kegiatan Tambahan',
                        date: task.date || task.createdAt,
                        photo1: task.photo1,
                        photo2: task.photo2
                    });
                });
                
                // Sort by date
                activities.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
                
                // Display status
                statusDiv.innerHTML = \`
                    <div class="success">
                        ✅ Data found: \${activities.length} activities for user \${currentUser.username} (ID: \${userId})
                    </div>
                \`;
                
                // Display activities
                if (activities.length === 0) {
                    activitiesDiv.innerHTML = '<div class="error">❌ No activities found</div>';
                } else {
                    activitiesDiv.innerHTML = activities.map(activity => \`
                        <div class="activity">
                            <h3>\${activity.type}: \${activity.title}</h3>
                            <p>Date: \${activity.date}</p>
                            <div>
                                \${activity.photo1 ? \`<img class="photo" src="http://localhost:5000/uploads/\${activity.photo1}" alt="Photo 1" onerror="this.style.display='none'">\` : ''}
                                \${activity.photo2 ? \`<img class="photo" src="http://localhost:5000/uploads/\${activity.photo2}" alt="Photo 2" onerror="this.style.display='none'">\` : ''}
                            </div>
                        </div>
                    \`).join('');
                }
                
            } catch (error) {
                statusDiv.innerHTML = \`<div class="error">❌ Error: \${error.message}</div>\`;
            }
        }
        
        // Run test on load
        window.onload = testDataLaporan;
    </script>
</body>
</html>
`;
    
    const emergencyPath = path.join(__dirname, 'EMERGENCY_TEST_DATA_LAPORAN.html');
    
    try {
        fs.writeFileSync(emergencyPath, emergencyHTML);
        console.log('✅ Created emergency test page: EMERGENCY_TEST_DATA_LAPORAN.html');
        return true;
    } catch (error) {
        console.log('❌ Error creating emergency page:', error.message);
        return false;
    }
}

// Main function
async function main() {
    const results = {
        dataCheck: checkLocalStorageData(),
        backup: createEmergencyBackup(),
        queryFix: fixReportsQuery(),
        fallback: createFallbackQuery(),
        emergencyPage: generateEmergencyPage()
    };
    
    console.log('\n📊 EMERGENCY FIX RESULTS');
    console.log('========================');
    
    Object.entries(results).forEach(([key, result]) => {
        console.log(`${key}: ${result ? '✅ SUCCESS' : '❌ FAILED'}`);
    });
    
    const successCount = Object.values(results).filter(Boolean).length;
    const totalCount = Object.keys(results).length;
    
    console.log(`\n📈 Overall: ${successCount}/${totalCount} fixes applied`);
    
    if (results.dataCheck) {
        console.log('\n🎯 NEXT STEPS:');
        console.log('1. Refresh halaman laporan di browser');
        console.log('2. Buka EMERGENCY_TEST_DATA_LAPORAN.html untuk test manual');
        console.log('3. Check browser console untuk error messages');
        console.log('4. Jika masih bermasalah, restart server dengan: npm run dev');
    } else {
        console.log('\n⚠️ CRITICAL ISSUE:');
        console.log('Data tidak ditemukan di localStorage!');
        console.log('Perlu restore data dari backup atau input ulang.');
    }
}

// Run the emergency fix
main().catch(console.error);