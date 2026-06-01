
const pool = require('../config/db');

const getWishlist = async (req, res) => {
  try {
    const [items] = await pool.execute(`
      SELECT w.*, p.name, p.price, p.discount_price, p.slug,
             pi.image_url as product_image
      FROM wishlist w
      JOIN products p ON w.product_id = p.id
      LEFT JOIN product_images pi ON p.id = pi.product_id AND pi.is_primary = 1
      WHERE w.user_id = ?
      ORDER BY w.created_at DESC
    `, [req.user.id]);

    res.json(items);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

const addToWishlist = async (req, res) => {
  try {
    const { productId } = req.body;

    const [existing] = await pool.execute(
      'SELECT * FROM wishlist WHERE user_id = ? AND product_id = ?',
      [req.user.id, productId]
    );

    if (existing.length > 0) {
      return res.status(400).json({ message: 'Product already in wishlist' });
    }

    await pool.execute(
      'INSERT INTO wishlist (user_id, product_id) VALUES (?, ?)',
      [req.user.id, productId]
    );

    res.status(201).json({ message: 'Product added to wishlist' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

const removeFromWishlist = async (req, res) => {
  try {
    const { id } = req.params;
    await pool.execute(
      'DELETE FROM wishlist WHERE id = ? AND user_id = ?',
      [id, req.user.id]
    );
    res.json({ message: 'Product removed from wishlist' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

module.exports = { getWishlist, addToWishlist, removeFromWishlist };
