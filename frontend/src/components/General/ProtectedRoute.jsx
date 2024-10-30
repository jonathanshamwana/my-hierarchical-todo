import React from 'react';
import { Navigate } from 'react-router-dom';

/**
 * ProtectedRoute component - Restricts access to routes based on authentication status.
 * If the user is authenticated (token present), renders the provided component.
 * If not, redirects the user to the login page.
 * 
 * @component
 * @param {Object} props - Component props
 * @param {React.Component} props.element - The component to render if authenticated
 * @returns {JSX.Element} Rendered component or redirect to login
 * 
 * @example
 * <ProtectedRoute element={Dashboard} />
 */
const ProtectedRoute = ({ element: Component }) => {
  const token = sessionStorage.getItem('token'); // Check for authentication token

  return token ? <Component /> : <Navigate to="/login" />; // Render component or redirect
};

export default ProtectedRoute;
