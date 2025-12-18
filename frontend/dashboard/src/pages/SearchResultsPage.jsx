import React, { useState, useEffect } from 'react';
import { ArrowLeft } from 'lucide-react';

const SearchResultsPage = ({ query, onBack }) => {
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedPatent, setSelectedPatent] = useState(null);
  const [detailsLoading, setDetailsLoading] = useState(false);

  useEffect(() => {
    if (query) {
      handleSearch(query);
    }
  }, [query]);

  const handleSearch = async (searchQuery) => {
    setLoading(true);
    try {
      const response = await fetch('http://localhost:8080/api/patents/search', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ query: searchQuery }),
      });
      const data = await response.json();
      setResults(data || []);
    } catch (error) {
      console.error('Search failed:', error);
      setResults([]);
    } finally {
      setLoading(false);
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
        console.error('Failed to fetch patent details');
      }
    } catch (error) {
      console.error('Error fetching patent details:', error);
    } finally {
      setDetailsLoading(false);
    }
  };

  return (
    <div className="p-6">
      <div className="flex items-center gap-4 mb-4">
        <button
          onClick={onBack}
          className="flex items-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg"
        >
          <ArrowLeft size={16} />
          Back to Dashboard
        </button>
        <h1 className="text-2xl font-bold">Search Results for "{query}"</h1>
      </div>
      {loading && <p>Loading...</p>}
      <div>
        {results.length > 0 ? (
          <div className="grid gap-4">
            {results.map((patent) => (
              <div key={patent.ipRightIdentifier} className="bg-white border border-gray-300 rounded-lg p-4 shadow-sm">
                <h2 className="text-lg font-semibold mb-2">{patent.title}</h2>
                <p className="text-sm text-gray-600 mb-1">ID: {patent.ipRightIdentifier}</p>
                <p className="text-sm text-gray-600 mb-2">Filing Date: {patent.filingDate}</p>
                <p className="text-sm mb-3">{patent.abstractText}</p>
                <button 
                  onClick={() => handleViewDetails(patent.ipRightIdentifier)}
                  className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                >
                  View More Details
                </button>
              </div>
            ))}
          </div>
        ) : (
          !loading && <p>No results found.</p>
        )}
      </div>
      {selectedPatent && (
        <div className="mt-6 bg-white border border-gray-300 rounded-lg p-6 shadow-sm">
          <h2 className="text-xl font-bold mb-4">Patent Details</h2>
          <p><strong>ID:</strong> {selectedPatent.ipRightIdentifier}</p>
          <p><strong>Title:</strong> {selectedPatent.title}</p>
          <p><strong>Filing Date:</strong> {selectedPatent.filingDate}</p>
          <p><strong>Abstract:</strong> {selectedPatent.abstractText}</p>
          {/* Add more fields if available */}
          <button 
            onClick={() => setSelectedPatent(null)}
            className="mt-4 px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
          >
            Close
          </button>
        </div>
      )}
      {detailsLoading && <p>Loading details...</p>}
    </div>
  );
};

export default SearchResultsPage;