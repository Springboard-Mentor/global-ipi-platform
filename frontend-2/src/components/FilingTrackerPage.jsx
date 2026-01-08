import React, { useState, useEffect, useCallback } from 'react';
import { 
    Search, Bell, Filter, Shield, FileText, Clock, AlertCircle, 
    Database, Loader2, X, Edit3, Lock, CheckCircle2, 
    BellPlus, CheckSquare, Trash2 // ✅ Added Trash2 Icon
} from 'lucide-react';
import axios from 'axios';

// ✅ API Config
const API_BASE = "http://192.168.43.45:5001/api";

const FilingTrackerPage = () => {
    
    // --- 1. USER CONTEXT ---
    const [currentUser, setCurrentUser] = useState(null);

    // --- 2. STATE ---
    const [filings, setFilings] = useState([]);
    const [loading, setLoading] = useState(false);
    const [notifications, setNotifications] = useState([]);
    const [showAlertsPanel, setShowAlertsPanel] = useState(false);

    // UI Modals State
    const [selectedFiling, setSelectedFiling] = useState(null); 
    const [editingFiling, setEditingFiling] = useState(null);   
    const [alertFiling, setAlertFiling] = useState(null);       

    // Filters & Pagination
    const [searchQuery, setSearchQuery] = useState('');
    const [statusFilter, setStatusFilter] = useState('ALL');
    const [itemsPerPage, setItemsPerPage] = useState(10);
    const [currentPage, setCurrentPage] = useState(1);
    
    // Stats
    const [stats, setStats] = useState({ total: 0, granted: 0, pending: 0, expired: 0 });

    // --- 3. INITIALIZATION ---
    useEffect(() => {
        const storedUser = localStorage.getItem("user");
        if (storedUser) {
            try {
                const parsedUser = JSON.parse(storedUser);
                setCurrentUser(parsedUser);
            } catch (error) {
                console.error("Failed to parse user data", error);
            }
        }
    }, []);

    // ✅ CHECK: Is the user an Admin? (Case insensitive check is safer)
    const isAdmin = currentUser?.userType?.toLowerCase() === 'admin';

    // --- 4. DATA NORMALIZER ---
    const normalizeData = (item) => {
        return {
            id: item.id,
            ownerId: item.userId || 0, 
            title: item.title || 'Untitled Asset',
            displayId: item.patentNumber || item.assetNumber || `ID-${item.id}`,
            applicationNumber: item.applicationNumber || 'N/A', 
            jurisdiction: item.jurisdiction || 'Global',
            status: item.status || 'PENDING',
            patentStatus: item.patentStatus || 'Pending',
            filingDate: item.filingDate ? new Date(item.filingDate).toLocaleDateString() : 'N/A',
            expirationDate: item.expirationDate ? new Date(item.expirationDate).toLocaleDateString() : 'N/A', 
            assignee: item.assignee || 'Unknown Entity',
            contactEmail: item.email || 'N/A', 
            type: item.filingType || 'PATENT',
            description: item.description || item.details || 'No detailed description available.',
            sourceLink: `https://patents.google.com/patent/${(item.patentNumber || '').replace(/\s/g,'')}/en`
        };
    };

    // --- 5. FETCH DATA ---
    const fetchData = useCallback(async () => {
        setLoading(true);
        try {
            const [dataRes, notifRes] = await Promise.all([
                axios.get(`${API_BASE}/tracker/all`), 
                axios.get(`${API_BASE}/notifications`).catch(() => ({ data: [] }))
            ]);

            const rawData = Array.isArray(dataRes.data) ? dataRes.data : [];
            const cleanData = rawData.map(normalizeData);

            setFilings(cleanData);
            setNotifications(notifRes.data || []);

            setStats({
                total: cleanData.length,
                granted: cleanData.filter(f => f.status?.toUpperCase().includes('GRANTED')).length,
                pending: cleanData.filter(f => ['PENDING', 'FILED', 'UNDER EXAMINATION'].some(s => f.status?.toUpperCase().includes(s))).length,
                expired: cleanData.filter(f => ['EXPIRED', 'ABANDONED'].some(s => f.status?.toUpperCase().includes(s))).length
            });

        } catch (err) {
            console.error("Fetch Error:", err);
            setFilings([]); 
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => { fetchData(); }, [fetchData]);

    // --- 6. ACTIONS ---
    
    // Update Status
    const handleStatusUpdate = async (newStatus) => {
        if(!editingFiling) return;
        try {
            await axios.put(`${API_BASE}/tracker/update/${editingFiling.id}`, { status: newStatus });
            setEditingFiling(null);
            fetchData(); 
            setNotifications(prev => [{ message: `Status updated to ${newStatus} for ${editingFiling.displayId}`, type: 'INFO', timestamp: Date.now() }, ...prev]);
        } catch (e) {
            alert("Update Failed");
        }
    };

    // ✅ NEW: Delete Filing
    const handleDelete = async (e, id) => {
        e.stopPropagation(); // Stop row click
        if (!window.confirm("Are you sure you want to delete this filing? This action cannot be undone.")) return;

        try {
            await axios.delete(`${API_BASE}/tracker/delete/${id}`);
            
            // Optimistic UI update or Refetch
            setNotifications(prev => [{ message: `Filing deleted successfully`, type: 'SUCCESS', timestamp: Date.now() }, ...prev]);
            fetchData(); 

        } catch (err) {
            console.error("Delete Error", err);
            alert("Failed to delete filing.");
        }
    };

    const handleSaveAlerts = (types) => {
        if(!alertFiling) return;
        setNotifications(prev => [{ 
            message: `Alerts configured for ${alertFiling.displayId}: ${types.join(', ')}`, 
            type: 'SUCCESS', 
            timestamp: Date.now() 
        }, ...prev]);
        setAlertFiling(null);
        setShowAlertsPanel(true); 
    };

    // --- 7. RENDER HELPERS ---
    const getStatusColor = (s) => {
        const val = (s || '').toUpperCase();
        if (val.includes('GRANTED')) return 'bg-emerald-100 text-emerald-700 border-emerald-200';
        if (val.includes('PENDING')) return 'bg-amber-100 text-amber-700 border-amber-200';
        if (val.includes('EXPIRED')) return 'bg-rose-100 text-rose-700 border-rose-200';
        return 'bg-slate-100 text-slate-600 border-slate-200';
    };

    const filteredData = filings.filter(item => {
        const searchLower = searchQuery.toLowerCase();
        return (item.title?.toLowerCase().includes(searchLower) || item.displayId?.toLowerCase().includes(searchLower)) &&
               (statusFilter === 'ALL' || item.status?.toUpperCase().includes(statusFilter));
    });
    const paginatedDisplay = filteredData.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

    return (
        <div className="min-h-screen bg-[#F8FAFC] p-8 font-sans text-left">
            
            {/* HEADER */}
            <div className="flex justify-between items-center mb-10 bg-white p-4 rounded-[2rem] shadow-sm border border-slate-100">
                <div className="flex items-center gap-4 px-2">
                    <div className="bg-indigo-600 p-2.5 rounded-xl text-white shadow-indigo-200 shadow-lg">
                        <Shield size={24} />
                    </div>
                    <div>
                        <h1 className="text-xl font-black text-slate-900 uppercase tracking-tighter">IP Intelligence</h1>
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Filing Tracker Module</p>
                    </div>
                </div>

                <div className="flex items-center gap-4">
                    {/* User Badge */}
                    {currentUser ? (
                        <div className="flex items-center gap-2 bg-indigo-50 px-4 py-2 rounded-xl border border-indigo-100">
                            <div className="w-8 h-8 rounded-full bg-indigo-200 flex items-center justify-center text-indigo-700 font-bold border border-indigo-300">
                                {currentUser.name ? currentUser.name.charAt(0).toUpperCase() : "U"}
                            </div>
                            <div className="flex flex-col">
                                <span className="text-[9px] font-bold text-slate-400 uppercase">
                                    {isAdmin ? "Administrator" : "Logged In As"}
                                </span>
                                <span className="text-xs font-bold text-indigo-700">{currentUser.email}</span>
                            </div>
                        </div>
                    ) : (
                         <div className="flex items-center gap-2 bg-gray-50 px-4 py-2 rounded-xl border border-gray-100">
                            <span className="text-xs font-bold text-gray-400">Guest User</span>
                        </div>
                    )}

                    {/* Alert Bell */}
                    <div className="relative">
                        <button onClick={() => setShowAlertsPanel(!showAlertsPanel)} className="relative p-3 bg-white border border-slate-200 rounded-xl hover:bg-slate-50 transition-all">
                            <Bell size={20} className="text-slate-600" />
                            {notifications.length > 0 && <span className="absolute top-2 right-2 w-2.5 h-2.5 bg-rose-500 rounded-full border-2 border-white"></span>}
                        </button>
                        
                        {showAlertsPanel && (
                            <div className="absolute right-0 mt-4 w-80 bg-white rounded-2xl shadow-2xl border border-slate-100 z-50 overflow-hidden">
                                <div className="p-4 border-b border-slate-50 bg-slate-50 flex justify-between items-center">
                                    <h3 className="text-xs font-black text-slate-700 uppercase tracking-widest">Notifications</h3>
                                    <span className="text-[10px] font-bold bg-white px-2 py-1 rounded border text-indigo-600 shadow-sm">{notifications.length} New</span>
                                </div>
                                <div className="max-h-64 overflow-y-auto">
                                    {notifications.map((n, i) => (
                                        <div key={i} className="p-4 border-b border-slate-50 hover:bg-slate-50 transition-colors cursor-default">
                                            <p className="text-xs font-bold text-slate-700 leading-snug">{n.message}</p>
                                            <p className="text-[9px] text-slate-400 mt-1 flex items-center gap-1">
                                                <Clock size={10}/> {new Date(n.timestamp).toLocaleTimeString()}
                                            </p>
                                        </div>
                                    ))}
                                    {notifications.length === 0 && <div className="p-8 text-center text-slate-400 text-xs">No notifications</div>}
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* STATS */}
            <div className="grid grid-cols-4 gap-6 mb-10">
                <StatCard label="Total Tracked" value={stats.total} icon={FileText} onClick={() => setStatusFilter('ALL')} active={statusFilter === 'ALL'} />
                <StatCard label="Granted / Active" value={stats.granted} icon={CheckCircle2} onClick={() => setStatusFilter('GRANTED')} active={statusFilter === 'GRANTED'} />
                <StatCard label="Pending Review" value={stats.pending} icon={Clock} onClick={() => setStatusFilter('PENDING')} active={statusFilter === 'PENDING'} />
                <StatCard label="Expired / Dead" value={stats.expired} icon={AlertCircle} onClick={() => setStatusFilter('EXPIRED')} active={statusFilter === 'EXPIRED'} />
            </div>

            {/* MAIN LIST */}
            <div className="bg-white rounded-[2.5rem] p-8 border border-slate-200 shadow-sm min-h-[600px]">
                
                {/* Toolbar */}
                <div className="flex justify-between items-center mb-8 pb-6 border-b border-slate-100">
                    <h2 className="text-lg font-black text-slate-900 uppercase tracking-tighter">Team Watchlist</h2>
                    <div className="relative w-96">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                        <input 
                            type="text" 
                            placeholder="Search filings..." 
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-bold text-slate-700 outline-none focus:ring-2 focus:ring-indigo-100 transition-all"
                        />
                    </div>
                </div>

                {/* Rows */}
                <div className="space-y-3">
                    {loading ? (
                        <div className="py-20 text-center"><Loader2 className="animate-spin mx-auto text-indigo-600 mb-4" /><p className="text-xs text-slate-400 font-bold uppercase">Loading Data...</p></div>
                    ) : paginatedDisplay.length === 0 ? (
                        <div className="py-20 text-center opacity-50"><Database size={48} className="mx-auto text-slate-300 mb-4" /><p className="text-slate-400 font-bold text-sm">No filings found.</p></div>
                    ) : (
                        paginatedDisplay.map((item) => {
                            // ✅ LOGIC: Owner OR Admin can Edit/Delete
                            const isOwner = currentUser && (item.ownerId === currentUser.id);
                            const canModify = isOwner || isAdmin;

                            return (
                                <div key={item.id} className="group flex items-center justify-between p-5 rounded-2xl border border-slate-100 bg-white hover:border-indigo-200 hover:shadow-lg transition-all cursor-pointer" onClick={() => setSelectedFiling(item)}>
                                    
                                    {/* Left Info */}
                                    <div className="flex items-center gap-5">
                                        <div className={`w-12 h-12 rounded-xl flex items-center justify-center font-black text-xs transition-colors ${item.type === 'PATENT' ? 'bg-indigo-50 text-indigo-600' : 'bg-emerald-50 text-emerald-600'}`}>
                                            {item.type === 'PATENT' ? 'PAT' : 'TM'}
                                        </div>
                                        <div>
                                            <h4 className="font-bold text-slate-800 text-sm line-clamp-1 group-hover:text-indigo-600 transition-colors">{item.title}</h4>
                                            <div className="flex items-center gap-2 mt-1.5">
                                                <span className="text-[10px] font-bold text-slate-500 bg-slate-100 px-2 py-0.5 rounded">{item.displayId}</span>
                                                <span className="text-[10px] font-bold text-slate-400">{item.jurisdiction}</span>
                                                
                                                {/* Ownership Tag */}
                                                {isOwner ? (
                                                    <span className="text-[9px] font-bold px-2 py-0.5 rounded bg-indigo-50 text-indigo-600 border border-indigo-100">My Filing</span>
                                                ) : (
                                                    <span className="text-[9px] font-bold px-2 py-0.5 rounded bg-slate-50 text-slate-400 border border-slate-100">Team</span>
                                                )}
                                            </div>
                                        </div>
                                    </div>

                                    {/* Right Actions */}
                                    <div className="flex items-center gap-3">
                                        <span className={`px-3 py-1.5 rounded-lg text-[10px] font-black uppercase border tracking-wide ${getStatusColor(item.status)}`}>
                                            {item.status}
                                        </span>
                                        
                                        {/* ALERT BUTTON */}
                                        <button 
                                            onClick={(e) => { e.stopPropagation(); setAlertFiling(item); }}
                                            className="p-2 text-slate-400 hover:bg-amber-50 hover:text-amber-500 rounded-lg transition-all"
                                            title="Set Alerts"
                                        >
                                            <BellPlus size={18} />
                                        </button>

                                        {/* EDIT & DELETE BUTTONS (Owner or Admin) */}
                                        {canModify ? (
                                            <>
                                                <button 
                                                    onClick={(e) => { e.stopPropagation(); setEditingFiling(item); }}
                                                    className="p-2 text-slate-400 hover:bg-indigo-50 hover:text-indigo-600 rounded-lg transition-all"
                                                    title="Edit Status"
                                                >
                                                    <Edit3 size={18} />
                                                </button>

                                                {/* ✅ NEW DELETE BUTTON */}
                                                <button 
                                                    onClick={(e) => handleDelete(e, item.id)}
                                                    className="p-2 text-slate-400 hover:bg-rose-50 hover:text-rose-600 rounded-lg transition-all"
                                                    title="Delete Filing"
                                                >
                                                    <Trash2 size={18} />
                                                </button>
                                            </>
                                        ) : (
                                            <button className="p-2 text-slate-300 cursor-not-allowed" title="Read Only">
                                                <Lock size={18} />
                                            </button>
                                        )}
                                    </div>
                                </div>
                            );
                        })
                    )}
                </div>
            </div>

            {/* --- MODALS --- */}

            {/* 1. DETAIL MODAL */}
            {selectedFiling && (
                <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-[2rem] p-8 max-w-2xl w-full shadow-2xl">
                        <div className="flex justify-between items-start mb-6">
                            <div>
                                <h2 className="text-xl font-black text-slate-900 uppercase">{selectedFiling.title}</h2>
                                <p className="text-xs text-slate-400 font-bold mt-1">ID: {selectedFiling.displayId}</p>
                            </div>
                            <button onClick={() => setSelectedFiling(null)}><X size={24} className="text-slate-400 hover:text-rose-500"/></button>
                        </div>

                        <div className="grid grid-cols-2 gap-4 mb-6">
                            <InfoItem label="Status" value={selectedFiling.status} />
                            <InfoItem label="Application No." value={selectedFiling.applicationNumber} />
                            <InfoItem label="Filing Date" value={selectedFiling.filingDate} />
                            <InfoItem label="Expiration Date" value={selectedFiling.expirationDate} />
                            <InfoItem label="Assignee" value={selectedFiling.assignee} />
                            <InfoItem label="Contact Email" value={selectedFiling.contactEmail} />
                        </div>

                        <div className="bg-slate-50 p-6 rounded-2xl border border-slate-100 mb-6 max-h-60 overflow-y-auto">
                            <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Description / Abstract</h4>
                            <p className="text-sm text-slate-600 leading-relaxed whitespace-pre-wrap">{selectedFiling.description}</p>
                        </div>
                        
                        <a href={selectedFiling.sourceLink} target="_blank" rel="noreferrer" className="block w-full py-3 bg-indigo-600 text-white text-center rounded-xl font-bold uppercase text-xs tracking-widest hover:bg-indigo-700">View Official Source</a>
                    </div>
                </div>
            )}

            {/* 2. EDIT STATUS MODAL */}
            {editingFiling && (
                <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50">
                    <div className="bg-white rounded-2xl p-6 w-80 shadow-2xl">
                        <h3 className="text-lg font-black text-slate-900 mb-4">Update Status</h3>
                        <div className="space-y-2">
                            {['GRANTED', 'PENDING', 'UNDER EXAMINATION', 'EXPIRED'].map(status => (
                                <button key={status} onClick={() => handleStatusUpdate(status)} className="w-full py-3 text-xs font-bold rounded-xl border hover:bg-slate-50 transition-all">{status}</button>
                            ))}
                        </div>
                        <button onClick={() => setEditingFiling(null)} className="w-full mt-4 text-xs font-bold text-slate-400">Cancel</button>
                    </div>
                </div>
            )}

            {/* 3. ADD ALERT MODAL */}
            {alertFiling && (
                <AlertConfigModal filing={alertFiling} onClose={() => setAlertFiling(null)} onSave={handleSaveAlerts} />
            )}
        </div>
    );
};

// --- HELPER COMPONENTS (Keep these same as before) ---
const AlertConfigModal = ({ filing, onClose, onSave }) => {
    const [selectedTypes, setSelectedTypes] = useState([]);
    const toggleType = (type) => {
        if(selectedTypes.includes(type)) setSelectedTypes(prev => prev.filter(t => t !== type));
        else setSelectedTypes(prev => [...prev, type]);
    };
    return (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50">
            <div className="bg-white rounded-[2rem] p-8 w-96 shadow-2xl transform transition-all scale-100">
                <div className="flex justify-between items-center mb-6">
                    <h3 className="text-lg font-black text-slate-900 uppercase tracking-tight">Configure Alerts</h3>
                    <button onClick={onClose}><X size={20} className="text-slate-400 hover:text-slate-600"/></button>
                </div>
                <p className="text-xs text-slate-500 mb-6 font-medium">Select triggers for: <br/><b className="text-slate-800">{filing.displayId}</b></p>
                <div className="space-y-3 mb-8">
                    {[
                        { id: 'RENEWAL', label: 'Renewal Due' },
                        { id: 'APPROVAL', label: 'Get Approval / Grant' },
                        { id: 'STATUS_CHANGE', label: 'Any Status Change' }
                    ].map((opt) => (
                        <div key={opt.id} onClick={() => toggleType(opt.id)} className={`flex items-center gap-3 p-4 rounded-xl border cursor-pointer transition-all ${selectedTypes.includes(opt.id) ? 'bg-indigo-50 border-indigo-200' : 'bg-white border-slate-100 hover:border-indigo-100'}`}>
                            <div className={`w-5 h-5 rounded-md flex items-center justify-center border ${selectedTypes.includes(opt.id) ? 'bg-indigo-600 border-indigo-600' : 'border-slate-300'}`}>
                                {selectedTypes.includes(opt.id) && <CheckSquare size={14} className="text-white"/>}
                            </div>
                            <span className={`text-xs font-bold ${selectedTypes.includes(opt.id) ? 'text-indigo-900' : 'text-slate-600'}`}>{opt.label}</span>
                        </div>
                    ))}
                </div>
                <button onClick={() => onSave(selectedTypes)} disabled={selectedTypes.length === 0} className="w-full py-3 bg-indigo-600 text-white rounded-xl font-bold uppercase text-xs tracking-widest hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all">Save Alerts</button>
            </div>
        </div>
    );
};

const StatCard = ({ label, value, icon: Icon, onClick, active }) => (
    <div onClick={onClick} className={`p-6 rounded-[2rem] border shadow-sm flex justify-between items-center cursor-pointer transition-all ${active ? 'bg-indigo-600 border-indigo-600 shadow-indigo-200 shadow-lg scale-105' : 'bg-white border-slate-100 hover:shadow-md hover:border-indigo-100'}`}>
        <div>
            <p className={`text-[10px] font-black uppercase tracking-widest mb-1 ${active ? 'text-indigo-200' : 'text-slate-400'}`}>{label}</p>
            <p className={`text-3xl font-black ${active ? 'text-white' : 'text-slate-900'}`}>{value}</p>
        </div>
        <Icon className={`size-6 ${active ? 'text-white' : 'text-slate-200'}`} />
    </div>
);

const InfoItem = ({ label, value }) => (
    <div className="border border-slate-100 p-4 rounded-xl bg-white hover:border-indigo-50 transition-colors">
        <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">{label}</p>
        <p className="text-sm font-bold text-slate-800 truncate">{value || 'N/A'}</p>
    </div>
);

export default FilingTrackerPage;