const pool = require('./config/db');

async function updateCategories() {
  console.log('🔄 Starting category update / migration...');

  const updates = [
    { oldSlugs: ['birthday-gifts'], newName: 'Birthday Gifting', newSlug: 'birthday-gifting' },
    { oldSlugs: ['baby-hampers'], newName: 'Traditional & Baby Arrival Hampers', newSlug: 'traditional-baby-arrival-hampers' },
    { oldSlugs: ['bridal-gifting'], newName: 'Theme Based Gifting', newSlug: 'theme-based-gifting' },
    { oldSlugs: ['festive-gifts', 'festivals'], newName: 'Festive Gifting', newSlug: 'festive-gifting' },
    { oldSlugs: ['personalized-gifts', 'personalised-gifts'], newName: 'Personalised Gifts', newSlug: 'personalised-gifts' },
    { oldSlugs: ['return-gifts'], newName: 'Return Gifts', newSlug: 'return-gifts' },
    { oldSlugs: ['corporate-gifting'], newName: 'Corporate Gifting', newSlug: 'corporate-gifting' },
    { oldSlugs: ['premium-hampers'], newName: 'Premium Hampers', newSlug: 'premium-hampers' }
  ];

  for (const item of updates) {
    let updated = false;
    for (const oldSlug of item.oldSlugs) {
      try {
        // Check if old slug exists
        const [rows] = await pool.execute('SELECT id FROM categories WHERE slug = ?', [oldSlug]);
        if (rows.length > 0) {
          // Update it
          await pool.execute(
            'UPDATE categories SET name = ?, slug = ? WHERE id = ?',
            [item.newName, item.newSlug, rows[0].id]
          );
          console.log(`✅ Updated existing category: "${oldSlug}" ➡️ "${item.newName}" (${item.newSlug})`);
          updated = true;
          break; // Stop checking other old slugs once updated
        }
      } catch (err) {
        console.error(`Error checking/updating old slug ${oldSlug}:`, err.message);
      }
    }

    if (!updated) {
      try {
        // Check if new slug already exists (e.g. from previous run)
        const [rows] = await pool.execute('SELECT id FROM categories WHERE slug = ?', [item.newSlug]);
        if (rows.length === 0) {
          // Insert it as new
          await pool.execute(
            'INSERT INTO categories (name, slug) VALUES (?, ?)',
            [item.newName, item.newSlug]
          );
          console.log(`➕ Created new category: "${item.newName}" (${item.newSlug})`);
        } else {
          // Update its name in case it was created with a different name
          await pool.execute(
            'UPDATE categories SET name = ? WHERE id = ?',
            [item.newName, rows[0].id]
          );
          console.log(`👉 Verified category: "${item.newName}" (${item.newSlug})`);
        }
      } catch (err) {
        console.error(`Error ensuring category ${item.newName}:`, err.message);
      }
    }
  }

  console.log('✅ Categories successfully updated!');
  if (require.main === module) {
    process.exit(0);
  }
}

if (require.main === module) {
  updateCategories().catch(err => {
    console.error('❌ Error updating categories:', err);
    process.exit(1);
  });
}

module.exports = updateCategories;
