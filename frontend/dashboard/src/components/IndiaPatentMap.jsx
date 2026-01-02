import React, { useEffect, useRef, useState } from 'react';
import { MapPin, TrendingUp } from 'lucide-react';

const IndiaPatentMap = () => {
  const mapRef = useRef(null);
  const [mapLoaded, setMapLoaded] = useState(false);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [stateData, setStateData] = useState([]);
  const markersRef = useRef([]);
  const mapInstanceRef = useRef(null);

  // State coordinates mapping
  const stateCoordinates = {
    'Maharashtra': { lat: 19.7515, lng: 75.7139 },
    'Karnataka': { lat: 15.3173, lng: 75.7139 },
    'Tamil Nadu': { lat: 11.1271, lng: 78.6569 },
    'Delhi': { lat: 28.7041, lng: 77.1025 },
    'Telangana': { lat: 18.1124, lng: 79.0193 },
    'Gujarat': { lat: 22.2587, lng: 71.1924 },
    'West Bengal': { lat: 22.9868, lng: 87.8550 },
    'Uttar Pradesh': { lat: 26.8467, lng: 80.9462 },
    'Rajasthan': { lat: 27.0238, lng: 74.2179 },
    'Haryana': { lat: 29.0588, lng: 76.0856 },
    'Punjab': { lat: 31.1471, lng: 75.3412 },
    'Kerala': { lat: 10.8505, lng: 76.2711 },
    'Madhya Pradesh': { lat: 22.9734, lng: 78.6569 },
    'Andhra Pradesh': { lat: 15.9129, lng: 79.7400 },
    'Bihar': { lat: 25.0961, lng: 85.3131 },
    'Chhattisgarh': { lat: 21.2787, lng: 81.8661 },
    'Goa': { lat: 15.2993, lng: 74.1240 },
    'Himachal Pradesh': { lat: 31.1048, lng: 77.1734 },
    'Jharkhand': { lat: 23.6102, lng: 85.2799 },
    'Assam': { lat: 26.2006, lng: 92.9376 },
    'Odisha': { lat: 20.9517, lng: 85.0985 },
    'Uttarakhand': { lat: 30.0668, lng: 79.0193 },
    'Jammu and Kashmir': { lat: 33.7782, lng: 76.5762 },
    'Ladakh': { lat: 34.1526, lng: 77.5771 },
    'Manipur': { lat: 24.6637, lng: 93.9063 },
    'Meghalaya': { lat: 25.4670, lng: 91.3662 },
    'Mizoram': { lat: 23.1645, lng: 92.9376 },
    'Nagaland': { lat: 26.1584, lng: 94.5624 },
    'Sikkim': { lat: 27.5330, lng: 88.5122 },
    'Tripura': { lat: 23.9408, lng: 91.9882 },
    'Arunachal Pradesh': { lat: 28.2180, lng: 94.7278 }
  };

  // Fetch patent data from backend
  const fetchPatentData = async () => {
    try {
      setLoading(true);
      const response = await fetch('http://localhost:8080/api/patent-filing/all', {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        },
        mode: 'cors',
      });

      if (response.ok) {
        const patents = await response.json();
        
        // Aggregate patents by state
        const stateCount = {};
        
        patents.forEach(patent => {
          const state = patent.state || patent.applicantState || 'Unknown';
          if (state && state !== 'Unknown') {
            stateCount[state] = (stateCount[state] || 0) + 1;
          }
        });

        // Create state data array with coordinates
        const stateDataArray = Object.keys(stateCount).map(stateName => {
          const coords = stateCoordinates[stateName] || { lat: 20.5937, lng: 78.9629 };
          return {
            name: stateName,
            lat: coords.lat,
            lng: coords.lng,
            patents: stateCount[stateName]
          };
        });

        setStateData(stateDataArray);
        setLoading(false);
        return stateDataArray;
      } else {
        throw new Error('Failed to fetch patent data');
      }
    } catch (err) {
      console.error('Error fetching patent data:', err);
      setError('Failed to load patent data');
      setLoading(false);
      return [];
    }
  };

  const getColorByPatentCount = (count, maxCount) => {
    const intensity = count / maxCount;
    if (intensity > 0.75) return '#581c87'; // purple-900
    if (intensity > 0.5) return '#7c3aed'; // purple-600
    if (intensity > 0.25) return '#a855f7'; // purple-500
    return '#e9d5ff'; // purple-200
  };

  const getMarkerSize = (count, maxCount) => {
    const intensity = count / maxCount;
    return 8 + (intensity * 20); // Size from 8 to 28
  };

  const clearMarkers = () => {
    markersRef.current.forEach(marker => marker.setMap(null));
    markersRef.current = [];
  };

  const showStateView = (map, data) => {
    clearMarkers();

    if (!data || data.length === 0) {
      console.log('No patent data available to display');
      return;
    }

    const maxPatents = Math.max(...data.map(s => s.patents));

    map.setCenter({ lat: 22.5, lng: 78.5 });
    map.setZoom(5);

    data.forEach(state => {
      const color = getColorByPatentCount(state.patents, maxPatents);
      const size = getMarkerSize(state.patents, maxPatents);

      const marker = new google.maps.Marker({
        position: { lat: state.lat, lng: state.lng },
        map: map,
        title: state.name,
        icon: {
          path: google.maps.SymbolPath.CIRCLE,
          scale: size,
          fillColor: color,
          fillOpacity: 0.85,
          strokeColor: '#ffffff',
          strokeWeight: 3
        }
      });

      const infoWindow = new google.maps.InfoWindow({
        content: `
          <div style="padding: 12px; font-family: system-ui, -apple-system, sans-serif; min-width: 180px;">
            <h3 style="margin: 0 0 8px 0; font-size: 18px; font-weight: bold; color: #1f2937;">
              ${state.name}
            </h3>
            <p style="margin: 0 0 8px 0; font-size: 16px; color: #6b7280;">
              <strong style="color: #7c3aed; font-size: 24px;">${state.patents}</strong> Patents
            </p>
          </div>
        `
      });

      marker.addListener('click', () => {
        infoWindow.open(map, marker);
      });

      marker.addListener('mouseover', () => {
        infoWindow.open(map, marker);
        marker.setIcon({
          path: google.maps.SymbolPath.CIRCLE,
          scale: size + 4,
          fillColor: '#c084fc',
          fillOpacity: 1,
          strokeColor: '#ffffff',
          strokeWeight: 4
        });
      });

      marker.addListener('mouseout', () => {
        infoWindow.close();
        marker.setIcon({
          path: google.maps.SymbolPath.CIRCLE,
          scale: size,
          fillColor: color,
          fillOpacity: 0.85,
          strokeColor: '#ffffff',
          strokeWeight: 3
        });
      });

      markersRef.current.push(marker);
    });
  };

  useEffect(() => {
    const initMap = async () => {
      try {
        const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;
        
        if (!apiKey) {
          throw new Error('Google Maps API key is not configured');
        }

        // Check if Google Maps is already loaded
        if (!window.google) {
          // Load Google Maps script
          const existingScript = document.querySelector('script[src*="maps.googleapis.com"]');
          
          if (!existingScript) {
            const script = document.createElement('script');
            script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&libraries=places,marker&v=weekly`;
            script.async = true;
            script.defer = true;
            
            await new Promise((resolve, reject) => {
              script.onload = resolve;
              script.onerror = () => reject(new Error('Failed to load Google Maps script'));
              document.head.appendChild(script);
            });
          } else {
            // Wait for existing script to load
            await new Promise((resolve) => {
              const checkGoogle = setInterval(() => {
                if (window.google) {
                  clearInterval(checkGoogle);
                  resolve();
                }
              }, 100);
            });
          }
        }

        if (!mapRef.current || !window.google) return;

        // Initialize map centered on India
        const map = new google.maps.Map(mapRef.current, {
          center: { lat: 22.5, lng: 78.5 },
          zoom: 5,
          minZoom: 4,
          maxZoom: 12,
          restriction: {
            latLngBounds: {
              north: 35.5,
              south: 6.5,
              west: 68,
              east: 97.5
            }
          },
          styles: [
            {
              featureType: 'water',
              elementType: 'geometry',
              stylers: [{ color: '#b3d9ff' }]
            },
            {
              featureType: 'landscape',
              elementType: 'geometry',
              stylers: [{ color: '#f3f4f6' }]
            },
            {
              featureType: 'road',
              elementType: 'geometry',
              stylers: [{ color: '#d1d5db' }, { weight: 1 }]
            },
            {
              featureType: 'poi',
              stylers: [{ visibility: 'simplified' }]
            },
            {
              featureType: 'administrative',
              elementType: 'geometry.stroke',
              stylers: [{ color: '#9ca3af' }, { weight: 1.5 }]
            },
            {
              featureType: 'administrative.province',
              elementType: 'geometry.stroke',
              stylers: [{ color: '#7c3aed' }, { weight: 2 }]
            }
          ],
          disableDefaultUI: false,
          zoomControl: true,
          mapTypeControl: false,
          scaleControl: true,
          streetViewControl: false,
          rotateControl: false,
          fullscreenControl: true
        });

        mapInstanceRef.current = map;
        setMapLoaded(true);

        // Fetch patent data and display markers
        const data = await fetchPatentData();
        if (data && data.length > 0) {
          showStateView(map, data);
        }
      } catch (err) {
        console.error('Error loading Google Maps:', err);
        setError(err.message);
      }
    };

    initMap();

    return () => {
      clearMarkers();
    };
  }, []);

  const handleRefreshData = async () => {
    if (mapInstanceRef.current) {
      const data = await fetchPatentData();
      if (data && data.length > 0) {
        showStateView(mapInstanceRef.current, data);
      }
    }
  };

  if (error) {
    return (
      <div className="w-full h-full min-h-[400px] flex items-center justify-center bg-red-50 rounded-xl">
        <div className="text-center p-6">
          <div className="text-red-600 text-lg font-semibold mb-2">
            Failed to load map
          </div>
          <div className="text-red-500 text-sm">{error}</div>
        </div>
      </div>
    );
  }

  return (
    <div className="relative w-full h-full min-h-[400px] rounded-xl overflow-hidden">
      {(!mapLoaded || loading) && (
        <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-purple-50 to-indigo-50 z-10">
          <div className="text-center">
            <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-purple-600 mx-auto mb-4"></div>
            <p className="text-gray-600 font-medium text-lg">
              {loading ? 'Loading Patent Data...' : 'Loading India Map...'}
            </p>
          </div>
        </div>
      )}
      
      <div 
        ref={mapRef} 
        className="w-full h-full min-h-[400px] rounded-xl"
      />
      
      {/* Controls Overlay */}
      {mapLoaded && !loading && (
        <>
          {/* Current View Info */}
          <div className="absolute top-4 right-4 bg-white/95 backdrop-blur-sm rounded-lg shadow-lg p-4 border-2 border-purple-200 z-10">
            <div className="flex items-center gap-3">
              <div className="bg-gradient-to-br from-purple-500 to-indigo-600 p-2 rounded-lg">
                <MapPin className="w-5 h-5 text-white" />
              </div>
              <div>
                <div className="text-xs font-semibold text-gray-500 uppercase">Patent Distribution</div>
                <div className="text-lg font-bold text-gray-900">
                  India - All States
                </div>
              </div>
            </div>
          </div>

          {/* Legend */}
          <div className="absolute bottom-4 right-4 bg-white/95 backdrop-blur-sm rounded-lg shadow-lg p-4 border-2 border-purple-200/50 z-10">
            <div className="flex items-center gap-2 mb-3">
              <TrendingUp className="w-4 h-4 text-purple-600" />
              <div className="text-xs font-bold text-gray-700">Patent Density</div>
            </div>
            <div className="flex flex-col gap-2">
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 rounded-full" style={{ backgroundColor: '#581c87' }}></div>
                <span className="text-xs text-gray-600 font-medium">Very High (75%+)</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-5 h-5 rounded-full" style={{ backgroundColor: '#7c3aed' }}></div>
                <span className="text-xs text-gray-600 font-medium">High (50-75%)</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 rounded-full" style={{ backgroundColor: '#a855f7' }}></div>
                <span className="text-xs text-gray-600 font-medium">Medium (25-50%)</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full" style={{ backgroundColor: '#e9d5ff' }}></div>
                <span className="text-xs text-gray-600 font-medium">Low (0-25%)</span>
              </div>
            </div>
            <div className="mt-3 pt-3 border-t border-gray-200">
              <p className="text-xs text-gray-500 italic">
                Hover/Click for details
              </p>
            </div>
          </div>

          {/* Stats Summary */}
          <div className="absolute bottom-4 left-4 bg-white/95 backdrop-blur-sm rounded-lg shadow-lg p-4 border-2 border-purple-200/50 z-10">
            <div className="text-xs font-semibold text-gray-500 uppercase mb-1">
              States with Patents
            </div>
            <div className="text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-indigo-600">
              {stateData.length}
            </div>
            <div className="text-xs text-gray-600 mt-1">
              {stateData.reduce((sum, s) => sum + s.patents, 0)} Total Patents
            </div>
            <button
              onClick={handleRefreshData}
              className="mt-3 w-full px-3 py-1.5 bg-purple-600 hover:bg-purple-700 text-white text-xs font-semibold rounded transition-colors"
            >
              Refresh Data
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default IndiaPatentMap;
