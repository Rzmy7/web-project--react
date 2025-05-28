import React from "react";
import styled from "styled-components";
import { useNavigate } from "react-router-dom";
import TabNavigationComponent from "../components/shopMenuBar";

const Shop = styled.div`
  margin: 2rem 0;
  border: 1px solid var(--light-gray);
  box-shadow: 0px 1px 3px rgba(0, 0, 0, 0.2);
  border-radius: 0.4rem;
  padding: 1rem 1.7rem;

  @media (max-width: 768px) {
    padding: 0.6rem 1.1rem;
  }
`;

const ShopHeader = styled.div`
  background-color: var(--secondary-color);
  padding-bottom: 1.5rem;
  height: fit-content;
`;

const BackButton = styled.button`
  background: transparent;
  border: none;
  color: var(--primary-color);
  cursor: pointer;
  display: flex;
  align-items: center;
  margin-bottom: 1.7rem;
  font-weight: 650;
  font-size: small;

  &:before {
    content: "←";
    margin-right: 0.5rem;
  }

  &:hover {
    color: var(--hover-accent-color);
  }

  &:active {
    color: var(--dark-gray);
  }
`;

const ShopTitle = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  color: var(--primary-color);
`;

const ShopNameMain = styled.span`
  font-size: 1.7rem;
  font-weight: 700;
  color: var(--primary-color);
`;

const ShopStatus = styled.span`
  background-color: ${({ isOpen }) =>
    isOpen ? "var(--success)" : "var(--danger)"};
  color: var(--secondary-color);
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
  color: var(--dark-gray);

  @media (max-width: 768px) {
    flex-direction: column;
  }
`;

const ShopInfoItem = styled.div`
  span {
    margin-right: 0.5rem;
  }

  &.location {
    margin-left: 4rem;

    @media (max-width: 768px) {
      margin: 0.5rem 0;
    }
  }
`;

function ShopPage({ shopName, status, openingTime, closingTime, location }) {
  const navigate = useNavigate();
  const handleBack = () => {
    navigate(-1); // Navigate back to the previous page
  };

  return (
    <div
      style={{
        width: "100%",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
      }}
    >
      <Shop>
        <ShopHeader>
          <BackButton onClick={handleBack}>Back to Home</BackButton>
          <ShopTitle>
            <ShopNameMain>{shopName}</ShopNameMain>
            <ShopStatus isOpen={status === "Open"}>{status}</ShopStatus>
          </ShopTitle>
          <ShopInfo>
            <ShopInfoItem>
              <span>Hours:</span>
              <span>
                {openingTime} - {closingTime}
              </span>
            </ShopInfoItem>
            <ShopInfoItem className="location">
              <span>Location:</span>
              <span>{location}</span>
            </ShopInfoItem>
          </ShopInfo>
        </ShopHeader>
        <TabNavigationComponent />
      </Shop>
    </div>
  );
}

export default ShopPage;
