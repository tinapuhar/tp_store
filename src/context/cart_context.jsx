import React, { createContext, useContext, useState, useEffect } from 'react';

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

export const useCart = () => useContext(CartContext);