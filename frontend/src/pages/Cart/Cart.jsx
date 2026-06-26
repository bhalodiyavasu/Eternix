import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useGetCartQuery, useUpdateCartItemMutation, useRemoveFromCartMutation } from '@/store/actions/cartActions';
import { getItems, removeItem, updateItem, subscribe } from '@/utils/guestCart';
import Button from '@/components/common/Button/Button';
import Loader from '@/components/common/Loader/Loader';
import minusIcon from '@/assets/icons/minus.svg';
import plusIcon from '@/assets/icons/plus.svg';
import './Cart.css';

export default function Cart() {
  const navigate = useNavigate();
  const isLoggedIn = !!localStorage.getItem('userToken');
  const { data, isLoading, isFetching, refetch } = useGetCartQuery(undefined, { skip: !isLoggedIn });
  const [updateCartItem] = useUpdateCartItemMutation();
  const [removeCartItem] = useRemoveFromCartMutation();
  const [cartItems, setCartItems] = useState([]);

  useEffect(() => {
    if (isLoggedIn) {
      setCartItems(data?.items || []);
    } else {
      setCartItems(getItems());
    }
  }, [data, isLoggedIn]);

  useEffect(() => {
    if (isLoggedIn) return;
    return subscribe(() => setCartItems(getItems()));
  }, [isLoggedIn]);

  const removeFromCart = async (productId, size, color) => {
    const colorName = typeof color === 'object' ? color.name : color;

    if (!isLoggedIn) { removeItem(productId, size, colorName); return; }

    const targetItem = cartItems.find(item => {
      if (!item.product) return false;
      const itemProductId = item.product._id || item.product.id;
      const itemColorName = typeof item.color === 'object' ? item.color.name : item.color;
      return itemProductId === productId && item.size === size && itemColorName === colorName;
    });

    if (!targetItem) return;

    // Optimistic update locally
    setCartItems(prev =>
      prev.filter(item => {
        if (!item.product) return false;
        const itemProductId = item.product._id || item.product.id;
        const itemColorName = typeof item.color === 'object' ? item.color.name : item.color;
        return !(itemProductId === productId && item.size === size && itemColorName === colorName);
      })
    );

    try {
      const colorHex = typeof color === 'object' ? color.hex : (targetItem.product.colors?.find(c => c.name.toLowerCase() === color.toLowerCase())?.hex || color);
      const colorObj = { name: colorName, hex: colorHex };

      await removeCartItem({
        productId,
        size,
        color: colorObj
      }).unwrap();
      refetch();
    } catch (err) {
      console.error("Failed to remove item from cart in backend:", err);
      // Revert if API call fails
      const items = data?.items;
      if (items) {
        setCartItems(items);
      }
    }
  };

  const updateQuantity = async (productId, size, color, delta) => {
    const colorName = typeof color === 'object' ? color.name : color;

    if (!isLoggedIn) {
      const newQty = (cartItems.find(i => i.product._id === productId && i.size === size && (typeof i.color === 'object' ? i.color.name : i.color) === colorName)?.quantity || 0) + delta;
      if (newQty >= 1) updateItem(productId, size, colorName, newQty);
      return;
    }

    const targetItem = cartItems.find(item => {
      if (!item.product) return false;
      const itemProductId = item.product._id || item.product.id;
      const itemColorName = typeof item.color === 'object' ? item.color.name : item.color;
      return itemProductId === productId && item.size === size && itemColorName === colorName;
    });

    if (!targetItem) return;
    const newQty = targetItem.quantity + delta;
    if (newQty < 1) return;

    // Update locally first for instantaneous feel
    setCartItems(prev =>
      prev.map(item => {
        if (!item.product) return item;
        const itemProductId = item.product._id || item.product.id;
        const itemColorName = typeof item.color === 'object' ? item.color.name : item.color;
        if (itemProductId === productId && item.size === size && itemColorName === colorName) {
          return { ...item, quantity: newQty };
        }
        return item;
      })
    );

    try {
      // Find the hex color from colors list or fallback
      const colorHex = typeof color === 'object' ? color.hex : (targetItem.product.colors?.find(c => c.name.toLowerCase() === color.toLowerCase())?.hex || color);
      const colorObj = { name: colorName, hex: colorHex };

      await updateCartItem({
        productId,
        quantity: newQty,
        size,
        color: colorObj
      }).unwrap();
      refetch();
    } catch (err) {
      console.error("Failed to update cart quantity in backend:", err);
      // Revert local state to query data state
      const items = data?.items;
      if (items) {
        setCartItems(items);
      }
    }
  };

  const handleContinue = () => {
    if (!isLoggedIn) {
      navigate('/auth', { state: { from: '/cart' } });
      return;
    }
    navigate('/checkout', { state: { fromCart: true } });
  };

  const cartCount = cartItems.reduce((total, item) => total + (item.quantity || 0), 0);
  const subtotal = isLoggedIn
    ? (data?.subtotal ?? 0)
    : cartItems.reduce((t, i) => t + (i.product?.price || 0) * (i.quantity || 0), 0);
  const cartTotal = isLoggedIn ? (data?.cartTotal ?? 0) : subtotal;

  if (isLoading) {
    return (
      <div className="cart-page-container" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh' }}>
        <Loader />
      </div>
    );
  }

  return (
    <div className="cart-page-container">
      {/* Breadcrumb navigation */}
      <div className="breadcrumb">
        <Link to="/" className="breadcrumb-link">HOME</Link>
        <span className="breadcrumb-separator">/</span>
        <span className="breadcrumb-current">CART</span>
      </div>

      <h1 className="cart-page-title">
        CART <span className="cart-page-count">({cartCount})</span>
      </h1>

      <div className="cart-layout">
        {cartItems.length === 0 ? (
          <div className="empty-cart-view">
            <h2 className="empty-cart-message">NO PRODUCT ADDED IN CART</h2>
            <Button variant="outline" to="/collections">
              ADD PRODUCT
            </Button>
          </div>
        ) : (
          <>
            {/* Left Scrollable Product List */}
            <div className="cart-products-list">
              <div className="cart-table-header">
                <span className="header-product">PRODUCT</span>
                <span className="header-quantity">QUANTITY</span>
                <span className="header-total">TOTAL</span>
              </div>

              {cartItems.map((item, idx) => {
                if (!item.product) return null;
                const itemTotal = (item.product.price || 0) * (item.quantity || 0);
                const colorName = typeof item.color === 'object' ? item.color.name : item.color;
                const colorHex = typeof item.color === 'object' ? item.color.hex : (item.product.colors?.find(c => c.name.toLowerCase() === item.color.toLowerCase())?.hex || item.color);
                const itemProductId = item.product._id || item.product.id;

                return (
                  <div key={`${itemProductId}-${item.size}-${colorName}-${idx}`} className="cart-item-row">
                    {/* Product Image and Details */}
                    <div className="cart-item-details-col">
                      <div className="cart-item-image-wrapper">
                        <img src={item.product.image} alt={item.product.name} className="cart-item-image" />
                      </div>
                      <div className="cart-item-info">
                        <span className="cart-item-category">{(item.product.category || item.product.tag || '').toUpperCase()}</span>
                        <h3 className="cart-item-name">{item.product.name}</h3>
                        <div className="cart-item-specs-display">
                          <div className="spec-item">
                            <span className="spec-label">SIZE:</span>
                            <span className="spec-box">{item.size}</span>
                          </div>
                          <div className="spec-item">
                            <span className="spec-label">COLOR:</span>
                            <span
                              className="spec-color-swatch"
                              style={{
                                backgroundColor: colorHex
                              }}
                              title={colorName}
                            ></span>
                          </div>
                        </div>
                        <Button
                          variant="unstyled-destructive"
                          onClick={() => removeFromCart(itemProductId, item.size, item.color)}
                          aria-label="Remove item"
                        >
                          REMOVE
                        </Button>
                      </div>
                    </div>

                    {/* Quantity Control */}
                    <div className="cart-item-qty-col">
                      <div className="cart-qty-selector">
                        <button
                          className={`qty-selector-btn ${item.quantity <= 1 ? 'disabled' : ''}`}
                          onClick={() => updateQuantity(itemProductId, item.size, item.color, -1)}
                          disabled={item.quantity <= 1}
                          aria-label="Decrease quantity"
                        >
                          <img src={minusIcon} alt="Decrease" className="qty-btn-icon" />
                        </button>
                        <span className="qty-selector-value">{item.quantity}</span>
                        <button
                          className="qty-selector-btn"
                          onClick={() => updateQuantity(itemProductId, item.size, item.color, 1)}
                          aria-label="Increase quantity"
                        >
                          <img src={plusIcon} alt="Increase" className="qty-btn-icon" />
                        </button>
                      </div>
                    </div>

                    {/* Total Price for this Item */}
                    <div className="cart-item-total-col">
                      <span className="cart-item-price">₹{itemTotal.toFixed(2)}</span>
                      {item.quantity > 1 && (
                        <span className="cart-item-unit-price">(₹{item.product.price.toFixed(2)} EACH)</span>
                      )}
                    </div>
                  </div>
                );
              })}

              <div className="cart-actions-footer">
                <Button variant="outline" to="/collections">
                  CONTINUE SHOPPING
                </Button>
              </div>
            </div>

            {/* Right Sticky Order Summary */}
            <aside className="cart-summary-sidebar">
              <div className="cart-summary-card">
                <h2 className="summary-card-title">ORDER SUMMARY</h2>

                <div className="summary-row-item">
                  <span className="summary-row-label">SUBTOTAL</span>
                  <span className="summary-row-value">
                    {isFetching ? <span className="shimmer-skeleton"></span> : `₹${subtotal.toFixed(2)}`}
                  </span>
                </div>

                <div className="summary-row-item">
                  <span className="summary-row-label">SHIPPING</span>
                  <span className="summary-row-value shipping-subtxt-custom">Calculated at checkout</span>
                </div>

                <div className="summary-divider-line"></div>

                <div className="summary-row-item summary-total-row">
                  <span className="summary-row-label">TOTAL</span>
                  <span className="summary-row-value">
                    {isFetching ? <span className="shimmer-skeleton"></span> : `₹${cartTotal.toFixed(2)}`}
                  </span>
                </div>

                <Button
                  variant="solid"
                  layout="center"
                  onClick={handleContinue}
                >
                  CONTINUE
                </Button>
              </div>
            </aside>
          </>
        )}
      </div>
    </div>
  );
}
