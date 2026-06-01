
const pool = require('../config/db');

const getProducts = async (req, res) => {
  try {
    const { category, featured, search, page = 1, limit = 12, min_price, max_price } = req.query;
    const offset = (page - 1) * limit;
    
    // Simple resilient query - no dependency on product_categories
    let query = `
      SELECT p.*, 
             ANY_VALUE(c.name) as category_name,
             ANY_VALUE(pi.image_url) as primary_image
      FROM products p
      LEFT JOIN categories c ON p.category_id = c.id
      LEFT JOIN product_images pi ON p.id = pi.product_id
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
      query += ` AND (c.slug = ? OR c.id = ? OR p.category_id = ?)`;
      params.push(category, category, category);
      countQuery += ` AND (c.slug = ? OR c.id = ? OR p.category_id = ?)`;
      countParams.push(category, category, category);
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

    query += ` GROUP BY p.id ORDER BY p.created_at DESC LIMIT ${parseInt(limit)} OFFSET ${parseInt(offset)}`;

    const [products] = await pool.execute(query, params);
    const [countResult] = await pool.execute(countQuery, countParams);
    const total = countResult[0].total;

    // Batch fetch images to avoid N+1 queries timeout
    if (products.length > 0) {
      try {
        const productIds = products.map(p => p.id);
        const [allImages] = await pool.query(
          `SELECT product_id, id, image_url, is_primary FROM product_images WHERE product_id IN (${productIds.join(',')})`
        );
        const [allCategories] = await pool.query(
          `SELECT product_id, category_id FROM product_categories WHERE product_id IN (${productIds.join(',')})`
        );

        for (let product of products) {
          product.images = allImages.filter(img => img.product_id === product.id);
          product.category_ids = allCategories.filter(cat => cat.product_id === product.id).map(c => c.category_id);
          if (product.category_ids.length === 0 && product.category_id) {
            product.category_ids = [product.category_id];
          }
        }
      } catch (e) {
        console.error('Batch enrichment failed:', e);
        for (let product of products) {
          product.images = [];
          product.category_ids = product.category_id ? [product.category_id] : [];
        }
      }
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
      SELECT p.*, ANY_VALUE(c.name) as category_name
      FROM products p
      LEFT JOIN categories c ON p.category_id = c.id
      WHERE p.id = ? OR p.slug = ?
      GROUP BY p.id
    `, [id, id]);

    if (products.length === 0) {
      return res.status(404).json({ message: 'Product not found' });
    }

    const product = products[0];

    try {
      const [images] = await pool.execute(
        'SELECT id, image_url, is_primary FROM product_images WHERE product_id = ?',
        [product.id]
      );
      product.images = images;
    } catch (e) {
      product.images = [];
    }

    try {
      const [categoryRows] = await pool.execute(
        'SELECT category_id FROM product_categories WHERE product_id = ?',
        [product.id]
      );
      product.category_ids = categoryRows.map(row => row.category_id);
    } catch (e) {
      product.category_ids = product.category_id ? [product.category_id] : [];
    }

    try {
      const [reviews] = await pool.execute(`
        SELECT r.*, u.name as user_name
        FROM reviews r
        JOIN users u ON r.user_id = u.id
        WHERE r.product_id = ? AND r.approved = 1
        ORDER BY r.created_at DESC
      `, [product.id]);
      product.reviews = reviews;
    } catch (e) {
      product.reviews = [];
    }

    res.json(product);
  } catch (error) {
    console.error('Error in getProductById:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

const createProduct = async (req, res) => {
  console.log('Create product request body:', req.body);
  console.log('Files:', req.files ? req.files.length : 0);
  
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

    const parsedCategoryIds = categoryIds.map(id => parseInt(id)).filter(id => !isNaN(id));

    let cleanCategoryId = null;
    if (parsedCategoryIds.length > 0) {
      cleanCategoryId = parsedCategoryIds[0];
    } else if (category_id && category_id !== '' && category_id !== 'null') {
      const parsed = parseInt(category_id);
      if (!isNaN(parsed)) cleanCategoryId = parsed;
    }

    const [result] = await connection.execute(
      'INSERT INTO products (name, slug, description, price, discount_price, category_id, stock, featured) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
      [
        name,
        slug,
        description || null,
        parseFloat(price) || 0,
        discount_price && discount_price !== '' ? parseFloat(discount_price) : null,
        cleanCategoryId,
        stock ? parseInt(stock) : 0,
        featured ? 1 : 0
      ]
    );

    const productId = result.insertId;
    console.log('Product inserted, ID:', productId);

    // Save categories to product_categories (non-fatal if table doesn't exist)
    try {
      const catIdsToSave = parsedCategoryIds.length > 0 ? parsedCategoryIds : (cleanCategoryId ? [cleanCategoryId] : []);
      for (const catId of catIdsToSave) {
        await connection.execute(
          'INSERT IGNORE INTO product_categories (product_id, category_id) VALUES (?, ?)',
          [productId, catId]
        );
      }
    } catch (e) {
      console.log('Warning: Could not save product_categories:', e.message);
    }

    // Save images (from direct frontend uploads or multer)
    const directImageUrls = req.body.image_urls 
      ? (Array.isArray(req.body.image_urls) ? req.body.image_urls : [req.body.image_urls])
      : req.body['image_urls[]'] 
      ? (Array.isArray(req.body['image_urls[]']) ? req.body['image_urls[]'] : [req.body['image_urls[]']]) 
      : [];

    if (directImageUrls.length > 0) {
      for (let i = 0; i < directImageUrls.length; i++) {
        try {
          await connection.execute(
            'INSERT INTO product_images (product_id, image_url, is_primary) VALUES (?, ?, ?)',
            [productId, directImageUrls[i], i === 0 ? 1 : 0]
          );
        } catch (imgErr) {
          console.log('Warning: Could not save direct image URL:', imgErr.message);
        }
      }
    } else if (req.files && req.files.length > 0) {
      for (let i = 0; i < req.files.length; i++) {
        try {
          const imageUrl = req.files[i].path && req.files[i].path.startsWith('http')
            ? req.files[i].path
            : `/uploads/${req.files[i].filename}`;
          await connection.execute(
            'INSERT INTO product_images (product_id, image_url, is_primary) VALUES (?, ?, ?)',
            [productId, imageUrl, i === 0 ? 1 : 0]
          );
          console.log('Image saved:', imageUrl);
        } catch (imgErr) {
          console.log('Warning: Could not save image:', imgErr.message);
        }
      }
    }

    await connection.commit();
    res.status(201).json({ id: productId, message: 'Product created successfully' });
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
  const connection = await pool.getConnection();
  try {
    await connection.beginTransaction();
    
    const { id } = req.params;
    const { name, slug, description, price, discount_price, category_id, stock, featured, delete_image_ids } = req.body;

    let categoryIds = [];
    if (req.body.category_ids) {
      categoryIds = Array.isArray(req.body.category_ids) ? req.body.category_ids : [req.body.category_ids];
    } else if (req.body['category_ids[]']) {
      categoryIds = Array.isArray(req.body['category_ids[]']) ? req.body['category_ids[]'] : [req.body['category_ids[]']];
    }

    const parsedCategoryIds = categoryIds.map(id => parseInt(id)).filter(id => !isNaN(id));

    let cleanCategoryId = null;
    if (parsedCategoryIds.length > 0) {
      cleanCategoryId = parsedCategoryIds[0];
    } else if (category_id && category_id !== '' && category_id !== 'null') {
      const parsed = parseInt(category_id);
      if (!isNaN(parsed)) cleanCategoryId = parsed;
    }

    await connection.execute(
      'UPDATE products SET name = ?, slug = ?, description = ?, price = ?, discount_price = ?, category_id = ?, stock = ?, featured = ? WHERE id = ?',
      [
        name,
        slug,
        description || null,
        parseFloat(price) || 0,
        discount_price && discount_price !== '' ? parseFloat(discount_price) : null,
        cleanCategoryId,
        stock ? parseInt(stock) : 0,
        featured ? 1 : 0,
        id
      ]
    );

    // Sync product_categories (non-fatal)
    try {
      await connection.execute('DELETE FROM product_categories WHERE product_id = ?', [id]);
      const catIdsToSave = parsedCategoryIds.length > 0 ? parsedCategoryIds : (cleanCategoryId ? [cleanCategoryId] : []);
      for (const catId of catIdsToSave) {
        await connection.execute(
          'INSERT IGNORE INTO product_categories (product_id, category_id) VALUES (?, ?)',
          [id, catId]
        );
      }
    } catch (e) {
      console.log('Warning: Could not sync product_categories:', e.message);
    }

    // Delete specified images
    if (delete_image_ids) {
      const idsToDelete = Array.isArray(delete_image_ids) ? delete_image_ids : [delete_image_ids];
      for (const imgId of idsToDelete) {
        await connection.execute('DELETE FROM product_images WHERE id = ?', [imgId]);
      }
    }

    // Add new images (direct or multer)
    const directImageUrls = req.body.image_urls 
      ? (Array.isArray(req.body.image_urls) ? req.body.image_urls : [req.body.image_urls])
      : req.body['image_urls[]'] 
      ? (Array.isArray(req.body['image_urls[]']) ? req.body['image_urls[]'] : [req.body['image_urls[]']]) 
      : [];

    if (directImageUrls.length > 0) {
      const [existingImages] = await connection.execute('SELECT COUNT(*) as count FROM product_images WHERE product_id = ?', [id]);
      const currentCount = Number(existingImages[0].count || 0);
      const canAdd = 6 - currentCount;
      
      if (canAdd > 0) {
        const urlsToAdd = directImageUrls.slice(0, canAdd);
        for (let i = 0; i < urlsToAdd.length; i++) {
          try {
            await connection.execute(
              'INSERT INTO product_images (product_id, image_url, is_primary) VALUES (?, ?, ?)',
              [id, urlsToAdd[i], (currentCount === 0 && i === 0) ? 1 : 0]
            );
          } catch (imgErr) {
            console.log('Warning: Could not save direct image URL:', imgErr.message);
          }
        }
      }
    } else if (req.files && req.files.length > 0) {
      const [existingImages] = await connection.execute('SELECT COUNT(*) as count FROM product_images WHERE product_id = ?', [id]);
      const currentCount = existingImages[0].count;
      const canAdd = 6 - currentCount;
      
      if (canAdd > 0) {
        const filesToAdd = req.files.slice(0, canAdd);
        for (let i = 0; i < filesToAdd.length; i++) {
          try {
            const imageUrl = filesToAdd[i].path && filesToAdd[i].path.startsWith('http')
              ? filesToAdd[i].path
              : `/uploads/${filesToAdd[i].filename}`;
            await connection.execute(
              'INSERT INTO product_images (product_id, image_url, is_primary) VALUES (?, ?, ?)',
              [id, imageUrl, (currentCount === 0 && i === 0) ? 1 : 0]
            );
          } catch (imgErr) {
            console.log('Warning: Could not save image:', imgErr.message);
          }
        }
      }
    }

    await connection.commit();
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
