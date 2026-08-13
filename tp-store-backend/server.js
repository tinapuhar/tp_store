require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { Resend } = require('resend');

const app = express();
const PORT = process.env.PORT || 5000;
const resend = new Resend(process.env.RESEND_API_KEY);

// Middleware configuration
app.use(cors());
app.use(express.json());

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'API is running successfully!' });
});

// Endpoint for handling Contact Submissions & Forwarding to Email
app.post('/api/contact', async (req, res) => {
  try {
    const { customerName, customerEmail, message } = req.body;
    console.log('Received contact message:', { customerName, customerEmail, message });

    // Send email via Resend straight to your personal inbox
    await resend.emails.send({
      from: 'Acme <onboarding@resend.dev>',
      to: ['tinapuhar@gmail.com'], 
      subject: `New Contact Inquiry from ${customerName}`,
      html: `<p><strong>Name:</strong> ${customerName}</p>
             <p><strong>Email:</strong> ${customerEmail}</p>
             <p><strong>Message:</strong><br/>${message}</p>`
    });

    res.status(200).json({ success: true, message: 'Contact message processed and emailed successfully' });
  } catch (error) {
    console.error('Contact error:', error);
    res.status(500).json({ success: false, message: 'Server error processing contact email' });
  }
});

// Endpoint for handling Orders / Checkouts & Forwarding to Email
app.post('/api/order', async (req, res) => {
  try {
    const { 
      customerName, 
      customerEmail, 
      shippingAddress, 
      purchasedProductsBreakdown, 
      orderGrandTotal, 
      orderNotes 
    } = req.body;

    console.log('Received new order details:');
    console.log(`Customer: ${customerName} (${customerEmail})`);
    console.log(`Address: ${shippingAddress}`);
    console.log(`Order Notes / Message: ${orderNotes || 'None'}`);
    console.log(`Items Purchased:\n${purchasedProductsBreakdown}`);
    console.log(`Grand Total: ${orderGrandTotal}`);

    // Send order receipt via Resend straight to your personal inbox
    await resend.emails.send({
      from: 'Acme <onboarding@resend.dev>',
      to: ['tinapuhar@gmail.com'],
      subject: `New Order Confirmed - ${orderGrandTotal}`,
      html: `<h2>New Order Received!</h2>
             <p><strong>Customer:</strong> ${customerName} (${customerEmail})</p>
             <p><strong>Shipping Address:</strong><br/>${shippingAddress}</p>
             <p><strong>Order Notes:</strong> ${orderNotes || 'None'}</p>
             <hr/>
             <p><strong>Items Purchased:</strong><br/><pre>${purchasedProductsBreakdown}</pre></p>
             <p><strong>Grand Total:</strong> ${orderGrandTotal}</p>`
    });

    res.status(200).json({ success: true, message: 'Order submitted, logged, and emailed successfully' });
  } catch (error) {
    console.error('Order error:', error);
    res.status(500).json({ success: false, message: 'Server error processing order email' });
  }
});

app.listen(PORT, () => {
  console.log(`Boutique API server running on port ${PORT}`);
});
