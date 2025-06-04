import React from "react";
import styled from "styled-components";
import { Link } from "react-router-dom";

const FacilityCardContainer = styled.div`
  background-color: white;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  font-family: "Segoe UI", sans-serif;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
  }

  &:active {
    transform: scale(0.999);
  }
`;

const FacilityImage = styled.div`
  height: 180px;
  background-color: #ccc;
  position: relative;
`;

const FacilityImgTag = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
`;

const FacilityStatus = styled.span`
  position: absolute;
  top: 10px;
  right: 10px;
  padding: 0.25rem 0.5rem;
  border-radius: 4px;
  font-size: 0.8rem;
  font-weight: 600;
  color: #f8f9fa;
  background-color: ${({ $isOpen }) => ($isOpen ? "#27ae60" : "#e74c3c")};
`;

const FacilityContent = styled.div`
  padding: 1rem;
`;

const FacilityType = styled.span`
  display: inline-block;
  padding: 0.25rem 0.5rem;
  background-color: #eee;
  color: #555;
  border-radius: 4px;
  font-size: 0.8rem;
  margin-bottom: 0.5rem;
`;

const FacilityName = styled.h3`
  font-size: 1.25rem;
  font-weight: 700;
  margin-bottom: 0.5rem;
  color: #1a3064;
`;

const FacilityDetails = styled.div`
  margin-bottom: 1rem;
`;

const FacilityDetailsText = styled.p`
  color: #555;
  font-size: 0.9rem;
  margin-bottom: 0.25rem;
`;

const FacilityActions = styled.div`
  display: flex;
  justify-content: space-between;
`;

const FacilityBtn = styled.button`
  padding: 0.5rem 1rem;
  border: none;
  border-radius: 4px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
  background-color: ${({ color }) => color};
  color: white;

  &:hover {
    background-color: ${({ hoverColor }) => hoverColor};
  }

  &:active {
    background-color: white;
    color: ${({ color }) => color};
  }
`;

function FacilityCard({
  name,
  type,
  type2,
  type3,
  status,
  picture,
  location,
  opentime,
  closetime,
}) {
  const AndNeeded = (e) => {
    if (e) {
      return "&";
    } else {
      return "";
    }
  };
  return (
    <FacilityCardContainer data-type={type} data-status={status} id={name}>
      <FacilityImage>
        <FacilityImgTag src={picture} alt={name} />
        <FacilityStatus $isOpen={status === "Open"}>{status}</FacilityStatus>
      </FacilityImage>
      <FacilityContent>
        <FacilityType>
          {type} {AndNeeded(type2)} {type2} {AndNeeded(type3)} {type3}
        </FacilityType>
        <FacilityName>{name}</FacilityName>
        <FacilityDetails>
          <FacilityDetailsText>
            Hours: {opentime} - {closetime}
          </FacilityDetailsText>
          <FacilityDetailsText>Location: {location}</FacilityDetailsText>
        </FacilityDetails>
        <FacilityActions>
          <Link to={`/FacilityDetails`}>
            <FacilityBtn color="#1a3064" $hoverColor="#0f1e42" data-id={name}>
              View Details
            </FacilityBtn>
          </Link>
          <Link to={`/shopItems/${name}`}>
            <FacilityBtn color="#e67e22" $hoverColor="#d35400">
              Pre-order
            </FacilityBtn>
          </Link>
        </FacilityActions>
      </FacilityContent>
    </FacilityCardContainer>
  );
}

export default FacilityCard;
