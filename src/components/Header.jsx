import React from 'react';
import '../styles/Header.css';

function Header() {
  return (
    <header className="app-header">
      <nav>
        <ul className="nav-links">
          <li><a href="/">Home</a></li>
          <li><a href="/about">About</a></li>
          <li><a href="/dashboard">Dashboard</a></li>
        </ul>
      </nav>
    </header>
  );
}

export default Header;
