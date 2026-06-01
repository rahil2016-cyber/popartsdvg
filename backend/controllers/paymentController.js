const { Cashfree, CFEnvironment } = require('cashfree-pg');
const pool = require('../config/db');

const cashfree = new Cashfree(
  process.env.CASHFREE_ENV === 'PRODUCTION' ? CFEnvironment.PRODUCTION : CFEnvironment.SANDBOX,
  process.env.CASHFREE_APP_ID,
  process.env.CASHFREE_SECRET_KEY
);

const createSession = async (req, res) => {
  try {
    const { orderId } = req.body;
    const userId = req.user ? req.user.id : null;

    // Fetch order details
    const [orders] = await pool.execute('SELECT * FROM orders WHERE id = ?', [orderId]);
    if (orders.length === 0) {
      return res.status(404).json({ message: 'Order not found' });
    }

    const order = orders[0];

    // Ensure order belongs to user if logged in
    if (userId && order.user_id && order.user_id !== userId) {
      return res.status(403).json({ message: 'Unauthorized access to this order' });
    }

    // Prepare Create Order Request for Cashfree
    const request = {
      order_amount: parseFloat(order.total_amount),
      order_currency: "INR",
      order_id: order.order_number, // Unique order number generated during order creation
      customer_details: {
        customer_id: order.user_id ? order.user_id.toString() : 'guest_' + Date.now(),
        customer_phone: order.customer_phone || "9999999999",
        customer_email: order.customer_email || "guest@example.com",
        customer_name: order.customer_name || "Guest User"
      },
      order_meta: {
        return_url: `${process.env.CLIENT_URL || 'http://localhost:5173'}/payment/verify/${order.order_number}?order_id={order_id}`
      }
    };

    const response = await cashfree.PGCreateOrder(request);
    res.json({ payment_session_id: response.data.payment_session_id, order_id: response.data.order_id });
  } catch (error) {
    console.error('Error creating Cashfree session:', error.response?.data || error.message);
    res.status(500).json({ message: 'Could not create payment session', error: error.response?.data?.message || error.message });
  }
};

const verifyPayment = async (req, res) => {
  try {
    const { order_id } = req.body;

    const response = await cashfree.PGOrderFetchPayments(order_id);
    const payments = response.data;
    
    // Check if any payment is successful
    const successfulPayment = payments.find(p => p.payment_status === 'SUCCESS');

    if (successfulPayment) {
      // Update order status in DB
      await pool.execute(
        'UPDATE orders SET payment_status = ?, order_status = ? WHERE order_number = ?',
        ['completed', 'processing', order_id]
      );
      res.json({ success: true, message: 'Payment verified successfully', payment: successfulPayment });
    } else {
      res.json({ success: false, message: 'Payment not successful yet' });
    }
  } catch (error) {
    console.error('Error verifying Cashfree payment:', error.response?.data || error.message);
    res.status(500).json({ message: 'Could not verify payment', error: error.response?.data?.message || error.message });
  }
};

module.exports = {
  createSession,
  verifyPayment
};
