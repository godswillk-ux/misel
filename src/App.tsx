import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider } from '@/context/ThemeContext';
import { AuthProvider } from '@/context/AuthContext';
import { UserProvider } from '@/context/UserContext';
import { Layout } from '@/components/layout/Layout';
import { Home } from '@/pages/Home';
import { Shop } from '@/pages/Shop';
import { Categories } from '@/pages/Categories';
import { OurStory } from '@/pages/OurStory';
import { Dashboard } from '@/pages/Dashboard';
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';
import { AdminPanel } from '@/components/admin/AdminPanel';
import './lib/i18n';

function App() {
  return (
    <ThemeProvider defaultTheme="dark" storageKey="misel-ui-theme">
      <AuthProvider>
        <UserProvider>
          <Router>
            <Layout>
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/shop" element={<Shop />} />
                <Route path="/categories" element={<Categories />} />
                <Route path="/our-story" element={<OurStory />} />
                <Route 
                  path="/dashboard" 
                  element={
                    <ProtectedRoute>
                      <Dashboard />
                    </ProtectedRoute>
                  } 
                />
                <Route 
                  path="/wishlist" 
                  element={
                    <ProtectedRoute>
                      <Dashboard />
                    </ProtectedRoute>
                  } 
                />
                <Route 
                  path="/admin" 
                  element={
                    <ProtectedRoute adminOnly>
                      <AdminPanel />
                    </ProtectedRoute>
                  } 
                />
              </Routes>
            </Layout>
          </Router>
        </UserProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
