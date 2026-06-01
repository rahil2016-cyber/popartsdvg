
const mysql = require('mysql2/promise');
require('dotenv').config();

async function checkDB() {
  try {
    const connection = await mysql.createConnection({
      host: process.env.DB_HOST || 'localhost',
      user: process.env.DB_USER || 'root',
      password: process.env.DB_PASSWORD || '',
      database: 'popartsdvg'
    });

    console.log('=== CART TABLE ===');
    const [cartItems] = await connection.execute('SELECT * FROM cart');
    console.log(cartItems);

    console.log('\n=== PRODUCTS TABLE ===');
    const [products] = await connection.execute('SELECT id, name, slug FROM products LIMIT 5');
    console.log(products);

    console.log('\n=== ADMINS TABLE ===');
    const [admins] = await connection.execute('SELECT * FROM admins');
    console.log(admins);

    await connection.end();
  } catch (error) {
    console.error('Error:', error);
  }
}

checkDB();
