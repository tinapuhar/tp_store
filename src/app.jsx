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

function Layout() {
  return (
    <div className="app">
      <Navbar />
      <Header />
      <main className="content">
        {/* The Outlet is where the active page component will load */}
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          {/* Child routes matching your exact page files */}
          <Route index element={<Home />} />
          <Route path="products" element={<Products />} />
          <Route path="offer" element={<Offer />} />
          <Route path="contact" element={<Contact />} />
          <Route path="cart" element={<Cart />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
