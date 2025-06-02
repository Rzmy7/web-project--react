// Header.js
import React from 'react';
import BackButton from "../../utils/Backbutton";
import { AlertCircle } from "lucide-react";
import styled from "styled-components";

const HeaderContainer = styled.div`
  background: white;
  border-radius: 12px;
  padding: 24px;
  margin-bottom: 24px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
`;

const FacilityImage = styled.img`
  width: 100%;
  height: 300px;
  object-fit: cover;
  border-radius: 8px;
  margin-bottom: 20px;
`;

const FacilityName = styled.h1`
  font-size: 2.5rem;
  margin: 0 0 12px 0;
  color: var(--primary-color);
  font-weight: 700;
`;

const StatusBadge = styled.div`
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 8px 16px;
  border-radius: 20px;
  font-weight: 600;
  font-size: 0.9rem;
  background-color: ${(props) => (props.isOpen ? "var(--success)" : "var(--danger)")};
  color: white;
  margin-bottom: 16px;
`;

const SpecialNotice = styled.div`
  background: linear-gradient(
    135deg,
    var(--accent-color),
    var(--hover-accent-color)
  );
  color: white;
  padding: 16px;
  border-radius: 8px;
  margin: 16px 0;
  font-weight: 500;
`;

const Header = ({ facilityData }) => (
  <HeaderContainer>
    <BackButton />
    <FacilityImage src={facilityData.photo} alt={facilityData.name} />
    <FacilityName>{facilityData.name}</FacilityName>
    <StatusBadge isOpen={facilityData.isOpen}>
      <div style={{ width: "8px", height: "8px", borderRadius: "50%", backgroundColor: "currentColor" }} />
      {facilityData.currentStatus}
    </StatusBadge>
    {facilityData.specialNotice && (
          <SpecialNotice>
            <AlertCircle
              size={16}
              style={{ display: "inline", marginRight: "8px" }}
            />
            {facilityData.specialNotice}
          </SpecialNotice>
        )}
  </HeaderContainer>
);

export default Header;
