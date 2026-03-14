import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/Shared/Navbar';
import Dashboard from './pages/Dashboard';
import SuccessPrediction from './pages/SuccessPrediction';
import InvestorMatching from './pages/InvestorMatching';
import PitchAnalyzer from './pages/PitchAnalyzer';
import AIAdvisor from './pages/AIAdvisor';  // ADD THIS
import Login from './pages/Login';
import './App.css';

function App() {
  const [isAuthenticated, setIsAuthenticated] = React.useState(false);

  return (
    <Router>
      <div className="App">
        {isAuthenticated && <Navbar />}
        <Routes>
          <Route path="/login" element={<Login setAuth={setIsAuthenticated} />} />
          <Route 
            path="/dashboard" 
            element={isAuthenticated ? <Dashboard /> : <Navigate to="/login" />} 
          />
          <Route 
            path="/predict" 
            element={isAuthenticated ? <SuccessPrediction /> : <Navigate to="/login" />} 
          />
          <Route 
            path="/investors" 
            element={isAuthenticated ? <InvestorMatching /> : <Navigate to="/login" />} 
          />
          <Route 
            path="/pitch" 
            element={isAuthenticated ? <PitchAnalyzer /> : <Navigate to="/login" />} 
          />
          <Route 
            path="/advisor" 
            element={isAuthenticated ? <AIAdvisor /> : <Navigate to="/login" />} 
          />
          <Route path="/" element={<Navigate to="/login" />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;