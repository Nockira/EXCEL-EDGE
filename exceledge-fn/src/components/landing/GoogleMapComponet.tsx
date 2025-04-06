import React, { useState, useCallback } from "react";
import {
  GoogleMap,
  useJsApiLoader,
  Marker,
  DirectionsRenderer,
} from "@react-google-maps/api";

export const GoogleMapComponent = () => {
  // Default destination coordinates with more prominent styling
  const defaultDestination = {
    lat: -1.95456,
    lng: 30.09397,
    address: "24Q8+QJ4 Remera RN3, KG 4 Roundabout, Kigali",
  };

  // Map state
  const [center, setCenter] = useState(defaultDestination);
  const [isLoading, setIsLoading] = useState(false);
  const [map, setMap] = useState<google.maps.Map | null>(null);
  const [directions, setDirections] =
    useState<google.maps.DirectionsResult | null>(null);
  const [userLocation, setUserLocation] = useState<{
    lat: number;
    lng: number;
    address: string;
  } | null>(null);

  // Map container style
  const containerStyle = {
    width: "100%",
    height: "100%",
  };

  const { isLoaded } = useJsApiLoader({
    id: "google-map-script",
    googleMapsApiKey: "AIzaSyDzB64c9CND5gMOpeEOkDNEmxKYXhlz2U8",
    libraries: ["places", "geocoding"],
  });

  const onLoad = useCallback((map: google.maps.Map) => {
    // Set initial view to focus on default destination
    map.setCenter(defaultDestination);
    map.setZoom(16); // Higher zoom to highlight the default location
    setMap(map);
  }, []);

  const onUnmount = useCallback(() => {
    setMap(null);
  }, []);

  const getCurrentLocation = () => {
    setIsLoading(true);
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const newPos = {
            lat: position.coords.latitude,
            lng: position.coords.longitude,
            address: "Current Location",
          };
          setUserLocation(newPos);
          if (map) {
            // Create bounds to include both locations with padding
            const bounds = new google.maps.LatLngBounds();
            bounds.extend(newPos);
            bounds.extend(defaultDestination);
            map.fitBounds(bounds, { top: 50, right: 50, bottom: 50, left: 50 });
          }
          setIsLoading(false);
        },
        (error) => {
          console.error("Error getting location:", error);
          alert("Unable to retrieve your location: " + error.message);
          setIsLoading(false);
        },
        { enableHighAccuracy: true, timeout: 10000 }
      );
    } else {
      alert("Geolocation is not supported by your browser.");
      setIsLoading(false);
    }
  };

  const getDirectionsToDefault = () => {
    if (!userLocation || !map) {
      alert("Please get your current location first");
      return;
    }

    setIsLoading(true);
    setDirections(null);

    const directionsService = new google.maps.DirectionsService();
    directionsService.route(
      {
        origin: new google.maps.LatLng(userLocation.lat, userLocation.lng),
        destination: new google.maps.LatLng(
          defaultDestination.lat,
          defaultDestination.lng
        ),
        travelMode: google.maps.TravelMode.DRIVING,
      },
      (response, status) => {
        setIsLoading(false);
        if (status === "OK" && response) {
          setDirections(response);
          // Adjust map to show the entire route with padding
          const bounds = new google.maps.LatLngBounds();
          response.routes[0].legs.forEach((leg) => {
            bounds.extend(leg.start_location);
            bounds.extend(leg.end_location);
          });
          map.fitBounds(bounds, { top: 50, right: 50, bottom: 50, left: 50 });
        } else {
          console.error("Directions request failed:", status);
          alert("Could not get directions: " + status);
        }
      }
    );
  };

  const clearDirections = () => {
    setDirections(null);
    if (map) {
      // Return to showing both locations with the default destination centered
      if (userLocation) {
        const bounds = new google.maps.LatLngBounds();
        bounds.extend(userLocation);
        bounds.extend(defaultDestination);
        map.fitBounds(bounds, { top: 50, right: 50, bottom: 50, left: 50 });
      } else {
        map.setCenter(defaultDestination);
        map.setZoom(16);
      }
    }
  };

  return (
    <div className="w-full h-96 md:h-[500px] relative bg-white rounded-lg overflow-hidden">
      {isLoaded ? (
        <GoogleMap
          mapContainerStyle={containerStyle}
          center={center}
          zoom={16}
          onLoad={onLoad}
          onUnmount={onUnmount}
          options={{
            zoomControl: true,
            streetViewControl: true,
            mapTypeControl: true,
            fullscreenControl: true,
          }}
        >
          {/* User location marker (standard) */}
          {userLocation && (
            <Marker
              position={userLocation}
              label="You"
              icon={{
                url: "http://maps.google.com/mapfiles/ms/icons/blue-dot.png",
              }}
            />
          )}

          {/* Highlighted default destination marker */}
          <Marker
            position={defaultDestination}
            label="Dest"
            icon={{
              path: google.maps.SymbolPath.CIRCLE,
              fillColor: "#FF0000",
              fillOpacity: 1,
              strokeColor: "#FFFFFF",
              strokeWeight: 1,
              scale: 10,
            }}
          />

          {directions && <DirectionsRenderer directions={directions} />}
        </GoogleMap>
      ) : (
        <div className="flex items-center justify-center h-full">
          <p>Loading map...</p>
        </div>
      )}

      <div className="absolute bottom-4 left-4 z-10 flex gap-2">
        <button
          onClick={getCurrentLocation}
          className="bg-white hover:bg-gray-100 text-gray-800 font-semibold py-2 px-4 border border-gray-400 rounded shadow flex items-center"
          disabled={isLoading}
        >
          {isLoading ? (
            "Locating..."
          ) : (
            <>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 mr-2"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z"
                  clipRule="evenodd"
                />
              </svg>
              My Location
            </>
          )}
        </button>

        <button
          onClick={directions ? clearDirections : getDirectionsToDefault}
          className={`${
            directions
              ? "bg-red-500 hover:bg-red-600"
              : "bg-green-600 hover:bg-green-700"
          } text-white font-semibold py-2 px-4 rounded shadow flex items-center`}
          disabled={isLoading || !userLocation}
        >
          {directions ? (
            "Clear Directions"
          ) : (
            <>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 mr-2"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M12.586 4.586a2 2 0 112.828 2.828l-3 3a2 2 0 01-2.828 0 1 1 0 00-1.414 1.414 4 4 0 005.656 0l3-3a4 4 0 00-5.656-5.656l-1.5 1.5a1 1 0 101.414 1.414l1.5-1.5zm-5 5a2 2 0 012.828 0 1 1 0 101.414-1.414 4 4 0 00-5.656 0l-3 3a4 4 0 105.656 5.656l1.5-1.5a1 1 0 10-1.414-1.414l-1.5 1.5a2 2 0 11-2.828-2.828l3-3z"
                  clipRule="evenodd"
                />
              </svg>
              Get Directions
            </>
          )}
        </button>
      </div>
    </div>
  );
};
