import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './Dashboard.css';

const Dashboard = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [showSettingsModal, setShowSettingsModal] = useState(false);
  const [activeNavItem, setActiveNavItem] = useState('dashboard');
  const [currentView, setCurrentView] = useState('dashboard');
  const [sidebarVisible, setSidebarVisible] = useState(true);
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [notifications, setNotifications] = useState([
    {
      id: 1,
      title: "Patent Application Approved",
      message: "Your AI-Based Machine Learning System patent has been approved.",
      time: "2 hours ago",
      type: "success",
      read: false
    },
    {
      id: 2,
      title: "Office Action Required",
      message: "Response needed for application US17/456,789 by January 5, 2025.",
      time: "1 day ago",
      type: "warning",
      read: false
    },
    {
      id: 3,
      title: "Maintenance Fee Due",
      message: "Patent US10,123,456 maintenance fee due December 15, 2024.",
      time: "2 days ago",
      type: "urgent",
      read: true
    },
    {
      id: 4,
      title: "Search Alert",
      message: "New patents found matching your saved search 'AI machine learning'.",
      time: "3 days ago",
      type: "info",
      read: true
    },
    {
      id: 5,
      title: "Filing Status Update",
      message: "Application EP24789123 status changed to 'Under Review'.",
      time: "1 week ago",
      type: "info",
      read: true
    }
  ]);
  const [userProfile, setUserProfile] = useState({
    firstName: 'Vikas',
    lastName: 'Yadav',
    email: 'vikas.yadav@example.com',
    phone: '+91 (555) 123-4567',
    company: 'TechCorp Inc.',
    position: 'IP Manager',
    profilePic: null
  });
  const [settings, setSettings] = useState({
    darkMode: false
  });
  const navigate = useNavigate();

  // Apply settings effects only from saved settings
  useEffect(() => {
    const savedSettings = localStorage.getItem('userSettings');
    if (savedSettings) {
      const parsedSettings = JSON.parse(savedSettings);
      setSettings(parsedSettings);
      if (parsedSettings.darkMode) {
        document.body.classList.add('dark-mode');
      } else {
        document.body.classList.remove('dark-mode');
      }
    }
  }, []);

  // Save settings to localStorage only when explicitly saved
  const saveSettings = () => {
    localStorage.setItem('userSettings', JSON.stringify(settings));
    // Apply theme changes only when saved
    if (settings.darkMode) {
      document.body.classList.add('dark-mode');
    } else {
      document.body.classList.remove('dark-mode');
    }
    console.log('Saving settings:', settings);
    setShowSettingsModal(false);
  };

  // Cancel settings - revert to saved state
  const cancelSettings = () => {
    const savedSettings = localStorage.getItem('userSettings');
    if (savedSettings) {
      setSettings(JSON.parse(savedSettings));
    } else {
      setSettings({ darkMode: false });
    }
    setShowSettingsModal(false);
  };

  // Close notifications when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (showNotifications && !event.target.closest('.notification-container')) {
        setShowNotifications(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showNotifications]);

  const handleLogout = () => {
    setShowLogoutModal(true);
  };

  const handleProfileClick = () => {
    setShowProfileModal(true);
  };

  const handleSettingsClick = () => {
    setShowSettingsModal(true);
  };

  const handleNotificationClick = () => {
    setShowNotifications(!showNotifications);
  };

  const markNotificationAsRead = (id) => {
    setNotifications(prev => 
      prev.map(notif => 
        notif.id === id ? { ...notif, read: true } : notif
      )
    );
    // Hide dropdown after clicking on notification
    setShowNotifications(false);
  };

  const clearNotification = (id) => {
    setNotifications(prev => prev.filter(notif => notif.id !== id));
  };

  const clearAllNotifications = () => {
    setNotifications([]);
    // Hide dropdown after action
    setShowNotifications(false);
  };

  const markAllAsRead = () => {
    setNotifications(prev => 
      prev.map(notif => ({ ...notif, read: true }))
    );
    // Hide dropdown after action
    setShowNotifications(false);
  };

  const handleNavItemClick = (navItem) => {
    setActiveNavItem(navItem);
    setCurrentView(navItem);
  };

  const toggleSidebar = () => {
    setSidebarVisible(!sidebarVisible);
  };

  const handleSearch = async () => {
    if (!searchQuery.trim()) return;
    
    setIsSearching(true);
    setCurrentView('search');
    setActiveNavItem('search');
    
    // Simulate search API call
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Mock search results
      const mockResults = [
        {
          id: 1,
          title: "AI-Based Machine Learning System",
          patentNumber: "US10,123,456",
          inventor: "John Smith, Jane Doe",
          assignee: "TechCorp Inc.",
          filingDate: "2024-01-15",
          status: "Granted",
          abstract: "A system and method for implementing artificial intelligence algorithms in machine learning applications..."
        },
        {
          id: 2,
          title: "Quantum Computing Algorithm",
          patentNumber: "US10,234,567",
          inventor: "Dr. Alice Johnson",
          assignee: "Quantum Innovations LLC",
          filingDate: "2024-03-22",
          status: "Published",
          abstract: "Novel quantum computing algorithms for solving complex optimization problems..."
        },
        {
          id: 3,
          title: "Blockchain Security Protocol",
          patentNumber: "US10,345,678",
          inventor: "Robert Chen, Maria Garcia",
          assignee: "SecureChain Corp",
          filingDate: "2024-02-10",
          status: "Under Review",
          abstract: "Enhanced security protocols for blockchain-based transaction systems..."
        }
      ];
      
      // Filter results based on search query
      const filteredResults = mockResults.filter(result => 
        result.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        result.inventor.toLowerCase().includes(searchQuery.toLowerCase()) ||
        result.assignee.toLowerCase().includes(searchQuery.toLowerCase())
      );
      
      setSearchResults(filteredResults.length > 0 ? filteredResults : mockResults);
    } catch (error) {
      console.error('Search error:', error);
      setSearchResults([]);
    } finally {
      setIsSearching(false);
    }
  };

  const handleHeaderSearch = async () => {
    const headerSearchInput = document.querySelector('.header-search input');
    const headerQuery = headerSearchInput?.value || '';
    
    if (!headerQuery.trim()) return;
    
    setSearchQuery(headerQuery);
    setIsSearching(true);
    setCurrentView('search');
    setActiveNavItem('search');
    
    // Same search logic as above
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const mockResults = [
        {
          id: 1,
          title: "AI-Based Machine Learning System",
          patentNumber: "US10,123,456",
          inventor: "John Smith, Jane Doe",
          assignee: "TechCorp Inc.",
          filingDate: "2024-01-15",
          status: "Granted",
          abstract: "A system and method for implementing artificial intelligence algorithms in machine learning applications..."
        },
        {
          id: 2,
          title: "Quantum Computing Algorithm",
          patentNumber: "US10,234,567",
          inventor: "Dr. Alice Johnson",
          assignee: "Quantum Innovations LLC",
          filingDate: "2024-03-22",
          status: "Published",
          abstract: "Novel quantum computing algorithms for solving complex optimization problems..."
        },
        {
          id: 3,
          title: "Blockchain Security Protocol",
          patentNumber: "US10,345,678",
          inventor: "Robert Chen, Maria Garcia",
          assignee: "SecureChain Corp",
          filingDate: "2024-02-10",
          status: "Under Review",
          abstract: "Enhanced security protocols for blockchain-based transaction systems..."
        }
      ];
      
      const filteredResults = mockResults.filter(result => 
        result.title.toLowerCase().includes(headerQuery.toLowerCase()) ||
        result.inventor.toLowerCase().includes(headerQuery.toLowerCase()) ||
        result.assignee.toLowerCase().includes(headerQuery.toLowerCase())
      );
      
      setSearchResults(filteredResults.length > 0 ? filteredResults : mockResults);
    } catch (error) {
      console.error('Search error:', error);
      setSearchResults([]);
    } finally {
      setIsSearching(false);
    }
  };

  const handleProfilePictureChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setUserProfile(prev => ({
          ...prev,
          profilePic: e.target.result
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleProfileUpdate = (field, value) => {
    setUserProfile(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSettingUpdate = (field, value) => {
    setSettings(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const saveProfile = () => {
    // Here you would typically save to backend
    console.log('Saving profile:', userProfile);
    setShowProfileModal(false);
  };

  const renderContent = () => {
    switch (currentView) {
      case 'dashboard':
        return (
          <>
            <div className="welcome-section">
              <div>
                <p className="welcome-text">Welcome back,</p>
                <h1 className="welcome-title">Good Morning, {userProfile.firstName} {userProfile.lastName}.</h1>
              </div>
            </div>
            
            <div className="dashboard-main-content">
              <div className="dashboard-left-content">
                <div className="search-section">
                  <div className="search-bar">
                    <span className="search-icon">🔍</span>
                    <input
                      type="text"
                      placeholder="Search patents, trademarks, or technologies..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                    />
                    <button className="search-btn" onClick={handleSearch} disabled={isSearching}>
                      {isSearching ? 'Searching...' : 'Search'}
                    </button>
                  </div>
                  
                  <div className="quick-filters">
                    <button className="filter-btn">👁️ AI Patents</button>
                    <button className="filter-btn">🏢 TechCorp</button>
                    <button className="filter-btn">👤 Dr. Smith</button>
                    <button className="filter-btn">🌍 US Jurisdiction</button>
                  </div>
                </div>
                
                <div className="overview-section">
                  <h2>Overview</h2>
                  <div className="stats-grid">
                    <div className="stat-card">
                      <div className="stat-header">
                        <span>Active Subscriptions</span>
                        <span className="stat-icon">📑</span>
                      </div>
                      <div className="stat-value">12</div>
                      <div className="stat-label">Monitoring 3 new sectors</div>
                    </div>
                    
                    <div className="stat-card">
                      <div className="stat-header">
                        <span>Recent Filings</span>
                        <span className="stat-icon">📄</span>
                      </div>
                      <div className="stat-value">45</div>
                      <div className="stat-label">Last 24 hours: 5 new</div>
                    </div>
                    
                    <div className="stat-card">
                      <div className="stat-header">
                        <span>Open Alerts</span>
                        <span className="stat-icon">🔔</span>
                      </div>
                      <div className="stat-value">3</div>
                      <div className="stat-label">Critical actions required</div>
                    </div>
                  </div>
                  
                  <div className="portfolio-card">
                    <div className="portfolio-header">
                      <span>Portfolio Value</span>
                      <span className="portfolio-icon">💰</span>
                    </div>
                    <div className="portfolio-value">$1.2M</div>
                    <div className="portfolio-change">Up 7% this quarter</div>
                  </div>
                </div>
                
                <div className="map-section">
                  <h3>Geographical asset distribution map</h3>
                  <p className="map-subtitle">Global reach</p>
                  <p className="map-link">Click to view detailed regional analysis</p>
                </div>
              </div>
              
              <div className="dashboard-right-content">
                <div className="asset-distribution">
                  <h3>IP Asset Distribution</h3>
                  <div className="asset-map">
                    <div className="map-placeholder">
                      <div className="map-content">
                        <h4>Geographical IP asset distribution map</h4>
                        <p className="map-subtitle">Global reach</p>
                        <p className="map-link">Click to view detailed regional analysis</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </>
        );
      
      case 'search':
        return (
          <div className="content-view">
            <div className="view-header">
              <h1>Search Results</h1>
              <p>Advanced IP search and analysis tools</p>
            </div>
            
            {isSearching && (
              <div className="search-loading">
                <div className="loading-spinner"></div>
                <p>Searching patents and IP data...</p>
              </div>
            )}
            
            {!isSearching && searchResults.length > 0 && (
              <div className="search-results-container">
                <div className="results-header">
                  <h3>Search Results for "{searchQuery}"</h3>
                  <span className="results-count">{searchResults.length} results found</span>
                </div>
                <div className="results-list">
                  {searchResults.map(result => (
                    <div key={result.id} className="result-item">
                      <div className="result-header">
                        <h4 className="result-title">{result.title}</h4>
                        <span className={`result-status ${result.status.toLowerCase().replace(' ', '-')}`}>
                          {result.status}
                        </span>
                      </div>
                      <div className="result-details">
                        <div className="result-meta">
                          <span><strong>Patent No:</strong> {result.patentNumber}</span>
                          <span><strong>Filing Date:</strong> {new Date(result.filingDate).toLocaleDateString()}</span>
                        </div>
                        <div className="result-meta">
                          <span><strong>Inventor(s):</strong> {result.inventor}</span>
                          <span><strong>Assignee:</strong> {result.assignee}</span>
                        </div>
                      </div>
                      <div className="result-abstract">
                        <p>{result.abstract}</p>
                      </div>
                      <div className="result-actions">
                        <button className="action-btn primary">View Details</button>
                        <button className="action-btn secondary">Add to Watch List</button>
                        <button className="action-btn secondary">Download PDF</button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
            
            <div className="search-tools">
              <div className="advanced-search-form">
                <h3>Advanced Search</h3>
                <div className="search-form-grid">
                  <div className="form-group">
                    <label>Keywords</label>
                    <input type="text" placeholder="Enter keywords..." />
                  </div>
                  <div className="form-group">
                    <label>Patent Classification</label>
                    <select>
                      <option>Select classification...</option>
                      <option>A01 - Agriculture</option>
                      <option>B01 - Physical/Chemical</option>
                      <option>C01 - Chemistry</option>
                      <option>G06 - Computing</option>
                    </select>
                  </div>
                  <div className="form-group">
                    <label>Filing Date Range</label>
                    <div className="date-range">
                      <input type="date" />
                      <span>to</span>
                      <input type="date" />
                    </div>
                  </div>
                  <div className="form-group">
                    <label>Jurisdiction</label>
                    <select>
                      <option>All jurisdictions</option>
                      <option>United States</option>
                      <option>European Union</option>
                      <option>Japan</option>
                      <option>China</option>
                    </select>
                  </div>
                </div>
                <button className="search-btn advanced">Run Advanced Search</button>
              </div>
              
              <div className="recent-searches">
                <h3>Recent Searches</h3>
                <div className="search-history">
                  <div className="search-item">
                    <span className="search-query">AI machine learning patents</span>
                    <span className="search-date">Today, 2:30 PM</span>
                  </div>
                  <div className="search-item">
                    <span className="search-query">Blockchain technology USPTO</span>
                    <span className="search-date">Yesterday, 4:15 PM</span>
                  </div>
                  <div className="search-item">
                    <span className="search-query">Renewable energy patents 2024</span>
                    <span className="search-date">Dec 1, 10:20 AM</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );
      
      case 'filing':
        return (
          <div className="content-view">
            <div className="view-header">
              <h1>Filing Tracker</h1>
              <p>Monitor and track your IP filings</p>
            </div>
            <div className="filing-content">
              <div className="filing-stats">
                <div className="stat-card filing">
                  <h3>Active Filings</h3>
                  <div className="stat-number">23</div>
                  <p>Currently in progress</p>
                </div>
                <div className="stat-card filing">
                  <h3>Pending Actions</h3>
                  <div className="stat-number">8</div>
                  <p>Require attention</p>
                </div>
                <div className="stat-card filing">
                  <h3>Granted This Month</h3>
                  <div className="stat-number">5</div>
                  <p>Successfully granted</p>
                </div>
              </div>
              
              <div className="filing-table">
                <h3>Recent Filing Activity</h3>
                <table>
                  <thead>
                    <tr>
                      <th>Application No.</th>
                      <th>Title</th>
                      <th>Status</th>
                      <th>Filing Date</th>
                      <th>Next Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td>US17/123,456</td>
                      <td>AI-Based Image Recognition System</td>
                      <td><span className="status pending">Under Review</span></td>
                      <td>Nov 15, 2024</td>
                      <td>Response due Jan 15, 2025</td>
                    </tr>
                    <tr>
                      <td>US16/987,654</td>
                      <td>Quantum Computing Algorithm</td>
                      <td><span className="status approved">Granted</span></td>
                      <td>Aug 22, 2024</td>
                      <td>Maintenance fee due</td>
                    </tr>
                    <tr>
                      <td>EP24789123</td>
                      <td>Sustainable Energy Storage</td>
                      <td><span className="status review">Office Action</span></td>
                      <td>Sep 10, 2024</td>
                      <td>Response due Dec 10, 2024</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        );
      
      case 'legal':
        return (
          <div className="content-view">
            <div className="view-header">
              <h1>Legal Status</h1>
              <p>Monitor legal status and compliance</p>
            </div>
            <div className="legal-content">
              <div className="legal-summary">
                <div className="status-cards">
                  <div className="status-card active">
                    <h3>Active Patents</h3>
                    <div className="status-number">47</div>
                    <p>Currently protected</p>
                  </div>
                  <div className="status-card expiring">
                    <h3>Expiring Soon</h3>
                    <div className="status-number">3</div>
                    <p>Next 6 months</p>
                  </div>
                  <div className="status-card maintenance">
                    <h3>Maintenance Due</h3>
                    <div className="status-number">7</div>
                    <p>Action required</p>
                  </div>
                </div>
              </div>
              
              <div className="legal-alerts">
                <h3>Legal Alerts</h3>
                <div className="alert-list">
                  <div className="alert-item urgent">
                    <div className="alert-icon">⚠️</div>
                    <div className="alert-content">
                      <h4>Urgent: Patent US10,123,456 maintenance fee due</h4>
                      <p>Due date: December 15, 2024 (12 days remaining)</p>
                    </div>
                  </div>
                  <div className="alert-item warning">
                    <div className="alert-icon">⚡</div>
                    <div className="alert-content">
                      <h4>Office Action Response Required</h4>
                      <p>Application US17/456,789 - Response due January 5, 2025</p>
                    </div>
                  </div>
                  <div className="alert-item info">
                    <div className="alert-icon">ℹ️</div>
                    <div className="alert-content">
                      <h4>Patent Granted</h4>
                      <p>Congratulations! US16/789,123 has been granted</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );
      
      default:
        return null;
    }
  };

  const confirmLogout = () => {
    // Clear any stored user data/tokens here
    localStorage.removeItem('userToken');
    sessionStorage.clear();
    navigate('/');
  };

  const cancelLogout = () => {
    setShowLogoutModal(false);
  };

  return (
    <div className="dashboard-container">
      <aside className={`sidebar ${sidebarVisible ? 'visible' : 'hidden'}`}>
        <div className="sidebar-header">
          <button className="close-btn" onClick={toggleSidebar}>×</button>
        </div>
        
        <nav className="sidebar-nav">
          <button 
            className={`nav-item ${activeNavItem === 'dashboard' ? 'active' : ''}`}
            onClick={() => handleNavItemClick('dashboard')}
          >
            <span className="nav-icon">📊</span>
            <span className="nav-text">Dashboard</span>
          </button>
          <button 
            className={`nav-item ${activeNavItem === 'search' ? 'active' : ''}`}
            onClick={() => handleNavItemClick('search')}
          >
            <span className="nav-icon">🔍</span>
            <span className="nav-text">Search Results</span>
          </button>
          <button 
            className={`nav-item ${activeNavItem === 'filing' ? 'active' : ''}`}
            onClick={() => handleNavItemClick('filing')}
          >
            <span className="nav-icon">📋</span>
            <span className="nav-text">Filing Tracker</span>
          </button>
          <button 
            className={`nav-item ${activeNavItem === 'legal' ? 'active' : ''}`}
            onClick={() => handleNavItemClick('legal')}
          >
            <span className="nav-icon">📈</span>
            <span className="nav-text">Legal Status</span>
          </button>
        </nav>
        
        <div className="sidebar-footer">
          <button className="nav-item" onClick={handleSettingsClick}>
            <span className="nav-icon">⚙️</span>
            Settings
          </button>
          <button className="nav-item" onClick={handleLogout}>
            <span className="nav-icon">🚪</span>
            Log Out
          </button>
        </div>
      </aside>
      
      <main className={`main-content ${sidebarVisible ? 'with-sidebar' : 'full-width'}`}>
        <header className="dashboard-header">
          {!sidebarVisible && (
            <button className="menu-toggle" onClick={toggleSidebar}>
              <span className="hamburger-line"></span>
              <span className="hamburger-line"></span>
              <span className="hamburger-line"></span>
            </button>
          )}
          <div className="header-search">
            <span className="search-icon">🔍</span>
            <input 
              type="text" 
              placeholder="Search..." 
              onKeyPress={(e) => e.key === 'Enter' && handleHeaderSearch()}
            />
            <button className="header-search-btn" onClick={handleHeaderSearch}>
              Search
            </button>
          </div>
          <div className="header-actions">
            <div className="notification-container">
              <button className="notification-btn" onClick={handleNotificationClick}>
                🔔
                {notifications.filter(n => !n.read).length > 0 && (
                  <span className="notification-badge">
                    {notifications.filter(n => !n.read).length}
                  </span>
                )}
              </button>
              
              {showNotifications && (
                <div className="notification-dropdown">
                  <div className="notification-header">
                    <h4>Notifications</h4>
                    <div className="notification-actions">
                      <button className="action-link" onClick={markAllAsRead}>Mark all read</button>
                      <button className="action-link" onClick={clearAllNotifications}>Clear all</button>
                    </div>
                  </div>
                  
                  <div className="notification-list">
                    {notifications.length === 0 ? (
                      <div className="no-notifications">
                        <span>📭</span>
                        <p>No notifications</p>
                      </div>
                    ) : (
                      notifications.map(notification => (
                        <div 
                          key={notification.id} 
                          className={`notification-item ${notification.type} ${!notification.read ? 'unread' : ''}`}
                          onClick={() => markNotificationAsRead(notification.id)}
                        >
                          <div className="notification-content">
                            <div className="notification-title">{notification.title}</div>
                            <div className="notification-message">{notification.message}</div>
                            <div className="notification-time">{notification.time}</div>
                          </div>
                          <button 
                            className="notification-close"
                            onClick={(e) => {
                              e.stopPropagation();
                              clearNotification(notification.id);
                            }}
                          >
                            ×
                          </button>
                        </div>
                      ))
                    )}
                  </div>
                  
                  {notifications.length > 0 && (
                    <div className="notification-footer">
                      <button className="view-all-btn">View All Notifications</button>
                    </div>
                  )}
                </div>
              )}
            </div>
            <div className="user-avatar" onClick={handleProfileClick}>
              {userProfile.profilePic ? (
                <img src={userProfile.profilePic} alt="Profile" className="avatar-img" />
              ) : (
                `${userProfile.firstName[0]}${userProfile.lastName[0]}`
              )}
            </div>
          </div>
        </header>
        
        <div className="dashboard-content">
          {renderContent()}
        </div>
        
        <footer className="dashboard-footer">
          © 2025 Global IP Intelligence Platform. All rights reserved.
        </footer>
      </main>
      
      {/* Profile Modal */}
      {showProfileModal && (
        <div className="modal-overlay">
          <div className="modal-content profile-modal">
            <div className="modal-header">
              <h3>Edit Profile</h3>
              <button className="close-btn" onClick={() => setShowProfileModal(false)}>×</button>
            </div>
            <div className="modal-body">
              <div className="profile-section">
                <div className="profile-pic-section">
                  <div className="profile-pic-container">
                    {userProfile.profilePic ? (
                      <img src={userProfile.profilePic} alt="Profile" className="profile-pic" />
                    ) : (
                      <div className="profile-pic-placeholder">
                        {userProfile.firstName[0]}{userProfile.lastName[0]}
                      </div>
                    )}
                  </div>
                  <div className="profile-pic-controls">
                    <label htmlFor="profile-pic-input" className="upload-btn">
                      📷 Change Photo
                    </label>
                    <input
                      id="profile-pic-input"
                      type="file"
                      accept="image/*"
                      onChange={handleProfilePictureChange}
                      style={{ display: 'none' }}
                    />
                    {userProfile.profilePic && (
                      <button
                        className="remove-btn"
                        onClick={() => setUserProfile(prev => ({ ...prev, profilePic: null }))}
                      >
                        🗑️ Remove
                      </button>
                    )}
                  </div>
                </div>
                
                <div className="profile-form">
                  <div className="form-row">
                    <div className="form-group">
                      <label>First Name</label>
                      <input
                        type="text"
                        value={userProfile.firstName}
                        onChange={(e) => handleProfileUpdate('firstName', e.target.value)}
                      />
                    </div>
                    <div className="form-group">
                      <label>Last Name</label>
                      <input
                        type="text"
                        value={userProfile.lastName}
                        onChange={(e) => handleProfileUpdate('lastName', e.target.value)}
                      />
                    </div>
                  </div>
                  
                  <div className="form-group">
                    <label>Email</label>
                    <input
                      type="email"
                      value={userProfile.email}
                      onChange={(e) => handleProfileUpdate('email', e.target.value)}
                    />
                  </div>
                  
                  <div className="form-group">
                    <label>Phone</label>
                    <input
                      type="tel"
                      value={userProfile.phone}
                      onChange={(e) => handleProfileUpdate('phone', e.target.value)}
                    />
                  </div>
                  
                  <div className="form-group">
                    <label>Company</label>
                    <input
                      type="text"
                      value={userProfile.company}
                      onChange={(e) => handleProfileUpdate('company', e.target.value)}
                    />
                  </div>
                  
                  <div className="form-group">
                    <label>Position</label>
                    <input
                      type="text"
                      value={userProfile.position}
                      onChange={(e) => handleProfileUpdate('position', e.target.value)}
                    />
                  </div>
                </div>
              </div>
            </div>
            <div className="modal-footer">
              <button className="btn-cancel" onClick={() => setShowProfileModal(false)}>
                Cancel
              </button>
              <button className="btn-confirm" onClick={saveProfile}>
                Save Changes
              </button>
            </div>
          </div>
        </div>
      )}
      
      {/* Settings Modal */}
      {showSettingsModal && (
        <div className="modal-overlay">
          <div className="modal-content settings-modal">
            <div className="modal-header">
              <h3>Settings</h3>
              <button className="close-btn" onClick={() => setShowSettingsModal(false)}>×</button>
            </div>
            <div className="modal-body">
              <div className="settings-section">
                <h4>Appearance</h4>
                <div className="setting-item">
                  <div className="setting-info">
                    <span className="setting-title">Dark Mode</span>
                    <span className="setting-description">Use dark theme for better visibility</span>
                  </div>
                  <label className="toggle-switch">
                    <input
                      type="checkbox"
                      checked={settings.darkMode}
                      onChange={(e) => handleSettingUpdate('darkMode', e.target.checked)}
                    />
                    <span className="slider"></span>
                  </label>
                </div>
              </div>
            </div>
            <div className="modal-footer">
              <button className="btn-cancel" onClick={cancelSettings}>
                Cancel
              </button>
              <button className="btn-confirm" onClick={saveSettings}>
                Save Settings
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Logout Confirmation Modal */}
      {showLogoutModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">
              <h3>Confirm Logout</h3>
            </div>
            <div className="modal-body">
              <p>Are you sure you want to log out? Any unsaved changes will be lost.</p>
            </div>
            <div className="modal-footer">
              <button className="btn-cancel" onClick={cancelLogout}>
                Cancel
              </button>
              <button className="btn-confirm" onClick={confirmLogout}>
                Log Out
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
