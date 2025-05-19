import React from "react";
import styled from "styled-components";
import { useNavigate } from 'react-router-dom';

const Shop = styled.div`
  margin: 2rem 0;
  border: 1px solid #f1f1f1;
  box-shadow: 0px 1px 3px rgba(0, 0, 0, 0.2);
  border-radius: 0.4rem;
`;

const ShopHeader = styled.div`
  background-color: rgba(0, 0, 0, 0);
  padding: 1.7rem;
  padding-bottom: 1.5rem;
  height: fit-content;
`;

const BackButton = styled.button`
  background: transparent;
  border: none;
  color: #1a3064;
  cursor: pointer;
  display: flex;
  align-items: center;
  margin-bottom: 1rem;
  font-weight: 650;
  font-size:small;

  &:before {
    content: "←";
    margin-right: 0.5rem;
  }

  &:hover {
    color: #120340;
  }

  &:active {
    color: #888;
  }
`;

const ShopTitle = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  color: #1a3064;
`;

const ShopNameMain = styled.span`
  font-size: 1.7rem;
  font-weight: 700;
  color: var#1a3064;
`;

const ShopStatus = styled.span`
  background-color: ${({ isOpen }) => (isOpen ? '#27ae60' : '#e74c3c')};
  color: #f8f9fa;
  padding: 0.3rem 0.6rem;
  font-size: 1rem;
  border-radius: 5px;
  font-weight: 500;
  box-shadow: 0px 1px 3px rgba(0, 0, 0, 0.2);
`;

const ShopInfo = styled.div`
  display: flex;
  width: fit-content;
  justify-content: space-between;
  margin-top: 0.9rem;
  color: #888;
`;

const ShopInfoItem = styled.div`
  span {
    margin-right: 0.5rem;
  }

  &.location {
    margin-left: 4rem;
  }
`;

function ShopPage ({shopName,status,openingTime , closingTime , location}) {

  const navigate = useNavigate();
  const handleBack = () => {
    navigate(-1); // Navigate back to the previous page
  };

  return (
    <Shop>
      <ShopHeader>
        <BackButton onClick={handleBack}>
          Back to Home
        </BackButton>
        <ShopTitle>
          <ShopNameMain >
            {shopName}
          </ShopNameMain>
          <ShopStatus isOpen={status === 'Open'} >{status}</ShopStatus>
        </ShopTitle>
        <ShopInfo >
          <ShopInfoItem >
            <span>Hours:</span>
            <span>{openingTime} - {closingTime}</span>
          </ShopInfoItem>
          <ShopInfoItem className="location">
            <span>Location:</span>
            <span>{location}</span>
          </ShopInfoItem>
        </ShopInfo>
      </ShopHeader>
    </Shop>
  );
};

export default ShopPage;
