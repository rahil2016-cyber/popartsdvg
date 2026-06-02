
const pool = require('../config/db');
const moment = require('moment');
const { sendOrderEmails } = require('../services/emailService');

const generateOrderNumber = () => {
  return 'POP' + Date.now().toString(36).toUpperCase() + Math.random().toString(36).substr(2, 5).toUpperCase();
};

const createOrder = async (req, res) => {
  const connection = await pool.getConnection();
  
  try {
    await connection.beginTransaction();

    const {
      items,
      shippingAddress,
      billingAddress,
      paymentMethod,
      couponCode,
      customerName,
      customerEmail,
      customerPhone,
      deliveryType,
      deliveryCharge
    } = req.body;

    const userId = req.user ? req.user.id : null;

    let couponId = null;
    let discountAmount = 0;
    if (couponCode) {
      const [coupons] = await connection.execute(
        'SELECT * FROM coupons WHERE code = ? AND active = 1 AND valid_from <= NOW() AND (valid_to IS NULL OR valid_to >= NOW())',
        [couponCode]
      );

      if (coupons.length > 0) {
        const coupon = coupons[0];
        if (coupon.usage_limit && coupon.used_count >= coupon.usage_limit) {
          throw new Error('Coupon usage limit exceeded');
        }
        couponId = coupon.id;
      }
    }

    let totalAmount = 0;
    const orderItems = [];

    for (const item of items) {
      const [products] = await connection.execute('SELECT * FROM products WHERE id = ?', [item.productId]);
      if (products.length === 0) {
        throw new Error(`Product not found: ${item.productId}`);
      }
      const product = products[0];
      const price = product.discount_price || product.price;
      const itemTotal = price * item.quantity;
      totalAmount += itemTotal;
      orderItems.push({ productId: item.productId, quantity: item.quantity, price, total: itemTotal });
    }

    if (couponId) {
      const [coupons] = await connection.execute('SELECT * FROM coupons WHERE id = ?', [couponId]);
      const coupon = coupons[0];

      if (coupon.min_order_value && totalAmount < coupon.min_order_value) {
        throw new Error('Minimum order value not met for this coupon');
      }

      if (coupon.discount_type === 'percentage') {
        discountAmount = (totalAmount * coupon.discount_value) / 100;
      } else {
        discountAmount = coupon.discount_value;
      }

      if (coupon.max_discount && discountAmount > coupon.max_discount) {
        discountAmount = coupon.max_discount;
      }
    }

    const finalAmount = totalAmount - discountAmount + (deliveryCharge || 0);
    const orderNumber = generateOrderNumber();

    const [orderResult] = await connection.execute(
      `INSERT INTO orders (user_id, order_number, total_amount, discount_amount, coupon_id, payment_method, 
        shipping_address, billing_address, customer_name, customer_email, customer_phone, delivery_type, delivery_charge) 
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        userId,
        orderNumber,
        finalAmount,
        discountAmount,
        couponId,
        paymentMethod,
        JSON.stringify(shippingAddress),
        billingAddress ? JSON.stringify(billingAddress) : null,
        customerName,
        customerEmail,
        customerPhone,
        deliveryType || 'shipping',
        deliveryCharge || 0
      ]
    );

    const orderId = orderResult.insertId;

    for (const item of orderItems) {
      await connection.execute(
        'INSERT INTO order_items (order_id, product_id, quantity, price, total) VALUES (?, ?, ?, ?, ?)',
        [orderId, item.productId, item.quantity, item.price, item.total]
      );
    }

    if (couponId) {
      await connection.execute('UPDATE coupons SET used_count = used_count + 1 WHERE id = ?', [couponId]);
    }

    await connection.commit();

    const [newOrder] = await connection.execute('SELECT * FROM orders WHERE id = ?', [orderId]);
    
    // Get items with product details for email
    const [orderItemsForEmail] = await connection.execute(`
      SELECT oi.*, p.name
      FROM order_items oi
      JOIN products p ON oi.product_id = p.id
      WHERE oi.order_id = ?
    `, [orderId]);

    // Only send email immediately for COD orders
    // Online payment orders get their email after payment is verified in paymentController.js
    if (paymentMethod === 'COD') {
      sendOrderEmails(newOrder[0], orderItemsForEmail);
    }

    res.status(201).json(newOrder[0]);

  } catch (error) {
    await connection.rollback();
    res.status(500).json({ message: error.message || 'Server error' });
  } finally {
    connection.release();
  }
};

const getMyOrders = async (req, res) => {
  try {
    const [orders] = await pool.execute(
      'SELECT * FROM orders WHERE user_id = ? ORDER BY created_at DESC',
      [req.user.id]
    );

    for (const order of orders) {
      const [items] = await pool.execute(`
        SELECT oi.*, p.name, p.slug, pi.image_url as product_image
        FROM order_items oi
        JOIN products p ON oi.product_id = p.id
        LEFT JOIN product_images pi ON p.id = pi.product_id AND pi.is_primary = 1
        WHERE oi.order_id = ?
      `, [order.id]);
      order.items = items;
    }

    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

const getOrderById = async (req, res) => {
  try {
    const { id } = req.params;
    
    let query = 'SELECT * FROM orders WHERE id = ? OR order_number = ?';
    const params = [id, id];

    if (req.user) {
      query += ' AND user_id = ?';
      params.push(req.user.id);
    }

    const [orders] = await pool.execute(query, params);

    if (orders.length === 0) {
      return res.status(404).json({ message: 'Order not found' });
    }

    const order = orders[0];
    const [items] = await pool.execute(`
      SELECT oi.*, p.name, p.slug, pi.image_url as product_image
      FROM order_items oi
      JOIN products p ON oi.product_id = p.id
      LEFT JOIN product_images pi ON p.id = pi.product_id AND pi.is_primary = 1
      WHERE oi.order_id = ?
    `, [order.id]);
    order.items = items;

    res.json(order);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

const getAllOrders = async (req, res) => {
  try {
    const { status, page = 1, limit = 20 } = req.query;
    const offset = (page - 1) * limit;

    let query = "SELECT * FROM orders WHERE (payment_method = 'COD' OR payment_status != 'pending')";
    const params = [];

    if (status) {
      query += ' AND order_status = ?';
      params.push(status);
    }

    query += ' ORDER BY created_at DESC LIMIT ? OFFSET ?';
    params.push(parseInt(limit), parseInt(offset));

    const [orders] = await pool.query(query, params);

    const [countResult] = await pool.query(
      query.replace(/SELECT.*FROM/, 'SELECT COUNT(*) as total FROM').replace(/ORDER BY.*$/, ''),
      params.slice(0, -2)
    );

    res.json({
      orders,
      total: countResult[0].total,
      page: parseInt(page),
      pages: Math.ceil(countResult[0].total / limit)
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

const updateOrderStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { orderStatus, paymentStatus, trackingNumber } = req.body;

    let query = 'UPDATE orders SET ';
    const params = [];
    const updates = [];

    if (orderStatus) {
      updates.push('order_status = ?');
      params.push(orderStatus);
      if (orderStatus === 'shipped') {
        updates.push('shipped_at = NOW()');
      }
      if (orderStatus === 'delivered') {
        updates.push('delivered_at = NOW()');
      }
    }

    if (paymentStatus) {
      updates.push('payment_status = ?');
      params.push(paymentStatus);
    }

    if (trackingNumber !== undefined) {
      updates.push('tracking_number = ?');
      params.push(trackingNumber);
    }

    if (updates.length === 0) {
      return res.status(400).json({ message: 'No fields to update' });
    }

    query += updates.join(', ') + ' WHERE id = ?';
    params.push(id);

    await pool.execute(query, params);
    res.json({ message: 'Order updated successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

module.exports = { createOrder, getMyOrders, getOrderById, getAllOrders, updateOrderStatus };
