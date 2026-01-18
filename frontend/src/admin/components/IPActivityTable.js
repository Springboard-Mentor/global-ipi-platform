import React from 'react';
import { useNavigate } from 'react-router-dom';

const IPActivityTable = ({ data }) => {
    const navigate = useNavigate();

    const getStatusColor = (status) => {
        switch (status?.toUpperCase()) {
            case 'GRANTED': return 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30';
            case 'FILED': return 'bg-blue-500/20 text-blue-400 border-blue-500/30';
            case 'PENDING': return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30';
            default: return 'bg-gray-500/20 text-gray-400 border-gray-500/30';
        }
    };

    return (
        <div className="w-full">
            <div className="flex items-center gap-2 mb-6">
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#a78bfa" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path></svg>
                <h3 className="text-lg font-semibold text-white">Recent IP Activity</h3>
            </div>

            <div className="overflow-x-auto">
                <table className="w-full text-sm text-left">
                    <thead className="text-gray-400 border-b border-[#30363d]">
                        <tr>
                            <th className="pb-3 pl-2">Title</th>
                            <th className="pb-3">Track ID</th>
                            <th className="pb-3">Status</th>
                            <th className="pb-3">Filed On</th>
                            <th className="pb-3 text-right pr-2">Last Updated</th>
                        </tr>
                    </thead>
                    <tbody className="text-gray-300">
                        {data && data.length > 0 ? (
                            data.map((item, index) => (
                                <tr
                                    key={index}
                                    onClick={() => navigate(`/admin/filings/${item.id}`)}
                                    className="border-b border-[#30363d] last:border-0 hover:bg-[#1f2937] transition-colors cursor-pointer group"
                                >
                                    <td className="py-3 pl-2 font-medium group-hover:text-blue-400 transition-colors">{item.title}</td>
                                    <td className="py-3 font-mono text-xs text-gray-500">{item.trackId}</td>
                                    <td className="py-3">
                                        <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium border ${getStatusColor(item.status)}`}>
                                            {item.status}
                                        </span>
                                    </td>
                                    <td className="py-3 text-gray-400">{item.filedOn}</td>
                                    <td className="py-3 text-right pr-2 text-gray-500 text-xs">
                                        {new Date(item.updatedOn).toLocaleDateString()}
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="5" className="py-4 text-center text-gray-500">No recent IP activity found</td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default IPActivityTable;
