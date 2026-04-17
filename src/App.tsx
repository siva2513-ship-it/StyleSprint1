/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import React from 'react';
import { CartProvider } from './contexts/CartContext';
import { UserProvider } from './contexts/UserContext';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import StoreList from './pages/StoreList';
import StoreDetail from './pages/StoreDetail';
import CartPage from './pages/CartPage';
import OrderTracking from './pages/OrderTracking';
import ProfilePage from './pages/ProfilePage';
import CuratedPage from './pages/CuratedPage';
import UrgentPage from './pages/UrgentPage';
import LoginPage from './pages/LoginPage';

import { useUser } from './contexts/UserContext';
import { Navigate, useLocation } from 'react-router-dom';

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { profile, loading } = useUser();
  const location = useLocation();

  if (loading) return null;
  if (!profile) return <Navigate to="/login" state={{ from: location }} replace />;

  return <>{children}</>;
}

export default function App() {
  return (
    <Router>
      <UserProvider>
        <CartProvider>
          <div className="min-h-screen bg-brand-bg selection:bg-white selection:text-black">
            <Navbar />
            <Routes>
              <Route path="/login" element={<LoginPage />} />
              <Route path="/" element={<ProtectedRoute><Hero /></ProtectedRoute>} />
              <Route path="/stores" element={<ProtectedRoute><StoreList /></ProtectedRoute>} />
              <Route path="/stores/:id" element={<ProtectedRoute><StoreDetail /></ProtectedRoute>} />
              <Route path="/cart" element={<ProtectedRoute><CartPage /></ProtectedRoute>} />
              <Route path="/order/:id" element={<ProtectedRoute><OrderTracking /></ProtectedRoute>} />
              <Route path="/profile" element={<ProtectedRoute><ProfilePage /></ProtectedRoute>} />
              <Route path="/curated" element={<ProtectedRoute><CuratedPage /></ProtectedRoute>} />
              <Route path="/urgent" element={<ProtectedRoute><UrgentPage /></ProtectedRoute>} />
            </Routes>
            
            <footer className="px-10 py-20 border-t border-white/10 mt-20">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
                <div className="col-span-2">
                  <h2 className="luxury-title text-3xl mb-4">StyleSprint</h2>
                  <p className="max-w-xs text-white/40 font-light">
                    Fast delivery for clothes. Get what you want from local shops in 60 minutes.
                  </p>
                </div>
                <div>
                  <h4 className="micro-label mb-6">Company</h4>
                  <ul className="space-y-4 opacity-60 text-sm">
                    <li><a href="#" className="hover:opacity-100">About</a></li>
                    <li><a href="#" className="hover:opacity-100">Partners</a></li>
                    <li><a href="#" className="hover:opacity-100">Careers</a></li>
                  </ul>
                </div>
                <div>
                  <h4 className="micro-label mb-6">Support</h4>
                  <ul className="space-y-4 opacity-60 text-sm">
                    <li><a href="#" className="hover:opacity-100">Help Center</a></li>
                    <li><a href="#" className="hover:opacity-100">Contact</a></li>
                    <li><a href="#" className="hover:opacity-100">Terms</a></li>
                  </ul>
                </div>
              </div>
            </footer>
          </div>
        </CartProvider>
      </UserProvider>
    </Router>
  );
}
