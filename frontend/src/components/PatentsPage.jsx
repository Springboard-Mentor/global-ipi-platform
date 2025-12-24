import React, { useState, useEffect, useMemo } from 'react';
import { Search, Filter, Download, Plus, FileText, Calendar, MapPin, Tag, Eye, User, Building } from 'lucide-react';

// --- 1. RICH MANUAL DATA (Mock Database) ---
const MOCK_PATENTS = [
    {
        id: 1,
        patentNumber: "US-11234567-B2",
        title: "Autonomous Vehicle Navigation System using Lidar and AI",
        status: "Granted",
        filingDate: "2023-01-15",
        jurisdiction: "US", // Mapped to 'region'
        region: "United States",
        category: "Automotive / AI",
        type: "Patent",
        assignee: "Tesla, Inc.",
        inventors: "Elon Musk, Andrej Karpathy",
        ipcCode: "G05D 1/02",
        abstractText: "A system for autonomous vehicle navigation comprising a plurality of sensors including Lidar, Radar, and Cameras, fused via a deep neural network to predict path planning in real-time complex urban environments. The system further includes redundancy protocols for sensor failure."
    },
    {
        id: 2,
        patentNumber: "EP-99887766-A1",
        title: "mRNA Lipid Nanoparticle Delivery System",
        status: "Pending",
        filingDate: "2023-03-22",
        jurisdiction: "EP",
        region: "Europe",
        category: "Biotech / Pharma",
        type: "Patent",
        assignee: "BioNTech SE",
        inventors: "Ugur Sahin, Ozlem Tureci",
        ipcCode: "A61K 9/127",
        abstractText: "A novel lipid nanoparticle composition for the stable encapsulation and intracellular delivery of messenger RNA (mRNA) encoding therapeutic proteins. The formulation improves endosomal escape and translation efficiency in human T-cells."
    },
    {
        id: 3,
        patentNumber: "CN-20245511-U",
        title: "Foldable OLED Display Mechanism with Zero-Gap Hinge",
        status: "Under Review",
        filingDate: "2024-02-10",
        jurisdiction: "CN",
        region: "China",
        category: "Consumer Electronics",
        type: "Utility Model",
        assignee: "Huawei Technologies Co., Ltd.",
        inventors: "Richard Yu, Zhang Wei",
        ipcCode: "G09F 9/30",
        abstractText: "A foldable display device comprising a flexible OLED panel and a multi-linkage hinge mechanism that allows the device to fold completely flat with zero gap, reducing screen creasing and ingress of dust particles."
    },
    {
        id: 4,
        patentNumber: "US-D998811-S",
        title: "Wearable Augmented Reality Headset Design",
        status: "Granted",
        filingDate: "2022-11-05",
        jurisdiction: "US",
        region: "United States",
        category: "Design",
        type: "Design Patent",
        assignee: "Apple Inc.",
        inventors: "Jony Ive, Evans Hankey",
        ipcCode: "D14/372",
        abstractText: "The ornamental design for a wearable electronic device, specifically an augmented reality headset, featuring a curved glass front and aluminum alloy frame as shown and described."
    },
    {
        id: 5,
        patentNumber: "JP-2023-112233",
        title: "Solid-State Battery Electrolyte Composition",
        status: "Pending",
        filingDate: "2023-06-18",
        jurisdiction: "JP",
        region: "Japan",
        category: "Energy / Materials",
        type: "Patent",
        assignee: "Toyota Motor Corp.",
        inventors: "Akio Toyoda, Koji Sato",
        ipcCode: "H01M 10/0562",
        abstractText: "A sulfide-based solid electrolyte material having high lithium-ion conductivity and excellent stability against lithium metal anodes, enabling higher energy density and safety in rechargeable batteries."
    },
    {
        id: 6,
        patentNumber: "WO-2024-000123",
        title: "Quantum Error Correction via Surface Codes",
        status: "Rejected",
        filingDate: "2022-08-30",
        jurisdiction: "WO",
        region: "WIPO (Global)",
        category: "Quantum Computing",
        type: "Patent",
        assignee: "IBM",
        inventors: "Jay Gambetta, Arvind Krishna",
        ipcCode: "G06N 10/00",
        abstractText: "A method for correcting bit-flip and phase-flip errors in superconducting qubits using a scalable surface code lattice architecture, reducing the physical qubit overhead required for logical qubits."
    },
    {
        id: 7,
        patentNumber: "IN-20234100-A",
        title: "Drought-Resistant Genetically Modified Wheat",
        status: "Granted",
        filingDate: "2023-04-12",
        jurisdiction: "IN",
        region: "India",
        category: "Agriculture / Biotech",
        type: "Patent",
        assignee: "ICAR (Indian Council of Agricultural Research)",
        inventors: "Dr. Swaminathan, Dr. R. Gupta",
        ipcCode: "C12N 15/82",
        abstractText: "A genetically modified wheat variety expressing a specific transcription factor that enhances water retention and photosynthetic efficiency under severe drought conditions."
    }
];

