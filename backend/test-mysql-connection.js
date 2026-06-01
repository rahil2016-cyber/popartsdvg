
const mysql = require('mysql2/promise');
require('dotenv').config();

async function testConnection() {
  console.log('🚀 Testing MySQL connection...');
  console.log('📋 Connection details:');
  console.log('   Host:', process.env.DB_HOST || 'localhost');
  console.log('   User:', process.env.DB_USER || 'root');
  console.log('   Database:', process.env.DB_NAME || 'popartsdvg');
  console.log('');

  try {
    // First test: connect to MySQL server (without database)
    console.log('1️⃣  Testing connection to MySQL server...');
    const tempConn = await mysql.createConnection({
      host: process.env.DB_HOST || 'localhost',
      user: process.env.DB_USER || 'root',
      password: process.env.DB_PASSWORD || ''
    });
    console.log('✅ Connected to MySQL server!');
    await tempConn.end();

    // Second test: check if database exists, create if not
    console.log('2️⃣  Checking/creating database...');
    const conn = await mysql.createConnection({
      host: process.env.DB_HOST || 'localhost',
      user: process.env.DB_USER || 'root',
      password: process.env.DB_PASSWORD || ''
    });

    await conn.execute(`CREATE DATABASE IF NOT EXISTS ${process.env.DB_NAME || 'popartsdvg'}`);
    console.log('✅ Database is ready!');
    await conn.end();

    console.log('\n🎉 Success! MySQL is running and accessible!');
    console.log('Next steps:');
    console.log('1. Run `node setup.js` to create all tables and default admin');
    console.log('2. Or run `node add-reels-table.js` then `node createAdmin.js`');

    process.exit(0);
  } catch (error) {
    console.error('\n❌ Failed to connect to MySQL!');
    console.error('Error:', error.message);
    console.error('');
    console.error('🔍 Troubleshooting steps:');
    console.error('1. Make sure MySQL server is running:');
    console.error('   - If using XAMPP/WAMP: Start MySQL module');
    console.error('   - If using native MySQL: Start the MySQL service');
    console.error('2. Check your MySQL credentials in .env file');
    console.error('3. Verify MySQL is running on port 3306');
    console.error('');
    console.error('💡 Tip: If you don\'t have MySQL installed, you can use XAMPP: https://www.apachefriends.org/');
    process.exit(1);
  }
}

testConnection();
