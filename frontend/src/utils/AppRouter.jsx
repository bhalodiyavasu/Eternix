import { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, useLocation, Navigate } from 'react-router-dom';
import Header from '@/components/common/Header/Header';
import Footer from '@/components/common/Footer/Footer';
import Home from '@/pages/Home/Home';
import Collections from '@/pages/Collections/Collections';
import Cart from '@/pages/Cart/Cart';
import Checkout from '@/pages/Checkout/Checkout';
import PaymentRecipt from '@/pages/PaymentRecipt/PaymentRecipt';
import Auth from '@/pages/Auth/Auth';
import Profile from '@/pages/Profile/Profile';
import Admin from '@/pages/Admin/Admin';
import AdminLogin from '@/pages/Admin/AdminLogin';
import NotFound from '@/pages/NotFound/NotFound';
import Loader from '@/components/common/Loader/Loader';

// Wrapper for routes that require authentication and flow verification
function ProtectedRoute({ children }) {
  const session = localStorage.getItem('userToken');
  const location = useLocation();

  if (!session) {
    return <Navigate to="/auth" replace />;
  }

  // Checkout flow gate
  if (location.pathname === '/checkout') {
    const isAllowed = location.state?.fromCart;
    const navType = window.performance?.getEntriesByType?.('navigation')?.[0]?.type;
    const isReload = navType === 'reload' || navType === 'back_forward';
    if (!isAllowed && !isReload) {
      return <Navigate to="/" replace />;
    }
  }

  // Payment receipt gate
  if (location.pathname === '/payment-recipt') {
    const sessionId = new URLSearchParams(location.search).get('session_id');
    if (!sessionId) {
      return <Navigate to="/" replace />;
    }
  }

  return children;
}

// Wrapper for routes that should ONLY be accessible when logged out (e.g. Auth page)
function PublicOnlyRoute({ children }) {
  const session = localStorage.getItem('userToken');
  if (session) {
    return <Navigate to="/" replace />;
  }
  return children;
}

function ScrollToHashElement() {
  const { hash, pathname } = useLocation();

  useEffect(() => {
    if (hash) {
      const element = document.getElementById(hash.replace('#', ''));
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    } else {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }, [hash, pathname]);

  return null;
}

function AppLayout({ children }) {
  const location = useLocation();
  const isMinimal = location.pathname === '/checkout' || location.pathname === '/payment-recipt' || location.pathname === '/auth' || location.pathname === '/admin' || location.pathname === '/admin/login';

  return (
    <div className="app-wrapper">
      {!isMinimal && <Header />}
      <main>{children}</main>
      {!isMinimal && <Footer />}
    </div>
  );
}

export default function AppRouter() {
  return (
    <BrowserRouter>
      <ScrollToHashElement />
      <AppLayout>
        <Routes>
          {/* Public-only route (Auth) */}
          <Route 
            path="/auth" 
            element={
              <PublicOnlyRoute>
                <Auth />
              </PublicOnlyRoute>
            } 
          />

          {/* Public routes (no login required) */}
          <Route path="/" element={<Home />} />
          <Route path="/collections" element={<Collections />} />
          <Route path="/cart" element={<Cart />} />
          <Route 
            path="/checkout" 
            element={
              <ProtectedRoute>
                <Checkout />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/payment-recipt" 
            element={
              <ProtectedRoute>
                <PaymentRecipt />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/profile" 
            element={
              <ProtectedRoute>
                <Profile />
              </ProtectedRoute>
            } 
          />
          <Route path="/admin/login" element={<AdminLogin />} />
          <Route path="/admin" element={<Admin />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </AppLayout>
    </BrowserRouter>
  );
}

