import { useState, useMemo } from 'react';
import ProductQuickView from '@/components/common/ProductQuickView/ProductQuickView';
import { ALL_PRODUCTS, FILTER_SIZES, FILTER_COLORS } from '@/data/mockData';
import searchIcon from '@/assets/icons/search.svg';
import { Link } from 'react-router-dom';
import './Collections.css';

const GENDER_OPTIONS = [
  { id: 'men', label: 'MAN' },
  { id: 'women', label: 'WOMAN' }
];

const SORT_OPTIONS = [
  { id: 'newest', label: 'NEWEST' },
  { id: 'price-asc', label: 'PRICE: LOW TO HIGH' },
  { id: 'price-desc', label: 'PRICE: HIGH TO LOW' }
];

const STATUS_OPTIONS = [
  { id: 'NEW', label: 'NEW IN' },
  { id: 'BEST SELLER', label: 'BEST SELLERS' }
];

const RATING_OPTIONS = [5, 4, 3];

export default function Collections() {
  // ─── Filter States (Consolidated into single state object) ────
  const [filterData, setFilterData] = useState({
    searchQuery: '',
    selectedGenders: [],
    selectedColors: [],
    selectedSizes: [],
    selectedTags: [],
    sortBy: 'newest',
    priceRange: 300,
    selectedRatings: [],
    selectedStatuses: []
  });

  const hasActiveFilters = 
    filterData.searchQuery.trim() !== '' ||
    filterData.selectedGenders.length > 0 ||
    filterData.selectedColors.length > 0 ||
    filterData.selectedSizes.length > 0 ||
    filterData.selectedStatuses.length > 0 ||
    filterData.selectedRatings.length > 0 ||
    filterData.priceRange < 300;

  const handleClearAll = () => {
    setFilterData({
      searchQuery: '',
      selectedGenders: [],
      selectedColors: [],
      selectedSizes: [],
      selectedTags: [],
      sortBy: 'newest',
      priceRange: 300,
      selectedRatings: [],
      selectedStatuses: []
    });
  };

  // ─── Consolidated Accordion State ────────────────────────────
  const [expandedSections, setExpandedSections] = useState({
    gender: true,
    color: true,
    size: true,
    sort: true,
    price: true,
    status: true,
    rating: true
  });

  const toggleSection = (section) => {
    setExpandedSections(prev => ({ ...prev, [section]: !prev[section] }));
  };

  // ─── Quick View State ────────────────────────────────────────
  const [quickViewProduct, setQuickViewProduct] = useState(null);

  // ─── Consolidated Toggle Handler ─────────────────────────────
  const toggleFilterItem = (field, item) => {
    setFilterData(prev => ({
      ...prev,
      [field]: prev[field].includes(item)
        ? prev[field].filter(x => x !== item)
        : [...prev[field], item]
    }));
  };

  // ─── Filter & Sort Logic ─────────────────────────────────────
  const filteredProducts = useMemo(() => {
    const {
      searchQuery,
      selectedGenders,
      selectedColors,
      selectedSizes,
      selectedTags,
      sortBy,
      priceRange,
      selectedRatings,
      selectedStatuses
    } = filterData;

    let result = [...ALL_PRODUCTS];

    if (searchQuery.trim() !== '') {
      const q = searchQuery.toLowerCase();
      result = result.filter(p =>
        p.name.toLowerCase().includes(q) ||
        p.category.toLowerCase().includes(q) ||
        p.tag.toLowerCase().includes(q)
      );
    }

    if (selectedGenders.length > 0) {
      result = result.filter(p => selectedGenders.includes(p.gender));
    }

    if (selectedColors.length > 0) {
      result = result.filter(p => selectedColors.includes(p.color));
    }

    if (selectedSizes.length > 0) {
      result = result.filter(p => selectedSizes.includes(p.size));
    }

    if (selectedRatings.length > 0) {
      result = result.filter(p => selectedRatings.includes(p.rating));
    }

    if (selectedStatuses.length > 0) {
      result = result.filter(p => selectedStatuses.includes(p.status));
    }

    if (selectedTags.length > 0) {
      result = result.filter(p => {
        return selectedTags.some(t => {
          if (t === 'NEW') return p.status === 'NEW';
          if (t === 'BEST SELLER') return p.status === 'BEST SELLER';
          return p.category === t;
        });
      });
    }

    result = result.filter(p => p.price <= priceRange);

    if (sortBy === 'price-asc') {
      result.sort((a, b) => a.price - b.price);
    } else if (sortBy === 'price-desc') {
      result.sort((a, b) => b.price - a.price);
    } else if (sortBy === 'newest') {
      result.sort((a, b) => (b.status === 'NEW' ? 1 : 0) - (a.status === 'NEW' ? 1 : 0));
    }

    return result;
  }, [filterData]);

  return (
    <div className="collections-container">
      {/* Sidebar Filter Panel */}
      <aside className="filter-sidebar">
        {/* Breadcrumbs */}
        <div className="breadcrumb">
          <Link to="/" className="breadcrumb-link">HOME</Link>
          <span className="breadcrumb-separator">/</span>
          <span className="breadcrumb-current">COLLECTIONS</span>
        </div>

        <h1 className="sidebar-title">COLLECTIONS</h1>

        {/* Gender Accordion */}
        <div className="filter-section">
          <div className="filter-header" onClick={() => toggleSection('gender')}>
            <span className="filter-label">GENDER</span>
            <span className="accordion-caret">{expandedSections.gender ? '▲' : '▼'}</span>
          </div>
          {expandedSections.gender && (
            <div className="filter-content">
              {GENDER_OPTIONS.map(opt => (
                <label key={opt.id} className="checkbox-container">
                  <input
                    type="checkbox"
                    checked={filterData.selectedGenders.includes(opt.id)}
                    onChange={() => toggleFilterItem('selectedGenders', opt.id)}
                  />
                  <span className="checkbox-custom"></span>
                  <span className="checkbox-label">{opt.label}</span>
                </label>
              ))}
            </div>
          )}
        </div>

        {/* Color Accordion */}
        <div className="filter-section">
          <div className="filter-header" onClick={() => toggleSection('color')}>
            <span className="filter-label">COLOR</span>
            <span className="accordion-caret">{expandedSections.color ? '▲' : '▼'}</span>
          </div>
          {expandedSections.color && (
            <div className="filter-content color-swatches">
              {FILTER_COLORS.map(c => (
                <button
                  key={c.name}
                  className={`color-swatch-btn ${filterData.selectedColors.includes(c.name) ? 'active' : ''}`}
                  style={{ backgroundColor: c.hex }}
                  onClick={() => toggleFilterItem('selectedColors', c.name)}
                  aria-label={`Filter ${c.name}`}
                ></button>
              ))}
            </div>
          )}
        </div>

        {/* Size Accordion */}
        <div className="filter-section">
          <div className="filter-header" onClick={() => toggleSection('size')}>
            <span className="filter-label">SIZE</span>
            <span className="accordion-caret">{expandedSections.size ? '▲' : '▼'}</span>
          </div>
          {expandedSections.size && (
            <div className="filter-content size-grid">
              {FILTER_SIZES.map(size => (
                <button
                  key={size}
                  className={`size-grid-btn ${filterData.selectedSizes.includes(size) ? 'active' : ''}`}
                  onClick={() => toggleFilterItem('selectedSizes', size)}
                >
                  {size}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Sort By Accordion */}
        <div className="filter-section">
          <div className="filter-header" onClick={() => toggleSection('sort')}>
            <span className="filter-label">SORT BY</span>
            <span className="accordion-caret">{expandedSections.sort ? '▲' : '▼'}</span>
          </div>
          {expandedSections.sort && (
            <div className="filter-content sort-options">
              {SORT_OPTIONS.map(opt => (
                <label key={opt.id} className="radio-container">
                  <input 
                    type="radio" 
                    name="sortBy" 
                    checked={filterData.sortBy === opt.id} 
                    onChange={() => setFilterData(prev => ({ ...prev, sortBy: opt.id }))} 
                  />
                  <span className="radio-custom"></span>
                  <span className="radio-label">{opt.label}</span>
                </label>
              ))}
            </div>
          )}
        </div>

        {/* Price Accordion */}
        <div className="filter-section">
          <div className="filter-header" onClick={() => toggleSection('price')}>
            <span className="filter-label">PRICE</span>
            <span className="accordion-caret">{expandedSections.price ? '▲' : '▼'}</span>
          </div>
          {expandedSections.price && (
            <div className="filter-content price-range-content">
              <input
                type="range"
                min="50"
                max="300"
                value={filterData.priceRange}
                onChange={(e) => setFilterData(prev => ({ ...prev, priceRange: Number(e.target.value) }))}
                className="price-slider"
              />
              <div className="price-display">
                <span>MAX PRICE:</span>
                <span className="price-val">${filterData.priceRange}</span>
              </div>
            </div>
          )}
        </div>

        {/* Product Status Accordion */}
        <div className="filter-section">
          <div className="filter-header" onClick={() => toggleSection('status')}>
            <span className="filter-label">PRODUCT STATUS</span>
            <span className="accordion-caret">{expandedSections.status ? '▲' : '▼'}</span>
          </div>
          {expandedSections.status && (
            <div className="filter-content">
              {STATUS_OPTIONS.map(opt => (
                <label key={opt.id} className="checkbox-container">
                  <input 
                    type="checkbox" 
                    checked={filterData.selectedStatuses.includes(opt.id)} 
                    onChange={() => toggleFilterItem('selectedStatuses', opt.id)} 
                  />
                  <span className="checkbox-custom"></span>
                  <span className="checkbox-label">{opt.label}</span>
                </label>
              ))}
            </div>
          )}
        </div>

        {/* Rating Accordion */}
        <div className="filter-section">
          <div className="filter-header" onClick={() => toggleSection('rating')}>
            <span className="filter-label">RATING</span>
            <span className="accordion-caret">{expandedSections.rating ? '▲' : '▼'}</span>
          </div>
          {expandedSections.rating && (
            <div className="filter-content">
              {RATING_OPTIONS.map(stars => (
                <label key={stars} className="checkbox-container">
                  <input 
                    type="checkbox" 
                    checked={filterData.selectedRatings.includes(stars)} 
                    onChange={() => toggleFilterItem('selectedRatings', stars)} 
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
        {/* Top Control Bar */}
        <div className="top-control-bar">
          <div className="collections-search-bar">
            <img src={searchIcon} className="collections-search-icon" alt="" />
            <input
              type="text"
              placeholder="SEARCH PRODUCTS"
              value={filterData.searchQuery}
              onChange={(e) => setFilterData(prev => ({ ...prev, searchQuery: e.target.value }))}
              className="collections-search-input"
              aria-label="Search Products"
            />
          </div>
        </div>

        {/* Active Filters Display */}
        {hasActiveFilters && (
          <div className="active-filters-container">
            {filterData.searchQuery.trim() !== '' && (
              <span className="active-filter-tag">
                Search: &ldquo;{filterData.searchQuery}&rdquo;
                <button className="clear-tag-btn" onClick={() => setFilterData(prev => ({ ...prev, searchQuery: '' }))} aria-label="Clear Search">✕</button>
              </span>
            )}
            {filterData.selectedGenders.map(gender => (
              <span className="active-filter-tag" key={gender}>
                {gender === 'men' ? 'MAN' : 'WOMAN'}
                <button className="clear-tag-btn" onClick={() => toggleFilterItem('selectedGenders', gender)} aria-label={`Clear Gender ${gender}`}>✕</button>
              </span>
            ))}
            {filterData.selectedColors.map(color => (
              <span className="active-filter-tag" key={color}>
                Color: {color}
                <button className="clear-tag-btn" onClick={() => toggleFilterItem('selectedColors', color)} aria-label={`Clear Color ${color}`}>✕</button>
              </span>
            ))}
            {filterData.selectedSizes.map(size => (
              <span className="active-filter-tag" key={size}>
                Size: {size}
                <button className="clear-tag-btn" onClick={() => toggleFilterItem('selectedSizes', size)} aria-label={`Clear Size ${size}`}>✕</button>
              </span>
            ))}
            {filterData.selectedStatuses.map(status => (
              <span className="active-filter-tag" key={status}>
                Status: {status === 'NEW' ? 'NEW IN' : 'BEST SELLERS'}
                <button className="clear-tag-btn" onClick={() => toggleFilterItem('selectedStatuses', status)} aria-label={`Clear Status ${status}`}>✕</button>
              </span>
            ))}
            {filterData.selectedRatings.map(rating => (
              <span className="active-filter-tag" key={rating}>
                Rating: {rating}★ &amp; Up
                <button className="clear-tag-btn" onClick={() => toggleFilterItem('selectedRatings', rating)} aria-label={`Clear Rating ${rating}`}>✕</button>
              </span>
            ))}
            {filterData.priceRange < 300 && (
              <span className="active-filter-tag">
                Under ${filterData.priceRange}
                <button className="clear-tag-btn" onClick={() => setFilterData(prev => ({ ...prev, priceRange: 300 }))} aria-label="Clear Price Limit">✕</button>
              </span>
            )}
            <button className="clear-all-filters-btn" onClick={handleClearAll}>
              CLEAR ALL
            </button>
          </div>
        )}

        {/* Product Grid */}
        <div className="collections-grid">
          {filteredProducts.length > 0 ? (
            filteredProducts.map(product => (
              <div 
                className="collections-card-link" 
                key={product.id} 
                onClick={() => setQuickViewProduct(product)}
                style={{ cursor: 'pointer' }}
              >
                <div className="collections-card">
                  <div className="card-image-wrapper">
                    <img src={product.image} alt={product.name} className="card-product-image" />
                  </div>
                  <div className="card-details">
                    <div className="card-category">{product.tag}</div>
                    <h3 className="card-title">{product.name}</h3>
                    <div className="card-price">${product.price}</div>
                  </div>
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

      {/* Quick View Modal */}
      {quickViewProduct && (
        <ProductQuickView 
          key={quickViewProduct.id}
          product={quickViewProduct} 
          onClose={() => setQuickViewProduct(null)} 
        />
      )}
    </div>
  );
}
