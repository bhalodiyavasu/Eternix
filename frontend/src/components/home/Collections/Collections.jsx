import React, { useState } from 'react';

import suitImg from '@/assets/extracted/image1_2_63.jpg';
import coatImg from '@/assets/extracted/image10_2_63.jpg';
import jacketImg from '@/assets/extracted/image11_2_63.jpg';

import './Collections.css';

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

export default function Collections() {
  const [activeFilter, setActiveFilter] = useState('all');

  const filteredProducts = activeFilter === 'all' 
    ? COLLECTIONS_PRODUCTS 
    : COLLECTIONS_PRODUCTS.filter(p => p.gender === activeFilter);

  return (
    <section className="collections-section" id="collections">
      <div className="collections-header">
        <h2 className="section-title">XIV COLLECTIONS <span>23-24</span></h2>
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
        {filteredProducts.map((prod) => (
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
  );
}

