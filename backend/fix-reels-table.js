
const mysql = require('mysql2/promise');
require('dotenv').config();

async function fix() {
  try {
    const connection = await mysql.createConnection({
      host: process.env.DB_HOST || 'localhost',
      user: process.env.DB_USER || 'root',
      password: process.env.DB_PASSWORD || '',
      database: process.env.DB_NAME || 'popartsdvg'
    });
    
    console.log('✅ Connected to database!');
    
    try {
      await connection.execute('DROP TABLE IF EXISTS reels');
      console.log('✅ Dropped any existing reels table');
    } catch (err) {
      console.log('ℹ️  First drop failed, trying discard/import method');
    }
    
    // Try to create a temporary table to get the structure right
    console.log('Creating temporary table...');
    await connection.execute(`
      CREATE TABLE IF NOT EXISTS reels_temp (
        id INT AUTO_INCREMENT PRIMARY KEY,
        media_url VARCHAR(255) NOT NULL,
        media_type ENUM('image','video') NOT NULL DEFAULT 'image',
        is_active TINYINT(1) DEFAULT 1,
        position INT DEFAULT 0,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      )
    `);
    
    try {
      await connection.execute('RENAME TABLE reels_temp TO reels');
      console.log('✅ Reels table fixed and working!');
    } catch (renameErr) {
      // If rename fails, try to drop and recreate again
      await connection.execute('DROP TABLE IF EXISTS reels_temp');
      await connection.execute(`
        CREATE TABLE reels (
          id INT AUTO_INCREMENT PRIMARY KEY,
          media_url VARCHAR(255) NOT NULL,
          media_type ENUM('image','video') NOT NULL DEFAULT 'image',
          is_active TINYINT(1) DEFAULT 1,
          position INT DEFAULT 0,
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
        )
      `);
      console.log('✅ Reels table created successfully!');
    }
    
    await connection.end();
    console.log('✅ ALL DONE! Now restart the backend server!');
  } catch (err) {
    console.error('❌ Error:', err.message);
  }
}

fix();
