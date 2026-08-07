import React from 'react';
import { RouterProvider, createBrowserRouter } from 'react-router-dom';
import { CartProvider } from './context/cart_context';

import './styles/main.scss';
import './styles/global.scss';
import './styles/_variables.scss';
import './styles/_mixins.scss';
import './app.scss';
import { BrowserRouter, Routes, Route, Outlet } from 'react-router-dom';

//components
import Header from "./components/Header.jsx";
import Footer from "./components/Footer.jsx";
import Button from "./components/Button.jsx";
import Navbar from "./components/Navbar.jsx";

//pages
import Home from './pages/home.jsx';
import Cart from './pages/cart.jsx';
import Contact from './pages/contact.jsx';
import Offer from './pages/offer.jsx';
import Products from './pages/products.jsx';

// The layout structure that keeps your header, navbar, and footer on every page
function Layout() {
  return (
    <div className="app">
      <Navbar />
      <Header />
      <main className="content">
        <Outlet /> 
      </main>
      <Footer />
    </div>
  );
}

// Your main app component wrapped in the global CartProvider
function App() {
  return (
    <CartProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<Home />} />
            <Route path="products" element={<Products />} />
            <Route path="offer" element={<Offer />} />
            <Route path="contact" element={<Contact />} />
            <Route path="cart" element={<Cart />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </CartProvider>
  );
}

export default App;