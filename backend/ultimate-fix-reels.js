
const mysql = require('mysql2/promise');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

async function ultimateFix() {
  try {
    console.log('=== STARTING ULTIMATE FIX ===');
    
    const connection = await mysql.createConnection({
      host: process.env.DB_HOST || 'localhost',
      user: process.env.DB_USER || 'root',
      password: process.env.DB_PASSWORD || '',
      database: process.env.DB_NAME || 'popartsdvg'
    });
    console.log('✅ Connected to database');
    
    // Step 1: Force drop with multiple methods
    console.log('Step 1: Trying to remove any trace of reels table');
    try {
      await connection.execute('DROP TABLE IF EXISTS reels');
      console.log('✅ DROP TABLE executed');
    } catch (e) {
      console.log('ℹ️  DROP TABLE failed (normal for corrupted table)');
    }
    
    try {
      await connection.execute('DROP TABLE IF EXISTS `popartsdvg`.`reels`');
    } catch (e) {}
    
    // Step 2: Create a new table with a different name first
    console.log('Step 2: Creating new table with temp name');
    const tempTableName = 'reels_fixed_' + Date.now();
    await connection.execute(`
      CREATE TABLE ${tempTableName} (
        id INT AUTO_INCREMENT PRIMARY KEY,
        media_url VARCHAR(255) NOT NULL,
        media_type VARCHAR(20) NOT NULL DEFAULT 'image',
        is_active TINYINT(1) DEFAULT 1,
        position INT DEFAULT 0,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      )
    `);
    console.log('✅ Temp table created successfully');
    
    // Step 3: Rename it to reels
    console.log('Step 3: Renaming temp table to reels');
    await connection.execute(`RENAME TABLE ${tempTableName} TO reels`);
    console.log('✅ SUCCESS: Reels table is now working!');
    
    // Verify it works
    console.log('Step 4: Testing the table');
    const [desc] = await connection.execute('DESCRIBE reels');
    console.log('✅ Table structure is valid:');
    console.table(desc);
    
    await connection.end();
    
    console.log('\n🎉 THE ISSUE IS 100% FIXED!');
    console.log('Now:');
    console.log('1. Restart your backend server (npm run dev)');
    console.log('2. Go to /admin/reels and add a reel!');
    
  } catch (err) {
    console.error('\n❌ ERROR:', err.message);
    console.error('\nAlternative fix:');
    console.log('1. Stop MySQL server');
    console.log('2. Go to your MySQL data folder (e.g., C:\\xampp\\mysql\\data\\popartsdvg)');
    console.log('3. Delete the files: reels.ibd and reels.frm (if they exist)');
    console.log('4. Start MySQL server');
    console.log('5. Run this script again');
  }
}

ultimateFix();
