#!/usr/bin/env node

/**
 * 🚀 Deploy ke Vercel - Automated Script
 * Script untuk deploy aplikasi ke Vercel dengan konfigurasi yang benar
 */

import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';

// Warna untuk console output
const colors = {
  reset: '\x1b[0m',
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  cyan: '\x1b[36m'
};

function log(message, color = 'reset') {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

async function deployToVercel() {
  log('\n🚀 Starting Vercel Deployment...\n', 'cyan');

  try {
    // 1. Check if Vercel CLI is installed
    log('📦 Checking Vercel CLI...', 'blue');
    try {
      execSync('vercel --version', { stdio: 'pipe' });
      log('✅ Vercel CLI is installed', 'green');
    } catch (error) {
      log('❌ Vercel CLI not found. Installing...', 'yellow');
      execSync('npm install -g vercel', { stdio: 'inherit' });
      log('✅ Vercel CLI installed successfully', 'green');
    }

    // 2. Create/Update vercel.json
    log('\n⚙️  Creating Vercel configuration...', 'blue');
    const vercelConfig = {
      "version": 2,
      "name": "school-guard-manager",
      "builds": [
        {
          "src": "server/index.ts",
          "use": "@vercel/node"
        },
        {
          "src": "client/**/*",
          "use": "@vercel/static"
        }
      ],
      "routes": [
        {
          "src": "/api/(.*)",
          "dest": "/server/index.ts"
        },
        {
          "src": "/(.*)",
          "dest": "/client/$1"
        }
      ],
      "env": {
        "NODE_ENV": "production"
      },
      "functions": {
        "server/index.ts": {
          "maxDuration": 30
        }
      }
    };

    fs.writeFileSync('vercel.json', JSON.stringify(vercelConfig, null, 2));
    log('✅ vercel.json created', 'green');

    // 3. Create production build script
    log('\n🔨 Preparing build configuration...', 'blue');
    const packageJson = JSON.parse(fs.readFileSync('package.json', 'utf8'));
    
    if (!packageJson.scripts.build) {
      packageJson.scripts.build = 'npm run build:client && npm run build:server';
      packageJson.scripts['build:client'] = 'cd client && npm run build';
      packageJson.scripts['build:server'] = 'tsc server/index.ts --outDir dist/server';
      fs.writeFileSync('package.json', JSON.stringify(packageJson, null, 2));
      log('✅ Build scripts added to package.json', 'green');
    }

    // 4. Environment variables template
    log('\n🔐 Environment Variables needed:', 'yellow');
    const envVars = [
      'DATABASE_URL=postgresql://postgres.glhaliktsrcvnznbgxqt:***@aws-0-ap-southeast-1.pooler.supabase.com:6543/postgres',
      'SUPABASE_URL=https://glhaliktsrcvnznbgxqt.supabase.co',
      'SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdsaGFsaWt0c3Jjdm56bmJneHF0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjYzNjYyMjQsImV4cCI6MjA4MTk0MjIyNH0._kaFo2h7rCdouJp2rpb1lmEvlR6gAc0c3AnRjM_PhP4',
      'VITE_SUPABASE_URL=https://glhaliktsrcvnznbgxqt.supabase.co',
      'VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdsaGFsaWt0c3Jjdm56bmJneHF0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjYzNjYyMjQsImV4cCI6MjA4MTk0MjIyNH0._kaFo2h7rCdouJp2rpb1lmEvlR6gAc0c3AnRjM_PhP4',
      'NODE_ENV=production',
      'JWT_SECRET=schoolguard-secret-key-2024'
    ];

    log('Copy these environment variables to Vercel:', 'cyan');
    envVars.forEach(env => log(`   ${env}`, 'yellow'));

    // 5. Deploy to Vercel
    log('\n🚀 Deploying to Vercel...', 'blue');
    log('Please follow the prompts:', 'yellow');
    
    try {
      execSync('vercel --prod', { stdio: 'inherit' });
      log('\n🎉 Deployment successful!', 'green');
    } catch (error) {
      log('\n⚠️  Deployment may need manual setup. Please:', 'yellow');
      log('1. Go to https://vercel.com', 'cyan');
      log('2. Import your GitHub repository', 'cyan');
      log('3. Add the environment variables shown above', 'cyan');
      log('4. Deploy!', 'cyan');
    }

    // 6. Instructions
    log('\n📋 Next Steps:', 'cyan');
    log('1. ✅ Commit and push to GitHub if not done', 'blue');
    log('2. 🌐 Go to https://vercel.com and import your repo', 'blue');
    log('3. ⚙️  Add environment variables in Vercel dashboard', 'blue');
    log('4. 🚀 Deploy and test!', 'blue');

    log('\n🎊 Deployment process completed!', 'green');

  } catch (error) {
    log('\n❌ Deployment failed!', 'red');
    log(`Error: ${error.message}`, 'red');
    
    log('\n🔧 Manual Deployment Steps:', 'yellow');
    log('1. Go to https://vercel.com', 'cyan');
    log('2. Sign up with GitHub', 'cyan');
    log('3. Click "New Project"', 'cyan');
    log('4. Import your GitHub repository', 'cyan');
    log('5. Add environment variables', 'cyan');
    log('6. Deploy!', 'cyan');
  }
}

// Run deployment
deployToVercel();