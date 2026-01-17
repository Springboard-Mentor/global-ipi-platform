import React, { useState, useEffect, useMemo } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap, ZoomControl } from 'react-leaflet';
import { 
  Globe, ArrowLeft, Loader2, TrendingUp, ShieldCheck, 
  Clock, Database, ChevronRight, MapPin, Layout, Layers, Maximize, 
  Moon, Sun, Map as MapIcon
} from 'lucide-react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

/**
 * 1. HIGH-PRECISION GEOGRAPHIC ENGINE
 * Corrected centroids with Northern-shift offsets for RU, CA, and SE.
 * Includes 10+ additional countries for full global coverage.
 */
const jurisdictionCoords = {
  US: { lat: 39.8283, lng: -98.5795, name: 'United States', flag: '🇺🇸' },
  TW: { lat: 23.6978, lng: 120.9605, name: 'Taiwan', flag: '🇹🇼' }, // ✅ Separated from US
  CA: { lat: 62.0000, lng: -110.3468, name: 'Canada', flag: '🇨🇦' }, // ✅ Shifted North
  RU: { lat: 64.0000, lng: 100.0000, name: 'Russia', flag: '🇷🇺' }, // ✅ Shifted North
  SE: { lat: 62.1282, lng: 18.6435, name: 'Sweden', flag: '🇸🇪' },  // ✅ Shifted North
  GB: { lat: 55.3781, lng: -3.4360, name: 'United Kingdom', flag: '🇬🇧' },
  JP: { lat: 36.2048, lng: 138.2529, name: 'Japan', flag: '🇯🇵' },
  CN: { lat: 35.8617, lng: 104.1954, name: 'China', flag: '🇨🇳' },
  IN: { lat: 20.5937, lng: 78.9629, name: 'India', flag: '🇮🇳' },
  EP: { lat: 50.8503, lng: 4.3517, name: 'European Union', flag: '🇪🇺' },
  KR: { lat: 35.9078, lng: 127.7669, name: 'South Korea', flag: '🇰🇷' },
  DE: { lat: 51.1657, lng: 10.4515, name: 'Germany', flag: '🇩🇪' },
  FR: { lat: 46.2276, lng: 2.2137, name: 'France', flag: '🇫🇷' },
  AU: { lat: -25.2744, lng: 133.7751, name: 'Australia', flag: '🇦🇺' },
  BR: { lat: -14.2350, lng: -51.9253, name: 'Brazil', flag: '🇧🇷' },
  IT: { lat: 41.8719, lng: 12.5674, name: 'Italy', flag: '🇮🇹' },
  ES: { lat: 40.4637, lng: -3.7492, name: 'Spain', flag: '🇪🇸' },
  SG: { lat: 1.3521, lng: 103.8198, name: 'Singapore', flag: '🇸🇬' },
  WO: { lat: 46.2044, lng: 6.1432, name: 'WIPO', flag: '🌐' }
};

// Fix Leaflet marker icons
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

/**
 * 2. PREMIUM DYNAMIC MARKER
 * Attractive blue circular marker with 3D gradient and scaling on hover.
 */
const createCustomIcon = (count) => {
  return L.divIcon({
    className: 'custom-marker-node',
    html: `
      <div style="
        background: linear-gradient(135deg, #4f46e5 0%, #312e81 100%);
        width: 54px; height: 54px; border-radius: 50%; border: 3px solid #ffffff;
        display: flex; align-items: center; justify-content: center;
        font-weight: 900; color: #ffffff; 
        box-shadow: 0 12px 24px rgba(79, 70, 229, 0.6);
        font-size: 16px; transition: transform 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275);
      ">
        ${count}
      </div>`,
    iconSize: [54, 54],
    iconAnchor: [27, 27],
  });
};

/**
 * 3. MAP AUTO-PAN CONTROLLER
 */
const MapController = ({ selectedPos, allPoints }) => {
  const map = useMap();
  useEffect(() => {
    if (selectedPos) {
      map.flyTo([selectedPos.lat, selectedPos.lng], 5, { duration: 1.5 });
    } else if (allPoints.length > 0) {
      const bounds = L.latLngBounds(allPoints.map(p => [p.lat, p.lng]));
      map.fitBounds(bounds, { padding: [100, 100], maxZoom: 3 });
    }
  }, [selectedPos, allPoints, map]);
  return null;
};

