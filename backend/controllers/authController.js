
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const pool = require('../config/db');

const generateToken = (id) => {
  const secret = process.env.JWT_SECRET || 'fallback_secret_key_poparts_dvg_9876';
  const expire = process.env.JWT_EXPIRE || '7d';
  return jwt.sign({ id }, secret, {
    expiresIn: expire
  });
};

const register = async (req, res) => {
  try {
    const { name, email, password, phone } = req.body;

    const [existingUsers] = await pool.execute('SELECT id FROM users WHERE email = ?', [email]);
    
    if (existingUsers.length > 0) {
      return res.status(400).json({ message: 'User already exists' });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const [result] = await pool.execute(
      'INSERT INTO users (name, email, password, phone) VALUES (?, ?, ?, ?)',
      [name, email, hashedPassword, phone]
    );

    const [newUser] = await pool.execute('SELECT id, name, email, phone FROM users WHERE id = ?', [result.insertId]);

    res.status(201).json({
      _id: newUser[0].id,
      name: newUser[0].name,
      email: newUser[0].email,
      phone: newUser[0].phone,
      token: generateToken(newUser[0].id)
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const [users] = await pool.execute('SELECT * FROM users WHERE email = ?', [email]);

    if (users.length === 0) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const user = users[0];
    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    res.json({
      _id: user.id,
      name: user.name,
      email: user.email,
      phone: user.phone,
      address: user.address,
      token: generateToken(user.id)
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

const adminLogin = async (req, res) => {
  console.log('Admin login request received');
  console.log('Body:', req.body);
  try {
    const { email, password } = req.body;

    console.log('Looking for admin with email:', email);
    const [admins] = await pool.execute('SELECT * FROM admins WHERE email = ?', [email]);
    console.log('Admins found:', admins);

    if (admins.length === 0) {
      console.log('No admin found');
      return res.status(401).json({ message: 'Invalid admin credentials' });
    }

    const admin = admins[0];
    console.log('Comparing passwords...');
    const isMatch = await bcrypt.compare(password, admin.password);
    console.log('Password match:', isMatch);

    if (!isMatch) {
      console.log('Password mismatch');
      return res.status(401).json({ message: 'Invalid admin credentials' });
    }

    const token = generateToken(admin.id);
    console.log('Generated token:', token);

    res.json({
      _id: admin.id,
      name: admin.name,
      email: admin.email,
      token: token
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

const getMe = async (req, res) => {
  try {
    const [users] = await pool.execute('SELECT id, name, email, phone, address FROM users WHERE id = ?', [req.user.id]);
    
    if (users.length === 0) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json(users[0]);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

const updateProfile = async (req, res) => {
  try {
    const { name, phone, address } = req.body;

    await pool.execute(
      'UPDATE users SET name = ?, phone = ?, address = ? WHERE id = ?',
      [name, phone, address, req.user.id]
    );

    const [updatedUser] = await pool.execute(
      'SELECT id, name, email, phone, address FROM users WHERE id = ?',
      [req.user.id]
    );

    res.json(updatedUser[0]);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

module.exports = { register, login, adminLogin, getMe, updateProfile };
