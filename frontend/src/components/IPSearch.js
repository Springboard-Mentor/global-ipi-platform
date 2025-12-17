import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const IPSearch = () => {
  const navigate = useNavigate();
  const [searchType, setSearchType] = useState('patent');
  const [searchParams, setSearchParams] = useState({
    keyword: '',
    assignee: '',
    inventor: '',
    jurisdiction: '',
    dateFrom: '',
    dateTo: '',
    status: ''
  });

  const jurisdictions = [
    'United States', 'European Union', 'China', 'Japan', 'South Korea',
    'India', 'Canada', 'Australia', 'United Kingdom', 'Germany'
  ];

  const statuses = ['Pending', 'Granted', 'Expired', 'Abandoned', 'Active'];

  const handleChange = (field, value) => {
    setSearchParams(prev => ({ ...prev, [field]: value }));
  };

  const handleSearch = (e) => {
    e.preventDefault();
    // Navigate to search results with query parameters
    const queryParams = new URLSearchParams({
      type: searchType,
      ...searchParams
    }).toString();
    navigate(`/search-results?${queryParams}`);
  };

  const handleReset = () => {
    setSearchParams({
      keyword: '',
      assignee: '',
      inventor: '',
      jurisdiction: '',
      dateFrom: '',
      dateTo: '',
      status: ''
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 relative overflow-hidden">
      <div className="absolute inset-0">
        <div className="absolute top-1/4 right-1/4 w-96 h-96 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse"></div>
        <div className="absolute bottom-1/4 left-1/4 w-96 h-96 bg-blue-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse animation-delay-2000"></div>
      </div>

      <header className="relative z-10 bg-white/10 backdrop-blur-md border-b border-white/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <button
            onClick={() => navigate('/dashboard')}
            className="flex items-center text-white hover:text-blue-300 transition-colors"
          >
            <svg className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back to Dashboard
          </button>
          <h1 className="text-2xl font-bold text-white">IP Search</h1>
          <div></div>
        </div>
      </header>

      <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-white mb-4">Search Patents & Trademarks</h2>
            <p className="text-gray-300">Search through millions of patents and trademarks worldwide</p>
          </div>

          {/* Search Type Toggle */}
          <div className="flex justify-center mb-8">
            <div className="bg-white/5 rounded-xl p-1 inline-flex">
              <button
                onClick={() => setSearchType('patent')}
                className={`px-6 py-2 rounded-lg transition-all ${
                  searchType === 'patent'
                    ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white'
                    : 'text-gray-300 hover:text-white'
                }`}
              >
                Patents
              </button>
              <button
                onClick={() => setSearchType('trademark')}
                className={`px-6 py-2 rounded-lg transition-all ${
                  searchType === 'trademark'
                    ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white'
                    : 'text-gray-300 hover:text-white'
                }`}
              >
                Trademarks
              </button>
            </div>
          </div>

          <form onSubmit={handleSearch} className="space-y-6">
            {/* Keyword Search */}
            <div>
              <label className="text-white text-sm mb-2 block">
                Keyword <span className="text-red-400">*</span>
              </label>
              <input
                type="text"
                value={searchParams.keyword}
                onChange={(e) => handleChange('keyword', e.target.value)}
                placeholder={`Search ${searchType} by keyword...`}
                className="w-full p-3 bg-white/10 text-white border border-white/30 rounded-xl focus:ring-2 focus:ring-blue-500 placeholder-gray-400"
                required
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Assignee/Owner */}
              <div>
                <label className="text-white text-sm mb-2 block">
                  {searchType === 'patent' ? 'Assignee' : 'Owner'}
                </label>
                <input
                  type="text"
                  value={searchParams.assignee}
                  onChange={(e) => handleChange('assignee', e.target.value)}
                  placeholder={`Enter ${searchType === 'patent' ? 'assignee' : 'owner'} name`}
                  className="w-full p-3 bg-white/10 text-white border border-white/30 rounded-xl focus:ring-2 focus:ring-blue-500 placeholder-gray-400"
                />
              </div>

              {/* Inventor (only for patents) */}
              {searchType === 'patent' && (
                <div>
                  <label className="text-white text-sm mb-2 block">Inventor</label>
                  <input
                    type="text"
                    value={searchParams.inventor}
                    onChange={(e) => handleChange('inventor', e.target.value)}
                    placeholder="Enter inventor name"
                    className="w-full p-3 bg-white/10 text-white border border-white/30 rounded-xl focus:ring-2 focus:ring-blue-500 placeholder-gray-400"
                  />
                </div>
              )}

              {/* Jurisdiction */}
              <div>
                <label className="text-white text-sm mb-2 block">Jurisdiction</label>
                <select
                  value={searchParams.jurisdiction}
                  onChange={(e) => handleChange('jurisdiction', e.target.value)}
                  className="w-full p-3 bg-white/10 text-white border border-white/30 rounded-xl focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">All Jurisdictions</option>
                  {jurisdictions.map(j => (
                    <option key={j} value={j} className="bg-slate-800">{j}</option>
                  ))}
                </select>
              </div>

              {/* Status */}
              <div>
                <label className="text-white text-sm mb-2 block">Status</label>
                <select
                  value={searchParams.status}
                  onChange={(e) => handleChange('status', e.target.value)}
                  className="w-full p-3 bg-white/10 text-white border border-white/30 rounded-xl focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">All Statuses</option>
                  {statuses.map(s => (
                    <option key={s} value={s} className="bg-slate-800">{s}</option>
                  ))}
                </select>
              </div>

              {/* Date From */}
              <div>
                <label className="text-white text-sm mb-2 block">Date From</label>
                <input
                  type="date"
                  value={searchParams.dateFrom}
                  onChange={(e) => handleChange('dateFrom', e.target.value)}
                  className="w-full p-3 bg-white/10 text-white border border-white/30 rounded-xl focus:ring-2 focus:ring-blue-500"
                />
              </div>

              {/* Date To */}
              <div>
                <label className="text-white text-sm mb-2 block">Date To</label>
                <input
                  type="date"
                  value={searchParams.dateTo}
                  onChange={(e) => handleChange('dateTo', e.target.value)}
                  className="w-full p-3 bg-white/10 text-white border border-white/30 rounded-xl focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-4 pt-4">
              <button
                type="button"
                onClick={handleReset}
                className="flex-1 py-3 bg-gray-600 hover:bg-gray-700 text-white rounded-xl transition-colors"
              >
                Reset
              </button>
              <button
                type="submit"
                className="flex-1 py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-xl hover:from-blue-600 hover:to-purple-700 transition-all duration-300 shadow-lg"
              >
                Search
              </button>
            </div>
          </form>

          {/* Quick Search Tips */}
          <div className="mt-8 p-4 bg-white/5 rounded-xl border border-white/10">
            <h3 className="text-white font-semibold mb-2">Search Tips:</h3>
            <ul className="text-gray-300 text-sm space-y-1">
              <li>• Use quotation marks for exact phrase matching</li>
              <li>• Use AND, OR, NOT for boolean searches</li>
              <li>• Wildcard (*) can be used for partial matches</li>
              <li>• Combine multiple filters for more precise results</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default IPSearch;
