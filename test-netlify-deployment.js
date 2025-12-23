#!/usr/bin/env node

/**
 * 🧪 NETLIFY DEPLOYMENT TESTER
 * 
 * Script untuk test aplikasi setelah deployment ke Netlify
 */

import https from 'https';
import { URL } from 'url';

// Konfigurasi
const NETLIFY_URL = 'https://celadon-chebakia-a3bf18.netlify.app'; // Ganti dengan URL Netlify Anda
const TEST_ENDPOINTS = [
  '/',
  '/login',
  '/dashboard',
  '/schools',
  '/users'
];

console.log('🧪 TESTING NETLIFY DEPLOYMENT\n');
console.log(`🔗 Testing URL: ${NETLIFY_URL}\n`);

// Function untuk test HTTP request
function testEndpoint(url) {
  return new Promise((resolve, reject) => {
    const parsedUrl = new URL(url);
    
    const options = {
      hostname: parsedUrl.hostname,
      port: parsedUrl.port || 443,
      path: parsedUrl.pathname,
      method: 'GET',
      timeout: 10000
    };

    const req = https.request(options, (res) => {
      let data = '';
      
      res.on('data', (chunk) => {
        data += chunk;
      });
      
      res.on('end', () => {
        resolve({
          url,
          status: res.statusCode,
          headers: res.headers,
          body: data,
          success: res.statusCode >= 200 && res.statusCode < 400
        });
      });
    });

    req.on('error', (error) => {
      reject({
        url,
        error: error.message,
        success: false
      });
    });

    req.on('timeout', () => {
      req.destroy();
      reject({
        url,
        error: 'Request timeout',
        success: false
      });
    });

    req.end();
  });
}

// Test semua endpoints
async function runTests() {
  console.log('🚀 Starting endpoint tests...\n');
  
  const results = [];
  
  for (const endpoint of TEST_ENDPOINTS) {
    const fullUrl = NETLIFY_URL + endpoint;
    
    try {
      console.log(`🔍 Testing: ${endpoint}`);
      const result = await testEndpoint(fullUrl);
      
      if (result.success) {
        console.log(`✅ ${endpoint} - Status: ${result.status}`);
        
        // Check for React app indicators
        if (result.body.includes('<!doctype html>') || result.body.includes('<div id="root">')) {
          console.log(`   📱 React app detected`);
        }
        
        // Check for specific content
        if (endpoint === '/' && result.body.includes('School Guard Manager')) {
          console.log(`   🎯 App title found`);
        }
        
      } else {
        console.log(`❌ ${endpoint} - Status: ${result.status}`);
      }
      
      results.push(result);
      
    } catch (error) {
      console.log(`❌ ${endpoint} - Error: ${error.error}`);
      results.push(error);
    }
    
    console.log('');
  }
  
  // Summary
  console.log('📊 TEST SUMMARY:');
  console.log('================');
  
  const successful = results.filter(r => r.success).length;
  const total = results.length;
  
  console.log(`✅ Successful: ${successful}/${total}`);
  console.log(`❌ Failed: ${total - successful}/${total}`);
  
  if (successful === total) {
    console.log('\n🎉 ALL TESTS PASSED!');
    console.log('✅ Netlify deployment is working correctly');
    console.log('🔐 You can now login with: admin/admin123');
  } else {
    console.log('\n⚠️  SOME TESTS FAILED');
    console.log('🔧 Check Netlify build logs for issues');
    console.log('🌐 Verify site URL is correct');
  }
  
  console.log(`\n🔗 Site URL: ${NETLIFY_URL}`);
}

// Jalankan tests
runTests().catch(console.error);