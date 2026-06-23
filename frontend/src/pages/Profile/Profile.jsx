import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/contexts/ToastContext';
import { ALL_PRODUCTS } from '@/data/mockData';
import Modal from '@/components/common/Modal/Modal';
import Button from '@/components/common/Button/Button';
import Input from '@/components/common/Form/Input';
import Textarea from '@/components/common/Form/Textarea';
import { useLogoutMutation } from '@/store/actions/authActions';
import './Profile.css';

// Mock order history populated from ALL_PRODUCTS
const MOCK_ORDERS = [
  {
    id: 'NIX-843910',
    date: '10 JUN 2026',
    status: 'DELIVERED',
    total: 235.00,
    shippingAddress: '104, Royal Palace, Ahmedabad, Gujarat - 380015, India',
    items: [
      { product: ALL_PRODUCTS[0], size: 'L', color: 'Charcoal', quantity: 1 },
      { product: ALL_PRODUCTS[1], size: 'M', color: 'Midnight Blue', quantity: 1 }
    ]
  },
  {
    id: 'NIX-329481',
    date: '24 MAY 2026',
    status: 'DELIVERED',
    total: 110.00,
    shippingAddress: '104, Royal Palace, Ahmedabad, Gujarat - 380015, India',
    items: [
      { product: ALL_PRODUCTS[2], size: 'M', color: 'Olive Green', quantity: 1 }
    ]
  }
];

