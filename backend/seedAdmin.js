
const bcrypt = require('bcryptjs');
const pool = require('./config/db');

async function seedAdmin() {
  console.log('Seeding admin user...');
  
  try {
    // Check if admin already exists
    const [existingAdmins] = await pool.execute(
      'SELECT id FROM admins WHERE email = ?',
      ['admin@popartsdvg.com']
    );

    if (existingAdmins.length > 0) {
      console.log('Admin already exists!');
      process.exit(0);
    }

    // Create admin
    const hashedPassword = await bcrypt.hash('admin123', 10);
    await pool.execute(
      'INSERT INTO admins (name, email, password) VALUES (?, ?, ?)',
      ['Admin', 'admin@popartsdvg.com', hashedPassword]
    );

    console.log('✅ Admin created successfully!');
    console.log('Email: admin@popartsdvg.com');
    console.log('Password: admin123');
    process.exit(0);
  } catch (error) {
    console.error('Error seeding admin:', error);
    process.exit(1);
  }
}

seedAdmin();
