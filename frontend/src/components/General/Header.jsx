import React, { useContext } from 'react';
import { AuthContext } from '../../context/AuthContext';
import '../../styles/General/Header.css';

/**
 * Header component - Renders the navigation menu based on the user's authentication status.
 * If the user is authenticated, it shows links to the dashboard, completed tasks, and a logout option.
 * If the user is not authenticated, it shows links to the home, login, and signup pages.
 * The logout link triggers a logout function and redirects the user to the login page.
 * 
 * @component
 * @example
 * // Usage
 * <Header />
 * 
 * @returns {JSX.Element} The Header component with conditional navigation links.
 */
function Header() {
  const { isAuthenticated, logout } = useContext(AuthContext); // Access auth state and logout function

  return (
    <header className="app-header">
      <nav>
        <ul className="nav-links">
          {isAuthenticated ? (
            <>
              <li><a href="/dashboard">Dashboard</a></li>
              <li><a href="/completed">Completed Tasks</a></li>
              <li><a href="/" onClick={(e) => {
                e.preventDefault();
                logout(); // Trigger logout function
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
