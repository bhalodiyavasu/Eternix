import React from 'react';
import photo1 from '@/assets/extracted/image4_2_63.jpg';
import photo2 from '@/assets/extracted/image3_2_63.jpg';
import photo3 from '@/assets/extracted/image1_2_63.jpg';
import photo4 from '@/assets/extracted/image5_2_63.png';
import './AestheticGrid.css';

export default function AestheticGrid() {
  return (
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
  );
}
