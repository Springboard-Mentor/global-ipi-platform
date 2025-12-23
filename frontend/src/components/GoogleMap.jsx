import React, { useEffect, useRef } from "react";

// Google Maps API key resolution order:
// 1. `process.env.REACT_APP_GOOGLE_MAPS_API_KEY` (recommended, set in .env.local)
// 2. `apiKey` prop passed to the component
// 3. No fallback (map will show a message when key is missing)
const DEFAULT_API_KEY = "";

const loadGoogleMaps = (apiKey) => {
  return new Promise((resolve, reject) => {
    if (typeof window === "undefined") return reject();
    if (window.google && window.google.maps) return resolve(window.google.maps);

    const existing = document.getElementById("google-maps-script");
    if (existing) {
      existing.addEventListener("load", () => resolve(window.google.maps));
      existing.addEventListener("error", () => reject(new Error("Google Maps failed to load")));
      return;
    }

    const script = document.createElement("script");
    script.id = "google-maps-script";
    script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}`;
    script.async = true;
    script.defer = true;
    script.onload = () => resolve(window.google.maps);
    script.onerror = () => reject(new Error("Google Maps failed to load"));
    document.head.appendChild(script);
  });
};

const GoogleMap = ({
  lat,
  lng,
  zoom = 6,
  markerTitle = "Location",
  apiKey: apiKeyProp,
  markers = [],
}) => {
  const ref = useRef(null);

  useEffect(() => {
    const apiKey = process.env.REACT_APP_GOOGLE_MAPS_API_KEY || apiKeyProp || DEFAULT_API_KEY;
    if (!apiKey) return; // nothing to do

    let map;

    loadGoogleMaps(apiKey)
      .then((maps) => {
        if (!ref.current) return;

        const initialCenter =
          markers && markers.length
            ? { lat: Number(markers[0].lat), lng: Number(markers[0].lng) }
            : { lat: Number(lat) || 0, lng: Number(lng) || 0 };

        map = new maps.Map(ref.current, {
          center: initialCenter,
          zoom,
        });

        if (markers && markers.length) {
          const bounds = new maps.LatLngBounds();
          markers.forEach((m) => {
            if (m.lat == null || m.lng == null) return;
            const marker = new maps.Marker({
              position: { lat: Number(m.lat), lng: Number(m.lng) },
              map,
              title: m.jurisdiction || m.title || markerTitle,
            });

            if (m.info) {
              const infowindow = new maps.InfoWindow({ content: m.info });
              marker.addListener("click", () => infowindow.open(map, marker));
            }

            bounds.extend({ lat: Number(m.lat), lng: Number(m.lng) });
          });

          if (markers.length > 1) {
            map.fitBounds(bounds);
          } else {
            map.setCenter(bounds.getCenter());
            map.setZoom(zoom);
          }
        } else {
          // single marker fallback
          if (lat != null && lng != null) {
            new maps.Marker({
              position: { lat: Number(lat), lng: Number(lng) },
              map,
              title: markerTitle,
            });
          }
        }
      })
      .catch(() => {
        // silently fail; the component will show fallback UI
      });

    return () => {
      map = null;
    };
  }, [lat, lng, zoom, markerTitle, apiKeyProp, JSON.stringify(markers)]);

  const runtimeKey = process.env.REACT_APP_GOOGLE_MAPS_API_KEY || apiKeyProp || DEFAULT_API_KEY;
  if (!runtimeKey) {
    return (
      <div className="text-sm text-gray-400">Google Maps API key not set (set `REACT_APP_GOOGLE_MAPS_API_KEY` in .env.local or pass `apiKey` prop).</div>
    );
  }

  // The parent container should size this element (full height/width). The inner div
  // will stretch to fill.
  return (
    <div className="w-full rounded-xl overflow-hidden border border-white/10 h-full">
      <div ref={ref} style={{ width: "100%", height: "100%" }} />
    </div>
  );
};

export default GoogleMap;
