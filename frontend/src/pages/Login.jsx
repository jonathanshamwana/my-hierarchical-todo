import React, { useState, useContext } from 'react';
import { message } from 'antd';
import authApi from '../api/authApi';
import { AuthContext } from '../context/AuthContext';
import '../styles/Auth/Login.css';

/**
 * Login component provides a user login form with email and password fields.
 * On submission, it authenticates the user using the `loginUser` API function.
 * Displays success or error messages based on the login attempt.
 * 
 * @component
 * @example
 * // Usage
 * <Login />
 * 
 * @returns {JSX.Element} A login form component.
 */
function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { login } = useContext(AuthContext);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const userData = {
      email: email,
      password: password,
    };
    
    try {
      await authApi.LoginUser(userData, login);
      message.success('Successfully logged in');
    } catch (err) {
      message.error(err.message || 'Invalid email or password');
    }
  };

  return (
    <div className="login-container">
      <div className="animated-background"></div>
      <h2>Login</h2>
      <form onSubmit={handleSubmit}>
        <label>Email:</label>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <label>Password:</label>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <button type="submit">Login</button>
      </form>
    </div>
  );
}

export default Login;
