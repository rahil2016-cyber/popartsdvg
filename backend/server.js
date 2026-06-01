
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const path = require('path');
require('dotenv').config();

const authRoutes = require('./routes/authRoutes');
const productRoutes = require('./routes/productRoutes');
const categoryRoutes = require('./routes/categoryRoutes');
const cartRoutes = require('./routes/cartRoutes');
const wishlistRoutes = require('./routes/wishlistRoutes');
const orderRoutes = require('./routes/orderRoutes');
const couponRoutes = require('./routes/couponRoutes');
const reviewRoutes = require('./routes/reviewRoutes');
const bannerRoutes = require('./routes/bannerRoutes');
const reelRoutes = require('./routes/reelRoutes');
const adminRoutes = require('./routes/adminRoutes');
const paymentRoutes = require('./routes/paymentRoutes');

const errorHandler = require('./middleware/errorHandler');

// DB setup must be triggered manually via /api/run-setup endpoint
const setupDatabase = require('./setup.js');

const app = express();

app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
  next();
});

app.use(helmet({
  contentSecurityPolicy: false,
  crossOriginResourcePolicy: { policy: "cross-origin" },
  crossOriginOpenerPolicy: { policy: "same-origin-allow-popups" },
}));

app.use(cors({ 
  origin: process.env.CLIENT_URL || 'http://localhost:5173', 
  credentials: true 
}));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

app.use('/uploads', express.static(path.join(__dirname, 'public/uploads')));
app.use('/uploads', express.static('/tmp'));
app.use('/api/uploads', express.static(path.join(__dirname, 'public/uploads')));
app.use('/api/uploads', express.static('/tmp'));

const apiRouter = express.Router();

apiRouter.use('/auth', authRoutes);
apiRouter.use('/products', productRoutes);
apiRouter.use('/categories', categoryRoutes);
apiRouter.use('/cart', cartRoutes);
apiRouter.use('/wishlist', wishlistRoutes);
apiRouter.use('/orders', orderRoutes);
apiRouter.use('/coupons', couponRoutes);
apiRouter.use('/reviews', reviewRoutes);
apiRouter.use('/banners', bannerRoutes);
apiRouter.use('/reels', reelRoutes);
apiRouter.use('/admin', adminRoutes);
apiRouter.use('/payments', paymentRoutes);

apiRouter.get('/health', (req, res) => {
  res.json({ message: 'POPARTS DVG API is running!' });
});

apiRouter.get('/db-status', async (req, res) => {
  try {
    const pool = require('./config/db');
    const [tables] = await pool.execute('SHOW TABLES');
    const [categories] = await pool.execute('SELECT * FROM categories');
    res.json({
      success: true,
      tables: tables.map(row => Object.values(row)[0]),
      categories: categories,
    });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

apiRouter.get('/run-setup', async (req, res) => {
  try {
    await setupDatabase();
    res.json({ success: true, message: 'Database setup completed!' });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

apiRouter.get('/test-products', async (req, res) => {
  try {
    const pool = require('./config/db');
    const [products] = await pool.execute(
      'SELECT p.*, c.name as category_name FROM products p LEFT JOIN categories c ON p.category_id = c.id ORDER BY p.created_at DESC LIMIT 12'
    );
    res.json({ success: true, count: products.length, products });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message, stack: err.stack });
  }
});

app.use('/api', apiRouter);
app.use('/', apiRouter);

app.use(errorHandler);

const PORT = process.env.PORT || 5000;

if (process.env.NODE_ENV !== 'production' || require.main === module || process.env.PORT) {
  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on port ${PORT}`);
  });
}

module.exports = app;
