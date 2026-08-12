/*import React from 'react';

const Cart = () => {
  return (
    <div className="page-container cart-page">
      <h2>Your Shopping Cart</h2>
      <p>Review the items you have selected before checkout.</p>
      {Cart items list will go here}
    </div>
  );
};

export default Cart;*/

import React, { useState } from 'react';
import { useCart } from '../context/cart_context.jsx';
import Button from '../components/Button.jsx';
import './cart.scss';
import { useNavigate } from 'react-router-dom';

export default function Cart() {
  const { cart, removeFromCart, cartTotal, clearCart } = useCart();
  
  // Default payment selection set to Bank Transfer since others are locked
  const [paymentMethod, setPaymentMethod] = useState('bank-transfer');
  const [isProcessing, setIsProcessing] = useState(false);
  
  // State tracking parameters for customer details
  const [customerInfo, setCustomerInfo] = useState({
    fullName: '',
    email: '',
    shippingAddress: '',
    orderNotes: ''
  });

  // Summarize products list into clear text rows for your Pipedream notification email
  const serializedOrderDetails = cart
    .map(item => `- ${item.title} (${item.optionLabel || item.option}) x${item.quantity}: €${((item.unitPrice || item.price) * item.quantity).toFixed(2)}`)
    .join('\n');

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setCustomerInfo(prev => ({ ...prev, [name]: value }));
  };

  const handleCheckoutSubmit = async (e) => {
    e.preventDefault();
    if (cart.length === 0) return alert("Your cart is currently empty.");
    
    setIsProcessing(true);
    const PIPEDREAM_WEBHOOK_URL = "https://pipedream.net";

    try {
      const response = await fetch(PIPEDREAM_WEBHOOK_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          formType: "Checkout Transaction Order",
          orderGrandTotal: `€${cartTotal.toFixed(2)}`,
          selectedPaymentRoute: "Direct Bank Wire Transfer",
          purchasedProductsBreakdown: serializedOrderDetails,
          
          // Injecting customer fields safely into Pipedream webhook package
          customerName: customerInfo.fullName,
          customerEmail: customerInfo.email,
          shippingAddress: customerInfo.shippingAddress,
          orderNotes: customerInfo.orderNotes,
          
          targetInbox: "tinapuhar@gmail.com"
        })
      });

      if (response.ok) {
        alert(
          `Order Confirmed via Bank Transfer!\n\nThank you, ${customerInfo.fullName}. A complete statement, payment details, and shipping invoice breakdown has been logged and sent to tinapuhar@gmail.com.`
        );
        clearCart(); // Clear local storage basket state on complete success
      } else {
        throw new Error("Network payload rejected.");
      }
    } catch (error) {
      alert('An error occurred during order routing. Please check your connection and try again.');
    } finally {
      setIsProcessing(false);
    }
  };
    return (
    <div className="page-container cart-page">
      <h1 className="cart-title">Your Shopping Basket</h1>

      {cart.length === 0 ? (
        <div className="empty-cart-message">
          <p>Your basket is empty. Explore our collection to add handcrafted natural jewelry.</p>
        </div>
      ) : (
        // Master layout grid wrap
        <form className="cart-layout-grid" onSubmit={handleCheckoutSubmit}>
          
          {/*Left Column Section: Items and Customer Info*/}
          <div className="cart-left-column" style={{ flex: 1.6, display: 'flex', flexDirection: 'column', gap: '2.5rem' }}>
            
            {/*Basket Items List*/}
            <div className="cart-items-list" style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              {cart.map((item) => {
                const optionKey = item.optionKey || item.option;
                const optionLabel = item.optionLabel || item.option;
                const unitPrice = item.unitPrice || item.price || 0;

                return (
                  <div key={`${item.id}-${optionKey}`} className="cart-flat-item-card">
                    <div className="item-thumbnail">
                      <img src={item.image} alt={item.title} />
                    </div>
                    <div className="item-details">
                      <div className="item-main-header">
                        <h3>{item.title}</h3>
                        <button 
                          type="button" 
                          className="delete-item-btn" 
                          onClick={() => removeFromCart(item.id, optionKey)}
                          title="Remove piece"
                        >
                          ✕
                        </button>
                      </div>
                      <p className="item-spec">{optionLabel}</p>
                      <div className="price-quantity-row">
                        <span className="qty-tag">Quantity: {item.quantity}</span>
                        <span className="price-tag">
                          {item.isDiscounted && <span className="discount-alert">(-10%) </span>}
                          €{(unitPrice * item.quantity).toFixed(2)}
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/*Delivery Information Block Form Fields*/}
            <div className="checkout-details-card" style={{
              backgroundColor: 'rgba(2, 44, 51, 0.45)',
              border: '1px solid #022c33',
              borderRadius: '8px',
              padding: '2rem',
              textAlign: 'left',
              boxShadow: '0 8px 24px rgba(0,0,0,0.4)'
            }}>
              <h2 style={{ color: 'white', fontSize: '1.5rem', marginBottom: '1.5rem', borderBottom: '1px solid rgba(249,242,149,0.15)', paddingBottom: '0.5rem' }}>
                Delivery Information
              </h2>
              
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                  <label style={{ fontSize: '0.85rem', color: '#d9abe6', textTransform: 'uppercase', letterSpacing: '1px', fontWeight: '600' }}>Full Name</label>
                  <input type="text" name="fullName" value={customerInfo.fullName} onChange={handleInputChange} placeholder="First and last name" required style={{ padding: '0.75rem', fontSize: '1rem', borderRadius: '4px', border: '1px solid #022c33', backgroundColor: 'rgba(0,0,0,0.3)', color: 'white', outline: 'none' }} />
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                  <label style={{ fontSize: '0.85rem', color: '#d9abe6', textTransform: 'uppercase', letterSpacing: '1px', fontWeight: '600' }}>E-mail Address</label>
                  <input type="email" name="email" value={customerInfo.email} onChange={handleInputChange} placeholder="your.email@example.com" required style={{ padding: '0.75rem', fontSize: '1rem', borderRadius: '4px', border: '1px solid #022c33', backgroundColor: 'rgba(0,0,0,0.3)', color: 'white', outline: 'none' }} />
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                  <label style={{ fontSize: '0.85rem', color: '#d9abe6', textTransform: 'uppercase', letterSpacing: '1px', fontWeight: '600' }}>Shipping Address</label>
                  <textarea name="shippingAddress" value={customerInfo.shippingAddress} onChange={handleInputChange} rows="3" placeholder="Street name, house number, zip code, city, country" required style={{ padding: '0.75rem', fontSize: '1rem', borderRadius: '4px', border: '1px solid #022c33', backgroundColor: 'rgba(0,0,0,0.3)', color: 'white', outline: 'none', resize: 'vertical', fontFamily: 'inherit' }}></textarea>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                  <label style={{ fontSize: '0.85rem', color: '#d9abe6', textTransform: 'uppercase', letterSpacing: '1px', fontWeight: '600' }}>Order Message / Request (Optional)</label>
                  <textarea name="orderNotes" value={customerInfo.orderNotes} onChange={handleInputChange} rows="2" placeholder="Requests or details about shipment..." style={{ padding: '0.75rem', fontSize: '1rem', borderRadius: '4px', border: '1px solid #022c33', backgroundColor: 'rgba(0,0,0,0.3)', color: 'white', outline: 'none', resize: 'vertical', fontFamily: 'inherit' }}></textarea>
                </div>
              </div>
            </div>

          </div>

          {/*Right Column Section: Summary Panel*/}
          <div className="checkout-summary-panel" style={{ flex: 1 }}>
            <h2>Order Summary</h2>
            
            <div className="summary-row total-row">
              <span>Total Price:</span>
              <span className="final-total">€{cartTotal.toFixed(2)}</span>
            </div>

            <div className="payment-options-section">
              <h3>Payment Method</h3>
              
              {/*Temporarily Disabled Choices*/}
              <label className="payment-radio-label disabled" style={{ opacity: 0.35, cursor: 'not-allowed', backgroundColor: 'rgba(0,0,0,0.1)' }}>
                <input type="radio" name="payment_selection_group" value="credit-card" disabled />
                <span className="radio-custom" style={{ borderColor: '#a6a6a6' }}></span>
                Credit Card (Coming Soon)
              </label>

              <label className="payment-radio-label disabled" style={{ opacity: 0.35, cursor: 'not-allowed', backgroundColor: 'rgba(0,0,0,0.1)' }}>
                <input type="radio" name="payment_selection_group" value="paypal" disabled />
                <span className="radio-custom" style={{ borderColor: '#a6a6a6' }}></span>
                PayPal Express (Coming Soon)
              </label>

              {/*Active Choice: Bank Wire Transfer*/}
              <label className={`payment-radio-label ${paymentMethod === 'bank-transfer' ? 'selected' : ''}`}>
                <input 
                  type="radio" 
                  name="payment_selection_group" 
                  value="bank-transfer" 
                  checked={paymentMethod === 'bank-transfer'}
                  onChange={() => setPaymentMethod('bank-transfer')} 
                />
                <span className="radio-custom"></span>
                Direct Bank Transfer (SEPA / Wire)
              </label>
            </div>

            {/*Explanatory Info Box for Bank Wire Options*/}
            <div style={{
              background: 'rgba(255,255,255,0.05)',
              borderLeft: '3px solid #e5a01d',
              padding: '0.85rem',
              fontSize: '0.9rem',
              borderRadius: '4px',
              marginBottom: '1.5rem',
              color: '#d9abe6',
              textAlign: 'left'
            }}>
              <strong>Direct Bank Transfer Wire:</strong><br />
              Your checkout configuration list and delivery details will be forwarded to our registry log upon your confirmation. After confirming the order, you will receive payment instructions on your e-mail address.
            </div>

            {/*Custom Interactive Form Submit Button*/}
            <Button type="submit" variant="btn-medium" className="checkout-finalize-btn" disabled={isProcessing}>
              {isProcessing ? 'Processing Order...' : 'Confirm Order'}
            </Button>
          </div>

        </form>
      )}
    </div>
  );
}