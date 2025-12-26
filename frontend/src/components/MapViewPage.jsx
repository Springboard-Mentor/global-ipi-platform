import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import MarkerClusterGroup from 'react-leaflet-cluster';
import { MapPin, Filter, TrendingUp, Globe, ArrowLeft } from 'lucide-react';
import L from 'leaflet';
import { geoAPI } from '../api/geoAPI';
import 'leaflet/dist/leaflet.css';

// Jurisdiction coordinates mapping
const jurisdictionCoords = {
  US: { lat: 37.0902, lng: -95.7129, name: 'United States', flag: '🇺🇸', zoom: 4 },
  EP: { lat: 50.8503, lng: 4.3517, name: 'European Union', flag: '🇪🇺', zoom: 4 },
  CN: { lat: 35.8617, lng: 104.1954, name: 'China', flag: '🇨🇳', zoom: 4 },
  IN: { lat: 20.5937, lng: 78.9629, name: 'India', flag: '🇮🇳', zoom: 4 },
  JP: { lat: 36.2048, lng: 138.2529, name: 'Japan', flag: '🇯🇵', zoom: 5 },
  KR: { lat: 35.9078, lng: 127.7669, name: 'South Korea', flag: '🇰🇷', zoom: 6 },
  GB: { lat: 55.3781, lng: -3.4360, name: 'United Kingdom', flag: '🇬🇧', zoom: 5 },
  DE: { lat: 51.1657, lng: 10.4515, name: 'Germany', flag: '🇩🇪', zoom: 6 },
  FR: { lat: 46.2276, lng: 2.2137, name: 'France', flag: '🇫🇷', zoom: 6 }
};

const getCoordinates = (code) => jurisdictionCoords[code] || null;

// Fix Leaflet default icon issue
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

// Custom marker icons with dynamic count
const createCustomIcon = (color, count) => {
  return L.divIcon({
    className: 'custom-marker',
    html: `
      <div style="
        background: ${color};
        width: 40px;
        height: 40px;
        border-radius: 50%;
        border: 3px solid white;
        display: flex;
        align-items: center;
        justify-content: center;
        font-weight: bold;
        color: white;
        box-shadow: 0 2px 8px rgba(0,0,0,0.3);
        font-size: 12px;
      ">
        ${count}
      </div>
    `,
    iconSize: [40, 40],
    iconAnchor: [20, 20],
  });
};

