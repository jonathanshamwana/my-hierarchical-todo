import React, { useState } from 'react';
import ParticlesBackground from './Home/ParticlesBackground';
import { signupUser } from '../api/authApi';
import '../styles/Signup.css';

function Signup() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const userData = {
      username: name,
      email: email,
      password: password,
    };

    try {
      const response = await signupUser(userData);
      setSuccess(response.message);
      setError('');
    } catch (err) {
      setError(err.message);
      setSuccess(''); 
    }
  };

  return (
    <div className="signup-container">
      <div className="animated-background"></div>
      <ParticlesBackground />
      <h2>Sign Up</h2>
      {error && <p className="error">{error}</p>}
      {success && <p className="success">{success}</p>}
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
