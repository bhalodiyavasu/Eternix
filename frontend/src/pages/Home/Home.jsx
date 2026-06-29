import React, { useState, useRef, useEffect, useMemo } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import Button from '@/components/common/Button/Button';
import ProductQuickView from '@/components/common/ProductQuickView/ProductQuickView';
import { useGetProductsQuery } from '@/store/actions/productActions';
import arrowLeft from '@/assets/icons/arrow-left.svg';
import arrowRight from '@/assets/icons/arrow-right.svg';
import photo1 from '@/assets/images/image4_2_63.jpg';
import photo2 from '@/assets/images/image3_2_63.jpg';
import photo3 from '@/assets/images/image1_2_63.jpg';
import photo4 from '@/assets/images/image5_2_63.png';
import './Home.css';

export default function Home() {
  const carouselRef  = useRef(null);
  const colSliderRef = useRef(null);

  const { data: apiData } = useGetProductsQuery();

  const newThisWeekProducts = useMemo(() => {
    if (!apiData?.products) return [];
    return apiData.products.filter(p => {
      const s = p.status?.toLowerCase();
      return s === 'new in' || s === 'new';
    });
  }, [apiData]);

  const [quickViewProductId, setQuickViewProductId] = useState(null);
  const [activeFilter, setActiveFilter]             = useState('men');
  const [canScrollLeft,  setCanScrollLeft]  = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);
  const [hasOverflow,    setHasOverflow]    = useState(false);
  const [colCanScrollLeft,  setColCanScrollLeft]  = useState(false);
  const [colCanScrollRight, setColCanScrollRight] = useState(false);

  const collectionsByGender = useMemo(() => {
    if (!apiData?.products) return [];
    return apiData.products
      .filter(p => {
        const g = p.gender?.toLowerCase();
        if (activeFilter === 'men')   return g === 'men'   || g === 'man';
        if (activeFilter === 'women') return g === 'women' || g === 'woman';
        if (activeFilter === 'kid')   return g === 'kid'   || g === 'kids';
        return false;
      })
      .sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0))
      .slice(0, 8);
  }, [apiData, activeFilter]);

  const totalProductCount = apiData?.products?.length ?? 0;

  const updateScrollState = () => {
    const el = carouselRef.current;
    if (!el) return;
    const overflow = el.scrollWidth > el.clientWidth + 1;
    setHasOverflow(overflow);
    setCanScrollLeft(el.scrollLeft > 0);
    setCanScrollRight(el.scrollLeft + el.clientWidth < el.scrollWidth - 1);
  };

  const updateColScrollState = () => {
    const el = colSliderRef.current;
    if (!el) return;
    setColCanScrollLeft(el.scrollLeft > 0);
    setColCanScrollRight(el.scrollLeft + el.clientWidth < el.scrollWidth - 1);
  };

  useEffect(() => {
    updateScrollState();
    window.addEventListener('resize', updateScrollState);
    return () => window.removeEventListener('resize', updateScrollState);
  }, [newThisWeekProducts]);

  useEffect(() => {
    const el = colSliderRef.current;
    if (!el) return;
    el.scrollLeft = 0;
    setColCanScrollLeft(false);
    setColCanScrollRight(el.scrollWidth > el.clientWidth + 1);
    window.addEventListener('resize', updateColScrollState);
    return () => window.removeEventListener('resize', updateColScrollState);
  }, [collectionsByGender]);

  const handleScrollLeft     = () => carouselRef.current?.scrollBy({ left: -330, behavior: 'smooth' });
  const handleScrollRight    = () => carouselRef.current?.scrollBy({ left:  330, behavior: 'smooth' });
  const handleColScrollLeft  = () => colSliderRef.current?.scrollBy({ left: -330, behavior: 'smooth' });
  const handleColScrollRight = () => colSliderRef.current?.scrollBy({ left:  330, behavior: 'smooth' });

  const navigate = useNavigate();
  const location = useLocation();
  const justLoggedIn = location.state?.justLoggedIn;

  return (
    <div className={justLoggedIn ? 'home-slide-in-up' : ''}>
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
        
        <div className="hero-right-panel">
          <div className="creative-showcase-grid">
            {/* Block 1: 3D-like wireframe hanger/garment */}
            <div className="showcase-card hanger-card">
              <div className="hanger-3d-wrapper">
                <svg viewBox="0 0 100 100" className="hanger-wireframe">
                  <path d="M50,25 C52,25 55,27 55,30 C55,33 50,35 50,38 L50,42 L20,60 C18,61 18,63 20,64 L80,64 C82,63 82,61 80,60 L50,42 Z" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
                  <line x1="20" y1="64" x2="80" y2="64" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
                </svg>
              </div>
            </div>

            {/* Block 2: Eternix Brand Values */}
            <div className="showcase-card brand-card">
              <div className="brand-header notranslate" translate="no">ETERNIX LABELS</div>
              <div className="brand-list">
                <span className="brand-tag">Minimal</span>
                <span className="brand-tag">Boxy</span>
                <Link to="/collections?gender=men" className="brand-tag interactive-tag">Men</Link>
                <Link to="/collections?gender=kids" className="brand-tag interactive-tag">Kids</Link>
              </div>
            </div>

            {/* Block 3: Abstract textile weave pattern */}
            <div className="showcase-card wave-card">
              <div className="weave-pattern"></div>
            </div>

            {/* Block 4: Down caret arrow */}
            <div className="showcase-card arrow-card">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="showcase-arrow-icon">
                <path d="M6 9L12 15L18 9" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>

            {/* Block 5: Streetwear Barcode Visual */}
            <div className="showcase-card barcode-card">
              <div className="barcode-container">
                <div className="barcode-bars">
                  <span className="bar thin"></span>
                  <span className="bar thick"></span>
                  <span className="bar medium"></span>
                  <span className="bar thin"></span>
                  <span className="bar space"></span>
                  <span className="bar thick"></span>
                  <span className="bar thin"></span>
                  <span className="bar medium"></span>
                  <span className="bar thick"></span>
                  <span className="bar thin"></span>
                  <span className="bar thin"></span>
                  <span className="bar thick"></span>
                  <span className="bar thin"></span>
                </div>
                <div className="barcode-label">ETX-071E6B</div>
              </div>
              <div className="barcode-laser"></div>
            </div>

            {/* Block 6: Pink/orange sunset gradient card */}
            <div className="showcase-card gradient-card pink-orange-grad">
              <span className="grad-label">SUNSET DUSK</span>
            </div>

            {/* Block 7: Blueprint-style garment specs */}
            <div className="showcase-card pattern-card spec-blueprint">
              <div className="spec-item">FIT // BOXY</div>
              <div className="spec-item">WT // 280 GSM</div>
              <div className="spec-item">CUT // RELAXED</div>
            </div>

            {/* Block 8: Rotating fashion asterisk logo */}
            <div className="showcase-card torus-card">
              <svg viewBox="0 0 100 100" className="fashion-asterisk">
                <line x1="50" y1="15" x2="50" y2="85" stroke="currentColor" strokeWidth="6" />
                <line x1="15" y1="50" x2="85" y2="50" stroke="currentColor" strokeWidth="6" />
                <line x1="25" y1="25" x2="75" y2="75" stroke="currentColor" strokeWidth="6" />
                <line x1="75" y1="25" x2="25" y2="75" stroke="currentColor" strokeWidth="6" />
              </svg>
            </div>

            {/* Block 9: Bottom right gradient card */}
            <div className="showcase-card gradient-card purple-grad">
              <span className="grad-label">NIX EDITION</span>
            </div>
          </div>

          <div className="agency-description-footer">
            <p className="agency-desc-text">
              <strong className="notranslate" translate="no">Eternix</strong> is the most active design-driven fashion label around the world. We have been working with premium mills and craftspeople for about a year. So, Let's begin the journey.
            </p>
          </div>
        </div>
      </section>

      <section className="carousel-section" id="new">
        <div className="carousel-header">
          <h2 className="section-title">
            NEW THIS WEEK <span>({newThisWeekProducts.length})</span>
          </h2>
          {hasOverflow && (
            <div className="carousel-nav">
              <button className="carousel-nav-btn btn-left" onClick={handleScrollLeft} aria-label="Scroll carousel left" disabled={!canScrollLeft}>
                <img src={arrowLeft} alt="" />
              </button>
              <button className="carousel-nav-btn btn-right" onClick={handleScrollRight} aria-label="Scroll carousel right" disabled={!canScrollRight}>
                <img src={arrowRight} alt="" />
              </button>
            </div>
          )}
        </div>

        {newThisWeekProducts.length === 0 ? (
          <div className="carousel-empty">
            <span className="carousel-empty-text">NO NEW PRODUCTS THIS WEEK</span>
          </div>
        ) : (
          <div className="carousel-container" ref={carouselRef} onScroll={updateScrollState}>
            {newThisWeekProducts.map((prod) => (
              <div className="product-card-link" key={prod._id} onClick={() => setQuickViewProductId(prod._id)}>
                <div className="product-card">
                  <div className="product-img-container">
                    <img src={prod.image} alt={prod.name} className="product-img" />
                  </div>
                  <div className="product-info">
                    <div className="product-meta">
                      <span className="product-category">{prod.gender?.toUpperCase()} / {prod.category?.toUpperCase()}</span>
                      <span className="product-price">₹{prod.price.toFixed(2)}</span>
                    </div>
                    <h3 className="product-name">{prod.name}</h3>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

      </section>

      <section className="collections-section" id="collections">
        <div className="carousel-header">
          <div>
            <h2 className="section-title">NIX COLLECTIONS <span>23-24</span></h2>
          </div>
          <div className="col-slider-controls">
            <div className="filter-group">
              <button className={`filter-btn ${activeFilter === 'men' ? 'active' : ''}`} onClick={() => setActiveFilter('men')}>MEN</button>
              <button className={`filter-btn ${activeFilter === 'kid' ? 'active' : ''}`} onClick={() => setActiveFilter('kid')}>KID</button>
            </div>
            <div className="carousel-nav">
              <button className="carousel-nav-btn" onClick={handleColScrollLeft} disabled={!colCanScrollLeft} aria-label="Scroll left">
                <img src={arrowLeft} alt="" />
              </button>
              <button className="carousel-nav-btn" onClick={handleColScrollRight} disabled={!colCanScrollRight} aria-label="Scroll right">
                <img src={arrowRight} alt="" />
              </button>
            </div>
          </div>
        </div>

        {collectionsByGender.length === 0 ? (
          <div className="col-slider-empty">
            <span>NO PRODUCTS FOUND</span>
          </div>
        ) : (
          <div className="col-slider-container" ref={colSliderRef} onScroll={updateColScrollState}>
            {collectionsByGender.map((prod) => (
              <div className="product-card-link" key={prod._id || prod.id} onClick={() => setQuickViewProductId(prod._id || prod.id)}>
                <div className="product-card">
                  <div className="product-img-container">
                    <img src={prod.image} alt={prod.name} className="product-img" />
                  </div>
                  <div className="product-info">
                    <div className="product-meta">
                      <span className="product-category">{prod.gender?.toUpperCase()} / {prod.category?.toUpperCase()}</span>
                      <span className="product-price">₹{prod.price.toFixed(2)}</span>
                    </div>
                    <h3 className="product-name">{prod.name}</h3>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      <section className="ticker-section">
        <div className="ticker-track">
          <div className="ticker-content">
            <span>PREMIUM QUALITY</span><span className="ticker-dot">·</span>
            <span>TIMELESS DESIGN</span><span className="ticker-dot">·</span>
            <span>SINCE 2023</span><span className="ticker-dot">·</span>
            <span>NIX FASHION</span><span className="ticker-dot">·</span>
            <span>CRAFTED WITH CARE</span><span className="ticker-dot">·</span>
            <span>WEAR YOUR STORY</span><span className="ticker-dot">·</span>
            <span>MADE TO LAST</span><span className="ticker-dot">·</span>
            <span>DEFINE YOUR STYLE</span><span className="ticker-dot">·</span>
            <span>PREMIUM QUALITY</span><span className="ticker-dot">·</span>
            <span>TIMELESS DESIGN</span><span className="ticker-dot">·</span>
            <span>SINCE 2023</span><span className="ticker-dot">·</span>
            <span>NIX FASHION</span><span className="ticker-dot">·</span>
            <span>CRAFTED WITH CARE</span><span className="ticker-dot">·</span>
            <span>WEAR YOUR STORY</span><span className="ticker-dot">·</span>
            <span>MADE TO LAST</span><span className="ticker-dot">·</span>
            <span>DEFINE YOUR STYLE</span><span className="ticker-dot">·</span>
          </div>
        </div>
      </section>

      <section className="universe-section">
        <div className="universe-inner">
          <div className="universe-left">
            <span className="universe-tag">EST. 2023</span>
            <h2 className="universe-title">THE NIX<br />UNIVERSE</h2>
            <p className="universe-sub">Where fashion meets identity. Every stitch tells a story worth wearing.</p>
            <Button variant="unstyled" onClick={() => navigate('/collections')} style={{ color: '#fff' }}>EXPLORE ALL</Button>
          </div>
          <div className="universe-right">
            <div className="universe-stat">
              <span className="stat-num">500+</span>
              <span className="stat-label">STYLES</span>
            </div>
            <div className="universe-divider" />
            <div className="universe-stat">
              <span className="stat-num">{totalProductCount}</span>
              <span className="stat-label">PRODUCTS</span>
            </div>
            <div className="universe-divider" />
            <div className="universe-stat">
              <span className="stat-num">10K+</span>
              <span className="stat-label">CUSTOMERS</span>
            </div>
          </div>
        </div>
      </section>

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

      {quickViewProductId && (
        <ProductQuickView productId={quickViewProductId} onClose={() => setQuickViewProductId(null)} />
      )}
    </div>
  );
}
