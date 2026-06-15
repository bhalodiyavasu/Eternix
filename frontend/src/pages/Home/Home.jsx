import React, { useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import ProductQuickView from '@/components/common/ProductQuickView/ProductQuickView';
import { ALL_PRODUCTS } from '@/data/mockData';

// Image assets for Hero
import model1 from '@/assets/extracted/image1_2_63.jpg';
import model2 from '@/assets/extracted/image2_2_63.jpg';

// Image assets for Product Carousel
import item1 from '@/assets/extracted/image7_2_63.jpg';
import item2 from '@/assets/extracted/image6_2_63.jpg';
import item3 from '@/assets/extracted/image8_2_63.jpg';
import item4 from '@/assets/extracted/image9_2_63.jpg';
import arrowLeft from '@/assets/icons/arrow-left.svg';
import arrowRight from '@/assets/icons/arrow-right.svg';

// Image assets for Collections
import suitImg from '@/assets/extracted/image1_2_63.jpg';
import coatImg from '@/assets/extracted/image10_2_63.jpg';
import jacketImg from '@/assets/extracted/image11_2_63.jpg';

// Image assets for Aesthetic Grid
import photo1 from '@/assets/extracted/image4_2_63.jpg';
import photo2 from '@/assets/extracted/image3_2_63.jpg';
import photo3 from '@/assets/extracted/image1_2_63.jpg';
import photo4 from '@/assets/extracted/image5_2_63.png';

// CSS styling sheet import to preserve exact layout aesthetics
import './Home.css';

// Carousel Local Data
const CAROUSEL_PRODUCTS = [
  {
    id: 4,
    image: item1,
    name: 'EMBROIDERED SEERSUCKER SHIRT',
    price: '$ 99',
    category: 'NEW IN / SHIRTS'
  },
  {
    id: 5,
    image: item2,
    name: 'CASUAL OVERSIZED LINEN BLAZER',
    price: '$ 149',
    category: 'NEW IN / JACKETS'
  },
  {
    id: 6,
    image: item3,
    name: 'RELAXED COTTON DRAWSTRING TROUSERS',
    price: '$ 89',
    category: 'NEW IN / PANTS'
  },
  {
    id: 7,
    image: item4,
    name: 'CLASSIC LEATHER STRAP SANDALS',
    price: '$ 120',
    category: 'NEW IN / ACCESSORIES'
  },
  {
    id: 8,
    image: item1,
    name: 'TEXTURED CAMP COLLAR SHIRT',
    price: '$ 79',
    category: 'NEW IN / SHIRTS'
  },
  {
    id: 9,
    image: item2,
    name: 'RELAXED LINEN TROUSERS',
    price: '$ 110',
    category: 'NEW IN / PANTS'
  }
];

// Collections Local Data
const COLLECTIONS_PRODUCTS = [
  {
    id: 1,
    image: coatImg,
    name: 'LINEN TRENCH COAT',
    price: '$ 199',
    category: 'MEN / OUTERWEAR',
    gender: 'men'
  },
  {
    id: 2,
    image: suitImg,
    name: 'DOUBLE BREASTED WOOL SUIT',
    price: '$ 199',
    category: 'WOMEN / SUITS',
    gender: 'women'
  },
  {
    id: 3,
    image: jacketImg,
    name: 'STRUCTURED OVERSIZED JACKET',
    price: '$ 199',
    category: 'WOMEN / OUTERWEAR',
    gender: 'women'
  }
];

export default function Home() {
  const carouselRef = useRef(null);
  
  // Carousel State
  const [quickViewProductId, setQuickViewProductId] = useState(null);

  // Collections State
  const [activeFilter, setActiveFilter] = useState('all');

  // Carousel scroll actions
  const handleScrollLeft = () => {
    if (carouselRef.current) {
      carouselRef.current.scrollBy({ left: -330, behavior: 'smooth' });
    }
  };

  const handleScrollRight = () => {
    if (carouselRef.current) {
      carouselRef.current.scrollBy({ left: 330, behavior: 'smooth' });
    }
  };

  // Filter collections calculation
  const filteredCollectionsProducts = activeFilter === 'all' 
    ? COLLECTIONS_PRODUCTS 
    : COLLECTIONS_PRODUCTS.filter(p => p.gender === activeFilter);

  return (
    <>
      {/* 1. Hero Section */}
      <section className="hero-section">
        <div className="hero-content">
          <h2 className="hero-new-title">NEW COLLECTION</h2>
          
          <div className="hero-bottom-controls">
            <Link to="/collections" className="hero-btn">
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

      {/* 2. Product Carousel Section */}
      <section className="carousel-section" id="new">
        <div className="carousel-header">
          <h2 className="section-title">
            NEW THIS WEEK <span>(50)</span>
          </h2>
          <div className="carousel-nav">
            <button className="carousel-nav-btn btn-left" onClick={handleScrollLeft} aria-label="Scroll carousel left">
              <img src={arrowLeft} alt="" />
            </button>
            <button className="carousel-nav-btn btn-right" onClick={handleScrollRight} aria-label="Scroll carousel right">
              <img src={arrowRight} alt="" />
            </button>
          </div>
        </div>

        <div className="carousel-container" ref={carouselRef}>
          {CAROUSEL_PRODUCTS.map((prod) => (
            <div 
              className="product-card-link" 
              key={prod.id}
              onClick={() => setQuickViewProductId(prod.id)}
              style={{ cursor: 'pointer' }}
            >
              <div className="product-card">
                <div className="product-img-container">
                  <img src={prod.image} alt={prod.name} className="product-img" />
                </div>
                <div className="product-info">
                  <div className="product-meta">
                    <span className="product-category">{prod.category}</span>
                    <span className="product-price">{prod.price}</span>
                  </div>
                  <h3 className="product-name">{prod.name}</h3>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Quick View Modal */}
        {quickViewProductId && (
          <ProductQuickView 
            product={ALL_PRODUCTS.find(p => p.id === quickViewProductId) || CAROUSEL_PRODUCTS.find(p => p.id === quickViewProductId)} 
            onClose={() => setQuickViewProductId(null)} 
          />
        )}
      </section>

      {/* 3. Collections Section */}
      <section className="collections-section" id="collections">
        <div className="collections-header">
          <h2 className="section-title">NIX COLLECTIONS <span>23-24</span></h2>
        </div>

        <div className="collections-toolbar">
          <div className="filter-group">
            <button 
              className={`filter-btn ${activeFilter === 'all' ? 'active' : ''}`}
              onClick={() => setActiveFilter('all')}
            >
              (ALL)
            </button>
            <button 
              className={`filter-btn ${activeFilter === 'men' ? 'active' : ''}`}
              onClick={() => setActiveFilter('men')}
            >
              MEN
            </button>
            <button 
              className={`filter-btn ${activeFilter === 'women' ? 'active' : ''}`}
              onClick={() => setActiveFilter('women')}
            >
              WOMEN
            </button>
            <button 
              className={`filter-btn ${activeFilter === 'kid' ? 'active' : ''}`}
              onClick={() => setActiveFilter('kid')}
            >
              KID
            </button>
          </div>
        </div>

        <div className="collections-grid">
          {filteredCollectionsProducts.map((prod) => (
            <div className="grid-card" key={prod.id}>
              <div className="grid-img-container">
                <img src={prod.image} alt={prod.name} className="grid-img" />
              </div>
              <div className="grid-info">
                <span className="grid-category">{prod.category}</span>
                <h3 className="grid-name">{prod.name}</h3>
                <span className="grid-price">{prod.price}</span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 4. Approach Section */}
      <section className="approach-section">
        <div className="approach-container">
          <h2 className="section-title">OUR APPROACH TO FASHION DESIGN</h2>
          <div className="approach-content">
            <p className="approach-paragraph">
              We design quelity garments that are meant to be worn, loved, and passed on. Our focus is on exquilsite craftsmanship, materials, and attention to detail. We believe that fashion should be a form of self-expression, and our collections are designed to reflect that.
            </p>
            <p className="approach-paragraph">
              We want you to feel confident and stylish in our clothes, and we are committed to helping you achieve that. From the initial sketch to the final product, we are dedicated to creating beautiful, timeless pieces that you will cherish for years to come. We are proud of our work, and we hope you will join us on this journey of vogue, expression, and style.
            </p>
          </div>
        </div>
      </section>

      {/* 5. Aesthetic Grid Section */}
      <section className="aesthetic-section">
        <div className="aesthetic-grid">
          <div className="aesthetic-col col-1">
            <div className="aesthetic-img-wrapper">
              <img src={photo1} alt="Aesthetic style 1" className="aesthetic-img" />
            </div>
          </div>
          
          <div className="aesthetic-col col-2">
            <div className="aesthetic-img-wrapper">
              <img src={photo2} alt="Aesthetic style 2" className="aesthetic-img" />
            </div>
          </div>

          <div className="aesthetic-col col-3">
            <div className="aesthetic-img-wrapper">
              <img src={photo3} alt="Aesthetic style 3" className="aesthetic-img" />
            </div>
          </div>

          <div className="aesthetic-col col-4">
            <div className="aesthetic-img-wrapper">
              <img src={photo4} alt="Aesthetic style 4" className="aesthetic-img" />
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
