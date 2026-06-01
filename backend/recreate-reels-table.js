
const mysql = require('mysql2/promise');
require('dotenv').config();

async function recreate() {
  try {
    const connection = await mysql.createConnection({
      host: process.env.DB_HOST || 'localhost',
      user: process.env.DB_USER || 'root',
      password: process.env.DB_PASSWORD || '',
      database: process.env.DB_NAME || 'popartsdvg'
    });
    
    console.log('✅ Connected to database!');
    
    // Try to drop the broken table
    try {
      await connection.execute('DROP TABLE IF EXISTS reels');
      console.log('✅ Dropped existing reels table (if any)');
    } catch (err) {
      console.log('ℹ️  Could not drop table (might not exist or corrupted - okay)');
    }
    
    // Create fresh table
    console.log('Creating new reels table...');
    await connection.execute(`
      CREATE TABLE reels (
        id INT AUTO_INCREMENT PRIMARY KEY,
        media_url VARCHAR(255) NOT NULL,
        media_type ENUM('image','video') NOT NULL DEFAULT 'image',
        is_active TINYINT(1) DEFAULT 1,
        position INT DEFAULT 0,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
    `);
    console.log('✅ Reels table created successfully!');
    
    await connection.end();
    console.log('Done!');
  } catch (err) {
    console.error('❌ Error:', err.message);
  }
}

recreate();
