import bcrypt from 'bcryptjs';
import fs from 'fs';

// Debug login server step by step
async function debugLogin() {
  try {
    console.log('🔍 Debug Login Server Step by Step');
    console.log('=====================================');
    
    // 1. Read database
    const db = JSON.parse(fs.readFileSync('local-database.json', 'utf8'));
    console.log('1. ✅ Database loaded');
    console.log('   Users count:', db.users.length);
    
    // 2. Find user
    const username = 'wawan';
    const password = 'wawan123';
    
    const user = db.users.find(u => u.username === username);
    console.log('\n2. 👤 User lookup:');
    console.log('   Username:', username);
    console.log('   User found:', !!user);
    
    if (!user) {
      console.log('❌ User not found!');
      return;
    }
    
    console.log('   User ID:', user.id);
    console.log('   Full Name:', user.fullName);
    console.log('   Role:', user.role);
    
    // 3. Check password hash
    console.log('\n3. 🔑 Password verification:');
    console.log('   Input password:', password);
    console.log('   Stored hash:', user.password.substring(0, 30) + '...');
    
    // Test bcrypt compare
    const isValid = await bcrypt.compare(password, user.password);
    console.log('   bcrypt.compare result:', isValid);
    
    // 4. Test different password variations
    console.log('\n4. 🧪 Testing password variations:');
    const variations = ['wawan123', 'Wawan123', 'WAWAN123', 'wawan', 'admin'];
    
    for (const testPass of variations) {
      const result = await bcrypt.compare(testPass, user.password);
      console.log(`   "${testPass}": ${result}`);
    }
    
    // 5. Test manual hash creation
    console.log('\n5. 🔨 Testing manual hash creation:');
    const newHash = await bcrypt.hash('wawan123', 10);
    console.log('   New hash created:', newHash.substring(0, 30) + '...');
    
    const testNewHash = await bcrypt.compare('wawan123', newHash);
    console.log('   New hash test:', testNewHash);
    
    // 6. Check if hash is corrupted
    console.log('\n6. 🔍 Hash analysis:');
    console.log('   Hash length:', user.password.length);
    console.log('   Hash starts with $2b$:', user.password.startsWith('$2b$'));
    console.log('   Hash format valid:', /^\$2[aby]\$\d+\$.{53}$/.test(user.password));
    
  } catch (error) {
    console.error('❌ Error:', error.message);
    console.error('Stack:', error.stack);
  }
}

debugLogin();