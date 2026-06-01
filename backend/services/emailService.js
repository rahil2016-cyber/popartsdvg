const nodemailer = require('nodemailer');
require('dotenv').config();

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER || 'popartsdvg@gmail.com',
    pass: process.env.EMAIL_PASS || '',
  },
});

const sendOrderEmails = async (order, items) => {
  try {
    const adminEmail = 'popartsdvg@gmail.com';
    const customerEmail = order.customer_email;
    
    // Build order details for both emails
    const orderDetails = items.map(item => 
      `<li>${item.name} x ${item.quantity} - ₹${item.price} (Total: ₹${item.total})</li>`
    ).join('');

    const orderTotal = order.total_amount;

    const customerSubject = `🎉 Order Placed Successfully - POPARTS DVG`;
    const customerHtml = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
        <h2 style="color: #673ab7;">Thank You for Your Order! 🎁</h2>
        <p>Hi ${order.customer_name},</p>
        <p>Your order has been placed successfully!</p>
        <p><strong>Order Number:</strong> ${order.order_number}</p>
        <p><strong>Order Date:</strong> ${new Date(order.created_at).toLocaleString()}</p>
        <h3 style="color: #ec407a;">Order Details:</h3>
        <ul>${orderDetails}</ul>
        <p style="font-size: 18px; font-weight: bold; color: #673ab7;">Total: ₹${orderTotal}</p>
        <p>We'll keep you updated on your order status!</p>
        <p>Thanks,<br>The POPARTS DVG Team</p>
      </div>
    `;

    const adminSubject = `📦 New Order Received - ${order.order_number}`;
    const adminHtml = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
        <h2 style="color: #673ab7;">New Order Received! 🎉</h2>
        <p><strong>Order Number:</strong> ${order.order_number}</p>
        <p><strong>Customer Name:</strong> ${order.customer_name}</p>
        <p><strong>Customer Email:</strong> ${customerEmail}</p>
        <p><strong>Customer Phone:</strong> ${order.customer_phone}</p>
        <p><strong>Delivery Type:</strong> ${order.delivery_type}</p>
        <h3 style="color: #ec407a;">Order Details:</h3>
        <ul>${orderDetails}</ul>
        <p style="font-size: 18px; font-weight: bold; color: #673ab7;">Total: ₹${orderTotal}</p>
      </div>
    `;

    // Send email to customer
    await transporter.sendMail({
      from: 'popartsdvg@gmail.com',
      to: customerEmail,
      subject: customerSubject,
      html: customerHtml
    });

    // Send email to admin
    await transporter.sendMail({
      from: 'popartsdvg@gmail.com',
      to: adminEmail,
      subject: adminSubject,
      html: adminHtml
    });

    console.log('Order emails sent successfully!');
  } catch (error) {
    console.error('Error sending emails:', error);
  }
};

module.exports = { sendOrderEmails };
