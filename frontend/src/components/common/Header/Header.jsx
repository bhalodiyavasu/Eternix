import React, { useState, useSyncExternalStore } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useGetCartQuery } from '@/store/actions/cartActions';
import { useGetProfileQuery } from '@/store/actions/userActions';
import { subscribe, getCount } from '@/utils/guestCart';
import logoIcon from '@/assets/icons/logo.svg';
import cartIcon from '@/assets/icons/cart.svg';
import profileIcon from '@/assets/icons/profile.svg';
import Drawer from '@/components/common/Drawer/Drawer';
import './Header.css';

export default function Header() {
  const location = useLocation();
  const navigate = useNavigate();
  const isHome = location.pathname === '/';
  const isCollections = location.pathname === '/collections';
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const isLoggedIn = !!localStorage.getItem('userToken');
  const { data: profileData } = useGetProfileQuery(undefined, { skip: !isLoggedIn });
  const userAvatar = profileData?.user?.avatar || null;
  const { data } = useGetCartQuery(undefined, { skip: !isLoggedIn });
  const guestCount = useSyncExternalStore(subscribe, getCount);
  const cartCount = isLoggedIn ? (data?.items?.length || 0) : guestCount;

  const handleProfileClick = () => {
    if (localStorage.getItem('userToken')) {
      navigate('/profile');
    } else {
      navigate('/auth');
    }
  };

  return (
    <header className="header">
      <div className="header-top">
        <div className="header-left">
          <button
            className="hamburger-btn"
            onClick={() => setIsMenuOpen(true)}
            aria-label="Open Menu"
          >
            <svg width="26" height="16" viewBox="0 0 26 16" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M26 1L0 1" stroke="black" strokeWidth="1.5" strokeLinecap="round"/>
              <path d="M18 8H0" stroke="black" strokeWidth="1.5" strokeLinecap="round"/>
              <path d="M13 15H0" stroke="black" strokeWidth="1.5" strokeLinecap="round"/>
            </svg>
          </button>

          <nav className="nav-links">
            <Link to="/" className={`nav-link ${isHome ? 'active' : ''}`}>HOME</Link>
            <Link to="/collections" className={`nav-link ${isCollections ? 'active' : ''}`}>COLLECTIONS</Link>
            <Link to="/#new" className="nav-link">NEW</Link>
          </nav>
        </div>

        <div className="header-center">
          <Link to="/" className="logo-container" aria-label="Home">
            <img src={logoIcon} className="logo-img notranslate" translate="no" alt="Eternix Logo" />
          </Link>
        </div>

        <div className="header-right">
          <Link to="/cart" className="cart-badge-group">
            <div className="circular-btn cart-btn" aria-label="Cart">
              <img src={cartIcon} alt="" className="dark-icon" />
            </div>
            <div className="cart-badge-pill">{cartCount}</div>
          </Link>

          {isLoggedIn ? (
            <button
              className="circular-btn profile-btn"
              aria-label="Profile"
              onClick={handleProfileClick}
            >
              {userAvatar ? (
                <img src={userAvatar} alt="Profile" className="header-avatar-img" referrerPolicy="no-referrer" />
              ) : (
                <img src={profileIcon} alt="" className="inverted-icon" />
              )}
            </button>
          ) : (
            <button className="header-login-btn" onClick={handleProfileClick}>
              LOG IN
            </button>
          )}
        </div>
      </div>

      <Drawer
        isOpen={isMenuOpen}
        onClose={() => setIsMenuOpen(false)}
        title="MENU"
        position="left"
      >
        <nav className="drawer-links">
          <Link to="/" className={`drawer-link ${isHome ? 'active' : ''}`} onClick={() => setIsMenuOpen(false)}>HOME</Link>
          <Link to="/collections" className={`drawer-link ${isCollections ? 'active' : ''}`} onClick={() => setIsMenuOpen(false)}>COLLECTIONS</Link>
          <Link to="/#new" className="drawer-link" onClick={() => setIsMenuOpen(false)}>NEW</Link>
        </nav>
      </Drawer>
    </header>
  );
}
