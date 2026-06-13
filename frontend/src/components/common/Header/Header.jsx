import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import logoIcon from '@/assets/icons/logo.svg';
import hamburgerIcon from '@/assets/icons/hamburger.svg';
import searchIcon from '@/assets/icons/search.svg';
import cartIcon from '@/assets/icons/cart.svg';
import profileIcon from '@/assets/icons/profile.svg';
import './Header.css';

export default function Header() {
  const location = useLocation();
  const isHome = location.pathname === '/';
  const isCollections = location.pathname === '/collections';

  return (
    <header className="header">
      <div className="header-top">
        <div className="header-left">
          <nav className="nav-links">
            <Link to="/" className={`nav-link ${isHome ? 'active' : ''}`}>HOME</Link>
            <Link to="/collections" className={`nav-link ${isCollections ? 'active' : ''}`}>COLLECTIONS</Link>
            <Link to="/#new" className="nav-link">NEW</Link>
          </nav>
        </div>

        <div className="header-center">
          <Link to="/" className="logo-container" aria-label="Home">
            <img src={logoIcon} className="logo-img" alt="XIV Logo" />
          </Link>
        </div>

        <div className="header-right">
          <div className="cart-badge-group">
            <button className="circular-btn cart-btn" aria-label="Cart">
              <img src={cartIcon} alt="" className="dark-icon" />
            </button>
            <div className="cart-badge-pill">0</div>
          </div>
          
          <button className="circular-btn profile-btn" aria-label="Profile">
            <img src={profileIcon} alt="" className="inverted-icon" />
          </button>
        </div>
      </div>
    </header>
  );
}

