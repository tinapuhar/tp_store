import React, { createContext, useContext, useState, useEffect } from 'react';

const CartContext = createContext();

const PRICE_MAP = {
  'single-bracelet': { price: 30, name: 'Single Bracelet (18cm)' },
  'double-bracelet': { price: 40, name: 'Double Bracelet (38cm)' },
  'short-necklace': { price: 60, name: 'Short Necklace (70cm)' },
  'long-necklace': { price: 70, name: 'Long Necklace (100cm)' }
};

export function CartProvider({ children }) {
  // Sync state with localStorage safely
  const [cart, setCart] = useState(() => {
    try {
      const saved = localStorage.getItem('tp_cart');
      return saved ? JSON.parse(saved) : [];
    } catch (e) {
      return [];
    }
  });

  useEffect(() => {
    localStorage.setItem('tp_cart', JSON.stringify(cart));
  }, [cart]);

  // Auto-clear cart if the browser tab or website is closed
  useEffect(() => {
    const handleAbandonWebsite = () => {
      localStorage.removeItem('tp_cart');
    };
    window.addEventListener('beforeunload', handleAbandonWebsite);
    return () => {
      window.removeEventListener('beforeunload', handleAbandonWebsite);
    };
  }, []);

  // 30-Minute Inactivity Auto-Clear Timer (1800000 ms)
  useEffect(() => {
    if (cart.length === 0) return; 

    let inactivityTimer;

    const resetInactivityTimer = () => {
      clearTimeout(inactivityTimer);
      inactivityTimer = setTimeout(() => {
        setCart([]);
        localStorage.removeItem('tp_cart');
        console.log("Cart cleared due to 30 minutes of user inactivity.");
      }, 1800000); 
    };

    // Track user movement events across the window
    const events = ['mousedown', 'mousemove', 'keypress', 'scroll', 'touchstart', 'click'];
    
    events.forEach(event => {
      window.addEventListener(event, resetInactivityTimer);
    });

    resetInactivityTimer();

    return () => {
      clearTimeout(inactivityTimer);
      events.forEach(event => {
        window.removeEventListener(event, resetInactivityTimer);
      });
    };
  }, [cart]);

  const addToCart = (product, selectedOptionKey) => {
    const optionInfo = PRICE_MAP[selectedOptionKey] || PRICE_MAP['single-bracelet'];
    const isSpecialOffer = product.subcategory === undefined || product.id.toString().includes('offer');
    const basePrice = optionInfo.price;
    const finalPrice = isSpecialOffer ? basePrice * 0.9 : basePrice;

    setCart((prevCart) => {
      const existingIndex = prevCart.findIndex(
        (item) => item.id === product.id && item.optionKey === selectedOptionKey
      );

      if (existingIndex > -1) {
        alert("This unique item size variation is already sitting inside your shopping basket!");
        return prevCart; 
      }

      return [
        ...prevCart,
        {
          id: product.id,
          title: product.title,
          image: product.image,
          subcategory: product.subcategory,
          optionKey: selectedOptionKey,
          optionLabel: optionInfo.name,
          unitPrice: finalPrice,
          isDiscounted: isSpecialOffer,
          quantity: 1
        }
      ];
    });
  };

  const removeFromCart = (id, optionKey) => {
    setCart((prevCart) => prevCart.filter((item) => !(item.id === id && item.optionKey === optionKey)));
  };

  const clearCart = () => setCart([]);

  const cartTotal = cart.reduce((acc, item) => acc + item.unitPrice * item.quantity, 0);

  return (
    <CartContext.Provider value={{ cart, addToCart, removeFromCart, clearCart, cartTotal }}>
      {children}
    </CartContext.Provider>
  );
}

// THIS WAS MISSING: Export the custom useCart hook explicitly to fix the Navbar crash!
export const useCart = () => useContext(CartContext);

