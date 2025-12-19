import React, { useState, useEffect } from 'react';
import { ArrowLeft, History, Filter, Globe, Database } from 'lucide-react';

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
    searchText: ''
  });

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
      searchText: ''
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

  const handleViewDetails = async (ipRightIdentifier) => {
    setDetailsLoading(true);
    try {
      const response = await fetch(`http://localhost:8080/api/patents/${ipRightIdentifier}`);
      if (response.ok) {
        const patent = await response.json();
        setSelectedPatent(patent);
      } else {
        // Fallback to mock data
        console.warn('API failed, using mock data for details');
        const mockPatent = {
          ipRightIdentifier: ipRightIdentifier,
          title: `Detailed Patent: ${ipRightIdentifier}`,
          abstractText: `This is detailed patent information for: ${ipRightIdentifier}. Additional details would be fetched from the API.`,
          filingDate: '2023-01-01'
        };
        setSelectedPatent(mockPatent);
      }
    } catch (error) {
      console.error('Error fetching patent details:', error);
      // Fallback to mock data
      const mockPatent = {
        ipRightIdentifier: ipRightIdentifier,
        title: `Detailed Patent: ${ipRightIdentifier}`,
        abstractText: `This is detailed patent information for: ${ipRightIdentifier}. Additional details would be fetched from the API.`,
        filingDate: '2023-01-01'
      };
      setSelectedPatent(mockPatent);
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
            {filteredResults.map((patent, index) => (
              <div key={patent.id || patent.ipRightIdentifier || index} className="bg-white border border-gray-300 rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow">
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

                {/* Abstract */}
                {patent.abstractText && (
                  <div className="mb-4">
                    <p className="text-sm font-semibold text-gray-700 mb-1">Abstract:</p>
                    <p className="text-sm text-gray-700 line-clamp-3 bg-white p-3 rounded border border-gray-200">
                      {patent.abstractText}
                    </p>
                  </div>
                )}

                {/* Additional Info */}
                {patent.classInfo && patent.classInfo !== 'N/A' && (
                  <div className="mb-4">
                    <p className="text-sm font-semibold text-gray-700 mb-1">Classification (CPC):</p>
                    <p className="text-xs text-gray-600 bg-white p-2 rounded border border-gray-200">
                      {patent.classInfo}
                    </p>
                  </div>
                )}

                {/* Patent Details - Publication dates, etc */}
                {patent.details && patent.details !== 'N/A' && (
                  <div className="mb-4">
                    <p className="text-sm font-semibold text-gray-700 mb-1">Additional Information:</p>
                    <div className="text-xs text-gray-600 bg-blue-50 p-3 rounded border border-blue-200">
                      {patent.details.split(';').map((detail, idx) => (
                        detail.trim() && (
                          <div key={idx} className="mb-1">
                            {detail.trim()}
                          </div>
                        )
                      ))}
                    </div>
                  </div>
                )}

                <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-200">
                  <button 
                    onClick={() => handleViewDetails(patent.ipRightIdentifier || patent.id)}
                    className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors font-medium"
                  >
                    View Full Details
                  </button>
                  {patent.lastUpdated && (
                    <span className="text-xs text-gray-400">
                      Updated: {new Date(patent.lastUpdated).toLocaleDateString()}
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        ) : (
          !loading && query && <p className="text-center text-gray-500 py-8">No results found for "{query}"</p>
        )}
      </div>
      {selectedPatent && (
        <div className="mt-6 bg-white border-2 border-blue-300 rounded-lg p-6 shadow-lg">
          <h2 className="text-2xl font-bold mb-6 text-blue-900 border-b pb-3">Complete Patent Details</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {selectedPatent.id && (
              <div className="bg-gray-50 p-3 rounded">
                <p className="text-xs font-semibold text-gray-500 mb-1">ID</p>
                <p className="text-sm text-gray-800">{selectedPatent.id}</p>
              </div>
            )}
            {selectedPatent.type && (
              <div className="bg-gray-50 p-3 rounded">
                <p className="text-xs font-semibold text-gray-500 mb-1">Type</p>
                <p className="text-sm text-gray-800">{selectedPatent.type}</p>
              </div>
            )}
            {selectedPatent.assetNumber && (
              <div className="bg-gray-50 p-3 rounded">
                <p className="text-xs font-semibold text-gray-500 mb-1">Asset Number</p>
                <p className="text-sm text-gray-800">{selectedPatent.assetNumber}</p>
              </div>
            )}
            {selectedPatent.assignee && (
              <div className="bg-gray-50 p-3 rounded">
                <p className="text-xs font-semibold text-gray-500 mb-1">Assignee</p>
                <p className="text-sm text-gray-800">{selectedPatent.assignee}</p>
              </div>
            )}
            {selectedPatent.inventor && (
              <div className="bg-gray-50 p-3 rounded">
                <p className="text-xs font-semibold text-gray-500 mb-1">Inventor</p>
                <p className="text-sm text-gray-800">{selectedPatent.inventor}</p>
              </div>
            )}
            {selectedPatent.jurisdiction && (
              <div className="bg-gray-50 p-3 rounded">
                <p className="text-xs font-semibold text-gray-500 mb-1">Jurisdiction</p>
                <p className="text-sm text-gray-800">{selectedPatent.jurisdiction}</p>
              </div>
            )}
            {selectedPatent.filingDate && (
              <div className="bg-gray-50 p-3 rounded">
                <p className="text-xs font-semibold text-gray-500 mb-1">Filing Date</p>
                <p className="text-sm text-gray-800">{selectedPatent.filingDate}</p>
              </div>
            )}
            {selectedPatent.status && (
              <div className="bg-gray-50 p-3 rounded">
                <p className="text-xs font-semibold text-gray-500 mb-1">Status</p>
                <p className="text-sm text-gray-800">{selectedPatent.status}</p>
              </div>
            )}
          </div>

          {selectedPatent.title && (
            <div className="mt-4 bg-blue-50 p-4 rounded">
              <p className="text-xs font-semibold text-blue-900 mb-2">Title</p>
              <p className="text-sm text-gray-800 font-medium">{selectedPatent.title}</p>
            </div>
          )}

          {selectedPatent.abstractText && (
            <div className="mt-4 bg-gray-50 p-4 rounded">
              <p className="text-xs font-semibold text-gray-700 mb-2">Abstract</p>
              <p className="text-sm text-gray-700 leading-relaxed">{selectedPatent.abstractText}</p>
            </div>
          )}

          {selectedPatent.classInfo && (
            <div className="mt-4 bg-gray-50 p-4 rounded">
              <p className="text-xs font-semibold text-gray-700 mb-2">Classification</p>
              <p className="text-sm text-gray-700">{selectedPatent.classInfo}</p>
            </div>
          )}

          {selectedPatent.details && (
            <div className="mt-4 bg-gray-50 p-4 rounded">
              <p className="text-xs font-semibold text-gray-700 mb-2">Additional Details</p>
              <p className="text-sm text-gray-700">{selectedPatent.details}</p>
            </div>
          )}

          <div className="mt-6 flex justify-between items-center pt-4 border-t">
            {selectedPatent.apiSource && (
              <span className="text-xs text-gray-500">Source: {selectedPatent.apiSource}</span>
            )}
            {selectedPatent.lastUpdated && (
              <span className="text-xs text-gray-500">
                Last Updated: {new Date(selectedPatent.lastUpdated).toLocaleString()}
              </span>
            )}
          </div>

          <button 
            onClick={() => setSelectedPatent(null)}
            className="mt-6 w-full px-4 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 font-medium transition-colors"
          >
            Close Details
          </button>
        </div>
      )}
      {detailsLoading && <p>Loading details...</p>}
    </div>
  );
};

export default SearchResultsPage;