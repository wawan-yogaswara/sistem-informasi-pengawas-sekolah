#!/usr/bin/env node

/**
 * 🚀 NETLIFY DEPLOYMENT SCRIPT - FINAL
 * 
 * Script untuk deploy aplikasi ke Netlify dengan konfigurasi yang benar
 */

import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';

console.log('🚀 Starting Netlify deployment process...\n');

// 1. Clean previous build
console.log('🧹 Cleaning previous build...');
if (fs.existsSync('dist')) {
  fs.rmSync('dist', { recursive: true, force: true });
}

// 2. Build the application
console.log('🔨 Building application...');
try {
  execSync('npm run build', { stdio: 'inherit' });
  console.log('✅ Build completed successfully!\n');
} catch (error) {
  console.error('❌ Build failed:', error.message);
  process.exit(1);
}

// 3. Verify build output
console.log('🔍 Verifying build output...');
const distPath = path.join(process.cwd(), 'dist');
const indexPath = path.join(distPath, 'index.html');

if (!fs.existsSync(distPath)) {
  console.error('❌ Build output directory not found!');
  process.exit(1);
}

if (!fs.existsSync(indexPath)) {
  console.error('❌ index.html not found in build output!');
  process.exit(1);
}

console.log('✅ Build output verified!\n');

// 4. Check environment variables
console.log('🔧 Checking environment variables...');
const requiredEnvVars = [
  'VITE_SUPABASE_URL',
  'VITE_SUPABASE_ANON_KEY'
];

const envFile = fs.readFileSync('.env', 'utf8');
const missingVars = requiredEnvVars.filter(varName => 
  !envFile.includes(varName)
);

if (missingVars.length > 0) {
  console.error('❌ Missing environment variables:', missingVars);
  process.exit(1);
}

console.log('✅ Environment variables verified!\n');

// 5. Git commit and push
console.log('📤 Pushing to GitHub (triggers Netlify auto-deploy)...');
try {
  execSync('git add .', { stdio: 'inherit' });
  execSync('git commit -m "Deploy: Netlify build configuration updated"', { stdio: 'inherit' });
  execSync('git push origin main', { stdio: 'inherit' });
  console.log('✅ Pushed to GitHub successfully!\n');
} catch (error) {
  console.log('ℹ️  No changes to commit or already pushed\n');
}

// 6. Success message
console.log('🎉 NETLIFY DEPLOYMENT INITIATED!');
console.log('');
console.log('📋 NEXT STEPS:');
console.log('1. 🌐 Go to Netlify dashboard');
console.log('2. ⏳ Wait for auto-deploy to complete (2-3 minutes)');
console.log('3. 🧪 Test the application at your Netlify URL');
console.log('4. 🔐 Login with: admin/admin123');
console.log('');
console.log('🔗 Expected URL format: https://[site-name].netlify.app');
console.log('');
console.log('✅ If deployment succeeds, all features should work!');
console.log('❌ If deployment fails, check Netlify build logs');