const pool = require('./config/db');

const categories = [
  { name: 'Birthday Gifts', slug: 'birthday-gifts' },
  { name: 'Return Gifts', slug: 'return-gifts' },
  { name: 'Baby Hampers', slug: 'baby-hampers' },
  { name: 'Bridal & Muhurtam', slug: 'bridal-gifting' },
  { name: 'Festivals', slug: 'festivals' },
  { name: 'Personalized Gifts', slug: 'personalized-gifts' },
  { name: 'Premium Hampers', slug: 'premium-hampers' },
  { name: 'Corporate Gifting', slug: 'corporate-gifting' },
];

async function seedCategories() {
  console.log('Seeding categories...');
  
  for (const category of categories) {
    try {
      await pool.execute(
        'INSERT IGNORE INTO categories (name, slug) VALUES (?, ?)',
        [category.name, category.slug]
      );
      console.log(`Inserted/Ensured category: ${category.name}`);
    } catch (error) {
      console.error(`Error inserting category ${category.name}:`, error);
    }
  }
  
  console.log('Categories seeded successfully!');
  process.exit(0);
}

seedCategories();