
const mysql = require('mysql2/promise');
require('dotenv').config();

const categories = [
  { name: 'Birthday Gifts', slug: 'birthday-gifts' },
  { name: 'Return Gifts', slug: 'return-gifts' },
  { name: 'Baby Hampers', slug: 'baby-hampers' },
  { name: 'Bridal Gifting', slug: 'bridal-gifting' },
  { name: 'Festive Gifts', slug: 'festive-gifts' },
  { name: 'Corporate Gifting', slug: 'corporate-gifting' },
  { name: 'Premium Hampers', slug: 'premium-hampers' },
  { name: 'Personalised Gifts', slug: 'personalised-gifts' }
];

async function addCategories() {
  try {
    const connection = await mysql.createConnection({
      host: process.env.DB_HOST || 'localhost',
      user: process.env.DB_USER || 'root',
      password: process.env.DB_PASSWORD || '',
      database: 'popartsdvg'
    });

    console.log('Connected, adding categories...');
    for (const cat of categories) {
      try {
        await connection.execute(
          'INSERT IGNORE INTO categories (name, slug) VALUES (?, ?)',
          [cat.name, cat.slug]
        );
        console.log(`✅ Added/Checked: ${cat.name}`);
      } catch (e) {
        console.error(`Failed to add ${cat.name}`, e);
      }
    }

    await connection.end();
    console.log('All categories added!');
    process.exit(0);
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
}

addCategories();
