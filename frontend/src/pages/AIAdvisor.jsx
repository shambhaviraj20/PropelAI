import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import ReactMarkdown from 'react-markdown';
import './AIAdvisor.css';

const AIAdvisor = () => {
  const [question, setQuestion] = useState('');
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [suggestions, setSuggestions] = useState([]);
  const [typingText, setTypingText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [hasStartupData, setHasStartupData] = useState(false);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    checkStartupData();
    loadSuggestions();
    
    // Welcome message
    setMessages([{
      type: 'bot',
      content: '👋 **Welcome to AI Startup Advisor!**\n\nI analyze your startup using our trained XGBoost ML model and provide personalized advice.\n\nAsk me anything or click a suggestion below.',
      timestamp: new Date()
    }]);
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages, typingText]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const checkStartupData = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/advisor/my-startup', {
        headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
      });
      setHasStartupData(response.data.hasStartup);
    } catch (error) {
      console.error('Error checking startup data:', error);
    }
  };

  const loadSuggestions = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/advisor/suggestions', {
        headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
      });
      setSuggestions(response.data.suggestions);
    } catch (error) {
      console.error('Error loading suggestions:', error);
    }
  };

  const typeText = (text, callback) => {
    setIsTyping(true);
    setTypingText('');
    let index = 0;
    
    const interval = setInterval(() => {
      if (index < text.length) {
        setTypingText(prev => prev + text.charAt(index));
        index++;
      } else {
        clearInterval(interval);
        setIsTyping(false);
        callback();
      }
    }, 2); // Typing speed (lower = faster)
  };

  const handleAsk = async (customQuestion = null) => {
    const questionToAsk = customQuestion || question;
    
    if (!questionToAsk.trim()) return;

    // Add user message
    const userMessage = {
      type: 'user',
      content: questionToAsk,
      timestamp: new Date()
    };
    
    setMessages(prev => [...prev, userMessage]);
    setQuestion('');
    setLoading(true);

    try {
      const response = await axios.post(
        'http://localhost:5000/api/advisor/ask',
        { question: questionToAsk },
        { 
          headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` },
          timeout: 35000 // 35 second timeout
        }
      );

      // Type out the response with animation
      typeText(response.data.answer, () => {
        const botMessage = {
          type: 'bot',
          content: response.data.answer,
          timestamp: new Date(),
          confidence: response.data.confidence,
          insights: response.data.insights,
          recommendations: response.data.recommendations,
          stats: {
            characters: response.data.characterCount,
            words: response.data.wordCount
          }
        };
        setMessages(prev => [...prev, botMessage]);
        setTypingText('');
      });

    } catch (error) {
      console.error('Advisor error:', error);
      
      let errorContent = '⚠️ **Error:** ';
      
      if (error.code === 'ECONNABORTED') {
        errorContent += 'Request timed out. The ML service is taking too long to respond. Please try a simpler question or check if the ML service is running.';
      } else if (error.response) {
        errorContent += `Server error (${error.response.status}). ${error.response.data?.error || 'Please try again.'}`;
      } else if (error.request) {
        errorContent += 'Cannot connect to server. Make sure:\n\n1. Backend is running on port 5000\n2. ML service is running on port 8000\n3. Your network connection is active';
      } else {
        errorContent += error.message;
      }
      
      const errorMessage = {
        type: 'bot',
        content: errorContent,
        timestamp: new Date(),
        isError: true
      };
      setMessages(prev => [...prev, errorMessage]);
      setIsTyping(false);
      setTypingText('');
    } finally {
      setLoading(false);
    }
  };

  const handleSuggestionClick = (suggestion) => {
    handleAsk(suggestion);
  };

  const handleClear = () => {
    setMessages([{
      type: 'bot',
      content: '✨ **Conversation cleared!**\n\nReady for new questions. What would you like to know?',
      timestamp: new Date()
    }]);
    setTypingText('');
    setIsTyping(false);
    loadSuggestions();
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      if (!loading && !isTyping && question.trim()) {
        handleAsk();
      }
    }
  };

  return (
    <div className="advisor-container">
      <div className="advisor-header">
        <div className="header-content">
          <h1>🤖 AI Startup Advisor</h1>
          <p className="header-subtitle">
            {hasStartupData 
              ? '✅ Powered by your startup data + XGBoost ML model' 
              : '⚠️ Add startup data in Success Prediction for personalized advice'}
          </p>
        </div>
        <button onClick={handleClear} className="clear-btn" disabled={loading || isTyping}>
          🗑️ Clear Chat
        </button>
      </div>

      <div className="chat-container">
        <div className="messages-area">
          {messages.map((msg, idx) => (
            <div key={idx} className={`message ${msg.type} ${msg.isError ? 'error-message' : ''}`}>
              <div className="message-avatar">
                {msg.type === 'user' ? '👤' : msg.isError ? '⚠️' : '🤖'}
              </div>
              <div className="message-content">
                <ReactMarkdown>{msg.content}</ReactMarkdown>
                
                {msg.insights && msg.insights.length > 0 && (
                  <div className="message-insights">
                    <strong>💡 Insights:</strong>
                    <ul>
                      {msg.insights.map((insight, i) => (
                        <li key={i}>{insight}</li>
                      ))}
                    </ul>
                  </div>
                )}
                
                {msg.recommendations && msg.recommendations.length > 0 && (
                  <div className="message-recommendations">
                    <strong>🎯 Recommendations:</strong>
                    <ul>
                      {msg.recommendations.map((rec, i) => (
                        <li key={i}>{rec}</li>
                      ))}
                    </ul>
                  </div>
                )}
                
                <div className="message-time">
                  {msg.timestamp.toLocaleTimeString()}
                  {msg.confidence && (
                    <span className="message-confidence">
                      • {(msg.confidence * 100).toFixed(0)}% confidence
                    </span>
                  )}
                  {msg.stats && (
                    <span className="message-stats">
                      • {msg.stats.words} words
                    </span>
                  )}
                </div>
              </div>
            </div>
          ))}
          
          {isTyping && typingText && (
            <div className="message bot typing-message">
              <div className="message-avatar">🤖</div>
              <div className="message-content">
                <ReactMarkdown>{typingText}</ReactMarkdown>
                <span className="typing-cursor">▋</span>
              </div>
            </div>
          )}
          
          {loading && !isTyping && (
            <div className="message bot">
              <div className="message-avatar">🤖</div>
              <div className="message-content">
                <div className="typing-indicator">
                  <span></span>
                  <span></span>
                  <span></span>
                </div>
                <p className="loading-text">Analyzing with XGBoost ML model...</p>
              </div>
            </div>
          )}
          
          <div ref={messagesEndRef} />
        </div>

        {suggestions.length > 0 && messages.length === 1 && (
          <div className="suggestions-area">
            <p className="suggestions-label">💡 Suggested questions:</p>
            <div className="suggestions-grid">
              {suggestions.map((sug, idx) => (
                <button
                  key={idx}
                  onClick={() => handleSuggestionClick(sug)}
                  className="suggestion-btn"
                  disabled={loading || isTyping}
                >
                  {sug}
                </button>
              ))}
            </div>
          </div>
        )}

        <div className="input-area">
          <textarea
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Ask anything about startups... (Press Enter to send)"
            disabled={loading || isTyping}
            className="question-input"
            rows="3"
          />
          <button
            onClick={() => handleAsk()}
            disabled={loading || isTyping || !question.trim()}
            className="send-btn"
          >
            {loading || isTyping ? '⏳' : '🚀'} {loading || isTyping ? 'Generating...' : 'Ask'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default AIAdvisor;