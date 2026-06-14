import React, { useEffect } from 'react';
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import Header from '@/components/common/Header/Header';
import Footer from '@/components/common/Footer/Footer';
import HomePage from '@/pages/HomePage';
import CollectionsPage from '@/pages/CollectionsPage/CollectionsPage';
import CartPage from '@/pages/CartPage/CartPage';
import CheckoutPage from '@/pages/CheckoutPage/CheckoutPage';
import PaymentSuccessPage from '@/pages/PaymentSuccessPage/PaymentSuccessPage';

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
  const isCheckout = location.pathname === '/checkout' || location.pathname === '/payment-success';

  return (
    <div className="app-wrapper">
      {!isCheckout && <Header />}
      <main>{children}</main>
      {!isCheckout && <Footer />}
    </div>
  );
}

export default function AppRouter() {
  return (
    <BrowserRouter>
      <ScrollToHashElement />
      <AppLayout>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/collections" element={<CollectionsPage />} />
          <Route path="/cart" element={<CartPage />} />
          <Route path="/checkout" element={<CheckoutPage />} />
          <Route path="/payment-success" element={<PaymentSuccessPage />} />
        </Routes>
      </AppLayout>
    </BrowserRouter>
  );
}
