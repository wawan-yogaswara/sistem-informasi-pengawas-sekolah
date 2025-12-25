#!/usr/bin/env node

/**
 * Emergency Fix: Foto Kegiatan Tidak Muncul & Browser Sync Issue
 * Script untuk mendiagnosa dan memperbaiki masalah foto dan perbedaan data antar browser
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

console.log('🚨 EMERGENCY FIX: FOTO & BROWSER SYNC ISSUE');
console.log('============================================');

// Check localStorage data and photos
function checkDataAndPhotos() {
    console.log('\n1. 📦 Checking Data & Photos...');
    
    const dbPath = path.join(__dirname, 'local-database.json');
    
    if (!fs.existsSync(dbPath)) {
        console.log('❌ File local-database.json tidak ditemukan!');
        return false;
    }
    
    try {
        const data = JSON.parse(fs.readFileSync(dbPath, 'utf8'));
        
        console.log('✅ local-database.json loaded successfully');
        
        // Check for wawan user specifically
        const wawan = data.users?.find(u => u.username === 'wawan');
        if (!wawan) {
            console.log('❌ User wawan tidak ditemukan!');
            return false;
        }
        
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
        
        // Check photos in each activity
        let totalPhotos = 0;
        let activitiesWithPhotos = 0;
        
        console.log('\n📸 Photo Analysis:');
        
        // Check tasks photos
        wawaActivities.tasks.forEach((task, i) => {
            const photos = [];
            if (task.photo1) photos.push(task.photo1);
            if (task.photo2) photos.push(task.photo2);
            
            if (photos.length > 0) {
                activitiesWithPhotos++;
                totalPhotos += photos.length;
                console.log(`   Task ${i+1}: ${task.title} - ${photos.length} foto(s)`);
                photos.forEach((photo, j) => {
                    console.log(`     - Photo${j+1}: ${photo.substring(0, 50)}...`);
                });
            }
        });
        
        // Check supervisions photos
        wawaActivities.supervisions.forEach((supervision, i) => {
            const photos = [];
            if (supervision.photo1) photos.push(supervision.photo1);
            if (supervision.photo2) photos.push(supervision.photo2);
            
            if (photos.length > 0) {
                activitiesWithPhotos++;
                totalPhotos += photos.length;
                console.log(`   Supervision ${i+1}: ${supervision.schoolId} - ${photos.length} foto(s)`);
                photos.forEach((photo, j) => {
                    console.log(`     - Photo${j+1}: ${photo.substring(0, 50)}...`);
                });
            }
        });
        
        // Check additional tasks photos
        wawaActivities.additionalTasks.forEach((task, i) => {
            const photos = [];
            if (task.photo1) photos.push(task.photo1);
            if (task.photo2) photos.push(task.photo2);
            
            if (photos.length > 0) {
                activitiesWithPhotos++;
                totalPhotos += photos.length;
                console.log(`   Additional Task ${i+1}: ${task.name} - ${photos.length} foto(s)`);
                photos.forEach((photo, j) => {
                    console.log(`     - Photo${j+1}: ${photo.substring(0, 50)}...`);
                });
            }
        });
        
        console.log(`\n📊 Photo Summary:`);
        console.log(`   - Total activities with photos: ${activitiesWithPhotos}`);
        console.log(`   - Total photos: ${totalPhotos}`);
        
        if (totalPhotos === 0) {
            console.log('❌ MASALAH DITEMUKAN: Tidak ada foto dalam data!');
            return false;
        } else {
            console.log('✅ Foto ditemukan dalam data');
            return true;
        }
        
    } catch (error) {
        console.log('❌ Error reading local-database.json:', error.message);
        return false;
    }
}

// Check server uploads directory
function checkUploadsDirectory() {
    console.log('\n2. 📁 Checking Uploads Directory...');
    
    const uploadsPath = path.join(__dirname, 'uploads');
    
    if (!fs.existsSync(uploadsPath)) {
        console.log('❌ Directory uploads tidak ditemukan!');
        console.log('💡 Membuat directory uploads...');
        try {
            fs.mkdirSync(uploadsPath, { recursive: true });
            console.log('✅ Directory uploads berhasil dibuat');
        } catch (error) {
            console.log('❌ Error creating uploads directory:', error.message);
            return false;
        }
    }
    
    try {
        const files = fs.readdirSync(uploadsPath);
        console.log(`✅ Directory uploads ditemukan dengan ${files.length} file(s)`);
        
        if (files.length > 0) {
            console.log('📋 Sample files:');
            files.slice(0, 5).forEach(file => {
                const filePath = path.join(uploadsPath, file);
                const stats = fs.statSync(filePath);
                console.log(`   - ${file} (${Math.round(stats.size / 1024)}KB)`);
            });
        }
        
        return true;
    } catch (error) {
        console.log('❌ Error reading uploads directory:', error.message);
        return false;
    }
}

// Create browser-specific localStorage sync script
function createBrowserSyncScript() {
    console.log('\n3. 🔄 Creating Browser Sync Script...');
    
    const syncScript = `
// Browser Sync Script untuk Opera, Chrome, Edge
// Jalankan di console browser untuk sync data localStorage

console.log('🔄 Starting Browser Sync...');

// Function to get localStorage data
function getLocalStorageData() {
    const data = {};
    for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        data[key] = localStorage.getItem(key);
    }
    return data;
}

// Function to set localStorage data
function setLocalStorageData(data) {
    Object.keys(data).forEach(key => {
        localStorage.setItem(key, data[key]);
    });
}

// Check current data
const currentData = getLocalStorageData();
console.log('📦 Current localStorage keys:', Object.keys(currentData));

// Check if local-database exists
const localDatabase = localStorage.getItem('local-database');
if (!localDatabase) {
    console.log('❌ No local-database found!');
    console.log('💡 Please copy data from working browser:');
    console.log('1. Open working browser (Chrome/Edge)');
    console.log('2. Go to Developer Tools > Console');
    console.log('3. Run: JSON.stringify(localStorage.getItem("local-database"))');
    console.log('4. Copy the result');
    console.log('5. In this browser, run: localStorage.setItem("local-database", [PASTE_HERE])');
} else {
    try {
        const database = JSON.parse(localDatabase);
        console.log('✅ local-database found');
        console.log('📊 Data structure:', {
            users: database.users?.length || 0,
            tasks: database.tasks?.length || 0,
            supervisions: database.supervisions?.length || 0,
            additionalTasks: database.additionalTasks?.length || 0
        });
        
        // Check wawan user data
        const wawan = database.users?.find(u => u.username === 'wawan');
        if (wawan) {
            const wawaUserId = '1762696525337';
            const wawaActivities = {
                tasks: database.tasks?.filter(t => t.userId === wawaUserId) || [],
                supervisions: database.supervisions?.filter(s => s.userId === wawaUserId) || [],
                additionalTasks: database.additionalTasks?.filter(t => t.userId === wawaUserId) || []
            };
            
            console.log('👤 Wawan activities:', {
                tasks: wawaActivities.tasks.length,
                supervisions: wawaActivities.supervisions.length,
                additionalTasks: wawaActivities.additionalTasks.length
            });
            
            // Count photos
            let totalPhotos = 0;
            [...wawaActivities.tasks, ...wawaActivities.supervisions, ...wawaActivities.additionalTasks].forEach(activity => {
                if (activity.photo1) totalPhotos++;
                if (activity.photo2) totalPhotos++;
            });
            
            console.log('📸 Total photos:', totalPhotos);
            
            if (totalPhotos === 0) {
                console.log('❌ No photos found in data!');
            } else {
                console.log('✅ Photos found in data');
            }
        } else {
            console.log('❌ Wawan user not found!');
        }
        
    } catch (error) {
        console.log('❌ Error parsing local-database:', error.message);
    }
}

// Check auth_user
const authUser = localStorage.getItem('auth_user');
if (!authUser) {
    console.log('❌ No auth_user found!');
    console.log('💡 Please login again');
} else {
    try {
        const user = JSON.parse(authUser);
        console.log('✅ auth_user found:', user.username);
    } catch (error) {
        console.log('❌ Error parsing auth_user:', error.message);
    }
}

console.log('🔄 Browser Sync Check Complete');
console.log('📋 Browser Info:', {
    userAgent: navigator.userAgent,
    browser: navigator.userAgent.includes('Chrome') ? 'Chrome' : 
             navigator.userAgent.includes('Firefox') ? 'Firefox' : 
             navigator.userAgent.includes('Safari') ? 'Safari' : 
             navigator.userAgent.includes('Edge') ? 'Edge' : 
             navigator.userAgent.includes('Opera') ? 'Opera' : 'Unknown',
    localStorage: typeof(Storage) !== "undefined",
    currentURL: window.location.href
});
`;
    
    const scriptPath = path.join(__dirname, 'browser-sync-debug.js');
    
    try {
        fs.writeFileSync(scriptPath, syncScript);
        console.log('✅ Created browser sync script: browser-sync-debug.js');
        return true;
    } catch (error) {
        console.log('❌ Error creating sync script:', error.message);
        return false;
    }
}

// Fix photo paths in reports.tsx
function fixPhotoPathsInReports() {
    console.log('\n4. 🖼️ Fixing Photo Paths in Reports...');
    
    const reportsPath = path.join(__dirname, 'client/src/pages/reports.tsx');
    
    if (!fs.existsSync(reportsPath)) {
        console.log('❌ reports.tsx not found');
        return false;
    }
    
    try {
        let content = fs.readFileSync(reportsPath, 'utf8');
        
        // Enhanced photo error handling
        const photoErrorHandling = `
                                onError={(e) => {
                                  console.log('❌ Error loading photo:', activity.photo1);
                                  const target = e.currentTarget as HTMLImageElement;
                                  
                                  // Try multiple paths in sequence
                                  if (target.src.includes('localhost:5000')) {
                                    console.log('🔄 Trying localhost:3000...');
                                    target.src = \`http://localhost:3000/uploads/\${activity.photo1}\`;
                                  } else if (target.src.includes('localhost:3000')) {
                                    console.log('🔄 Trying relative path...');
                                    target.src = \`/uploads/\${activity.photo1}\`;
                                  } else if (target.src.includes('/uploads/')) {
                                    console.log('🔄 Trying base64 fallback...');
                                    // Check if it's a base64 string in the data
                                    if (activity.photo1.startsWith('data:')) {
                                      target.src = activity.photo1;
                                    } else {
                                      console.log('❌ All paths failed, showing placeholder');
                                      target.style.display = 'none';
                                      // Show error message
                                      const errorDiv = document.createElement('div');
                                      errorDiv.className = 'w-full h-48 bg-gray-100 border rounded-md flex items-center justify-center text-gray-500 text-sm';
                                      errorDiv.innerHTML = \`<div class="text-center"><div>📷</div><div>Foto tidak dapat dimuat</div><div class="text-xs">\${activity.photo1}</div></div>\`;
                                      target.parentNode?.replaceChild(errorDiv, target);
                                    }
                                  }
                                }}`;
        
        // Replace existing onError handlers
        content = content.replace(
            /onError=\{[^}]+\}/g,
            photoErrorHandling.trim()
        );
        
        // Add debug info for photo loading
        const debugPhotoInfo = `
        // Debug info for photo loading
        console.log('🖼️ Loading photos for activity:', activity.id, {
          photo1: activity.photo1 ? (activity.photo1.startsWith('data:') ? 'base64' : activity.photo1) : null,
          photo2: activity.photo2 ? (activity.photo2.startsWith('data:') ? 'base64' : activity.photo2) : null,
          browser: navigator.userAgent.includes('Opera') ? 'Opera' : 
                   navigator.userAgent.includes('Chrome') ? 'Chrome' : 
                   navigator.userAgent.includes('Edge') ? 'Edge' : 'Other'
        });`;
        
        // Add debug info before photo rendering
        content = content.replace(
            '{(activity.photo1 || activity.photo2) && (',
            `{(() => {
              ${debugPhotoInfo}
              return (activity.photo1 || activity.photo2);
            })() && (`
        );
        
        fs.writeFileSync(reportsPath, content);
        console.log('✅ Enhanced photo error handling in reports.tsx');
        return true;
        
    } catch (error) {
        console.log('❌ Error fixing photo paths:', error.message);
        return false;
    }
}

// Create emergency HTML test page for browser comparison
function createBrowserTestPage() {
    console.log('\n5. 🌐 Creating Browser Test Page...');
    
    const testHTML = `
<!DOCTYPE html>
<html>
<head>
    <title>Emergency - Browser Comparison Test</title>
    <style>
        body { font-family: Arial, sans-serif; margin: 20px; }
        .browser-info { background: #e3f2fd; padding: 15px; margin: 10px 0; border-radius: 5px; }
        .activity { border: 1px solid #ddd; margin: 10px 0; padding: 15px; border-radius: 5px; }
        .photo { width: 150px; height: 150px; object-fit: cover; margin: 5px; border: 1px solid #ccc; }
        .error { background-color: #f8d7da; padding: 10px; border-radius: 5px; margin: 10px 0; }
        .success { background-color: #d4edda; padding: 10px; border-radius: 5px; margin: 10px 0; }
        .warning { background-color: #fff3cd; padding: 10px; border-radius: 5px; margin: 10px 0; }
        .photo-container { display: flex; flex-wrap: wrap; gap: 10px; }
        .photo-item { text-align: center; }
        .photo-caption { font-size: 12px; color: #666; margin-top: 5px; }
    </style>
</head>
<body>
    <h1>🌐 Emergency Browser Comparison Test</h1>
    
    <div id="browser-info" class="browser-info"></div>
    <div id="status"></div>
    <div id="activities"></div>
    
    <script>
        function detectBrowser() {
            const ua = navigator.userAgent;
            if (ua.includes('Opera') || ua.includes('OPR')) return 'Opera';
            if (ua.includes('Chrome')) return 'Chrome';
            if (ua.includes('Edge')) return 'Edge';
            if (ua.includes('Firefox')) return 'Firefox';
            if (ua.includes('Safari')) return 'Safari';
            return 'Unknown';
        }
        
        function testBrowserData() {
            const browserInfoDiv = document.getElementById('browser-info');
            const statusDiv = document.getElementById('status');
            const activitiesDiv = document.getElementById('activities');
            
            // Display browser info
            const browser = detectBrowser();
            browserInfoDiv.innerHTML = \`
                <h3>🔍 Browser Information</h3>
                <p><strong>Browser:</strong> \${browser}</p>
                <p><strong>User Agent:</strong> \${navigator.userAgent}</p>
                <p><strong>URL:</strong> \${window.location.href}</p>
                <p><strong>localStorage Support:</strong> \${typeof(Storage) !== "undefined" ? '✅ Yes' : '❌ No'}</p>
            \`;
            
            try {
                // Check localStorage
                const localData = localStorage.getItem('local-database');
                if (!localData) {
                    statusDiv.innerHTML = '<div class="error">❌ No localStorage data found in ' + browser + '</div>';
                    return;
                }
                
                const database = JSON.parse(localData);
                
                // Check user
                const userData = localStorage.getItem('auth_user');
                if (!userData) {
                    statusDiv.innerHTML = '<div class="error">❌ No user session found in ' + browser + '</div>';
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
                
                // Count photos
                let totalPhotos = 0;
                activities.forEach(activity => {
                    if (activity.photo1) totalPhotos++;
                    if (activity.photo2) totalPhotos++;
                });
                
                // Display status
                const statusClass = activities.length === 0 ? 'error' : totalPhotos === 0 ? 'warning' : 'success';
                statusDiv.innerHTML = \`
                    <div class="\${statusClass}">
                        <h3>📊 Data Status in \${browser}</h3>
                        <p><strong>User:</strong> \${currentUser.username} (ID: \${userId})</p>
                        <p><strong>Total Activities:</strong> \${activities.length}</p>
                        <p><strong>Total Photos:</strong> \${totalPhotos}</p>
                        <p><strong>Status:</strong> \${activities.length === 0 ? '❌ No Data' : totalPhotos === 0 ? '⚠️ No Photos' : '✅ Data & Photos Found'}</p>
                    </div>
                \`;
                
                // Display activities
                if (activities.length === 0) {
                    activitiesDiv.innerHTML = '<div class="error">❌ No activities found in ' + browser + '</div>';
                } else {
                    activitiesDiv.innerHTML = '<h3>📋 Activities (' + activities.length + ')</h3>' + 
                        activities.map(activity => \`
                            <div class="activity">
                                <h4>\${activity.type}: \${activity.title}</h4>
                                <p><strong>Date:</strong> \${activity.date}</p>
                                <div class="photo-container">
                                    \${activity.photo1 ? \`
                                        <div class="photo-item">
                                            <img class="photo" 
                                                 src="\${activity.photo1.startsWith('data:') ? activity.photo1 : 'http://localhost:5000/uploads/' + activity.photo1}" 
                                                 alt="Photo 1" 
                                                 onload="console.log('✅ Photo1 loaded in \${browser}:', '\${activity.photo1.substring(0, 30)}...')"
                                                 onerror="handlePhotoError(this, '\${activity.photo1}', '\${browser}', 1)">
                                            <div class="photo-caption">Photo 1</div>
                                        </div>
                                    \` : ''}
                                    \${activity.photo2 ? \`
                                        <div class="photo-item">
                                            <img class="photo" 
                                                 src="\${activity.photo2.startsWith('data:') ? activity.photo2 : 'http://localhost:5000/uploads/' + activity.photo2}" 
                                                 alt="Photo 2" 
                                                 onload="console.log('✅ Photo2 loaded in \${browser}:', '\${activity.photo2.substring(0, 30)}...')"
                                                 onerror="handlePhotoError(this, '\${activity.photo2}', '\${browser}', 2)">
                                            <div class="photo-caption">Photo 2</div>
                                        </div>
                                    \` : ''}
                                </div>
                            </div>
                        \`).join('');
                }
                
            } catch (error) {
                statusDiv.innerHTML = \`<div class="error">❌ Error in \${browser}: \${error.message}</div>\`;
                console.error('Browser test error:', error);
            }
        }
        
        function handlePhotoError(img, photoPath, browser, photoNum) {
            console.log(\`❌ Photo\${photoNum} error in \${browser}:\`, photoPath);
            
            // Try alternative paths
            if (img.src.includes('localhost:5000')) {
                console.log('🔄 Trying localhost:3000...');
                img.src = \`http://localhost:3000/uploads/\${photoPath}\`;
            } else if (img.src.includes('localhost:3000')) {
                console.log('🔄 Trying relative path...');
                img.src = \`/uploads/\${photoPath}\`;
            } else {
                console.log('❌ All paths failed, showing error');
                img.style.display = 'none';
                const errorDiv = document.createElement('div');
                errorDiv.className = 'photo error';
                errorDiv.innerHTML = \`<div style="display: flex; align-items: center; justify-content: center; height: 100%; flex-direction: column;"><div>📷</div><div>Error in \${browser}</div><div style="font-size: 10px;">\${photoPath.substring(0, 20)}...</div></div>\`;
                img.parentNode.replaceChild(errorDiv, img);
            }
        }
        
        // Run test on load
        window.onload = testBrowserData;
        
        // Add refresh button
        document.body.insertAdjacentHTML('afterbegin', '<button onclick="location.reload()" style="margin-bottom: 20px; padding: 10px 20px; background: #007bff; color: white; border: none; border-radius: 5px; cursor: pointer;">🔄 Refresh Test</button>');
    </script>
</body>
</html>
`;
    
    const testPath = path.join(__dirname, 'EMERGENCY_BROWSER_COMPARISON_TEST.html');
    
    try {
        fs.writeFileSync(testPath, testHTML);
        console.log('✅ Created browser test page: EMERGENCY_BROWSER_COMPARISON_TEST.html');
        return true;
    } catch (error) {
        console.log('❌ Error creating test page:', error.message);
        return false;
    }
}

// Main function
async function main() {
    const results = {
        dataCheck: checkDataAndPhotos(),
        uploadsCheck: checkUploadsDirectory(),
        syncScript: createBrowserSyncScript(),
        photoFix: fixPhotoPathsInReports(),
        testPage: createBrowserTestPage()
    };
    
    console.log('\n📊 EMERGENCY FIX RESULTS');
    console.log('========================');
    
    Object.entries(results).forEach(([key, result]) => {
        console.log(`${key}: ${result ? '✅ SUCCESS' : '❌ FAILED'}`);
    });
    
    const successCount = Object.values(results).filter(Boolean).length;
    const totalCount = Object.keys(results).length;
    
    console.log(`\n📈 Overall: ${successCount}/${totalCount} fixes applied`);
    
    console.log('\n🎯 NEXT STEPS:');
    console.log('1. Buka EMERGENCY_BROWSER_COMPARISON_TEST.html di setiap browser');
    console.log('2. Bandingkan hasil di Chrome, Edge, dan Opera');
    console.log('3. Jika Opera menunjukkan data nol:');
    console.log('   - Buka Developer Tools > Console');
    console.log('   - Jalankan script dari browser-sync-debug.js');
    console.log('   - Copy data localStorage dari browser yang bekerja');
    console.log('4. Check console untuk error loading foto');
    console.log('5. Pastikan server berjalan di port 5000 atau 3000');
    
    console.log('\n🔧 TROUBLESHOOTING:');
    console.log('- Jika foto tidak muncul: Check path /uploads/ dan server status');
    console.log('- Jika data berbeda antar browser: Sync localStorage manual');
    console.log('- Jika Opera kosong: Clear cache dan reload localStorage');
}

// Run the emergency fix
main().catch(console.error);