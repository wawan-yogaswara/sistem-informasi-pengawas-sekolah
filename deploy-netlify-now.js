#!/usr/bin/env node

/**
 * 🌐 Deploy ke Netlify - Automated Script
 * Script untuk deploy aplikasi ke Netlify dengan konfigurasi yang benar
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

async function deployToNetlify() {
  log('\n🌐 Starting Netlify Deployment...\n', 'cyan');

  try {
    // 1. Check if Netlify CLI is installed
    log('📦 Checking Netlify CLI...', 'blue');
    try {
      execSync('netlify --version', { stdio: 'pipe' });
      log('✅ Netlify CLI is installed', 'green');
    } catch (error) {
      log('❌ Netlify CLI not found. Installing...', 'yellow');
      execSync('npm install -g netlify-cli', { stdio: 'inherit' });
      log('✅ Netlify CLI installed successfully', 'green');
    }

    // 2. Update netlify.toml with correct configuration
    log('\n⚙️  Updating Netlify configuration...', 'blue');
    const netlifyConfig = `[build]
  publish = "dist/public"
  command = "npm run build"

[build.environment]
  NODE_VERSION = "18"

[[redirects]]
  from = "/api/*"
  to = "/.netlify/functions/:splat"
  status = 200

[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200

[functions]
  directory = "netlify/functions"
  node_bundler = "esbuild"

[[headers]]
  for = "/*"
  [headers.values]
    X-Frame-Options = "DENY"
    X-XSS-Protection = "1; mode=block"
    X-Content-Type-Options = "nosniff"
    Referrer-Policy = "strict-origin-when-cross-origin"
`;

    fs.writeFileSync('netlify.toml', netlifyConfig);
    log('✅ netlify.toml updated', 'green');

    // 3. Create Netlify functions directory
    log('\n📁 Creating Netlify functions...', 'blue');
    if (!fs.existsSync('netlify/functions')) {
      fs.mkdirSync('netlify/functions', { recursive: true });
    }

    // Create API function
    const apiFunction = `const { createServer } = require('../../server/index.ts');

exports.handler = async (event, context) => {
  const server = createServer();
  
  return new Promise((resolve, reject) => {
    const req = {
      method: event.httpMethod,
      url: event.path,
      headers: event.headers,
      body: event.body
    };
    
    const res = {
      statusCode: 200,
      headers: {},
      body: '',
      setHeader: function(name, value) {
        this.headers[name] = value;
      },
      status: function(code) {
        this.statusCode = code;
        return this;
      },
      json: function(data) {
        this.headers['Content-Type'] = 'application/json';
        this.body = JSON.stringify(data);
        resolve(this);
      },
      send: function(data) {
        this.body = data;
        resolve(this);
      }
    };
    
    server(req, res);
  });
};`;

    fs.writeFileSync('netlify/functions/api.js', apiFunction);
    log('✅ Netlify functions created', 'green');

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

    // Save to netlify-env-vars.txt for easy copy-paste
    fs.writeFileSync('netlify-env-vars.txt', envVars.join('\n'));
    log('✅ Environment variables saved to netlify-env-vars.txt', 'green');

    log('Copy these environment variables to Netlify:', 'cyan');
    envVars.forEach(env => log(`   ${env}`, 'yellow'));

    // 5. Build the application
    log('\n🔨 Building application...', 'blue');
    try {
      execSync('npm run build', { stdio: 'inherit' });
      log('✅ Build successful', 'green');
    } catch (error) {
      log('⚠️  Build failed, but continuing with deployment setup...', 'yellow');
    }

    // 6. Deploy to Netlify
    log('\n🌐 Deploying to Netlify...', 'blue');
    log('Please follow the prompts:', 'yellow');
    
    try {
      // Login first
      log('Logging in to Netlify...', 'blue');
      execSync('netlify login', { stdio: 'inherit' });
      
      // Initialize site
      log('Initializing Netlify site...', 'blue');
      execSync('netlify init', { stdio: 'inherit' });
      
      // Deploy
      log('Deploying to production...', 'blue');
      execSync('netlify deploy --prod', { stdio: 'inherit' });
      
      log('\n🎉 Deployment successful!', 'green');
    } catch (error) {
      log('\n⚠️  Deployment may need manual setup. Please:', 'yellow');
      log('1. Go to https://app.netlify.com', 'cyan');
      log('2. Drag and drop your dist folder', 'cyan');
      log('3. Or connect your GitHub repository', 'cyan');
      log('4. Add the environment variables shown above', 'cyan');
    }

    // 7. Instructions
    log('\n📋 Next Steps:', 'cyan');
    log('1. ✅ Go to https://app.netlify.com', 'blue');
    log('2. 🔗 Connect your GitHub repository', 'blue');
    log('3. ⚙️  Add environment variables from netlify-env-vars.txt', 'blue');
    log('4. 🚀 Deploy and test!', 'blue');

    log('\n🎊 Netlify deployment process completed!', 'green');

  } catch (error) {
    log('\n❌ Deployment failed!', 'red');
    log(`Error: ${error.message}`, 'red');
    
    log('\n🔧 Manual Deployment Steps:', 'yellow');
    log('1. Go to https://app.netlify.com', 'cyan');
    log('2. Sign up with GitHub', 'cyan');
    log('3. Click "New site from Git"', 'cyan');
    log('4. Connect your GitHub repository', 'cyan');
    log('5. Set build command: npm run build', 'cyan');
    log('6. Set publish directory: dist/public', 'cyan');
    log('7. Add environment variables', 'cyan');
    log('8. Deploy!', 'cyan');
  }
}

// Run deployment
deployToNetlify();