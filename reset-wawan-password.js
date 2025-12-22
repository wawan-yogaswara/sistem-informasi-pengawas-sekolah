import bcrypt from 'bcryptjs';
import fs from 'fs';

// Read database
const db = JSON.parse(fs.readFileSync('local-database.json', 'utf8'));

// Find user Wawan
const wawan = db.users.find(u => u.username === 'wawan');

if (wawan) {
  // Hash password baru: wawan123
  const newPassword = 'wawan123';
  const hashedPassword = bcrypt.hashSync(newPassword, 10);
  
  // Update password
  wawan.password = hashedPassword;
  
  // Save database
  fs.writeFileSync('local-database.json', JSON.stringify(db, null, 2));
  
  console.log('✅ Password user Wawan berhasil direset!');
  console.log('Username: wawan');
  console.log('Password: wawan123');
} else {
  console.log('❌ User Wawan tidak ditemukan!');
}
