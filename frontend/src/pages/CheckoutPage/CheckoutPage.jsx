import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useToast } from '@/contexts/ToastContext';
import { ALL_PRODUCTS } from '@/data/products';
import './CheckoutPage.css';

export default function CheckoutPage() {
  const { showToast } = useToast();
  const navigate = useNavigate();

  // Active Tab state: 'info' or 'payment'
  const [activeTab, setActiveTab] = useState('info');

  // Local state for order items
  const [cartItems, setCartItems] = useState(() => {
    const item1 = ALL_PRODUCTS.find((p) => p.id === 4);
    const item2 = ALL_PRODUCTS.find((p) => p.id === 6);
    const item3 = ALL_PRODUCTS.find((p) => p.id === 7);

    return [
      { product: item1, size: 'M', color: 'beige', quantity: 1 },
      { product: item2, size: 'M', color: 'beige', quantity: 1 },
      { product: item3, size: '37', color: 'black', quantity: 1 },
    ].filter((item) => item.product !== undefined);
  });

  const cartTotal = cartItems.reduce(
    (total, item) => total + item.product.price * item.quantity,
    0
  );

  const cartCount = cartItems.reduce((total, item) => total + item.quantity, 0);

  const [formData, setFormData] = useState({
    email: '',
    phone: '',
    firstName: '',
    lastName: '',
    country: 'United States',
    state: '',
    address: '',
    city: '',
    zip: ''
  });

  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState('card');

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const isFormValid = () => {
    return (
      formData.email.trim() !== '' &&
      formData.phone.trim() !== '' &&
      formData.firstName.trim() !== '' &&
      formData.lastName.trim() !== '' &&
      formData.address.trim() !== '' &&
      formData.city.trim() !== '' &&
      formData.zip.trim() !== ''
    );
  };

  const handleContinueToPayment = (e) => {
    e.preventDefault();
    if (!isFormValid()) {
      showToast('warning', 'PLEASE FILL IN ALL REQUIRED DETAILS BEFORE PROCEEDING.');
      return;
    }
    setActiveTab('payment');
  };

  const handleCompletePayment = () => {
    // Generate a mock Order ID
    const mockId = 'XIV-' + Math.floor(100000 + Math.random() * 900000);
    
    showToast('success', 'ORDER PLACED SUCCESSFULLY!');
    
    // Redirect to separate payment success page, passing transaction metadata
    navigate('/payment-success', {
      state: {
        orderId: mockId,
        email: formData.email,
        customerName: `${formData.firstName} ${formData.lastName}`,
        phone: formData.phone,
        address: `${formData.address}, ${formData.city}, ${formData.state} - ${formData.zip}, ${formData.country}`,
        cartItems: cartItems,
        cartTotal: cartTotal
      }
    });
  };

  return (
    <div className="checkout-page-container">
      {/* Back Navigation Arrow - Custom long arrow matching image */}
      <div className="checkout-back-nav">
        <Link to="/cart" className="back-arrow-link-custom" aria-label="Back to bag">
          <svg width="48" height="16" viewBox="0 0 48 16" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M48 8H1M1 8L9 1M1 8L9 15" stroke="black" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </Link>
      </div>

      <h1 className="checkout-page-title-custom">CHECKOUT</h1>

      {cartItems.length === 0 ? (
        <div className="checkout-empty-view">
          <h2 className="checkout-empty-message">NO ITEMS IN BAG TO CHECKOUT.</h2>
          <Link to="/collections" className="checkout-empty-action">
            GO TO COLLECTIONS
          </Link>
        </div>
      ) : (
        <div className="checkout-layout">
          {/* Left Form: Tabbed panel matching design details */}
          <div className="checkout-form-section">
            {/* Tabs Header Navigation - Shipping Tab Removed */}
            <div className="checkout-tabs-header-custom">
              <button 
                type="button"
                className={`tab-nav-btn-custom ${activeTab === 'info' ? 'active' : ''}`}
                onClick={() => setActiveTab('info')}
              >
                INFORMATION
              </button>
              <button 
                type="button"
                className={`tab-nav-btn-custom ${activeTab === 'payment' ? 'active' : ''}`}
                onClick={() => setActiveTab('payment')}
                disabled={!isFormValid()}
              >
                PAYMENT
              </button>
            </div>

            {/* Information Tab View */}
            {activeTab === 'info' && (
              <form onSubmit={handleContinueToPayment} className="checkout-form-block-custom">
                <h3 className="form-section-title-custom">CONTACT INFO</h3>
                <div className="form-input-group-custom">
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    placeholder="Email"
                    required
                  />
                </div>
                <div className="form-input-group-custom">
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    placeholder="Phone"
                    required
                  />
                </div>

                <h3 className="form-section-title-custom shipping-title-custom">SHIPPING ADDRESS</h3>
                
                <div className="form-row-custom">
                  <div className="form-input-group-custom flex-1">
                    <input
                      type="text"
                      name="firstName"
                      value={formData.firstName}
                      onChange={handleInputChange}
                      placeholder="First Name"
                      required
                    />
                  </div>
                  <div className="form-input-group-custom flex-1">
                    <input
                      type="text"
                      name="lastName"
                      value={formData.lastName}
                      onChange={handleInputChange}
                      placeholder="Last Name"
                      required
                    />
                  </div>
                </div>

                <div className="form-input-group-custom select-wrapper-custom">
                  <select
                    name="country"
                    value={formData.country}
                    onChange={handleInputChange}
                    required
                  >
                    <option value="United States">United States</option>
                    <option value="Canada">Canada</option>
                    <option value="United Kingdom">United Kingdom</option>
                    <option value="India">India</option>
                  </select>
                  <span className="select-caret-custom"></span>
                </div>

                <div className="form-input-group-custom">
                  <input
                    type="text"
                    name="state"
                    value={formData.state}
                    onChange={handleInputChange}
                    placeholder="State / Region"
                    required
                  />
                </div>

                <div className="form-input-group-custom">
                  <input
                    type="text"
                    name="address"
                    value={formData.address}
                    onChange={handleInputChange}
                    placeholder="Address"
                    required
                  />
                </div>

                <div className="form-row-custom">
                  <div className="form-input-group-custom flex-1">
                    <input
                      type="text"
                      name="city"
                      value={formData.city}
                      onChange={handleInputChange}
                      placeholder="City"
                      required
                    />
                  </div>
                  <div className="form-input-group-custom flex-1">
                    <input
                      type="text"
                      name="zip"
                      value={formData.zip}
                      onChange={handleInputChange}
                      placeholder="Postal Code"
                      required
                    />
                  </div>
                </div>

                <div className="checkout-btn-row-custom">
                  <button type="submit" className="checkout-next-btn-custom">
                    <span>Payment</span>
                    <svg width="40" height="12" viewBox="0 0 40 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M0 6H39M39 6L33 1M39 6L33 11" stroke="black" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </button>
                </div>
              </form>
            )}

            {/* Payment Tab View */}
            {activeTab === 'payment' && (
              <div className="checkout-form-block-custom payment-tab-block-custom">
                <h3 className="form-section-title-custom">PAYMENT METHOD</h3>
                
                <div className="razorpay-payment-container-custom">
                  <div className="razorpay-logo-area-custom">
                    <span className="rp-badge-custom">SECURE</span>
                    <h4 className="rp-title-custom">RAZORPAY SECURE</h4>
                  </div>
                  <p className="razorpay-desc-custom">
                    Pay securely using credit cards, debit cards, UPI, netbanking, or wallets via Razorpay.
                  </p>
                  
                  <div className="razorpay-graphic-card-custom">
                    <div className="card-chip-custom"></div>
                    <div className="card-logo-custom">RAZORPAY</div>
                    <div className="card-number-custom">•••• •••• •••• XXXX</div>
                    <div className="card-holder-custom">{formData.firstName.toUpperCase()} {formData.lastName.toUpperCase()}</div>
                  </div>

                  <div className="checkout-btn-row-custom payment-btn-row-custom">
                    <button 
                      type="button" 
                      className="checkout-next-btn-custom payment-submit-btn-custom"
                      onClick={handleCompletePayment}
                    >
                      <span>Pay Now</span>
                      <svg width="48" height="16" viewBox="0 0 48 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M0 8H47M47 8L39 1M47 8L39 15" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Right Column: Sticky Order Summary info */}
          <div className="checkout-summary-section-custom">
            <div className="checkout-summary-card-custom">
              <div className="summary-card-header-custom">
                <h2 className="summary-card-title-custom">YOUR ORDER</h2>
                <div className="summary-card-count-custom">({cartCount})</div>
              </div>
              
              <div className="checkout-products-list-custom">
                {cartItems.map((item, idx) => (
                  <div key={`${item.product.id}-${item.size}-${item.color}-${idx}`} className="checkout-summary-item-custom">
                    <div className="item-thumbnail-wrapper-custom">
                      <img src={item.product.image} alt="" className="item-thumbnail-custom" />
                    </div>
                    <div className="checkout-item-details-col-custom">
                      <span className="checkout-item-name-custom">{item.product.name}</span>
                      
                      {/* Specs visually rendered (boxes & color swatch) */}
                      <div className="checkout-item-specs-row-custom">
                        <div className="checkout-spec-box-custom">{item.size}</div>
                        <div 
                          className="checkout-color-swatch-custom" 
                          style={{ 
                            backgroundColor: item.product.colors?.find(c => c.name.toLowerCase() === item.color.toLowerCase())?.hex || item.color 
                          }}
                        ></div>
                        {/* Blue highlighted quantity in brackets */}
                        <span className="checkout-qty-highlight-custom">
                          ({item.quantity})
                        </span>
                      </div>
                    </div>
                    <span className="item-price-custom">${item.product.price * item.quantity}</span>
                  </div>
                ))}
              </div>

              <div className="checkout-summary-divider-custom"></div>

              <div className="checkout-summary-row-custom">
                <span className="row-label-custom">Subtotal</span>
                <span className="row-value-custom">${cartTotal}.00</span>
              </div>
              <div className="checkout-summary-row-custom shipping-row-custom">
                <span className="row-label-custom">Shipping</span>
                <span className="row-value-custom shipping-subtxt-custom">Calculated at next step</span>
              </div>

              <div className="checkout-summary-divider-custom"></div>

              <div className="checkout-summary-row-custom checkout-total-row-custom">
                <span className="row-label-custom">Total</span>
                <span className="row-value-custom">${cartTotal}.00</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
