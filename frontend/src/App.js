import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Dashboard from './components/Dashboard'; 
import Header from './components/Header';  
import Footer from './components/Footer';  
import Home from './components/Home';  
import Login from './components/Login';  
import Signup from './components/Signup';  
import CompletedTasks from './components/CompletedTasks';
import Integrations from './components/Integrations';

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
              <Route path="/completed" element={<CompletedTasks />} />
              <Route path="/integrations" element={<Integrations />} />
            </Routes>
        </main>
        <Footer />
      </Router>
    );
  }

export default App;
