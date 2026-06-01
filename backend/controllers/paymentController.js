const { Cashfree, CFEnvironment } = require('cashfree-pg');
const pool = require('../config/db');

Cashfree.XClientId = process.env.CASHFREE_APP_ID;
Cashfree.XClientSecret = process.env.CASHFREE_SECRET_KEY;
Cashfree.XEnvironment = process.env.CASHFREE_ENV === 'PRODUCTION' ? CFEnvironment.PRODUCTION : CFEnvironment.SANDBOX;

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

    let phone = String(order.customer_phone || "9999999999");
    // Ensure phone is at least 10 digits for Cashfree
    if (phone.replace(/[^0-9]/g, '').length < 10) {
      phone = "9999999999";
    }

    // Prepare Create Order Request for Cashfree
    const request = {
      order_amount: parseFloat(order.total_amount),
      order_currency: "INR",
      order_id: order.order_number, // Unique order number generated during order creation
      customer_details: {
        customer_id: order.user_id ? order.user_id.toString() : 'guest_' + Date.now(),
        customer_phone: phone,
        customer_email: order.customer_email || "guest@example.com",
        customer_name: order.customer_name || "Guest User"
      },
      order_meta: {
        return_url: `${process.env.CLIENT_URL || 'http://localhost:5173'}/payment/verify/${order.order_number}?order_id={order_id}`
      }
    };

    const cashfree = new Cashfree();
    const response = await cashfree.PGCreateOrder("2023-08-01", request);
    res.json({ payment_session_id: response.data.payment_session_id, order_id: response.data.order_id });
  } catch (error) {
    console.error('Error creating Cashfree session:', error.response?.data || error.message);
    res.status(500).json({ message: 'Could not create payment session', error: error.response?.data?.message || error.message });
  }
};

const verifyPayment = async (req, res) => {
  try {
    const { order_id } = req.body;

    const cashfree = new Cashfree();
    const response = await cashfree.PGOrderFetchPayments("2023-08-01", order_id);
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

const cashfreeWebhook = async (req, res) => {
  try {
    const cashfreeSignature = req.headers['x-webhook-signature'];
    
    // In a real production environment, you should verify the signature using Cashfree SDK
    // Cashfree.PGVerifyWebhookSignature(cashfreeSignature, req.rawBody, process.env.CASHFREE_SECRET_KEY)
    
    const payload = req.body;
    
    // Check if it's a successful payment event
    if (payload.type === 'PAYMENT_SUCCESS_WEBHOOK' && payload.data && payload.data.payment) {
      const paymentStatus = payload.data.payment.payment_status;
      const orderId = payload.data.order.order_id;
      
      if (paymentStatus === 'SUCCESS') {
        // Update order status in DB
        await pool.execute(
          'UPDATE orders SET payment_status = ?, order_status = ? WHERE order_number = ?',
          ['completed', 'processing', orderId]
        );
        console.log(`Webhook successfully processed payment for order ${orderId}`);
      }
    }
    
    res.status(200).send('OK');
  } catch (error) {
    console.error('Error processing Cashfree webhook:', error);
    res.status(500).send('Webhook Error');
  }
};

module.exports = {
  createSession,
  verifyPayment,
  cashfreeWebhook
};