const MapViewPage = ({ results = [], onBack }) => {
  const [loading, setLoading] = useState(true);
  const [selectedRegion, setSelectedRegion] = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [mapStyle, setMapStyle] = useState('light');

  // 4. MAP STYLE DIRECTORY 
  const tileLayers = {
    light: "https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png",
    dark: "https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png",
    satellite: "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}",
    standard: "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
  };

  // ✅ 5. CORE NORMALIZATION ENGINE
  // Ensures data accuracy: RU/SE mis-tags for US items are merged into US.
  // TW is separated from US.
  const displayData = useMemo(() => {
    const aggregation = results.reduce((acc, item) => {
      let rawJur = (item.jurisdiction || '').toUpperCase();
      let title = (item.title || '').toUpperCase();
      let code = 'US';

      if (title.includes('UNITED STATES')) code = 'US';
      else if (rawJur === 'TW' || title.includes('TAIWAN')) code = 'TW';
      else if (rawJur.includes('US')) code = 'US';
      else if (rawJur.includes('CA') || title.includes('CANADA')) code = 'CA';
      else if (rawJur.includes('CN') || title.includes('CHINA')) code = 'CN';
      else if (rawJur.includes('RU') || title.includes('RUSSIA')) code = 'RU';
      else if (rawJur.includes('SE') || title.includes('SWEDEN')) code = 'SE';
      else if (rawJur.includes('GB') || title.includes('KINGDOM')) code = 'GB';
      else if (rawJur.includes('JP') || title.includes('JAPAN')) code = 'JP';
      else if (rawJur.includes('IN') || title.includes('INDIA')) code = 'IN';
      else code = rawJur.split(' ')[0].substring(0, 2) || 'US';

      if (!acc[code]) {
        const coords = jurisdictionCoords[code] || jurisdictionCoords['US'];
        acc[code] = { ...coords, code, total: 0, patents: 0, trademarks: 0, active: 0 };
      }

      acc[code].total++;
      const type = (item.type || '').toUpperCase();
      const status = (item.status || '').toUpperCase();
      if (type.includes('PATENT')) acc[code].patents++;
      if (type.includes('TRADEMARK')) acc[code].trademarks++;
      if (['ACTIVE', 'GRANTED', 'REGISTERED'].includes(status)) acc[code].active++;
      
      return acc;
    }, {});
    
    return Object.values(aggregation).sort((a, b) => b.total - a.total);
  }, [results]);

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 800);
    return () => clearTimeout(timer);
  }, [results]);

  return (
    <div className="h-screen flex flex-col bg-[#f8fafc] text-left font-sans overflow-hidden animate-in fade-in duration-700">
      
      {/* 6. GLASSMORPHISM HEADER */}
      <div className="bg-white/80 backdrop-blur-xl border-b border-slate-200 px-6 md:px-10 py-5 flex justify-between items-center z-[1000] shadow-sm">
        <div className="flex items-center gap-4 md:gap-8">
          <button onClick={onBack} className="flex items-center gap-2 text-slate-500 font-bold hover:text-indigo-600 transition-all p-2 rounded-xl hover:bg-indigo-50 group">
            <ArrowLeft size={22} className="group-hover:-translate-x-1 transition-transform" />
            <span className="hidden sm:inline text-sm uppercase tracking-widest">Exit Map</span>
          </button>
          <div className="hidden sm:block h-10 w-px bg-slate-200" />
          <div className="flex flex-col">
            <h1 className="text-lg md:text-2xl font-black text-slate-900 tracking-tighter flex items-center gap-2 uppercase">
              <Globe className="text-indigo-600 animate-spin-slow" size={26} /> 
              IP INTELLIGENCE
            </h1>
            <p className="hidden md:block text-[10px] font-black text-slate-400 uppercase tracking-[0.3em]">Consolidated Spatial Mapping</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="bg-indigo-600 text-white px-4 md:px-6 py-2 md:py-3 rounded-2xl flex items-center gap-3 shadow-xl shadow-indigo-100 transition-transform hover:scale-105">
            <Database size={18} className="text-indigo-200" />
            <span className="font-black text-xs md:text-sm uppercase tracking-widest leading-none">{results.length} Synced Results</span>
          </div>
          <button onClick={() => setSidebarOpen(!sidebarOpen)} className="p-3 bg-white border border-slate-200 rounded-2xl hover:shadow-md hidden lg:block transition-colors">
            <Layout size={20} className={sidebarOpen ? "text-indigo-600" : "text-slate-600"} />
          </button>
        </div>
      </div>

      <div className="flex-1 flex overflow-hidden relative">
        
        {/* 7. DYNAMIC SIDEBAR */}
        {sidebarOpen && (
          <div className="w-full lg:w-[480px] bg-white border-r border-slate-200 overflow-y-auto p-6 md:p-8 z-[999] shadow-2xl animate-in slide-in-from-left duration-500">
            <h2 className="text-[12px] font-black text-slate-400 uppercase tracking-[0.35em] mb-10 flex items-center gap-3">
              <TrendingUp size={20} className="text-indigo-500" /> Regional Breakdown
            </h2>
            
            <div className="space-y-6">
              {displayData.map((data) => (
                <div 
                  key={data.code} 
                  onClick={() => setSelectedRegion(data)}
                  className={`p-7 rounded-[3rem] border-2 transition-all cursor-pointer group relative overflow-hidden ${
                    selectedRegion?.code === data.code 
                    ? 'border-indigo-600 bg-indigo-50/50 shadow-inner' 
                    : 'border-slate-50 bg-slate-50/50 hover:border-indigo-300 hover:bg-white hover:shadow-2xl'
                  }`}
                >
                  <div className="flex justify-between items-start relative z-10">
                    <div className="flex items-center gap-6">
                      <span className="text-6xl drop-shadow-xl group-hover:rotate-12 transition-transform duration-500">{data.flag}</span>
                      <div>
                        <h3 className="font-black text-slate-800 text-xl tracking-tighter leading-none mb-2 uppercase">{data.name}</h3>
                        <p className="text-[11px] font-bold text-slate-400 tracking-[0.1em]">TAG: {data.code}</p>
                      </div>
                    </div>
                    <div className="bg-indigo-600 text-white w-14 h-14 rounded-3xl flex items-center justify-center text-2xl font-black shadow-lg">
                      {data.total}
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4 mt-6 relative z-10">
                    <div className="bg-white/90 p-4 rounded-3xl border border-slate-100 text-center shadow-sm">
                      <p className="text-[10px] font-black text-blue-500 uppercase mb-1">Patents</p>
                      <p className="text-2xl font-black text-slate-800">{data.patents}</p>
                    </div>
                    <div className="bg-white/90 p-4 rounded-3xl border border-slate-100 text-center shadow-sm">
                      <p className="text-[10px] font-black text-purple-500 uppercase mb-1">Trademarks</p>
                      <p className="text-2xl font-black text-slate-800">{data.trademarks}</p>
                    </div>
                  </div>
                  <Globe className="absolute -right-8 -bottom-8 text-slate-100 opacity-20 group-hover:text-indigo-100 group-hover:scale-150 transition-all duration-1000" size={180} />
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 8. MAP CANVAS ENGINE */}
        <div className="flex-1 relative h-full bg-[#cbd5e1]">
          {loading ? (
            <div className="absolute inset-0 bg-white/95 z-[1001] flex flex-col items-center justify-center backdrop-blur-2xl">
              <Loader2 className="animate-spin text-indigo-600 mb-8" size={64} />
              <p className="text-xl font-black text-slate-900 uppercase tracking-[0.5em] animate-pulse">Rendering Data Layers</p>
            </div>
          ) : (
            <>
              {/* Floating Layer Controls */}
              <div className="absolute top-8 right-8 z-[1000] flex flex-col gap-4">
                <div className="bg-white/90 backdrop-blur-md p-2 rounded-3xl shadow-2xl border border-slate-200 flex flex-col gap-2">
                  <button onClick={() => setMapStyle('light')} className={`p-4 rounded-2xl transition-all ${mapStyle === 'light' ? 'bg-indigo-600 text-white shadow-xl' : 'text-slate-400 hover:bg-slate-100'}`} title="Light Canvas"><Sun size={24}/></button>
                  <button onClick={() => setMapStyle('dark')} className={`p-4 rounded-2xl transition-all ${mapStyle === 'dark' ? 'bg-indigo-600 text-white shadow-xl' : 'text-slate-400 hover:bg-slate-100'}`} title="Dark Canvas"><Moon size={24}/></button>
                  <button onClick={() => setMapStyle('satellite')} className={`p-4 rounded-2xl transition-all ${mapStyle === 'satellite' ? 'bg-indigo-600 text-white shadow-xl' : 'text-slate-400 hover:bg-slate-100'}`} title="Satellite View"><MapIcon size={24}/></button>
                </div>
                <button onClick={() => setSelectedRegion(null)} className="p-5 bg-white/90 backdrop-blur-md rounded-[1.5rem] shadow-2xl border border-slate-200 text-indigo-600 hover:bg-indigo-600 hover:text-white transition-all font-black uppercase tracking-widest"><Maximize size={24}/></button>
              </div>

              <MapContainer center={[20, 10]} zoom={3} className="h-full w-full" zoomControl={false} scrollWheelZoom={true} attributionControl={false}>
                <TileLayer url={tileLayers[mapStyle]} />
                
                <MapController selectedPos={selectedRegion} allPoints={displayData} />

                {displayData.map((data) => (
                  <Marker 
                    key={data.code} 
                    position={[data.lat, data.lng]} 
                    icon={createCustomIcon(data.total)}
                    eventHandlers={{ click: () => setSelectedRegion(data) }}
                  >
                    <Popup className="premium-map-popup">
                      <div className="p-6 min-w-[320px] text-left font-sans bg-white rounded-3xl">
                        <div className="flex items-center gap-5 border-b border-slate-100 pb-6 mb-6">
                          <span className="text-6xl drop-shadow-lg">{data.flag}</span>
                          <div>
                            <h4 className="font-black text-slate-900 text-2xl tracking-tight leading-none mb-2">{data.name}</h4>
                            <p className="text-[11px] font-black text-indigo-500 uppercase tracking-widest">Active Jurisdiction</p>
                          </div>
                        </div>
                        
                        <div className="space-y-4">
                          <div className="flex justify-between items-center p-4 bg-emerald-50 rounded-[1.5rem] border border-emerald-100">
                            <span className="text-xs font-black text-emerald-800 uppercase flex items-center gap-2"><ShieldCheck size={16}/> Active Assets</span>
                            <span className="font-black text-xl text-emerald-700">{data.active}</span>
                          </div>
                          <div className="flex justify-between items-center p-4 bg-amber-50 rounded-[1.5rem] border border-amber-100">
                            <span className="text-xs font-black text-amber-800 uppercase flex items-center gap-2"><Clock size={16}/> In Pipeline</span>
                            <span className="font-black text-xl text-amber-700">{data.total - data.active}</span>
                          </div>
                        </div>
                        <button className="w-full mt-6 bg-slate-900 text-white py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-indigo-600 transition-all flex items-center justify-center gap-2">
                          Analyze Region <ChevronRight size={14}/>
                        </button>
                      </div>
                    </Popup>
                  </Marker>
                ))}
                <ZoomControl position="bottomright" />
              </MapContainer>
            </>
          )}
        </div>
      </div>

      <style>{`
        .leaflet-container { background: #cbd5e1 !important; }
        .premium-map-popup .leaflet-popup-content-wrapper { border-radius: 2.5rem; padding: 0; overflow: hidden; box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25); }
        .premium-map-popup .leaflet-popup-content { margin: 0; width: auto !important; }
        .custom-marker-node:hover { filter: brightness(1.15); transform: scale(1.15) !important; z-index: 1000 !important; }
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        .animate-spin-slow { animation: spin 20s linear infinite; }
        .custom-marker-node { cursor: pointer !important; }
      `}</style>
    </div>
  );
};

export default MapViewPage;