import React from 'react';
import '../../styles/Home/Home.css';

/**
 * HeroSection component - Displays the hero content with heading, subheading, image, and CTA button.
 * @param {string} heading - The main heading text.
 * @param {string} subheading - The subheading text.
 * @param {string} image - The URL of the hero image.
 * @param {string} ctaText - The text for the CTA button.
 * @param {string} ctaLink - The URL for the CTA button link.
 */
const HeroSection = ({ heading, subheading, image, ctaText, ctaLink }) => (
  <div className="hero-section">
    <h1 className="hero-heading">{heading}</h1>
    <h3 className="hero-subheading">{subheading}</h3>
    <img src={image} alt="Hero" className="hero-image" />
    <div className="cta-container">
      <a href={ctaLink} className="cta-button">{ctaText}</a>
    </div>
  </div>
);

export default HeroSection;
