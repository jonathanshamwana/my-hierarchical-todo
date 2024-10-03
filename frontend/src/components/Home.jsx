import React from 'react';
import '../styles/Home.css';

function Home() {
  return (
    <div className="home-container">
      <h1>Welcome to HybridUp</h1>
      {/* Placeholder for now - eventually a loom video */}
      <img src="/images/kipchoge-ineos.png" alt="Demo Image" className="demo-image" />
      <div className="cta-buttons">
        <a href="/signup" className="cta-button">Join for Free</a>
      </div>
    </div>
  );
}

export default Home;
