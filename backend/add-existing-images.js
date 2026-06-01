
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

    console.log('Adding images...');
    await connection.execute(
      'INSERT INTO product_images (product_id, image_url, is_primary) VALUES (1, ?, 1)',
      ['/uploads/1780126221238-927013708.jpg']
    );
    await connection.execute(
      'INSERT INTO product_images (product_id, image_url, is_primary) VALUES (3, ?, 1)',
      ['/uploads/1780126386214-771546619.jpg']
    );

    console.log('Done! Now checking product_images...');
    const [images] = await connection.execute('SELECT * FROM product_images');
    console.log(images);
    await connection.end();
  } catch (error) {
    console.error('Error:', error);
  }
}

checkDB();
