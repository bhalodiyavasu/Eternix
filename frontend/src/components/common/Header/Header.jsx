import React from 'react';
import { Link } from 'react-router-dom';
import logoIcon from '@/assets/icons/logo.svg';
import hamburgerIcon from '@/assets/icons/hamburger.svg';
import searchIcon from '@/assets/icons/search.svg';
import cartIcon from '@/assets/icons/cart.svg';
import profileIcon from '@/assets/icons/profile.svg';
import './Header.css';

export default function Header() {
  return (
    <header className="header">
      <div className="header-top">
        <div className="header-left">
          <nav className="nav-links">
            <Link to="/" className="nav-link active">HOME</Link>
            <Link to="/#collections" className="nav-link">COLLECTIONS</Link>
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

      <div className="header-bottom">
        <div className="search-bar">
          <img src={searchIcon} className="search-icon" alt="" />
          <input 
            type="text" 
            defaultValue="" 
            className="search-input" 
            aria-label="Search"
          />
        </div>
      </div>
    </header>
  );
}

