
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

    console.log('=== PRODUCTS ===');
    const [products] = await connection.execute('SELECT id, name FROM products');
    console.log(products);

    console.log('\n=== PRODUCT_IMAGES ===');
    const [images] = await connection.execute('SELECT * FROM product_images');
    console.log(images);

    await connection.end();
  } catch (error) {
    console.error('Error:', error);
  }
}

checkDB();
