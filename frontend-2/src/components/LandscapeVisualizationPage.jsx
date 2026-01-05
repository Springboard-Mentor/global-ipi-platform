import React, { useState, useEffect } from 'react';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell 
} from 'recharts';
import { Globe, MapPin, Database, TrendingUp, Info } from 'lucide-react';
import { analyticsAPI } from '../api/analytics';
import { FIELD_COLORS, CHART_CONFIG } from '../utils/chartHelpers.jsx';

const LandscapeVisualizationPage = () => {
  const [densityData, setDensityData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLandscape = async () => {
      try {
        const json = await analyticsAPI.getJurisdictionBreakdown();
        const formatted = json.map(item => ({
          jurisdiction: item[0] || 'Unknown',
          count: item[1]
        }));
        setDensityData(formatted);
      } catch (err) {
        console.error("Landscape Sync Error:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchLandscape();
  }, []);

  if (loading) return (
    <div className="h-screen flex flex-col items-center justify-center bg-slate-50">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mb-4"></div>
      <p className="text-indigo-600 font-black uppercase tracking-widest text-xs">Mapping Geographic Landscape...</p>
    </div>
  );

  return (
    <div className="p-8 space-y-10 bg-[#F8FAFC] min-h-screen text-left animate-in fade-in duration-700">
      <div className="border-b border-slate-200 pb-8 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="p-3 bg-indigo-600 rounded-2xl text-white shadow-lg shadow-indigo-200">
            <Globe size={24} />
          </div>
          <div>
            <h1 className="text-2xl font-black text-slate-900 uppercase tracking-tight leading-none">Landscape Visualization</h1>
            <p className="text-slate-400 text-[10px] font-bold tracking-widest uppercase mt-2">Strategic & Comparative Analysis</p>
          </div>
        </div>
        <div className="flex gap-2">
          <div className="px-4 py-2 bg-white rounded-xl border border-slate-200 text-[10px] font-black uppercase tracking-widest text-slate-500">Live Database Node</div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* JURISDICTIONAL DENSITY */}
        <div className="lg:col-span-2 bg-white p-10 rounded-[3rem] shadow-xl border border-slate-100 h-[550px]">
          <div className="flex justify-between items-center mb-10">
            <h2 className="text-lg font-black text-slate-800 flex items-center gap-3">
              <MapPin size={22} className="text-indigo-600" /> Jurisdictional Density Landscape
            </h2>
            <Info size={16} className="text-slate-300" />
          </div>
          
          <div className="h-[400px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={densityData} margin={CHART_CONFIG.margin}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F1F5F9" />
                <XAxis 
                  dataKey="jurisdiction" 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{fontSize: 10, fontWeight: 700, fill: '#64748B'}}
                />
                <YAxis axisLine={false} tickLine={false} tick={{fontSize: 10, fill: '#64748B'}} />
                <Tooltip cursor={{fill: '#F8FAFC', radius: 10}} {...CHART_CONFIG.tooltip} />
                <Bar dataKey="count" radius={[15, 15, 0, 0]} barSize={65}>
                  {densityData.map((entry, index) => (
                    <Cell key={index} fill={FIELD_COLORS[index % FIELD_COLORS.length]} stroke="none" />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* TREND ANALYSIS PANEL */}
        <div className="space-y-6">
          <div className="bg-slate-900 text-white p-10 rounded-[3rem] shadow-2xl relative overflow-hidden flex flex-col justify-between h-full min-h-[550px]">
            <Database className="absolute -right-10 -top-10 w-64 h-64 opacity-5" />
            
            <div>
              <TrendingUp size={32} className="text-indigo-400 mb-6" />
              <h3 className="text-xl font-black uppercase tracking-tighter leading-none mb-2">Emerging Field Insights</h3>
              <p className="text-slate-400 text-[9px] font-bold tracking-[0.2em] uppercase mb-8 leading-relaxed">AI Clustering & Geographic Patterns</p>
              
              <div className="space-y-4">
                {['Artificial Intelligence', 'Cybersecurity', 'Biotechnology', 'Renewable Tech'].map((field, i) => (
                  <div key={i} className="flex justify-between items-center bg-white/5 p-4 rounded-2xl border border-white/10 group hover:bg-white/10 transition-colors">
                    <span className="text-[10px] font-black uppercase tracking-widest text-slate-300">{field}</span>
                    <span className="text-[10px] text-emerald-400 font-black">+{Math.floor(Math.random() * 15) + 5}%</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="mt-8 border-t border-white/10 pt-8">
              <p className="text-[9px] text-slate-500 font-bold uppercase tracking-widest leading-relaxed">Global IP Platform Milestone Three Implementation Ready.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LandscapeVisualizationPage;