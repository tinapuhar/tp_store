import React, { useState } from 'react';
import styles from './navbar.scss';

export default function Navbar({ setPage }) {
  const [isOpen, setIsOpen] = useState(false);

  const navigateTo = (page) => {
    setPage(page);
    setIsOpen(false); // shuts menu on choice
  };

  return (
    <nav className={styles.navbar}>
      <div className={styles.navHeader}>
        <div className={styles.logo} onClick={() => navigateTo('home')}>TP_STORE</div>
        <button className={styles.hamburger} onClick={() => setIsOpen(!isOpen)} aria-label="Toggle Navigation">
          <span className={`${styles.bar} ${isOpen ? styles.open1 : ''}`}></span>
          <span className={`${styles.bar} ${isOpen ? styles.open2 : ''}`}></span>
          <span className={`${styles.bar} ${isOpen ? styles.open3 : ''}`}></span>
        </button>
      </div>

      <div className={`${styles.links} ${isOpen ? styles.showMenu : ''}`}>
        <span onClick={() => navigateTo('home')}>Home</span>
        <span onClick={() => navigateTo('products')}>Products</span>
        <span onClick={() => navigateTo('offer')}>Offers</span>
        <span onClick={() => navigateTo('contact')}>Contact</span>
        <span onClick={() => navigateTo('cart')} className={styles.cartLink}>Cart</span>
      </div>
    </nav>
  );
}