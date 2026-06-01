
const pool = require('../config/db');

const getCart = async (req, res) => {
  try {
    console.log('Get cart request:', req.query);
    const userId = req.user ? req.user.id : null;
    const sessionId = req.query.sessionId;

    let query = `
      SELECT c.*, p.name, p.price, p.discount_price, p.slug,
             pi.image_url as product_image
      FROM cart c
      JOIN products p ON c.product_id = p.id
      LEFT JOIN product_images pi ON p.id = pi.product_id AND pi.is_primary = 1
      WHERE 
    `;
    const params = [];

    if (userId) {
      query += ' c.user_id = ?';
      params.push(userId);
    } else if (sessionId) {
      query += ' c.session_id = ?';
      params.push(sessionId);
    } else {
      console.log('No userId or sessionId');
      return res.json({ items: [], total: 0 });
    }

    console.log('Get cart query:', query, params);
    const [items] = await pool.execute(query, params);

    let total = 0;
    items.forEach(item => {
      const price = item.discount_price || item.price;
      item.total = price * item.quantity;
      total += item.total;
    });

    console.log('Returning cart:', { items, total });
    res.json({ items, total });
  } catch (error) {
    console.error('Get cart error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

const addToCart = async (req, res) => {
  try {
    console.log('Add to cart request:', req.body);
    const { productId, quantity, sessionId } = req.body;
    const userId = req.user ? req.user.id : null;

    const [existingItems] = await pool.execute(
      'SELECT * FROM cart WHERE product_id = ? AND (user_id = ? OR session_id = ?)',
      [productId, userId, sessionId]
    );

    console.log('Existing items:', existingItems);

    if (existingItems.length > 0) {
      await pool.execute(
        'UPDATE cart SET quantity = quantity + ? WHERE id = ?',
        [quantity, existingItems[0].id]
      );
    } else {
      await pool.execute(
        'INSERT INTO cart (user_id, session_id, product_id, quantity) VALUES (?, ?, ?, ?)',
        [userId, sessionId, productId, quantity]
      );
    }

    res.json({ message: 'Item added to cart' });
  } catch (error) {
    console.error('Add to cart error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

const updateCartItem = async (req, res) => {
  try {
    const { id } = req.params;
    const { quantity } = req.body;
    const userId = req.user ? req.user.id : null;

    await pool.execute(
      'UPDATE cart SET quantity = ? WHERE id = ? AND (user_id = ? OR session_id = ?)',
      [quantity, id, userId, req.query.sessionId]
    );

    res.json({ message: 'Cart item updated' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

const removeFromCart = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user ? req.user.id : null;

    await pool.execute(
      'DELETE FROM cart WHERE id = ? AND (user_id = ? OR session_id = ?)',
      [id, userId, req.query.sessionId]
    );

    res.json({ message: 'Item removed from cart' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

const clearCart = async (req, res) => {
  try {
    const userId = req.user ? req.user.id : null;
    const sessionId = req.query.sessionId;

    if (userId) {
      await pool.execute('DELETE FROM cart WHERE user_id = ?', [userId]);
    } else if (sessionId) {
      await pool.execute('DELETE FROM cart WHERE session_id = ?', [sessionId]);
    }

    res.json({ message: 'Cart cleared' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

module.exports = { getCart, addToCart, updateCartItem, removeFromCart, clearCart };
