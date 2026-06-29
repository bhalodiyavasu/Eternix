import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './Footer.css';

export default function Footer() {
  const [activeLang, setActiveLang] = useState('en');

  useEffect(() => {
    // Read from localStorage to know what language is currently set
    const savedLang = localStorage.getItem('lang') || 'en';
    setActiveLang(savedLang);
  }, []);

  const changeLanguage = (langCode) => {
    localStorage.setItem('lang', langCode);
    
    // Set the cookie for Google Translate
    document.cookie = `googtrans=/en/${langCode}; path=/;`;
    document.cookie = `googtrans=/en/${langCode}; path=/; domain=${window.location.hostname}`;
    
    // If on a domain, set wildcard cookie
    if (window.location.hostname !== 'localhost') {
      const parts = window.location.hostname.split('.');
      if (parts.length > 2) {
        const mainDomain = parts.slice(-2).join('.');
        document.cookie = `googtrans=/en/${langCode}; path=/; domain=.${mainDomain}`;
      }
    }
    
    // Reload page to apply changes
    window.location.reload();
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="footer">
      <div className="footer-top-border"></div>
      
      <div className="footer-container">
        <div className="footer-section info-section">
          <h4 className="footer-col-title">INFO</h4>
          <div className="footer-col-links vertical-links">
            <Link to="/pricing" className="footer-link">PRICING <span className="slash">/</span></Link>
            <Link to="/about" className="footer-link">ABOUT <span className="slash">/</span></Link>
            <Link to="/contacts" className="footer-link">CONTACTS <span className="slash">/</span></Link>
          </div>
        </div>

        <div className="footer-section languages-section notranslate" translate="no">
          <h4 className="footer-col-title">LANGUAGES</h4>
          <div className="footer-col-links row-links">
            <button 
              onClick={() => changeLanguage('en')} 
              className={`footer-link ${activeLang === 'en' ? 'active-lang' : ''}`}
            >
              ENG <span className="slash">/</span>
            </button>
            <button 
              onClick={() => changeLanguage('gu')} 
              className={`footer-link ${activeLang === 'gu' ? 'active-lang' : ''}`}
            >
              GUJ <span className="slash">/</span>
            </button>
            <button 
              onClick={() => changeLanguage('fr')} 
              className={`footer-link ${activeLang === 'fr' ? 'active-lang' : ''}`}
            >
              FR <span className="slash">/</span>
            </button>
            <button 
              onClick={() => changeLanguage('ja')} 
              className={`footer-link ${activeLang === 'ja' ? 'active-lang' : ''}`}
            >
              JA
            </button>
          </div>
        </div>

        {/* Back to Top */}
        <div className="footer-section back-to-top-section">
          <button onClick={scrollToTop} className="back-to-top-btn" aria-label="Back to top">
            <span className="back-to-top-text">BACK TO TOP</span>
            <span className="back-to-top-arrow">
              <svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M6 11V1M6 1L1 6M6 1L11 6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </span>
          </button>
        </div>
      </div>

      <div className="footer-watermark notranslate" translate="no">Eternix</div>
    </footer>
  );
}

