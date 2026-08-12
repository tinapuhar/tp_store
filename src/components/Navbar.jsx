import React from 'react';
import { NavLink } from 'react-router-dom';
import { useCart } from '../context/cart_context.jsx'; 
import './Navbar.scss';
import tpLogo from '../assets/icons/tplogo.png';

function Navbar() {
  const { cart } = useCart();

  // Computes total quantity of accessories inside the basket array
  const totalItemCount = cart ? cart.reduce((total, item) => total + item.quantity, 0) : 0;

  return (
    <nav className="navbar">
      {/* Brand Identity / Interactive Logo */}
      <NavLink to="/" className="logo-link">
        <img src={tpLogo} alt="TP_STORE Logo" className="logo-img" />
      </NavLink>
      
      {/* Core Application Navigation Links */}
      <ul className="nav-links">
        <li>
          <NavLink to="/" end className={({ isActive }) => isActive ? 'active' : ''}>
            Home
          </NavLink>
        </li>
        <li>
          <NavLink to="/products" className={({ isActive }) => isActive ? 'active' : ''}>
            Products
          </NavLink>
        </li>
        <li>
          <NavLink to="/offer" className={({ isActive }) => isActive ? 'active' : ''}>
            Offers
          </NavLink>
        </li>
        <li>
          <NavLink to="/contact" className={({ isActive }) => isActive ? 'active' : ''}>
            Contact
          </NavLink>
        </li>
        <li>
          <NavLink to="/cart" className={({ isActive }) => `cart-link ${isActive ? 'active' : ''}`}>
            {/* 🌟 FIXED: Placed the active count cleanly inside brackets directly next to the string text */}
            Cart {totalItemCount > 0 && `(${totalItemCount})`}
          </NavLink>
        </li>
      </ul>
    </nav>
  );
}

export default Navbar;

