/*import React from 'react';
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

export default App;*/

import React from 'react';
import { createBrowserRouter, RouterProvider, Outlet } from 'react-router-dom';
import { CartProvider } from './context/cart_context.jsx'; //dodan jsx ker ni zaganjalo, je prav?

import './styles/main.scss';
import './styles/global.scss';
import './app.scss';

// Global Layout Components
import Navbar from "./components/Navbar.jsx"; // Loaded first
import Header from "./components/Header.jsx"; // Loaded second
import Footer from "./components/Footer.jsx";

// Store Pages
import Home from './pages/home.jsx';
import Products from './pages/products.jsx';
import Offer from './pages/offer.jsx';
import Contact from './pages/contact.jsx';
import Cart from './pages/cart.jsx';
import Success from './pages/success.jsx';

// 1. Clean Layout Core definition
const AppLayout = () => {
  return (
    <div className="app">
      <Navbar />
      <Header />
      <div className="content">
        <Outlet /> 
      </div>
      <Footer />
    </div>
  );
};

// 2. Clear Routing Map
const router = createBrowserRouter([
  {
    path: "/",
    element: <AppLayout />,
    children: [
      { index: true, element: <Home /> },
      { path: "products", element: <Products /> },
      { path: "offer", element: <Offer /> },
      { path: "contact", element: <Contact /> },
      { path: "cart", element: <Cart /> },
      { path: "success", element: <Success /> }
    ]
  }
]);

// 3. Parent Component Engine
export default function App() {
  return (
    <CartProvider>
      {/* Moving the provider to wrap the active router completely solves the context initialization bug! */}
      <RouterProvider router={router} />
    </CartProvider>
  );
}



