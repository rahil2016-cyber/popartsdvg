const pool = require('./config/db');

const categories = [
  { name: 'Birthday Gifting', slug: 'birthday-gifting' },
  { name: 'Return Gifts', slug: 'return-gifts' },
  { name: 'Theme Based Gifting', slug: 'theme-based-gifting' },
  { name: 'Traditional & Baby Arrival Hampers', slug: 'traditional-baby-arrival-hampers' },
  { name: 'Festive Gifting', slug: 'festive-gifting' },
  { name: 'Corporate Gifting', slug: 'corporate-gifting' },
  { name: 'Premium Hampers', slug: 'premium-hampers' },
  { name: 'Personalised Gifts', slug: 'personalised-gifts' },
  { name: 'Empty Boxes', slug: 'empty-boxes' },
  { name: 'Greeting Cards', slug: 'greeting-cards' }
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