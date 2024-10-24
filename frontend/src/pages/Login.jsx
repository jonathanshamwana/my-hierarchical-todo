import React, { useState } from 'react';
import ParticlesBackground from '../components/General/ParticlesBackground';
import { loginUser } from '../api/authApi';
import '../styles/Login.css';

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();

    const userData = {
      email: email,
      password: password,
    };
    
    try {
      const response = await loginUser(userData);
      setSuccess(response.message);
      setError('');
    } catch (err) {
      setError(err.message);
      setSuccess(''); 
    }
  };

  return (
    <div className="login-container">
      <div className="animated-background"></div>
      <ParticlesBackground />
      <h2>Login</h2>
      {error && <p className="error">{error}</p>}
      {success && <p className="success">{success}</p>}
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
