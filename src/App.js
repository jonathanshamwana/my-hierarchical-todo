import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Dashboard from './components/Dashboard'; 
import Header from './components/Header';  
import Footer from './components/Footer';  
import Home from './components/Home';  
import Login from './components/Login';  
import Signup from './components/Signup';  

function App() {
    return (
      <Router>
        <Header />
        <main>
            <Routes>
            <Route path="/" element={<Home />} /> 
            <Route path="/dashboard" element={<Dashboard />} /> 
            <Route path="/login" element={<Login />} /> 
            <Route path="/signup" element={<Signup />} /> 
            </Routes>
        </main>
        <Footer />
      </Router>
    );
  }

export default App;
