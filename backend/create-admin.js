
const mysql = require('mysql2/promise');
const bcrypt = require('bcryptjs');
require('dotenv').config();

async function createAdmin() {
  try {
    const connection = await mysql.createConnection({
      host: process.env.DB_HOST || 'localhost',
      user: process.env.DB_USER || 'root',
      password: process.env.DB_PASSWORD || '',
      database: 'popartsdvg'
    });

    console.log('Checking for existing admin...');
    const [admins] = await connection.execute('SELECT * FROM admins');

    if (admins.length === 0) {
      console.log('No admin found, creating default admin...');
      const hashedPassword = await bcrypt.hash('admin123', 10);
      await connection.execute(
        'INSERT INTO admins (name, email, password) VALUES (?, ?, ?)',
        ['Admin', 'admin@popartsdvg.com', hashedPassword]
      );
      console.log('✅ Default admin created!');
      console.log('Email: admin@popartsdvg.com');
      console.log('Password: admin123');
    } else {
      console.log('✅ Admin found!');
      admins.forEach((admin, index) => {
        console.log(`${index + 1}. ${admin.name} - ${admin.email}`);
      });
      console.log('Use the email and password you created or reset the password if you forgot!');
    }

    await connection.end();
  } catch (error) {
    console.error('❌ Error:', error);
  }
}

createAdmin();
