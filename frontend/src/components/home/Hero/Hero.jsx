import React from 'react';
import { Link } from 'react-router-dom';
import model1 from '@/assets/extracted/image1_2_63.jpg';
import model2 from '@/assets/extracted/image2_2_63.jpg';
import './Hero.css';

export default function Hero() {
  return (
    <section className="hero-section">
      <div className="hero-content">
        <h2 className="hero-new-title">NEW COLLECTION</h2>
        
        <div className="hero-bottom-controls">
          <Link to="/#collections" className="hero-btn">
            <span>SHOP NOW</span>
            <svg width="48" height="12" viewBox="0 0 48 12" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M0 6H47.5M41.5 12L47.5 6L41.5 0" stroke="black" strokeWidth="1.5" />
            </svg>
          </Link>
        </div>
      </div>

      <div className="hero-images">
        <div className="hero-img-wrapper img-left">
          <img src={model1} alt="Summer Collection Model Left" className="hero-img" />
        </div>
        <div className="hero-img-wrapper img-right">
          <img src={model2} alt="Summer Collection Model Right" className="hero-img" />
        </div>
      </div>
    </section>
  );
}

