#!/usr/bin/env node

/**
 * Script untuk menguji server backend dan foto pada halaman laporan
 * Menguji koneksi server, endpoint uploads, dan path foto
 */

import http from 'http';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

console.log('🔍 TESTING SERVER & FOTO LAPORAN');
console.log('================================');

// Test server health
async function testServerHealth() {
    console.log('\n1. 🏥 Testing Server Health...');
    
    return new Promise((resolve) => {
        const req = http.get('http://localhost:5000/api/health', (res) => {
            let data = '';
            res.on('data', chunk => data += chunk);
            res.on('end', () => {
                try {
                    const health = JSON.parse(data);
                    console.log('✅ Server Health:', health);
                    resolve(true);
                } catch (e) {
                    console.log('❌ Server Health Error:', e.message);
                    resolve(false);
                }
            });
        });
        
        req.on('error', (err) => {
            console.log('❌ Server tidak berjalan di port 5000:', err.message);
            resolve(false);
        });
        
        req.setTimeout(5000, () => {
            console.log('❌ Server timeout');
            req.destroy();
            resolve(false);
        });
    });
}

// Test uploads directory
function testUploadsDirectory() {
    console.log('\n2. 📁 Testing Uploads Directory...');
    
    const uploadsPath = path.join(__dirname, 'uploads');
    
    if (!fs.existsSync(uploadsPath)) {
        console.log('❌ Folder uploads tidak ditemukan:', uploadsPath);
        return false;
    }
    
    console.log('✅ Folder uploads ditemukan:', uploadsPath);
    
    // List files in uploads
    try {
        const files = fs.readdirSync(uploadsPath);
        console.log(`📸 Ditemukan ${files.length} file di uploads:`);
        
        const imageFiles = files.filter(file => 
            file.toLowerCase().match(/\.(jpg|jpeg|png|gif)$/)
        );
        
        console.log(`🖼️ File gambar: ${imageFiles.length}`);
        
        if (imageFiles.length > 0) {
            console.log('📋 Sample files:');
            imageFiles.slice(0, 5).forEach(file => {
                const filePath = path.join(uploadsPath, file);
                const stats = fs.statSync(filePath);
                console.log(`   - ${file} (${Math.round(stats.size / 1024)}KB)`);
            });
        }
        
        return imageFiles.length > 0;
    } catch (error) {
        console.log('❌ Error reading uploads directory:', error.message);
        return false;
    }
}

// Test uploads endpoint
async function testUploadsEndpoint() {
    console.log('\n3. 🌐 Testing Uploads Endpoint...');
    
    const uploadsPath = path.join(__dirname, 'uploads');
    
    if (!fs.existsSync(uploadsPath)) {
        console.log('❌ Tidak ada folder uploads untuk ditest');
        return false;
    }
    
    const files = fs.readdirSync(uploadsPath);
    const imageFiles = files.filter(file => 
        file.toLowerCase().match(/\.(jpg|jpeg|png|gif)$/)
    );
    
    if (imageFiles.length === 0) {
        console.log('❌ Tidak ada file gambar untuk ditest');
        return false;
    }
    
    // Test first image file
    const testFile = imageFiles[0];
    const testUrl = `http://localhost:5000/uploads/${testFile}`;
    
    console.log(`🧪 Testing URL: ${testUrl}`);
    
    return new Promise((resolve) => {
        const req = http.get(testUrl, (res) => {
            console.log(`📡 Response status: ${res.statusCode}`);
            console.log(`📋 Content-Type: ${res.headers['content-type']}`);
            console.log(`📏 Content-Length: ${res.headers['content-length']}`);
            
            if (res.statusCode === 200) {
                console.log('✅ Uploads endpoint working!');
                resolve(true);
            } else {
                console.log('❌ Uploads endpoint failed');
                resolve(false);
            }
        });
        
        req.on('error', (err) => {
            console.log('❌ Uploads endpoint error:', err.message);
            resolve(false);
        });
        
        req.setTimeout(5000, () => {
            console.log('❌ Uploads endpoint timeout');
            req.destroy();
            resolve(false);
        });
    });
}

