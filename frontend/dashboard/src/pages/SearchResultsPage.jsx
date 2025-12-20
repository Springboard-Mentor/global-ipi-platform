import React, { useState, useEffect } from 'react';
import { ArrowLeft, History, Filter, Globe, Database, Share2, Copy, Download } from 'lucide-react';

const SearchResultsPage = ({ query, onBack, searchMode = 'api', setSearchMode }) => {
  const [results, setResults] = useState([]);
  const [filteredResults, setFilteredResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedPatent, setSelectedPatent] = useState(null);
  const [detailsLoading, setDetailsLoading] = useState(false);
  const [apiSearchCounter, setApiSearchCounter] = useState(0);
  const [localSearchCounter, setLocalSearchCounter] = useState(0);
  const [showHistory, setShowHistory] = useState(false);
  const [searchHistory, setSearchHistory] = useState([]);
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState({
    filingDateFrom: '',
    filingDateTo: '',
    searchText: '',
    assignee: '',
    inventor: '',
    status: '',
    jurisdiction: ''
  });
  const [expandedPatentId, setExpandedPatentId] = useState(null);
  const [copySuccess, setCopySuccess] = useState(false);

  const handleShareWhatsApp = (patent) => {
    const text = `Patent: ${patent.title || 'N/A'}\n` +
      `ID: ${patent.id || patent.ipRightIdentifier || 'N/A'}\n` +
      `Assignee: ${patent.assignee || 'N/A'}\n` +
      `Inventor: ${patent.inventor || 'N/A'}\n` +
      `Filing Date: ${patent.filingDate || 'N/A'}\n` +
      `Status: ${patent.status || 'N/A'}`;
    const url = `https://wa.me/?text=${encodeURIComponent(text)}`;
    window.open(url, '_blank');
  };

  const handleCopyToClipboard = async (patent) => {
    const text = `Patent Details\n\n` +
      `Title: ${patent.title || 'N/A'}\n` +
      `ID: ${patent.id || patent.ipRightIdentifier || 'N/A'}\n` +
      `Asset Number: ${patent.assetNumber || 'N/A'}\n` +
      `Assignee: ${patent.assignee || 'N/A'}\n` +
      `Inventor: ${patent.inventor || 'N/A'}\n` +
      `Jurisdiction: ${patent.jurisdiction || 'N/A'}\n` +
      `Filing Date: ${patent.filingDate || 'N/A'}\n` +
      `Status: ${patent.status || 'N/A'}\n` +
      `Abstract: ${patent.abstractText || 'N/A'}\n` +
      `Classification: ${patent.classInfo || 'N/A'}\n` +
      `Additional Details: ${patent.details || 'N/A'}`;
    
    try {
      await navigator.clipboard.writeText(text);
      setCopySuccess(true);
      setTimeout(() => setCopySuccess(false), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  const handleDownloadPatent = (patent) => {
    const content = `PATENT DETAILS\n\n` +
      `Title: ${patent.title || 'N/A'}\n` +
      `ID: ${patent.id || patent.ipRightIdentifier || 'N/A'}\n` +
      `Asset Number: ${patent.assetNumber || 'N/A'}\n` +
      `Type: ${patent.type || 'N/A'}\n` +
      `Assignee: ${patent.assignee || 'N/A'}\n` +
      `Inventor: ${patent.inventor || 'N/A'}\n` +
      `Jurisdiction: ${patent.jurisdiction || 'N/A'}\n` +
      `Filing Date: ${patent.filingDate || 'N/A'}\n` +
      `Status: ${patent.status || 'N/A'}\n\n` +
      `ABSTRACT:\n${patent.abstractText || 'N/A'}\n\n` +
      `CLASSIFICATION:\n${patent.classInfo || 'N/A'}\n\n` +
      `ADDITIONAL DETAILS:\n${patent.details || 'N/A'}\n\n` +
      `Source: ${patent.apiSource || 'N/A'}\n` +
      `Last Updated: ${patent.lastUpdated ? new Date(patent.lastUpdated).toLocaleString() : 'N/A'}`;
    
    const blob = new Blob([content], { type: 'text/plain' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `patent_${patent.id || patent.ipRightIdentifier || 'document'}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
  };

  useEffect(() => {
    // Load separate counters from localStorage
    const apiCounter = localStorage.getItem('apiSearchCounter');
    if (apiCounter) {
      setApiSearchCounter(parseInt(apiCounter, 10));
    }
    
    const localCounter = localStorage.getItem('localSearchCounter');
    if (localCounter) {
      setLocalSearchCounter(parseInt(localCounter, 10));
    }

    // Load search history
    const history = JSON.parse(localStorage.getItem('searchHistory') || '[]');
    setSearchHistory(history);

    if (query) {
      handleSearch(query);
    }
  }, [query]);

  // Re-trigger search when mode changes
  useEffect(() => {
    if (query && results.length > 0) {
      handleSearch(query);
    }
  }, [searchMode]);

  // Apply filters when results or filter criteria change
  useEffect(() => {
    applyFilters();
  }, [results, filters]);

  const applyFilters = () => {
    let filtered = [...results];

    // Filter by search text
    if (filters.searchText) {
      const searchLower = filters.searchText.toLowerCase();
      filtered = filtered.filter(patent => 
        (patent.title && patent.title.toLowerCase().includes(searchLower)) ||
        (patent.abstractText && patent.abstractText.toLowerCase().includes(searchLower)) ||
        (patent.ipRightIdentifier && patent.ipRightIdentifier.toLowerCase().includes(searchLower)) ||
        (patent.id && patent.id.toLowerCase().includes(searchLower))
      );
    }

    // Filter by assignee
    if (filters.assignee) {
      const assigneeLower = filters.assignee.toLowerCase();
      filtered = filtered.filter(patent => 
        patent.assignee && patent.assignee.toLowerCase().includes(assigneeLower)
      );
    }

    // Filter by inventor
    if (filters.inventor) {
      const inventorLower = filters.inventor.toLowerCase();
      filtered = filtered.filter(patent => 
        patent.inventor && patent.inventor.toLowerCase().includes(inventorLower)
      );
    }

    // Filter by status
    if (filters.status) {
      const statusLower = filters.status.toLowerCase();
      filtered = filtered.filter(patent => 
        patent.status && patent.status.toLowerCase().includes(statusLower)
      );
    }

    // Filter by jurisdiction
    if (filters.jurisdiction) {
      const jurisdictionLower = filters.jurisdiction.toLowerCase();
      filtered = filtered.filter(patent => 
        patent.jurisdiction && patent.jurisdiction.toLowerCase().includes(jurisdictionLower)
      );
    }

    // Filter by filing date from
    if (filters.filingDateFrom) {
      filtered = filtered.filter(patent => 
        patent.filingDate && new Date(patent.filingDate) >= new Date(filters.filingDateFrom)
      );
    }

    // Filter by filing date to
    if (filters.filingDateTo) {
      filtered = filtered.filter(patent => 
        patent.filingDate && new Date(patent.filingDate) <= new Date(filters.filingDateTo)
      );
    }

    setFilteredResults(filtered);
  };

  const resetFilters = () => {
    setFilters({
      filingDateFrom: '',
      filingDateTo: '',
      searchText: '',
      assignee: '',
      inventor: '',
      status: '',
      jurisdiction: ''
    });
  };

  const handleSearch = async (searchQuery) => {
    setLoading(true);
    try {
      if (searchMode === 'local') {
        // Search from local database
        const localDB = JSON.parse(localStorage.getItem('patentDatabase') || '[]');
        const searchResults = localDB.filter(patent => 
          (patent.ipRightIdentifier && patent.ipRightIdentifier.toLowerCase().includes(searchQuery.toLowerCase())) ||
          (patent.title && patent.title.toLowerCase().includes(searchQuery.toLowerCase())) ||
          (patent.abstractText && patent.abstractText.toLowerCase().includes(searchQuery.toLowerCase())) ||
          (patent.id && patent.id.toLowerCase().includes(searchQuery.toLowerCase()))
        );
        setResults(searchResults);
      } else {
        // Search from API
        const response = await fetch('http://localhost:8080/api/patents/search', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ query: searchQuery }),
        });
        if (response.ok) {
          const data = await response.json();
          setResults(data || []);
          
          // Store in local database
          const localDB = JSON.parse(localStorage.getItem('patentDatabase') || '[]');
          data.forEach(patent => {
            const exists = localDB.find(p => p.ipRightIdentifier === patent.ipRightIdentifier);
            if (!exists) {
              localDB.push(patent);
            }
          });
          localStorage.setItem('patentDatabase', JSON.stringify(localDB));
        } else {
          // Fallback to mock data if API fails
          console.warn('API failed, using mock data');
          const mockData = [{
            ipRightIdentifier: searchQuery,
            title: `Sample Patent: ${searchQuery}`,
            abstractText: `This is a sample patent abstract for the query: ${searchQuery}. This demonstrates the search functionality.`,
            filingDate: '2023-01-01'
          }];
          setResults(mockData);
        }
      }
    } catch (error) {
      console.error('Search failed:', error);
      // Fallback to mock data
      const mockData = [{
        ipRightIdentifier: searchQuery,
        title: `Sample Patent: ${searchQuery}`,
        abstractText: `This is a sample patent abstract for the query: ${searchQuery}. This demonstrates the search functionality.`,
        filingDate: '2023-01-01'
      }];
      setResults(mockData);
    } finally {
      setLoading(false);
    }

    // Store search results in localStorage
    const currentResults = results.length > 0 ? results : [{
      ipRightIdentifier: searchQuery,
      title: `Sample Patent: ${searchQuery}`,
      abstractText: `This is a sample patent abstract for the query: ${searchQuery}. This demonstrates the search functionality.`,
      filingDate: '2023-01-01'
    }];

    const searchHistoryData = JSON.parse(localStorage.getItem('searchHistory') || '[]');
    searchHistoryData.push({
      query: searchQuery,
      results: currentResults,
      timestamp: new Date().toISOString(),
      mode: searchMode
    });
    // Keep only last 10 searches
    if (searchHistoryData.length > 10) {
      searchHistoryData.shift();
    }
    localStorage.setItem('searchHistory', JSON.stringify(searchHistoryData));

    // Increment and store the appropriate counter based on search mode
    if (searchMode === 'api') {
      const newApiCounter = apiSearchCounter + 1;
      setApiSearchCounter(newApiCounter);
      localStorage.setItem('apiSearchCounter', newApiCounter.toString());
    } else {
      const newLocalCounter = localSearchCounter + 1;
      setLocalSearchCounter(newLocalCounter);
      localStorage.setItem('localSearchCounter', newLocalCounter.toString());
    }
  };

  const handleViewDetails = async (patent) => {
    const patentId = patent.ipRightIdentifier || patent.id;
    
    // Toggle: if already expanded, collapse it
    if (expandedPatentId === patentId) {
      setExpandedPatentId(null);
      setSelectedPatent(null);
      return;
    }

    setExpandedPatentId(patentId);
    setDetailsLoading(true);
    try {
      const response = await fetch(`http://localhost:8080/api/patents/${patentId}`);
      if (response.ok) {
        const fullPatent = await response.json();
        setSelectedPatent(fullPatent);
      } else {
        // Fallback: use the patent data we already have
        console.warn('API failed, using existing patent data');
        setSelectedPatent(patent);
      }
    } catch (error) {
      console.error('Error fetching patent details:', error);
      // Fallback: use the patent data we already have
      setSelectedPatent(patent);
    } finally {
      setDetailsLoading(false);
    }
  };

  return (
    <div className="p-6">
      {/* Header with Toggle Buttons */}
      <div className="bg-white rounded-2xl p-4 shadow mb-4">
        <div className="flex items-center justify-between">
          <button
            onClick={onBack}
            className="flex items-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg"
          >
            <ArrowLeft size={16} />
            Back to Dashboard
          </button>
          
          {/* Search Mode Toggle */}
          <div className="flex items-center gap-3">
            <span className="text-sm font-medium text-gray-700">Search Mode:</span>
            <button
              onClick={() => {
                setSearchMode('api');
                localStorage.setItem('searchMode', 'api');
              }}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all ${
                searchMode === 'api'
                  ? 'bg-blue-500 text-white shadow-md'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              <Globe size={16} />
              <span className="font-medium">API Search</span>
            </button>
            <button
              onClick={() => {
                setSearchMode('local');
                localStorage.setItem('searchMode', 'local');
              }}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all ${
                searchMode === 'local'
                  ? 'bg-purple-500 text-white shadow-md'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              <Database size={16} />
              <span className="font-medium">Local Database</span>
            </button>
          </div>
        </div>
      </div>

      {/* Search Info and Actions */}
      {query && (
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-4">
            <h1 className="text-2xl font-bold">Search Results for "{query}"</h1>
          </div>
          <div className="flex items-center gap-4">
            <div className="text-sm text-gray-600 bg-blue-50 px-3 py-1 rounded">
              API Searches: <span className="font-semibold">{apiSearchCounter}</span>
            </div>
            <div className="text-sm text-gray-600 bg-green-50 px-3 py-1 rounded">
              Local Searches: <span className="font-semibold">{localSearchCounter}</span>
            </div>
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center gap-2 px-4 py-2 bg-purple-100 hover:bg-purple-200 rounded-lg"
            >
              <Filter size={16} />
              {showFilters ? 'Hide' : 'Show'} Filters
            </button>
            <button
              onClick={() => setShowHistory(!showHistory)}
              className="flex items-center gap-2 px-4 py-2 bg-blue-100 hover:bg-blue-200 rounded-lg"
            >
              <History size={16} />
              {showHistory ? 'Hide' : 'View'} History
            </button>
          </div>
        </div>
      )}

      {showFilters && (
        <div className="mb-6 bg-gray-50 border border-gray-200 rounded-lg p-4">
          <h2 className="text-lg font-semibold mb-3">Filter Results</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Search in Results</label>
              <input
                type="text"
                value={filters.searchText}
                onChange={(e) => setFilters({...filters, searchText: e.target.value})}
                placeholder="Search title, ID, or abstract..."
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Assignee</label>
              <input
                type="text"
                value={filters.assignee}
                onChange={(e) => setFilters({...filters, assignee: e.target.value})}
                placeholder="e.g., PowerTech Industries"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Inventor</label>
              <input
                type="text"
                value={filters.inventor}
                onChange={(e) => setFilters({...filters, inventor: e.target.value})}
                placeholder="e.g., Emily Zhang"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
              <select
                value={filters.status}
                onChange={(e) => setFilters({...filters, status: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              >
                <option value="">All Statuses</option>
                <option value="Active">Active</option>
                <option value="Pending">Pending</option>
                <option value="Expired">Expired</option>
                <option value="Abandoned">Abandoned</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Jurisdiction</label>
              <input
                type="text"
                value={filters.jurisdiction}
                onChange={(e) => setFilters({...filters, jurisdiction: e.target.value})}
                placeholder="e.g., United States"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Filing Date From</label>
              <input
                type="date"
                value={filters.filingDateFrom}
                onChange={(e) => setFilters({...filters, filingDateFrom: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Filing Date To</label>
              <input
                type="date"
                value={filters.filingDateTo}
                onChange={(e) => setFilters({...filters, filingDateTo: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
          <div className="mt-4 flex gap-2">
            <button
              onClick={resetFilters}
              className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600"
            >
              Reset Filters
            </button>
            <div className="text-sm text-gray-600 flex items-center">
              Showing {filteredResults.length} of {results.length} results
            </div>
          </div>
        </div>
      )}

      {showHistory && (
        <div className="mb-6 bg-gray-50 border border-gray-200 rounded-lg p-4">
          <h2 className="text-lg font-semibold mb-3">Search History</h2>
          {searchHistory.length > 0 ? (
            <div className="space-y-2">
              {searchHistory.map((item, index) => (
                <div key={index} className="bg-white border border-gray-200 rounded p-3">
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="font-medium">Query: {item.query}</p>
                      <p className="text-sm text-gray-600">Date: {new Date(item.timestamp).toLocaleString()}</p>
                      <p className="text-sm text-gray-600">Results: {item.results.length} found</p>
                    </div>
                    <button
                      onClick={() => {
                        setResults(item.results);
                        setShowHistory(false);
                      }}
                      className="px-3 py-1 bg-green-500 text-white text-sm rounded hover:bg-green-600"
                    >
                      Load Results
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500">No search history available.</p>
          )}
        </div>
      )}

      {loading && <p className="text-center text-gray-600 py-4">Loading search results...</p>}
      
      {!query && !loading && (
        <div className="text-center py-12">
          <p className="text-gray-500 text-lg">Enter a search query to get started</p>
          <p className="text-gray-400 text-sm mt-2">Search using the search bar above</p>
        </div>
      )}

      <div>
        {filteredResults.length > 0 ? (
          <div className="grid gap-4">
            {filteredResults.map((patent, index) => {
              const patentId = patent.id || patent.ipRightIdentifier || index;
              const isExpanded = expandedPatentId === patentId;
              
              return (
                <div key={patentId} className="bg-white border border-gray-300 rounded-lg shadow-sm hover:shadow-md transition-shadow">
                  <div className="p-6">
                    <div className="flex justify-between items-start mb-4">
                      <h2 className="text-xl font-semibold text-gray-800">{patent.title || 'No Title'}</h2>
                      <span className="px-3 py-1 bg-blue-100 text-blue-800 text-xs rounded-full font-medium">
                        {patent.type || 'Patent'}
                      </span>
                    </div>
                    
                    {/* Main Info Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-4 bg-gray-50 p-4 rounded-lg">
                  {patent.id && (
                    <div className="text-sm">
                      <span className="font-semibold text-gray-700">ID:</span>{' '}
                      <span className="text-gray-600">{patent.id}</span>
                    </div>
                  )}
                  {patent.assetNumber && (
                    <div className="text-sm">
                      <span className="font-semibold text-gray-700">Asset Number:</span>{' '}
                      <span className="text-gray-600">{patent.assetNumber}</span>
                    </div>
                  )}
                  {patent.assignee && patent.assignee !== 'N/A' && (
                    <div className="text-sm">
                      <span className="font-semibold text-gray-700">Assignee:</span>{' '}
                      <span className="text-gray-600">{patent.assignee}</span>
                    </div>
                  )}
                  {patent.inventor && patent.inventor !== 'N/A' && (
                    <div className="text-sm">
                      <span className="font-semibold text-gray-700">Inventor:</span>{' '}
                      <span className="text-gray-600">{patent.inventor}</span>
                    </div>
                  )}
                  {patent.jurisdiction && patent.jurisdiction !== 'N/A' && (
                    <div className="text-sm">
                      <span className="font-semibold text-gray-700">Jurisdiction:</span>{' '}
                      <span className="text-gray-600">{patent.jurisdiction}</span>
                    </div>
                  )}
                  {patent.filingDate && (
                    <div className="text-sm">
                      <span className="font-semibold text-gray-700">Filing Date:</span>{' '}
                      <span className="text-gray-600">{patent.filingDate}</span>
                    </div>
                  )}
                  {patent.status && (
                    <div className="text-sm">
                      <span className="font-semibold text-gray-700">Status:</span>{' '}
                      <span className={`px-2 py-1 rounded text-xs ${
                        patent.status === 'Active' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                      }`}>
                        {patent.status}
                      </span>
                    </div>
                  )}
                  {patent.apiSource && (
                    <div className="text-sm">
                      <span className="font-semibold text-gray-700">Source:</span>{' '}
                      <span className="text-gray-600">{patent.apiSource}</span>
                    </div>
                  )}
                </div>

                <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-200">
                  <button 
                    onClick={() => handleViewDetails(patent)}
                    className={`px-4 py-2 rounded-lg transition-colors font-medium ${
                      isExpanded 
                        ? 'bg-gray-500 text-white hover:bg-gray-600' 
                        : 'bg-blue-500 text-white hover:bg-blue-600'
                    }`}
                  >
                    {isExpanded ? 'Hide Full Details' : 'View Full Details'}
                  </button>
                  {patent.lastUpdated && (
                    <span className="text-xs text-gray-400">
                      Updated: {new Date(patent.lastUpdated).toLocaleDateString()}
                    </span>
                  )}
                </div>
              </div>

              {/* Expanded Details Section - Shows inline below this patent */}
              {isExpanded && selectedPatent && (
                <div className="border-t-2 border-blue-300 bg-gradient-to-b from-blue-50 to-white p-6">
                  {detailsLoading ? (
                    <div className="text-center py-4">
                      <p className="text-gray-600">Loading complete details...</p>
                    </div>
                  ) : (
                    <>
                      <h3 className="text-xl font-bold mb-4 text-blue-900 flex items-center gap-2">
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                        Complete Patent Details
                      </h3>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                        {selectedPatent.id && (
                          <div className="bg-white p-3 rounded-lg shadow-sm">
                            <p className="text-xs font-semibold text-gray-500 mb-1">ID</p>
                            <p className="text-sm text-gray-800 font-medium">{selectedPatent.id}</p>
                          </div>
                        )}
                        {selectedPatent.type && (
                          <div className="bg-white p-3 rounded-lg shadow-sm">
                            <p className="text-xs font-semibold text-gray-500 mb-1">Type</p>
                            <p className="text-sm text-gray-800 font-medium">{selectedPatent.type}</p>
                          </div>
                        )}
                        {selectedPatent.assetNumber && (
                          <div className="bg-white p-3 rounded-lg shadow-sm">
                            <p className="text-xs font-semibold text-gray-500 mb-1">Asset Number</p>
                            <p className="text-sm text-gray-800 font-medium">{selectedPatent.assetNumber}</p>
                          </div>
                        )}
                        {selectedPatent.assignee && (
                          <div className="bg-white p-3 rounded-lg shadow-sm">
                            <p className="text-xs font-semibold text-gray-500 mb-1">Assignee</p>
                            <p className="text-sm text-gray-800 font-medium">{selectedPatent.assignee}</p>
                          </div>
                        )}
                        {selectedPatent.inventor && (
                          <div className="bg-white p-3 rounded-lg shadow-sm">
                            <p className="text-xs font-semibold text-gray-500 mb-1">Inventor</p>
                            <p className="text-sm text-gray-800 font-medium">{selectedPatent.inventor}</p>
                          </div>
                        )}
                        {selectedPatent.jurisdiction && (
                          <div className="bg-white p-3 rounded-lg shadow-sm">
                            <p className="text-xs font-semibold text-gray-500 mb-1">Jurisdiction</p>
                            <p className="text-sm text-gray-800 font-medium">{selectedPatent.jurisdiction}</p>
                          </div>
                        )}
                        {selectedPatent.filingDate && (
                          <div className="bg-white p-3 rounded-lg shadow-sm">
                            <p className="text-xs font-semibold text-gray-500 mb-1">Filing Date</p>
                            <p className="text-sm text-gray-800 font-medium">{selectedPatent.filingDate}</p>
                          </div>
                        )}
                        {selectedPatent.status && (
                          <div className="bg-white p-3 rounded-lg shadow-sm">
                            <p className="text-xs font-semibold text-gray-500 mb-1">Status</p>
                            <span className={`inline-block px-3 py-1 rounded-full text-sm font-semibold ${
                              selectedPatent.status === 'Active' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                            }`}>
                              {selectedPatent.status}
                            </span>
                          </div>
                        )}
                      </div>

                      {selectedPatent.title && (
                        <div className="mb-4 bg-blue-50 p-4 rounded-lg border border-blue-200">
                          <p className="text-xs font-semibold text-blue-900 mb-2">Title</p>
                          <p className="text-sm text-gray-800 font-medium leading-relaxed">{selectedPatent.title}</p>
                        </div>
                      )}

                      {selectedPatent.abstractText && (
                        <div className="mb-4 bg-white p-4 rounded-lg shadow-sm border border-gray-200">
                          <p className="text-xs font-semibold text-gray-700 mb-2">Abstract</p>
                          <p className="text-sm text-gray-700 leading-relaxed">{selectedPatent.abstractText}</p>
                        </div>
                      )}

                      {selectedPatent.classInfo && selectedPatent.classInfo !== 'N/A' && (
                        <div className="mb-4 bg-white p-4 rounded-lg shadow-sm border border-gray-200">
                          <p className="text-xs font-semibold text-gray-700 mb-2">Classification (CPC)</p>
                          <p className="text-sm text-gray-700">{selectedPatent.classInfo}</p>
                        </div>
                      )}

                      {selectedPatent.details && selectedPatent.details !== 'N/A' && (
                        <div className="mb-4 bg-white p-4 rounded-lg shadow-sm border border-gray-200">
                          <p className="text-xs font-semibold text-gray-700 mb-2">Additional Information</p>
                          <div className="text-sm text-gray-700 leading-relaxed">
                            {selectedPatent.details.split(';').map((detail, idx) => (
                              detail.trim() && (
                                <div key={idx} className="mb-1">
                                  {detail.trim()}
                                </div>
                              )
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Action Buttons */}
                      <div className="mb-4 flex gap-3 flex-wrap">
                        <button
                          onClick={() => handleShareWhatsApp(selectedPatent)}
                          className="flex items-center gap-2 px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors font-medium"
                        >
                          <Share2 size={16} />
                          Share on WhatsApp
                        </button>
                        <button
                          onClick={() => handleCopyToClipboard(selectedPatent)}
                          className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors font-medium"
                        >
                          <Copy size={16} />
                          {copySuccess ? 'Copied!' : 'Copy to Clipboard'}
                        </button>
                        <button
                          onClick={() => handleDownloadPatent(selectedPatent)}
                          className="flex items-center gap-2 px-4 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition-colors font-medium"
                        >
                          <Download size={16} />
                          Download Patent
                        </button>
                      </div>

                      <div className="flex justify-between items-center pt-4 border-t border-blue-200">
                        {selectedPatent.apiSource && (
                          <span className="text-xs text-gray-500 bg-white px-3 py-1 rounded-full">
                            Source: {selectedPatent.apiSource}
                          </span>
                        )}
                        {selectedPatent.lastUpdated && (
                          <span className="text-xs text-gray-500 bg-white px-3 py-1 rounded-full">
                            Last Updated: {new Date(selectedPatent.lastUpdated).toLocaleString()}
                          </span>
                        )}
                      </div>
                    </>
                  )}
                </div>
              )}
            </div>
              );
            })}
          </div>
        ) : (
          !loading && query && <p className="text-center text-gray-500 py-8">No results found for "{query}"</p>
        )}
      </div>
    </div>
  );
};

export default SearchResultsPage;