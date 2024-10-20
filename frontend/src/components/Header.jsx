import React from 'react';
import '../styles/Header.css';

function Header() {
  return (
    <header className="app-header">
      <nav>
        <ul className="nav-links">
          <li><a href="/">Home</a></li>
          <li><a href="/dashboard">Dashboard</a></li>
          <li><a href="/completed">Completed</a></li>
          <li><a href="/integrations">Integrations</a></li>
          <li><a href="/signup">Signup</a></li>
          <li><a href="/login">Login</a></li>
        </ul>
      </nav>
    </header>
  );
}

export default Header;