export default function Profile() {
  const navigate = useNavigate();
  const { showToast } = useToast();
  const [logoutUser] = useLogoutMutation();

  const [activeTab, setActiveTab] = useState('details');
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [expandedOrder, setExpandedOrder] = useState(null);

  const [originalData, setOriginalData] = useState({
    username: 'vasubhalodiya',
    email: 'bhalodiyavasu@gmail.com',
    phone: '+91 9876543210',
    country: 'India',
    state: 'Gujarat',
    city: 'Ahmedabad',
    address: '104, Royal Palace',
    zip: '380015'
  });

  // Profile data state
  const [profileData, setProfileData] = useState({ ...originalData });

  const isSaveDisabled = 
    profileData.username === originalData.username &&
    profileData.email === originalData.email &&
    profileData.phone === originalData.phone &&
    profileData.address === originalData.address &&
    profileData.country === originalData.country &&
    profileData.state === originalData.state &&
    profileData.city === originalData.city &&
    profileData.zip === originalData.zip;

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setProfileData(prev => ({ ...prev, [name]: value }));
  };

  const handleSaveDetails = (e) => {
    e.preventDefault();
    setOriginalData({ ...profileData });
    showToast('success', 'DETAILS UPDATED SUCCESSFULLY.');
  };

  const handleLogout = async () => {
    setShowLogoutModal(false);
    try {
      await logoutUser().unwrap();
    } catch (error) {
      console.error('Logout API call failed:', error);
    }
    // Clear mock session
    localStorage.removeItem('userToken');
    showToast('success', 'LOGGED OUT SUCCESSFULLY.');
    navigate('/auth');
  };

  const toggleOrderExpand = (orderId) => {
    setExpandedOrder(prev => (prev === orderId ? null : orderId));
  };

  return (
    <div className="profile-page-container">
      {/* 2-Column Responsive Layout */}
      <div className="profile-layout">
        
        {/* Left column: Sidebar */}
        <aside className="profile-sidebar">
          {/* Top block: Square profile details card */}
          <div className="profile-card-square">
            <div className="profile-avatar-square">
              {profileData.username ? profileData.username.substring(0, 2).toUpperCase() : 'US'}
            </div>
            <h2 className="profile-name-text">
              {profileData.username}
            </h2>
            <p className="profile-email-text">{profileData.email}</p>
          </div>

          {/* Bottom block: Navigation list */}
          <nav className="profile-menu-nav">
            <button 
              className={`profile-menu-item ${activeTab === 'details' ? 'active' : ''}`}
              onClick={() => setActiveTab('details')}
            >
              MY DETAILS
            </button>
            <button 
              className={`profile-menu-item ${activeTab === 'orders' ? 'active' : ''}`}
              onClick={() => setActiveTab('orders')}
            >
              MY ORDERS
            </button>
            <button 
              className="profile-menu-item"
              onClick={() => navigate('/admin')}
            >
              ADMIN
            </button>
            <button 
              className="profile-menu-item logout-menu-btn"
              onClick={() => setShowLogoutModal(true)}
            >
              LOGOUT
            </button>
          </nav>
        </aside>

        {/* Right column: Main panel content */}
        <main className="profile-content-panel">
          {/* Breadcrumbs */}
          <div className="profile-breadcrumb-bar">
            <span className="bc-home-link" onClick={() => navigate('/')}>HOME</span>
            <span className="bc-slash">/</span>
            <span className="bc-current-tab">
              {activeTab === 'details' ? 'MY DETAILS' : 'MY ORDERS'}
            </span>
          </div>

          <div className="profile-section-header-row">
            <h1 className="profile-section-title">
              {activeTab === 'details' ? 'ACCOUNT INFO' : 'ORDER HISTORY'}
            </h1>

            {activeTab === 'details' && (
              <Button 
                type="submit" 
                form="profile-details-form" 
                variant="solid" 
                disabled={isSaveDisabled}
              >
                SAVE DETAILS
              </Button>
            )}
          </div>

          <div className="profile-panel-card">

            {/* DETAILS TAB PANEL */}
            {activeTab === 'details' && (
              <form onSubmit={handleSaveDetails} id="profile-details-form" className="profile-details-form">
                <div className="details-fields-grid">
                  <Input
                    label="Username"
                    name="username"
                    value={profileData.username}
                    disabled={true}
                    required
                  />

                  <Input
                    label="Email Address"
                    type="email"
                    name="email"
                    value={profileData.email}
                    disabled={true}
                    required
                  />

                  <Input
                    label="Phone Number"
                    type="tel"
                    name="phone"
                    value={profileData.phone}
                    onChange={handleInputChange}
                    required
                    className="flex-full-width"
                  />

                  <Textarea
                    label="Shipping Address"
                    name="address"
                    value={profileData.address}
                    onChange={handleInputChange}
                    required
                    rows={3}
                    className="flex-full-width"
                  />

                  <Input
                    label="Country"
                    name="country"
                    value={profileData.country}
                    onChange={handleInputChange}
                    required
                  />

                  <Input
                    label="State"
                    name="state"
                    value={profileData.state}
                    onChange={handleInputChange}
                    required
                  />

                  <Input
                    label="City"
                    name="city"
                    value={profileData.city}
                    onChange={handleInputChange}
                    required
                  />

                  <Input
                    label="Postal Code"
                    name="zip"
                    value={profileData.zip}
                    onChange={handleInputChange}
                    required
                  />
                </div>
              </form>
            )}

            {/* ORDERS TAB PANEL */}
            {activeTab === 'orders' && (
              <div className="profile-orders-list">
                {MOCK_ORDERS.length === 0 ? (
                  <div className="empty-orders-view">
                    <p className="empty-orders-text">YOU HAVE NOT PLACED ANY ORDERS YET.</p>
                  </div>
                ) : (
                  MOCK_ORDERS.map(order => (
                    <div key={order.id} className={`order-history-card ${expandedOrder === order.id ? 'expanded' : ''}`}>
                      <div className="order-summary-row" onClick={() => toggleOrderExpand(order.id)}>
                        <div className="order-summary-col">
                          <span className="order-col-lbl">ORDER ID</span>
                          <span className="order-col-val">{order.id}</span>
                        </div>
                        
                        <div className="order-summary-col">
                          <span className="order-col-lbl">DATE</span>
                          <span className="order-col-val">{order.date}</span>
                        </div>

                        <div className="order-summary-col">
                          <span className="order-col-lbl">TOTAL</span>
                          <span className="order-col-val">₹{order.total.toFixed(2)}</span>
                        </div>

                        <div className="order-summary-col">
                          <span className="order-col-lbl">STATUS</span>
                          <span className="order-status-badge">{order.status}</span>
                        </div>

                        <div className="order-toggle-arrow">
                          <svg width="12" height="8" viewBox="0 0 12 8" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M1 1.5L6 6.5L11 1.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                          </svg>
                        </div>
                      </div>

                      {expandedOrder === order.id && (
                        <div className="order-expanded-details">
                          <div className="order-details-divider"></div>
                          
                          <h4 className="expanded-details-title">ORDERED ITEMS</h4>
                          <div className="order-items-grid">
                            {order.items.map((item, idx) => (
                              <div key={`${item.product.id}-${idx}`} className="order-item-detail-row">
                                <div className="order-item-thumb-wrapper">
                                  <img src={item.product.image} alt="" className="order-item-thumb" />
                                </div>
                                <div className="order-item-text-info">
                                  <span className="order-item-tag">{item.product.tag}</span>
                                  <h5 className="order-item-name">{item.product.name}</h5>
                                  <div className="order-item-specs">
                                    <span>SIZE: <strong>{item.size}</strong></span>
                                    <span className="bullet-dot">•</span>
                                    <span>COLOR: <strong>{item.color}</strong></span>
                                  </div>
                                </div>
                                <div className="order-item-math">
                                  <span className="order-item-qty">QTY: {item.quantity}</span>
                                  <span className="order-item-subtotal">₹{(item.product.price * item.quantity).toFixed(2)}</span>
                                </div>
                              </div>
                            ))}
                          </div>

                          <div className="order-details-divider"></div>
                          
                          <div className="order-footer-details">
                            <div className="order-shipping-summary">
                              <h4 className="expanded-details-title">SHIPPING ADDRESS</h4>
                              <p className="shipping-address-txt">{order.shippingAddress}</p>
                            </div>
                            <div className="order-actions-summary">
                              <Button
                                variant="solid"
                                onClick={() => showToast('success', 'INVOICE DOWNLOAD STARTED.')}
                              >
                                DOWNLOAD INVOICE
                              </Button>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  ))
                )}
              </div>
            )}

          </div>
        </main>

      </div>

      {/* LOGOUT CONFIRMATION DIALOG MODAL */}
      {showLogoutModal && (
        <Modal title="CONFIRM LOGOUT" onClose={() => setShowLogoutModal(false)}>
          <div className="logout-confirm-dialog">
            <p className="dialog-message">ARE YOU SURE YOU WANT TO LOG OUT OF YOUR ACCOUNT?</p>
            
            <div className="dialog-actions-row">
              <Button
                type="button" 
                variant="outline"
                onClick={() => setShowLogoutModal(false)}
              >
                CANCEL
              </Button>
              <Button
                type="button" 
                variant="destructive"
                onClick={handleLogout}
              >
                LOGOUT
              </Button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}
