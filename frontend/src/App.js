import React, { Suspense, lazy } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import './App.css';
import './styles/theme.css';
import './styles/utilities.css';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Loader from './components/Loader';
import SEO from './components/SEO';
import { Breadcrumbs } from './components/Breadcrumbs';
import { Section } from './components/Section';
import { useEnv } from './utils/env';

// Code-split main routes
const Home = lazy(() => import('./pages/Home'));
const About = lazy(() => import('./pages/About'));
const Gallery = lazy(() => import('./pages/Gallery'));
const Classes = lazy(() => import('./pages/Classes'));
const Contact = lazy(() => import('./pages/Contact'));
const NotFound = lazy(() => import('./pages/NotFound'));

// PUBLIC_INTERFACE
export default function App() {
  /** Basic app-level SEO defaults */
  const { FRONTEND_URL } = useEnv();
  const location = useLocation();

  return (
    <div className="app-root">
      <a href="#main-content" className="skip-link">Skip to content</a>
      <SEO
        title="Classical Dance Teacher | Portfolio"
        description="Explore the portfolio of a classical dance teacher: achievements, gallery, classes & schedule, and contact."
        url={FRONTEND_URL}
      />
      <Navbar />
      <main id="main-content" className="main-container container">
        <Breadcrumbs pathname={location.pathname} />
        <Suspense fallback={<Loader ariaLabel="Loading content" />}>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/about" element={
              <Section ariaLabel="About" title="About">
                <About />
              </Section>
            } />
            <Route path="/gallery" element={
              <Section ariaLabel="Gallery" title="Gallery">
                <Gallery />
              </Section>
            } />
            <Route path="/classes" element={
              <Section ariaLabel="Classes and Schedule" title="Classes & Schedule">
                <Classes />
              </Section>
            } />
            <Route path="/contact" element={
              <Section ariaLabel="Contact" title="Contact">
                <Contact />
              </Section>
            } />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Suspense>
      </main>
      <Footer />
    </div>
  );
}
