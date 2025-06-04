import React, { useState, useEffect } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

// Fix default marker icons (optional fallback)
import markerIcon2x from "leaflet/dist/images/marker-icon-2x.png";
import markerIcon from "leaflet/dist/images/marker-icon.png";
import markerShadow from "leaflet/dist/images/marker-shadow.png";
import UserPic from "../../assets/location-icon-png-4250.png"

L.Icon.Default.mergeOptions({
  iconRetinaUrl: markerIcon2x,
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
});

// ✅ Custom Icons
const facilityIcon = new L.Icon({
  iconUrl: "https://cdn-icons-png.flaticon.com/512/684/684908.png", // facility icon
  iconSize: [30, 30],
  iconAnchor: [15, 30],
  popupAnchor: [0, -30],
});

const userIcon = new L.Icon({
  iconUrl: UserPic, // user icon
  iconSize: [30, 30],
  iconAnchor: [15, 30],
  popupAnchor: [0, -30],
});

// ✅ Fly to user when location is found
const FlyToLocation = ({ position }) => {
  const map = useMap();
  useEffect(() => {
    if (position) {
      map.flyTo(position, 17); // Adjust zoom level
    }
  }, [position, map]);
  return null;
};

const FacilityLiveMap = ({ lat, lng, zoom = 17 }) => {
  const [userLocation, setUserLocation] = useState(null);

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          setUserLocation({
            lat: pos.coords.latitude,
            lng: pos.coords.longitude,
          });
        },
        (err) => {
          console.error("Geolocation error:", err.message);
        }
      );
    }
  }, []);

  return (
    <div style={{ height: "100%", width: "100%", borderRadius: "10px", overflow: "hidden" }}>
      <MapContainer center={[lat, lng]} zoom={zoom} style={{ height: "100%", width: "100%" }}>
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://openstreetmap.org">OpenStreetMap</a> contributors'
        />

        {/* Facility Marker with custom icon */}
        <Marker position={[lat, lng]} icon={facilityIcon}>
          <Popup>📍 Facility Location</Popup>
        </Marker>

        {/* User Location Marker with fly-to */}
        {userLocation && (
          <>
            <FlyToLocation position={[userLocation.lat, userLocation.lng]} />
            <Marker position={[userLocation.lat, userLocation.lng]} icon={userIcon}>
              <Popup>🧍 Your Location</Popup>
            </Marker>
          </>
        )}
      </MapContainer>
    </div>
  );
};

export default FacilityLiveMap;
