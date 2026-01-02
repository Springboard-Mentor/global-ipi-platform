import React, { useEffect, useRef, useState } from 'react';
import { MapPin, TrendingUp, Globe } from 'lucide-react';

const IndiaPatentMap = ({ selectedState = null, showHeatMap = false }) => {
  const mapRef = useRef(null);
  const [mapLoaded, setMapLoaded] = useState(false);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [stateData, setStateData] = useState([]);
  const mapInstanceRef = useRef(null);
  const selectedMarkerRef = useRef(null);
  const markersRef = useRef([]);
  const pulseIntervalsRef = useRef([]);

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
        return stateDataArray;
      } else {
        throw new Error('Failed to fetch patent data');
      }
    } catch (err) {
      console.error('Error fetching patent data:', err);
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
    // Clear all pulse intervals
    pulseIntervalsRef.current.forEach(interval => clearInterval(interval));
    pulseIntervalsRef.current = [];
    
    // Clear all markers
    markersRef.current.forEach(marker => marker.setMap(null));
    markersRef.current = [];
  };

  const clearSelectedMarker = () => {
    if (selectedMarkerRef.current) {
      selectedMarkerRef.current.setMap(null);
      selectedMarkerRef.current = null;
    }
  };

  // Highlight selected state with red location pin marker
  const highlightLocation = async (map, stateName) => {
    clearSelectedMarker();

    const coordinates = stateCoordinates[stateName];
    const locationName = stateName;
    const zoomLevel = 6.5;

    if (!coordinates) {
      console.warn(`Coordinates not found for ${locationName}`);
      return;
    }

    // Center map on the selected location with smooth pan
    map.panTo(coordinates);
    map.setZoom(zoomLevel);

    // Custom location pin SVG path (teardrop/pin shape)
    const pinPath = 'M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z';

    // Create red location pin marker for selected state
    const marker = new google.maps.Marker({
      position: coordinates,
      map: map,
      title: locationName,
      animation: google.maps.Animation.DROP,
      icon: {
        path: pinPath,
        fillColor: '#dc2626', // Red color
        fillOpacity: 1,
        strokeColor: '#ffffff',
        strokeWeight: 2,
        scale: 2,
        anchor: new google.maps.Point(12, 22)
      }
    });

    const infoWindow = new google.maps.InfoWindow({
      content: `
        <div style="padding: 12px; font-family: system-ui, -apple-system, sans-serif; min-width: 200px;">
          <h3 style="margin: 0 0 8px 0; font-size: 18px; font-weight: bold; color: #dc2626;">
            📍 ${locationName}
          </h3>
          <p style="margin: 0; font-size: 14px; color: #6b7280;">
            Selected State
          </p>
        </div>
      `
    });

    // Show info window immediately
    infoWindow.open(map, marker);

    marker.addListener('click', () => {
      infoWindow.open(map, marker);
    });

    selectedMarkerRef.current = marker;
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
        },
        animation: google.maps.Animation.DROP
      });

      // Apply continuous pulsing animation
      const pulseInterval = setInterval(() => {
        marker.setIcon({
          path: google.maps.SymbolPath.CIRCLE,
          scale: size * 1.15,
          fillColor: color,
          fillOpacity: 1,
          strokeColor: '#ffffff',
          strokeWeight: 4
        });
        
        setTimeout(() => {
          marker.setIcon({
            path: google.maps.SymbolPath.CIRCLE,
            scale: size,
            fillColor: color,
            fillOpacity: 0.85,
            strokeColor: '#ffffff',
            strokeWeight: 3
          });
        }, 500);
      }, 1500);

      // Store interval for cleanup
      pulseIntervalsRef.current.push(pulseInterval);

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
        // Expand circle animation
        const expandedSize = size + 12;
        marker.setIcon({
          path: google.maps.SymbolPath.CIRCLE,
          scale: expandedSize,
          fillColor: '#c084fc',
          fillOpacity: 1,
          strokeColor: '#ffffff',
          strokeWeight: 5
        });
        
        // Zoom to state
        map.setZoom(7);
        map.panTo({ lat: state.lat, lng: state.lng });
        
        // Open info window
        infoWindow.open(map, marker);
        
        // Reset size after animation
        setTimeout(() => {
          marker.setIcon({
            path: google.maps.SymbolPath.CIRCLE,
            scale: size + 6,
            fillColor: color,
            fillOpacity: 0.9,
            strokeColor: '#ffffff',
            strokeWeight: 4
          });
        }, 500);
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
        setLoading(false);

        // Add custom blinking overlay in top-right corner when heat map is enabled
        if (showHeatMap) {
          const overlayDiv = document.createElement('div');
          overlayDiv.style.cssText = `
            background: rgba(220, 38, 38, 0.9);
            color: white;
            padding: 10px 16px;
            border-radius: 8px;
            box-shadow: 0 2px 12px rgba(220, 38, 38, 0.4);
            font-family: system-ui, -apple-system, sans-serif;
            font-weight: 700;
            font-size: 14px;
            margin: 10px;
            display: flex;
            align-items: center;
            gap: 8px;
            backdrop-filter: blur(12px);
            border: 2px solid rgba(255, 255, 255, 0.8);
            animation: blink 2s ease-in-out infinite;
          `;
          
          // Add blinking animation keyframes
          const styleSheet = document.createElement('style');
          styleSheet.textContent = `
            @keyframes blink {
              0%, 100% { opacity: 1; box-shadow: 0 2px 12px rgba(220, 38, 38, 0.4); transform: scale(1); }
              50% { opacity: 0.85; box-shadow: 0 4px 20px rgba(220, 38, 38, 0.7); transform: scale(1.05); }
            }
          `;
          document.head.appendChild(styleSheet);
          
          overlayDiv.innerHTML = `
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <circle cx="12" cy="12" r="10"></circle>
              <line x1="2" y1="12" x2="22" y2="12"></line>
              <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"></path>
            </svg>
            <span>All Indian States Patents</span>
          `;
          map.controls[google.maps.ControlPosition.TOP_RIGHT].push(overlayDiv);
        }

        // Load heat map data if enabled
        if (showHeatMap) {
          const data = await fetchPatentData();
          if (data && data.length > 0) {
            showStateView(map, data);
          }
        }
      } catch (err) {
        console.error('Error loading Google Maps:', err);
        setError(err.message);
        setLoading(false);
      }
    };

    initMap();

    return () => {
      clearMarkers();
      clearSelectedMarker();
    };
  }, [showHeatMap]);

  // Effect to handle selected state changes
  useEffect(() => {
    if (mapInstanceRef.current && mapLoaded && selectedState) {
      highlightLocation(mapInstanceRef.current, selectedState);
    } else if (mapInstanceRef.current && mapLoaded && !selectedState) {
      // Reset to India view when no state is selected
      clearSelectedMarker();
      mapInstanceRef.current.setCenter({ lat: 22.5, lng: 78.5 });
      mapInstanceRef.current.setZoom(5);
    }
  }, [selectedState, mapLoaded]);

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
    <div className="relative w-full h-full flex gap-4">
      {/* Map Container - 70% width */}
      <div className="relative flex-1 max-w-[70%] min-h-[480px] rounded-xl overflow-hidden">
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
          className="w-full h-full min-h-[480px] rounded-xl"
        />
      </div>

      {/* Legend Container - 30% width on the right */}
      {showHeatMap && mapLoaded && !loading && (
        <div className="w-[30%] bg-gradient-to-r from-purple-50 to-indigo-50 rounded-lg p-4 border border-purple-200 flex flex-col">
          <div className="flex items-center space-x-2 pb-3 mb-3 border-b border-purple-300">
            <Globe className="w-4 h-4 text-purple-600" />
            <h3 className="text-sm font-bold text-gray-800">Heat Map Legend</h3>
          </div>
          
          {/* Legend Items */}
          <div className="flex flex-col space-y-2.5 mb-4">
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 rounded-full bg-[#581c87] flex-shrink-0"></div>
              <span className="text-xs text-gray-700 font-medium">Very High (75%+)</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 rounded-full bg-[#7c3aed] flex-shrink-0"></div>
              <span className="text-xs text-gray-700 font-medium">High (45-75%)</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 rounded-full bg-[#9333ea] flex-shrink-0"></div>
              <span className="text-xs text-gray-700 font-medium">Medium (30-45%)</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 rounded-full bg-[#a855f7] flex-shrink-0"></div>
              <span className="text-xs text-gray-700 font-medium">Low (15-30%)</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 rounded-full bg-[#c084fc] flex-shrink-0"></div>
              <span className="text-xs text-gray-700 font-medium">Very Low (&lt;15%)</span>
            </div>
          </div>

          {/* Statistics Section */}
          <div className="mt-auto pt-3 border-t border-purple-200">
            <div className="bg-white rounded-lg p-3 shadow-sm border border-purple-100">
              <h3 className="text-xs font-semibold text-purple-800 mb-2">
                📊 Patent Coverage Statistics
              </h3>
              <div className="flex items-center justify-between mb-2">
                <div className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-indigo-600 bg-clip-text text-transparent">
                  {stateData.length}
                </div>
                <div className="text-xs text-gray-600 text-right">
                  <span className="font-semibold">out of 36</span>
                  <div className="text-[10px] text-gray-500">states/UTs</div>
                </div>
              </div>
              <div className="bg-purple-100 rounded-lg px-3 py-2 text-center">
                <div className="text-lg font-bold text-purple-600">
                  {stateData.length > 0 ? Math.round((stateData.length / 36) * 100) : 0}%
                </div>
                <div className="text-[9px] text-gray-500 font-medium">Coverage</div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default IndiaPatentMap;
