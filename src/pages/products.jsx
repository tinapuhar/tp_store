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

import React, { useState, useEffect } from 'react';
import Button from '../components/Button.jsx';
import './products.scss';
import { useCart } from '../context/cart_context.jsx'; 

// LINKED DIRECTLY TO YOUR COMMENT-FREE DATA ARRAY
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

  // 🌟 GLOBAL LIVE STATE: Holds sold item structures fetched directly from server file registry
  const [permanentlySoldItems, setPermanentlySoldItems] = useState([]);

  // 🌟 NETWORK HOOK: Fetch global inventory states from server on page load (Bypassing Caches)
  useEffect(() => {
    fetch('http://localhost:5000/api/sold-items', { cache: 'no-store' })
      .then(res => res.json())
      .then(data => setPermanentlySoldItems(data))
      .catch(err => console.error("Error pulling live store inventory locks:", err));
  }, []);

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
          
          // 1. Check if the currently selected dropdown option is sitting in the transient cart
          const isCurrentOptionInCart = cart.some(
            item => item.id === product.id && item.optionKey === currentVariantKey
          );

          // 2. Check if the currently selected dropdown option has been permanently sold on the server
          const isOptionSoldPermanently = permanentlySoldItems.some(
            item => item.id === product.id.toString() && item.optionKey === currentVariantKey
          );

          // 3. Combine parameters to block the main button states immediately
          const isCurrentOptionUnavailable = isCurrentOptionInCart || isOptionSoldPermanently;

          // 4. Calculate total locked variant choices to completely fade out the product card frame
          const totalUnavailableOptionsCount = productOptions.filter(option => 
            cart.some(item => item.id === product.id && item.optionKey === option.value) ||
            permanentlySoldItems.some(item => item.id === product.id.toString() && item.optionKey === option.value)
          ).length;

          const isFullySoldOut = totalUnavailableOptionsCount === 4;

          return (
            <div key={product.id} className="product-frame-card" style={isFullySoldOut ? { opacity: 0.45 } : {}}>
              <div className="image-wrapper" style={{ position: 'relative' }}>
                <img src={product.image} alt={product.title} loading="lazy" />
                <span className="subcategory-badge">{product.subcategory}</span>
                
                {isFullySoldOut && (
                  <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', backgroundColor: 'rgba(0,0,0,0.85)', color: '#ff4d00', padding: '0.5rem 1rem', fontSize: '1.2rem', fontWeight: 'bold', border: '1px solid #ff4d00', borderRadius: '4px', whiteSpace: 'nowrap', zIndex: 10 }}>
                    Currently Not Available 
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
                      const isThisOptionInCart = cart.some(
                        item => item.id === product.id && item.optionKey === option.value
                      );
                      
                      // 🌟 PRODUCTION FIX: Explicitly scan the persistent state loop to lock individual options inside the select element!
                      const isThisOptionSold = permanentlySoldItems.some(
                        item => item.id === product.id.toString() && item.optionKey === option.value
                      );
                      
                      return (
                        <option key={option.value} value={option.value} disabled={isThisOptionSold}>
                          {option.label} {isThisOptionInCart ? ' - (Temporary Hold)' : isThisOptionSold ? ' - (SOLD)' : ''}
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
                  disabled={isFullySoldOut || isCurrentOptionUnavailable}
                  style={(isFullySoldOut || isCurrentOptionUnavailable) ? { backgroundColor: '#a6a6a6', color: '#022c33', cursor: 'not-allowed' } : {}}
                >
                  {isFullySoldOut ? 'Sold Out' : isOptionSoldPermanently ? 'Sold' : isCurrentOptionInCart ? 'Temporary Hold' : 'Add To Cart'}
                </Button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
