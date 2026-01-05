import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Download, Plus, FileText, Calendar, MapPin, Eye, User, Building, Loader2 } from 'lucide-react';

const PatentsPage = ({ onViewPatent }) => {
    const navigate = useNavigate();
    const [patents, setPatents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('All');

    useEffect(() => {
        fetchPatents();
    }, []);

    const fetchPatents = async () => {
        try {
            const response = await fetch('http://localhost:5001/api/filings');
            if (!response.ok) throw new Error('Failed to fetch data');

            const data = await response.json();

            const formattedData = data.map(item => ({
                id: item.id,
                patentNumber: item.applicationNumber || `APP-${String(item.id).padStart(5, '0')}`,
                title: item.title,
                status: item.status || 'Pending',
                filingDate: item.filingDate || item.submissionDate,
                jurisdiction: item.jurisdiction || 'IN',
                region: getRegionName(item.jurisdiction),
                category: item.category || 'General',
                type: item.filingType || 'Patent',
                assignee: item.assignee || 'Self-Assigned',
                inventors: item.inventorName || 'Unknown',
                abstractText: item.description || item.title
            }));

            setPatents(formattedData);
        } catch (error) {
            console.error("Error loading patents:", error);
        } finally {
            setLoading(false);
        }
    };

    const getRegionName = (code) => {
        const regions = { 
            'US': 'United States', 'IN': 'India', 'EP': 'Europe', 
            'CN': 'China', 'JP': 'Japan', 'KR': 'South Korea', 'GB': 'United Kingdom'
        };
        return regions[code] || code || 'Global';
    };

    const handleExport = () => {
        if (patents.length === 0) {
            alert("No data to export!");
            return;
        }
        const headers = ["Patent Number", "Title", "Status", "Filing Date", "Jurisdiction", "Assignee", "Inventors"];
        const rows = patents.map(p => [
            p.patentNumber,
            `"${p.title.replace(/"/g, '""')}"`,
            p.status,
            new Date(p.filingDate).toLocaleDateString(),
            p.region,
            `"${p.assignee}"`,
            `"${p.inventors}"`
        ]);
        const csvContent = [headers.join(","), ...rows.map(row => row.join(","))].join("\n");
        const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.setAttribute("href", url);
        link.setAttribute("download", "my_patents_portfolio.csv");
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    const handleNewFiling = () => {
        navigate('/new-filing');
    };

    const filteredPatents = useMemo(() => {
        let filtered = patents;
        if (searchTerm) {
            const lowerCaseSearch = searchTerm.toLowerCase();
            filtered = filtered.filter(patent =>
                patent.title?.toLowerCase().includes(lowerCaseSearch) ||
                patent.patentNumber?.toLowerCase().includes(lowerCaseSearch) ||
                patent.category?.toLowerCase().includes(lowerCaseSearch) ||
                patent.assignee?.toLowerCase().includes(lowerCaseSearch)
            );
        }
        if (statusFilter !== 'All') {
            filtered = filtered.filter(patent => 
                patent.status?.toLowerCase() === statusFilter.toLowerCase()
            );
        }
        return filtered;
    }, [searchTerm, statusFilter, patents]);

    const getStatusColor = (status) => {
        const s = status?.toUpperCase();
        if (['GRANTED', 'ACTIVE', 'REGISTERED'].includes(s)) return 'bg-emerald-100 text-emerald-800 border-emerald-200';
        if (['PENDING', 'SUBMITTED'].includes(s)) return 'bg-amber-100 text-amber-800 border-amber-200';
        if (['UNDER REVIEW', 'EXAMINATION'].includes(s)) return 'bg-blue-100 text-blue-800 border-blue-200';
        if (['REJECTED', 'EXPIRED', 'ABANDONED'].includes(s)) return 'bg-red-100 text-red-800 border-red-200';
        return 'bg-gray-100 text-gray-800 border-gray-200';
    };

    const uniqueStatuses = useMemo(() => {
        const statuses = new Set(patents.map(p => p.status).filter(Boolean));
        const formattedStatuses = Array.from(statuses).map(s => s.charAt(0).toUpperCase() + s.slice(1).toLowerCase());
        return ['All', ...new Set(formattedStatuses)];
    }, [patents]);

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center h-96 text-slate-400">
                <Loader2 className="h-10 w-10 animate-spin mb-4 text-indigo-600" />
                <p>Loading your portfolio...</p>
            </div>
        );
    }

    return (
        <div className="space-y-6 animate-in fade-in duration-500">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-2xl font-bold text-slate-900">My Patents</h2>
                    <p className="text-slate-600 mt-1">Track your submitted filings and applications.</p>
                </div>
                <button 
                    onClick={handleNewFiling}
                    className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-500 transition text-sm font-medium flex items-center gap-2 shadow-sm shadow-indigo-200"
                >
                    <Plus className="h-4 w-4" />
                    New Filing
                </button>
            </div>

            <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-5">
                <div className="flex flex-col sm:flex-row gap-4">
                    <div className="flex-1 relative">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-slate-400" />
                        <input
                            type="text"
                            placeholder="Search by title, ID, assignee..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-slate-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500 transition outline-none"
                        />
                    </div>

                    <div className="sm:w-48">
                        <select
                            value={statusFilter}
                            onChange={(e) => setStatusFilter(e.target.value)}
                            className="w-full px-4 py-2.5 rounded-lg border border-slate-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500 transition outline-none bg-white cursor-pointer"
                        >
                            {uniqueStatuses.map(status => (
                                <option key={status} value={status}>{status}</option>
                            ))}
                        </select>
                    </div>

                    <button 
                        onClick={handleExport}
                        className="px-4 py-2.5 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 transition text-sm font-medium flex items-center gap-2 text-slate-700"
                    >
                        <Download className="h-4 w-4" />
                        Export
                    </button>
                </div>
            </div>

            <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
                {filteredPatents.length === 0 ? (
                    <div className="p-16 text-center flex flex-col items-center">
                        <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mb-4">
                            <FileText className="h-8 w-8 text-slate-300" />
                        </div>
                        <p className="text-slate-900 font-semibold text-lg">No filings found</p>
                        <p className="text-slate-500 text-sm mt-1 max-w-xs mx-auto">
                            You haven't submitted any patents yet, or your search didn't match any records.
                        </p>
                    </div>
                ) : (
                    <div className="divide-y divide-slate-100">
                        {filteredPatents.map((patent) => (
                            <div
                                key={patent.id}
                                className="p-6 hover:bg-slate-50 transition cursor-pointer group relative"
                                onClick={() => onViewPatent && onViewPatent(patent)}
                            >
                                <div className="flex items-start justify-between gap-4">
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-center gap-3 mb-2">
                                            <span className="text-xs font-mono font-bold text-indigo-600 bg-indigo-50 px-2 py-1 rounded border border-indigo-100">
                                                {patent.patentNumber}
                                            </span>
                                            <span className={`px-2.5 py-0.5 rounded-full text-[10px] uppercase font-bold border ${getStatusColor(patent.status)}`}>
                                                {patent.status}
                                            </span>
                                        </div>
                                        <h3 className="text-lg font-bold text-slate-900 mb-2 group-hover:text-indigo-600 transition-colors line-clamp-1">
                                            {patent.title}
                                        </h3>
                                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-y-2 gap-x-6 text-sm text-slate-500 mt-3">
                                            <div className="flex items-center gap-2">
                                                <Building className="h-4 w-4 text-slate-400" />
                                                <span className="truncate" title={patent.assignee}>{patent.assignee}</span>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <User className="h-4 w-4 text-slate-400" />
                                                <span className="truncate" title={patent.inventors}>{patent.inventors}</span>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <Calendar className="h-4 w-4 text-slate-400" />
                                                <span>{new Date(patent.filingDate).toLocaleDateString()}</span>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <MapPin className="h-4 w-4 text-slate-400" />
                                                <span>{patent.region}</span>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="flex items-center self-center pl-4">
                                        <button 
                                            className="p-2 text-slate-300 hover:text-indigo-600 hover:bg-indigo-50 rounded-full transition-all" 
                                            title="View Details"
                                        >
                                            <Eye className="h-5 w-5" />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            <div className="flex justify-between items-center text-xs font-medium text-slate-400 px-2">
                <span>Total Records: {filteredPatents.length}</span>
                <span>Data sourced from Local Database</span>
            </div>
        </div>
    );
};

export default PatentsPage;