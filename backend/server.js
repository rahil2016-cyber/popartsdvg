
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

const errorHandler = require('./middleware/errorHandler');

let dbSetupError = null;
const setupDatabase = require('./setup.js');
const dbSetupPromise = setupDatabase()
  .then(() => console.log('✅ Database setup/migration completed successfully.'))
  .catch(err => {
    console.error('⚠️ Database setup/migration failed:', err.message);
    dbSetupError = err;
  });

const app = express();

app.use(async (req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
  try {
    await dbSetupPromise;
    next();
  } catch (err) {
    next(err);
  }
});


app.use(helmet({
  contentSecurityPolicy: false, // Disable CSP temporarily for testing
  crossOriginResourcePolicy: { policy: "cross-origin" },
  crossOriginOpenerPolicy: { policy: "same-origin-allow-popups" },
}));

app.use(cors({ origin: true, credentials: true }));
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
      dbSetupError: dbSetupError ? dbSetupError.message : null,
      dbSetupErrorStack: dbSetupError ? dbSetupError.stack : null
    });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message, stack: err.stack, dbSetupError: dbSetupError ? dbSetupError.message : null });
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

