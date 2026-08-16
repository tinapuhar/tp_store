/*import React from 'react';

const Products = () => {
  return (
    <div className="page-container products-page">
      <h2>Our Products</h2>
      <p>Browse through our items and find the best deals.</p>
      {Product grid rendering will go here}
    </div>
  );
};

export default Products;*/

import React, { useState } from 'react';
import Button from '../components/Button.jsx';
import './products.scss';
import { useCart } from '../context/cart_context.jsx'; // Pointing cleanly to your consolidated context engine

//  LINKED DIRECTLY TO YOUR COMMENT-FREE DATA ARRAY
import rawProductsData from '../data/products.json';

const ITEM_COSTS = {
  'single-bracelet': 30,
  'double-bracelet': 40,
  'short-necklace': 60,
  'long-necklace': 70
};

export default function Products() {
  const { addToCart, cart } = useCart();
  const [activeFilter, setActiveFilter] = useState('All');
  const [selectedOptions, setSelectedOptions] = useState({});

  const productOptions = [
    { value: 'single-bracelet', label: 'Single Bracelet (18cm)' },
    { value: 'double-bracelet', label: 'Double Bracelet (38cm)' },
    { value: 'short-necklace', label: 'Short Necklace (70cm)' },
    { value: 'long-necklace', label: 'Long Necklace (100cm)' }
  ];

  // Map product image paths cleanly matching your Vite asset configuration structures
  const productsWithImages = rawProductsData.map(product => {
    const imageUrl = new URL(`../assets/images/products/${product.imageName}`, import.meta.url).href;
    return { ...product, image: imageUrl };
  });

  const handleOptionChange = (productId, value) => {
    setSelectedOptions((prev) => ({ ...prev, [productId]: value }));
  };

  const handleAddToCart = (product) => {
    const chosenOptionKey = selectedOptions[product.id] || 'single-bracelet';
    addToCart(product, chosenOptionKey);
    alert(`${product.title} successfully added to your basket!`);
  };

  const filteredProducts = activeFilter === 'All' 
    ? productsWithImages 
    : productsWithImages.filter(p => p.subcategory === activeFilter);

  const filterTabs = ['All', 'Natural Shape', 'Oval Shape', 'Rondelle Shape', 'Round (Big) Shape', 'Round (Small) Shape'];

  return (
    <div className="page-container products-page">
      <h2 className="products-title">Our Jewellery Collection</h2>
      <p className="products-subtitle">Handmade with premium stone, wood, glass and coral beads.</p>

      <div className="filter-tabs-container">
        {filterTabs.map((tab) => (
          <button 
            key={tab} 
            className={`filter-tab ${activeFilter === tab ? 'active' : ''}`}
            onClick={() => setActiveFilter(tab)}
          >
            {tab}
          </button>
        ))}
      </div>

      <div className="products-grid">
        {filteredProducts.map((product) => {
          const currentVariantKey = selectedOptions[product.id] || 'single-bracelet';
          const activeDisplayPrice = ITEM_COSTS[currentVariantKey];
          
          const isCurrentOptionInCart = cart.some(
            item => item.id === product.id && item.optionKey === currentVariantKey
          );

          const optionsInCartCount = cart.filter(item => item.id === product.id).length;
          const isFullySoldOut = optionsInCartCount === 4;

          return (
            <div key={product.id} className="product-frame-card" style={isFullySoldOut ? { opacity: 0.45 } : {}}>
              <div className="image-wrapper" style={{ position: 'relative' }}>
                <img src={product.image} alt={product.title} loading="lazy" />
                <span className="subcategory-badge">{product.subcategory}</span>
                
                {/* 🌟 UPDATED: Appended (Temporary Hold) text status message on full product lock */}
                {isFullySoldOut && (
                  <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', backgroundColor: 'rgba(0,0,0,0.85)', color: '#ff4d00', padding: '0.5rem 1rem', fontSize: '1.2rem', fontWeight: 'bold', border: '1px solid #ff4d00', borderRadius: '4px', whiteSpace: 'nowrap', zIndex: 10 }}>
                    Currently Not Available (Temporary Hold)
                  </div>
                )}
              </div>

              <div className="product-info">
                <h3 className="product-item-title">{product.title}</h3>
                <p className="product-item-description">{product.description}</p>
                
                <div className="options-selector-group">
                  <label htmlFor={`select-${product.id}`}>Choose Style & Size:</label>
                  <select 
                    id={`select-${product.id}`}
                    value={currentVariantKey}
                    onChange={(e) => handleOptionChange(product.id, e.target.value)}
                    disabled={isFullySoldOut}
                  >
                    {productOptions.map((option) => {
                      const isThisOptionTaken = cart.some(
                        item => item.id === product.id && item.optionKey === option.value
                      );
                      
                      return (
                        <option key={option.value} value={option.value}>
                          {/* 🌟 UPDATED: Custom status wording inside your option configurations selection menu fields */}
                          {option.label} {isThisOptionTaken ? ' - (Temporary Hold)' : ''}
                        </option>
                      );
                    })}
                  </select>
                </div>

                <div className="product-price">Price: €{activeDisplayPrice.toFixed(2)}</div>

                <Button 
                  variant="btn-medium" 
                  className="add-to-cart-btn"
                  onClick={() => handleAddToCart(product)}
                  disabled={isFullySoldOut || isCurrentOptionInCart}
                  style={(isFullySoldOut || isCurrentOptionInCart) ? { backgroundColor: '#a6a6a6', color: '#022c33', cursor: 'not-allowed' } : {}}
                >
                  {/* 🌟 UPDATED: Interactive Action Call Button Status Description */}
                  {isFullySoldOut ? 'Sold Out' : isCurrentOptionInCart ? 'Temporary Hold' : 'Add To Cart'}
                </Button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

