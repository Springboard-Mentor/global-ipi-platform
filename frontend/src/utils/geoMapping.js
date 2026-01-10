// src/utils/geoMapping.js

export const jurisdictionCoordinates = {
  'US': { lat: 37.0902, lng: -95.7129, zoom: 4, flag: '🇺🇸', name: 'United States' },
  'EP': { lat: 50.8503, lng: 4.3517, zoom: 5, flag: '🇪🇺', name: 'European Union' },
  'CN': { lat: 35.8617, lng: 104.1954, zoom: 4, flag: '🇨🇳', name: 'China' },
  'IN': { lat: 20.5937, lng: 78.9629, zoom: 5, flag: '🇮🇳', name: 'India' },
  'JP': { lat: 36.2048, lng: 138.2529, zoom: 5, flag: '🇯🇵', name: 'Japan' },
  'KR': { lat: 35.9078, lng: 127.7669, zoom: 6, flag: '🇰🇷', name: 'South Korea' },
  'GB': { lat: 55.3781, lng: -3.4360, zoom: 6, flag: '🇬🇧', name: 'United Kingdom' },
  'DE': { lat: 51.1657, lng: 10.4515, zoom: 6, flag: '🇩🇪', name: 'Germany' },
  'FR': { lat: 46.2276, lng: 2.2137, zoom: 6, flag: '🇫🇷', name: 'France' },
};

export const getCoordinates = (jurisdiction) => {
  return jurisdictionCoordinates[jurisdiction] || { 
    lat: 0, lng: 0, zoom: 2, flag: '🌍', name: 'Unknown' 
  };
};

export const getAllJurisdictions = () => {
  return Object.keys(jurisdictionCoordinates);
};

export const getJurisdictionName = (code) => {
  return jurisdictionCoordinates[code]?.name || code;
};