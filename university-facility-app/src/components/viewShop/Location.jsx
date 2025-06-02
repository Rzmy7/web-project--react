import React from 'react';
import styled from "styled-components";
import { MapPin, User } from "lucide-react";
import FacilityLiveMap from "./FacilityMap";

// Styled components
const MapContainer = styled.div`
  width: 100%;
  height: 200px;
  background: var(--light-gray);
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--dark-gray);
  margin-top: 12px;
`;

const OwnerInfo = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px;
  background: var(--light-gray);
  border-radius: 8px;
`;

// Location Component
const Location = ({ facilityData }) => {
  // Check if facilityData and coordinates are defined
  if (!facilityData || !facilityData.coordinates) {
    return <p>Location data is not available.</p>;
  }

  return (
    <div style={{borderRadius:"12px" , backgroundColor:"white", padding:"1rem",boxShadow:"1px 1px 3px 1px rgba(0,0,0,0.1)"}}>
      <h3>
        <MapPin size={20} />
        Location & Contact
      </h3>
      <p>{facilityData.location}</p>
      <MapContainer>
        <FacilityLiveMap 
          lat={facilityData.coordinates.lat} 
          lng={facilityData.coordinates.lng} 
          zoom={17} 
        />
      </MapContainer>
      <OwnerInfo>
        <User  size={20} />
        <div>
          <div>Shop Owner</div>
          <div>{facilityData.ownerName}</div>
        </div>
      </OwnerInfo>
    </div>
  );
};

export default Location;
