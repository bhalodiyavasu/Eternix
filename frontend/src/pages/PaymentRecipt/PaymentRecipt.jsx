import { useSearchParams, Link, Navigate } from 'react-router-dom';
import { useVerifySessionQuery } from '@/store/actions/paymentActions';
import Button from '@/components/common/Button/Button';
import Loader from '@/components/common/Loader/Loader';
import './PaymentRecipt.css';

export default function PaymentRecipt() {
  const [searchParams] = useSearchParams();
  const sessionId = searchParams.get('session_id');

  const { data, isLoading, isError } = useVerifySessionQuery(sessionId, { skip: !sessionId });

  const handleDownloadReceipt = async () => {
    if (!data?.order) return;
    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/orders/${data.order._id}/receipt`,
        { credentials: 'include' }
      );
      if (!response.ok) throw new Error('Failed');
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `Eternix_Receipt_${(data.order.orderNumber || data.order._id).toUpperCase()}.pdf`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(url);
    } catch {
      alert('Failed to download receipt. Please try again.');
    }
  };

  if (!sessionId || isError) {
    return <Navigate to="/" replace />;
  }

  if (isLoading || !data || !data.order) {
    return (
      <div className="success-page-container success-loading-view">
        <Loader />
      </div>
    );
  }

  const order = data.order;
  const contactInfo = order.contactInfo;
  const shippingInfo = order.shippingInfo;
  const address = `${shippingInfo.address}, ${shippingInfo.city}, ${shippingInfo.state} - ${shippingInfo.postalCode}, ${shippingInfo.country}`;

  return (
    <div className="success-page-container">
      <div className="success-noise"></div>

      <div className="success-content-card">
        <div className="success-icon-wrapper">
          <svg width="48" height="48" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
            <circle cx="24" cy="24" r="24" fill="#10b981" />
            <path d="M15 24.5L21 30.5L33 18" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </div>

        <span className="success-badge">ORDER CONFIRMED</span>
        <h1 className="success-main-title">THANK YOU FOR YOUR PURCHASE</h1>

        <p className="success-main-desc">
          Your order has been received and is currently processing. A confirmation receipt with details has been sent to <strong>{contactInfo.email}</strong>.
        </p>

        <div className="success-details-grid">
          <div className="success-detail-box">
            <span className="detail-lbl">ORDER NUMBER</span>
            <span className="detail-val accent-order-id">{(order.orderNumber || order._id).toUpperCase()}</span>
          </div>
          {order.paymentId && (
            <div className="success-detail-box">
              <span className="detail-lbl">PAYMENT ID</span>
              <span className="detail-val" style={{ fontFamily: 'monospace', wordBreak: 'break-all' }}>{order.paymentId}</span>
            </div>
          )}
          <div className="success-detail-box">
            <span className="detail-lbl">EMAIL ADDRESS</span>
            <span className="detail-val">{contactInfo.email}</span>
          </div>
          <div className="success-detail-box">
            <span className="detail-lbl">CONTACT PHONE</span>
            <span className="detail-val">{contactInfo.phone}</span>
          </div>
          <div className="success-detail-box">
            <span className="detail-lbl">DELIVERY ADDRESS</span>
            <span className="detail-val address-txt">{address}</span>
          </div>
        </div>

        <div className="success-divider-line"></div>

        <div className="success-mini-summary">
          <h3 className="summary-section-title">ORDER SUMMARY</h3>

          <div className="summary-items-list">
            {order.items.map((item, idx) => (
              <div key={`${item.product._id}-${idx}`} className="summary-item-row">
                <div className="summary-item-left">
                  <div className="summary-item-img-box">
                    <img src={item.product.image} alt="" />
                  </div>
                  <div className="summary-item-desc">
                    <span className="summary-item-name">{item.product.name}</span>
                    <div className="summary-item-meta">
                      <span className="meta-badge">{item.size}</span>
                      {item.color && (
                        <span 
                          className="meta-color-box" 
                          style={{ backgroundColor: item.color.hex || item.color }} 
                          title={item.color.name || item.color}
                        />
                      )}
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
              <span>₹{order.subtotal.toFixed(2)}</span>
            </div>
            <div className="summary-footer-row">
              <span>SHIPPING</span>
              <span>{order.shippingCharge > 0 ? `₹${order.shippingCharge.toFixed(2)}` : 'FREE'}</span>
            </div>
            <div className="summary-footer-row total-row-highlight">
              <span>TOTAL</span>
              <span>₹{order.totalAmount.toFixed(2)}</span>
            </div>
          </div>
        </div>

        <div className="success-divider-line"></div>

        <div className="success-action-buttons">
          <Button type="button" variant="solid" className="success-download-receipt-btn" onClick={handleDownloadReceipt}>
            DOWNLOAD RECEIPT
          </Button>
          <Button to="/collections" variant="solid">
            CONTINUE SHOPPING
          </Button>
        </div>
      </div>
    </div>
  );
}
