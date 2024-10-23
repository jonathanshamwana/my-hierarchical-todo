import React, { useState } from 'react';
import { message } from 'antd';
import ParticlesBackground from './Home/ParticlesBackground';
import { signupUser } from '../api/authApi';
import { useNavigate } from 'react-router-dom'
import '../styles/Signup.css';

function Signup() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const userData = {
      username: name,
      email: email,
      password: password,
    };

    try {
      const response = await signupUser(userData);
      sessionStorage.setItem('token', response.token);

      message.success("Account created")
      navigate('/dashboard')
    } catch (err) {
      message.error("Failed to create account")
    }
  };

  return (
    <div className="signup-container">
      <div className="animated-background"></div>
      <ParticlesBackground />
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