const MapViewPage = ({ results = [], filters = {}, onViewPatent, onBack }) => {
  const [geoData, setGeoData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedJurisdiction, setSelectedJurisdiction] = useState(null);
  const [showSidebar, setShowSidebar] = useState(true);
  const [mapStyle, setMapStyle] = useState('default');

  // --- UPDATED EFFECT WITH POLLING LOGIC ---
  useEffect(() => {
    // 1. Initial Load (Shows Spinner)
    fetchGeoData(false);

    // 2. Set up Interval (Runs every 10 seconds, Hides Spinner)
    const intervalId = setInterval(() => {
      fetchGeoData(true); // Pass true to indicate background update
    }, 10000);

    // 3. Cleanup on unmount or filter change
    return () => clearInterval(intervalId);
  }, [filters, results]);

  // --- UPDATED FETCH FUNCTION ---
  // isBackgroundUpdate = true means don't show the loading spinner
  const fetchGeoData = async (isBackgroundUpdate = false) => {
    if (!isBackgroundUpdate) {
      setLoading(true);
    }
    
    try {
      // Try API first
      let data;
      if (filters.keyword && filters.keyword.trim()) {
        data = await geoAPI.searchGeoDistribution(filters.keyword, filters.ipType || 'both');
      } else {
        data = await geoAPI.getGeoDistribution({
          ipType: filters.ipType || 'both',
          status: filters.statuses?.join(',') || null
        });
      }
      
      if (data && Array.isArray(data) && data.length > 0) {
        setGeoData(data);
      } else {
        // Fallback to local processing
        processLocalResults();
      }
    } catch (error) {
      console.warn('API Error or 404, falling back to local calculation:', error);
      processLocalResults();
    } finally {
      if (!isBackgroundUpdate) {
        setLoading(false);
      }
    }
  };

  const processLocalResults = () => {
    if (!results || results.length === 0) {
      setGeoData([]);
      return;
    }

    // Group patents by jurisdiction
    const patentsByJurisdiction = results.reduce((acc, patent) => {
      const jurisdiction = patent.jurisdiction || 'Unknown';
      if (!acc[jurisdiction]) acc[jurisdiction] = [];
      acc[jurisdiction].push(patent);
      return acc;
    }, {});

    // Process and add coordinates
    const processed = Object.entries(patentsByJurisdiction).map(([jurisdiction, patents]) => {
      const coords = getCoordinates(jurisdiction);
      
      if (!coords) return null; // Skip if no coordinates available
      
      return {
        jurisdiction,
        jurisdictionName: coords.name,
        patentCount: patents.filter(p => (p.type || '').toUpperCase() === 'PATENT').length,
        trademarkCount: patents.filter(p => (p.type || '').toUpperCase() === 'TRADEMARK').length,
        activeCount: patents.filter(p => ['ACTIVE', 'GRANTED', 'REGISTERED'].includes((p.status || '').toUpperCase())).length,
        pendingCount: patents.filter(p => (p.status || '').toUpperCase() === 'PENDING').length,
        expiredCount: patents.filter(p => ['EXPIRED', 'ABANDONED', 'REJECTED'].includes((p.status || '').toUpperCase())).length,
        latitude: coords.lat,
        longitude: coords.lng,
        zoom: coords.zoom,
        flag: coords.flag
      };
    }).filter(item => item !== null); // Remove null entries

    setGeoData(processed);
  };

  const displayData = geoData || [];
  const totalAssets = displayData.reduce((sum, item) => 
    sum + (item.patentCount || 0) + (item.trademarkCount || 0), 0
  );

  const handleJurisdictionClick = (jurisdiction) => {
    setSelectedJurisdiction(jurisdiction === selectedJurisdiction ? null : jurisdiction);
  };

  const getMarkerColor = (data) => {
    const total = (data.patentCount || 0) + (data.trademarkCount || 0);
    if (total > 100) return '#EF4444'; // Red
    if (total > 50) return '#F59E0B';  // Orange
    if (total > 20) return '#10B981';  // Green
    return '#6366F1'; // Indigo
  };

  return (
    <div className="h-screen flex flex-col bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b px-4 py-3 flex justify-between items-center">
        <div className="flex items-center gap-4">
          <button 
            onClick={onBack} 
            className="flex items-center gap-2 text-slate-600 hover:text-slate-900 font-medium transition-colors px-3 py-2 rounded-lg hover:bg-slate-50"
          >
            <ArrowLeft size={18} /> Back to List
          </button>
          <div className="h-6 w-px bg-slate-200"></div>
          <h1 className="text-xl font-bold text-slate-900 flex items-center gap-2">
            <Globe className="text-indigo-600" size={24} /> Geographic Distribution
          </h1>
        </div>
        <div className="flex items-center gap-3">
          <div className="text-sm text-slate-600 bg-slate-50 px-3 py-1.5 rounded-lg border border-slate-200">
            <span className="font-bold text-indigo-600">{totalAssets}</span> Total Assets
          </div>
          <button 
            onClick={() => setShowSidebar(!showSidebar)} 
            className="px-3 py-1.5 border border-slate-200 rounded-lg hover:bg-slate-50 flex items-center gap-2 text-sm font-medium transition-colors"
          >
            <Filter size={16} /> {showSidebar ? 'Hide' : 'Show'} Stats
          </button>
        </div>
      </div>

      <div className="flex-1 flex overflow-hidden">
        {/* Sidebar Stats */}
        {showSidebar && (
          <div className="w-80 bg-white border-r overflow-y-auto">
            <div className="p-4 border-b bg-gradient-to-br from-indigo-50 to-white">
              <h2 className="font-bold text-slate-800 mb-2 flex items-center gap-2">
                <TrendingUp size={18} className="text-indigo-600" /> Jurisdiction Statistics
              </h2>
              <p className="text-xs text-slate-500">{displayData.length} jurisdictions found</p>
            </div>
            
            <div className="p-3 space-y-2">
              {displayData.length === 0 ? (
                <div className="text-center py-8 text-slate-400">
                  <MapPin size={32} className="mx-auto mb-2 opacity-50" />
                  <p className="text-sm">No geographic data available</p>
                </div>
              ) : (
                displayData.map((data) => {
                  const totalCount = (data.patentCount || 0) + (data.trademarkCount || 0);
                  return (
                    <div 
                      key={data.jurisdiction} 
                      onClick={() => handleJurisdictionClick(data.jurisdiction)}
                      className={`p-3 rounded-lg border cursor-pointer transition-all ${
                        selectedJurisdiction === data.jurisdiction 
                          ? 'bg-indigo-50 border-indigo-300 shadow-sm' 
                          : 'bg-white hover:border-indigo-200 hover:shadow-sm'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <span className="text-2xl">{data.flag}</span>
                          <h3 className="font-bold text-sm text-slate-800">{data.jurisdictionName}</h3>
                        </div>
                        <div className="text-xs font-bold bg-slate-100 px-2 py-1 rounded text-slate-700">
                          {totalCount}
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-2 gap-2 text-xs mt-2">
                        <div className="bg-blue-50 p-2 rounded border border-blue-100">
                          <div className="text-blue-600 font-semibold">Patents</div>
                          <div className="text-blue-800 font-bold text-sm">{data.patentCount || 0}</div>
                        </div>
                        <div className="bg-purple-50 p-2 rounded border border-purple-100">
                          <div className="text-purple-600 font-semibold">Trademarks</div>
                          <div className="text-purple-800 font-bold text-sm">{data.trademarkCount || 0}</div>
                        </div>
                      </div>
                      
                      <div className="flex gap-2 mt-2 text-xs">
                        <span className="bg-emerald-50 text-emerald-700 px-2 py-0.5 rounded border border-emerald-200">
                          ✓ {data.activeCount || 0} Active
                        </span>
                        <span className="bg-amber-50 text-amber-700 px-2 py-0.5 rounded border border-amber-200">
                          ⏳ {data.pendingCount || 0} Pending
                        </span>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        )}

        {/* Map Section */}
        <div className="flex-1 relative">
          {loading ? (
            <div className="absolute inset-0 flex flex-col items-center justify-center bg-white z-[1001]">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mb-4"></div>
              <p className="text-slate-600 font-medium">Loading map data...</p>
            </div>
          ) : displayData.length === 0 ? (
            <div className="absolute inset-0 flex flex-col items-center justify-center bg-gray-50">
              <MapPin size={48} className="text-slate-300 mb-4" />
              <h3 className="text-lg font-bold text-slate-700 mb-2">No Geographic Data</h3>
              <p className="text-sm text-slate-500">No results with valid jurisdictions found</p>
            </div>
          ) : (
            <MapContainer 
              center={[20, 0]} 
              zoom={2} 
              className="h-full w-full"
              style={{ background: '#f8fafc' }}
            >
              <TileLayer 
                url={mapStyle === 'default' 
                  ? "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" 
                  : "https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
                } 
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
              />
              
              <MarkerClusterGroup>
                {displayData.map((data) => {
                  const totalCount = (data.patentCount || 0) + (data.trademarkCount || 0);
                  return (
                    <Marker 
                      key={data.jurisdiction} 
                      position={[data.latitude, data.longitude]} 
                      icon={createCustomIcon(getMarkerColor(data), totalCount)}
                    >
                      <Popup>
                        <div className="p-2 min-w-[200px]">
                          <div className="flex items-center gap-2 mb-2">
                            <span className="text-2xl">{data.flag}</span>
                            <strong className="text-base">{data.jurisdictionName}</strong>
                          </div>
                          <hr className="my-2" />
                          <div className="space-y-1 text-sm">
                            <div className="flex justify-between">
                              <span className="text-slate-600">Patents:</span>
                              <strong className="text-blue-600">{data.patentCount || 0}</strong>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-slate-600">Trademarks:</span>
                              <strong className="text-purple-600">{data.trademarkCount || 0}</strong>
                            </div>
                            <hr className="my-1" />
                            <div className="flex justify-between text-xs">
                              <span className="text-emerald-600">Active:</span>
                              <strong>{data.activeCount || 0}</strong>
                            </div>
                            <div className="flex justify-between text-xs">
                              <span className="text-amber-600">Pending:</span>
                              <strong>{data.pendingCount || 0}</strong>
                            </div>
                          </div>
                        </div>
                      </Popup>
                    </Marker>
                  );
                })}
              </MarkerClusterGroup>
            </MapContainer>
          )}

          {/* Map Style Toggle */}
          {!loading && displayData.length > 0 && (
            <div className="absolute bottom-4 right-4 z-[1000] bg-white p-2 rounded-lg shadow-lg border border-slate-200">
              <button 
                onClick={() => setMapStyle('default')} 
                className={`block w-full px-3 py-2 text-xs font-medium rounded mb-1 transition-colors ${
                  mapStyle === 'default' ? 'bg-indigo-600 text-white' : 'text-slate-600 hover:bg-slate-50'
                }`}
              >
                Standard Map
              </button>
              <button 
                onClick={() => setMapStyle('light')} 
                className={`block w-full px-3 py-2 text-xs font-medium rounded transition-colors ${
                  mapStyle === 'light' ? 'bg-indigo-600 text-white' : 'text-slate-600 hover:bg-slate-50'
                }`}
              >
                Light Map
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MapViewPage;