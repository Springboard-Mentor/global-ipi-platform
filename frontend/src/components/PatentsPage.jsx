// components/PatentsPage.jsx
import React, { useState, useEffect, useMemo } from 'react';
import { Search, Filter, Download, Plus, FileText, Calendar, MapPin, Tag } from 'lucide-react';
import { patentsAPI } from '../services/ai.js'; // Assumed to have getPatents()

const PatentsPage = () => {
    const [patents, setPatents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('All');

    // --- Data Fetching ---

    useEffect(() => {
        fetchPatents();
    }, []);

    const fetchPatents = async () => {
        try {
            setLoading(true);
            setError(null);
            // Assuming the backend returns an array of patent objects
            const data = await patentsAPI.getPatents(); 
            setPatents(data || []); // Initialize with empty array if null
        } catch (err) {
            console.error('Error fetching patents:', err);
            // Using error.message to show the API error defined in ai.js
            setError(err.message || 'Failed to load patents. Check API service definition.'); 
        } finally {
            setLoading(false);
        }
    };

    // --- Filtering Logic (Moved to useMemo for performance) ---

    const filteredPatents = useMemo(() => {
        let filtered = patents;

        // 1. Filter by search term
        if (searchTerm) {
            const lowerCaseSearch = searchTerm.toLowerCase();
            filtered = filtered.filter(patent =>
                patent.title?.toLowerCase().includes(lowerCaseSearch) ||
                patent.patentNumber?.toLowerCase().includes(lowerCaseSearch) ||
                patent.category?.toLowerCase().includes(lowerCaseSearch)
            );
        }

        // 2. Filter by status
        if (statusFilter !== 'All') {
            filtered = filtered.filter(patent => patent.status === statusFilter);
        }

        return filtered;
    }, [searchTerm, statusFilter, patents]);

    // --- Helper Functions ---

    const getStatusColor = (status) => {
        const colors = {
            'Granted': 'bg-green-100 text-green-800',
            'Pending': 'bg-yellow-100 text-yellow-800',
            'Under Review': 'bg-blue-100 text-blue-800',
            'Rejected': 'bg-red-100 text-red-800'
        };
        return colors[status] || 'bg-gray-100 text-gray-800';
    };

    const uniqueStatuses = useMemo(() => {
        return ['All', ...new Set(patents.map(p => p.status).filter(Boolean))];
    }, [patents]);


    // --- Render Component ---

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
            </div>
        );
    }

    // The rest of the component JSX

    return (
        <div className="space-y-6">
            
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-2xl font-bold text-slate-900">Patent Portfolio</h2>
                    <p className="text-slate-600 mt-1">Manage and track your intellectual property</p>
                </div>
                <button className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-500 transition text-sm font-medium flex items-center gap-2">
                    <Plus className="h-4 w-4" />
                    New Patent
                </button>
            </div>

            {/* Error Message */}
            {error && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                    <p className="text-red-700">{error}</p>
                </div>
            )}

            {/* Filters and Search */}
            <div className="bg-white rounded-xl border border-slate-100 shadow-sm p-6">
                <div className="flex flex-col sm:flex-row gap-4">
                    {/* Search Input */}
                    <div className="flex-1 relative">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-slate-400" />
                        <input
                            type="text"
                            placeholder="Search patents by title, ID, or category..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-slate-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500 transition"
                        />
                    </div>

                    {/* Status Filter */}
                    <div className="sm:w-48">
                        <select
                            value={statusFilter}
                            onChange={(e) => setStatusFilter(e.target.value)}
                            className="w-full px-4 py-2.5 rounded-lg border border-slate-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500 transition"
                        >
                            {uniqueStatuses.map(status => (
                                <option key={status} value={status}>{status}</option>
                            ))}
                        </select>
                    </div>

                    {/* Export Button */}
                    <button className="px-4 py-2.5 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 transition text-sm font-medium flex items-center gap-2">
                        <Download className="h-4 w-4" />
                        Export
                    </button>
                </div>
            </div>

            {/* Patents List */}
            <div className="bg-white rounded-xl border border-slate-100 shadow-sm overflow-hidden">
                {filteredPatents.length === 0 ? (
                    <div className="p-12 text-center">
                        <FileText className="h-12 w-12 text-slate-300 mx-auto mb-4" />
                        <p className="text-slate-600 font-medium">
                            {patents.length === 0 ? 'No patents in your portfolio.' : 'No results found.'}
                        </p>
                        {patents.length > 0 && <p className="text-slate-500 text-sm mt-1">Try adjusting your search or filters.</p>}
                    </div>
                ) : (
                    <div className="divide-y divide-slate-100">
                        {filteredPatents.map((patent) => (
                            <div
                                key={patent.id}
                                className="p-6 hover:bg-slate-50 transition cursor-pointer"
                            >
                                <div className="flex items-start justify-between gap-4">
                                    <div className="flex-1 min-w-0">
                                        
                                        {/* Patent Number & Status */}
                                        <div className="flex items-center gap-3 mb-2">
                                            <span className="text-sm font-mono font-semibold text-indigo-600">
                                                {patent.patentNumber || 'N/A'}
                                            </span>
                                            <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(patent.status)}`}>
                                                {patent.status || 'Draft'}
                                            </span>
                                        </div>

                                        {/* Title */}
                                        <h3 className="text-lg font-semibold text-slate-900 mb-2">
                                            {patent.title || 'Untitled Invention'}
                                        </h3>

                                        {/* Meta Information */}
                                        <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-sm text-slate-600">
                                            <div className="flex items-center gap-1.5">
                                                <Calendar className="h-4 w-4" />
                                                <span>Filed: {patent.filingDate ? new Date(patent.filingDate).toLocaleDateString() : 'N/A'}</span>
                                            </div>
                                            <div className="flex items-center gap-1.5">
                                                <MapPin className="h-4 w-4" />
                                                <span>{patent.region || 'Global'}</span>
                                            </div>
                                            <div className="flex items-center gap-1.5">
                                                <Tag className="h-4 w-4" />
                                                <span>{patent.category || 'Uncategorized'}</span>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Actions */}
                                    <div className="flex items-center gap-2 flex-shrink-0">
                                        <button className="p-2 text-slate-600 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition" title="View Details">
                                            <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                            </svg>
                                        </button>
                                        <button className="p-2 text-slate-600 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition" title="More Options">
                                            <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" />
                                            </svg>
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* Summary */}
            <div className="bg-slate-50 rounded-xl p-6 border border-slate-200">
                <div className="flex items-center justify-between text-sm">
                    <span className="text-slate-600">
                        Showing {filteredPatents.length} of {patents.length} patents
                    </span>
                    <span className="text-slate-600">
                        {patents.filter(p => p.status === 'Granted').length} Granted • 
                        {' '}{patents.filter(p => p.status === 'Pending').length} Pending
                    </span>
                </div>
            </div>
        </div>
    );
};

export default PatentsPage;