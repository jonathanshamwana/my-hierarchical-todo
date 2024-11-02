import React, { useState, useContext } from 'react';
import { message } from 'antd';
import authApi from '../api/authApi';
import { useNavigate } from 'react-router-dom';
import {AuthContext} from '../context/AuthContext';
import '../styles/Auth/Signup.css';

/**
 * Signup component provides a user registration form with name, email, and password fields.
 * On submission, it registers a new user using the `signupUser` API function and stores 
 * the user token in session storage, then navigates to the dashboard.
 * Displays success or error messages based on the signup attempt.
 * 
 * @component
 * @example
 * // Usage
 * <Signup />
 * 
 * @returns {JSX.Element} A signup form component.
 */
function Signup() {
  const { login } = useContext(AuthContext);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const userData = {
      username: name,
      email: email,
      password: password,
    };

    try {
      const response = await authApi.SignupUser(userData);
      login(response.token);

      message.success("Account created")
      navigate('/dashboard')
    } catch (err) {
      const errorMessage = err.message.includes('Email already exists') 
        ? "Email already exists. Please use another email."
        : "Failed to create account";
      message.error(errorMessage);
    }
  };

  return (
    <div className="signup-container">
      <div className="animated-background"></div>
      <h2>Sign Up</h2>
      <form onSubmit={handleSubmit}>
        <label>First name:</label>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
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
        <button type="submit">Sign Up</button>
      </form>
    </div>
  );
}

export default Signup;
