
const mysql = require('mysql2/promise');
require('dotenv').config();

async function fixImages() {
  try {
    const connection = await mysql.createConnection({
      host: process.env.DB_HOST || 'localhost',
      user: process.env.DB_USER || 'root',
      password: process.env.DB_PASSWORD || '',
      database: 'popartsdvg'
    });

    console.log('🔍 Fetching all product images...');
    const [images] = await connection.execute('SELECT id, image_url FROM product_images');

    for (const img of images) {
      if (img.image_url.startsWith('http')) {
        const newUrl = img.image_url.replace(/^https?:\/\/[^/]+/, '');
        console.log(`Updating: ${img.image_url} → ${newUrl}`);
        await connection.execute('UPDATE product_images SET image_url = ? WHERE id = ?', [newUrl, img.id]);
      }
    }

    console.log('✅ All images fixed!');
    await connection.end();
  } catch (error) {
    console.error('❌ Error:', error);
  }
}

fixImages();
