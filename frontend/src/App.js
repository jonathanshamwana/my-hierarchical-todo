import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Dashboard from './pages/Dashboard'; 
import Header from './components/General/Header';  
import Footer from './components/General/Footer';  
import Home from './pages/Home';  
import Login from './pages/Login';  
import Signup from './pages/Signup';  
import CompletedTasks from './pages/CompletedTasks';
import IntegrationsDashboard from './pages/IntegrationsDashboard';
import ProtectedRoute from './components/General/ProtectedRoute';

function App() {
    return (
      <Router>
        <Header />
        <main>
        <Routes>
              <Route path="/" element={<Home />} /> 
              <Route path="/dashboard" element={<ProtectedRoute element={Dashboard} />} /> 
              <Route path="/login" element={<Login />} /> 
              <Route path="/signup" element={<Signup />} /> 
              <Route path="/completed" element={<ProtectedRoute element={CompletedTasks} />} />
              <Route path="/integrations" element={<ProtectedRoute element={IntegrationsDashboard} />} />
            </Routes>
        </main>
        <Footer />
      </Router>
    );
  }

export default App;
