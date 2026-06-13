import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import searchIcon from '@/assets/icons/search.svg';
import './CollectionsPage.css';

// Product images
import suitImg from '@/assets/extracted/image1_2_63.jpg';
import coatImg from '@/assets/extracted/image10_2_63.jpg';
import jacketImg from '@/assets/extracted/image11_2_63.jpg';
import item1 from '@/assets/extracted/image7_2_63.jpg';
import item2 from '@/assets/extracted/image6_2_63.jpg';
import item3 from '@/assets/extracted/image8_2_63.jpg';
import item4 from '@/assets/extracted/image9_2_63.jpg';
import photo1 from '@/assets/extracted/image4_2_63.jpg';
import photo2 from '@/assets/extracted/image3_2_63.jpg';
import photo3 from '@/assets/extracted/image1_2_63.jpg';

const ALL_PRODUCTS = [
  {
    id: 1,
    name: 'LINEN TRENCH COAT',
    price: 199,
    category: 'COATS',
    gender: 'men',
    color: 'beige',
    size: 'L',
    status: 'NEW',
    rating: 5,
    image: coatImg,
    tag: 'NEW IN / COATS'
  },
  {
    id: 2,
    name: 'DOUBLE BREASTED WOOL SUIT',
    price: 249,
    category: 'SUITS',
    gender: 'women',
    color: 'black',
    size: 'M',
    status: 'BEST SELLER',
    rating: 5,
    image: suitImg,
    tag: 'WOMEN / SUITS'
  },
  {
    id: 3,
    name: 'STRUCTURED OVERSIZED JACKET',
    price: 189,
    category: 'JACKETS',
    gender: 'women',
    color: 'beige',
    size: 'S',
    status: 'NEW',
    rating: 4,
    image: jacketImg,
    tag: 'WOMEN / OUTERWEAR'
  },
  {
    id: 4,
    name: 'EMBROIDERED SEERSUCKER SHIRT',
    price: 99,
    category: 'SHIRTS',
    gender: 'men',
    color: 'beige',
    size: 'M',
    status: 'NEW',
    rating: 4,
    image: item1,
    tag: 'NEW IN / SHIRTS'
  },
  {
    id: 5,
    name: 'CASUAL OVERSIZED LINEN BLAZER',
    price: 149,
    category: 'JACKETS',
    gender: 'women',
    color: 'black',
    size: 'L',
    status: 'BEST SELLER',
    rating: 5,
    image: item2,
    tag: 'NEW IN / JACKETS'
  },
  {
    id: 6,
    name: 'RELAXED COTTON DRAWSTRING PANTS',
    price: 89,
    category: 'JEANS',
    gender: 'men',
    color: 'beige',
    size: 'XL',
    status: 'NEW',
    rating: 4,
    image: item3,
    tag: 'NEW IN / PANTS'
  },
  {
    id: 7,
    name: 'CLASSIC LEATHER STRAP SANDALS',
    price: 120,
    category: 'SHORTS',
    gender: 'women',
    color: 'black',
    size: 'S',
    status: 'NEW',
    rating: 3,
    image: item4,
    tag: 'NEW IN / ACCESSORIES'
  },
  {
    id: 8,
    name: 'TEXTURED CAMP COLLAR SHIRT',
    price: 79,
    category: 'POLOS',
    gender: 'men',
    color: 'beige',
    size: 'XL',
    status: 'BEST SELLER',
    rating: 5,
    image: photo1,
    tag: 'NEW IN / POLOS'
  },
  {
    id: 9,
    name: 'RELAXED LINEN TROUSERS',
    price: 110,
    category: 'JEANS',
    gender: 'women',
    color: 'beige',
    size: 'M',
    status: 'NEW',
    rating: 4,
    image: photo2,
    tag: 'NEW IN / PANTS'
  },
  {
    id: 10,
    name: 'FINE KNIT POLO SWEATER',
    price: 130,
    category: 'SWEATER',
    gender: 'men',
    color: 'black',
    size: '2XL',
    status: 'BEST SELLER',
    rating: 4,
    image: photo3,
    tag: 'MEN / SWEATER'
  }
];

const CATEGORY_TAGS_ROW_1 = ['NEW', 'SHORTS', 'POLOS', 'SWEATER', 'SUITS'];
const CATEGORY_TAGS_ROW_2 = ['BEST SELLER', 'SHIRTS', 'JEANS', 'JACKETS', 'COATS'];

const SIZES = ['XS', 'S', 'M', 'L', 'XL', '2XL'];

