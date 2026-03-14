import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './InvestorMatching.css';

const InvestorMatching = () => {
  const [investors, setInvestors] = useState([]);
  const [filteredInvestors, setFilteredInvestors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [hasStartupData, setHasStartupData] = useState(false);
  const [startupData, setStartupData] = useState(null);
  const navigate = useNavigate();

  // Filters
  const [filters, setFilters] = useState({
    stage: 'all',
    minMatch: 0,
    type: 'all',
    sector: 'all'
  });

  useEffect(() => {
    fetchInvestors();
  }, []);

  const fetchInvestors = async () => {
    try {
      console.log('[FRONTEND] Fetching investors...');
      
      const token = localStorage.getItem('token');
      if (!token) {
        console.error('[FRONTEND] ❌ No token found, redirecting to login');
        navigate('/login');
        return;
      }
      
      console.log('[FRONTEND] Token exists:', token.substring(0, 30) + '...');
      
      const response = await axios.get('http://localhost:5000/api/investors/matches', {
        headers: { 
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      console.log('[FRONTEND] ✅ Response received:', response.data);
      console.log('[FRONTEND] Investors count:', response.data.investors?.length || 0);
      console.log('[FRONTEND] Startup profile:', response.data.startupProfile);

      // CHECK IF INVESTORS ARRAY EXISTS AND HAS LENGTH
      if (response.data.investors && 
          Array.isArray(response.data.investors) && 
          response.data.investors.length > 0) {
        
        console.log('[FRONTEND] ✅ Setting investors:', response.data.investors.length);
        setInvestors(response.data.investors);
        setFilteredInvestors(response.data.investors);
        setHasStartupData(true);
        setStartupData(response.data.startupProfile);
        
      } else {
        // NO INVESTORS MEANS NO STARTUP DATA
        console.log('[FRONTEND] ⚠️ No investors returned - startup data missing');
        console.log('[FRONTEND] Message:', response.data.message);
        setHasStartupData(false);
        setInvestors([]);
        setFilteredInvestors([]);
      }
      
    } catch (err) {
      console.error('[FRONTEND] ❌ Error fetching investors:', err);
      console.error('[FRONTEND] Error details:', {
        message: err.message,
        response: err.response?.data,
        status: err.response?.status
      });
      
      if (err.response?.status === 401) {
        console.log('[FRONTEND] Unauthorized - redirecting to login');
        navigate('/login');
      } else {
        setError(err.response?.data?.error || err.message || 'Failed to load investors');
        setHasStartupData(false);
      }
    } finally {
      setLoading(false);
    }
  };

  const applyFilters = () => {
    let filtered = [...investors];

    // Filter by stage
    if (filters.stage !== 'all') {
      filtered = filtered.filter(inv => 
        inv.stage.toLowerCase().includes(filters.stage.toLowerCase())
      );
    }

    // Filter by minimum match score
    filtered = filtered.filter(inv => inv.matchScore >= filters.minMatch);

    // Filter by type
    if (filters.type !== 'all') {
      filtered = filtered.filter(inv => 
        inv.type.toLowerCase() === filters.type.toLowerCase()
      );
    }

    // Filter by sector
    if (filters.sector !== 'all') {
      filtered = filtered.filter(inv => 
        inv.focus.some(f => f.toLowerCase().includes(filters.sector.toLowerCase()))
      );
    }

    console.log('[FRONTEND] Filters applied, results:', filtered.length);
    setFilteredInvestors(filtered);
  };

  const resetFilters = () => {
    setFilters({
      stage: 'all',
      minMatch: 0,
      type: 'all',
      sector: 'all'
    });
    setFilteredInvestors(investors);
    console.log('[FRONTEND] Filters reset');
  };

  const getMatchClass = (score) => {
    if (score >= 90) return 'perfect';
    if (score >= 75) return 'good';
    if (score >= 60) return 'moderate';
    return 'low';
  };

  const getMatchLabel = (score) => {
    if (score >= 90) return 'Perfect';
    if (score >= 75) return 'Good';
    if (score >= 60) return 'Moderate';
    return 'Low';
  };

  if (loading) {
    return (
      <div className="investor-matching-container">
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p className="loading-text">Finding your perfect investors...</p>
        </div>
      </div>
    );
  }

  if (!hasStartupData) {
    return (
      <div className="investor-matching-container">
        <div className="empty-state">
          <div className="empty-icon">📊</div>
          <h2>No Startup Data Found</h2>
          <p>Please complete your startup profile to get matched with investors</p>
          <button 
            className="add-data-btn"
            onClick={() => navigate('/predict')}
          >
            📝 Complete Profile in Success Prediction
          </button>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="investor-matching-container">
        <div className="error-state">
          <div className="error-icon">⚠️</div>
          <h2>Oops! Something went wrong</h2>
          <p>{error}</p>
          <button 
            className="add-data-btn"
            onClick={() => window.location.reload()}
          >
            🔄 Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="investor-matching-container">
      {/* Header */}
      <div className="investor-header">
        <h1>💼 Investor Matching</h1>
        <p>AI-powered matches based on your startup profile</p>
      </div>

      {/* Stats Cards */}
      {startupData && (
        <div className="stats-container">
          <div className="stat-card">
            <div className="stat-icon">🎯</div>
            <h3>{filteredInvestors.length}</h3>
            <p>Matched Investors</p>
          </div>
          <div className="stat-card">
            <div className="stat-icon">🏢</div>
            <h3>{startupData.name}</h3>
            <p>Your Startup</p>
          </div>
          <div className="stat-card">
            <div className="stat-icon">💰</div>
            <h3>${(startupData.funding?.total || 0).toLocaleString()}</h3>
            <p>Current Funding</p>
          </div>
          <div className="stat-card">
            <div className="stat-icon">📈</div>
            <h3>{startupData.category}</h3>
            <p>Category</p>
          </div>
        </div>
      )}

      {/* Filters */}
      <div className="filters-section">
        <h2>🔍 Filter Investors</h2>
        <div className="filters-grid">
          <div className="filter-group">
            <label>Stage</label>
            <select 
              value={filters.stage}
              onChange={(e) => setFilters({...filters, stage: e.target.value})}
            >
              <option value="all">All Stages</option>
              <option value="pre-seed">Pre-seed</option>
              <option value="seed">Seed</option>
              <option value="series-a">Series A</option>
              <option value="series-b">Series B+</option>
            </select>
          </div>

          <div className="filter-group">
            <label>Minimum Match</label>
            <select 
              value={filters.minMatch}
              onChange={(e) => setFilters({...filters, minMatch: parseInt(e.target.value)})}
            >
              <option value="0">All Matches</option>
              <option value="90">90%+ (Perfect)</option>
              <option value="75">75%+ (Good)</option>
              <option value="60">60%+ (Moderate)</option>
            </select>
          </div>

          <div className="filter-group">
            <label>Investor Type</label>
            <select 
              value={filters.type}
              onChange={(e) => setFilters({...filters, type: e.target.value})}
            >
              <option value="all">All Types</option>
              <option value="venture capital">Venture Capital</option>
              <option value="accelerator">Accelerator</option>
            </select>
          </div>

          <div className="filter-group">
            <label>Sector Focus</label>
            <select 
              value={filters.sector}
              onChange={(e) => setFilters({...filters, sector: e.target.value})}
            >
              <option value="all">All Sectors</option>
              <option value="technology">Technology</option>
              <option value="ai">AI/ML</option>
              <option value="fintech">Fintech</option>
              <option value="healthcare">Healthcare</option>
              <option value="saas">SaaS</option>
            </select>
          </div>
        </div>

        <div className="filter-actions">
          <button className="filter-btn reset-filter-btn" onClick={resetFilters}>
            Reset Filters
          </button>
          <button className="filter-btn apply-filter-btn" onClick={applyFilters}>
            Apply Filters
          </button>
        </div>
      </div>

      {/* Investors Grid */}
      {filteredInvestors.length === 0 ? (
        <div className="empty-state">
          <div className="empty-icon">🔍</div>
          <h2>No investors match your filters</h2>
          <p>Try adjusting your filter criteria</p>
          <button className="add-data-btn" onClick={resetFilters}>
            Reset Filters
          </button>
        </div>
      ) : (
        <div className="investors-grid">
          {filteredInvestors.map((investor, index) => (
            <div key={index} className="investor-card">
              {/* Match Score Badge */}
              <div className={`match-score ${getMatchClass(investor.matchScore)}`}>
                <div className="score-number">{investor.matchScore}%</div>
                <div className="score-label">{getMatchLabel(investor.matchScore)}</div>
              </div>

              {/* Investor Logo/Icon */}
              <div className="investor-logo">{investor.logo}</div>

              {/* Investor Name */}
              <h3 className="investor-name">{investor.name}</h3>

              {/* Investor Type */}
              <span className="investor-type">{investor.type}</span>

              {/* Description */}
              <p className="investor-description">{investor.description}</p>

              {/* Details */}
              <div className="investor-details">
                <div className="detail-row">
                  <span className="detail-label">💼 Stage</span>
                  <span className="detail-value">{investor.stage}</span>
                </div>

                <div className="detail-row">
                  <span className="detail-label">💰 Ticket Size</span>
                  <span className="detail-value highlight">{investor.ticketSize}</span>
                </div>

                <div className="detail-row">
                  <span className="detail-label">🌍 Location</span>
                  <span className="detail-value">{investor.location}</span>
                </div>

                <div className="detail-row">
                  <span className="detail-label">📊 Portfolio</span>
                  <span className="detail-value">{investor.portfolio}+ companies</span>
                </div>
              </div>

              {/* Focus Areas */}
              <div className="focus-areas">
                {investor.focus.map((area, idx) => (
                  <span key={idx} className="focus-tag">{area}</span>
                ))}
              </div>

              {/* Why This Match */}
              <div className="match-reason">
                <strong>💡 Why This Match?</strong>
                <p>{investor.whyMatch}</p>
              </div>

              {/* Contact Button */}
              <button className="contact-btn">
                📧 Get Introduction
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default InvestorMatching;