const bcrypt = require('bcryptjs');
const db = require('./models/db');

async function testPasswords() {
  const testUsers = [
    'test@example.com',
    'lab@example.com', 
    'provider@example.com',
    'lab69@lab69.com'
  ];
  
  const testPasswords = [
    'password',
    '123456', 
    'testpass123'
  ];
  
  for (const email of testUsers) {
    const user = db.prepare('SELECT email, password_hash FROM users WHERE email = ?').get(email);
    if (!user) {
      console.log(`${email}: User not found`);
      continue;
    }
    
    console.log(`\nTesting ${email}:`);
    
    // Test if password is same as email
    try {
      const emailMatch = await bcrypt.compare(email, user.password_hash);
      if (emailMatch) {
        console.log(`  ✅ Password: ${email}`);
        continue;
      }
    } catch (e) {}
    
    // Test common passwords
    for (const pwd of testPasswords) {
      try {
        const match = await bcrypt.compare(pwd, user.password_hash);
        if (match) {
          console.log(`  ✅ Password: ${pwd}`);
          break;
        }
      } catch (e) {}
    }
  }
  
  db.close();
}

testPasswords().catch(console.error);
