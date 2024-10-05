import React from 'react';
import '../styles/Header.css';

function Integrations() {
  return (
    <header className="app-header">
      <nav>
        <ul className="nav-links">
          <li><a href="/">Home</a></li>
          <li><a href="/about">About</a></li>
          <li><a href="/dashboard">Dashboard</a></li>
          <li><a href="/completed">Completed</a></li>
          <li><a href="/integrations">Integrations</a></li>
        </ul>
      </nav>
    </header>
  );
}

export default Integrations;