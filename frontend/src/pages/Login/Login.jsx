import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/contexts/ToastContext';
import Button from '@/components/common/Button/Button';
import modelImg from '@/assets/extracted/image1_2_63.jpg';
import logoIcon from '@/assets/icons/logo.svg';
import './Login.css';

export default function Login() {
  const navigate = useNavigate();
  const { showToast } = useToast();

  const [activeTab, setActiveTab] = useState('login');
  
  // Login Form States
  const [loginData, setLoginData] = useState({
    email: '',
    password: ''
  });

  // Signup Form States
  const [signupData, setSignupData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: ''
  });

  const handleLoginChange = (e) => {
    const { name, value } = e.target;
    setLoginData(prev => ({ ...prev, [name]: value }));
  };

  const handleSignupChange = (e) => {
    const { name, value } = e.target;
    setSignupData(prev => ({ ...prev, [name]: value }));
  };

  const handleLoginSubmit = (e) => {
    e.preventDefault();
    
    // Check dummy credentials or succeed automatically for UI flow
    if (loginData.email && loginData.password) {
      showToast('success', `WELCOME BACK!`);
      // Store mock user session
      localStorage.setItem('nix_user_session', JSON.stringify({ email: loginData.email }));
      navigate('/profile');
    }
  };

  const handleSignupSubmit = (e) => {
    e.preventDefault();

    if (signupData.password !== signupData.confirmPassword) {
      showToast('warning', 'PASSWORDS DO NOT MATCH.');
      return;
    }

    showToast('success', 'ACCOUNT CREATED SUCCESSFULLY! PLEASE LOG IN.');
    // Switch to login tab and prefill email
    setLoginData({ email: signupData.email, password: '' });
    setActiveTab('login');
    setSignupData({ username: '', email: '', password: '', confirmPassword: '' });
  };

  return (
    <div className="login-page-container">
      <div className="login-split-layout">
        
        {/* Left Side: Editorial cover image */}
        <div className="login-media-side">
          <img src={modelImg} alt="Editorial Fashion Cover" className="login-cover-img" />
          <div className="login-media-overlay">
            <span className="media-season-pill">EST. 2026 / VOL. 1</span>
            <h3 className="media-slogan">ELEVATING WORKSPACE SILHOUETTE</h3>
          </div>
        </div>

        {/* Right Side: Auth forms */}
        <div className="login-form-side">
          <div className="login-form-wrapper">
            
            {/* Logo area */}
            <div className="login-logo-container" onClick={() => navigate('/')}>
              <img src={logoIcon} alt="Eternix Logo" className="login-logo-img" />
            </div>

            {activeTab === 'login' ? (
              <form onSubmit={handleLoginSubmit} className="login-form-block animate-fade-in">
                <h2 className="form-action-title">SIGN IN</h2>
                <p className="form-action-subtitle">Enter your details to access your account.</p>

                <div className="login-input-group">
                  <input
                    type="email"
                    name="email"
                    value={loginData.email}
                    onChange={handleLoginChange}
                    placeholder="Email Address"
                    required
                  />
                </div>

                <div className="login-input-group">
                  <input
                    type="password"
                    name="password"
                    value={loginData.password}
                    onChange={handleLoginChange}
                    placeholder="Password"
                    required
                  />
                </div>

                <div className="forgot-password-row">
                  <span className="forgot-lnk" onClick={() => showToast('success', 'PASSWORD RESET LINK SENT.')}>
                    Forgot Password?
                  </span>
                </div>

                <Button type="submit" variant="solid" fullWidth layout="split">
                  <span>Sign In</span>
                  <svg width="40" height="12" viewBox="0 0 40 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M0 6H39M39 6L33 1M39 6L33 11" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </Button>

                <div className="auth-switch-row">
                  <span className="auth-switch-text">DON&apos;T HAVE AN ACCOUNT?</span>
                  <button
                    type="button"
                    className="auth-switch-btn"
                    onClick={() => setActiveTab('signup')}
                  >
                    SIGN UP
                  </button>
                </div>
              </form>
            ) : (
              <form onSubmit={handleSignupSubmit} className="login-form-block animate-fade-in">
                <h2 className="form-action-title">JOIN ETERNIX</h2>
                <p className="form-action-subtitle">Create an account to track orders and save details.</p>

                <div className="login-input-group">
                  <input
                    type="text"
                    name="username"
                    value={signupData.username}
                    onChange={handleSignupChange}
                    placeholder="Username"
                    required
                  />
                </div>

                <div className="login-input-group">
                  <input
                    type="email"
                    name="email"
                    value={signupData.email}
                    onChange={handleSignupChange}
                    placeholder="Email Address"
                    required
                  />
                </div>

                <div className="login-input-group">
                  <input
                    type="password"
                    name="password"
                    value={signupData.password}
                    onChange={handleSignupChange}
                    placeholder="Password"
                    required
                  />
                </div>

                <div className="login-input-group">
                  <input
                    type="password"
                    name="confirmPassword"
                    value={signupData.confirmPassword}
                    onChange={handleSignupChange}
                    placeholder="Confirm Password"
                    required
                  />
                </div>

                <Button type="submit" variant="solid" fullWidth layout="split">
                  <span>Create Account</span>
                  <svg width="40" height="12" viewBox="0 0 40 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M0 6H39M39 6L33 1M39 6L33 11" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </Button>

                <div className="auth-switch-row">
                  <span className="auth-switch-text">ALREADY HAVE AN ACCOUNT?</span>
                  <button
                    type="button"
                    className="auth-switch-btn"
                    onClick={() => setActiveTab('login')}
                  >
                    LOG IN
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}
