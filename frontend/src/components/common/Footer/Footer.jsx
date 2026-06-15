import { Link } from 'react-router-dom';
import './Footer.css';

export default function Footer() {
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

        <div className="footer-section languages-section">
          <h4 className="footer-col-title">LANGUAGES</h4>
          <div className="footer-col-links row-links">
            <Link to="#eng" className="footer-link active-lang">ENG <span className="slash">/</span></Link>
            <Link to="#esp" className="footer-link">ESP <span className="slash">/</span></Link>
            <Link to="#sve" className="footer-link">SVE</Link>
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

      <div className="footer-watermark">Eternix</div>
    </footer>
  );
}

