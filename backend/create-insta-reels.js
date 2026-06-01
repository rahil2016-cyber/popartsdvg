
const mysql = require('mysql2/promise');
require('dotenv').config();

async function run() {
  try {
    const connection = await mysql.createConnection({
      host: process.env.DB_HOST || 'localhost',
      user: process.env.DB_USER || 'root',
      password: process.env.DB_PASSWORD || '',
      database: process.env.DB_NAME || 'popartsdvg'
    });
    
    await connection.execute(`
      CREATE TABLE IF NOT EXISTS insta_reels (
        id INT AUTO_INCREMENT PRIMARY KEY,
        media_url VARCHAR(255) NOT NULL,
        media_type VARCHAR(20) NOT NULL DEFAULT 'image',
        is_active TINYINT(1) DEFAULT 1,
        position INT DEFAULT 0,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      )
    `);
    
    console.log('✅ INSTA_REELS table created successfully!');
    await connection.end();
    console.log('Done! Now restart your backend server!');
  } catch (err) {
    console.error('Error:', err);
  }
}

run();
