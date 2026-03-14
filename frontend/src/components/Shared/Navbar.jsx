import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import './Navbar.css';
import logo from "../../assets/logo1.png";


const Navbar = () => {
  const location = useLocation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const navItems = [
    { path: '/dashboard', icon: '🏠', label: 'Dashboard' },
    { path: '/predict', icon: '🎯', label: 'Predict' },
    { path: '/advisor', icon: '🤖', label: 'AI Advisor' },
    { path: '/pitch', icon: '💼', label: 'Pitch' },
    { path: '/investors', icon: '💰', label: 'Investors' },
  ];

  return (
    <nav className="modern-navbar">
      <div className="navbar-container">
        <Link to="/dashboard" className="navbar-brand">
          <img src={logo} alt="Propel AI Logo" />
          <span className="brand-text">Propel AI</span>
        </Link>

        <button 
          className="mobile-menu-btn"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
        >
          ☰
        </button>

        <ul className={`navbar-menu ${isMenuOpen ? 'active' : ''}`}>
          {navItems.map((item) => (
            <li key={item.path}>
              <Link 
                to={item.path} 
                className={`nav-link ${location.pathname === item.path ? 'active' : ''}`}
                onClick={() => setIsMenuOpen(false)}
              >
                <span className="nav-icon">{item.icon}</span>
                <span className="nav-label">{item.label}</span>
              </Link>
            </li>
          ))}
          <li>
            <Link 
              to="/login" 
              className="nav-link logout"
              onClick={() => {
                localStorage.removeItem('token');
                setIsMenuOpen(false);
              }}
            >
              <span className="nav-icon">🚪</span>
              <span className="nav-label">Logout</span>
            </Link>
          </li>
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;
