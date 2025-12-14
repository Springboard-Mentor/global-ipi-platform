import React from 'react';
import { BarChart, PieChart, TrendingUp, DollarSign, Globe, Layers, AlertTriangle, Users } from 'lucide-react';

const AnalysisPage = () => {
    // Dummy Data to drive the components
    const analysisStats = {
        totalValue: '$2.4M',
        annualGrowth: '15.3%',
        criticalAlerts: 3,
        budgetVsSpend: 85 // 85% of budget used
    };

    const competitorActivity = [
        { name: "TechCorp Inc.", filingsLastMonth: 5, status: 'High', color: 'text-red-500' },
        { name: "InnoSol Labs", filingsLastMonth: 2, status: 'Medium', color: 'text-yellow-500' },
        { name: "Global Innovations", filingsLastMonth: 1, status: 'Low', color: 'text-green-500' },
    ];
    
    const riskAreas = [
        { area: "Expired Deadlines", count: 1, severity: 'Critical' },
        { area: "Unmet Office Actions", count: 4, severity: 'High' },
        { area: "Geographic Gaps", count: 7, severity: 'Medium' },
    ];

    return (
        <div className="space-y-8">
            <h2 className="text-3xl font-bold text-slate-900">IP Portfolio Analysis</h2>
            <p className="text-slate-600">Visual breakdown of your assets' performance, risk, and coverage.</p>

            {/* 1. Quick Analytical Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm flex items-center justify-between">
                    <div>
                        <p className="text-sm font-medium text-slate-600">Total Estimated Value</p>
                        <p className="text-2xl font-bold text-slate-900 mt-1">{analysisStats.totalValue}</p>
                    </div>
                    <DollarSign className="w-8 h-8 text-green-500 bg-green-50 p-1.5 rounded-full" />
                </div>
                
                <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm flex items-center justify-between">
                    <div>
                        <p className="text-sm font-medium text-slate-600">Annual Growth Rate</p>
                        <p className="text-2xl font-bold text-slate-900 mt-1">{analysisStats.annualGrowth}</p>
                    </div>
                    <TrendingUp className="w-8 h-8 text-indigo-500 bg-indigo-50 p-1.5 rounded-full" />
                </div>
                
                <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm flex items-center justify-between">
                    <div>
                        <p className="text-sm font-medium text-slate-600">Budget Spent</p>
                        <p className="text-2xl font-bold text-slate-900 mt-1">{analysisStats.budgetVsSpend}%</p>
                    </div>
                    <Layers className="w-8 h-8 text-purple-500 bg-purple-50 p-1.5 rounded-full" />
                </div>

                <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm flex items-center justify-between">
                    <div>
                        <p className="text-sm font-medium text-slate-600">Critical Alerts</p>
                        <p className="text-2xl font-bold text-slate-900 mt-1">{analysisStats.criticalAlerts}</p>
                    </div>
                    <AlertTriangle className="w-8 h-8 text-red-500 bg-red-50 p-1.5 rounded-full" />
                </div>
            </div>

            {/* 2. Main Content Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                
                {/* Status Distribution Chart */}
                <div className="lg:col-span-2 bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
                    <div className="flex items-center gap-3 mb-4">
                        <BarChart className="w-5 h-5 text-indigo-600" />
                        <h3 className="text-lg font-semibold">Filing Status Over Time</h3>
                    </div>
                    <div className="min-h-96 flex items-center justify-center bg-slate-50 border border-dashed border-slate-300 rounded-lg text-slate-500">
                        Placeholder for Bar Chart Library (Time Series Data)
                    </div>
                </div>

                {/* Right Column (Risk & Competitors) */}
                <div className="space-y-6">
                    
                    {/* Patent Risk Breakdown */}
                    <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
                        <div className="flex items-center gap-3 mb-4">
                            <AlertTriangle className="w-5 h-5 text-red-600" />
                            <h3 className="text-lg font-semibold">Patent Risk Breakdown</h3>
                        </div>
                        <ul className="space-y-2">
                            {riskAreas.map((item, index) => (
                                <li key={index} className="flex justify-between items-center text-sm">
                                    <span className="text-slate-600">{item.area}</span>
                                    <span className={`font-medium ${item.severity === 'Critical' ? 'text-red-600' : 'text-yellow-600'}`}>
                                        {item.count} Issues
                                    </span>
                                </li>
                            ))}
                        </ul>
                        <button className="w-full mt-4 text-center text-indigo-600 text-sm font-medium hover:text-indigo-700">
                            Review All Alerts
                        </button>
                    </div>

                    {/* Competitive Filings Table */}
                    <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
                        <div className="flex items-center gap-3 mb-4">
                            <Users className="w-5 h-5 text-indigo-600" />
                            <h3 className="text-lg font-semibold">Competitor Activity</h3>
                        </div>
                        <div className="overflow-x-auto">
                            <table className="min-w-full text-sm text-slate-700">
                                <thead className="text-xs text-slate-500 uppercase">
                                    <tr>
                                        <th className="py-2 text-left">Competitor</th>
                                        <th className="py-2 text-center">Filings (30 days)</th>
                                        <th className="py-2 text-right">Risk</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {competitorActivity.map((comp, index) => (
                                        <tr key={index} className="border-b last:border-b-0">
                                            <td className="py-2 font-medium">{comp.name}</td>
                                            <td className="py-2 text-center">{comp.filingsLastMonth}</td>
                                            <td className={`py-2 text-right font-semibold ${comp.color}`}>{comp.status}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                        <button className="w-full mt-4 text-center text-indigo-600 text-sm font-medium hover:text-indigo-700">
                            Deep Dive Analysis
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AnalysisPage;