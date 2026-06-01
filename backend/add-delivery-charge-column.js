
const mysql = require('mysql2/promise');
require('dotenv').config();

async function addDeliveryChargeColumn() {
  try {
    const connection = await mysql.createConnection({
      host: process.env.DB_HOST || 'localhost',
      user: process.env.DB_USER || 'root',
      password: process.env.DB_PASSWORD || '',
      database: 'popartsdvg'
    });

    console.log('Checking if delivery_charge column exists...');
    
    // Check if the column exists
    const [columns] = await connection.execute("SHOW COLUMNS FROM orders LIKE 'delivery_charge'");
    
    if (columns.length === 0) {
      console.log('Adding delivery_charge column...');
      await connection.execute('ALTER TABLE orders ADD COLUMN delivery_charge DECIMAL(10,2) DEFAULT 0');
      console.log('✅ Column added successfully!');
    } else {
      console.log('✅ Column already exists!');
    }

    await connection.end();
  } catch (error) {
    console.error('❌ Error:', error);
  }
}

addDeliveryChargeColumn();
