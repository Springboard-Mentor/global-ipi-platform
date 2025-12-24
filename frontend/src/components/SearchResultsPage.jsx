import React, { useState, useEffect, useCallback } from 'react';
import { Search, Filter, Download, Grid, List, ChevronLeft, ChevronRight, Check, Database, Globe, User, Calendar, Tag, X } from 'lucide-react';
import { searchAPI } from '../api/searchAPI';

const SearchResultsPage = ({ initialKeyword = '', onViewPatent }) => {

  // --- 1. STATE INITIALIZATION ---
  
  // Try to restore state from Session Storage (for "Back" button functionality)
  const loadSavedState = () => {
    try {
      const saved = sessionStorage.getItem('searchPageParams');
      return saved ? JSON.parse(saved) : null;
    } catch (e) { return null; }
  };

  const savedState = loadSavedState();
  // Only restore if the keyword matches (or if it's a fresh load with no prop)
  const shouldRestore = savedState && (!initialKeyword || initialKeyword === savedState.filters.keyword);

  // Initialize State
  const [results, setResults] = useState(shouldRestore && Array.isArray(savedState.results) ? savedState.results : []);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [viewMode, setViewMode] = useState(shouldRestore ? savedState.viewMode : 'list');
  const [showFilters, setShowFilters] = useState(true);
  
  const [trackedIds, setTrackedIds] = useState(shouldRestore ? savedState.trackedIds : {});

  // Pagination & Sorting
  const [currentPage, setCurrentPage] = useState(shouldRestore ? savedState.currentPage : 1);
  const [itemsPerPage, setItemsPerPage] = useState(shouldRestore ? savedState.itemsPerPage : 10);
  const [totalResults, setTotalResults] = useState(shouldRestore ? savedState.totalResults : 0);
  const [totalPages, setTotalPages] = useState(shouldRestore ? savedState.totalPages : 0);
  const [sortBy, setSortBy] = useState(shouldRestore ? savedState.sortBy : 'filingDate');
  const [sortDirection, setSortDirection] = useState(shouldRestore ? savedState.sortDirection : 'desc');

  // Filters
  const [filters, setFilters] = useState({
    keyword: shouldRestore ? savedState.filters.keyword : initialKeyword,
    jurisdictions: shouldRestore ? savedState.filters.jurisdictions : [],
    statuses: shouldRestore ? savedState.filters.statuses : [],
    dateFrom: shouldRestore ? savedState.filters.dateFrom : '',
    dateTo: shouldRestore ? savedState.filters.dateTo : '',
    ipType: shouldRestore ? savedState.filters.ipType : 'both',
    source: shouldRestore ? savedState.filters.source : 'local' 
  });

  const [hasSearched, setHasSearched] = useState(shouldRestore);

  // --- 2. SESSION STORAGE SYNC ---
  useEffect(() => {
    const stateToSave = {
      results, filters, currentPage, itemsPerPage, totalResults, totalPages, 
      sortBy, sortDirection, trackedIds, viewMode, hasSearched
    };
    sessionStorage.setItem('searchPageParams', JSON.stringify(stateToSave));
  }, [results, filters, currentPage, itemsPerPage, sortBy, sortDirection, trackedIds, viewMode, hasSearched]);

  // --- 3. API CALL ---
  const fetchResults = useCallback(async () => {
    // Prevent empty search unless filters are active
    if (!filters.keyword.trim() && filters.jurisdictions.length === 0 && filters.statuses.length === 0) return;

    setLoading(true);
    setError(null);

    try {
      const searchParams = {
        keyword: filters.keyword.trim() || null,
        ipType: filters.ipType,
        source: filters.source, // This sends 'local' or 'api' to backend
        jurisdictions: filters.jurisdictions.length > 0 ? filters.jurisdictions.join(',') : null,
        statuses: filters.statuses.length > 0 ? filters.statuses.join(',') : null,
        dateFrom: filters.dateFrom || null,
        dateTo: filters.dateTo || null,
        page: currentPage - 1,
        size: itemsPerPage,
        sortBy,
        sortDirection,
      };

      console.log("🚀 Fetching Results:", searchParams);

      const response = await searchAPI.searchAll(searchParams);
      
      // Safety check to ensure array
      const content = (response && Array.isArray(response.content)) ? response.content : [];
      setResults(content);
      setTotalResults(response.totalElements || content.length);
      setTotalPages(response.totalPages || Math.ceil(content.length / itemsPerPage));
      
      setHasSearched(true);

    } catch (err) {
      console.error("API Error:", err);
      setError('Failed to load results. Please check your connection.');
      setResults([]); 
    } finally {
      setLoading(false);
    }
  }, [filters, currentPage, itemsPerPage, sortBy, sortDirection]);

  // --- 4. EFFECTS ---

  // Initial Load (Landing Page)
  useEffect(() => {
    if (initialKeyword && initialKeyword !== filters.keyword) {
       setFilters(prev => ({ ...prev, keyword: initialKeyword }));
       setCurrentPage(1);
    } else if (!hasSearched && initialKeyword) {
       fetchResults();
    }
  }, [initialKeyword]);

  // Debounce Keyword Search
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (hasSearched) fetchResults();
    }, 600); 
    return () => clearTimeout(timeoutId);
  }, [filters.keyword]);

  // Trigger Fetch on Filter/Source Changes
  useEffect(() => {
    if (hasSearched) fetchResults();
  }, [currentPage, itemsPerPage, sortBy, sortDirection, filters.source, filters.ipType, filters.jurisdictions, filters.statuses, filters.dateFrom, filters.dateTo]);


  // --- 5. HANDLERS ---

  const handleManualSearch = () => {
    setCurrentPage(1);
    setHasSearched(true); 
    fetchResults();
  };

  const handleTrack = (e, id) => {
    e.stopPropagation();
    setTrackedIds(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const handleViewDetails = (item) => {
    if (onViewPatent) onViewPatent(item);
  };

  // ✅ CRITICAL: Switch between Local and API correctly
  const handleSourceChange = (newSource) => {
    if (filters.source === newSource) return;

    setFilters(prev => ({ ...prev, source: newSource }));
    setCurrentPage(1);
    setResults([]); // Clear results to show loading state immediately
    // The useEffect above will detect the change in 'filters.source' and trigger fetchResults
  };

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({ ...prev, [key]: value }));
    setCurrentPage(1);
  };

  const handleCheckboxFilter = (type, value, checked) => {
    setFilters(prev => {
      const current = prev[type];
      const next = checked ? [...current, value] : current.filter(item => item !== value);
      return { ...prev, [type]: next };
    });
    setCurrentPage(1);
  };

  const handleClearFilters = () => {
    setFilters({ 
        keyword: '', jurisdictions: [], statuses: [], dateFrom: '', dateTo: '', 
        ipType: 'both', source: filters.source 
    });
    setResults([]);
    setHasSearched(false);
    sessionStorage.removeItem('searchPageParams');
  };

  const handleExport = () => {
    if (!results || results.length === 0) {
      alert("No results to export!");
      return;
    }
    try {
      const headers = ['Title', 'ID', 'Status', 'Jurisdiction', 'Inventors', 'Assignee', 'Filing Date', 'Abstract', 'Source'];
      const csvContent = [
        headers.join(','), 
        ...results.map(row => [
          `"${(row.title || '').replace(/"/g, '""')}"`, 
          `"${row.patentNumber || row.id || ''}"`,
          `"${row.status || ''}"`,
          `"${row.jurisdiction || ''}"`,
          `"${(getInventorsDisplay(row) || '').replace(/"/g, '""')}"`,
          `"${(row.assignee || '').replace(/"/g, '""')}"`,
          `"${row.filingDate || ''}"`,
          `"${(row.abstractText || row.details || '').replace(/"/g, '""')}"`,
          filters.source
        ].join(','))
      ].join('\n');

      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.setAttribute('href', url);
      link.setAttribute('download', `ip_results_${filters.source}_${new Date().toISOString().slice(0,10)}.csv`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (err) {
      console.error("Export failed:", err);
    }
  };

  // --- 6. RENDER HELPERS ---

  const getStatusColor = (s) => {
    s = (s || '').toUpperCase();
    if (['ACTIVE', 'GRANTED', 'REGISTERED'].includes(s)) return 'bg-emerald-100 text-emerald-800 border-emerald-200';
    if (['PENDING', 'PUBLISHED', 'UNDER REVIEW'].includes(s)) return 'bg-amber-100 text-amber-800 border-amber-200';
    if (['EXPIRED', 'ABANDONED', 'REJECTED'].includes(s)) return 'bg-red-100 text-red-800 border-red-200';
    return 'bg-slate-100 text-slate-800 border-slate-200';
  };

  const getJurisdictionFlag = (code) => {
    const flags = { US: '🇺🇸', EP: '🇪🇺', CN: '🇨🇳', IN: '🇮🇳', JP: '🇯🇵', KR: '🇰🇷', GB: '🇬🇧', DE: '🇩🇪', FR: '🇫🇷' };
    return flags[code] || '🌐';
  };

  const getInventorsDisplay = (item) => {
    const raw = item.inventors || item.inventor || item.inventor_name;
    if (Array.isArray(raw)) return raw.join(", ");
    return raw || null; 
  };

  const getPageNumbers = () => {
    const pages = [];
    const max = 5; 
    let start = Math.max(1, currentPage - Math.floor(max / 2));
    let end = Math.min(totalPages, start + max - 1);
    if (end - start + 1 < max) start = Math.max(1, end - max + 1);
    for (let i = start; i <= end; i++) pages.push(i);
    return pages;
  };

  // --- 7. RENDER ---
  return (
    <div className="min-h-screen bg-gray-50">
      
      {/* HEADER */}
      <div className="bg-white shadow-sm border-b sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 py-4 flex flex-col md:flex-row justify-between items-center gap-4">
          <div>
            <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Global IP Search</h1>
            <p className="text-sm text-slate-500 mt-1 flex items-center gap-2">
              {loading ? 'Syncing...' : (
                <span className="flex items-center gap-1">
                  <Check size={14} className="text-green-500"/>
                  Found {totalResults} results in {filters.source === 'local' ? 'Local Database' : 'External API'}
                </span>
              )}
            </p>
          </div>

          <div className="bg-slate-100 p-1 rounded-lg flex border border-slate-200">
            <button 
                onClick={() => handleSourceChange('local')}
                className={`flex items-center gap-2 px-4 py-2 text-sm font-semibold rounded-md transition-all ${
                    filters.source === 'local' ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'
                }`}
            >
                <Database size={16} /> Database
            </button>
            <button 
                onClick={() => handleSourceChange('api')}
                className={`flex items-center gap-2 px-4 py-2 text-sm font-semibold rounded-md transition-all ${
                    filters.source === 'api' ? 'bg-white text-emerald-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'
                }`}
            >
                <Globe size={16} /> API Search
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-6">
        
        {/* SEARCH INPUT */}
        <div className="bg-white p-2 rounded-xl shadow-sm border border-slate-200 mb-6 flex gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
            <input 
              type="text" 
              value={filters.keyword} 
              onChange={(e) => setFilters(prev => ({...prev, keyword: e.target.value}))}
              onKeyDown={(e) => e.key === 'Enter' && handleManualSearch()}
              className="w-full pl-12 pr-4 py-3 bg-transparent border-none focus:ring-0 text-slate-800 placeholder-slate-400 text-lg" 
              placeholder="Search patent numbers, titles, inventors, or keywords..."
            />
          </div>
          <button onClick={handleManualSearch} className="bg-indigo-600 text-white px-8 py-2 rounded-lg hover:bg-indigo-700 font-semibold transition-colors shadow-md shadow-indigo-100">
            Search
          </button>
        </div>

        <div className="flex gap-6">
          
          {/* SIDEBAR FILTERS */}
          {showFilters && (
            <aside className="w-64 flex-shrink-0 bg-white rounded-xl shadow-sm p-5 h-fit sticky top-24 border border-slate-200 hidden md:block animate-in slide-in-from-left-4 duration-300">
              <div className="flex justify-between items-center mb-6 border-b border-slate-100 pb-4">
                <h2 className="font-bold text-slate-800 flex items-center gap-2"><Filter size={18} className="text-indigo-500"/> Filters</h2>
                {hasSearched && <button onClick={handleClearFilters} className="text-xs text-slate-400 hover:text-red-500 flex items-center gap-1"><X size={12}/> Clear</button>}
              </div>
              
              <div className="space-y-6">
                <div>
                    <label className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3 block">Asset Type</label>
                    <div className="space-y-2">
                        {['both', 'patent', 'trademark'].map(type => (
                            <label key={type} className="flex items-center gap-3 cursor-pointer group">
                                <div className={`w-4 h-4 rounded-full border flex items-center justify-center ${filters.ipType === type ? 'border-indigo-600' : 'border-slate-300 group-hover:border-indigo-400'}`}>
                                    {filters.ipType === type && <div className="w-2 h-2 rounded-full bg-indigo-600" />}
                                </div>
                                <input type="radio" checked={filters.ipType === type} onChange={() => handleFilterChange('ipType', type)} className="hidden" />
                                <span className="text-sm text-slate-600 capitalize font-medium group-hover:text-indigo-600">{type}</span>
                            </label>
                        ))}
                    </div>
                </div>

                <div>
                    <label className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3 block">Jurisdiction</label>
                    <div className="space-y-2 max-h-48 overflow-y-auto custom-scrollbar pr-2">
                        {['US', 'EP', 'CN', 'IN', 'JP', 'KR', 'GB', 'DE', 'FR'].map(code => (
                            <label key={code} className="flex items-center gap-3 cursor-pointer group">
                                <input type="checkbox" checked={filters.jurisdictions.includes(code)} onChange={(e) => handleCheckboxFilter('jurisdictions', code, e.target.checked)} className="w-4 h-4 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500" />
                                <span className="text-sm text-slate-600 group-hover:text-indigo-600">{getJurisdictionFlag(code)} {code}</span>
                            </label>
                        ))}
                    </div>
                </div>

                <div>
                    <label className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3 block">Status</label>
                    <div className="space-y-2">
                        {['ACTIVE', 'PENDING', 'EXPIRED', 'ABANDONED'].map(status => (
                            <label key={status} className="flex items-center gap-3 cursor-pointer group">
                                <input type="checkbox" checked={filters.statuses.includes(status)} onChange={(e) => handleCheckboxFilter('statuses', status, e.target.checked)} className="w-4 h-4 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500" />
                                <span className="text-sm text-slate-600 capitalize group-hover:text-indigo-600">{status.toLowerCase()}</span>
                            </label>
                        ))}
                    </div>
                </div>

                <div>
                    <label className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3 block">Filing Date</label>
                    <div className="space-y-3">
                        <input type="date" value={filters.dateFrom} onChange={(e) => handleFilterChange('dateFrom', e.target.value)} className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm text-slate-600 focus:ring-2 focus:ring-indigo-100 outline-none" />
                        <input type="date" value={filters.dateTo} onChange={(e) => handleFilterChange('dateTo', e.target.value)} className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm text-slate-600 focus:ring-2 focus:ring-indigo-100 outline-none" />
                    </div>
                </div>
              </div>
            </aside>
          )}

          {/* RESULTS AREA */}
          <main className="flex-1 min-w-0">
            
            {/* Toolbar */}
            <div className="bg-white rounded-xl shadow-sm p-3 mb-4 flex justify-between items-center flex-wrap gap-4 border border-slate-200">
              <div className="flex gap-3 items-center">
                  <button onClick={() => setShowFilters(!showFilters)} className={`px-4 py-2 border rounded-lg flex gap-2 text-sm font-medium transition-colors ${showFilters ? 'bg-indigo-50 border-indigo-200 text-indigo-700' : 'border-slate-200 text-slate-600 hover:bg-slate-50'}`}>
                    <Filter size={16}/> {showFilters ? 'Hide Filters' : 'Filters'}
                  </button>
                  <div className="flex border border-slate-200 rounded-lg overflow-hidden p-0.5 bg-slate-50">
                    <button onClick={() => setViewMode('list')} className={`p-1.5 rounded-md ${viewMode === 'list' ? 'bg-white shadow-sm text-indigo-600' : 'text-slate-400 hover:text-slate-600'}`}><List size={18}/></button>
                    <button onClick={() => setViewMode('grid')} className={`p-1.5 rounded-md ${viewMode === 'grid' ? 'bg-white shadow-sm text-indigo-600' : 'text-slate-400 hover:text-slate-600'}`}><Grid size={18}/></button>
                  </div>
              </div>

              <div className="flex gap-3 items-center">
                  <select 
                    value={`${sortBy}-${sortDirection}`} 
                    onChange={(e) => { const [f, d] = e.target.value.split('-'); setSortBy(f); setSortDirection(d); setCurrentPage(1); }} 
                    className="px-3 py-2 border border-slate-200 rounded-lg text-sm bg-white cursor-pointer outline-none focus:border-indigo-500 text-slate-600 font-medium"
                  >
                    <option value="filingDate-desc">Newest First</option>
                    <option value="filingDate-asc">Oldest First</option>
                    <option value="title-asc">Title (A-Z)</option>
                  </select>

                  <button onClick={handleExport} disabled={results.length === 0} className="flex gap-2 px-4 py-2 bg-white border border-slate-200 text-slate-700 rounded-lg hover:bg-slate-50 disabled:opacity-50 text-sm font-medium transition-colors">
                    <Download size={16} /> Export
                  </button>
              </div>
            </div>

            {/* RESULTS CONTENT */}
            {loading ? (
              <div className="flex flex-col items-center justify-center py-24 bg-white rounded-xl border border-dashed border-slate-300">
                 <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-indigo-600 mb-4"></div>
                 <p className="text-slate-500 font-medium animate-pulse">Searching {filters.source === 'local' ? 'Database' : 'API'}...</p>
              </div>
            ) : error ? (
              <div className="text-center py-12 bg-red-50 text-red-600 rounded-xl border border-red-200 font-medium">
                {error}
              </div>
            ) : results.length === 0 ? (
               <div className="text-center py-24 bg-white rounded-xl border border-dashed border-slate-300">
                 <Search className="w-16 h-16 text-slate-200 mx-auto mb-4" />
                 <p className="text-xl text-slate-700 font-bold">No results found</p>
                 <p className="text-sm text-slate-400 mt-2">Try adjusting your filters or switching to {filters.source === 'local' ? 'API' : 'Database'} search.</p>
               </div>
            ) : (
              <>
              <div className={viewMode === 'grid' ? 'grid grid-cols-1 md:grid-cols-2 gap-4' : 'space-y-4'}>
                {results.map((result, idx) => (
                  <div 
                    key={result.id || idx} 
                    className="bg-white rounded-xl shadow-sm p-5 border border-slate-200 hover:shadow-md hover:border-indigo-200 transition-all group cursor-pointer" 
                    onClick={() => handleViewDetails(result)}
                  >
                    <div className="flex gap-5">
                      {/* Icon */}
                      <div className={`w-14 h-14 rounded-xl flex items-center justify-center flex-shrink-0 border shadow-sm ${result.type === 'PATENT' ? 'bg-blue-50 border-blue-100 text-blue-600' : 'bg-purple-50 border-purple-100 text-purple-600'}`}>
                        <span className="font-bold text-xs tracking-wider">{result.type === 'PATENT' ? 'PAT' : 'TM'}</span>
                      </div>
                      
                      <div className="flex-1 min-w-0">
                        <div className="flex justify-between items-start mb-2 gap-4">
                          <h3 className="font-bold text-lg text-slate-900 group-hover:text-indigo-600 transition-colors line-clamp-1 leading-tight">
                             {result.title || 'Untitled Asset'}
                          </h3>
                          <span className={`px-2.5 py-0.5 text-[10px] font-bold uppercase rounded-full whitespace-nowrap border shadow-sm ${getStatusColor(result.status)}`}>
                            {result.status || 'UNKNOWN'}
                          </span>
                        </div>
                        
                        <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-xs text-slate-500 mb-3">
                            <span className="flex items-center gap-1.5 font-medium"><Globe size={12} className="text-indigo-400"/> {getJurisdictionFlag(result.jurisdiction)} {result.jurisdiction}</span>
                            <span className="flex items-center gap-1.5 font-mono bg-slate-50 px-2 py-0.5 rounded border border-slate-200 text-slate-600">{result.patentNumber || result.id}</span>
                            <span className="flex items-center gap-1.5"><Calendar size={12} className="text-indigo-400"/> {result.filingDate}</span>
                            {/* IPC CODE ADDED */}
                            {(result.ipcCode || result.assetClass) && (
                                <span className="flex items-center gap-1.5 font-semibold text-slate-600 bg-slate-100 px-1.5 rounded"><Tag size={10}/> {result.ipcCode || result.assetClass}</span>
                            )}
                        </div>

                        {/* ✅ INVENTORS SECTION */}
                        {getInventorsDisplay(result) && (
                            <div className="flex items-start gap-2 text-xs text-slate-600 mb-3 bg-slate-50/80 p-2 rounded-lg border border-slate-100">
                                <User className="w-3.5 h-3.5 text-slate-400 mt-0.5 flex-shrink-0" />
                                <span className="line-clamp-1">
                                    <span className="font-bold text-slate-700">Inventors:</span> {getInventorsDisplay(result)}
                                </span>
                            </div>
                        )}

                        <p className="text-sm text-slate-600 mb-4 line-clamp-2 leading-relaxed opacity-90">
                            {result.abstractText || result.details || "No description available."}
                        </p>
                        
                        <div className="flex justify-between items-center pt-3 border-t border-slate-100">
                          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest flex items-center gap-1.5">
                             {filters.source === 'api' ? <Globe size={10}/> : <Database size={10}/>}
                             {filters.source} SOURCE
                          </span>

                          <div className="flex gap-3">
                            <button 
                              onClick={(e) => handleTrack(e, result.id)}
                              className={`px-3 py-1.5 text-xs rounded-lg transition-all flex items-center gap-1.5 font-semibold border ${
                                trackedIds[result.id] 
                                ? 'bg-emerald-50 text-emerald-700 border-emerald-200' 
                                : 'bg-white text-slate-500 border-slate-200 hover:bg-slate-50 hover:text-slate-700'
                              }`}
                            >
                              {trackedIds[result.id] ? <><Check size={12}/> Tracked</> : 'Track'}
                            </button>
                            
                            <button className="px-4 py-1.5 text-xs bg-indigo-600 text-white hover:bg-indigo-700 rounded-lg transition-all font-semibold shadow-sm hover:shadow-indigo-200">
                              View Details
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* PAGINATION */}
              {totalPages > 1 && (
              <div className="bg-white rounded-xl shadow-sm p-4 mt-6 flex items-center justify-between flex-wrap gap-4 border border-slate-200">
                  <div className="flex items-center gap-2 text-sm text-slate-600 font-medium">
                    <span>Rows per page:</span>
                    <select 
                        value={itemsPerPage} 
                        onChange={(e) => { setItemsPerPage(Number(e.target.value)); setCurrentPage(1); }} 
                        className="px-2 py-1 border border-slate-300 rounded bg-white outline-none focus:border-indigo-500"
                    >
                      <option value={10}>10</option>
                      <option value={20}>20</option>
                      <option value={50}>50</option>
                    </select>
                  </div>

                  <div className="flex items-center gap-1">
                    <button onClick={() => setCurrentPage(p => Math.max(1, p - 1))} disabled={currentPage === 1} className="p-2 border rounded-lg disabled:opacity-30 hover:bg-slate-50 text-slate-600"><ChevronLeft size={16}/></button>
                    {getPageNumbers().map(p => (
                        <button key={p} onClick={() => setCurrentPage(p)} className={`w-8 h-8 flex items-center justify-center rounded-lg text-sm font-bold transition-all ${currentPage === p ? 'bg-indigo-600 text-white shadow-md' : 'text-slate-600 hover:bg-slate-50'}`}>{p}</button>
                    ))}
                    <button onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))} disabled={currentPage === totalPages} className="p-2 border rounded-lg disabled:opacity-30 hover:bg-slate-50 text-slate-600"><ChevronRight size={16}/></button>
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