import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import './PaymentSuccessPage.css';

export default function PaymentSuccessPage() {
  const location = useLocation();
  const [showReceiptModal, setShowReceiptModal] = useState(false);

  // Fallback dummy data if accessed directly
  const orderData = location.state || {
    orderId: 'XIV-308420',
    email: 'info@ecommerce.com',
    customerName: 'VASU BHALODIYA',
    phone: '+91 98765 43210',
    address: '45 Fashion Blvd, Design District, Gujarat - 360001, India',
    cartTotal: 308,
    cartItems: [
      {
        product: { 
          name: 'EMBROIDERED SEERSUCKER SHIRT', 
          price: 99, 
          image: 'https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=100' 
        },
        size: 'M',
        color: 'beige',
        quantity: 1
      },
      {
        product: { 
          name: 'RELAXED COTTON DRAWSTRING TROUSERS', 
          price: 89, 
          image: 'https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?w=100' 
        },
        size: 'M',
        color: 'beige',
        quantity: 1
      },
      {
        product: { 
          name: 'CLASSIC LEATHER STRAP SANDALS', 
          price: 120, 
          image: 'https://images.unsplash.com/photo-1543163521-1bf539c55dd2?w=100' 
        },
        size: '37',
        color: 'black',
        quantity: 1
      }
    ]
  };

  const handlePrint = (e) => {
    e.preventDefault();
    window.print();
  };

  return (
    <div className="success-page-container">
      {/* Noise Overlay for premium look */}
      <div className="success-noise"></div>

      <div className="success-content-card">
        {/* Success Icon */}
        <div className="success-icon-wrapper">
          <svg width="48" height="48" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
            <circle cx="24" cy="24" r="24" fill="#10b981" />
            <path d="M15 24.5L21 30.5L33 18" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </div>

        <span className="success-badge">ORDER CONFIRMED</span>
        <h1 className="success-main-title">THANK YOU FOR YOUR PURCHASE</h1>
        
        <p className="success-main-desc">
          Your order has been received and is currently processing. A confirmation receipt with details has been sent to <strong>{orderData.email}</strong>.
        </p>

        {/* Order Info Fields */}
        <div className="success-details-grid">
          <div className="success-detail-box">
            <span className="detail-lbl">ORDER NUMBER</span>
            <span className="detail-val accent-order-id">{orderData.orderId}</span>
          </div>
          <div className="success-detail-box">
            <span className="detail-lbl">EMAIL ADDRESS</span>
            <span className="detail-val">{orderData.email}</span>
          </div>
          <div className="success-detail-box">
            <span className="detail-lbl">CONTACT PHONE</span>
            <span className="detail-val">{orderData.phone}</span>
          </div>
          <div className="success-detail-box">
            <span className="detail-lbl">DELIVERY ADDRESS</span>
            <span className="detail-val address-txt">{orderData.address}</span>
          </div>
        </div>

        <div className="success-divider-line"></div>

        {/* Mini Order Summary */}
        <div className="success-mini-summary">
          <h3 className="summary-section-title">ORDER SUMMARY</h3>
          
          <div className="summary-items-list">
            {orderData.cartItems.map((item, idx) => (
              <div key={`${item.product.name}-${idx}`} className="summary-item-row">
                <div className="summary-item-left">
                  <div className="summary-item-img-box">
                    <img src={item.product.image} alt="" />
                  </div>
                  <div className="summary-item-desc">
                    <span className="summary-item-name">{item.product.name}</span>
                    <div className="summary-item-meta">
                      <span className="meta-badge">{item.size}</span>
                      <span className="meta-badge-qty">({item.quantity})</span>
                    </div>
                  </div>
                </div>
                <span className="summary-item-price">${item.product.price * item.quantity}</span>
              </div>
            ))}
          </div>

          <div className="summary-total-footer">
            <div className="summary-footer-row">
              <span>SUBTOTAL</span>
              <span>${orderData.cartTotal}.00</span>
            </div>
            <div className="summary-footer-row">
              <span>SHIPPING</span>
              <span>FREE</span>
            </div>
            <div className="summary-footer-row total-row-highlight">
              <span>TOTAL</span>
              <span>${orderData.cartTotal}.00</span>
            </div>
          </div>
        </div>

        <div className="success-divider-line"></div>

        {/* Action Buttons */}
        <div className="success-action-buttons">
          <button 
            type="button" 
            className="action-btn-secondary"
            onClick={() => setShowReceiptModal(true)}
          >
            VIEW ORDER RECEIPT
          </button>
          
          <button 
            type="button" 
            className="action-btn-accent"
            onClick={handlePrint}
          >
            DOWNLOAD RECEIPT
          </button>

          <Link to="/collections" className="action-btn-primary">
            CONTINUE SHOPPING
          </Link>
        </div>
      </div>

      {/* Printable / Visual Invoice Receipt Modal */}
      {showReceiptModal && (
        <div className="receipt-modal-overlay" onClick={() => setShowReceiptModal(false)}>
          <div className="receipt-modal-box" onClick={(e) => e.stopPropagation()}>
            <div className="receipt-header-row">
              <div className="receipt-logo">XIV STORE</div>
              <button className="receipt-close-btn" onClick={() => setShowReceiptModal(false)}>✕</button>
            </div>

            <div className="receipt-bill-to">
              <div>
                <strong>BILL TO:</strong>
                <p>{orderData.customerName}</p>
                <p>{orderData.phone}</p>
                <p>{orderData.address}</p>
              </div>
              <div className="receipt-meta-details">
                <p><strong>ORDER ID:</strong> {orderData.orderId}</p>
                <p><strong>DATE:</strong> {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
                <p><strong>STATUS:</strong> PAID (RAZORPAY)</p>
              </div>
            </div>

            <table className="receipt-table">
              <thead>
                <tr>
                  <th>ITEM</th>
                  <th>QTY</th>
                  <th>PRICE</th>
                  <th>AMOUNT</th>
                </tr>
              </thead>
              <tbody>
                {orderData.cartItems.map((item, idx) => (
                  <tr key={idx}>
                    <td>
                      <div>{item.product.name}</div>
                      <small style={{ color: '#666' }}>SIZE: {item.size} / COLOR: {item.color}</small>
                    </td>
                    <td>{item.quantity}</td>
                    <td>${item.product.price}</td>
                    <td>${item.product.price * item.quantity}</td>
                  </tr>
                ))}
              </tbody>
            </table>

            <div className="receipt-totals">
              <div className="receipt-total-row">
                <span>SUBTOTAL:</span>
                <span>${orderData.cartTotal}.00</span>
              </div>
              <div className="receipt-total-row">
                <span>SHIPPING:</span>
                <span>FREE</span>
              </div>
              <div className="receipt-total-row final-amount">
                <span>TOTAL:</span>
                <span>${orderData.cartTotal}.00</span>
              </div>
            </div>

            <div className="receipt-footer-msg">
              <p>THANK YOU FOR SHOPPING WITH XIV STORE</p>
              <p>If you have any questions, contact us at info@xiv-store.com</p>
            </div>
            
            <div className="receipt-modal-actions-bar">
              <button className="receipt-action-btn" onClick={handlePrint}>PRINT RECEIPT</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
