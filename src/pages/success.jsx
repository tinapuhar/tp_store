import React from 'react';
import { useLocation, Link } from 'react-router-dom';
import Button from '../components/Button.jsx';
import './success.scss';

export default function Success() {
  const location = useLocation();
  
  // Read the type of submission ('contact' or 'order') passed by the router state
  const type = location.state?.type || 'contact';

  const content = {
    contact: {
      title: "Message Sent!",
      message: "Success! Thank you for your message. Our artisan studio team will reach out to you shortly."
    },
    order: {
      title: "Order Placed!",
      message: "Success! Thank you for your order. Our artisan studio team will reach out to you shortly with information about your order."
    }
  };

  const activeContent = content[type] || content.contact;

  return (
    <div className="page-container success-page">
      <div className="success-card">
        {/* Elegant Gold Checkmark Icon */}
        <div className="success-icon">✓</div>
        
        <h1 className="success-heading">{activeContent.title}</h1>
        <p className="success-message">{activeContent.message}</p>
        
        <Link to="/">
          <Button variant="btn-medium" className="back-home-btn">
            Return to Store
          </Button>
        </Link>
      </div>
    </div>
  );
}
