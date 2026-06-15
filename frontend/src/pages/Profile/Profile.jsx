import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/contexts/ToastContext';
import { ALL_PRODUCTS } from '@/data/mockData';
import Modal from '@/components/common/Modal/Modal';
import Button from '@/components/common/Button/Button';
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

  const [activeTab, setActiveTab] = useState('details');
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [expandedOrder, setExpandedOrder] = useState(null);

  // Profile data state
  const [profileData, setProfileData] = useState({
    firstName: 'Vasu',
    lastName: 'Bhalodiya',
    email: 'vasubhalodiya@gmail.com',
    phone: '+91 98765 43210',
    country: 'India',
    state: 'Gujarat',
    city: 'Ahmedabad',
    address: '104, Royal Palace',
    zip: '380015'
  });

  const [isEditing, setIsEditing] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setProfileData(prev => ({ ...prev, [name]: value }));
  };

  const handleSaveDetails = (e) => {
    e.preventDefault();
    setIsEditing(false);
    showToast('success', 'DETAILS UPDATED SUCCESSFULLY.');
  };

  const handleLogout = () => {
    setShowLogoutModal(false);
    // Clear mock session
    localStorage.removeItem('nix_user_session');
    showToast('success', 'LOGGED OUT SUCCESSFULLY.');
    navigate('/login');
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
              {profileData.firstName[0]}
              {profileData.lastName[0]}
            </div>
            <h2 className="profile-name-text">
              {profileData.firstName} {profileData.lastName}
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
              !isEditing ? (
                <Button
                  type="button" 
                  variant="solid"
                  onClick={() => setIsEditing(true)}
                >
                  EDIT DETAILS
                </Button>
              ) : (
                <Button type="submit" form="profile-details-form" variant="solid" className="save-btn">
                  SAVE DETAILS
                </Button>
              )
            )}
          </div>

          <div className="profile-panel-card">

            {/* DETAILS TAB PANEL */}
            {activeTab === 'details' && (
              <form onSubmit={handleSaveDetails} id="profile-details-form" className="profile-details-form">
                <div className="details-fields-grid">
                  <div className="form-input-group-custom">
                    <label className="input-label-custom">First Name</label>
                    <input 
                      type="text" 
                      name="firstName" 
                      value={profileData.firstName} 
                      onChange={handleInputChange} 
                      disabled={!isEditing} 
                      required 
                    />
                  </div>

                  <div className="form-input-group-custom">
                    <label className="input-label-custom">Last Name</label>
                    <input 
                      type="text" 
                      name="lastName" 
                      value={profileData.lastName} 
                      onChange={handleInputChange} 
                      disabled={!isEditing} 
                      required 
                    />
                  </div>

                  <div className="form-input-group-custom flex-full-width">
                    <label className="input-label-custom">Email Address</label>
                    <input 
                      type="email" 
                      name="email" 
                      value={profileData.email} 
                      disabled={true} 
                      required 
                    />
                  </div>

                  <div className="form-input-group-custom flex-full-width">
                    <label className="input-label-custom">Phone Number</label>
                    <input 
                      type="tel" 
                      name="phone" 
                      value={profileData.phone} 
                      onChange={handleInputChange} 
                      disabled={!isEditing} 
                      required 
                    />
                  </div>

                  <div className="form-input-group-custom flex-full-width">
                    <label className="input-label-custom">Shipping Address</label>
                    <input 
                      type="text" 
                      name="address" 
                      value={profileData.address} 
                      onChange={handleInputChange} 
                      disabled={!isEditing} 
                      required 
                    />
                  </div>

                  <div className="form-input-group-custom">
                    <label className="input-label-custom">City</label>
                    <input 
                      type="text" 
                      name="city" 
                      value={profileData.city} 
                      onChange={handleInputChange} 
                      disabled={!isEditing} 
                      required 
                    />
                  </div>

                  <div className="form-input-group-custom">
                    <label className="input-label-custom">Postal Code</label>
                    <input 
                      type="text" 
                      name="zip" 
                      value={profileData.zip} 
                      onChange={handleInputChange} 
                      disabled={!isEditing} 
                      required 
                    />
                  </div>
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
                          <span className="order-col-val">${order.total}.00</span>
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
                                  <span className="order-item-subtotal">${item.product.price * item.quantity}.00</span>
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
