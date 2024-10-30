import React from 'react';
import AnimatedBackground from '../components/Home/AnimatedBackground';
import HeroSection from '../components/Home/HeroSection';
import '../styles/Home/Home.css';

/**
 * Home component - Displays the hero section with background animation,
 * main heading, subheading, CTA button, and a decorative wave SVG at the bottom.
 */
function Home() {
  return (
    <div className="home-container">
      <AnimatedBackground />
      <HeroSection
        heading="WELCOME TO 26CLUB"
        subheading="TRACK WHAT MATTERS, TRANSFORM YOUR MARATHON"
        image="/images/kipchoge-product.jpg"
        ctaText="Join for Free"
        ctaLink="/signup"
      />
    </div>
  );
}

export default Home;
