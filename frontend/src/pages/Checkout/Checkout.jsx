import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useToast } from '@/contexts/ToastContext';
import Button from '@/components/common/Button/Button';
import Input from '@/components/common/Form/Input';
import Textarea from '@/components/common/Form/Textarea';
import Loader from '@/components/common/Loader/Loader';
import { useGetCartQuery } from '@/store/actions/cartActions';
import { useGetProfileQuery, useCreateOrderMutation } from '@/store/actions/userActions';
import './Checkout.css';

export default function Checkout() {
  const { showToast } = useToast();
  const navigate = useNavigate();

  const { data, isLoading, isFetching } = useGetCartQuery();
  const { data: profileData } = useGetProfileQuery();
  const [createOrder] = useCreateOrderMutation();

  const cartItems = data?.cart?.items || [];
  const subtotal = data?.subtotal ?? data?.cart?.subtotal ?? 0;
  const cartTotal = data?.cartTotal ?? data?.cart?.cartTotal ?? 0;
  const cartCount = cartItems.reduce((total, item) => total + (item.quantity || 0), 0);

  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    country: '',
    state: '',
    address: '',
    city: '',
    postalCode: ''
  });

  useEffect(() => {
    const sa = profileData?.user?.shippingAddress;
    if (sa) {
      setFormData(prev => ({
        ...prev,
        country: sa.country || '',
        state: sa.state || '',
        city: sa.city || '',
        postalCode: sa.postalCode || '',
        address: sa.address || '',
      }));
    }
  }, [profileData]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const isFormValid = () => {
    return (
      formData.fullName.trim() !== '' &&
      formData.email.trim() !== '' &&
      formData.phone.trim() !== '' &&
      formData.address.trim() !== '' &&
      formData.city.trim() !== '' &&
      formData.postalCode.trim() !== ''
    );
  };

  const handleCompletePayment = async () => {
    try {
      const result = await createOrder({
        contactInfo: {
          fullName: formData.fullName,
          phone: formData.phone,
          email: formData.email,
        },
        shippingInfo: {
          country: formData.country,
          state: formData.state,
          city: formData.city,
          postalCode: formData.postalCode,
          address: formData.address,
        },
      }).unwrap();

      navigate('/payment-success', {
        state: {
          orderId: result.order._id,
          email: formData.email,
          customerName: formData.fullName,
          phone: formData.phone,
          address: `${formData.address}, ${formData.city}, ${formData.state} - ${formData.postalCode}, ${formData.country}`,
          cartItems,
          cartTotal,
        },
      });
    } catch (err) {
      showToast('error', err?.data?.message || 'ORDER PLACEMENT FAILED. PLEASE TRY AGAIN.');
    }
  };

  if (isLoading) {
    return (
      <div className="checkout-page-container" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh' }}>
        <Loader />
      </div>
    );
  }

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
          {/* Left Form */}
          <div className="checkout-form-section">
            <form onSubmit={(e) => { e.preventDefault(); if (!isFormValid()) { showToast('warning', 'PLEASE FILL IN ALL REQUIRED DETAILS BEFORE PROCEEDING.'); return; } handleCompletePayment(); }} className="checkout-form-block-custom">
                <h3 className="form-section-title-custom">CONTACT INFO</h3>
                <div className="form-row-custom">
                  <Input 
                    name="fullName" 
                    value={formData.fullName} 
                    onChange={handleInputChange} 
                    placeholder="Full Name" 
                    required 
                    className="flex-1"
                  />
                  <Input 
                    type="tel" 
                    name="phone" 
                    value={formData.phone} 
                    onChange={handleInputChange} 
                    placeholder="Phone" 
                    required 
                    className="flex-1"
                  />
                </div>
                <Input 
                  type="email" 
                  name="email" 
                  value={formData.email} 
                  onChange={handleInputChange} 
                  placeholder="Email" 
                  required 
                />

                <h3 className="form-section-title-custom shipping-title-custom">SHIPPING INFORMATION</h3>

                <div className="form-row-custom">
                  <Input 
                    name="country" 
                    value={formData.country} 
                    onChange={handleInputChange} 
                    placeholder="Country" 
                    required 
                    className="flex-1"
                  />
                  <Input 
                    name="state" 
                    value={formData.state} 
                    onChange={handleInputChange} 
                    placeholder="State" 
                    required 
                    className="flex-1"
                  />
                </div>

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
                    name="postalCode"
                    value={formData.postalCode} 
                    onChange={handleInputChange} 
                    placeholder="Postal Code" 
                    required 
                    className="flex-1"
                  />
                </div>

                <Textarea 
                  name="address" 
                  value={formData.address} 
                  onChange={handleInputChange} 
                  placeholder="Shipping Address" 
                  required 
                />

                <div className="checkout-btn-row-custom">
                  <Button type="submit" variant="solid" layout="split">
                    <span>Pay Now</span>
                    <svg width="48" height="16" viewBox="0 0 48 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M0 8H47M47 8L39 1M47 8L39 15" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </Button>
                </div>
              </form>
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
                  <div key={`${item.product?._id || item.product?.id}-${item.size}-${item.color?.name || item.color}-${idx}`} className="checkout-summary-item-custom">
                    <div className="item-thumbnail-wrapper-custom">
                      <img src={item.product?.image} alt="" className="item-thumbnail-custom" />
                    </div>
                    <div className="checkout-item-details-col-custom">
                      <span className="checkout-item-name-custom">{item.product?.name}</span>
                      <div className="checkout-item-specs-row-custom">
                        <div className="checkout-spec-box-custom">{item.size}</div>
                        <div
                          className="checkout-color-swatch-custom"
                          style={{
                            backgroundColor: item.color?.hex || item.product?.colors?.find(c => c.name.toLowerCase() === (item.color?.name || item.color || '').toLowerCase())?.hex || item.color
                          }}
                        ></div>
                        <span className="checkout-qty-highlight-custom">
                          ({item.quantity})
                        </span>
                      </div>
                    </div>
                    <span className="item-price-custom">₹{((item.product?.price || 0) * item.quantity).toFixed(2)}</span>
                  </div>
                ))}
              </div>

              <div className="checkout-summary-divider-custom"></div>

              <div className="checkout-summary-row-custom">
                <span className="row-label-custom">Subtotal</span>
                <span className="row-value-custom">
                  {isFetching ? <span className="shimmer-skeleton"></span> : `₹${subtotal.toFixed(2)}`}
                </span>
              </div>
              <div className="checkout-summary-row-custom shipping-row-custom">
                <span className="row-label-custom">Shipping</span>
                <span className="row-value-custom shipping-subtxt-custom">Calculated at next step</span>
              </div>

              <div className="checkout-summary-divider-custom"></div>

              <div className="checkout-summary-row-custom checkout-total-row-custom">
                <span className="row-label-custom">Total</span>
                <span className="row-value-custom">
                  {isFetching ? <span className="shimmer-skeleton"></span> : `₹${cartTotal.toFixed(2)}`}
                </span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
