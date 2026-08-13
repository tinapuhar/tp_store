require('dotenv').config();
const express = require('express');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware configuration
app.use(cors());
app.use(express.json());

// Test API endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'API is running successfully!' });
});

// Endpoint for handling Contact Submissions
app.post('/api/contact', async (req, res) => {
  try {
    const { customerName, customerEmail, message } = req.body;
    console.log('Received contact message:', { customerName, customerEmail, message });

    // Here you could integrate Nodemailer or forward to your Pipedream webhook
    res.status(200).json({ success: true, message: 'Contact message processed successfully' });
  } catch (error) {
    console.error('Contact error:', error);
    res.status(500).json({ success: false, message: 'Server error processing contact' });
  }
});

// Endpoint for handling Orders / Checkouts
app.post('/api/order', async (req, res) => {
  try {
    const { customerName, customerEmail, shippingAddress, purchasedProductsBreakdown, orderGrandTotal } = req.body;
    console.log('Received new order:', { customerName, customerEmail, orderGrandTotal });

    // Here you can log the order, trigger emails, or save to a database (MongoDB / PostgreSQL)
    res.status(200).json({ success: true, message: 'Order submitted successfully' });
  } catch (error) {
    console.error('Order error:', error);
    res.status(500).json({ success: false, message: 'Server error processing order' });
  }
});

app.listen(PORT, () => {
  console.log(`Boutique API server running on port ${PORT}`);
});