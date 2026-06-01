
const pool = require('../config/db');

const getProducts = async (req, res) => {
  try {
    const { category, featured, search, page = 1, limit = 12, min_price, max_price } = req.query;
    const offset = (page - 1) * limit;
    
    let query = `
      SELECT p.*, 
             COALESCE(
               (SELECT GROUP_CONCAT(cat.name SEPARATOR ', ') 
                FROM categories cat 
                JOIN product_categories pc ON cat.id = pc.category_id 
                WHERE pc.product_id = p.id),
               c.name
             ) as category_name,
             pi.image_url as primary_image
      FROM products p
      LEFT JOIN categories c ON p.category_id = c.id
      LEFT JOIN product_images pi ON p.id = pi.product_id AND pi.is_primary = 1
      WHERE 1=1
    `;
    const params = [];

    let countQuery = `
      SELECT COUNT(DISTINCT p.id) as total
      FROM products p
      LEFT JOIN categories c ON p.category_id = c.id
      WHERE 1=1
    `;
    const countParams = [];

    if (category) {
      query += ` AND (
        c.slug = ? OR p.category_id = ? OR 
        p.id IN (
          SELECT pc.product_id 
          FROM product_categories pc 
          JOIN categories cat ON pc.category_id = cat.id 
          WHERE cat.slug = ? OR cat.id = ?
        )
      )`;
      params.push(category, category, category, category);

      countQuery += ` AND (
        c.slug = ? OR p.category_id = ? OR 
        p.id IN (
          SELECT pc.product_id 
          FROM product_categories pc 
          JOIN categories cat ON pc.category_id = cat.id 
          WHERE cat.slug = ? OR cat.id = ?
        )
      )`;
      countParams.push(category, category, category, category);
    }

    if (featured === 'true') {
      query += ' AND p.featured = 1';
      countQuery += ' AND p.featured = 1';
    }

    if (search) {
      query += ' AND (p.name LIKE ? OR p.description LIKE ?)';
      params.push(`%${search}%`, `%${search}%`);

      countQuery += ' AND (p.name LIKE ? OR p.description LIKE ?)';
      countParams.push(`%${search}%`, `%${search}%`);
    }

    // Get the effective price (discount_price if available, else price)
    if (min_price) {
      query += ' AND COALESCE(p.discount_price, p.price) >= ?';
      params.push(parseFloat(min_price));

      countQuery += ' AND COALESCE(p.discount_price, p.price) >= ?';
      countParams.push(parseFloat(min_price));
    }
    
    if (max_price) {
      query += ' AND COALESCE(p.discount_price, p.price) <= ?';
      params.push(parseFloat(max_price));

      countQuery += ' AND COALESCE(p.discount_price, p.price) <= ?';
      countParams.push(parseFloat(max_price));
    }

    query += ' GROUP BY p.id ORDER BY p.created_at DESC LIMIT ? OFFSET ?';
    params.push(parseInt(limit), parseInt(offset));

    const [products] = await pool.execute(query, params);

    const [countResult] = await pool.execute(countQuery, countParams);
    const total = countResult[0].total;

    for (let product of products) {
      const [images] = await pool.execute(
        'SELECT id, image_url, is_primary FROM product_images WHERE product_id = ?',
        [product.id]
      );
      product.images = images;

      const [categoryRows] = await pool.execute(
        'SELECT category_id FROM product_categories WHERE product_id = ?',
        [product.id]
      );
      product.category_ids = categoryRows.map(row => row.category_id);
    }

    res.json({
      products,
      total,
      page: parseInt(page),
      pages: Math.ceil(total / limit)
    });
  } catch (error) {
    console.error('Error in getProducts:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

const getProductById = async (req, res) => {
  try {
    const { id } = req.params;

    const [products] = await pool.execute(`
      SELECT p.*, 
             COALESCE(
               (SELECT GROUP_CONCAT(cat.name SEPARATOR ', ') 
                FROM categories cat 
                JOIN product_categories pc ON cat.id = pc.category_id 
                WHERE pc.product_id = p.id),
               c.name
             ) as category_name
      FROM products p
      LEFT JOIN categories c ON p.category_id = c.id
      WHERE p.id = ? OR p.slug = ?
    `, [id, id]);

    if (products.length === 0) {
      return res.status(404).json({ message: 'Product not found' });
    }

    const product = products[0];

    const [images] = await pool.execute(
      'SELECT id, image_url, is_primary FROM product_images WHERE product_id = ?',
      [product.id]
    );
    product.images = images;

    const [categoryRows] = await pool.execute(
      'SELECT category_id FROM product_categories WHERE product_id = ?',
      [product.id]
    );
    product.category_ids = categoryRows.map(row => row.category_id);

    const [reviews] = await pool.execute(`
      SELECT r.*, u.name as user_name
      FROM reviews r
      JOIN users u ON r.user_id = u.id
      WHERE r.product_id = ? AND r.approved = 1
      ORDER BY r.created_at DESC
    `, [product.id]);
    product.reviews = reviews;

    res.json(product);
  } catch (error) {
    console.error('Error in getProductById:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

const createProduct = async (req, res) => {
  console.log('Create product request:');
  console.log('Body:', req.body);
  console.log('Files:', req.files);
  
  const connection = await pool.getConnection();
  try {
    await connection.beginTransaction();
    
    const { name, slug, description, price, discount_price, category_id, stock, featured } = req.body;

    // Parse multiple categories
    let categoryIds = [];
    if (req.body.category_ids) {
      categoryIds = Array.isArray(req.body.category_ids) ? req.body.category_ids : [req.body.category_ids];
    } else if (req.body['category_ids[]']) {
      categoryIds = Array.isArray(req.body['category_ids[]']) ? req.body['category_ids[]'] : [req.body['category_ids[]']];
    }

    const parsedCategoryIds = categoryIds
      .map(id => parseInt(id))
      .filter(id => !isNaN(id));

    let cleanCategoryId = null;
    if (parsedCategoryIds.length > 0) {
      cleanCategoryId = parsedCategoryIds[0];
    } else {
      let rawCatId = category_id;
      if (Array.isArray(rawCatId)) {
        rawCatId = rawCatId.find(val => val !== '' && val !== null && val !== undefined);
      }
      if (rawCatId !== '' && rawCatId !== null && rawCatId !== undefined) {
        cleanCategoryId = parseInt(rawCatId);
      }
    }
    if (isNaN(cleanCategoryId)) {
      cleanCategoryId = null;
    }

    console.log('Inserting product...');
    const [result] = await connection.execute(
      'INSERT INTO products (name, slug, description, price, discount_price, category_id, stock, featured) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
      [
        name,
        slug,
        description || null,
        price,
        discount_price || null,
        cleanCategoryId,
        stock ? parseInt(stock) : 0,
        featured ? 1 : 0
      ]
    );

    console.log('Product inserted, ID:', result.insertId);

    // Save multiple categories to product_categories table
    if (parsedCategoryIds.length > 0) {
      for (const catId of parsedCategoryIds) {
        await connection.execute(
          'INSERT INTO product_categories (product_id, category_id) VALUES (?, ?)',
          [result.insertId, catId]
        );
      }
    } else if (cleanCategoryId !== null) {
      await connection.execute(
        'INSERT INTO product_categories (product_id, category_id) VALUES (?, ?)',
        [result.insertId, cleanCategoryId]
      );
    }

    if (req.files && req.files.length > 0) {
      for (let i = 0; i < req.files.length; i++) {
        const imageUrl = `/uploads/${req.files[i].filename}`;
        console.log('Inserting image:', imageUrl);
        await connection.execute(
          'INSERT INTO product_images (product_id, image_url, is_primary) VALUES (?, ?, ?)',
          [result.insertId, imageUrl, i === 0 ? 1 : 0]
        );
      }
    }

    await connection.commit();
    console.log('Transaction committed');
    res.status(201).json({ id: result.insertId, message: 'Product created successfully' });
  } catch (error) {
    console.error('Error in createProduct:', error);
    await connection.rollback();
    if (error.code === 'ER_DUP_ENTRY') {
      return res.status(400).json({ message: 'A product with this slug already exists. Please choose a unique slug.' });
    }
    res.status(500).json({ message: 'Server error', error: error.message });
  } finally {
    connection.release();
  }
};

const updateProduct = async (req, res) => {
  console.log('Update product request:');
  console.log('Params:', req.params);
  console.log('Body:', req.body);
  console.log('Files:', req.files);
  
  const connection = await pool.getConnection();
  try {
    await connection.beginTransaction();
    
    const { id } = req.params;
    const { name, slug, description, price, discount_price, category_id, stock, featured, delete_image_ids } = req.body;

    // Parse multiple categories
    let categoryIds = [];
    if (req.body.category_ids) {
      categoryIds = Array.isArray(req.body.category_ids) ? req.body.category_ids : [req.body.category_ids];
    } else if (req.body['category_ids[]']) {
      categoryIds = Array.isArray(req.body['category_ids[]']) ? req.body['category_ids[]'] : [req.body['category_ids[]']];
    }

    const parsedCategoryIds = categoryIds
      .map(id => parseInt(id))
      .filter(id => !isNaN(id));

    let cleanCategoryId = null;
    if (parsedCategoryIds.length > 0) {
      cleanCategoryId = parsedCategoryIds[0];
    } else {
      let rawCatId = category_id;
      if (Array.isArray(rawCatId)) {
        rawCatId = rawCatId.find(val => val !== '' && val !== null && val !== undefined);
      }
      if (rawCatId !== '' && rawCatId !== null && rawCatId !== undefined) {
        cleanCategoryId = parseInt(rawCatId);
      }
    }
    if (isNaN(cleanCategoryId)) {
      cleanCategoryId = null;
    }

    console.log('Updating product...');
    await connection.execute(
      'UPDATE products SET name = ?, slug = ?, description = ?, price = ?, discount_price = ?, category_id = ?, stock = ?, featured = ? WHERE id = ?',
      [
        name,
        slug,
        description || null,
        price,
        discount_price || null,
        cleanCategoryId,
        stock ? parseInt(stock) : 0,
        featured ? 1 : 0,
        id
      ]
    );

    // Sync categories in product_categories
    await connection.execute('DELETE FROM product_categories WHERE product_id = ?', [id]);
    
    if (parsedCategoryIds.length > 0) {
      for (const catId of parsedCategoryIds) {
        await connection.execute(
          'INSERT INTO product_categories (product_id, category_id) VALUES (?, ?)',
          [id, catId]
        );
      }
    } else if (cleanCategoryId !== null) {
      await connection.execute(
        'INSERT INTO product_categories (product_id, category_id) VALUES (?, ?)',
        [id, cleanCategoryId]
      );
    }

    // Delete specified images
    if (delete_image_ids) {
      const idsToDelete = Array.isArray(delete_image_ids) ? delete_image_ids : [delete_image_ids];
      for (const imgId of idsToDelete) {
        await connection.execute('DELETE FROM product_images WHERE id = ?', [imgId]);
      }
    }

    // Add new images
    if (req.files && req.files.length > 0) {
      // Check how many images we currently have
      const [existingImages] = await connection.execute('SELECT COUNT(*) as count FROM product_images WHERE product_id = ?', [id]);
      const currentCount = existingImages[0].count;
      const canAdd = 6 - currentCount;
      
      if (canAdd > 0) {
        const filesToAdd = req.files.slice(0, canAdd);
        for (const file of filesToAdd) {
          const imageUrl = `/uploads/${file.filename}`;
          await connection.execute(
            'INSERT INTO product_images (product_id, image_url, is_primary) VALUES (?, ?, ?)',
            [id, imageUrl, 0]
          );
        }
      }
    }

    await connection.commit();
    console.log('Transaction committed');
    res.json({ message: 'Product updated successfully' });
  } catch (error) {
    console.error('Error in updateProduct:', error);
    await connection.rollback();
    if (error.code === 'ER_DUP_ENTRY') {
      return res.status(400).json({ message: 'A product with this slug already exists. Please choose a unique slug.' });
    }
    res.status(500).json({ message: 'Server error', error: error.message });
  } finally {
    connection.release();
  }
};

const deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;
    await pool.execute('DELETE FROM products WHERE id = ?', [id]);
    res.json({ message: 'Product deleted successfully' });
  } catch (error) {
    console.error('Error in deleteProduct:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

module.exports = { getProducts, getProductById, createProduct, updateProduct, deleteProduct };
