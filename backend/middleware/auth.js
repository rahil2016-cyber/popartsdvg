
const jwt = require('jsonwebtoken');
const pool = require('../config/db');

const protect = async (req, res, next) => {
  let token;

  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      token = req.headers.authorization.split(' ')[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      
      const [users] = await pool.execute('SELECT id, name, email FROM users WHERE id = ?', [decoded.id]);
      
      if (users.length === 0) {
        return res.status(401).json({ message: 'Not authorized, user not found' });
      }
      
      req.user = users[0];
      next();
    } catch (error) {
      res.status(401).json({ message: 'Not authorized, token failed' });
    }
  }

  if (!token) {
    res.status(401).json({ message: 'Not authorized, no token' });
  }
};

const adminProtect = async (req, res, next) => {
  let token;

  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      token = req.headers.authorization.split(' ')[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      
      const [admins] = await pool.execute('SELECT id, name, email FROM admins WHERE id = ?', [decoded.id]);
      
      if (admins.length === 0) {
        return res.status(401).json({ message: 'Not authorized as admin' });
      }
      
      req.admin = admins[0];
      next();
    } catch (error) {
      res.status(401).json({ message: 'Not authorized, token failed' });
    }
  }

  if (!token) {
    res.status(401).json({ message: 'Not authorized, no token' });
  }
};

module.exports = { protect, adminProtect };
