/**
 * App.jsx — Main Router Component
 * भारत Avatar Platform — India Innovates 2026
 */

import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

// --- Original Routes ---
import Landing from './pages/Landing';
import AvatarCreator from './pages/AvatarCreator';
import LiveQA from './pages/LiveQA';
import PlatformAnalytics from './pages/PlatformAnalytics'; // Renamed from Dashboard
import AdminBroadcast from './pages/AdminBroadcast';
import ConsentOTP from './pages/ConsentOTP';
import ConsentVerify from './pages/ConsentVerify';

// --- PRATINIDHI Routes ---
import LandingPage from './pages/LandingPage';
import LoginPage from './pages/LoginPage';
import Dashboard from './pages/Dashboard'; // PRATINIDHI Dashboard
import CreateAvatar from './pages/CreateAvatar';
import AvatarPreview from './pages/AvatarPreview';
import CitizenView from './pages/CitizenView';
import Analytics from './pages/Analytics';
import Settings from './pages/Settings';
import AskAvatar from './pages/AskAvatar';
import Messages from './pages/Messages';
import FeaturesPage from './pages/FeaturesPage';
import SignUpPage from './pages/SignUpPage';
import Receivers from './pages/Receivers';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Primary PRATINIDHI Landing */}
        <Route path="/" element={<LandingPage />} />
        
        {/* --- PRATINIDHI Routes --- */}
        <Route path="/login" element={<LoginPage />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/features" element={<FeaturesPage />} />
        <Route path="/create" element={<CreateAvatar />} />
        <Route path="/preview" element={<AvatarPreview />} />
        <Route path="/preview/:id" element={<AvatarPreview />} />
        <Route path="/messages" element={<Messages />} />
        <Route path="/view/:id" element={<CitizenView />} />
        <Route path="/analytics" element={<Analytics />} />
        <Route path="/settings" element={<Settings />} />
        <Route path="/ask-avatar" element={<AskAvatar />} />
        <Route path="/signup" element={<SignUpPage />} />
        <Route path="/receivers" element={<Receivers />} />
        <Route path="/consent" element={<ConsentOTP />} />
        <Route path="/consent/verify" element={<ConsentVerify />} />

        {/* --- Original Routes (Preserved) --- */}
        <Route path="/old_landing" element={<Landing />} />
        <Route path="/avatar/:avatarId" element={<AvatarCreator />} />
        <Route path="/qa/:avatarId" element={<LiveQA />} />
        <Route path="/platform-analytics" element={<PlatformAnalytics />} />
        <Route path="/admin" element={<AdminBroadcast />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
