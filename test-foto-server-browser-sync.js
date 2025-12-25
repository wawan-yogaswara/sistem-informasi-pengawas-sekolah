#!/usr/bin/env node

/**
 * Test Foto Server & Browser Sync
 * Script untuk test server foto dan sync data antar browser
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

console.log('🧪 TEST FOTO SERVER & BROWSER SYNC');
console.log('==================================');

// Test server accessibility
function testServerPorts() {
    console.log('\n1. 🌐 Testing Server Ports...');
    
    const testPorts = [5000, 3000];
    const testImage = '1762824574393-359380420.jpeg'; // Known image from data
    
    testPorts.forEach(port => {
        // Create test HTML to check server
        const testHTML = `
<!DOCTYPE html>
<html>
<head><title>Server Test Port ${port}</title></head>
<body>
    <h3>Testing Server Port ${port}</h3>
    <img id="testImg${port}" src="http://localhost:${port}/uploads/${testImage}" 
         onload="console.log('✅ Port ${port} accessible'); document.getElementById('status${port}').innerHTML = '✅ Accessible';"
         onerror="console.log('❌ Port ${port} not accessible'); document.getElementById('status${port}').innerHTML = '❌ Not Accessible';"
         style="max-width: 200px; border: 1px solid #ccc;">
    <div id="status${port}">Testing...</div>
    <script>
        setTimeout(() => {
            const status = document.getElementById('status${port}');
            if (status.innerHTML === 'Testing...') {
                status.innerHTML = '⏱️ Timeout';
            }
        }, 5000);
    </script>
</body>
</html>`;
        
        const testPath = path.join(__dirname, `test-server-port-${port}.html`);
        fs.writeFileSync(testPath, testHTML);
        console.log(`✅ Created test file: test-server-port-${port}.html`);
    });
}

// Check uploads directory and files
function checkUploadsDirectory() {
    console.log('\n2. 📁 Checking Uploads Directory...');
    
    const uploadsPath = path.join(__dirname, 'uploads');
    
    if (!fs.existsSync(uploadsPath)) {
        console.log('❌ Uploads directory not found');
        return false;
    }
    
    try {
        const files = fs.readdirSync(uploadsPath);
        console.log(`✅ Found ${files.length} files in uploads directory`);
        
        if (files.length > 0) {
            console.log('📋 Sample files:');
            files.slice(0, 10).forEach(file => {
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

// Create browser sync test page
function createBrowserSyncTest() {
    console.log('\n3. 🔄 Creating Browser Sync Test...');
    
    const syncTestHTML = `
<!DOCTYPE html>
<html>
<head>
    <title>Browser Sync Test - Foto Laporan</title>
    <style>
        body { font-family: Arial, sans-serif; margin: 20px; background: #f5f5f5; }
        .container { max-width: 1200px; margin: 0 auto; background: white; padding: 20px; border-radius: 10px; }
        .browser-info { background: #e3f2fd; padding: 15px; margin: 10px 0; border-radius: 5px; }
        .status { padding: 15px; margin: 10px 0; border-radius: 5px; }
        .success { background: #d4edda; border-left: 4px solid #28a745; }
        .error { background: #f8d7da; border-left: 4px solid #dc3545; }
        .warning { background: #fff3cd; border-left: 4px solid #ffc107; }
        .btn { background: #007bff; color: white; border: none; padding: 10px 20px; border-radius: 5px; cursor: pointer; margin: 5px; }
        .btn:hover { background: #0056b3; }
        .btn-success { background: #28a745; }
        .btn-danger { background: #dc3545; }
        .photo-test { display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 15px; margin: 20px 0; }
        .photo-item { text-align: center; background: #f8f9fa; padding: 15px; border-radius: 8px; }
        .photo-item img { width: 100%; height: 150px; object-fit: cover; border-radius: 5px; }
        .debug-info { background: #f8f9fa; border: 1px solid #dee2e6; padding: 15px; margin: 15px 0; font-family: monospace; font-size: 12px; max-height: 300px; overflow-y: auto; }
    </style>
</head>
<body>
    <div class="container">
        <h1>🧪 Browser Sync Test - Foto Laporan</h1>
        
        <div class="browser-info" id="browserInfo"></div>
        
        <div style="margin: 20px 0;">
            <button class="btn" onclick="testLocalStorage()">📦 Test localStorage</button>
            <button class="btn btn-success" onclick="testPhotoServer()">📷 Test Server</button>
            <button class="btn btn-danger" onclick="syncFromChrome()">🔄 Sync dari Chrome</button>
            <button class="btn" onclick="clearDebugLog()">🗑️ Clear Log</button>
        </div>
        
        <div id="status"></div>
        <div id="photoTest" class="photo-test"></div>
        <div id="debugLog" class="debug-info"></div>
    </div>
    
    <script>
        let debugLog = [];
        
        function log(message) {
            console.log(message);
            debugLog.push(new Date().toLocaleTimeString() + ': ' + message);
            updateDebugLog();
        }
        
        function updateDebugLog() {
            document.getElementById('debugLog').innerHTML = debugLog.slice(-20).join('<br>');
        }
        
        function clearDebugLog() {
            debugLog = [];
            updateDebugLog();
        }
        
        function detectBrowser() {
            const ua = navigator.userAgent;
            if (ua.includes('Opera') || ua.includes('OPR')) return 'Opera';
            if (ua.includes('Chrome') && !ua.includes('Edge')) return 'Chrome';
            if (ua.includes('Edge')) return 'Edge';
            if (ua.includes('Firefox')) return 'Firefox';
            if (ua.includes('Safari') && !ua.includes('Chrome')) return 'Safari';
            return 'Unknown';
        }
        
        function initBrowserInfo() {
            const browser = detectBrowser();
            document.getElementById('browserInfo').innerHTML = \`
                <h3>🌐 Browser Information</h3>
                <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); gap: 10px;">
                    <div><strong>Browser:</strong> \${browser}</div>
                    <div><strong>localStorage:</strong> \${typeof(Storage) !== "undefined" ? '✅ Supported' : '❌ Not Supported'}</div>
                    <div><strong>URL:</strong> \${window.location.href}</div>
                    <div><strong>Timestamp:</strong> \${new Date().toLocaleString()}</div>
                </div>
            \`;
            log(\`🌐 Browser detected: \${browser}\`);
        }
        
        function testLocalStorage() {
            log('📦 Testing localStorage data...');
            const statusDiv = document.getElementById('status');
            
            try {
                const localData = localStorage.getItem('local-database');
                const authUser = localStorage.getItem('auth_user');
                
                if (!localData) {
                    statusDiv.innerHTML = '<div class="status error">❌ No local-database found</div>';
                    log('❌ No local-database in localStorage');
                    return;
                }
                
                if (!authUser) {
                    statusDiv.innerHTML = '<div class="status error">❌ No auth_user found</div>';
                    log('❌ No auth_user in localStorage');
                    return;
                }
                
                const database = JSON.parse(localData);
                const user = JSON.parse(authUser);
                const userId = user.username === 'wawan' ? '1762696525337' : user.id;
                
                // Count activities
                const tasks = database.tasks?.filter(t => t.userId === userId) || [];
                const supervisions = database.supervisions?.filter(s => s.userId === userId) || [];
                const additionalTasks = database.additionalTasks?.filter(t => t.userId === userId) || [];
                
                const totalActivities = tasks.length + supervisions.length + additionalTasks.length;
                
                // Count photos
                let totalPhotos = 0;
                [...tasks, ...supervisions, ...additionalTasks].forEach(activity => {
                    if (activity.photo1) totalPhotos++;
                    if (activity.photo2) totalPhotos++;
                });
                
                statusDiv.innerHTML = \`
                    <div class="status success">
                        <h3>✅ localStorage Data Found</h3>
                        <p><strong>User:</strong> \${user.username} (ID: \${userId})</p>
                        <p><strong>Total Activities:</strong> \${totalActivities}</p>
                        <p><strong>Total Photos:</strong> \${totalPhotos}</p>
                        <p><strong>Tasks:</strong> \${tasks.length} | <strong>Supervisions:</strong> \${supervisions.length} | <strong>Additional:</strong> \${additionalTasks.length}</p>
                    </div>
                \`;
                
                log(\`✅ Data found: \${totalActivities} activities, \${totalPhotos} photos\`);
                
                // Test some photos
                testSamplePhotos([...tasks, ...supervisions, ...additionalTasks]);
                
            } catch (error) {
                statusDiv.innerHTML = \`<div class="status error">❌ Error: \${error.message}</div>\`;
                log(\`❌ localStorage test error: \${error.message}\`);
            }
        }
        
        function testSamplePhotos(activities) {
            log('📸 Testing sample photos...');
            const photoTestDiv = document.getElementById('photoTest');
            
            // Get activities with photos
            const activitiesWithPhotos = activities.filter(a => a.photo1 || a.photo2);
            const sampleActivities = activitiesWithPhotos.slice(0, 6); // Test first 6
            
            if (sampleActivities.length === 0) {
                photoTestDiv.innerHTML = '<div class="status warning">⚠️ No photos found to test</div>';
                return;
            }
            
            photoTestDiv.innerHTML = '<h3>📸 Photo Loading Test</h3>' + 
                sampleActivities.map((activity, index) => {
                    const photos = [];
                    if (activity.photo1) photos.push({ src: activity.photo1, label: 'Photo 1' });
                    if (activity.photo2) photos.push({ src: activity.photo2, label: 'Photo 2' });
                    
                    return photos.map(photo => \`
                        <div class="photo-item">
                            <h4>\${activity.title || activity.name || 'Activity'}</h4>
                            <img src="\${photo.src.startsWith('data:') ? photo.src : 'http://localhost:5000/uploads/' + photo.src}" 
                                 alt="\${photo.label}"
                                 onload="handlePhotoLoad('\${photo.src}', '\${photo.label}')"
                                 onerror="handlePhotoError(this, '\${photo.src}', '\${photo.label}')">
                            <div>\${photo.label}</div>
                            <div id="status-\${photo.src.substring(0, 10)}" style="font-size: 12px; margin-top: 5px;">Loading...</div>
                        </div>
                    \`).join('');
                }).join('');
        }
        
        function handlePhotoLoad(photoSrc, label) {
            const shortSrc = photoSrc.startsWith('data:') ? 'base64' : photoSrc.substring(0, 20) + '...';
            log(\`✅ \${label} loaded: \${shortSrc}\`);
            
            const statusId = 'status-' + photoSrc.substring(0, 10);
            const statusEl = document.getElementById(statusId);
            if (statusEl) statusEl.innerHTML = '✅ Loaded';
        }
        
        function handlePhotoError(img, photoSrc, label) {
            const shortSrc = photoSrc.substring(0, 20) + '...';
            log(\`❌ \${label} error: \${shortSrc}\`);
            
            // Try fallback paths
            if (img.src.includes('localhost:5000')) {
                log('🔄 Trying localhost:3000...');
                img.src = \`http://localhost:3000/uploads/\${photoSrc}\`;
            } else if (img.src.includes('localhost:3000')) {
                log('🔄 Trying relative path...');
                img.src = \`/uploads/\${photoSrc}\`;
            } else {
                log(\`❌ All paths failed for \${label}\`);
                img.style.display = 'none';
                
                const errorDiv = document.createElement('div');
                errorDiv.style.cssText = 'width: 100%; height: 150px; background: #f8d7da; border: 1px solid #f5c6cb; border-radius: 5px; display: flex; align-items: center; justify-content: center; color: #721c24; font-size: 12px; text-align: center;';
                errorDiv.innerHTML = \`<div><div style="font-size: 24px;">📷</div><div>Error</div><div>\${shortSrc}</div></div>\`;
                
                img.parentNode.replaceChild(errorDiv, img);
                
                const statusId = 'status-' + photoSrc.substring(0, 10);
                const statusEl = document.getElementById(statusId);
                if (statusEl) statusEl.innerHTML = '❌ Failed';
            }
        }
        
        function testPhotoServer() {
            log('🌐 Testing photo server...');
            const testPorts = [5000, 3000];
            const testImage = '1762824574393-359380420.jpeg'; // Known image
            
            testPorts.forEach(port => {
                const img = new Image();
                img.onload = () => log(\`✅ Server port \${port} accessible\`);
                img.onerror = () => log(\`❌ Server port \${port} not accessible\`);
                img.src = \`http://localhost:\${port}/uploads/\${testImage}\`;
            });
        }
        
        function syncFromChrome() {
            const browser = detectBrowser();
            
            if (browser === 'Chrome') {
                alert('Anda sudah di Chrome! Buka browser lain untuk sync.');
                return;
            }
            
            const instructions = \`
Untuk sync data dari Chrome ke \${browser}:

1. Buka Chrome
2. Buka halaman yang sama
3. Buka Developer Tools (F12)
4. Ke tab Console
5. Jalankan: JSON.stringify(localStorage.getItem('local-database'))
6. Copy hasilnya dan paste di prompt berikutnya
            \`;
            
            alert(instructions);
            
            const chromeData = prompt('Paste data local-database dari Chrome:');
            if (chromeData) {
                try {
                    JSON.parse(chromeData); // Validate
                    localStorage.setItem('local-database', chromeData);
                    
                    const authData = prompt('Jika perlu, paste juga auth_user data (atau skip):');
                    if (authData) {
                        localStorage.setItem('auth_user', authData);
                    }
                    
                    log(\`✅ Data berhasil di-sync ke \${browser}\`);
                    alert('Data berhasil di-sync! Klik "Test localStorage" untuk verify.');
                    
                } catch (error) {
                    alert('Error: Data tidak valid. Pastikan format JSON benar.');
                    log(\`❌ Sync error: \${error.message}\`);
                }
            }
        }
        
        // Initialize on load
        window.onload = () => {
            initBrowserInfo();
            log('🚀 Browser sync test page loaded');
        };
    </script>
</body>
</html>`;
    
    const testPath = path.join(__dirname, 'TEST_FOTO_SERVER_BROWSER_SYNC.html');
    
    try {
        fs.writeFileSync(testPath, syncTestHTML);
        console.log('✅ Created browser sync test: TEST_FOTO_SERVER_BROWSER_SYNC.html');
        return true;
    } catch (error) {
        console.log('❌ Error creating test page:', error.message);
        return false;
    }
}

// Check data in local-database.json
function checkLocalDatabaseData() {
    console.log('\n4. 📊 Checking Local Database Data...');
    
    const dbPath = path.join(__dirname, 'local-database.json');
    
    if (!fs.existsSync(dbPath)) {
        console.log('❌ local-database.json not found');
        return false;
    }
    
    try {
        const data = JSON.parse(fs.readFileSync(dbPath, 'utf8'));
        
        // Check wawan user
        const wawan = data.users?.find(u => u.username === 'wawan');
        if (!wawan) {
            console.log('❌ User wawan not found');
            return false;
        }
        
        console.log('✅ User wawan found:', wawan.id);
        
        const wawaUserId = '1762696525337';
        const activities = {
            tasks: data.tasks?.filter(t => t.userId === wawaUserId) || [],
            supervisions: data.supervisions?.filter(s => s.userId === wawaUserId) || [],
            additionalTasks: data.additionalTasks?.filter(t => t.userId === wawaUserId) || []
        };
        
        console.log('📊 Wawan activities:');
        console.log(`   - Tasks: ${activities.tasks.length}`);
        console.log(`   - Supervisions: ${activities.supervisions.length}`);
        console.log(`   - Additional Tasks: ${activities.additionalTasks.length}`);
        
        // Count photos
        let totalPhotos = 0;
        let activitiesWithPhotos = 0;
        
        [...activities.tasks, ...activities.supervisions, ...activities.additionalTasks].forEach(activity => {
            const photos = [];
            if (activity.photo1) photos.push(activity.photo1);
            if (activity.photo2) photos.push(activity.photo2);
            
            if (photos.length > 0) {
                activitiesWithPhotos++;
                totalPhotos += photos.length;
            }
        });
        
        console.log(`📸 Photo summary:`);
        console.log(`   - Activities with photos: ${activitiesWithPhotos}`);
        console.log(`   - Total photos: ${totalPhotos}`);
        
        if (totalPhotos > 0) {
            console.log('✅ Photos found in data');
            
            // Show sample photo paths
            console.log('📋 Sample photo paths:');
            [...activities.tasks, ...activities.supervisions, ...activities.additionalTasks]
                .filter(a => a.photo1 || a.photo2)
                .slice(0, 3)
                .forEach((activity, i) => {
                    if (activity.photo1) {
                        const shortPath = activity.photo1.startsWith('data:') ? 'base64' : activity.photo1;
                        console.log(`   ${i+1}. Photo1: ${shortPath.substring(0, 50)}...`);
                    }
                    if (activity.photo2) {
                        const shortPath = activity.photo2.startsWith('data:') ? 'base64' : activity.photo2;
                        console.log(`   ${i+1}. Photo2: ${shortPath.substring(0, 50)}...`);
                    }
                });
        } else {
            console.log('❌ No photos found in data');
        }
        
        return true;
        
    } catch (error) {
        console.log('❌ Error reading local-database.json:', error.message);
        return false;
    }
}

// Main execution
async function main() {
    const results = {
        serverTest: testServerPorts(),
        uploadsCheck: checkUploadsDirectory(),
        dataCheck: checkLocalDatabaseData(),
        syncTest: createBrowserSyncTest()
    };
    
    console.log('\n📊 TEST RESULTS');
    console.log('================');
    
    Object.entries(results).forEach(([key, result]) => {
        console.log(`${key}: ${result ? '✅ SUCCESS' : '❌ FAILED'}`);
    });
    
    const successCount = Object.values(results).filter(Boolean).length;
    const totalCount = Object.keys(results).length;
    
    console.log(`\n📈 Overall: ${successCount}/${totalCount} tests passed`);
    
    console.log('\n🎯 NEXT STEPS:');
    console.log('1. Buka TEST_FOTO_SERVER_BROWSER_SYNC.html di setiap browser');
    console.log('2. Test localStorage data dengan tombol "Test localStorage"');
    console.log('3. Test server dengan tombol "Test Server"');
    console.log('4. Jika Opera data kosong, gunakan "Sync dari Chrome"');
    console.log('5. Check console browser untuk debug info');
    
    console.log('\n🔧 TROUBLESHOOTING:');
    console.log('- Server not accessible: Start dengan `npm run dev`');
    console.log('- Opera data nol: Sync localStorage dari Chrome');
    console.log('- Foto error: Check uploads folder dan file permissions');
    console.log('- Browser differences: Clear cache dan reload');
}

// Run the test
main().catch(console.error);