const bcrypt = require('bcryptjs');
const pool = require('./config/db');

const createAdmin = async () => {
  try {
    const name = 'Admin';
    const email = 'admin@popartsdvg.com';
    const password = 'admin123';

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const [result] = await pool.execute(
      'INSERT INTO admins (name, email, password) VALUES (?, ?, ?)',
      [name, email, hashedPassword]
    );

    console.log('✅ Admin created successfully!');
    console.log('📧 Email:', email);
    console.log('🔑 Password:', password);
    console.log('🆔 User ID:', result.insertId);
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Error details:', error);
    if (error.code === 'ER_DUP_ENTRY') {
      console.log('ℹ️ Admin already exists with this email!');
    } else {
      console.error('❌ Error creating admin:', error.message);
    }
    process.exit(1);
  }
};

createAdmin();
