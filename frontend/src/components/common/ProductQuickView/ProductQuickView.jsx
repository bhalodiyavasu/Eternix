import { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/contexts/ToastContext';
import { useGetProductByIdQuery } from '@/store/actions/productActions';
import { useAddToCartMutation, useGetCartQuery } from '@/store/actions/cartActions';
import Button from '@/components/common/Button/Button';
import Loader from '@/components/common/Loader/Loader';
import './ProductQuickView.css';

export default function ProductQuickView({ product: initialProduct, productId, onClose }) {
  const navigate = useNavigate();
  const { showToast } = useToast();
  const [addToCartApi, { isLoading: isAddingToCart }] = useAddToCartMutation();
  const { refetch: refetchCart } = useGetCartQuery();

  const { data: apiData, isLoading } = useGetProductByIdQuery(productId, {
    skip: !productId,
  });

  const product = apiData?.product || initialProduct;
  
  const [selectedColor, setSelectedColor] = useState('');
  const [selectedSize, setSelectedSize] = useState('');

  useEffect(() => {
    if (product) {
      setSelectedColor(
        product.color || (product.colors && product.colors.length > 0 ? product.colors[0].name : '')
      );
    }
  }, [product]);

  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = '';
    };
  }, []);

  if (!isLoading && !product) return null;

  const addItemToCart = async (sizeWarningMsg) => {
    if (!selectedSize) {
      showToast('warning', sizeWarningMsg);
      return false;
    }

    const colorObj = product.colors?.find(
      (c) => c.name.toUpperCase() === selectedColor.toUpperCase()
    ) || { name: selectedColor || 'DEFAULT', hex: '#000000' };

    try {
      const res = await addToCartApi({
        productId: product._id || product.id,
        quantity: 1,
        size: selectedSize,
        color: colorObj,
      }).unwrap();

      if (res && res.status === 'SUCCESS') {
        refetchCart();
        showToast('success', res.message || 'PRODUCT ADDED TO CART');
        return true;
      } else {
        showToast('error', res?.message || 'FAILED TO ADD PRODUCT TO CART.');
        return false;
      }
    } catch (err) {
      showToast('error', err.data?.message || err.message || 'FAILED TO ADD PRODUCT TO CART.');
      return false;
    }
  };

  const handleAddToCart = async () => {
    const success = await addItemToCart('PLEASE SELECT A SIZE BEFORE ADDING TO CART.');
    if (success) {
      onClose();
    }
  };

  const handleBuyNow = async () => {
    const success = await addItemToCart('PLEASE SELECT A SIZE BEFORE BUYING.');
    if (success) {
      onClose();
      navigate('/cart');
    }i
  };

  return createPortal(
    <div className="quick-view-overlay" onClick={onClose}>
      <div className={`quick-view-box ${isLoading ? 'loading' : ''}`} onClick={(e) => e.stopPropagation()}>
        <button className="quick-view-close-btn" onClick={onClose}>✕</button>
        
        {isLoading ? (
          <div className="quick-view-loader-container">
            <Loader />
          </div>
        ) : (
          <>
            <div className="quick-view-content">
              <div className="quick-view-header">
                <img src={product.image} alt={product.name} className="quick-view-image" />
                <div className="quick-view-product-info">
                  <h4>{product.name}</h4>
                  <p className="quick-view-price">₹{product.price.toFixed(2)}</p>
                </div>
              </div>

              <div className="quick-view-options">
                {product.colors && product.colors.length > 0 && (
                  <div className="premium-selector-group">
                    <span className="premium-selector-label">COLOR: {selectedColor.toUpperCase()}</span>
                    <div className="premium-color-list">
                      {product.colors.map((col, idx) => (
                        <button
                          key={idx}
                          className={`premium-color-btn ${selectedColor === col.name ? 'selected' : ''}`}
                          style={{ backgroundColor: col.hex }}
                          onClick={() => setSelectedColor(col.name)}
                          title={col.name}
                        ></button>
                      ))}
                    </div>
                  </div>
                )}

                {product.sizes && product.sizes.length > 0 && (
                  <div className="premium-selector-group">
                    <span className="premium-selector-label">SIZE: {selectedSize}</span>
                    <div className="premium-size-list">
                      {product.sizes.map((sz, idx) => (
                        <button
                          key={idx}
                          className={`premium-size-btn ${selectedSize === sz ? 'selected' : ''}`}
                          onClick={() => setSelectedSize(sz)}
                        >
                          {sz}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              <div className="quick-view-summary">
                <h5>ORDER SUMMARY</h5>
                <div className="summary-row">
                  <span>1x {product.name}</span>
                  <span>₹{product.price.toFixed(2)}</span>
                </div>
                <div className="summary-row">
                  <span>Shipping</span>
                  <span>Calculated at checkout</span>
                </div>
                <div className="summary-divider"></div>
                <div className="summary-row total">
                  <span>TOTAL</span>
                  <span>₹{product.price.toFixed(2)}</span>
                </div>
              </div>
            </div>

            <div className="quick-view-actions">
              <Button variant="outline" onClick={handleAddToCart} disabled={isAddingToCart}>
                ADD TO CART
              </Button>
              <Button variant="solid" onClick={handleBuyNow} disabled={isAddingToCart}>
                BUY NOW
              </Button>
            </div>
          </>
        )}
      </div>
    </div>,
    document.body
  );
}

