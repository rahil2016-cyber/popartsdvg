
const mysql = require('mysql2/promise');
require('dotenv').config();

async function test() {
  console.log('Testing database connection...');
  console.log('DB_HOST:', process.env.DB_HOST);
  console.log('DB_USER:', process.env.DB_USER);
  console.log('DB_NAME:', process.env.DB_NAME);
  
  try {
    const connection = await mysql.createConnection({
      host: process.env.DB_HOST || 'localhost',
      user: process.env.DB_USER || 'root',
      password: process.env.DB_PASSWORD || '',
      database: process.env.DB_NAME || 'popartsdvg'
    });
    
    console.log('✅ Connected to database!');
    
    // Check if reels table exists
    const [tables] = await connection.execute('SHOW TABLES LIKE "reels"');
    if (tables.length === 0) {
      console.log('❌ Reels table not found! Creating it now...');
      await connection.execute(`
        CREATE TABLE reels (
          id INT AUTO_INCREMENT PRIMARY KEY,
          media_url VARCHAR(255) NOT NULL,
          media_type ENUM('image','video') NOT NULL DEFAULT 'image',
          is_active BOOLEAN DEFAULT TRUE,
          position INT DEFAULT 0,
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
        )
      `);
      console.log('✅ Reels table created!');
    } else {
      console.log('✅ Reels table found!');
    }
    
    await connection.end();
    console.log('✅ Test passed!');
  } catch (err) {
    console.error('❌ Error:', err.message);
    console.error('Full error:', err);
  }
}

test();
