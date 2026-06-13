import React from 'react';
import { Link } from 'react-router-dom';
import './Footer.css';

export default function Footer() {
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
      </div>

      <div className="footer-watermark">Ecommerce</div>
    </footer>
  );
}

