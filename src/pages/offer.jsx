/*import React from 'react';

const Offer = () => {
  return (
    <div className="page-container offer-page">
      <h2>Special Offers</h2>
      <p>Check out our exclusive discounts and seasonal promotions!</p>
    </div>
  );
};

export default Offer;*/

import React, { useState, useEffect } from 'react';
import Button from '../components/Button.jsx';
import './offer.scss';
import { useCart } from '../context/cart_context.jsx';
import offersData from '../data/offers.json';

// Core pricing configuration matrix
const EXCLUSIVE_COSTS = {
  'single-bracelet': 30,
  'double-bracelet': 40,
  'short-necklace': 60,
  'long-necklace': 70
};

export default function Offer() {
  const { addToCart, cart } = useCart();
  const [selectedOptions, setSelectedOptions] = useState({});

  // Live state tracking global array ledger from local server
  const [permanentlySoldItems, setPermanentlySoldItems] = useState([]);

  // Fetch true database inventories from backend routing on page load
  useEffect(() => {
    fetch('http://localhost:5000/api/sold-items', { cache: 'no-store' })
      .then(res => res.json())
      .then(data => setPermanentlySoldItems(data))
      .catch(err => console.error("Error pulling live store inventory locks:", err));
  }, []);

  // Dynamic image resolver helper to match JSON filenames to assets properly
  const getOfferImage = (imageName) => {
    if (imageName === 'special_offer_1.jpg') {
      return new URL('../assets/images/products/special_offer_1.jpg', import.meta.url).href;
    }
    if (imageName === 'special_offer_2.jpg') {
      return new URL('../assets/images/products/special_offer_2.jpg', import.meta.url).href;
    }
    return '';
  };

  const productOptions = [
    { value: 'single-bracelet', label: 'Single Bracelet (18cm)' },
    { value: 'double-bracelet', label: 'Double Bracelet (38cm)' },
    { value: 'short-necklace', label: 'Short Necklace (70cm)' },
    { value: 'long-necklace', label: 'Long Necklace (100cm)' }
  ];

  const handleOptionChange = (id, value) => {
    setSelectedOptions((prev) => ({ ...prev, [id]: value }));
  };

  const handleAddToCart = (offer) => {
    const chosenOptionKey = selectedOptions[offer.id] || 'single-bracelet';
    
    const productPayload = {
      ...offer,
      image: getOfferImage(offer.image), 
      subcategory: 'Offers'
    };

    addToCart(productPayload, chosenOptionKey);
    alert(`${offer.title} successfully added to your shopping basket!`);
  };
  
  return (
    <div className="page-container offers-page">
      <h1 className="offers-title">Exclusive Collections</h1>
      <p className="offers-subtitle">Handcrafted masterpieces available for a short time only.</p>

      <div className="offers-list-container">
        {offersData.map((offer) => {
          const currentVariantKey = selectedOptions[offer.id] || 'single-bracelet';
          const rawBasePrice = EXCLUSIVE_COSTS[currentVariantKey];
          const discountDisplayPrice = rawBasePrice * 0.9;
          const resolvedImageUrl = getOfferImage(offer.image);

          // 1. Check if the currently selected option is sitting in the transient cart
          const isCurrentOptionInCart = cart.some(
            item => item.id === offer.id && item.optionKey === currentVariantKey
          );

          // 2. Check if the currently selected option has been permanently sold on the server
          const isOptionSoldPermanently = permanentlySoldItems.some(
            item => item.id === offer.id.toString() && item.optionKey === currentVariantKey
          );

          // 3. Combine parameters to block the main button states immediately
          const isCurrentOptionUnavailable = isCurrentOptionInCart || isOptionSoldPermanently;

          // 4. Calculate total locked variant choices to completely fade out the product card frame
          const totalUnavailableOptionsCount = productOptions.filter(option => 
            cart.some(item => item.id === offer.id && item.optionKey === option.value) ||
            permanentlySoldItems.some(item => item.id === offer.id.toString() && item.optionKey === option.value)
          ).length;

          const isFullySoldOut = totalUnavailableOptionsCount === 4;

          return (
            <div key={offer.id} className="offer-flat-card" style={isFullySoldOut ? { opacity: 0.45 } : {}}>
              
              {/* Left Side: Photo with Special Deal Ribbon */}
              <div className="image-section">
                <img src={resolvedImageUrl} alt={offer.title} loading="lazy" />
                <div className="exclusive-ribbon">{isFullySoldOut ? 'Sold Out' : 'Special Deal'}</div>
                
                {isFullySoldOut && (
                  <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', backgroundColor: 'rgba(0,0,0,0.85)', color: '#ff4d00', padding: '0.4rem 0.8rem', borderRadius: '4px', fontSize: '1.1rem', fontWeight: 'bold', border: '1px solid #ff4d00', whiteSpace: 'nowrap', zIndex: 10 }}>
                    Currently Not Available 
                  </div>
                )}
              </div>

              {/* Right Side: Information Panel */}
              <div className="info-section">
                <h2 className="offer-item-title">{offer.title}</h2>
                <p className="offer-item-description">{offer.description}</p>
                
                <div className="actions-wrapper" style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem', width: '100%' }}>
                  
                  <div className="options-selector-group" style={{ width: '100%', display: 'flex', flexDirection: 'column' }}>
                    <label htmlFor={`select-${offer.id}`}>Select Arrangement:</label>
                    <select 
                      id={`select-${offer.id}`}
                      value={currentVariantKey}
                      onChange={(e) => handleOptionChange(offer.id, e.target.value)}
                      disabled={isFullySoldOut}
                      style={{ padding: '0.85rem', fontSize: '1.15rem', width: '100%' }}
                    >
                      {productOptions.map((option) => {
                        const isThisOptionInCart = cart.some(
                          item => item.id === offer.id && item.optionKey === option.value
                        );
                        const isThisOptionSold = permanentlySoldItems.some(
                          item => item.id === offer.id.toString() && item.optionKey === option.value
                        );
                        
                        return (
                          <option key={option.value} value={option.value} disabled={isThisOptionSold}>
                            {option.label} {isThisOptionInCart ? ' - (Temporary Hold)' : isThisOptionSold ? ' - (SOLD)' : ''}
                          </option>
                        );
                      })}
                    </select>
                  </div>

                  <div className="price-action-row" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%', gap: '1rem' }}>
                    
                    <div className="offer-price" style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', lineHeight: '1.2' }}>
                      <span className="old-price" style={{ textDecoration: 'line-through', fontSize: '1.1rem', opacity: 0.4 }}>
                        €{rawBasePrice.toFixed(2)}
                      </span>
                      <span className="new-price" style={{ color: '#ff4d00', fontSize: '1.75rem', fontWeight: 'bold' }}>
                        €{discountDisplayPrice.toFixed(2)}
                      </span>
                    </div>

                    <Button 
                      variant="btn-medium" 
                      className="add-to-cart-btn"
                      onClick={() => handleAddToCart(offer)}
                      disabled={isFullySoldOut || isCurrentOptionUnavailable}
                      style={(isFullySoldOut || isCurrentOptionUnavailable) ? { backgroundColor: '#a6a6a6', color: '#022c33', cursor: 'not-allowed', width: '180px', minHeight: '50px', fontSize: '1.75rem' } : { width: '180px', minHeight: '50px', fontSize: '1.75rem' }}
                    >
                      {isFullySoldOut ? 'Sold Out' : isOptionSoldPermanently ? 'Sold' : isCurrentOptionInCart ? 'Temporary Hold' : 'Add To Cart'}
                    </Button>

                  </div>

                </div>

              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
