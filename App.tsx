

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
import AdvancedEditorPage from './pages/editor/AdvancedEditorPage';
import BusinessMaterialsGeneratorPage from './pages/generator/business/BusinessMaterialsGeneratorPage';
import FlyerGeneratorPage from './pages/generator/flyer/FlyerGeneratorPage';
import PosterGeneratorPage from './pages/generator/poster/PosterGeneratorPage';
import MarketplacePage from './pages/marketplace/MarketplacePage';
import TalentPage from './pages/talent/TalentPage';

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
        <Route 
          path="/generator/business-card"
          element={
            <ProtectedRoute>
              <MainLayout>
                <BusinessMaterialsGeneratorPage />
              </MainLayout>
            </ProtectedRoute>
          }
        />
        <Route 
          path="/generator/flyer"
          element={
            <ProtectedRoute>
              <MainLayout>
                <FlyerGeneratorPage />
              </MainLayout>
            </ProtectedRoute>
          }
        />
        <Route 
          path="/generator/poster"
          element={
            <ProtectedRoute>
              <MainLayout>
                <PosterGeneratorPage />
              </MainLayout>
            </ProtectedRoute>
          }
        />
        <Route 
          path="/editor/advanced"
          element={
            <ProtectedRoute>
              <MainLayout>
                <AdvancedEditorPage />
              </MainLayout>
            </ProtectedRoute>
          }
        />
        <Route 
          path="/marketplace"
          element={
            <ProtectedRoute>
              <MainLayout>
                <MarketplacePage />
              </MainLayout>
            </ProtectedRoute>
          }
        />
        <Route 
          path="/talent-hub"
          element={
            <ProtectedRoute>
              <MainLayout>
                <TalentPage />
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