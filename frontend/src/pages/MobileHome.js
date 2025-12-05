import React, { useState } from 'react';
import './MobileHome.css';

const MobileHome = () => {
  const [activeTab, setActiveTab] = useState('All');

  return (
    <div className="mobile-container">
      <header className="mobile-header">
        <div className="mobile-logo">
          <div className="mobile-logo-icon">
            <svg viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2">
              <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
            </svg>
          </div>
        </div>
        <button className="notification-icon">🔔</button>
      </header>

      <div className="mobile-search">
        <span className="search-icon">🔍</span>
        <input type="text" placeholder="Search patents or trademarks" />
      </div>

      <div className="mobile-tabs">
        {['All', 'Patents', 'Trademarks', 'Latest Filings'].map((tab) => (
          <button
            key={tab}
            className={`tab-btn ${activeTab === tab ? 'active' : ''}`}
            onClick={() => setActiveTab(tab)}
          >
            {tab}
          </button>
        ))}
      </div>

      <div className="mobile-content">
        <div className="section-header">
          <h2>Global IP Hotspots</h2>
          <button className="view-map">View Map</button>
        </div>

        <div className="hotspot-map">
          <div className="map-placeholder">🗺️</div>
          <p className="map-description">
            Identifying key regions for innovation and protection.
          </p>
        </div>

        <div className="info-card">
          <div className="info-icon">📄</div>
          <div className="info-content">
            <h3>Active Subscriptions</h3>
            <p>You have 7 active tracking subscriptions.</p>
          </div>
          <span className="arrow">→</span>
        </div>

        <div className="info-card">
          <div className="info-icon">💡</div>
          <div className="info-content">
            <h3>Recent Filings</h3>
            <p>3 new patent filings detected this week.</p>
          </div>
          <span className="arrow">→</span>
        </div>

        <div className="info-card">
          <div className="info-icon">⚠️</div>
          <div className="info-content">
            <h3>Pending Alerts</h3>
            <p>3 critical alerts requiring your attention.</p>
          </div>
          <span className="arrow">→</span>
        </div>
      </div>

      <nav className="mobile-nav">
        <button className="nav-link active">
          <span className="nav-icon">🏠</span>
          <span className="nav-label">Home</span>
        </button>
        <button className="nav-link">
          <span className="nav-icon">🔍</span>
          <span className="nav-label">Search</span>
        </button>
        <button className="nav-link">
          <span className="nav-icon">📋</span>
          <span className="nav-label">Subscriptions</span>
        </button>
        <button className="nav-link">
          <span className="nav-icon notification-badge">🔔</span>
          <span className="nav-label">Alerts</span>
        </button>
        <button className="nav-link">
          <span className="nav-icon">👤</span>
          <span className="nav-label">Profile</span>
        </button>
      </nav>
    </div>
  );
};

export default MobileHome;
