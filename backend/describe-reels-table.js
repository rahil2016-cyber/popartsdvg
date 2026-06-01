
const mysql = require('mysql2/promise');
require('dotenv').config();

async function describe() {
  try {
    const connection = await mysql.createConnection({
      host: process.env.DB_HOST || 'localhost',
      user: process.env.DB_USER || 'root',
      password: process.env.DB_PASSWORD || '',
      database: process.env.DB_NAME || 'popartsdvg'
    });
    
    console.log('Reels table structure:');
    const [columns] = await connection.execute('DESCRIBE reels');
    console.table(columns);
    
    await connection.end();
  } catch (err) {
    console.error('Error:', err);
  }
}

describe();
