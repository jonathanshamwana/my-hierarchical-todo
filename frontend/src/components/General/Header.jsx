import React from 'react';
import '../../styles/Header.css'

function Header() {
  const token = sessionStorage.getItem('token');

  return (
    <header className="app-header">
      <nav>
        <ul className="nav-links">
          <li><a href="/">Home</a></li>
          {token ? (
            <>
              <li><a href="/dashboard">Dashboard</a></li>
              <li><a href="/completed">Completed Tasks</a></li>
              <li><a href="/integrations">Integrations</a></li>
              <li><a href="/" onClick={() => {
                sessionStorage.removeItem('token');
                window.location.href = '/login';
              }}>Logout</a></li>
            </>
          ) : (
            <>
              <li><a href="/login">Login</a></li>
              <li><a href="/signup">Signup</a></li>
            </>
          )}
        </ul>
      </nav>
    </header>
  );
}

export default Header;