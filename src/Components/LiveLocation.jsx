import React, { useEffect, useState } from "react";
import { connectWebSocket, disconnectWebSocket } from "../services/websocket/socketClient";
import { toast } from "react-toastify";
import Navbar from "../Components/Navbar";
import busService from "../api/busService"; // Assuming busService is available as in Driver component
import { APIProvider, Map, AdvancedMarker, Pin } from '@vis.gl/react-google-maps';

const LiveLocation = () => {
  const [location, setLocation] = useState("Waiting for update...");
  const [status, setStatus] = useState("offline");
  const [lastUpdate, setLastUpdate] = useState(null);
  const [mapCenter, setMapCenter] = useState({ lat: 0, lng: 0 });
  const [markerPosition, setMarkerPosition] = useState(null);
  const [zoom, setZoom] = useState(12);
  const busNumber = localStorage.getItem("busNumber");

  const GOOGLE_MAPS_API_KEY = process.env.REACT_APP_GOOGLE_MAPS_API_KEY || "AIzaSyCUA3uUquQ88On7YaIFbBpByARvNj64GAU";

  // Parse location string to coordinates
  const parseLocation = (loc) => {
    if (!loc || !loc.includes(',')) return null;
    const [latStr, lngStr] = loc.split(',').map(coord => coord.trim());
    const lat = parseFloat(latStr);
    const lng = parseFloat(lngStr);
    if (isNaN(lat) || isNaN(lng)) return null;
    return { lat, lng };
  };

  // Update map based on location
  const updateMap = (loc) => {
    const coords = parseLocation(loc);
    if (coords) {
      setMapCenter(coords);
      setMarkerPosition(coords);
      setZoom(15);
    }
  };

  // Fetch initial bus location from backend
  useEffect(() => {
    if (!busNumber || busNumber.trim() === "") {
      setLocation("No bus assigned");
      return;
    }

    const fetchInitialLocation = async () => {
      try {
        const response = await busService.getBusByNumber(busNumber);
        if (response.data) {
          const bus = response.data;
          const initialLoc = bus.location || "No location available";
          setLocation(initialLoc);
          setStatus(bus.status ? "online" : "offline");
          setLastUpdate(new Date().toLocaleTimeString());
          updateMap(initialLoc);
        }
      } catch (error) {
        console.error("Failed to fetch initial bus location:", error);
        toast.error("Failed to load initial bus location");
      }
    };

    fetchInitialLocation();

    // Get user's current location as fallback for map center
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          if (!markerPosition) {
            setMapCenter({ lat: latitude, lng: longitude });
          }
        },
        (error) => {
          console.error("Failed to get user location:", error);
          // Default to a generic location if user location fails
          setMapCenter({ lat: 40.7128, lng: -74.0060 });
        }
      );
    }

    const onMessage = (data) => {
      const newLoc = data.location || "No coordinates";
      setLocation(newLoc);
      setStatus(data.status ? "online" : "offline");
      setLastUpdate(new Date().toLocaleTimeString());
      updateMap(newLoc);
    };

    connectWebSocket(busNumber, onMessage);

    return () => disconnectWebSocket();
  }, [busNumber, markerPosition]);

  return (
    <div className="min-vh-100 bg-light">
      <Navbar />
      <div className="container py-5">
        <div className="row justify-content-center">
          <div className="col-lg-8">
            <div className="card shadow-lg">
              <div className="card-header bg-primary text-white text-center py-4">
                <h2>Live Bus Tracking</h2>
                <h4>Bus: {busNumber || "Not Assigned"}</h4>
              </div>
              <div className="card-body p-5">
                <div className="text-center mb-4">
                  <span
                    className={`badge fs-5 px-4 py-2 bg-${
                      status === "online" ? "success" : "secondary"
                    }`}
                  >
                    {status === "online" ? "Bus Running" : "Bus Stopped"}
                  </span>
                  {lastUpdate && (
                    <p className="mt-2 text-muted">Last update: {lastUpdate}</p>
                  )}
                </div>

                <h4 className="text-center text-secondary mb-3">
                  Current Location
                </h4>
                <h2
                  className={`text-center fw-bold ${
                    status === "online" ? "text-success" : "text-danger"
                  }`}
                >
                  {location}
                </h2>

                <div className="mt-4 rounded overflow-hidden shadow" style={{ height: '400px' }}>
                  {GOOGLE_MAPS_API_KEY ? (
                    <APIProvider apiKey={GOOGLE_MAPS_API_KEY}>
                      <Map
                        style={{ width: '100%', height: '100%' }}
                        defaultCenter={mapCenter}
                        defaultZoom={zoom}
                        center={mapCenter}
                        zoom={zoom}
                        gestureHandling={'greedy'}
                        mapId={'BUS_TRACKING_MAP'}
                      >
                        {markerPosition && (
                          <AdvancedMarker 
                            position={markerPosition}
                            title={`Bus ${busNumber}`}
                          >
                            <Pin
                              background={status === "online" ? "#0d6efd" : "#6c757d"}
                              borderColor={status === "online" ? "#0a58ca" : "#495057"}
                              glyphColor="#ffffff"
                            />
                          </AdvancedMarker>
                        )}
                      </Map>
                    </APIProvider>
                  ) : (
                    <div className="d-flex align-items-center justify-content-center h-100 bg-light">
                      <div className="text-center">
                        <i className="fas fa-map fa-3x text-muted mb-3"></i>
                        <p className="text-muted">Google Maps API key required</p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LiveLocation;