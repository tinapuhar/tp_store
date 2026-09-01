/*import React from 'react';

const Contact = () => {
  return (
    <div className="page-container contact-page">
      <h2>Contact Us</h2>
      <p>Have questions? Get in touch with our team.</p>
    </div>
  );
};

export default Contact;*/

import React, { useState } from 'react';
import './contact.scss';
import Button from '../components/Button.jsx';
import { useNavigate } from 'react-router-dom';

const Contact = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({ name: '', email: '', message: '' });
  const [isSending, setIsSending] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSending(true);

    // link to backend
    //const LOCAL_CONTACT_API_URL = "http://localhost:5000/api/contact";
    const API_BASE_URL = import.meta.env.VITE_API_BASE_URL  || 'http://localhost:5000';

        try {
        const response = await fetch(`${API_BASE_URL}/api/contact`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          formType: "Contact Inquiry Form",
          customerName: formData.name,
          customerEmail: formData.email,
          message: formData.message,
          targetInbox: "tinapuhar@gmail.com"
        })
      });

      if (response.ok) {
        alert('Thank you for your message! Our artisan studio team will reach out to you shortly.');
        setFormData({ name: '', email: '', message: '' }); 
        navigate('/success', { state: { type: 'contact' } }); 
      } else {
        throw new Error("Network dispatch failed.");
      }
    } catch (error) {
      alert('Oops! Something went wrong while transmitting your message. Please try again.');
    } finally {
      setIsSending(false);
    }
  };

  return (
    <div className="page-container contact-page">
      <h2 className="contact-title">Contact Us</h2>
      <p className="contact-subtitle">Have questions about our designs? Reach out to our artisan studio.</p>
      
      <form className="contact-form" onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="name">Full Name</label>
          <input 
            type="text" 
            id="name" 
            placeholder="First and last name" 
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            required 
          />
        </div>

        <div className="form-group">
          <label htmlFor="email">E-mail Address</label>
          <input 
            type="email" 
            id="email" 
            placeholder="your.email@example.com" 
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            required 
          />
        </div>

        <div className="form-group">
          <label htmlFor="message">Your Message</label>
          <textarea 
            id="message" 
            rows="6" 
            placeholder="Tell us about details or questions you have..." 
            value={formData.message}
            onChange={(e) => setFormData({ ...formData, message: e.target.value })}
            required
          ></textarea>
        </div>

        <Button type="submit" variant="btn-medium" className="submit-btn" disabled={isSending}>
          {isSending ? 'Sending...' : 'Send Message'}
        </Button>
      </form>
    </div>
  );
};

export default Contact;