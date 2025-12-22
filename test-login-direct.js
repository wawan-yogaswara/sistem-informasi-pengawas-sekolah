import bcrypt from 'bcryptjs';
import fs from 'fs';

// Test login langsung dengan local database
async function testLogin() {
  try {
    console.log('🔍 Testing login with local database...');
    
    // Read local database
    const db = JSON.parse(fs.readFileSync('local-database.json', 'utf8'));
    console.log('📁 Database loaded, users count:', db.users.length);
    
    // Find user Wawan
    const username = 'wawan';
    const password = 'wawan123';
    
    const user = db.users.find(u => u.username === username);
    
    if (!user) {
      console.log('❌ User not found:', username);
      return;
    }
    
    console.log('👤 User found:', user.fullName);
    console.log('🔑 Stored password hash:', user.password.substring(0, 20) + '...');
    
    // Test password
    const isValid = await bcrypt.compare(password, user.password);
    console.log('✅ Password valid:', isValid);
    
    if (isValid) {
      console.log('🎉 Login would be successful!');
      console.log('User details:');
      console.log('- ID:', user.id);
      console.log('- Username:', user.username);
      console.log('- Full Name:', user.fullName);
      console.log('- Role:', user.role);
      console.log('- NIP:', user.nip);
    } else {
      console.log('❌ Password mismatch');
    }
    
  } catch (error) {
    console.error('❌ Error:', error.message);
  }
}

testLogin();