import { NavLink } from 'react-router-dom';
import './Navbar.scss';
import tpLogo from '../assets/icons/tplogo.png';

function Navbar() {
  return (
    <nav className="navbar">
      {/* Use NavLink to direct back home */}
      <NavLink to="/" className="logo-link">
        <img src={tpLogo} alt="TP_STORE Logo" className="logo-img" />
      </NavLink>
      
      <ul className="nav-links">
        <li>
          <NavLink to="/" end>Home</NavLink>
        </li>
        <li>
          <NavLink to="/products">Products</NavLink>
        </li>
        <li>
          <NavLink to="/offer">Offers</NavLink>
        </li>
        <li>
          <NavLink to="/contact">Contact</NavLink>
        </li>
        <li>
          <NavLink to="/cart" className="cart-link">Cart</NavLink>
        </li>
      </ul>
    </nav>
  );
}

export default Navbar;
