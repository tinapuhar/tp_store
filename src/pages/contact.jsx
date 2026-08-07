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

import React from 'react';
import './contact.scss';
import Button from '../components/Button';

const Contact = () => {
  return (
    <div className="page-container contact-page">
      <h2>Contact Us</h2>
      
      <form className="contact-form" onSubmit={(e) => e.preventDefault()}>
        <div className="form-group">
          <label htmlFor="name">Full Name</label>
          <input type="text" id="name" placeholder="Your name" required />
        </div>

        <div className="form-group">
          <label htmlFor="email">E-mail Address</label>
          <input type="email" id="email" placeholder="Your e-mail address" required />
        </div>

        <div className="form-group">
          <label htmlFor="message">Your Message</label>
          <textarea id="message" rows="6" placeholder="Tell us about your dream jewellery piece..." required></textarea>
        </div>

        <Button type="submit" title="Send Message" />
      </form>
    </div>
  );
};

export default Contact;
