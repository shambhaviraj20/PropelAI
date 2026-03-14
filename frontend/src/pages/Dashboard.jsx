import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import './Dashboard.css';

const Dashboard = () => {
  const [startupInfo, setStartupInfo] = useState(null);
  const [stats, setStats] = useState({
    predictions: 0,
    questions: 0
  });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/advisor/my-startup', {
        headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
      });
      
      if (response.data.hasStartup) {
        setStartupInfo(response.data.startup);
      }
    } catch (error) {
      console.error('Error loading data:', error);
    }
  };

  const features = [
    {
      icon: '🎯',
      title: 'Success Prediction',
      description: 'Get AI-powered insights about your startup\'s potential using machine learning',
      link: '/predict',
      color: '#0093E9' // Updated color
    },
    {
      icon: '🤖',
      title: 'AI Advisor',
      description: 'Ask questions and get personalized advice for your startup journey',
      link: '/advisor',
      color: '#34A89A' // Updated color
    },
    {
      icon: '💼',
      title: 'Pitch Analyzer',
      description: 'Improve your pitch with AI-powered feedback and scoring',
      link: '/pitch',
      color: '#f093fb' // Kept this one for variety
    },
    {
      icon: '💰',
      title: 'Investor Matching',
      description: 'Find the perfect investors matched to your startup profile',
      link: '/investors',
      color: '#4facfe' // Kept this one for variety
    }
  ];

  return (
    <div className="dashboard-container">
      <div className="dashboard-header">
        <div className="header-content">
          <h1 className="dashboard-title">Welcome to Propel Ai 🚀</h1>
          <p className="dashboard-subtitle">Your AI-powered startup growth platform</p>
        </div>
      </div>

      {startupInfo && (
        <div className="startup-overview-card">
          <div className="overview-header">
            <h2>📊 Your Startup</h2>
          </div>
          <div className="overview-stats">
            <div className="stat-item">
              <div className="stat-icon">🏢</div>
              <div className="stat-details">
                <span className="stat-label">Name</span>
                <span className="stat-value">{startupInfo.name}</span>
              </div>
            </div>
            <div className="stat-item">
              <div className="stat-icon">📁</div>
              <div className="stat-details">
                <span className="stat-label">Category</span>
                <span className="stat-value">{startupInfo.category}</span>
              </div>
            </div>
            <div className="stat-item">
              <div className="stat-icon">👥</div>
              <div className="stat-details">
                <span className="stat-label">Team Size</span>
                <span className="stat-value">{startupInfo.team_size}</span>
              </div>
            </div>
            <div className="stat-item">
              <div className="stat-icon">💵</div>
              <div className="stat-details">
                <span className="stat-label">Funding</span>
                <span className="stat-value">${startupInfo.funding?.total?.toLocaleString() || 0}</span>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="features-grid">
        {features.map((feature, index) => (
          <Link 
            to={feature.link} 
            key={index}
            className="feature-card"
            style={{ '--card-color': feature.color, animationDelay: `${index * 0.1}s` }}
          >
            <div className="feature-icon">{feature.icon}</div>
            <h3 className="feature-title">{feature.title}</h3>
            <p className="feature-description">{feature.description}</p>
            <div className="feature-arrow">→</div>
          </Link>
        ))}
      </div>

      {!startupInfo && (
        <div className="welcome-card">
          <h2>🎉 Get Started!</h2>
          <p>Add your startup details to unlock personalized AI insights</p>
          <Link to="/predict" className="cta-button">
            Add Startup Details
          </Link>
        </div>
      )}
    </div>
  );
};

export default Dashboard;