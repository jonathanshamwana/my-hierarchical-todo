import React from 'react';
import ParticlesBackground from '../components/General/ParticlesBackground';
import '../styles/Home.css';

function Home() {
  return (
    <div className="home-container">
      <div className="animated-background"></div>
      <ParticlesBackground />
      <h1 className="home-heading patrick-hand-regular">WELCOME TO 26CLUB</h1>
      <h3 className="home-subheading patrick-hand-regular">TRACK WHAT MATTERS, TRANSFORM YOUR MARATHON</h3>
      <img src="/images/kipchoge-product.jpg" alt="Demo" className="demo-image" />
      <div className="cta-container">
        <a href="/signup" className="cta-button">Join for Free</a>
      </div>
      <div className="wave-container">
        <svg className="wave" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 320">
          <path fill="#f7f7f7" fillOpacity="1" d="M0,192L48,170.7C96,149,192,107,288,122.7C384,139,480,213,576,218.7C672,224,768,160,864,138.7C960,117,1056,139,1152,160C1248,181,1344,203,1392,213.3L1440,224L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"></path>
        </svg>
      </div>
    </div>
  );
}

export default Home;
