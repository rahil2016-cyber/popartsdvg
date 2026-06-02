require('dotenv').config({ path: './.env' });
const mysql = require('mysql2/promise');

async function runMigration() {
  const connection = await mysql.createConnection({
    host: process.env.DB_HOST || 'localhost',
    port: process.env.DB_PORT || 3306,
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'popartsdvg',
    multipleStatements: true,
  });

  try {
    console.log('Migrating cart table...');
    try {
      await connection.query('ALTER TABLE cart DROP INDEX unique_cart_item');
      console.log('Dropped unique_cart_item');
    } catch(e) { console.log('Index unique_cart_item already dropped or not found'); }
    
    try {
      await connection.query('ALTER TABLE cart DROP INDEX unique_session_cart_item');
      console.log('Dropped unique_session_cart_item');
    } catch(e) { console.log('Index unique_session_cart_item already dropped or not found'); }

    try {
      await connection.query('ALTER TABLE cart ADD COLUMN metadata JSON NULL');
      console.log('Added metadata to cart');
    } catch(e) { console.log('metadata column might already exist on cart'); }

    try {
      await connection.query('ALTER TABLE order_items ADD COLUMN metadata JSON NULL');
      console.log('Added metadata to order_items');
    } catch(e) { console.log('metadata column might already exist on order_items'); }

    // Seed Empty Boxes and Greeting Cards Categories
    console.log('Seeding categories...');
    const cats = [
      { name: 'Empty Boxes', slug: 'empty-boxes' },
      { name: 'Greeting Cards', slug: 'greeting-cards' }
    ];

    for (let c of cats) {
      await connection.query('INSERT IGNORE INTO categories (name, slug) VALUES (?, ?)', [c.name, c.slug]);
      console.log(`Ensured category: ${c.name}`);
    }

    // Add dummy products to those categories so the builder works
    const [boxCat] = await connection.query('SELECT id FROM categories WHERE slug = ?', ['empty-boxes']);
    const [cardCat] = await connection.query('SELECT id FROM categories WHERE slug = ?', ['greeting-cards']);

    if (boxCat.length) {
      await connection.query(`
        INSERT IGNORE INTO products (name, slug, description, price, category_id, stock) 
        VALUES ('Premium Pink Box', 'premium-pink-box-empty', 'Beautiful pink hamper box', 299, ?, 100)
      `, [boxCat[0].id]);
      
      const [p] = await connection.query('SELECT id FROM products WHERE slug = ?', ['premium-pink-box-empty']);
      if (p.length) {
        await connection.query('INSERT IGNORE INTO product_images (product_id, image_url, is_primary) VALUES (?, "https://images.unsplash.com/photo-1549465220-1a8b9238cd48?q=80&w=600", 1)', [p[0].id]);
        await connection.query('INSERT IGNORE INTO product_categories (product_id, category_id) VALUES (?, ?)', [p[0].id, boxCat[0].id]);
      }
    }

    if (cardCat.length) {
      await connection.query(`
        INSERT IGNORE INTO products (name, slug, description, price, category_id, stock) 
        VALUES ('Happy Birthday Card', 'happy-birthday-card', 'Premium greeting card', 50, ?, 100)
      `, [cardCat[0].id]);

      const [c] = await connection.query('SELECT id FROM products WHERE slug = ?', ['happy-birthday-card']);
      if (c.length) {
         await connection.query('INSERT IGNORE INTO product_images (product_id, image_url, is_primary) VALUES (?, "https://images.unsplash.com/photo-1527481138388-31827a7c94d5?q=80&w=600", 1)', [c[0].id]);
         await connection.query('INSERT IGNORE INTO product_categories (product_id, category_id) VALUES (?, ?)', [c[0].id, cardCat[0].id]);
      }
    }
    
    console.log('Migration successful!');
  } catch (error) {
    console.error('Migration failed:', error);
  } finally {
    await connection.end();
  }
}

runMigration();
