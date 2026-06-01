
const pool = require('../config/db');

const getProductReviews = async (req, res) => {
  try {
    const { productId } = req.params;
    const [reviews] = await pool.execute(`
      SELECT r.*, u.name as user_name
      FROM reviews r
      JOIN users u ON r.user_id = u.id
      WHERE r.product_id = ? AND r.approved = 1
      ORDER BY r.created_at DESC
    `, [productId]);
    res.json(reviews);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

const createReview = async (req, res) => {
  try {
    const { productId, rating, comment } = req.body;

    const [existing] = await pool.execute(
      'SELECT * FROM reviews WHERE user_id = ? AND product_id = ?',
      [req.user.id, productId]
    );

    if (existing.length > 0) {
      return res.status(400).json({ message: 'You have already reviewed this product' });
    }

    const [result] = await pool.execute(
      'INSERT INTO reviews (user_id, product_id, rating, comment) VALUES (?, ?, ?, ?)',
      [req.user.id, productId, rating, comment]
    );

    res.status(201).json({ id: result.insertId, message: 'Review submitted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

const getAllReviews = async (req, res) => {
  try {
    const [reviews] = await pool.execute(`
      SELECT r.*, u.name as user_name, p.name as product_name
      FROM reviews r
      JOIN users u ON r.user_id = u.id
      JOIN products p ON r.product_id = p.id
      ORDER BY r.created_at DESC
    `);
    res.json(reviews);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

const approveReview = async (req, res) => {
  try {
    const { id } = req.params;
    await pool.execute('UPDATE reviews SET approved = 1 WHERE id = ?', [id]);
    res.json({ message: 'Review approved' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

const deleteReview = async (req, res) => {
  try {
    const { id } = req.params;
    await pool.execute('DELETE FROM reviews WHERE id = ?', [id]);
    res.json({ message: 'Review deleted' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

module.exports = { getProductReviews, createReview, getAllReviews, approveReview, deleteReview };
