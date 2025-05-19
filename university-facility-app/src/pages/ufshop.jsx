import React from "react";
import styled from "styled-components";

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
  background-color: #27ae60;
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

const ShopPage = ({shopName,openingTime , closingTime , location}) => {
    if(openingTime>12){
        
    }
  return (
    <Shop>
      <ShopHeader className="shop-header">
        <BackButton id="backBtn" className="back-btn">
          Back to Home
        </BackButton>
        <ShopTitle className="shopTitle">
          <ShopNameMain id="shopNameMain" className="shopNameMain">
            {shopName}
          </ShopNameMain>
          <ShopStatus className="shopStatus status-open">open</ShopStatus>
        </ShopTitle>
        <ShopInfo className="shop-info">
          <ShopInfoItem className="shop-info-item">
            <span>Hours:</span>
            <span>7:00 AM - 8:00 PM</span>
          </ShopInfoItem>
          <ShopInfoItem className="shop-info-item location">
            <span>Location:</span>
            <span>Near Main Gate</span>
          </ShopInfoItem>
        </ShopInfo>
      </ShopHeader>
    </Shop>
  );
};

export default ShopPage;
