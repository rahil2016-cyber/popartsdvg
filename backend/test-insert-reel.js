
const mysql = require('mysql2/promise');
require('dotenv').config();

async function testInsert() {
  try {
    const connection = await mysql.createConnection({
      host: process.env.DB_HOST || 'localhost',
      user: process.env.DB_USER || 'root',
      password: process.env.DB_PASSWORD || '',
      database: process.env.DB_NAME || 'popartsdvg'
    });
    
    console.log('Connected!');
    const [result] = await connection.execute(
      'INSERT INTO insta_reels (media_url, media_type, is_active, position) VALUES (?, ?, ?, ?)',
      ['/images/hero-hamper-toys.png', 'image', 1, 0]
    );
    console.log('✅ Reel inserted successfully! ID:', result.insertId);
    
    const [reels] = await connection.execute('SELECT * FROM insta_reels');
    console.log('All reels:', reels);
    
    await connection.end();
  } catch (err) {
    console.error('Error:', err);
  }
}

testInsert();