export default function CollectionsPage() {
  // Filter States
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedGenders, setSelectedGenders] = useState([]);
  const [selectedColors, setSelectedColors] = useState([]);
  const [selectedSizes, setSelectedSizes] = useState([]);
  const [selectedTags, setSelectedTags] = useState([]);
  const [sortBy, setSortBy] = useState('newest'); // 'price-asc', 'price-desc', 'newest'
  const [priceRange, setPriceRange] = useState(300);
  const [selectedRatings, setSelectedRatings] = useState([]);
  const [selectedStatuses, setSelectedStatuses] = useState([]);

  // Accordion Expand/Collapse States
  const [expandGender, setExpandGender] = useState(true);
  const [expandColor, setExpandColor] = useState(true);
  const [expandSize, setExpandSize] = useState(true);
  const [expandSort, setExpandSort] = useState(true);
  const [expandPrice, setExpandPrice] = useState(true);
  const [expandStatus, setExpandStatus] = useState(true);
  const [expandRating, setExpandRating] = useState(true);

  // Toggle handlers
  const handleGenderToggle = (gender) => {
    setSelectedGenders(prev =>
      prev.includes(gender) ? prev.filter(g => g !== gender) : [...prev, gender]
    );
  };

  const handleColorToggle = (color) => {
    setSelectedColors(prev =>
      prev.includes(color) ? prev.filter(c => c !== color) : [...prev, color]
    );
  };

  const handleSizeToggle = (size) => {
    setSelectedSizes(prev =>
      prev.includes(size) ? prev.filter(s => s !== size) : [...prev, size]
    );
  };

  const handleTagToggle = (tag) => {
    setSelectedTags(prev =>
      prev.includes(tag) ? prev.filter(t => t !== tag) : [...prev, tag]
    );
  };

  const handleRatingToggle = (rating) => {
    setSelectedRatings(prev =>
      prev.includes(rating) ? prev.filter(r => r !== rating) : [...prev, rating]
    );
  };

  const handleStatusToggle = (status) => {
    setSelectedStatuses(prev =>
      prev.includes(status) ? prev.filter(s => s !== status) : [...prev, status]
    );
  };

  // Filter & Sort Logic
  const filteredProducts = useMemo(() => {
    let result = [...ALL_PRODUCTS];

    // Search query filter
    if (searchQuery.trim() !== '') {
      const q = searchQuery.toLowerCase();
      result = result.filter(p =>
        p.name.toLowerCase().includes(q) ||
        p.category.toLowerCase().includes(q) ||
        p.tag.toLowerCase().includes(q)
      );
    }

    // Gender filter
    if (selectedGenders.length > 0) {
      result = result.filter(p => selectedGenders.includes(p.gender));
    }

    // Color filter
    if (selectedColors.length > 0) {
      result = result.filter(p => selectedColors.includes(p.color));
    }

    // Size filter
    if (selectedSizes.length > 0) {
      result = result.filter(p => selectedSizes.includes(p.size));
    }

    // Rating filter
    if (selectedRatings.length > 0) {
      result = result.filter(p => selectedRatings.includes(p.rating));
    }

    // Status filter (from Sidebar)
    if (selectedStatuses.length > 0) {
      result = result.filter(p => selectedStatuses.includes(p.status));
    }

    // Category Tag Pills Filter
    if (selectedTags.length > 0) {
      result = result.filter(p => {
        return selectedTags.some(t => {
          if (t === 'NEW') return p.status === 'NEW';
          if (t === 'BEST SELLER') return p.status === 'BEST SELLER';
          return p.category === t;
        });
      });
    }

    // Price range filter
    result = result.filter(p => p.price <= priceRange);

    // Sorting
    if (sortBy === 'price-asc') {
      result.sort((a, b) => a.price - b.price);
    } else if (sortBy === 'price-desc') {
      result.sort((a, b) => b.price - a.price);
    } else if (sortBy === 'newest') {
      // Keep mock default or sort by status New first
      result.sort((a, b) => (b.status === 'NEW' ? 1 : 0) - (a.status === 'NEW' ? 1 : 0));
    }

    return result;
  }, [searchQuery, selectedGenders, selectedColors, selectedSizes, selectedTags, sortBy, priceRange, selectedRatings, selectedStatuses]);

  return (
    <div className="collections-container">
      {/* Sidebar Filter Panel */}
      <aside className="filter-sidebar">
        {/* Breadcrumbs */}
        <div className="breadcrumb">
          <Link to="/" className="breadcrumb-link">HOME</Link>
          <span className="breadcrumb-separator">/</span>
          <span className="breadcrumb-current">PRODUCTS</span>
        </div>

        <h1 className="sidebar-title">PRODUCTS</h1>

        {/* Gender Accordion */}
        <div className="filter-section">
          <div className="filter-header" onClick={() => setExpandGender(!expandGender)}>
            <span className="filter-label">GENDER</span>
            <span className="accordion-caret">{expandGender ? '▲' : '▼'}</span>
          </div>
          {expandGender && (
            <div className="filter-content">
              <label className="checkbox-container">
                <input
                  type="checkbox"
                  checked={selectedGenders.includes('men')}
                  onChange={() => handleGenderToggle('men')}
                />
                <span className="checkbox-custom"></span>
                <span className="checkbox-label">MAN</span>
              </label>
              <label className="checkbox-container">
                <input
                  type="checkbox"
                  checked={selectedGenders.includes('women')}
                  onChange={() => handleGenderToggle('women')}
                />
                <span className="checkbox-custom"></span>
                <span className="checkbox-label">WOMAN</span>
              </label>
            </div>
          )}
        </div>

        {/* Color Accordion */}
        <div className="filter-section">
          <div className="filter-header" onClick={() => setExpandColor(!expandColor)}>
            <span className="filter-label">COLOR</span>
            <span className="accordion-caret">{expandColor ? '▲' : '▼'}</span>
          </div>
          {expandColor && (
            <div className="filter-content color-swatches">
              <button
                className={`color-swatch-btn color-beige ${selectedColors.includes('beige') ? 'active' : ''}`}
                onClick={() => handleColorToggle('beige')}
                aria-label="Filter Beige"
              ></button>
              <button
                className={`color-swatch-btn color-black ${selectedColors.includes('black') ? 'active' : ''}`}
                onClick={() => handleColorToggle('black')}
                aria-label="Filter Black"
              ></button>
            </div>
          )}
        </div>

        {/* Size Accordion */}
        <div className="filter-section">
          <div className="filter-header" onClick={() => setExpandSize(!expandSize)}>
            <span className="filter-label">SIZE</span>
            <span className="accordion-caret">{expandSize ? '▲' : '▼'}</span>
          </div>
          {expandSize && (
            <div className="filter-content size-grid">
              {SIZES.map(size => (
                <button
                  key={size}
                  className={`size-grid-btn ${selectedSizes.includes(size) ? 'active' : ''}`}
                  onClick={() => handleSizeToggle(size)}
                >
                  {size}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Sort By Accordion */}
        <div className="filter-section">
          <div className="filter-header" onClick={() => setExpandSort(!expandSort)}>
            <span className="filter-label">SORT BY</span>
            <span className="accordion-caret">{expandSort ? '▲' : '▼'}</span>
          </div>
          {expandSort && (
            <div className="filter-content sort-options">
              <label className="radio-container">
                <input
                  type="radio"
                  name="sortBy"
                  checked={sortBy === 'newest'}
                  onChange={() => setSortBy('newest')}
                />
                <span className="radio-custom"></span>
                <span className="radio-label">NEWEST</span>
              </label>
              <label className="radio-container">
                <input
                  type="radio"
                  name="sortBy"
                  checked={sortBy === 'price-asc'}
                  onChange={() => setSortBy('price-asc')}
                />
                <span className="radio-custom"></span>
                <span className="radio-label">PRICE: LOW TO HIGH</span>
              </label>
              <label className="radio-container">
                <input
                  type="radio"
                  name="sortBy"
                  checked={sortBy === 'price-desc'}
                  onChange={() => setSortBy('price-desc')}
                />
                <span className="radio-custom"></span>
                <span className="radio-label">PRICE: HIGH TO LOW</span>
              </label>
            </div>
          )}
        </div>

        {/* Price Accordion */}
        <div className="filter-section">
          <div className="filter-header" onClick={() => setExpandPrice(!expandPrice)}>
            <span className="filter-label">PRICE</span>
            <span className="accordion-caret">{expandPrice ? '▲' : '▼'}</span>
          </div>
          {expandPrice && (
            <div className="filter-content price-range-content">
              <input
                type="range"
                min="50"
                max="300"
                value={priceRange}
                onChange={(e) => setPriceRange(Number(e.target.value))}
                className="price-slider"
              />
              <div className="price-display">
                <span>MAX PRICE:</span>
                <span className="price-val">${priceRange}</span>
              </div>
            </div>
          )}
        </div>

        {/* Product Status Accordion */}
        <div className="filter-section">
          <div className="filter-header" onClick={() => setExpandStatus(!expandStatus)}>
            <span className="filter-label">PRODUCT STATUS</span>
            <span className="accordion-caret">{expandStatus ? '▲' : '▼'}</span>
          </div>
          {expandStatus && (
            <div className="filter-content">
              <label className="checkbox-container">
                <input
                  type="checkbox"
                  checked={selectedStatuses.includes('NEW')}
                  onChange={() => handleStatusToggle('NEW')}
                />
                <span className="checkbox-custom"></span>
                <span className="checkbox-label">NEW IN</span>
              </label>
              <label className="checkbox-container">
                <input
                  type="checkbox"
                  checked={selectedStatuses.includes('BEST SELLER')}
                  onChange={() => handleStatusToggle('BEST SELLER')}
                />
                <span className="checkbox-custom"></span>
                <span className="checkbox-label">BEST SELLERS</span>
              </label>
            </div>
          )}
        </div>

        {/* Rating Accordion */}
        <div className="filter-section">
          <div className="filter-header" onClick={() => setExpandRating(!expandRating)}>
            <span className="filter-label">RATING</span>
            <span className="accordion-caret">{expandRating ? '▲' : '▼'}</span>
          </div>
          {expandRating && (
            <div className="filter-content">
              {[5, 4, 3].map(stars => (
                <label key={stars} className="checkbox-container">
                  <input
                    type="checkbox"
                    checked={selectedRatings.includes(stars)}
                    onChange={() => handleRatingToggle(stars)}
                  />
                  <span className="checkbox-custom"></span>
                  <span className="checkbox-label">
                    {'★'.repeat(stars)}{'☆'.repeat(5 - stars)} &amp; UP
                  </span>
                </label>
              ))}
            </div>
          )}
        </div>
      </aside>

      {/* Main Grid Area */}
      <main className="collections-main">
        {/* Top Control Bar (Search + Categories) */}
        <div className="top-control-bar">
          {/* Custom Search Bar matching SVG coordinates */}
          <div className="collections-search-bar">
            <img src={searchIcon} className="collections-search-icon" alt="" />
            <input
              type="text"
              placeholder="SEARCH PRODUCTS"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="collections-search-input"
              aria-label="Search Products"
            />
          </div>

          {/* Category Tag Pills Layout (Flat Grid Layout) */}
          <div className="category-tags-grid">
            {['NEW', 'SHORTS', 'POLOS', 'SWEATER', 'SUITS', 'BEST SELLER', 'SHIRTS', 'JEANS', 'JACKETS', 'COATS'].map(tag => (
              <button
                key={tag}
                className={`tag-pill-btn ${selectedTags.includes(tag) ? 'active' : ''}`}
                onClick={() => handleTagToggle(tag)}
              >
                {tag}
              </button>
            ))}
          </div>
        </div>

        {/* Active Filters Summary */}
        {(selectedGenders.length > 0 ||
          selectedColors.length > 0 ||
          selectedSizes.length > 0 ||
          selectedTags.length > 0 ||
          selectedRatings.length > 0 ||
          selectedStatuses.length > 0 ||
          searchQuery !== '') && (
          <div className="active-filters-summary">
            <span className="summary-label">ACTIVE FILTERS:</span>
            <div className="active-pills-list">
              {selectedGenders.map(g => (
                <span key={g} className="filter-pill" onClick={() => handleGenderToggle(g)}>
                  {g.toUpperCase()} &times;
                </span>
              ))}
              {selectedColors.map(c => (
                <span key={c} className="filter-pill" onClick={() => handleColorToggle(c)}>
                  COLOR: {c.toUpperCase()} &times;
                </span>
              ))}
              {selectedSizes.map(s => (
                <span key={s} className="filter-pill" onClick={() => handleSizeToggle(s)}>
                  SIZE: {s} &times;
                </span>
              ))}
              {selectedTags.map(t => (
                <span key={t} className="filter-pill" onClick={() => handleTagToggle(t)}>
                  {t} &times;
                </span>
              ))}
              {selectedStatuses.map(s => (
                <span key={s} className="filter-pill" onClick={() => handleStatusToggle(s)}>
                  {s} &times;
                </span>
              ))}
              {selectedRatings.map(r => (
                <span key={r} className="filter-pill" onClick={() => handleRatingToggle(r)}>
                  {r} STARS &amp; UP &times;
                </span>
              ))}
              {searchQuery !== '' && (
                <span className="filter-pill" onClick={() => setSearchQuery('')}>
                  "{searchQuery}" &times;
                </span>
              )}
              <button
                className="clear-all-btn"
                onClick={() => {
                  setSelectedGenders([]);
                  setSelectedColors([]);
                  setSelectedSizes([]);
                  setSelectedTags([]);
                  setSelectedRatings([]);
                  setSelectedStatuses([]);
                  setSearchQuery('');
                }}
              >
                CLEAR ALL
              </button>
            </div>
          </div>
        )}

        {/* Product Grid */}
        <div className="collections-grid">
          {filteredProducts.length > 0 ? (
            filteredProducts.map(product => (
              <div className="collections-card" key={product.id}>
                <div className="card-image-wrapper">
                  <img src={product.image} alt={product.name} className="card-product-image" />
                </div>
                <div className="card-details">
                  <div className="card-category">{product.tag}</div>
                  <h3 className="card-title">{product.name}</h3>
                  <div className="card-price">${product.price}</div>
                </div>
              </div>
            ))
          ) : (
            <div className="no-products-message">
              <h3>NO PRODUCTS FOUND MATCHING YOUR CRITERIA.</h3>
              <p>Try resetting some filters or searching for another term.</p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
