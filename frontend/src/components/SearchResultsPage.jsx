import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { Search, Filter, Download, Grid, List, ChevronLeft, ChevronRight, Check } from 'lucide-react';
import { searchAPI } from '../api/searchAPI';

const SearchResultsPage = ({ initialKeyword = '', onViewPatent }) => {
  // --- State ---
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  
  // View & Pagination
  const [viewMode, setViewMode] = useState('list');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(25);
  const [totalResults, setTotalResults] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  
  // Sort & Filter
  const [sortBy, setSortBy] = useState('filingDate');
  const [sortDirection, setSortDirection] = useState('desc');
  const [showFilters, setShowFilters] = useState(true);

  // Local Features
  const [trackedIds, setTrackedIds] = useState({});
  const [hasSearched, setHasSearched] = useState(false);

  // Filter State
  const [filters, setFilters] = useState({
    keyword: initialKeyword || '',
    jurisdictions: [],
    statuses: [],
    dateFrom: '',
    dateTo: '',
    ipType: 'both',
  });

  // --- HELPER: ROBUST DATE PARSER ---
  const parseDate = (dateStr) => {
    if (!dateStr) return new Date(0);
    const date = new Date(dateStr);
    return isNaN(date.getTime()) ? new Date(0) : date;
  };

  // --- 1. FRONTEND SORTING ---
  const sortedResults = useMemo(() => {
    if (!results || results.length === 0) return [];
    let sorted = [...results];
    
    sorted.sort((a, b) => {
        if (sortBy === 'filingDate') {
            const dateA = parseDate(a.filingDate);
            const dateB = parseDate(b.filingDate);
            return sortDirection === 'asc' ? dateA - dateB : dateB - dateA;
        }
        if (sortBy === 'title') {
            const titleA = (a.title || '').toLowerCase();
            const titleB = (b.title || '').toLowerCase();
            return sortDirection === 'asc' ? titleA.localeCompare(titleB) : titleB.localeCompare(titleA);
        }
        return 0;
    });
    return sorted;
  }, [results, sortBy, sortDirection]);

  // --- 2. HANDLERS ---
  const handleTrack = (id) => {
    setTrackedIds(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const handleExport = () => {
    if (!results || results.length === 0) {
        alert("No results to export!");
        return;
    }
    try {
        const headers = ['Title', 'Patent Number', 'Status', 'Jurisdiction', 'Filing Date', 'Abstract'];
        const csvContent = [
          headers.join(','), 
          ...results.map(row => [
            `"${(row.title || '').replace(/"/g, '""')}"`, 
            `"${row.patentNumber || ''}"`,
            `"${row.status || ''}"`,
            `"${row.jurisdiction || ''}"`,
            `"${row.filingDate || ''}"`,
            `"${(row.abstractText || '').replace(/"/g, '""')}"`
          ].join(','))
        ].join('\n');

        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.setAttribute('href', url);
        link.setAttribute('download', `ip_results_${new Date().toISOString().slice(0,10)}.csv`);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    } catch (err) {
        console.error("Export failed:", err);
    }
  };

  const handleFilterChange = (filterType, value) => {
    setFilters(prev => ({ ...prev, [filterType]: value }));
    setCurrentPage(1);
  };

  const handleClearFilters = () => {
    setFilters({ keyword: '', jurisdictions: [], statuses: [], dateFrom: '', dateTo: '', ipType: 'both' });
    setCurrentPage(1);
    setResults([]);
    setTotalResults(0);
    setHasSearched(false);
  };

  const handleSort = (value) => {
    const [field, direction] = value.split('-');
    setSortBy(field);
    setSortDirection(direction || 'desc');
  };

  const handleManualSearch = () => {
    setCurrentPage(1);
    fetchResults();
  };

  // --- 3. API CALL ---
  const fetchResults = useCallback(async () => {
    if (!filters.keyword.trim() && filters.jurisdictions.length === 0 && !filters.dateFrom) return;

    setLoading(true);
    setError(null);

    try {
      const searchParams = {
        keyword: filters.keyword.trim() || null,
        jurisdictions: filters.jurisdictions.length > 0 ? filters.jurisdictions : null,
        statuses: filters.statuses.length > 0 ? filters.statuses : null,
        dateFrom: filters.dateFrom || null,
        dateTo: filters.dateTo || null,
        ipType: filters.ipType,
        page: currentPage - 1, 
        size: itemsPerPage,
        sortBy, 
        sortDirection,
      };

      const response = await searchAPI.searchAll(searchParams);
      
      setResults(response.content || []);
      setTotalResults(response.totalElements || 0);
      setTotalPages(response.totalPages || 0);
      setHasSearched(true);
    } catch (err) {
      console.error("Search Error:", err);
      setError('Failed to fetch results. Ensure backend is running.');
    } finally {
      setLoading(false);
    }
  }, [filters, currentPage, itemsPerPage]);

  useEffect(() => {
    if (initialKeyword && initialKeyword.trim()) {
      setFilters(prev => ({ ...prev, keyword: initialKeyword }));
      setHasSearched(false);
    }
  }, [initialKeyword]);

  useEffect(() => {
    if (!hasSearched && initialKeyword) { fetchResults(); return; }
    const timeoutId = setTimeout(() => {
      if (filters.keyword.trim().length >= 2) fetchResults();
    }, 800); 
    return () => clearTimeout(timeoutId);
  }, [filters.keyword]);

  useEffect(() => {
    if (hasSearched) fetchResults();
  }, [currentPage, itemsPerPage, filters.jurisdictions, filters.statuses, filters.dateFrom, filters.dateTo, filters.ipType]);

  // --- UI HELPERS ---
  const getStatusColor = (status) => {
    switch (status?.toUpperCase()) {
      case 'ACTIVE': return 'bg-green-100 text-green-800';
      case 'PENDING': return 'bg-yellow-100 text-yellow-800';
      case 'EXPIRED': return 'bg-red-100 text-red-800';
      default: return 'bg-blue-100 text-blue-800';
    }
  };
  const getJurisdictionFlag = (code) => {
    const flags = { US: '🇺🇸', EP: '🇪🇺', CN: '🇨🇳', IN: '🇮🇳', JP: '🇯🇵', KR: '🇰🇷', GB: '🇬🇧' };
    return flags[code] || '🌐';
  };

  // --- NEW: NUMBERED PAGINATION LOGIC ---
  const getPageNumbers = () => {
    const pages = [];
    const maxVisiblePages = 5; // How many numbers to show at once
    
    // Logic to show a sliding window of pages (e.g., 4 5 [6] 7 8)
    let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
    let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);

    if (endPage - startPage + 1 < maxVisiblePages) {
      startPage = Math.max(1, endPage - maxVisiblePages + 1);
    }

    for (let i = startPage; i <= endPage; i++) {
      pages.push(i);
    }
    return pages;
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <h1 className="text-2xl font-bold text-gray-900">Global IP Search</h1>
          <p className="text-sm text-gray-600 mt-1">
            {loading ? 'Searching...' : hasSearched ? `Found ${totalResults} results` : 'Enter a keyword to start'}
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="flex gap-6">
          
          {/* SIDEBAR FILTERS */}
          {showFilters && (
            <aside className="w-64 bg-white rounded-lg shadow-sm p-4 h-fit sticky top-6">
              <div className="flex justify-between mb-4">
                <h2 className="font-semibold">Filters</h2>
                <button onClick={handleClearFilters} className="text-sm text-blue-600">Clear all</button>
              </div>
              
              {/* Keyword */}
              <div className="mb-6">
                <label className="block text-sm font-medium mb-2">Keyword</label>
                <input type="text" value={filters.keyword} onChange={(e) => setFilters(prev => ({ ...prev, keyword: e.target.value }))} onKeyPress={(e) => e.key === 'Enter' && handleManualSearch()} className="w-full px-3 py-2 border rounded-md" />
                <button onClick={handleManualSearch} className="w-full mt-2 px-3 py-2 bg-blue-600 text-white rounded-md">Search Now</button>
              </div>

              {/* IP Type */}
              <div className="mb-6">
                <label className="block text-sm font-medium mb-2">IP Type</label>
                <div className="space-y-2">
                  {['both', 'patent', 'trademark'].map((type) => (
                    <label key={type} className="flex items-center">
                      <input type="radio" checked={filters.ipType === type} onChange={() => handleFilterChange('ipType', type)} className="mr-2" />
                      <span className="text-sm capitalize">{type}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Jurisdiction */}
              <div className="mb-6">
                <label className="block text-sm font-medium mb-2">Jurisdiction</label>
                <div className="space-y-2 max-h-48 overflow-y-auto">
                  {['US', 'EP', 'CN', 'IN', 'JP', 'KR', 'GB'].map((jurisdiction) => (
                    <label key={jurisdiction} className="flex items-center">
                      <input type="checkbox" checked={filters.jurisdictions.includes(jurisdiction)} onChange={(e) => {
                          const newJurisdictions = e.target.checked ? [...filters.jurisdictions, jurisdiction] : filters.jurisdictions.filter((j) => j !== jurisdiction);
                          handleFilterChange('jurisdictions', newJurisdictions);
                        }} className="mr-2" />
                      <span className="text-sm">{getJurisdictionFlag(jurisdiction)} {jurisdiction}</span>
                    </label>
                  ))}
                </div>
              </div>
              
              {/* Filing Date */}
              <div className="mb-6">
                <label className="block text-sm font-medium mb-2">Filing Date</label>
                <input type="date" value={filters.dateFrom} onChange={(e) => handleFilterChange('dateFrom', e.target.value)} className="w-full px-3 py-2 border rounded-md mb-2 text-sm" />
                <input type="date" value={filters.dateTo} onChange={(e) => handleFilterChange('dateTo', e.target.value)} className="w-full px-3 py-2 border rounded-md text-sm" />
              </div>
            </aside>
          )}

          {/* MAIN CONTENT */}
          <main className="flex-1">
            <div className="bg-white rounded-lg shadow-sm p-4 mb-4 flex justify-between flex-wrap gap-4">
              <div className="flex gap-2">
                  <button onClick={() => setShowFilters(!showFilters)} className="px-3 py-2 border rounded-md flex gap-2"><Filter className="w-4 h-4"/> Filters</button>
                  <div className="flex border rounded-md overflow-hidden">
                    <button onClick={() => setViewMode('list')} className={`px-3 py-2 ${viewMode === 'list' ? 'bg-blue-50 text-blue-600' : 'bg-white'}`}><List className="w-4 h-4" /></button>
                    <button onClick={() => setViewMode('grid')} className={`px-3 py-2 border-l ${viewMode === 'grid' ? 'bg-blue-50 text-blue-600' : 'bg-white'}`}><Grid className="w-4 h-4" /></button>
                  </div>
              </div>

              <div className="flex gap-4">
                  <select value={`${sortBy}-${sortDirection}`} onChange={(e) => handleSort(e.target.value)} className="px-3 py-2 border rounded-md text-sm cursor-pointer">
                    <option value="filingDate-desc">Filing Date (Newest)</option>
                    <option value="filingDate-asc">Filing Date (Oldest)</option>
                    <option value="title-asc">Title (A-Z)</option>
                  </select>

                  <button onClick={handleExport} disabled={results.length === 0} className="flex gap-2 px-4 py-2 bg-blue-600 text-white rounded-md disabled:bg-gray-300 hover:bg-blue-700">
                    <Download className="w-4 h-4" /> Export
                  </button>
              </div>
            </div>

            {loading ? <div className="text-center p-12">Loading...</div> : 
             results.length === 0 ? <div className="text-center p-12">No results found</div> : 
             (
              <>
              {/* RESULTS LIST */}
              <div className={viewMode === 'grid' ? 'grid grid-cols-2 gap-4' : 'space-y-4'}>
                {sortedResults.map((result) => (
                  <div key={result.id} className="bg-white rounded-lg shadow-sm p-4 hover:shadow-md transition-shadow">
                    <div className="flex gap-4">
                      <div className="w-20 h-20 bg-blue-100 rounded-md flex items-center justify-center text-blue-700 font-bold">{result.type === 'Patent' ? 'PAT' : 'TM'}</div>
                      <div className="flex-1">
                        <div className="flex justify-between mb-2">
                          <h3 className="font-semibold line-clamp-1">{result.title}</h3>
                          <span className={`px-2 py-1 text-xs rounded-full ${getStatusColor(result.status)}`}>{result.status}</span>
                        </div>
                        <div className="text-sm text-gray-600 mb-2">{getJurisdictionFlag(result.jurisdiction)} {result.jurisdiction} • {result.patentNumber} • 📅 {result.filingDate}</div>
                        <p className="text-sm text-gray-700 mb-3 line-clamp-2">{result.abstractText}</p>
                        
                        <div className="flex justify-end gap-2">
                          <button 
                            onClick={() => handleTrack(result.id)}
                            className={`px-3 py-1 text-sm rounded transition flex items-center gap-1 ${
                                trackedIds[result.id] 
                                ? 'bg-green-100 text-green-700 border border-green-200 font-medium' 
                                : 'text-blue-600 hover:bg-blue-50'
                            }`}
                          >
                            {trackedIds[result.id] ? <><Check className="w-3 h-3"/> Tracked</> : 'Track'}
                          </button>
                          
                          <button onClick={() => onViewPatent && onViewPatent(result)} className="px-4 py-2 text-sm bg-blue-600 text-white hover:bg-blue-700 rounded transition">
                            View Details
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* --- NEW: NUMBERED PAGINATION --- */}
              {totalPages > 1 && (
              <div className="bg-white rounded-lg shadow-sm p-4 mt-6 flex items-center justify-between flex-wrap gap-4 border-t border-gray-100">
                  
                  {/* Items Per Page Selector */}
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-gray-600">Rows:</span>
                    <select value={itemsPerPage} onChange={(e) => { setItemsPerPage(Number(e.target.value)); setCurrentPage(1); }} className="px-2 py-1 border rounded text-sm bg-gray-50">
                      <option value={10}>10</option>
                      <option value={25}>25</option>
                      <option value={50}>50</option>
                    </select>
                  </div>

                  {/* Numbered Page Buttons */}
                  <div className="flex items-center gap-1">
                    {/* Prev Button */}
                    <button 
                        onClick={() => setCurrentPage(p => Math.max(1, p - 1))} 
                        disabled={currentPage === 1} 
                        className="p-2 border rounded-md disabled:opacity-30 hover:bg-gray-50 text-gray-600"
                    >
                        <ChevronLeft className="w-4 h-4" />
                    </button>

                    {/* Page Numbers Loop */}
                    {getPageNumbers().map(pageNum => (
                        <button
                            key={pageNum}
                            onClick={() => setCurrentPage(pageNum)}
                            className={`w-8 h-8 flex items-center justify-center rounded-md text-sm font-medium transition-colors ${
                                currentPage === pageNum 
                                ? 'bg-blue-600 text-white shadow-sm' 
                                : 'text-gray-600 hover:bg-gray-100 border border-transparent'
                            }`}
                        >
                            {pageNum}
                        </button>
                    ))}

                    {/* Next Button */}
                    <button 
                        onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))} 
                        disabled={currentPage === totalPages} 
                        className="p-2 border rounded-md disabled:opacity-30 hover:bg-gray-50 text-gray-600"
                    >
                        <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>
                  
                  <div className="text-sm text-gray-500 hidden sm:block">
                      Page {currentPage} of {totalPages}
                  </div>
              </div>
              )}
              </>
            )}
          </main>
        </div>
      </div>
    </div>
  );
};

export default SearchResultsPage;