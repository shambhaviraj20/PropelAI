import React, { useState } from 'react';
import axios from 'axios';
import './PitchAnalyzer.css';

const PitchAnalyzer = () => {
  const [pitchText, setPitchText] = useState('');
  const [analysis, setAnalysis] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleAnalyze = async () => {
    if (!pitchText.trim()) {
      alert('Please enter your pitch first!');
      return;
    }

    setLoading(true);
    
    try {
      const response = await axios.post(
        'http://localhost:5000/api/pitch/analyze',
        { pitch_text: pitchText },
        { headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }}
      );
      
      setAnalysis(response.data);
    } catch (error) {
      console.error('Analysis error:', error);
      alert('Error analyzing pitch. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const getScoreColor = (score) => {
    if (score >= 80) return '#4CAF50';
    if (score >= 60) return '#FF9800';
    return '#f44336';
  };

  return (
    <div className="pitch-container">
      <div className="pitch-header">
        <h1>💼 Pitch Analyzer</h1>
        <p>Get AI-powered feedback on your startup pitch</p>
      </div>

      <div className="pitch-content">
        <div className="pitch-input-section">
          <h2>Your Pitch</h2>
          <textarea
            value={pitchText}
            onChange={(e) => setPitchText(e.target.value)}
            placeholder="Paste your elevator pitch here...

Example:
We're building a platform that helps early-stage startups validate their ideas using AI. Our solution combines machine learning predictions with expert advisor insights to give founders actionable feedback. We've helped 100+ startups and are targeting a $5B market."
            maxLength="2000"
            rows="15"
          />
          <div className="char-count">
            {pitchText.length} / 2000 characters
          </div>
          
          <button 
            onClick={handleAnalyze} 
            disabled={loading}
            className="analyze-btn"
          >
            {loading ? 'Analyzing...' : 'Analyze Pitch 🚀'}
          </button>
        </div>

        {analysis && (
          <div className="analysis-results">
            <h2>📊 Analysis Results</h2>
            
            <div className="overall-score">
              <div className="score-circle" style={{ '--score-color': getScoreColor(analysis.overall_score) }}>
                <svg viewBox="0 0 100 100">
                  <circle cx="50" cy="50" r="45" />
                  <circle 
                    cx="50" 
                    cy="50" 
                    r="45" 
                    style={{
                      strokeDashoffset: `${283 - (283 * analysis.overall_score) / 100}`
                    }}
                  />
                </svg>
                <div className="score-value">
                  <span className="score-number">{analysis.overall_score}</span>
                  <span className="score-label">/ 100</span>
                </div>
              </div>
              <h3>Overall Score</h3>
            </div>

            <div className="score-breakdown">
              <div className="score-item">
                <div className="score-header">
                  <span>Clarity</span>
                  <span className="score-num">{analysis.clarity}%</span>
                </div>
                <div className="score-bar">
                  <div 
                    className="score-fill" 
                    style={{ 
                      width: `${analysis.clarity}%`,
                      background: getScoreColor(analysis.clarity)
                    }}
                  />
                </div>
              </div>

              <div className="score-item">
                <div className="score-header">
                  <span>Completeness</span>
                  <span className="score-num">{analysis.completeness}%</span>
                </div>
                <div className="score-bar">
                  <div 
                    className="score-fill" 
                    style={{ 
                      width: `${analysis.completeness}%`,
                      background: getScoreColor(analysis.completeness)
                    }}
                  />
                </div>
              </div>

              <div className="score-item">
                <div className="score-header">
                  <span>Persuasiveness</span>
                  <span className="score-num">{analysis.persuasiveness}%</span>
                </div>
                <div className="score-bar">
                  <div 
                    className="score-fill" 
                    style={{ 
                      width: `${analysis.persuasiveness}%`,
                      background: getScoreColor(analysis.persuasiveness)
                    }}
                  />
                </div>
              </div>
            </div>

            <div className="feedback-section">
              <div className="feedback-card strengths">
                <h3>✅ Strengths</h3>
                <ul>
                  {analysis.strengths.map((strength, idx) => (
                    <li key={idx}>{strength}</li>
                  ))}
                </ul>
              </div>

              <div className="feedback-card improvements">
                <h3>💡 Improvements</h3>
                <ul>
                  {analysis.improvements.map((improvement, idx) => (
                    <li key={idx}>{improvement}</li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="sentiment-badge" data-sentiment={analysis.sentiment.toLowerCase()}>
              Sentiment: {analysis.sentiment}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default PitchAnalyzer;