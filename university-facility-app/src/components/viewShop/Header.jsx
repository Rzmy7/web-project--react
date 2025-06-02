// Header.js
import React from 'react';
import BackButton from "../../utils/Backbutton";
import { Star } from "lucide-react";
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

const Header = ({ facilityData }) => (
  <HeaderContainer>
    <BackButton />
    <FacilityImage src={facilityData.photo} alt={facilityData.name} />
    <FacilityName>{facilityData.name}</FacilityName>
    <StatusBadge isOpen={facilityData.isOpen}>
      <div style={{ width: "8px", height: "8px", borderRadius: "50%", backgroundColor: "currentColor" }} />
      {facilityData.currentStatus}
    </StatusBadge>
  </HeaderContainer>
);

export default Header;
