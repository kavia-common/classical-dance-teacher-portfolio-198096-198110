import React from 'react';
import Hero from '../components/Hero';
import Achievements from '../components/Achievements';
import AboutSection from '../components/AboutSection';
import GalleryGrid from '../components/GalleryGrid';
import { Section } from '../components/Section';
import SEO from '../components/SEO';

// PUBLIC_INTERFACE
export default function Home() {
  /** Landing page. */
  return (
    <>
      <SEO title="Home" />
      <div className="u-mt-4">
        <Hero />
      </div>
      <Section title="Achievements" description="Highlights of excellence in classical dance.">
        <Achievements />
      </Section>
      <Section title="About">
        <AboutSection />
      </Section>
      <Section title="Gallery">
        <GalleryGrid />
      </Section>
    </>
  );
}
