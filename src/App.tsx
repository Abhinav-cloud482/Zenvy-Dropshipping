/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { CartProvider } from './context/CartContext';
import { AmazonHeader } from './components/AmazonHeader';
import { Home } from './pages/Home';
import { Login } from './pages/Login';
import { Cart } from './pages/Cart';
import { Checkout } from './pages/Checkout';
import { Orders } from './pages/Orders';
import { AdminLogin } from './pages/AdminLogin';
import { AdminDashboard } from './pages/AdminDashboard';
import { Toaster } from 'sonner';
import { ErrorBoundary } from './components/ErrorBoundary';

const ProtectedAdminRoute = ({ children }: { children: React.ReactNode }) => {
  const isAdminSession = localStorage.getItem('admin_session') === 'true';
  if (!isAdminSession) return <Navigate to="/admin" />;
  return <>{children}</>;
};

const Layout = ({ children }: { children: React.ReactNode }) => {
  const location = useLocation();
  const isNoHeaderPage = location.pathname.startsWith('/admin') || location.pathname === '/login' || location.pathname === '/checkout';

  return (
    <div className="min-h-screen flex flex-col bg-[#0A0A0A]">
      {!isNoHeaderPage && <AmazonHeader />}
      <main className="flex-1">{children}</main>
      <Toaster position="top-center" theme="dark" />
    </div>
  );
};

export default function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <Router>
          <Layout>
            <ErrorBoundary>
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/login" element={<Login />} />
                <Route path="/cart" element={<Cart />} />
                <Route path="/checkout" element={<Checkout />} />
                <Route path="/orders" element={<Orders />} />
                
                {/* Admin Routes */}
                <Route path="/admin" element={<AdminLogin />} />
                <Route path="/admin/dashboard" element={
                  <ProtectedAdminRoute>
                    <AdminDashboard />
                  </ProtectedAdminRoute>
                } />
              </Routes>
            </ErrorBoundary>
          </Layout>
        </Router>
      </CartProvider>
    </AuthProvider>
  );
}

