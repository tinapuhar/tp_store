require('dotenv').config();
const express = require('express');
const cors = require('cors');
const fs = require('fs'); 
const path = require('path'); 
const { Resend } = require('resend');
const rateLimit = require('express-rate-limit'); // new


const app = express();
const PORT = process.env.PORT || 5000;
const resend = new Resend(process.env.RESEND_API_KEY);

// Clear mapping to your orders data file registry
const ORDERS_FILE_PATH = path.join(__dirname, 'orders.json');

// Helper function to safely read items from orders.json without breaking
const getSoldRegistry = () => {
  try {
    if (!fs.existsSync(ORDERS_FILE_PATH)) {
      fs.writeFileSync(ORDERS_FILE_PATH, JSON.stringify([]));
      return [];
    }
    const rawData = fs.readFileSync(ORDERS_FILE_PATH, 'utf8');
    return JSON.parse(rawData || '[]');
  } catch (error) {
    console.error('Error reading records file:', error);
    return [];
  }
};

// Middleware configuration
app.use(cors());
app.use(express.json());

// FRAUD PROTECTION: Restricts any single IP connection to 5 checkout attempts per hour
const checkoutLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour window framework
  max: 5, 
  message: { 
    success: false, 
    message: 'Too many order attempts from this connection. Please try again in an hour.' 
  },
  standardHeaders: true, 
  legacyHeaders: false,  
});

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'API is running successfully!' });
});

// Endpoint: Feeds the global sold items to any browser on the internet
app.get('/api/sold-items', (req, res) => {
  res.json(getSoldRegistry());
});

// Endpoint for handling Contact Submissions & Forwarding to Email
app.post('/api/contact', async (req, res) => {
  try {
    const { customerName, customerEmail, message } = req.body;
    console.log('Received contact message:', { customerName, customerEmail, message });

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
app.post('/api/order', checkoutLimiter, async (req, res) => {
  try {
    const { 
      customerName, 
      customerEmail, 
      shippingAddress, 
      purchasedProductsBreakdown, 
      orderGrandTotal, 
      orderNotes,
      itemsArray 
    } = req.body;

    console.log('Received new order details:');
    console.log(`Customer: ${customerName} (${customerEmail})`);
    console.log(`Address: ${shippingAddress}`);
    console.log(`Order Notes / Message: ${orderNotes || 'None'}`);
    console.log(`Items Purchased:\n${purchasedProductsBreakdown}`);
    console.log(`Grand Total: ${orderGrandTotal}`);

    // GLOBAL LOCK: Append purchased items into orders.json file right now
    if (itemsArray && Array.isArray(itemsArray)) {
      const activeSoldRegistry = getSoldRegistry();
      const updatedSoldRegistry = [...activeSoldRegistry, ...itemsArray];
      fs.writeFileSync(ORDERS_FILE_PATH, JSON.stringify(updatedSoldRegistry, null, 2));
      console.log('Successfully recorded items permanently into orders.json registry');
    }

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

// SECURE DEVELOPER ENDPOINT: Returns multiple item variants back into live stock at once
app.post('/api/dev/return-items', (req, res) => {
  try {
    const incomingPassword = req.headers['x-dev-auth'];
    const secureSystemPassword = process.env.DEV_RESET_PASSWORD;

    // Authenticate using your hidden master password
    if (!incomingPassword || incomingPassword !== secureSystemPassword) {
      return res.status(403).json({ success: false, message: 'Unauthorized access denied.' });
    }

    const { itemsToReturn } = req.body; 

    if (!itemsToReturn || !Array.isArray(itemsToReturn) || itemsToReturn.length === 0) {
      return res.status(400).json({ success: false, message: 'Missing or invalid itemsToReturn array payload.' });
    }

    if (fs.existsSync(ORDERS_FILE_PATH)) {
      const rawData = fs.readFileSync(ORDERS_FILE_PATH, 'utf8');
      let activeSoldRegistry = JSON.parse(rawData || '[]');
      let itemsRemovedCount = 0;

      itemsToReturn.forEach(returnedItem => {
        const itemIndex = activeSoldRegistry.findIndex(
          soldItem => soldItem.id === returnedItem.id.toString() && soldItem.optionKey === returnedItem.optionKey
        );

        if (itemIndex > -1) {
          activeSoldRegistry.splice(itemIndex, 1);
          itemsRemovedCount++;
        }
      });

      if (itemsRemovedCount > 0) {
        fs.writeFileSync(ORDERS_FILE_PATH, JSON.stringify(activeSoldRegistry, null, 2));
        console.log(`Successfully restored ${itemsRemovedCount} item(s) back into live inventory.`);
        
        return res.status(200).json({ 
          success: true, 
          message: `Success! Restored ${itemsRemovedCount} item(s) back into live inventory.` 
        });
      } else {
        return res.status(404).json({ success: false, message: 'None of the provided items were found in the sold files logs.' });
      }
    }

    res.status(404).json({ success: false, message: 'Database ledger registry not initialized yet.' });
  } catch (error) {
    console.error('Error during multi-return processing execution:', error);
    res.status(500).json({ success: false, message: 'Server error during multi-return execution' });
  }
});

// SECURE DEVELOPER ENDPOINT: Backs up current sales monthly and resets the store inventory ledger
app.post('/api/dev/reset-inventory', (req, res) => {
  try {
    const incomingPassword = req.headers['x-dev-auth'];
    const secureSystemPassword = process.env.DEV_RESET_PASSWORD;

    // Validate the incoming custom header against our hidden .env token secret
    if (!incomingPassword || incomingPassword !== secureSystemPassword) {
      return res.status(403).json({ success: false, message: 'Unauthorized developer access denied.' });
    }

    if (fs.existsSync(ORDERS_FILE_PATH)) {
      const date = new Date();
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, '0');
      
      const backupFileName = `orders-backup-${year}-${month}.json`;
      const backupFilePath = path.join(__dirname, backupFileName);

      fs.copyFileSync(ORDERS_FILE_PATH, backupFilePath);
      console.log(`Inventory Archived Successfully! Saved as: ${backupFileName}`);
    }

    fs.writeFileSync(ORDERS_FILE_PATH, JSON.stringify([], null, 2));
    console.log('Active storefront inventory records have been completely reset.');

    res.status(200).json({ success: true, message: 'Storefront ledger archived and wiped successfully!' });
  } catch (error) {
    console.error('Error during archive reset procedure:', error);
    res.status(500).json({ success: false, message: 'Server error during archive execution' });
  }
});

// Main server application runtime listener
app.listen(PORT, () => {
  console.log(`Boutique API server running on port ${PORT}`);
});


