/*import React, { createContext, useContext, useState, useEffect } from 'react';

const CartContext = createContext();

// Pricing matrix requested by user
const PRICE_MAP = {
  'single-bracelet': { price: 30, name: 'Single Bracelet (18cm)' },
  'double-bracelet': { price: 40, name: 'Double Bracelet (38cm)' },
  'short-necklace': { price: 60, name: 'Short Necklace (70cm)' },
  'long-necklace': { price: 70, name: 'Long Necklace (100cm)' }
};

export function CartProvider({ children }) {
  // Sync state with localStorage so items persist on browser refresh
  const [cart, setCart] = useState(() => {
    const saved = localStorage.getItem('tp_cart');
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    localStorage.setItem('tp_cart', JSON.stringify(cart));
  }, [cart]);

  // Global handler to insert items
  const addToCart = (product, selectedOptionKey) => {
    const optionInfo = PRICE_MAP[selectedOptionKey] || PRICE_MAP['single-bracelet'];
    
    // Special offer rule checking
    const isSpecialOffer = product.subcategory === undefined || product.id.toString().includes('offer');
    const basePrice = optionInfo.price;
    const finalPrice = isSpecialOffer ? basePrice * 0.9 : basePrice; // 10% Discount rule applied

    setCart((prevCart) => {
      // If the exact same item and configuration exists, increase quantity
      const existingIndex = prevCart.findIndex(
        (item) => item.id === product.id && item.optionKey === selectedOptionKey
      );

      if (existingIndex > -1) {
        const newCart = [...prevCart];
        newCart[existingIndex].quantity += 1;
        return newCart;
      }

      return [
        ...prevCart,
        {
          id: product.id,
          title: product.title,
          image: product.image,
          optionKey: selectedOptionKey,
          optionLabel: optionInfo.name,
          unitPrice: finalPrice,
          isDiscounted: isSpecialOffer,
          quantity: 1
        }
      ];
    });
  };

  // Individual deletion method requested by user
  const removeFromCart = (id, optionKey) => {
    setCart((prevCart) => prevCart.filter((item) => !(item.id === id && item.optionKey === optionKey)));
  };

  const clearCart = () => setCart([]);

  // Calculate totals dynamically
  const cartTotal = cart.reduce((acc, item) => acc + item.unitPrice * item.quantity, 0);

  return (
    <CartContext.Provider value={{ cart, addToCart, removeFromCart, clearCart, cartTotal }}>
      {children}
    </CartContext.Provider>
  );
}

export const useCart = () => useContext(CartContext);*/

/*import React, { createContext, useContext, useState, useEffect } from 'react';

const CartContext = createContext();

const PRICE_MAP = {
  'single-bracelet': { price: 30, name: 'Single Bracelet (18cm)' },
  'double-bracelet': { price: 40, name: 'Double Bracelet (38cm)' },
  'short-necklace': { price: 60, name: 'Short Necklace (70cm)' },
  'long-necklace': { price: 70, name: 'Long Necklace (100cm)' }
};

export function CartProvider({ children }) {
  // Sync state with localStorage so items stay safe during casual page reloads
  const [cart, setCart] = useState(() => {
    const saved = localStorage.getItem('tp_cart');
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    localStorage.setItem('tp_cart', JSON.stringify(cart));
  }, [cart]);

  // NEW FEAT: Automatically release items if the tab or website is closed
  useEffect(() => {
    const handleAbandonWebsite = () => {
      // Instantly clear the storage tracking footprint
      localStorage.removeItem('tp_cart');
    };

    // Listen to browser closure signals natively
    window.addEventListener('beforeunload', handleAbandonWebsite);

    // Standard React cleanup listener hook
    return () => {
      window.removeEventListener('beforeunload', handleAbandonWebsite);
    };
  }, []);

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
    <div className="cart-context-shell">
      <CartContext.Provider value={{ cart, addToCart, removeFromCart, clearCart, cartTotal }}>
        {children}
      </CartContext.Provider>
    </div>
  );
}

export const useCart = () => useContext(CartContext);

*/

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

// 🌟 THIS WAS MISSING: Export the custom useCart hook explicitly to fix the Navbar crash!
export const useCart = () => useContext(CartContext);

