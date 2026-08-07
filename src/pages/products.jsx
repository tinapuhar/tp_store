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
import Button from '../components/Button';
import './products.scss';

// generate the 36 items across your specific subcategories
const generateInitialProducts = () => {
  const subcategories = [
    { name: 'Natural Shape', count: 9, prefix: 'natural' },
    { name: 'Oval Shape', count: 3, prefix: 'oval' },
    { name: 'Rondelle Shape', count: 3, prefix: 'rondelle' },
    { name: 'Round (Big) Shape', count: 9, prefix: 'round_big' },
    { name: 'Round (Small) Shape', count: 12, prefix: 'round_small' }
  ];

  let idCounter = 1;
  const productList = [];

  subcategories.forEach((sub) => {
    for (let i = 1; i <= sub.count; i++) {
      const imagePath = new URL(`../assets/images/products/${sub.prefix}_${i}.jpg`, import.meta.url).href;

      productList.push({
        id: idCounter++,
        title: `${sub.name} Piece #${i}`,
        subcategory: sub.name,
        image: imagePath, 
        description: `Exquisitely handcrafted jewelry, genuine natural beads.`
      });
    }
  });

  return productList;
};

const productsData = generateInitialProducts();

export default function Products() {
  const [activeFilter, setActiveFilter] = useState('All');
  const [selectedOptions, setSelectedOptions] = useState({});

  // Available options per item
  const productOptions = [
    { value: 'single-bracelet', label: 'Single Bracelet (18cm)' },
    { value: 'double-bracelet', label: 'Double Bracelet (38cm)' },
    { value: 'short-necklace', label: 'Short Necklace (70cm)' },
    { value: 'long-necklace', label: 'Long Necklace (100cm)' }
  ];

  // Handle dropdown configuration selection changes per item card
  const handleOptionChange = (productId, value) => {
    setSelectedOptions((prev) => ({
      ...prev,
      [productId]: value
    }));
  };

  // Mock addition function for cart phase
  const handleAddToCart = (product) => {
    const chosenOption = selectedOptions[product.id] || 'single-bracelet';
    const chosenLabel = productOptions.find(opt => opt.value === chosenOption)?.label;
    
    alert(`Added to temporary session:\n${product.title}\nOption: ${chosenLabel}`);
  };

  // Filter items matching current navigation tab state
  const filteredProducts = activeFilter === 'All' 
    ? productsData 
    : productsData.filter(p => p.subcategory === activeFilter);

  const filterTabs = ['All', 'Natural Shape', 'Oval Shape', 'Rondelle Shape', 'Round (Big) Shape', 'Round (Small) Shape'];

  return (
    <div className="page-container products-page">
      <h2 className="products-title">Our Jewellery Collection</h2>
      <h3 className="products-subtitle">Handmade with premium stone beads and organic coral.</h3>

      {/* Filter Tabs Navigation Menu Bar */}
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

      {/* 36-Product Flex/Grid Display Showcase */}
      <div className="products-grid">
        {filteredProducts.map((product) => (
          <div key={product.id} className="product-frame-card">
            <div className="image-wrapper">
              <img src={product.image} alt={product.title} loading="lazy" />
              <span className="subcategory-badge">{product.subcategory}</span>
            </div>

            <div className="product-info">
              <h3 className="product-item-title">{product.title}</h3>
              <p className="product-item-description">{product.description}</p>
              
              {/* Product Specifications Dropdown Mask */}
              <div className="options-selector-group">
                <label htmlFor={`select-${product.id}`}>Choose Style & Size:</label>
                <select 
                  id={`select-${product.id}`}
                  value={selectedOptions[product.id] || 'single-bracelet'}
                  onChange={(e) => handleOptionChange(product.id, e.target.value)}
                >
                  {productOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>

              {/* Your existing global Button component setup */}
              <Button 
                variant="btn-medium" 
                className="add-to-cart-btn"
                onClick={() => handleAddToCart(product)}
              >
                Add To Cart
              </Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

