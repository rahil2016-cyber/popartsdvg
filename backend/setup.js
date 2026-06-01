
const mysql = require('mysql2/promise');
require('dotenv').config();
const bcrypt = require('bcryptjs');

async function setupDatabase() {
  console.log('🚀 Setting up database...');

  try {
    const dbName = process.env.DB_NAME || 'popartsdvg';

    // 1. Create database if connecting locally (skip if cloud database)
    if (!process.env.DB_HOST || process.env.DB_HOST === 'localhost' || process.env.DB_HOST === '127.0.0.1') {
      const tempConnection = await mysql.createConnection({
        host: process.env.DB_HOST || 'localhost',
        port: process.env.DB_PORT || 3306,
        user: process.env.DB_USER || 'root',
        password: process.env.DB_PASSWORD || '',
        multipleStatements: true,
      });
      await tempConnection.query(`CREATE DATABASE IF NOT EXISTS ${dbName}`);
      console.log('✅ Database created or already exists!');
      await tempConnection.end();
    }

    // 2. Now connect to the database
    const connection = await mysql.createConnection({
      host: process.env.DB_HOST || 'localhost',
      port: process.env.DB_PORT || 3306,
      user: process.env.DB_USER || 'root',
      password: process.env.DB_PASSWORD || '',
      database: dbName,
      multipleStatements: true,
    });

    // 3. Create all tables manually
    const tableQueries = [
      `CREATE TABLE IF NOT EXISTS users (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        email VARCHAR(255) UNIQUE NOT NULL,
        password VARCHAR(255) NOT NULL,
        phone VARCHAR(20),
        address TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      )`,
      `CREATE TABLE IF NOT EXISTS admins (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        email VARCHAR(255) UNIQUE NOT NULL,
        password VARCHAR(255) NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      )`,
      `CREATE TABLE IF NOT EXISTS categories (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        slug VARCHAR(255) UNIQUE NOT NULL,
        description TEXT,
        image VARCHAR(255),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      )`,
      `CREATE TABLE IF NOT EXISTS products (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        slug VARCHAR(255) UNIQUE NOT NULL,
        description TEXT,
        price DECIMAL(10,2) NOT NULL,
        discount_price DECIMAL(10,2),
        category_id INT,
        stock INT DEFAULT 0,
        featured BOOLEAN DEFAULT FALSE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        FOREIGN KEY (category_id) REFERENCES categories(id) ON DELETE SET NULL
      )`,
      `CREATE TABLE IF NOT EXISTS product_images (
        id INT AUTO_INCREMENT PRIMARY KEY,
        product_id INT NOT NULL,
        image_url VARCHAR(255) NOT NULL,
        is_primary BOOLEAN DEFAULT FALSE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE
      )`,
      `CREATE TABLE IF NOT EXISTS coupons (
        id INT AUTO_INCREMENT PRIMARY KEY,
        code VARCHAR(100) UNIQUE NOT NULL,
        discount_type ENUM('percentage','fixed') NOT NULL,
        discount_value DECIMAL(10,2) NOT NULL,
        min_order_value DECIMAL(10,2),
        max_discount DECIMAL(10,2),
        usage_limit INT,
        used_count INT DEFAULT 0,
        valid_from TIMESTAMP NULL,
        valid_to TIMESTAMP NULL,
        active BOOLEAN DEFAULT TRUE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      )`,
      `CREATE TABLE IF NOT EXISTS orders (
        id INT AUTO_INCREMENT PRIMARY KEY,
        user_id INT,
        order_number VARCHAR(100) UNIQUE NOT NULL,
        total_amount DECIMAL(10,2) NOT NULL,
        discount_amount DECIMAL(10,2) DEFAULT 0,
        coupon_id INT,
        payment_method VARCHAR(100) NOT NULL,
        payment_status ENUM('pending','completed','failed','refunded') DEFAULT 'pending',
        order_status ENUM('pending','processing','shipped','delivered','cancelled','returned') DEFAULT 'pending',
        delivery_type ENUM('shipping','pickup') DEFAULT 'shipping',
        delivery_charge DECIMAL(10,2) DEFAULT 0,
        shipping_address TEXT NOT NULL,
        billing_address TEXT,
        customer_name VARCHAR(255) NOT NULL,
        customer_email VARCHAR(255) NOT NULL,
        customer_phone VARCHAR(20) NOT NULL,
        tracking_number VARCHAR(255),
        shipped_at TIMESTAMP NULL,
        delivered_at TIMESTAMP NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL,
        FOREIGN KEY (coupon_id) REFERENCES coupons(id) ON DELETE SET NULL
      )`,
      `CREATE TABLE IF NOT EXISTS order_items (
        id INT AUTO_INCREMENT PRIMARY KEY,
        order_id INT NOT NULL,
        product_id INT NOT NULL,
        quantity INT NOT NULL,
        price DECIMAL(10,2) NOT NULL,
        total DECIMAL(10,2) NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE,
        FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE
      )`,
      `CREATE TABLE IF NOT EXISTS cart (
        id INT AUTO_INCREMENT PRIMARY KEY,
        user_id INT,
        session_id VARCHAR(255),
        product_id INT NOT NULL,
        quantity INT NOT NULL DEFAULT 1,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
        FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE,
        UNIQUE KEY unique_cart_item (user_id, product_id),
        UNIQUE KEY unique_session_cart_item (session_id, product_id)
      )`,
      `CREATE TABLE IF NOT EXISTS wishlist (
        id INT AUTO_INCREMENT PRIMARY KEY,
        user_id INT NOT NULL,
        product_id INT NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
        FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE,
        UNIQUE KEY unique_wishlist_item (user_id, product_id)
      )`,
      `CREATE TABLE IF NOT EXISTS reviews (
        id INT AUTO_INCREMENT PRIMARY KEY,
        user_id INT NOT NULL,
        product_id INT NOT NULL,
        rating INT NOT NULL CHECK (rating BETWEEN 1 AND 5),
        comment TEXT,
        approved BOOLEAN DEFAULT FALSE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
        FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE
      )`,
      `CREATE TABLE IF NOT EXISTS banners (
        id INT AUTO_INCREMENT PRIMARY KEY,
        title VARCHAR(255),
        subtitle VARCHAR(255),
        image_url VARCHAR(255) NOT NULL,
        link_url VARCHAR(255),
        is_active BOOLEAN DEFAULT TRUE,
        position INT DEFAULT 0,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      )`,
      `CREATE TABLE IF NOT EXISTS reels (
        id INT AUTO_INCREMENT PRIMARY KEY,
        media_url VARCHAR(255) NOT NULL,
        media_type ENUM('image','video') NOT NULL DEFAULT 'image',
        is_active BOOLEAN DEFAULT TRUE,
        position INT DEFAULT 0,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      )`,
      `CREATE TABLE IF NOT EXISTS insta_reels (
        id INT AUTO_INCREMENT PRIMARY KEY,
        media_url VARCHAR(255) NOT NULL,
        media_type VARCHAR(20) NOT NULL DEFAULT 'image',
        is_active TINYINT(1) DEFAULT 1,
        position INT DEFAULT 0,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      )`,
      `CREATE TABLE IF NOT EXISTS product_categories (
        product_id INT NOT NULL,
        category_id INT NOT NULL,
        PRIMARY KEY (product_id, category_id),
        FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE,
        FOREIGN KEY (category_id) REFERENCES categories(id) ON DELETE CASCADE
      )`,
    ];

    for (const query of tableQueries) {
      await connection.query(query);
    }
    console.log('✅ All tables created!');

    // Ensure delivery_charge column exists in orders table (migration for existing setups)
    try {
      const [columns] = await connection.query("SHOW COLUMNS FROM orders LIKE 'delivery_charge'");
      if (columns.length === 0) {
        console.log('Adding delivery_charge column to orders table...');
        await connection.query('ALTER TABLE orders ADD COLUMN delivery_charge DECIMAL(10,2) DEFAULT 0');
        console.log('✅ Column delivery_charge added successfully!');
      }
    } catch (e) {
      console.log('ℹ️ Could not check/add delivery_charge column:', e.message);
    }

    // Ensure product_categories table exists (migration for existing setups)
    try {
      await connection.query(`CREATE TABLE IF NOT EXISTS product_categories (
        product_id INT NOT NULL,
        category_id INT NOT NULL,
        PRIMARY KEY (product_id, category_id),
        FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE,
        FOREIGN KEY (category_id) REFERENCES categories(id) ON DELETE CASCADE
      )`);
      console.log('✅ product_categories table verified!');
    } catch (e) {
      console.log('ℹ️ product_categories check:', e.message);
    }

    // Ensure insta_reels table exists (migration for existing setups)
    try {
      await connection.query(`CREATE TABLE IF NOT EXISTS insta_reels (
        id INT AUTO_INCREMENT PRIMARY KEY,
        media_url VARCHAR(1024) NOT NULL,
        media_type VARCHAR(20) NOT NULL DEFAULT 'image',
        is_active TINYINT(1) DEFAULT 1,
        position INT DEFAULT 0,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      )`);
      console.log('✅ insta_reels table verified!');
    } catch (e) {
      console.log('ℹ️ insta_reels check:', e.message);
    }

    // Ensure image_url supports long Cloudinary URLs (VARCHAR 1024)
    try {
      await connection.query("ALTER TABLE product_images MODIFY COLUMN image_url VARCHAR(1024) NOT NULL");
      console.log('✅ product_images.image_url column expanded for Cloudinary URLs!');
    } catch (e) {
      console.log('ℹ️ product_images column check:', e.message);
    }

    // Ensure banners image_url supports long Cloudinary URLs
    try {
      await connection.query("ALTER TABLE banners MODIFY COLUMN image_url VARCHAR(1024) NOT NULL");
    } catch (e) {
      // Ignore
    }


    // 4. Create admin user
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash('admin123', salt);

    try {
      await connection.query(
        'INSERT INTO admins (name, email, password) VALUES (?, ?, ?)',
        ['Admin', 'admin@popartsdvg.com', hashedPassword]
      );
      console.log('🎉 Admin created!');
    } catch (e) {
      if (e.code === 'ER_DUP_ENTRY') {
        console.log('ℹ️ Admin already exists!');
      } else {
        throw e;
      }
    }

    // 5. Also insert some sample data
    try {
      const categoriesToSeed = [
        { name: 'Best Sellers', slug: 'best-sellers' },
        { name: 'New Arrivals', slug: 'new-arrivals' },
        { name: 'Personalized Gifts', slug: 'personalized-gifts' },
        { name: 'Premium Hampers', slug: 'premium-hampers' },
        { name: 'Birthday Gifts', slug: 'birthday-gifts' },
        { name: 'Return Gifts', slug: 'return-gifts' },
        { name: 'Baby Hampers', slug: 'baby-hampers' },
        { name: 'Bridal & Muhurtam', slug: 'bridal-gifting' },
        { name: 'Festivals', slug: 'festivals' },
        { name: 'Corporate Gifting', slug: 'corporate-gifting' }
      ];
      for (const cat of categoriesToSeed) {
        await connection.query(
          `INSERT IGNORE INTO categories (name, slug) VALUES (?, ?)`,
          [cat.name, cat.slug]
        );
      }
      console.log('✅ Seed categories created/verified!');
      
      // Insert sample product
      await connection.query(
        `INSERT IGNORE INTO products (name, slug, description, price, stock, featured) 
         VALUES (?, ?, ?, ?, ?, ?)`,
        ['Premium Hamper', 'premium-hamper', 'Beautiful gift hamper', 1999, 10, 1]
      );
      
      console.log('✅ Sample data inserted!');
    } catch (e) {
      console.log('ℹ️ Sample data already exists', e.message);
    }

    await connection.end();

    console.log('\n✅ All setup completed!');
    console.log('📧 Login email: admin@popartsdvg.com');
    console.log('🔑 Login password: admin123');

    if (require.main === module) {
      process.exit(0);
    }
  } catch (error) {
    console.error('❌ Error during setup:', error.message);
    if (require.main === module) {
      process.exit(1);
    } else {
      throw error;
    }
  }
}

if (require.main === module) {
  setupDatabase();
}

module.exports = setupDatabase;