const PatentsPage = ({ onViewPatent }) => {
    // ✅ Initialize with Manual Mock Data
    const [patents, setPatents] = useState(MOCK_PATENTS);
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('All');

    // --- Filtering Logic ---
    const filteredPatents = useMemo(() => {
        let filtered = patents;


        // 1. Filter by search term
        if (searchTerm) {
            const lowerCaseSearch = searchTerm.toLowerCase();
            filtered = filtered.filter(patent =>
                patent.title?.toLowerCase().includes(lowerCaseSearch) ||
                patent.patentNumber?.toLowerCase().includes(lowerCaseSearch) ||
                patent.category?.toLowerCase().includes(lowerCaseSearch) ||
                patent.assignee?.toLowerCase().includes(lowerCaseSearch)
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
            'Granted': 'bg-green-100 text-green-800 border-green-200',
            'Pending': 'bg-yellow-100 text-yellow-800 border-yellow-200',
            'Under Review': 'bg-blue-100 text-blue-800 border-blue-200',
            'Rejected': 'bg-red-100 text-red-800 border-red-200'
        };
        return colors[status] || 'bg-gray-100 text-gray-800 border-gray-200';
    };


    const uniqueStatuses = useMemo(() => {
        return ['All', ...new Set(patents.map(p => p.status).filter(Boolean))];
    }, [patents]);

    // ✅ Handle View Click
    const handleViewClick = (patent) => {
        if (onViewPatent) {
            onViewPatent(patent);
        } else {
            console.error("onViewPatent prop is missing in PatentsPage!");
        }
    };


    return (
        <div className="space-y-6">
           
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-2xl font-bold text-slate-900">Patent Portfolio</h2>
                    <p className="text-slate-600 mt-1">Manage, track, and analyze your intellectual property assets.</p>
                </div>
                <button className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-500 transition text-sm font-medium flex items-center gap-2 shadow-sm">
                    <Plus className="h-4 w-4" />
                    New Filing
                </button>
            </div>

            {/* Filters and Search */}
            <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-5">
                <div className="flex flex-col sm:flex-row gap-4">
                    {/* Search Input */}
                    <div className="flex-1 relative">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-slate-400" />
                        <input
                            type="text"
                            placeholder="Search by title, ID, assignee, or category..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-slate-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500 transition outline-none"
                        />
                    </div>


                    {/* Status Filter */}
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


                    {/* Export Button */}
                    <button className="px-4 py-2.5 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 transition text-sm font-medium flex items-center gap-2 text-slate-700">
                        <Download className="h-4 w-4" />
                        Export
                    </button>
                </div>
            </div>


            {/* Patents List */}
            <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
                {filteredPatents.length === 0 ? (
                    <div className="p-12 text-center">
                        <FileText className="h-12 w-12 text-slate-300 mx-auto mb-4" />
                        <p className="text-slate-600 font-medium">No results found.</p>
                        <p className="text-slate-400 text-sm mt-1">Try adjusting your search criteria.</p>
                    </div>
                ) : (
                    <div className="divide-y divide-slate-100">
                        {filteredPatents.map((patent) => (
                            <div
                                key={patent.id}
                                className="p-6 hover:bg-slate-50 transition cursor-pointer group"
                                onClick={() => handleViewClick(patent)}
                            >
                                <div className="flex items-start justify-between gap-4">
                                    <div className="flex-1 min-w-0">
                                        
                                        {/* Top Row: ID & Status */}
                                        <div className="flex items-center gap-3 mb-2">
                                            <span className="text-xs font-mono font-bold text-indigo-600 bg-indigo-50 px-2 py-1 rounded">
                                                {patent.patentNumber || 'DRAFT'}
                                            </span>
                                            <span className={`px-2.5 py-0.5 rounded-full text-[10px] uppercase font-bold border ${getStatusColor(patent.status)}`}>
                                                {patent.status}
                                            </span>
                                        </div>


                                        {/* Title */}
                                        <h3 className="text-lg font-bold text-slate-900 mb-2 group-hover:text-indigo-600 transition-colors">
                                            {patent.title}
                                        </h3>

                                        {/* Details Grid */}
                                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-y-2 gap-x-6 text-sm text-slate-500 mt-3">
                                            <div className="flex items-center gap-2">
                                                <Building className="h-4 w-4 text-slate-400" />
                                                <span className="truncate" title={patent.assignee}>{patent.assignee}</span>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <User className="h-4 w-4 text-slate-400" />
                                                <span className="truncate" title={patent.inventors}>{patent.inventors?.split(',')[0]}...</span>
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

                                    {/* Action Button */}
                                    <div className="flex items-center self-center pl-4">
                                        <button 
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                handleViewClick(patent);
                                            }}
                                            className="p-2 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-full transition-all" 
                                            title="View Full Details"
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

            {/* Footer Summary */}
            <div className="flex justify-between items-center text-sm text-slate-500 px-2">
                <span>Showing {filteredPatents.length} records</span>
                <span>
                    {patents.filter(p => p.status === 'Granted').length} Granted • {patents.filter(p => p.status === 'Pending').length} Pending
                </span>
            </div>
        </div>
    );
};


export default PatentsPage; 