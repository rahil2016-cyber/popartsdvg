const nodemailer = require('nodemailer');
require('dotenv').config();

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || 'smtp.gmail.com',
  port: process.env.SMTP_PORT || 587,
  secure: process.env.SMTP_SECURE === 'true',
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
        
        <div style="background-color: #f5f3ff; padding: 15px; border-radius: 8px; margin: 20px 0;">
          <h3 style="color: #673ab7; margin-top: 0;">Track Your Order</h3>
          <p>You can track the status of your order anytime using your Order Number: <strong>${order.order_number}</strong></p>
          <a href="https://www.popartsdvg.com/track-order" style="display: inline-block; background-color: #ec407a; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px; font-weight: bold; margin-top: 10px;">Track Order Now</a>
        </div>
        
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
