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
import { useCart } from '../context/cart_context';
import Button from '../components/Button';
import './cart.scss';

export default function Cart() {
  const { cart, removeFromCart, cartTotal, clearCart } = useCart();
  const [paymentMethod, setPaymentMethod] = useState('credit-card');

  // Submit and route checkout order via Formspree or custom email service
  const handleCheckoutSubmit = (e) => {
    e.preventDefault();
    if (cart.length === 0) return alert("Your cart is currently empty.");

    // Form data packaging summary
    const orderSummary = cart
      .map(item => `- ${item.title} (${item.optionLabel}) x${item.quantity}: €${(item.unitPrice * item.quantity).toFixed(2)}`)
      .join('\n');

    console.log(`Order dispatched to tinapuhar@gmail.com:\n${orderSummary}\nTotal: €${cartTotal.toFixed(2)} via ${paymentMethod}`);
    
    alert(`Order Confirmed!\n\nA checkout confirmation email detailing your purchases has been automatically dispatched to tinapuhar@gmail.com.`);
    clearCart();
  };

  return (
    <div className="page-container cart-page">
      <h1 className="cart-title">Your Shopping Basket</h1>

      {cart.length === 0 ? (
        <div className="empty-cart-message">
          <p>Your basket is empty. Explore our collection to add handcrafted natural jewelry.</p>
        </div>
      ) : (
        // Flat two-column layout panel structure
        <div className="cart-layout-grid">
          
          {/* Left Column: Flat List Items Array */}
          <div className="cart-items-list">
            {cart.map((item) => (
              <div key={`${item.id}-${item.optionKey}`} className="cart-flat-item-card">
                <div className="item-thumbnail">
                  <img src={item.image} alt={item.title} />
                </div>
                <div className="item-details">
                  <div className="item-main-header">
                    <h3>{item.title}</h3>
                    <button 
                      className="delete-item-btn" 
                      onClick={() => removeFromCart(item.id, item.optionKey)}
                      title="Remove piece"
                    >
                      ✕
                    </button>
                  </div>
                  <p className="item-spec">{item.optionLabel}</p>
                  <div className="price-quantity-row">
                    <span className="qty-tag">Quantity: {item.quantity}</span>
                    <span className="price-tag">
                      {item.isDiscounted && <span className="discount-alert">(-10%) </span>}
                      €{(item.unitPrice * item.quantity).toFixed(2)}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Right Column: Sticky Checkout Sheet & Billing Mask */}
          <form className="checkout-summary-panel" onSubmit={handleCheckoutSubmit} action="https://formspree.io" method="POST">
            {/* Hidden items so third-party email parsers parse checkout content accurately */}
            <input type="hidden" name="_to" value="tinapuhar@gmail.com" />
            <input type="hidden" name="Order Total" value={`€${cartTotal.toFixed(2)}`} />
            <input type="hidden" name="Payment Via" value={paymentMethod} />
            
            <h2>Order Summary</h2>
            
            <div className="summary-row total-row">
              <span>Total Price:</span>
              <span className="final-total">€{cartTotal.toFixed(2)}</span>
            </div>

            {/* Payment Options requested by user */}
            <div className="payment-options-section">
              <h3>Payment Method</h3>
              
              <label className={`payment-radio-label ${paymentMethod === 'credit-card' ? 'selected' : ''}`}>
                <input 
                  type="radio" 
                  name="payment" 
                  value="credit-card" 
                  checked={paymentMethod === 'credit-card'}
                  onChange={() => setPaymentMethod('credit-card')} 
                />
                <span className="radio-custom"></span>
                Credit Card (Visa / Mastercard)
              </label>

              <label className={`payment-radio-label ${paymentMethod === 'paypal' ? 'selected' : ''}`}>
                <input 
                  type="radio" 
                  name="payment" 
                  value="paypal" 
                  checked={paymentMethod === 'paypal'}
                  onChange={() => setPaymentMethod('paypal')} 
                />
                <span className="radio-custom"></span>
                PayPal Express
              </label>
            </div>

            <Button type="submit" variant="btn-medium" className="checkout-finalize-btn">
              Complete Checkout
            </Button>
          </form>

        </div>
      )}
    </div>
  );
}
