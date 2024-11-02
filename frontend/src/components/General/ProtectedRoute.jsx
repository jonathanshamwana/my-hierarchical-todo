import React, { useContext } from 'react';
import { Navigate } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';

/**
 * ProtectedRoute - A component that renders the given component if the user is authenticated.
 * If not authenticated, it redirects to the login page.
 * 
 * @param {React.Component} element - The component to render if the user is authenticated.
 * @returns {JSX.Element} - The protected component or a redirect to the login page.
 */
function ProtectedRoute({ element: Component }) {
  const { isAuthenticated } = useContext(AuthContext);

  return isAuthenticated ? <Component /> : <Navigate to="/login" />;
}

export default ProtectedRoute;
