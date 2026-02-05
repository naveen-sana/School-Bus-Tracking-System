import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import busService from "../api/busService";
import { APIProvider, Map, AdvancedMarker, Pin } from '@vis.gl/react-google-maps';

const Driver = () => {
  const navigate = useNavigate();
  const [isTracking, setIsTracking] = useState(false);
  const [currentLocation, setCurrentLocation] = useState("Not started");
  const [busNumber, setBusNumber] = useState("");
  const [busDetails, setBusDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [locationError, setLocationError] = useState(null);
  const [driverInfo, setDriverInfo] = useState(null);
  const watchIdRef = useRef(null);
  
  // Map state
  const [mapCenter, setMapCenter] = useState({ lat: 0, lng: 0 });
  const [zoom, setZoom] = useState(12);
  const [markerPosition, setMarkerPosition] = useState(null);

  // Get your Google Maps API key
  const GOOGLE_MAPS_API_KEY = process.env.REACT_APP_GOOGLE_MAPS_API_KEY || "AIzaSyCUA3uUquQ88On7YaIFbBpByARvNj64GAU";

  // Get bus number from localStorage and fetch bus details
  useEffect(() => {
    const fetchBusDetails = async () => {
      try {
        const storedBusNumber = localStorage.getItem("driverBusNumber");
        
        if (storedBusNumber) {
          setBusNumber(storedBusNumber);
          
          // Get driver info
          const driverName = localStorage.getItem("driverName");
          const driverContact = localStorage.getItem("driverContact");
          const pickTime = localStorage.getItem("driverPickTime");
          const dropTime = localStorage.getItem("driverDropTime");
          
          setDriverInfo({
            name: driverName,
            contact: driverContact,
            pickTime,
            dropTime
          });

          try {
            const response = await busService.getBusByNumber(storedBusNumber);
            if (response.data) {
              setBusDetails(response.data);
              // Parse location for map
              if (response.data.location && response.data.location.includes(',')) {
                const [lat, lng] = response.data.location.split(',').map(coord => parseFloat(coord.trim()));
                if (!isNaN(lat) && !isNaN(lng)) {
                  setMapCenter({ lat, lng });
                  setMarkerPosition({ lat, lng });
                }
              }
            } else {
              // Fallback to localStorage data
              const busId = localStorage.getItem("busId");
              const busRoute = localStorage.getItem("busRoute");
              const busLocation = localStorage.getItem("busLocation");
              const busStatus = localStorage.getItem("busStatus") === "true";
              
              setBusDetails({
                id: busId,
                number: storedBusNumber,
                route: busRoute,
                location: busLocation,
                status: busStatus,
                driverName: driverName
              });
              
              // Parse location for map if available
              if (busLocation && busLocation.includes(',')) {
                const [lat, lng] = busLocation.split(',').map(coord => parseFloat(coord.trim()));
                if (!isNaN(lat) && !isNaN(lng)) {
                  setMapCenter({ lat, lng });
                  setMarkerPosition({ lat, lng });
                }
              }
            }
          } catch (apiError) {
            console.warn("Using local data:", apiError);
            const busId = localStorage.getItem("busId");
            const busRoute = localStorage.getItem("busRoute");
            const busLocation = localStorage.getItem("busLocation");
            const busStatus = localStorage.getItem("busStatus") === "true";
            
            setBusDetails({
              id: busId,
              number: storedBusNumber,
              route: busRoute,
              location: busLocation,
              status: busStatus,
              driverName: driverName
            });
            
            if (busLocation && busLocation.includes(',')) {
              const [lat, lng] = busLocation.split(',').map(coord => parseFloat(coord.trim()));
              if (!isNaN(lat) && !isNaN(lng)) {
                setMapCenter({ lat, lng });
                setMarkerPosition({ lat, lng });
              }
            }
          }
        } else {
          const driverId = localStorage.getItem("driverId");
          if (driverId) {
            toast.warn("No bus assigned. Please contact admin.");
          } else {
            navigate("/driverLogin");
          }
        }
      } catch (error) {
        console.error("Error fetching bus details:", error);
        toast.error("Failed to load bus information");
      } finally {
        setLoading(false);
      }
    };

    fetchBusDetails();
  }, [navigate]);

  // Parse location string
  const parseLocationString = (locationString) => {
    if (!locationString || !locationString.includes(',')) return null;
    
    const [latStr, lngStr] = locationString.split(',').map(coord => coord.trim());
    const lat = parseFloat(latStr);
    const lng = parseFloat(lngStr);
    
    if (isNaN(lat) || isNaN(lng)) return null;
    
    return { lat, lng };
  };

  // Update map with new location
  const updateMapLocation = (locationText) => {
    const location = parseLocationString(locationText);
    if (location) {
      setMapCenter(location);
      setMarkerPosition(location);
      setZoom(15);
    }
  };

  // Send location to backend - FIXED: Added route field
  const sendLocationToBackend = async (locationText, status) => {
    try {
      const locationData = {
        busNumber: busNumber,
        location: locationText,
        status: status,
        route: busDetails?.route || "Not specified"  // ADDED THIS FIELD
      };
      
      console.log("Sending location data:", locationData);
      const response = await busService.updateBusLocation(locationData);
      console.log("Location updated:", response.data);
      
      return response.data;
    } catch (err) {
      console.error("Failed to update location on server:", err);
      throw err;
    }
  };

  // Start location tracking
  const startLocationTracking = () => {
    if (!busNumber) {
      toast.error("Bus not assigned! Please contact admin.");
      return;
    }

    if (!navigator.geolocation) {
      toast.error("Geolocation is not supported by your browser");
      setLocationError("Browser doesn't support geolocation");
      return;
    }

    if (navigator.permissions) {
      navigator.permissions.query({ name: 'geolocation' })
        .then((permissionStatus) => {
          if (permissionStatus.state === 'denied') {
            toast.error("Location permission denied. Please enable location services.");
            setLocationError("Location permission denied");
            return;
          }
          startWatchingLocation();
        })
        .catch(() => {
          startWatchingLocation();
        });
    } else {
      startWatchingLocation();
    }
  };

  const startWatchingLocation = () => {
    setIsTracking(true);
    setLocationError(null);
    toast.success("Location tracking started!");

    watchIdRef.current = navigator.geolocation.watchPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;
        const locationText = `${latitude.toFixed(6)}, ${longitude.toFixed(6)}`;
        
        setCurrentLocation(locationText);
        updateMapLocation(locationText);

        // Send to backend with all required fields
        try {
          await sendLocationToBackend(locationText, true);
          
          // Update local bus details
          if (busDetails) {
            setBusDetails(prev => ({
              ...prev,
              location: locationText,
              status: true
            }));
          }
        } catch (err) {
          console.error("Failed to update location:", err);
          toast.error("Failed to send location to server");
        }
      },
      (error) => {
        console.error("Geolocation error:", error);
        let errorMessage = "Location access error";
        
        switch(error.code) {
          case error.PERMISSION_DENIED:
            errorMessage = "Location permission denied. Please enable location services.";
            break;
          case error.POSITION_UNAVAILABLE:
            errorMessage = "Location information unavailable.";
            break;
          case error.TIMEOUT:
            errorMessage = "Location request timed out.";
            break;
          default:
            errorMessage = "An unknown error occurred.";
        }
        
        setLocationError(errorMessage);
        toast.error(errorMessage);
        stopLocationTracking();
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0,
      }
    );
  };

  // Stop tracking
  const stopLocationTracking = async () => {
    if (watchIdRef.current !== null) {
      navigator.geolocation.clearWatch(watchIdRef.current);
      watchIdRef.current = null;
    }
    
    setIsTracking(false);
    setCurrentLocation("Tracking stopped");
    setLocationError(null);
    
    // Update bus status to stopped with all required fields
    if (busNumber) {
      try {
        await sendLocationToBackend(currentLocation, false);
        
        // Update local bus details
        if (busDetails) {
          setBusDetails(prev => ({
            ...prev,
            status: false
          }));
        }
      } catch (err) {
        console.error("Failed to update stopped status:", err);
      }
    }
    
    toast.info("Location tracking stopped");
  };

  // Toggle tracking
  const toggleTracking = () => {
    if (isTracking) {
      stopLocationTracking();
    } else {
      startLocationTracking();
    }
  };

  // Get current location once
  const getCurrentLocation = () => {
    if (!navigator.geolocation) {
      toast.error("Geolocation not supported");
      return;
    }

    toast.info("Getting current location...");
    
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;
        const locationText = `${latitude.toFixed(6)}, ${longitude.toFixed(6)}`;
        
        setCurrentLocation(locationText);
        updateMapLocation(locationText);
        toast.success("Location updated!");
        
        // Send to backend with all required fields
        if (busNumber) {
          try {
            await sendLocationToBackend(locationText, isTracking);
            
            // Update local bus details
            if (busDetails) {
              setBusDetails(prev => ({
                ...prev,
                location: locationText
              }));
            }
          } catch (err) {
            console.error("Failed to update location:", err);
          }
        }
      },
      (error) => {
        toast.error("Failed to get location: " + error.message);
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
      }
    );
  };

  // Get user's current location for initial map center
  useEffect(() => {
    if (!markerPosition && navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setMapCenter({ lat: latitude, lng: longitude });
        },
        (error) => {
          console.log("Using default location:", error);
          setMapCenter({ lat: 40.7128, lng: -74.0060 });
        }
      );
    }
  }, [markerPosition]);

  // Cleanup
  useEffect(() => {
    return () => {
      if (watchIdRef.current !== null) {
        navigator.geolocation.clearWatch(watchIdRef.current);
      }
    };
  }, []);

  // Format location for display
  const formatLocation = (location) => {
    if (location.includes(',')) {
      const [lat, lng] = location.split(',').map(coord => coord.trim());
      return (
        <>
          <div>Latitude: <strong>{lat}</strong></div>
          <div>Longitude: <strong>{lng}</strong></div>
        </>
      );
    }
    return location;
  };

  // Logout function
  const handleLogout = () => {
    localStorage.removeItem("driverBusNumber");
    localStorage.removeItem("driverId");
    localStorage.removeItem("driverName");
    localStorage.removeItem("driverContact");
    localStorage.removeItem("driverPickTime");
    localStorage.removeItem("driverDropTime");
    localStorage.removeItem("busId");
    localStorage.removeItem("busRoute");
    localStorage.removeItem("busLocation");
    localStorage.removeItem("busStatus");
    
    if (isTracking) {
      stopLocationTracking();
    }
    
    toast.info("Logged out from driver mode");
    navigate("/driverLogin");
  };

  // Map component
  const MapDisplay = () => (
    <div className="card shadow-lg border-0 mb-4">
      <div className="card-header bg-white border-0 pt-4">
        <h4 className="card-title mb-0">
          <i className="fas fa-map me-2 text-primary"></i>
          Live Location Map
        </h4>
      </div>
      
      <div className="card-body p-0" style={{ height: '400px' }}>
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
                    background={isTracking ? "#0d6efd" : "#6c757d"}
                    borderColor={isTracking ? "#0a58ca" : "#495057"}
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
      
      <div className="card-footer bg-white border-0">
        <div className="d-flex justify-content-between align-items-center">
          <div>
            <span className={`badge ${isTracking ? 'bg-success' : 'bg-secondary'} me-2`}>
              <i className={`fas fa-${isTracking ? 'broadcast-tower' : 'map-marker'} me-1`}></i>
              {isTracking ? 'Live Tracking' : 'Static Location'}
            </span>
            <small className="text-muted">
              {markerPosition 
                ? `Lat: ${markerPosition.lat.toFixed(6)}, Lng: ${markerPosition.lng.toFixed(6)}`
                : 'No location data'}
            </small>
          </div>
          <button
            onClick={getCurrentLocation}
            className="btn btn-sm btn-outline-primary"
            disabled={!busNumber}
          >
            <i className="fas fa-crosshairs me-1"></i>
            Re-center
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <>
      
      <div className="min-vh-100 bg-light">
        <div className="container py-5">
          <div className="row justify-content-center">
            <div className="col-lg-10">
              {/* Header Card */}
              <div className="card shadow-lg border-0 mb-4">
                <div className="card-header bg-gradient text-white text-center py-4" 
                     style={{ background: "linear-gradient(135deg, #007bff, #6610f2)" }}>
                  <h2 className="mb-2">
                    <i className="fas fa-bus me-3"></i>
                    Driver Location Control Panel
                  </h2>
                  {busNumber && (
                    <div className="mt-3">
                      <span className="badge bg-warning text-dark fs-5 px-4 py-2">
                        <i className="fas fa-bus me-2"></i>
                        Bus: <strong>{busNumber}</strong>
                      </span>
                      {driverInfo && (
                        <span className="badge bg-info text-white fs-6 px-3 py-2 ms-2">
                          <i className="fas fa-user-tie me-2"></i>
                          Driver: {driverInfo.name}
                        </span>
                      )}
                    </div>
                  )}
                </div>
                
                <div className="card-body p-4">
                  {loading ? (
                    <div className="text-center py-4">
                      <div className="spinner-border text-primary" role="status">
                        <span className="visually-hidden">Loading...</span>
                      </div>
                      <p className="mt-3">Loading bus information...</p>
                    </div>
                  ) : busDetails ? (
                    <div className="row">
                      <div className="col-md-6">
                        <div className="p-3 bg-white rounded border h-100">
                          <h5><i className="fas fa-info-circle text-primary me-2"></i>Bus Information</h5>
                          <ul className="list-unstyled mt-3">
                            <li className="mb-2">
                              <strong>Bus Number:</strong> {busNumber}
                            </li>
                            <li className="mb-2">
                              <strong>Route:</strong> {busDetails.route || "Not specified"}
                            </li>
                            <li className="mb-2">
                              <strong>Current Status:</strong> 
                              <span className={`badge ms-2 ${busDetails.status ? 'bg-success' : 'bg-secondary'}`}>
                                {busDetails.status ? "Running" : "Stopped"}
                              </span>
                            </li>
                            <li className="mb-2">
                              <strong>Last Location:</strong> {busDetails.location || "Unknown"}
                            </li>
                            <li className="mb-2">
                              <strong>Driver:</strong> {driverInfo?.name || busDetails.driverName || "Not assigned"}
                            </li>
                            {driverInfo && (
                              <>
                                <li className="mb-2">
                                  <strong>Contact:</strong> {driverInfo.contact || "Not available"}
                                </li>
                                <li className="mb-2">
                                  <strong>Schedule:</strong> {driverInfo.pickTime || "N/A"} - {driverInfo.dropTime || "N/A"}
                                </li>
                              </>
                            )}
                          </ul>
                        </div>
                      </div>
                      
                      <div className="col-md-6">
                        <div className="p-3 bg-white rounded border h-100">
                          <h5><i className="fas fa-map-marker-alt text-danger me-2"></i>Location Control</h5>
                          <div className="mt-3">
                            <div className="d-grid gap-2">
                              <button
                                onClick={toggleTracking}
                                className={`btn btn-lg fw-bold ${isTracking ? 'btn-danger' : 'btn-success'}`}
                                disabled={!busNumber}
                              >
                                <i className={`fas fa-${isTracking ? 'stop-circle' : 'play-circle'} me-2`}></i>
                                {isTracking ? "STOP LIVE TRACKING" : "START LIVE TRACKING"}
                              </button>
                              
                              <button
                                onClick={getCurrentLocation}
                                className="btn btn-outline-primary btn-lg"
                                disabled={!busNumber}
                              >
                                <i className="fas fa-sync-alt me-2"></i>
                                UPDATE LOCATION ONCE
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="text-center py-4">
                      <i className="fas fa-bus-slash fa-3x text-muted mb-3"></i>
                      <h4 className="text-muted">No Bus Assigned</h4>
                      <p className="text-muted">Please contact administrator to assign a bus.</p>
                      <button 
                        onClick={() => navigate("/viewBus")}
                        className="btn btn-primary me-2"
                      >
                        <i className="fas fa-eye me-2"></i>
                        View Available Buses
                      </button>
                      <button 
                        onClick={handleLogout}
                        className="btn btn-outline-secondary"
                      >
                        <i className="fas fa-sign-out-alt me-2"></i>
                        Logout
                      </button>
                    </div>
                  )}
                </div>
              </div>

              {/* Map Display */}
              {busDetails && <MapDisplay />}

              {/* Location Display Card */}
              <div className="card shadow-lg border-0 mb-4">
                <div className="card-header bg-white border-0 pt-4">
                  <h4 className="card-title mb-0">
                    <i className="fas fa-location-dot me-2 text-primary"></i>
                    Current Coordinates
                  </h4>
                </div>
                
                <div className="card-body p-4">
                  <div className="text-center p-4 bg-light rounded">
                    <div className={`display-6 fw-bold mb-3 ${isTracking ? 'text-success' : 'text-secondary'}`}>
                      {formatLocation(currentLocation)}
                    </div>
                    
                    <div className="mt-3">
                      <span className={`badge ${isTracking ? 'bg-success' : 'bg-secondary'} fs-6 px-4 py-2`}>
                        <i className={`fas fa-${isTracking ? 'broadcast-tower' : 'power-off'} me-2`}></i>
                        {isTracking ? "LIVE TRACKING ACTIVE" : "TRACKING INACTIVE"}
                      </span>
                    </div>
                    
                    {locationError && (
                      <div className="alert alert-danger mt-3">
                        <i className="fas fa-exclamation-triangle me-2"></i>
                        {locationError}
                      </div>
                    )}
                    
                    {!isTracking && currentLocation !== "Not started" && currentLocation !== "Tracking stopped" && (
                      <div className="alert alert-info mt-3">
                        <i className="fas fa-clock me-2"></i>
                        Last known location: {currentLocation}
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="card shadow-lg border-0">
                <div className="card-body">
                  <div className="row g-3">
                    <div className="col-md-3">
                      <button
                        onClick={handleLogout}
                        className="btn btn-outline-danger w-100 py-3"
                      >
                        <i className="fas fa-sign-out-alt me-2"></i>
                        Logout
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        .card {
          transition: transform 0.3s ease, box-shadow 0.3s ease;
        }
        .card:hover {
          transform: translateY(-5px);
          box-shadow: 0 10px 30px rgba(0,0,0,0.1) !important;
        }
        .btn-success, .btn-danger {
          transition: all 0.3s ease;
        }
        .btn-success:hover {
          transform: scale(1.02);
          box-shadow: 0 5px 15px rgba(40, 167, 69, 0.3);
        }
        .btn-danger:hover {
          transform: scale(1.02);
          box-shadow: 0 5px 15px rgba(220, 53, 69, 0.3);
        }
        .display-6 {
          font-family: 'Courier New', monospace;
          letter-spacing: 1px;
        }
      `}</style>
    </>
  );
};

export default Driver;