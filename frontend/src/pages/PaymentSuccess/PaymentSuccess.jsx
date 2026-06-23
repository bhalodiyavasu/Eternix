import { useState } from 'react';
import { useLocation } from 'react-router-dom';
import { DEFAULT_ORDER_DATA } from '@/data/mockData';
import Button from '@/components/common/Button/Button';
import './PaymentSuccess.css';

export default function PaymentSuccess() {
  const location = useLocation();
  const [showReceiptModal, setShowReceiptModal] = useState(false);

  const orderData = location.state || DEFAULT_ORDER_DATA;

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
                <span className="summary-item-price">₹{(item.product.price * item.quantity).toFixed(2)}</span>
              </div>
            ))}
          </div>

          <div className="summary-total-footer">
            <div className="summary-footer-row">
              <span>SUBTOTAL</span>
              <span>₹{orderData.cartTotal.toFixed(2)}</span>
            </div>
            <div className="summary-footer-row">
              <span>SHIPPING</span>
              <span>FREE</span>
            </div>
            <div className="summary-footer-row total-row-highlight">
              <span>TOTAL</span>
              <span>₹{orderData.cartTotal.toFixed(2)}</span>
            </div>
          </div>
        </div>

        <div className="success-divider-line"></div>

        {/* Action Buttons */}
        <div className="success-action-buttons">
          <Button
            type="button" 
            variant="outline"
            className="success-view-receipt-btn"
            onClick={() => setShowReceiptModal(true)}
          >
            VIEW ORDER RECEIPT
          </Button>
          
          <Button
            type="button" 
            variant="solid"
            className="success-download-receipt-btn"
            onClick={handlePrint}
          >
            DOWNLOAD RECEIPT
          </Button>

          <Button
            to="/collections"
            variant="solid"
            className="success-continue-btn"
          >
            CONTINUE SHOPPING
          </Button>
        </div>
      </div>

      {/* Printable / Visual Invoice Receipt Modal */}
      <div className={`receipt-modal-overlay ${showReceiptModal ? 'active' : ''}`} onClick={() => setShowReceiptModal(false)}>
        <div className="receipt-modal-box" onClick={(e) => e.stopPropagation()}>
          <div className="receipt-header-row">
            <div className="receipt-logo">ETERNIX</div>
            <button className="receipt-close-btn" onClick={() => setShowReceiptModal(false)}>✕</button>
          </div>

          <div className="receipt-info-section">
            <div className="receipt-bill-to-left">
              <span className="bill-to-label">BILL TO</span>
              <div className="bill-to-info">
                <p className="customer-name">{orderData.customerName}</p>
                <p className="customer-phone">{orderData.phone}</p>
                <p className="customer-address">{orderData.address}</p>
              </div>
            </div>

            <div className="receipt-meta-details-right">
              <div className="meta-row">
                <span className="meta-label">ORDER ID</span>
                <span className="meta-value">{orderData.orderId}</span>
              </div>
              <div className="meta-row">
                <span className="meta-label">DATE</span>
                <span className="meta-value">{new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</span>
              </div>
              <div className="meta-row">
                <span className="meta-label">STATUS</span>
                <span className="meta-value">
                  PAID — <span className="receipt-razorpay-txt">RAZORPAY</span>
                </span>
              </div>
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
                    <small>SIZE: {item.size} / COLOR: {item.color}</small>
                  </td>
                  <td>{item.quantity}</td>
                  <td>₹{item.product.price.toFixed(2)}</td>
                  <td>₹{(item.product.price * item.quantity).toFixed(2)}</td>
                </tr>
              ))}
            </tbody>
          </table>

          <div className="receipt-totals">
            <div className="receipt-total-row">
              <span>SUBTOTAL:</span>
              <span>₹{orderData.cartTotal.toFixed(2)}</span>
            </div>
            <div className="receipt-total-row">
              <span>SHIPPING:</span>
              <span>FREE</span>
            </div>
            <div className="receipt-total-row final-amount">
              <span>TOTAL:</span>
              <span>₹{orderData.cartTotal.toFixed(2)}</span>
            </div>
          </div>

          <div className="receipt-footer-msg">
            <p>THANK YOU FOR SHOPPING WITH ETERNIX</p>
            <p>If you have any questions, contact us at info@eternix.com</p>
          </div>
          
          <div className="receipt-modal-actions-bar">
            <Button variant="solid" onClick={handlePrint}>PRINT RECEIPT</Button>
          </div>
        </div>
      </div>
    </div>
  );
}