// Test localStorage data
function testLocalStorageData() {
    console.log('\n4. 💾 Testing localStorage Data...');
    
    const dbPath = path.join(__dirname, 'local-database.json');
    
    if (!fs.existsSync(dbPath)) {
        console.log('❌ File local-database.json tidak ditemukan');
        return false;
    }
    
    try {
        const data = JSON.parse(fs.readFileSync(dbPath, 'utf8'));
        
        console.log('✅ local-database.json loaded');
        console.log(`👥 Users: ${data.users?.length || 0}`);
        console.log(`📋 Tasks: ${data.tasks?.length || 0}`);
        console.log(`🔍 Supervisions: ${data.supervisions?.length || 0}`);
        console.log(`➕ Additional Tasks: ${data.additionalTasks?.length || 0}`);
        
        // Check for wawan user
        const wawan = data.users?.find(u => u.username === 'wawan');
        if (wawan) {
            console.log('✅ User wawan ditemukan:', wawan.id);
            
            // Check activities for wawan
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
            
            // Check photos in activities
            let photoCount = 0;
            [...wawaActivities.tasks, ...wawaActivities.supervisions, ...wawaActivities.additionalTasks].forEach(activity => {
                if (activity.photo1) photoCount++;
                if (activity.photo2) photoCount++;
            });
            
            console.log(`📸 Total photos in wawan activities: ${photoCount}`);
            
            if (photoCount > 0) {
                console.log('📋 Sample photo paths:');
                [...wawaActivities.tasks, ...wawaActivities.supervisions, ...wawaActivities.additionalTasks]
                    .slice(0, 3)
                    .forEach((activity, i) => {
                        if (activity.photo1) console.log(`   ${i+1}. ${activity.photo1}`);
                        if (activity.photo2) console.log(`   ${i+1}. ${activity.photo2}`);
                    });
            }
        } else {
            console.log('❌ User wawan tidak ditemukan');
        }
        
        return true;
    } catch (error) {
        console.log('❌ Error reading local-database.json:', error.message);
        return false;
    }
}

// Generate test report
function generateTestReport(results) {
    console.log('\n📊 TEST REPORT');
    console.log('==============');
    
    const { serverHealth, uploadsDir, uploadsEndpoint, localStorageData } = results;
    
    console.log(`🏥 Server Health: ${serverHealth ? '✅ PASS' : '❌ FAIL'}`);
    console.log(`📁 Uploads Directory: ${uploadsDir ? '✅ PASS' : '❌ FAIL'}`);
    console.log(`🌐 Uploads Endpoint: ${uploadsEndpoint ? '✅ PASS' : '❌ FAIL'}`);
    console.log(`💾 localStorage Data: ${localStorageData ? '✅ PASS' : '❌ FAIL'}`);
    
    const passCount = Object.values(results).filter(Boolean).length;
    const totalTests = Object.keys(results).length;
    
    console.log(`\n📈 Overall: ${passCount}/${totalTests} tests passed`);
    
    if (passCount === totalTests) {
        console.log('🎉 ALL TESTS PASSED! Server dan foto siap digunakan.');
    } else {
        console.log('⚠️ SOME TESTS FAILED. Perlu perbaikan:');
        
        if (!serverHealth) {
            console.log('   - Jalankan server dengan: npm run dev atau node server/index.js');
        }
        if (!uploadsDir) {
            console.log('   - Buat folder uploads: mkdir uploads');
        }
        if (!uploadsEndpoint) {
            console.log('   - Pastikan server melayani /uploads endpoint');
        }
        if (!localStorageData) {
            console.log('   - Pastikan local-database.json ada dan valid');
        }
    }
    
    console.log('\n🔧 SOLUSI FOTO TIDAK MUNCUL:');
    console.log('1. Pastikan server berjalan di port 5000');
    console.log('2. Pastikan folder uploads ada dan berisi file foto');
    console.log('3. Pastikan endpoint /uploads melayani file statis');
    console.log('4. Periksa path foto di localStorage data');
    console.log('5. Buka browser dev tools untuk melihat error loading foto');
}

// Main test function
async function runTests() {
    const results = {
        serverHealth: await testServerHealth(),
        uploadsDir: testUploadsDirectory(),
        uploadsEndpoint: false,
        localStorageData: testLocalStorageData()
    };
    
    // Only test uploads endpoint if server is running
    if (results.serverHealth) {
        results.uploadsEndpoint = await testUploadsEndpoint();
    }
    
    generateTestReport(results);
}

// Run tests
runTests().catch(console.error);