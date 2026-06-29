import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { useToast } from '@/contexts/ToastContext';
import { useGoogleAuthMutation } from '@/store/actions/authActions';
import { useAddToCartMutation } from '@/store/actions/cartActions';
import { resetAllApiStates } from '@/store';
import { getItems, clearItems } from '@/utils/guestCart';
import { auth, googleProvider } from '@/config/firebase';
import { signInWithPopup } from 'firebase/auth';
import Loader from '@/components/common/Loader/Loader';
import modelImg from '@/assets/images/authImage.png';
import logoIcon from '@/assets/icons/logo.svg';
import googleIcon from '@/assets/icons/google.svg';
import './Auth.css';

export default function Auth() {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();
  const { showToast } = useToast();
  const [googleAuth] = useGoogleAuthMutation();
  const [addToCart] = useAddToCartMutation();
  // isPopupPending: popup is open, button disabled — no full-page loader
  // isAuthenticating: popup succeeded, now calling backend — full-page loader
  const [isPopupPending, setIsPopupPending] = useState(false);
  const [isAuthenticating, setIsAuthenticating] = useState(false);

  const mergeGuestCart = async () => {
    for (const item of getItems()) {
      try { await addToCart({ productId: item.product._id, quantity: item.quantity, size: item.size, color: item.color }).unwrap(); } catch { }
    }
    clearItems();
  };

  const handleGoogleSignIn = async () => {
    if (isPopupPending || isAuthenticating) return;
    setIsPopupPending(true);

    try {
      // Phase 1: popup — button stays disabled, no loader shown
      const result = await signInWithPopup(auth, googleProvider);

      // Phase 2: popup succeeded — now show full loader for backend call
      setIsPopupPending(false);
      setIsAuthenticating(true);

      const idToken = await result.user.getIdToken();
      const res = await googleAuth(idToken).unwrap();

      if (res.status === 'SUCCESS') {
        localStorage.setItem('userToken', res.token);
        dispatch(resetAllApiStates());
        await mergeGuestCart();
        showToast('success', res.message || 'WELCOME!');
        navigate(location.state?.from || '/', { replace: true, state: { justLoggedIn: true } });
      } else {
        showToast('error', 'AUTHENTICATION FAILED.');
        setIsAuthenticating(false);
      }
    } catch {
      // Covers: popup-closed-by-user, network errors, backend errors
      setIsPopupPending(false);
      setIsAuthenticating(false);
      showToast('error', 'SIGN-IN FAILED. PLEASE TRY AGAIN.');
    }
  };

  return (
    <div className="login-page-container">
      <div className="login-split-layout">

        <div className="login-media-side">
          <img src={modelImg} alt="Editorial Fashion Cover" className="login-cover-img" />
          <div className="login-media-overlay">
            <span className="media-season-pill">EST. 2026 / VOL. 1</span>
            <h3 className="media-slogan">ELEVATE YOUR WARDROBE</h3>
          </div>
        </div>

        <div className="login-form-side">
          {(isPopupPending || isAuthenticating) ? (
            <div className="auth-form-loader-container">
              <Loader />
              <span className="auth-loader-text">AUTHENTICATING...</span>
            </div>
          ) : (
            <div className="login-form-wrapper">
              <div className="login-logo-container" onClick={() => navigate('/')}>
                <img src={logoIcon} alt="Eternix Logo" className="login-logo-img notranslate" translate="no" />
              </div>

              <div className="login-form-block animate-fade-in">
                <h2 className="form-action-title">WELCOME</h2>
                <p className="form-action-subtitle">Sign in with your Google account to access your Explore Collection and wardrobe.</p>

                <button className="google-signin-btn" onClick={handleGoogleSignIn}>
                  <img src={googleIcon} alt="Google Logo" className="google-icon" />
                  <span>CONTINUE WITH GOOGLE</span>
                </button>
              </div>
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
