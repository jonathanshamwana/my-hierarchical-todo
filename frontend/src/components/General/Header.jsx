import React from 'react';
import '../../styles/General/Header.css';

/**
 * Header component - Renders the navigation menu based on the user's authentication status.
 * Shows dashboard, completed tasks, and logout options if the user is logged in, otherwise shows home, login, and signup.
 * 
 * @component
 * @example
 * // Usage
 * <Header />
 */
function Header() {
  const token = sessionStorage.getItem('token'); // Retrieve authentication token from session storage

  return (
    <header className="app-header">
      <nav>
        <ul className="nav-links">
          {token ? (
            <>
              <li><a href="/dashboard">Dashboard</a></li>
              <li><a href="/completed">Completed Tasks</a></li>
              <li><a href="/" onClick={() => {
                sessionStorage.removeItem('token'); // Clear token on logout
                window.location.href = '/login'; // Redirect to login
              }}>Logout</a></li>
            </>
          ) : (
            <>
              <li><a href="/">Home</a></li>
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
