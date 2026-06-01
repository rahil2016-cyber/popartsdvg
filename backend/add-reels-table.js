
const mysql = require('mysql2/promise');
require('dotenv').config();

async function addReelsTable() {
  console.log('🚀 Adding reels table...');

  try {
    const connection = await mysql.createConnection({
      host: process.env.DB_HOST || 'localhost',
      user: process.env.DB_USER || 'root',
      password: process.env.DB_PASSWORD || '',
      database: 'popartsdvg',
      multipleStatements: true,
    });

    const query = `CREATE TABLE IF NOT EXISTS reels (
      id INT AUTO_INCREMENT PRIMARY KEY,
      media_url VARCHAR(255) NOT NULL,
      media_type ENUM('image','video') NOT NULL DEFAULT 'image',
      is_active BOOLEAN DEFAULT TRUE,
      position INT DEFAULT 0,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
    )`;

    await connection.query(query);
    console.log('✅ Reels table created or already exists!');

    await connection.end();
    process.exit(0);
  } catch (error) {
    console.error('❌ Error adding reels table:', error.message);
    process.exit(1);
  }
}

addReelsTable();
