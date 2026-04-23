/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { CookieBanner } from './components/CookieBanner';
import { Home } from './pages/Home';
import { Editor } from './pages/Editor';
import { ReviewsPage } from './pages/ReviewsPage';
import { GuidesPage } from './pages/GuidesPage';
import { MediaPage } from './pages/MediaPage';
import { ArticlePage } from './pages/ArticlePage';
import { PlatformPage } from './pages/PlatformPage';
import { PrivacyPolicy } from './pages/PrivacyPolicy';
import { TermsOfService } from './pages/TermsOfService';
import { CookiePolicy } from './pages/CookiePolicy';
import { ProfilePage } from './pages/ProfilePage';

export default function App() {
  return (
    <Router>
      <Helmet>
        <title>ChronsGamingtv</title>
        <meta name="description" content="ChronsGamingtv - Tu portal de noticias, análisis, guías y contenido sobre videojuegos." />
      </Helmet>
      <div className="min-h-screen bg-zinc-950 text-zinc-50 font-sans selection:bg-orange-500/30 flex flex-col">
        <Navbar />
        
        <div className="flex-1">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/editor" element={<Editor />} />
            <Route path="/analisis" element={<ReviewsPage />} />
            <Route path="/guias" element={<GuidesPage />} />
            <Route path="/media" element={<MediaPage />} />
            <Route path="/article/:id" element={<ArticlePage />} />
            <Route path="/plataforma/:platformId" element={<PlatformPage />} />
            <Route path="/privacidad" element={<PrivacyPolicy />} />
            <Route path="/terminos" element={<TermsOfService />} />
            <Route path="/cookies" element={<CookiePolicy />} />
            <Route path="/perfil" element={<ProfilePage />} />
          </Routes>
        </div>

        <Footer />
        <CookieBanner />
      </div>
    </Router>
  );
}
