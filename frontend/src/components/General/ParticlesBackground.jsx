import React from 'react';
import Particles from 'react-tsparticles';

const ParticlesBackground = () => (
  <Particles
    options={{
      particles: {
        number: { value: 80 },
        size: { value: 3 },
        move: { speed: 2 },
        line_linked: { enable: true, opacity: 0.5 }
      },
      interactivity: { events: { onhover: { enable: true, mode: 'repulse' } } }
    }}
    style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', zIndex: -1 }}
  />
);

export default ParticlesBackground;
