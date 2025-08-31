

import React, { useEffect } from 'react';
import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';
import LoginPage from './pages/auth/LoginPage';
import RegisterPage from './pages/auth/RegisterPage';
import DashboardPage from './pages/dashboard/DashboardPage';
import MainLayout from './components/layout/MainLayout';
import ProtectedRoute from './components/common/ProtectedRoute';
import { useAuth } from './hooks/useAuth';
import { Toaster } from './components/ui/Toast';
import ThumbnailGeneratorPage from './pages/generator/youtube/ThumbnailGeneratorPage';
import SocialMediaAdGeneratorPage from './pages/generator/ads/SocialMediaAdGeneratorPage';
import LogoGeneratorPage from './pages/generator/logo/LogoGeneratorPage';

function App() {
  // Initialize auth check on app load
  const { initializeAuth } = useAuth();
  useEffect(() => {
    initializeAuth();
  }, [initializeAuth]);

  return (
    <HashRouter>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route 
          path="/dashboard" 
          element={
            <ProtectedRoute>
              <MainLayout>
                <DashboardPage />
              </MainLayout>
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/generator/youtube-thumbnail"
          element={
            <ProtectedRoute>
              <MainLayout>
                <ThumbnailGeneratorPage />
              </MainLayout>
            </ProtectedRoute>
          }
        />
        <Route 
          path="/generator/social-media-ad"
          element={
            <ProtectedRoute>
              <MainLayout>
                <SocialMediaAdGeneratorPage />
              </MainLayout>
            </ProtectedRoute>
          }
        />
        <Route 
          path="/generator/logo"
          element={
            <ProtectedRoute>
              <MainLayout>
                <LogoGeneratorPage />
              </MainLayout>
            </ProtectedRoute>
          }
        />
        <Route path="*" element={<Navigate to="/dashboard" />} />
      </Routes>
      <Toaster />
    </HashRouter>
  );
}

export default App;