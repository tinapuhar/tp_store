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

import React, { useState } from 'react';
import Button from '../components/Button';
import './offer.scss';
import { useCart } from '../context/cart_context'

export default function Offer() {
  const [selectedOptions, setSelectedOptions] = useState({});

  // Dynamic asset paths utilizing your src/assets map (Method 2)
  const offerImages = {
    1: new URL('../assets/images/products/special_offer_1.jpg', import.meta.url).href,
    2: new URL('../assets/images/products/special_offer_2.jpg', import.meta.url).href
  };

  const offersData = [
    {
      id: 'offer-1',
      title: 'Sacred Earth',
      image: offerImages[1],
      description: 'An exclusive curation of black and brown-yellow stone beads. Limited time special offer.'
    },
    {
      id: 'offer-2',
      title: 'Spirit Collection',
      image: offerImages[2],
      description: 'A premium selection featuring vibrant cherry-red stone beads. Limited time special offer.'
    }
  ];

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
    const chosenOption = selectedOptions[offer.id] || 'single-bracelet';
    const extendedOfferObject = {
      id: offer.id,
      title: offer.title,
      image: offer.image,
      subcategory: "Offers"
    };
    addToCart(extendedOfferObject, chosenOption);
    const chosenLabel = productOptions.find(opt => opt.value === chosenOption)?.label;
    alert(`${offer.title} successfully added to your basket!`);

  };

  return (
    <div className="page-container offers-page">
      <h1 className="offers-title">Exclusive Collections</h1>
      <p className="offers-subtitle">Handcrafted masterpieces available for a short time only.</p>

      <div className="offers-list-container">
        {offersData.map((offer) => (
          <div key={offer.id} className="offer-flat-card">
            
            {/* Left Side: Photo with Special Deal Ribbon */}
            <div className="image-section">
              <img src={offer.image} alt={offer.title} loading="lazy" />
              <div className="exclusive-ribbon">Special Deal</div>
            </div>

            {/* Right Side: Information Panel */}
            <div className="info-section">
              <h2 className="offer-item-title">{offer.title}</h2>
              <p className="offer-item-description">{offer.description}</p>
              
              <div className="actions-wrapper">
                <div className="options-selector-group">
                  <label htmlFor={`select-${offer.id}`}>Select Arrangement:</label>
                  <select 
                    id={`select-${offer.id}`}
                    value={selectedOptions[offer.id] || 'single-bracelet'}
                    onChange={(e) => handleOptionChange(offer.id, e.target.value)}
                  >
                    {productOptions.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                </div>

                <Button 
                  variant="btn-medium" 
                  className="add-to-cart-btn"
                  onClick={() => handleAddToCart(offer)}
                >
                  Add To Cart
                </Button>
              </div>

            </div>
          </div>
        ))}
      </div>
    </div>
  );
}