import React, { Suspense } from 'react';
import '../styles/Home/Home.css';

// Lazy load the components
const AnimatedBackground = React.lazy(() => import('../components/Home/AnimatedBackground'));
const HeroSection = React.lazy(() => import('../components/Home/HeroSection'));

/**
 * Home component - Displays the hero section with background animation,
 * main heading, subheading, CTA button, and a decorative wave SVG at the bottom.
 */
function Home() {
  return (
    <div className="home-container">
      {/* Use Suspense to show a fallback while components are loading */}
      <Suspense fallback={<div className="loading-spinner"></div>}>
        <AnimatedBackground />
        <HeroSection
          heading="WELCOME TO 26CLUB"
          subheading="TRACK WHAT MATTERS, TRANSFORM YOUR MARATHON"
          image="/images/kipchoge-product.jpg"
          ctaText="Join for Free"
          ctaLink="/signup"
        />
      </Suspense>
    </div>
  );
}

export default Home;

