import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useToast } from '@/contexts/ToastContext';
import { getCartItemsWithProducts } from '@/data/mockData';
import Button from '@/components/common/Button/Button';
import Input from '@/components/common/Form/Input';
import Select from '@/components/common/Form/Select';
import './Checkout.css';

export default function Checkout() {
  const { showToast } = useToast();
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState('info');
  const [cartItems] = useState(getCartItemsWithProducts);

  const cartTotal = cartItems.reduce((total, item) => total + item.product.price * item.quantity, 0);
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

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
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
    const mockId = 'NIX-' + Math.floor(100000 + Math.random() * 900000);

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
      {/* Back Navigation Arrow */}
      <div className="checkout-back-nav">
        <Link to="/cart" className="back-arrow-link-custom" aria-label="Back to cart">
          <svg width="48" height="16" viewBox="0 0 48 16" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M48 8H1M1 8L9 1M1 8L9 15" stroke="black" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </Link>
      </div>

      <h1 className="checkout-page-title-custom">CHECKOUT</h1>

      {cartItems.length === 0 ? (
        <div className="checkout-empty-view">
          <h2 className="checkout-empty-message">NO ITEMS IN CART TO CHECKOUT.</h2>
          <Link to="/collections" className="checkout-empty-action">
            GO TO COLLECTIONS
          </Link>
        </div>
      ) : (
        <div className="checkout-layout">
          {/* Left Form: Tabbed panel */}
          <div className="checkout-form-section">
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
                <Input 
                  type="email" 
                  name="email" 
                  value={formData.email} 
                  onChange={handleInputChange} 
                  placeholder="Email" 
                  required 
                />
                <Input 
                  type="tel" 
                  name="phone" 
                  value={formData.phone} 
                  onChange={handleInputChange} 
                  placeholder="Phone" 
                  required 
                />

                <h3 className="form-section-title-custom shipping-title-custom">SHIPPING ADDRESS</h3>

                <div className="form-row-custom">
                  <Input 
                    name="firstName" 
                    value={formData.firstName} 
                    onChange={handleInputChange} 
                    placeholder="First Name" 
                    required 
                    className="flex-1"
                  />
                  <Input 
                    name="lastName" 
                    value={formData.lastName} 
                    onChange={handleInputChange} 
                    placeholder="Last Name" 
                    required 
                    className="flex-1"
                  />
                </div>

                <Select 
                  name="country" 
                  value={formData.country} 
                  onChange={handleInputChange} 
                  options={[
                    { value: 'United States', label: 'United States' },
                    { value: 'Canada', label: 'Canada' },
                    { value: 'United Kingdom', label: 'United Kingdom' },
                    { value: 'India', label: 'India' }
                  ]}
                />

                <Input 
                  name="state" 
                  value={formData.state} 
                  onChange={handleInputChange} 
                  placeholder="State / Region" 
                  required 
                />

                <Input 
                  name="address" 
                  value={formData.address} 
                  onChange={handleInputChange} 
                  placeholder="Address" 
                  required 
                />

                <div className="form-row-custom">
                  <Input 
                    name="city" 
                    value={formData.city} 
                    onChange={handleInputChange} 
                    placeholder="City" 
                    required 
                    className="flex-1"
                  />
                  <Input 
                    name="zip" 
                    value={formData.zip} 
                    onChange={handleInputChange} 
                    placeholder="Postal Code" 
                    required 
                    className="flex-1"
                  />
                </div>

                <div className="checkout-btn-row-custom">
                  <Button type="submit" variant="solid" layout="split">
                    <span>Payment</span>
                    <svg width="48" height="16" viewBox="0 0 48 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M0 8H47M47 8L39 1M47 8L39 15" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </Button>
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
                    <Button
                      type="button"
                      variant="solid"
                      layout="split"
                      onClick={handleCompletePayment}
                    >
                      <span>Pay Now</span>
                      <svg width="48" height="16" viewBox="0 0 48 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M0 8H47M47 8L39 1M47 8L39 15" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    </Button>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Right Column: Sticky Order Summary */}
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
                      <div className="checkout-item-specs-row-custom">
                        <div className="checkout-spec-box-custom">{item.size}</div>
                        <div
                          className="checkout-color-swatch-custom"
                          style={{
                            backgroundColor: item.product.colors?.find(c => c.name.toLowerCase() === item.color.toLowerCase())?.hex || item.color
                          }}
                        ></div>
                        <span className="checkout-qty-highlight-custom">
                          ({item.quantity})
                        </span>
                      </div>
                    </div>
                    <span className="item-price-custom">₹{(item.product.price * item.quantity).toFixed(2)}</span>
                  </div>
                ))}
              </div>

              <div className="checkout-summary-divider-custom"></div>

              <div className="checkout-summary-row-custom">
                <span className="row-label-custom">Subtotal</span>
                <span className="row-value-custom">₹{cartTotal.toFixed(2)}</span>
              </div>
              <div className="checkout-summary-row-custom shipping-row-custom">
                <span className="row-label-custom">Shipping</span>
                <span className="row-value-custom shipping-subtxt-custom">Calculated at next step</span>
              </div>

              <div className="checkout-summary-divider-custom"></div>

              <div className="checkout-summary-row-custom checkout-total-row-custom">
                <span className="row-label-custom">Total</span>
                <span className="row-value-custom">₹{cartTotal.toFixed(2)}</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
