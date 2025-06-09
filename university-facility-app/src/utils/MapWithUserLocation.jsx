// MapWithUserLocation.js
import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import styled from 'styled-components';
import UserPic from "../assets/pngtree-red-location-mark-png-image_13005399.png"

// Fix default marker icons
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl:
    'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl:
    'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

const userIcon = new L.Icon({
  iconUrl: UserPic,
  iconSize: [45, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowUrl:
    'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
  shadowSize: [41, 41],
});


const MapWrapper = styled.div`
  width: 100%;
  height: 100%;
  border-radius: 8px;
  overflow: hidden;
  margin-top: 1rem;
`;

const FlyToUser = ({ userLocation }) => {
  const map = useMap();
  useEffect(() => {
    if (userLocation) {
      map.flyTo(userLocation, 17);
    }
  }, [userLocation, map]);
  return null;
};

const MapWithUserLocation = ({ places = [] }) => {
  const [userLocation, setUserLocation] = useState(null);

  useEffect(() => {
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const { latitude, longitude } = pos.coords;
        setUserLocation([latitude, longitude]);
      },
      (err) => {
        console.error("GPS error:", err);
        // fallback location if user blocks permission
        setUserLocation([6.797549, 79.900334]); // Colombo
      }
    );
  }, []);

  const defaultCenter = [6.796857, 79.901053]; // fallback

  return (
    <MapWrapper>
      <MapContainer
        center={ defaultCenter} //center={userLocation || defaultCenter}
        zoom={3}
        scrollWheelZoom
        style={{ height: '100%', width: '100%' }}
      >
        <TileLayer
          attribution='&copy; OpenStreetMap contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        {/* Your own location */}
        {userLocation && (
  <>
    <Marker position={userLocation} icon={userIcon}>
      <Popup>You are here</Popup>
    </Marker>
    <FlyToUser userLocation={defaultCenter} />
  </>
)}


        {/* Other places */}
        {places.map((place, idx) => (
          <Marker key={idx} position={[place.lat, place.lng]}>
            <Popup>
              <strong>{place.name}</strong>
              <br />
              {place.description || ''}
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </MapWrapper>
  );
};

export default MapWithUserLocation;
