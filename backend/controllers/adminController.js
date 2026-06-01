
const pool = require('../config/db');
const bcrypt = require('bcryptjs');

const getDashboardStats = async (req, res) => {
  try {
    const [totalUsers] = await pool.execute('SELECT COUNT(*) as count FROM users');
    const [totalProducts] = await pool.execute('SELECT COUNT(*) as count FROM products');
    const [totalOrders] = await pool.execute('SELECT COUNT(*) as count FROM orders');
    
    const [totalRevenue] = await pool.execute(
      "SELECT COALESCE(SUM(total_amount), 0) as revenue FROM orders WHERE payment_status = 'completed'"
    );

    const [recentOrders] = await pool.execute(`
      SELECT o.*, u.name as user_name
      FROM orders o
      LEFT JOIN users u ON o.user_id = u.id
      ORDER BY o.created_at DESC
      LIMIT 10
    `);

    const [topProducts] = await pool.execute(`
      SELECT p.id, p.name, p.slug, pi.image_url, COUNT(oi.id) as order_count
      FROM products p
      LEFT JOIN order_items oi ON p.id = oi.product_id
      LEFT JOIN product_images pi ON p.id = pi.product_id AND pi.is_primary = 1
      GROUP BY p.id
      ORDER BY order_count DESC
      LIMIT 5
    `);

    res.json({
      totalUsers: totalUsers[0].count,
      totalProducts: totalProducts[0].count,
      totalOrders: totalOrders[0].count,
      totalRevenue: totalRevenue[0].revenue,
      recentOrders,
      topProducts
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

const getUsers = async (req, res) => {
  try {
    const [users] = await pool.execute('SELECT id, name, email, phone, created_at FROM users ORDER BY created_at DESC');
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

const createAdmin = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    const [existing] = await pool.execute('SELECT id FROM admins WHERE email = ?', [email]);
    if (existing.length > 0) {
      return res.status(400).json({ message: 'Admin already exists' });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const [result] = await pool.execute(
      'INSERT INTO admins (name, email, password) VALUES (?, ?, ?)',
      [name, email, hashedPassword]
    );

    res.status(201).json({ id: result.insertId, message: 'Admin created successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

module.exports = { getDashboardStats, getUsers, createAdmin };
