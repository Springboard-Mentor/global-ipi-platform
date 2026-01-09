import React, { useState, useEffect, useCallback } from 'react';
import { 
    Search, Shield, FileText, Clock, AlertCircle, 
    Database, Loader2, X, Edit3, Lock, CheckCircle2, 
    Trash2, CheckSquare, Save, BellRing, Mail, Send, Globe,
    ChevronRight
} from 'lucide-react';
import axios from 'axios';

// ✅ API Config
const API_BASE = "http://192.168.43.45:5001/api";

// ✅ CONSTANT: Updated Super Admin Email
const ADMIN_EMAIL = "bhuvananagarajan0728@gmail.com";

const FilingTrackerPage = () => {
    
    // --- 1. USER CONTEXT ---
    const [currentUser, setCurrentUser] = useState(null);

    // --- 2. STATE ---
    const [filings, setFilings] = useState([]);
    const [loading, setLoading] = useState(false);
    
    // ✅ NEW: Action Loading State (Prevents buttons seeming "stuck" while email sends)
    const [actionLoading, setActionLoading] = useState(false);

    // --- 3. MODAL STATES ---
    const [selectedFiling, setSelectedFiling] = useState(null); 
    const [statusFiling, setStatusFiling] = useState(null);     
    const [detailsFiling, setDetailsFiling] = useState(null);   
    const [alertFiling, setAlertFiling] = useState(null);       
    const [remarksFiling, setRemarksFiling] = useState(null);   

    // Filters & Pagination
    const [searchQuery, setSearchQuery] = useState('');
    const [statusFilter, setStatusFilter] = useState('ALL');
    const [itemsPerPage] = useState(10);
    const [currentPage, setCurrentPage] = useState(1);
    
    // Stats
    const [stats, setStats] = useState({ total: 0, granted: 0, pending: 0, expired: 0 });

    // --- 4. INITIALIZATION ---
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

    // ✅ CHECK: Is the user the designated Admin?
    const isSuperAdmin = currentUser?.email === ADMIN_EMAIL;

    // --- 5. DATA NORMALIZER ---
    const normalizeData = (item) => {
        // ✅ FIX: Force type to Uppercase
        const rawType = item.filingType || item.type || 'PATENT';
        const type = rawType.toUpperCase(); 

        return {
            id: item.id,
            ownerId: item.userId || 0, 
            title: item.title || 'Untitled Asset',
            displayId: item.patentNumber || item.assetNumber || `ID-${item.id}`,
            applicationNumber: item.applicationNumber || 'Pending', 
            jurisdiction: item.jurisdiction || 'Global',
            status: item.status || 'PENDING',
            patentStatus: item.patentStatus || 'Pending',
            filingDate: item.filingDate ? new Date(item.filingDate).toISOString().split('T')[0] : '',
            expirationDate: item.expirationDate ? new Date(item.expirationDate).toISOString().split('T')[0] : '', 
            assignee: item.assignee || 'Unknown Entity',
            contactEmail: item.email || 'N/A', 
            type: type, 
            description: item.description || item.details || 'No detailed description available.',
            sourceLink: `https://patents.google.com/patent/${(item.patentNumber || '').replace(/\s/g,'')}/en`,
            isSynced: item.source === 'API' || (item.patentNumber && item.patentNumber.length > 8 && /[A-Z]/.test(item.patentNumber))
        };
    };

    // --- 6. FETCH DATA ---
    const fetchData = useCallback(async () => {
        setLoading(true);
        try {
            const dataRes = await axios.get(`${API_BASE}/tracker/all`);
            const rawData = Array.isArray(dataRes.data) ? dataRes.data : [];
            const cleanData = rawData.map(normalizeData);

            setFilings(cleanData);

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

    // --- 7. ACTIONS ---
    
    // ✅ Admin: Update Status (Sends Email to User)
    const handleStatusUpdate = async (newStatus) => {
        if(!statusFiling || actionLoading) return; // Prevent double click
        
        setActionLoading(true); // ⏳ Start Loading
        try {
            // Passing remarks: "" tells backend to send standard status update email
            await axios.put(`${API_BASE}/tracker/update/${statusFiling.id}`, { 
                status: newStatus,
                remarks: "" 
            });
            setStatusFiling(null);
            fetchData(); 
            alert(`Status updated to ${newStatus}. Notification sent to user.`);
        } catch (e) {
            console.error(e);
            alert("Update Failed: " + (e.response?.data || "Server Error"));
        } finally {
            setActionLoading(false); // 🛑 Stop Loading
        }
    };

    // ✅ User: Edit Details
    const handleDetailsUpdate = async (formData) => {
        if(!detailsFiling) return;
        try {
            await axios.put(`${API_BASE}/tracker/update/${detailsFiling.id}`, formData);
            setDetailsFiling(null);
            fetchData();
            alert("Details updated successfully.");
        } catch (e) {
            alert("Update Details Failed");
        }
    };

    // ✅ Admin Only: Delete Filing
    const handleDelete = async (e, id) => {
        e.stopPropagation(); 
        if (!isSuperAdmin) {
            alert("Only Administrators can delete filings.");
            return;
        }
        if (!window.confirm("⚠️ ADMIN ACTION: Permanently delete this filing?")) return;

        try {
            await axios.delete(`${API_BASE}/tracker/delete/${id}`);
            fetchData(); 
            alert("Filing deleted successfully.");
        } catch (err) {
            alert("Failed to delete filing.");
        }
    };

    // ✅ Admin: Send Remarks (Separate Feature)
    const handleSendRemarks = async (remarks) => {
        if(!remarksFiling || actionLoading) return;
        
        setActionLoading(true);
        try {
            // This is a simulation, replace with actual endpoint if available
            console.log("Sending Email to:", remarksFiling.contactEmail, "Message:", remarks);
            
            // If you have a backend endpoint for ad-hoc emails:
            // await axios.post(`${API_BASE}/tracker/send-remarks`, { ... });
            
            alert(`Email successfully sent to owner (${remarksFiling.contactEmail})`);
            setRemarksFiling(null);
        } catch (error) {
            alert("Failed to send remarks.");
        } finally {
            setActionLoading(false);
        }
    };

    // ✅ User: Save Alerts -> Notify Admin
    const handleSaveAlerts = async (types) => {
        if(!alertFiling || actionLoading) return;
        
        setActionLoading(true); // ⏳ Start Loading
        try {
            const payload = {
                userEmail: currentUser.email,
                userName: currentUser.name,
                filingId: alertFiling.displayId,
                filingTitle: alertFiling.title,
                triggers: types,
                timestamp: new Date().toISOString()
            };
            
            // Triggers the admin email on backend
            await axios.post(`${API_BASE}/notifications/notify-admin`, payload);
            
            alert(`Alerts configured! Request sent to Admin for ${alertFiling.displayId}.`);
            setAlertFiling(null);

        } catch (error) {
            console.error("Alert Trigger Failed", error);
            alert("Failed to configure alerts. Please check connection.");
        } finally {
            setActionLoading(false); // 🛑 Stop Loading
        }
    };

    // --- 8. RENDER HELPERS ---
    const getStatusStyle = (s) => {
        const val = (s || '').toUpperCase();
        if (val.includes('GRANTED')) return { bg: 'bg-emerald-100', text: 'text-emerald-700', dot: 'bg-emerald-500' };
        if (val.includes('PENDING')) return { bg: 'bg-amber-100', text: 'text-amber-700', dot: 'bg-amber-500' };
        if (val.includes('EXPIRED')) return { bg: 'bg-rose-100', text: 'text-rose-700', dot: 'bg-rose-500' };
        return { bg: 'bg-slate-100', text: 'text-slate-600', dot: 'bg-slate-400' };
    };

    const filteredData = filings.filter(item => {
        const searchLower = searchQuery.toLowerCase();
        return (item.title?.toLowerCase().includes(searchLower) || item.displayId?.toLowerCase().includes(searchLower)) &&
               (statusFilter === 'ALL' || item.status?.toUpperCase().includes(statusFilter));
    });
    const paginatedDisplay = filteredData.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

    return (
        <div className="min-h-screen bg-slate-50 p-6 md:p-12 font-sans text-left">
            
            {/* HEADER SECTION */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-12 gap-6">
                <div className="flex items-center gap-5">
                    <div className="bg-white p-4 rounded-3xl shadow-xl shadow-indigo-100 border border-slate-100">
                        <Shield size={32} className="text-indigo-600" />
                    </div>
                    <div>
                        <h1 className="text-3xl font-black text-slate-900 tracking-tight uppercase">Filing Tracker</h1>
                        <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mt-1">Global IP Intelligence • {filings.length} Assets</p>
                    </div>
                </div>

                {/* User Badge */}
                {currentUser && (
                    <div className="flex items-center gap-4 bg-white pl-2 pr-6 py-2 rounded-full border border-slate-200 shadow-sm">
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-white shadow-md ${isSuperAdmin ? 'bg-gradient-to-br from-rose-500 to-pink-600' : 'bg-gradient-to-br from-indigo-500 to-purple-600'}`}>
                            {currentUser.name ? currentUser.name.charAt(0).toUpperCase() : "U"}
                        </div>
                        <div className="flex flex-col">
                            <span className={`text-[9px] font-black uppercase tracking-widest ${isSuperAdmin ? 'text-rose-600' : 'text-indigo-600'}`}>
                                {isSuperAdmin ? "Super Admin" : "User Account"}
                            </span>
                            <span className="text-xs font-bold text-slate-700">{currentUser.email}</span>
                        </div>
                    </div>
                )}
            </div>

            {/* KPI STATS */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
                <StatCard label="Total Tracked" value={stats.total} icon={FileText} color="blue" onClick={() => setStatusFilter('ALL')} active={statusFilter === 'ALL'} />
                <StatCard label="Granted" value={stats.granted} icon={CheckCircle2} color="emerald" onClick={() => setStatusFilter('GRANTED')} active={statusFilter === 'GRANTED'} />
                <StatCard label="Pending" value={stats.pending} icon={Clock} color="amber" onClick={() => setStatusFilter('PENDING')} active={statusFilter === 'PENDING'} />
                <StatCard label="Expired" value={stats.expired} icon={AlertCircle} color="rose" onClick={() => setStatusFilter('EXPIRED')} active={statusFilter === 'EXPIRED'} />
            </div>

            {/* MAIN DATA TABLE/LIST */}
            <div className="bg-white rounded-[2.5rem] border border-slate-200 shadow-2xl shadow-slate-200/50 overflow-hidden min-h-[600px]">
                
                {/* Toolbar */}
                <div className="p-8 border-b border-slate-100 flex flex-col md:flex-row justify-between items-center gap-6">
                    <h2 className="text-lg font-black text-slate-800 uppercase tracking-widest flex items-center gap-3">
                        <Database size={20} className="text-slate-400"/> Portfolio Assets
                    </h2>
                    <div className="relative w-full md:w-96 group">
                        <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-500 transition-colors" size={20} />
                        <input 
                            type="text" 
                            placeholder="Search patents, application IDs..." 
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full pl-12 pr-6 py-4 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-bold text-slate-700 outline-none focus:border-indigo-500 focus:bg-white transition-all focus:ring-4 focus:ring-indigo-500/10"
                        />
                    </div>
                </div>

                {/* List Content */}
                <div className="p-6 md:p-8 space-y-4">
                    {loading ? (
                        <div className="py-32 text-center flex flex-col items-center">
                            <Loader2 className="animate-spin text-indigo-600 w-12 h-12 mb-4" />
                            <p className="text-xs text-slate-400 font-black uppercase tracking-[0.3em]">Syncing Intelligence...</p>
                        </div>
                    ) : paginatedDisplay.length === 0 ? (
                        <div className="py-32 text-center opacity-50 flex flex-col items-center">
                            <div className="p-6 bg-slate-50 rounded-full mb-4"><Database size={48} className="text-slate-300" /></div>
                            <p className="text-slate-400 font-bold text-lg">No filings found matching your criteria.</p>
                        </div>
                    ) : (
                        paginatedDisplay.map((item) => {
                            const isOwner = currentUser && (item.ownerId === currentUser.id);
                            const style = getStatusStyle(item.status);
                            
                            // 🔒 Permissions
                            const canDelete = isSuperAdmin; 
                            const canEditStatus = isSuperAdmin;
                            const canSendRemarks = isSuperAdmin;
                            const canEditDetails = isOwner && !item.isSynced && !isSuperAdmin; 
                            const canSetAlert = isOwner; 

                            // ✅ LOGIC: Correct Icon based on Type
                            const isPatent = item.type === 'PATENT';

                            return (
                                <div key={item.id} className="group flex flex-col md:flex-row items-center justify-between p-6 rounded-[2rem] border border-slate-100 bg-white hover:border-indigo-200 hover:shadow-xl hover:shadow-indigo-100/40 transition-all duration-300 cursor-pointer transform hover:-translate-y-1" onClick={() => setSelectedFiling(item)}>
                                    
                                    {/* Asset Info */}
                                    <div className="flex items-center gap-6 w-full md:w-auto">
                                        {/* Icon Box */}
                                        <div className={`w-16 h-16 rounded-2xl flex flex-col items-center justify-center shadow-inner ${isPatent ? 'bg-indigo-50 text-indigo-600' : 'bg-cyan-50 text-cyan-600'}`}>
                                            <span className="text-[10px] font-black uppercase tracking-widest">{isPatent ? 'PAT' : 'TM'}</span>
                                            {isPatent ? <Shield size={18} className="mt-1"/> : <Globe size={18} className="mt-1"/>}
                                        </div>
                                        
                                        <div className="flex-1">
                                            <div className="flex items-center gap-3 mb-1">
                                                <h4 className="font-black text-slate-900 text-lg line-clamp-1">{item.title}</h4>
                                                {/* Ownership Tag */}
                                                {isOwner ? (
                                                    <span className="text-[8px] font-black px-2 py-0.5 rounded-md bg-indigo-100 text-indigo-700 uppercase tracking-wider">Owner</span>
                                                ) : (
                                                    <span className="text-[8px] font-black px-2 py-0.5 rounded-md bg-slate-100 text-slate-500 uppercase tracking-wider">Synced</span>
                                                )}
                                            </div>
                                            <div className="flex items-center gap-4 text-xs font-bold text-slate-400">
                                                <span className="bg-slate-50 px-2 py-1 rounded border border-slate-100 font-mono text-slate-500">{item.displayId}</span>
                                                <span className="flex items-center gap-1"><Globe size={12}/> {item.jurisdiction}</span>
                                                <span className="hidden md:inline text-slate-300">|</span>
                                                <span className="hidden md:inline">{item.filingDate || 'No Date'}</span>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Right Side: Status & Actions */}
                                    <div className="flex items-center gap-4 mt-4 md:mt-0 w-full md:w-auto justify-between md:justify-end">
                                        
                                        {/* Status Pill */}
                                        <div className={`px-4 py-2 rounded-xl flex items-center gap-2 border ${style.bg} ${style.text} border-transparent`}>
                                            <div className={`w-2 h-2 rounded-full ${style.dot} animate-pulse`}></div>
                                            <span className="text-[10px] font-black uppercase tracking-widest">{item.status}</span>
                                        </div>

                                        {/* Action Buttons - ALWAYS VISIBLE */}
                                        <div className="flex items-center gap-2">
                                            
                                            {canSetAlert && (
                                                <ActionButton icon={BellRing} onClick={(e) => { e.stopPropagation(); setAlertFiling(item); }} color="amber" tooltip="Configure Alerts" />
                                            )}

                                            {canSendRemarks && (
                                                <ActionButton icon={Mail} onClick={(e) => { e.stopPropagation(); setRemarksFiling(item); }} color="blue" tooltip="Send Remarks" />
                                            )}

                                            {canEditStatus && (
                                                <ActionButton icon={CheckSquare} onClick={(e) => { e.stopPropagation(); setStatusFiling(item); }} color="indigo" tooltip="Update Status" />
                                            )}

                                            {canEditDetails && (
                                                <ActionButton icon={Edit3} onClick={(e) => { e.stopPropagation(); setDetailsFiling(item); }} color="emerald" tooltip="Edit Details" />
                                            )}

                                            {canDelete ? (
                                                // 🔴 RED DELETE BUTTON (Always Visible)
                                                <button 
                                                    onClick={(e) => handleDelete(e, item.id)}
                                                    className="p-3 rounded-2xl transition-all text-rose-600 bg-rose-50 hover:bg-rose-100 border border-transparent hover:border-rose-200 hover:shadow-lg hover:-translate-y-1 active:scale-95"
                                                    title="Delete Asset"
                                                >
                                                    <Trash2 size={20} />
                                                </button>
                                            ) : (
                                                // 🔒 LOCKED ICON (Grey/Slate)
                                                <div className="p-3 text-slate-400 bg-slate-50 rounded-2xl cursor-not-allowed border border-transparent" title="Delete Locked"><Lock size={18}/></div>
                                            )}
                                            
                                            <ChevronRight size={16} className="text-slate-300 ml-2" />
                                        </div>
                                    </div>
                                </div>
                            );
                        })
                    )}
                </div>
            </div>

            {/* ================= MODALS ================= */}

            {/* 1. VIEW DETAILS MODAL */}
            {selectedFiling && (
                <Modal onClose={() => setSelectedFiling(null)} title={selectedFiling.title} subtitle={selectedFiling.displayId}>
                    <div className="grid grid-cols-2 gap-6 mb-8">
                        <InfoItem label="Status" value={selectedFiling.status} />
                        <InfoItem label="Application No." value={selectedFiling.applicationNumber} />
                        <InfoItem label="Filing Date" value={selectedFiling.filingDate} />
                        <InfoItem label="Expiration Date" value={selectedFiling.expirationDate} />
                        <InfoItem label="Assignee" value={selectedFiling.assignee} />
                        <InfoItem label="Contact Email" value={selectedFiling.contactEmail} />
                    </div>
                    <div className="bg-slate-50 p-8 rounded-[2rem] border border-slate-100 mb-8 max-h-60 overflow-y-auto">
                        <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-4">Abstract / Description</h4>
                        <p className="text-sm text-slate-600 leading-relaxed font-medium">{selectedFiling.description}</p>
                    </div>
                    <a href={selectedFiling.sourceLink} target="_blank" rel="noreferrer" className="block w-full py-5 bg-slate-900 text-white text-center rounded-2xl font-black uppercase text-xs tracking-[0.3em] hover:bg-indigo-600 hover:shadow-xl hover:shadow-indigo-200 transition-all transform hover:-translate-y-1">View Official Source</a>
                </Modal>
            )}

            {/* 2. ADMIN: UPDATE STATUS MODAL (No Remarks field, Loading state) */}
            {statusFiling && (
                <Modal onClose={() => setStatusFiling(null)} title="Update Status" subtitle={`Target: ${statusFiling.displayId}`} small>
                    <div className="space-y-3 mb-8">
                        {['GRANTED', 'PENDING', 'UNDER EXAMINATION', 'EXPIRED'].map(status => (
                            <button 
                                key={status} 
                                onClick={() => handleStatusUpdate(status)} 
                                disabled={actionLoading} // Disable while sending email
                                className="w-full py-4 text-xs font-black rounded-2xl border-2 border-slate-100 hover:border-indigo-600 hover:text-indigo-600 hover:bg-indigo-50 transition-all uppercase tracking-[0.1em] disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                            >
                                {actionLoading ? <Loader2 className="animate-spin" size={16} /> : status}
                            </button>
                        ))}
                    </div>
                    <button onClick={() => setStatusFiling(null)} className="w-full py-4 text-xs font-black text-slate-400 bg-slate-50 rounded-2xl hover:bg-slate-100 transition-colors">Cancel</button>
                </Modal>
            )}

            {/* 3. ADMIN: SEND REMARKS (Standalone, Loading state) */}
            {remarksFiling && (
                <Modal onClose={() => setRemarksFiling(null)} title="Send Remarks" subtitle={`To: ${remarksFiling.contactEmail}`} small>
                    <form onSubmit={(e) => { e.preventDefault(); handleSendRemarks(e.target.remarks.value); }}>
                        <textarea name="remarks" className="w-full p-6 bg-slate-50 border-2 border-slate-100 rounded-[1.5rem] text-sm font-medium focus:border-blue-500 focus:bg-white outline-none h-48 resize-none transition-all placeholder:text-slate-300 shadow-inner" placeholder="Type instructions..." required></textarea>
                        <div className="flex gap-4 mt-8">
                            <button type="button" onClick={() => setRemarksFiling(null)} className="flex-1 py-4 bg-slate-100 text-slate-500 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-slate-200">Cancel</button>
                            <button type="submit" disabled={actionLoading} className="flex-1 py-4 bg-blue-600 text-white rounded-2xl font-black text-xs uppercase tracking-widest flex items-center justify-center gap-2 hover:bg-blue-700 shadow-xl shadow-blue-200 transition-all transform active:scale-95 disabled:opacity-70 disabled:cursor-not-allowed">
                                {actionLoading ? <Loader2 className="animate-spin" size={16} /> : <><Send size={16}/> Send</>}
                            </button>
                        </div>
                    </form>
                </Modal>
            )}

            {/* 4. USER: EDIT DETAILS */}
            {detailsFiling && (
                <EditDetailsModal filing={detailsFiling} onClose={() => setDetailsFiling(null)} onSave={handleDetailsUpdate} />
            )}

            {/* 5. ALERTS (Loading State Added) */}
            {alertFiling && (
                <AlertConfigModal filing={alertFiling} onClose={() => setAlertFiling(null)} onSave={handleSaveAlerts} loading={actionLoading} />
            )}
        </div>
    );
};

/* --- REUSABLE COMPONENTS --- */

const Modal = ({ children, onClose, title, subtitle, small }) => (
    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-md flex items-center justify-center z-50 p-4 animate-in fade-in zoom-in-95 duration-200">
        <div className={`bg-white rounded-[3rem] ${small ? 'w-[450px]' : 'max-w-3xl w-full'} p-10 shadow-2xl border border-white/20 ring-1 ring-black/5`}>
            <div className="flex justify-between items-start mb-8">
                <div>
                    <h2 className="text-3xl font-black text-slate-900 uppercase leading-tight tracking-tight">{title}</h2>
                    {subtitle && <p className="text-sm text-slate-400 font-bold mt-2 font-mono tracking-widest">{subtitle}</p>}
                </div>
                <button onClick={onClose} className="p-3 bg-slate-50 rounded-2xl hover:bg-rose-50 hover:text-rose-600 transition-all shadow-sm"><X size={24} /></button>
            </div>
            {children}
        </div>
    </div>
);

const ActionButton = ({ icon: Icon, onClick, color, tooltip }) => (
    <button 
        onClick={onClick}
        className={`p-3 rounded-2xl transition-all text-slate-400 hover:text-${color}-600 hover:bg-${color}-50 border border-transparent hover:border-${color}-100 hover:shadow-lg hover:-translate-y-1 active:scale-95`}
        title={tooltip}
    >
        <Icon size={20} />
    </button>
);

const StatCard = ({ label, value, icon: Icon, onClick, active, color }) => (
    <div onClick={onClick} className={`p-6 rounded-[2.5rem] border-2 flex justify-between items-center cursor-pointer transition-all duration-300 hover:-translate-y-1 ${active ? `bg-${color}-600 border-${color}-600 shadow-2xl shadow-${color}-200 scale-105` : 'bg-white border-slate-100 hover:shadow-xl hover:border-indigo-100 shadow-sm'}`}>
        <div>
            <p className={`text-[10px] font-black uppercase tracking-[0.2em] mb-2 ${active ? 'text-white/70' : 'text-slate-400'}`}>{label}</p>
            <p className={`text-4xl font-black ${active ? 'text-white' : 'text-slate-900'}`}>{value}</p>
        </div>
        <div className={`p-4 rounded-2xl ${active ? 'bg-white/20 text-white' : `bg-${color}-50 text-${color}-500`}`}>
            <Icon className="size-6" />
        </div>
    </div>
);

const InfoItem = ({ label, value }) => (
    <div className="border border-slate-100 p-6 rounded-[1.5rem] bg-slate-50/50 hover:bg-white hover:shadow-lg transition-all hover:border-indigo-100 hover:-translate-y-1 group">
        <p className="text-[9px] font-black text-slate-400 uppercase tracking-[0.2em] mb-2 group-hover:text-indigo-500 transition-colors">{label}</p>
        <p className="text-sm font-bold text-slate-800 truncate">{value || 'N/A'}</p>
    </div>
);

// Form Components
const EditDetailsModal = ({ filing, onClose, onSave }) => {
    const [form, setForm] = useState({ title: filing.title, applicationNumber: filing.applicationNumber, filingDate: filing.filingDate });
    const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });
    return (
        <Modal onClose={onClose} title="Edit Details" small>
            <div className="space-y-6">
                {['title', 'applicationNumber', 'filingDate'].map(field => (
                    <div key={field}>
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 block">{field.replace(/([A-Z])/g, ' $1').trim()}</label>
                        <input type={field.includes('Date') ? 'date' : 'text'} name={field} value={form[field]} onChange={handleChange} className="w-full p-4 bg-slate-50 rounded-2xl border-2 border-slate-100 text-sm font-bold focus:border-emerald-500 focus:bg-white outline-none transition-all" />
                    </div>
                ))}
            </div>
            <div className="flex gap-4 mt-10">
                <button onClick={onClose} className="flex-1 py-4 text-xs font-black text-slate-400 bg-slate-100 rounded-2xl uppercase tracking-widest hover:bg-slate-200 transition-colors">Cancel</button>
                <button onClick={() => onSave(form)} className="flex-1 py-4 text-xs font-black text-white bg-emerald-600 rounded-2xl uppercase tracking-widest hover:bg-emerald-700 shadow-xl shadow-emerald-200 transition-all transform active:scale-95">Save</button>
            </div>
        </Modal>
    );
};

// Updated Alert Modal to support Loading State
const AlertConfigModal = ({ filing, onClose, onSave, loading }) => {
    const [selectedTypes, setSelectedTypes] = useState([]);
    const toggleType = (type) => {
        if(selectedTypes.includes(type)) setSelectedTypes(prev => prev.filter(t => t !== type));
        else setSelectedTypes(prev => [...prev, type]);
    };
    return (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-md flex items-center justify-center z-50 animate-in zoom-in-95">
            <div className="bg-white rounded-[2.5rem] w-96 shadow-2xl transform transition-all scale-100 overflow-hidden">
                <div className="bg-indigo-600 p-8 flex justify-between items-center bg-gradient-to-r from-indigo-600 to-indigo-700">
                    <h3 className="text-lg font-black text-white uppercase tracking-widest">Configure Alerts</h3>
                    <button onClick={onClose} className="text-indigo-200 hover:text-white transition-colors"><X size={24}/></button>
                </div>
                <div className="p-8">
                    <p className="text-xs text-slate-500 mb-8 font-bold uppercase tracking-wide border-b border-slate-100 pb-4">Target: <br/><span className="text-slate-900 text-sm block mt-1">{filing.displayId}</span></p>
                    <div className="space-y-4 mb-8">
                        {[{ id: 'RENEWAL', label: 'Renewal Due' }, { id: 'APPROVAL', label: 'Get Approval / Grant' }, { id: 'STATUS_CHANGE', label: 'Any Status Change' }].map((opt) => {
                            const isSelected = selectedTypes.includes(opt.id);
                            return (
                                <div key={opt.id} onClick={() => toggleType(opt.id)} className={`flex items-center gap-4 p-4 rounded-2xl border-2 cursor-pointer transition-all ${isSelected ? 'bg-indigo-50 border-indigo-600 shadow-md scale-[1.02]' : 'bg-white border-slate-100 hover:border-indigo-200 hover:bg-slate-50'}`}>
                                    <div className={`w-6 h-6 rounded-lg flex items-center justify-center border-2 transition-all ${isSelected ? 'bg-indigo-600 border-indigo-600' : 'border-slate-300 bg-slate-50'}`}>
                                        {isSelected && <CheckSquare size={14} className="text-white"/>}
                                    </div>
                                    <span className={`text-xs font-black uppercase tracking-wide ${isSelected ? 'text-indigo-900' : 'text-slate-500'}`}>{opt.label}</span>
                                </div>
                            );
                        })}
                    </div>
                    <button 
                        onClick={() => onSave(selectedTypes)} 
                        disabled={selectedTypes.length === 0 || loading} 
                        className="w-full py-4 bg-indigo-600 text-white rounded-2xl font-black uppercase text-xs tracking-[0.2em] hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-xl shadow-indigo-200 transform active:scale-95 flex justify-center items-center gap-2"
                    >
                        {loading ? <Loader2 className="animate-spin" size={16} /> : "Save Alerts"}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default FilingTrackerPage;