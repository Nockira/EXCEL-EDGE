import React, { useEffect, useRef, useState } from "react";
import { GOOGLE_MAPS_API_KEY } from "../../services/service";
export const GoogleMapComponent = () => {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<google.maps.Map | null>(null);
  const latitude = -1.981369654753157;
  const longitude = 30.076084343666857;
  const [userLocation, setUserLocation] = useState<{
    lat: number;
    lng: number;
  } | null>(null);

  useEffect(() => {
    const loadGoogleMapsAPI = () => {
      const googleMapsApiKey = GOOGLE_MAPS_API_KEY;
      const script = document.createElement("script");
      script.src = `https://maps.googleapis.com/maps/api/js?key=${googleMapsApiKey}&libraries=places`;
      script.async = true;
      script.defer = true;
      script.onload = initializeMap;
      document.head.appendChild(script);
    };
    const initializeMap = () => {
      if (!mapRef.current) return;

      const mapOptions: google.maps.MapOptions = {
        center: { lat: latitude, lng: longitude },
        zoom: 16,
        mapTypeId: google.maps.MapTypeId.ROADMAP,
        mapTypeControl: true,
        streetViewControl: true,
        fullscreenControl: true,
      };

      const map = new google.maps.Map(mapRef.current, mapOptions);
      mapInstanceRef.current = map;
      const marker = new google.maps.Marker({
        position: { lat: latitude, lng: longitude },
        map: map,
        title: "42 KK 718 St, Kigali",
        animation: google.maps.Animation.DROP,
      });

      // Add an info window
      const infoWindow = new google.maps.InfoWindow({
        content: "<strong>42 KK 718 St, Kigali</strong>",
      });

      marker.addListener("click", () => {
        infoWindow.open(map, marker);
      });

      infoWindow.open(map, marker);
    };

    if (window.google && window.google.maps) {
      initializeMap();
    } else {
      loadGoogleMapsAPI();
    }
    return () => {
      mapInstanceRef.current = null;
    };
  }, [latitude, longitude]);

  const handleGetMyLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const userPos = {
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          };

          setUserLocation(userPos);

          if (mapInstanceRef.current) {
            new google.maps.Marker({
              position: userPos,
              map: mapInstanceRef.current,
              title: "Your Location",
              icon: {
                path: google.maps.SymbolPath.CIRCLE,
                scale: 8,
                fillColor: "#4285F4",
                fillOpacity: 1,
                strokeColor: "#FFFFFF",
                strokeWeight: 2,
              },
            });
            const bounds = new google.maps.LatLngBounds();
            bounds.extend({ lat: latitude, lng: longitude });
            bounds.extend(userPos);
            mapInstanceRef.current.fitBounds(bounds);
          }
        },
        (error) => {
          console.error("Error getting location: ", error);
          alert(
            "Unable to get your location. Please check your browser permissions."
          );
        }
      );
    } else {
      alert("Geolocation is not supported by this browser.");
    }
  };
  const handleGetDirections = () => {
    if (!userLocation) {
      alert("Please get your location first using the 'My Location' button.");
      return;
    }
    const destinationParam = `${latitude},${longitude}`;
    const originParam = `${userLocation.lat},${userLocation.lng}`;
    const url = `https://www.google.com/maps/dir/?api=1&origin=${originParam}&destination=${destinationParam}&travelmode=driving`;
    window.open(url, "_blank");
  };

  return (
    <div className="flex flex-col items-center w-full">
      <div
        ref={mapRef}
        id="map"
        className="w-full h-96 rounded-lg shadow-lg"
      ></div>
      <div className="relative flex space-x-4 -mt-12 z-10">
        <button
          onClick={handleGetMyLocation}
          className="bg-blue-500 hover:bg-blue-500 text-white font-bold py-2 px-4 rounded flex items-center"
        >
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
        </button>
        <button
          onClick={handleGetDirections}
          disabled={!userLocation}
          className={`${
            userLocation ? "text-[#fdc901] hover:text-[#fdc901]" : "bg-gray-400"
          } text-white font-bold py-2 px-4 rounded flex items-center`}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5 mr-2"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              fillRule="evenodd"
              d="M12.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-2.293-2.293a1 1 0 010-1.414z"
              clipRule="evenodd"
            />
          </svg>
          Get Directions
        </button>
      </div>
    </div>
  );
};
