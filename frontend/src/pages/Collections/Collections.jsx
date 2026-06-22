import { useState, useMemo, useEffect } from 'react';
import ProductQuickView from '@/components/common/ProductQuickView/ProductQuickView';
import Drawer from '@/components/common/Drawer/Drawer';
import { FILTER_SIZES, FILTER_COLORS } from '@/data/mockData';
import searchIcon from '@/assets/icons/search.svg';
import { Link } from 'react-router-dom';
import { useGetProductsQuery } from '@/store/actions/productActions';
import Loader from '@/components/common/Loader/Loader';
import './Collections.css';

const GENDER_OPTIONS = [
  { id: 'men', label: 'MAN' },
  { id: 'women', label: 'WOMAN' }
];

const SORT_OPTIONS = [
  { id: 'all', label: 'ALL' },
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
  const { data: apiData, isLoading } = useGetProductsQuery();

  const productsList = useMemo(() => {
    return apiData?.products ?? [];
  }, [apiData]);

  const [isColorExpanded, setIsColorExpanded] = useState(false);

  const colorsToRender = useMemo(() => {
    const colorMap = new Map();
    productsList.forEach(p => {
      (p.colors || []).forEach(c => c.name && c.hex && colorMap.set(c.name.toLowerCase(), c.hex));
      if (p.color) {
        const fallback = FILTER_COLORS.find(fc => fc.name.toLowerCase() === p.color.toLowerCase())?.hex || '#A9A9A9';
        colorMap.set(p.color.toLowerCase(), fallback);
      }
    });
    return colorMap.size > 0 ? Array.from(colorMap, ([name, hex]) => ({ name, hex })) : FILTER_COLORS;
  }, [productsList]);

  const visibleColors = colorsToRender.length > 12 && !isColorExpanded
    ? colorsToRender.slice(0, 11)
    : colorsToRender;

  const maxProductPrice = useMemo(() => {
    if (!productsList || productsList.length === 0) return 300;
    const prices = productsList.map(p => Number(p.price) || 0);
    const maxVal = Math.max(...prices);
    return Math.ceil(maxVal) + 50;
  }, [productsList]);

  const [filterData, setFilterData] = useState({
    searchQuery: '',
    selectedGenders: [],
    selectedColors: [],
    selectedSizes: [],
    selectedTags: [],
    sortBy: 'all',
    priceRange: 1000,
    selectedRatings: [],
    selectedStatuses: []
  });

  // Sync initial priceRange with maxProductPrice when products load
  useEffect(() => {
    if (productsList && productsList.length > 0) {
      setFilterData(prev => {
        if (prev.priceRange === 1000 || prev.priceRange === -1) {
          return { ...prev, priceRange: maxProductPrice };
        }
        return prev;
      });
    }
  }, [productsList, maxProductPrice]);

  const hasActiveFilters = 
    filterData.searchQuery.trim() !== '' ||
    filterData.selectedGenders.length > 0 ||
    filterData.selectedColors.length > 0 ||
    filterData.selectedSizes.length > 0 ||
    filterData.selectedStatuses.length > 0 ||
    filterData.selectedRatings.length > 0 ||
    filterData.priceRange < maxProductPrice;

  const handleClearAll = () => {
    setFilterData({
      searchQuery: '',
      selectedGenders: [],
      selectedColors: [],
      selectedSizes: [],
      selectedTags: [],
      sortBy: 'all',
      priceRange: maxProductPrice,
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
  const [quickViewProductId, setQuickViewProductId] = useState(null);

  // ─── Mobile Filters Drawer State ─────────────────────────────
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);

  // ─── Consolidated Toggle Handler ─────────────────────────────
  const toggleFilterItem = (field, item) => {
    setFilterData(prev => ({
      ...prev,
      [field]: prev[field].includes(item)
        ? prev[field].filter(x => x !== item)
        : [...prev[field], item]
    }));
  };

  // ─── Filter & Search Logic ────────────────────────────────────
  const filteredProducts = useMemo(() => {
    let result = productsList;
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

    if (searchQuery.trim() !== '') {
      const q = searchQuery.toLowerCase();
      result = result.filter(p => 
        p.name.toLowerCase().includes(q) || 
        (p.tag && p.tag.toLowerCase().includes(q)) ||
        (p.category && p.category.toLowerCase().includes(q))
      );
    }

    if (selectedGenders.length > 0) {
      result = result.filter(p => {
        const g = p.gender?.toLowerCase();
        return selectedGenders.some(sel => {
          if (sel === 'men' && (g === 'men' || g === 'man')) return true;
          if (sel === 'women' && (g === 'women' || g === 'woman')) return true;
          return g === sel;
        });
      });
    }

    if (selectedColors.length > 0) {
      result = result.filter(p => {
        if (p.color && selectedColors.includes(p.color.toLowerCase())) return true;
        if (p.colors && p.colors.some(c => selectedColors.includes(c.name?.toLowerCase()))) return true;
        return false;
      });
    }

    if (selectedSizes.length > 0) {
      result = result.filter(p => {
        if (p.size && selectedSizes.includes(p.size)) return true;
        if (p.sizes && p.sizes.some(s => selectedSizes.includes(s))) return true;
        return false;
      });
    }

    if (selectedRatings.length > 0) {
      result = result.filter(p => selectedRatings.includes(p.rating));
    }

    if (selectedStatuses.length > 0) {
      result = result.filter(p => {
        const stat = p.status?.toUpperCase();
        return selectedStatuses.some(sel => {
          if (sel === 'NEW' && (stat === 'NEW' || stat === 'NEW IN')) return true;
          if (sel === 'BEST SELLER' && (stat === 'BEST SELLER' || stat === 'BEST SELLERS')) return true;
          return stat === sel;
        });
      });
    }

    if (selectedTags.length > 0) {
      result = result.filter(p => {
        return selectedTags.some(t => {
          if (t === 'NEW') return p.status === 'NEW' || p.status === 'New In';
          if (t === 'BEST SELLER') return p.status === 'BEST SELLER' || p.status === 'Best Seller';
          return p.category === t;
        });
      });
    }

    result = result.filter(p => p.price <= priceRange);

    if (sortBy === 'price-asc') {
      result = [...result].sort((a, b) => a.price - b.price);
    } else if (sortBy === 'price-desc') {
      result = [...result].sort((a, b) => b.price - a.price);
    } else if (sortBy === 'newest') {
      result = [...result].sort((a, b) => {
        const dateA = a.createdAt ? new Date(a.createdAt).getTime() : 0;
        const dateB = b.createdAt ? new Date(b.createdAt).getTime() : 0;
        if (dateA && dateB) return dateB - dateA;
        return (b.status === 'NEW' || b.status === 'New In' ? 1 : 0) - (a.status === 'NEW' || a.status === 'New In' ? 1 : 0);
      });
    }

    return result;
  }, [productsList, filterData]);

  if (isLoading) {
    return (
      <div className="collections-loader-wrapper">
        <Loader />
      </div>
    );
  }

  // Extract filter option blocks to reuse between inline sidebar and mobile Drawer
  const renderFilterOptions = (isMobile) => (
    <>
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
            {visibleColors.map(c => (
              <button
                key={c.name}
                className={`color-swatch-btn ${filterData.selectedColors.includes(c.name.toLowerCase()) ? 'active' : ''}`}
                style={{ backgroundColor: c.hex }}
                onClick={() => toggleFilterItem('selectedColors', c.name.toLowerCase())}
                aria-label={`Filter ${c.name}`}
                title={c.name.toUpperCase()}
              ></button>
            ))}
            {colorsToRender.length > 12 && !isColorExpanded && (
              <button
                className="color-swatch-btn expand-colors-btn"
                onClick={(e) => {
                  e.stopPropagation();
                  setIsColorExpanded(true);
                }}
                aria-label="Show all colors"
              >
                ...
              </button>
            )}
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
                  name={isMobile ? "sortBy-mobile" : "sortBy-desktop"} 
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
              max={maxProductPrice}
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
    </>
  );

  return (
    <div className="collections-container">
      {/* Reusable Drawer Component for Mobile Filter Panel */}
      <Drawer
        isOpen={isMobileFilterOpen}
        onClose={() => setIsMobileFilterOpen(false)}
        title="COLLECTIONS"
        position="left"
        className="collections-mobile-drawer"
      >
        <div className="breadcrumb">
          <Link to="/" className="breadcrumb-link" onClick={() => setIsMobileFilterOpen(false)}>HOME</Link>
          <span className="breadcrumb-separator">/</span>
          <span className="breadcrumb-current">COLLECTIONS</span>
        </div>
        {renderFilterOptions(true)}
      </Drawer>

      {/* Sidebar Filter Panel (Desktop only, hidden on mobile via CSS) */}
      <aside className="filter-sidebar">
        <div className="breadcrumb">
          <Link to="/" className="breadcrumb-link">HOME</Link>
          <span className="breadcrumb-separator">/</span>
          <span className="breadcrumb-current">COLLECTIONS</span>
        </div>

        <h1 className="sidebar-title">COLLECTIONS</h1>

        {renderFilterOptions(false)}
      </aside>

      {/* Main Grid Area */}
      <main className="collections-main">
        {/* Top Control Bar */}
        <div className="top-control-bar">
          <button 
            className="mobile-filter-toggle-btn" 
            onClick={() => setIsMobileFilterOpen(true)}
            aria-label="Open Filters"
          >
            FILTERS
          </button>
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
            {filterData.priceRange < maxProductPrice && (
              <span className="active-filter-tag">
                Max Price: ${filterData.priceRange}
                <button className="clear-tag-btn" onClick={() => setFilterData(prev => ({ ...prev, priceRange: maxProductPrice }))} aria-label="Clear Price Limit">✕</button>
              </span>
            )}
            <button className="clear-all-filters-btn" onClick={handleClearAll}>CLEAR ALL</button>
          </div>
        )}

        {/* Product Grid */}
        <div className="collections-grid">
          {filteredProducts.length > 0 ? (
            filteredProducts.map(product => (
              <div 
                className="collections-card-link" 
                key={product._id || product.id} 
                onClick={() => setQuickViewProductId(product._id || product.id)}
              >
                <div className="collections-card">
                  <div className="card-image-wrapper">
                    <img src={product.image} alt={product.name} className="card-product-image" />
                  </div>
                  <div className="card-details">
                    <div className="card-category">
                      {product.tag || `${product.gender?.toUpperCase()} / ${product.category?.toUpperCase()}`}
                    </div>
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
      {quickViewProductId && (
        <ProductQuickView 
          key={quickViewProductId}
          productId={quickViewProductId} 
          onClose={() => setQuickViewProductId(null)} 
        />
      )}
    </div>
  );
}
