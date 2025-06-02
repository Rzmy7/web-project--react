import styled from "styled-components";
import React, { useState } from "react";
import "../index.css";
import Facilities from "../components/Facilities";
import SearchBar from "../components/Searchbar";
import ShopPage from "../pages/ufshop";

const HeroSection = styled.div`
  background-image: linear-gradient(rgba(0, 0, 0, 0.7), rgba(0, 0, 0, 0.5)),
    url("https://codl.lk/wp-content/uploads/2023/12/Screenshot-2023-12-28-104003-1-1536x483.png");
  background-size: cover;
  background-position: center;
  color: var(--secondary-color);
  text-align: center;
  padding: 3.5rem 1rem;
  border-radius: 8px;
  margin: 2rem auto;
  width: 100%;
  min-width: 300px;
  position: relative;
  border: 1px solid black;
`;

const HeroHeading = styled.h2`
  font-size: 2.5rem;
  margin-bottom: 1rem;
  font-weight: bold;
  color: var(--secondary-color);
`;

const HeroInfo = styled.p`
  font-size: 1.1rem;
  max-width: 700px;
  margin: 0 auto 1.5rem;
  color: var(--secondary-color);
`;

const FindFacBtn = styled.a`
  display: inline-block;
  background-color: var(--accent-color);
  color: white;
  padding: 0.75rem 1.5rem;
  border-radius: 4px;
  font-weight: 500;
  transition: var(--transition);
  text-decoration: none;
  &:hover {
    background-color: var(--hover-accent-color);
  }
`;

function UOMFacHome() {
  const [facilityType, setFacilityType] = useState("all");
  const [status, setStatus] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  return (
    <div style={{ width: "100%", margin: "0 auto", display: "flex", flexDirection: "column" }}>
      <div
        style={{
          width: "100%",
          height: "fit-content",
          display: "flex",
          justifySelf: "center",
        }}
      >
        <HeroSection>
          <HeroHeading>Your University Facilities at a Glance</HeroHeading>
          <HeroInfo>
            Real-time information about canteens, juice bars, and book shops at
            the University of Moratuwa. Check what's open, see menus, and
            pre-order items.
          </HeroInfo>
          <FindFacBtn href="#facilityGrid">Find a Facility</FindFacBtn>
        </HeroSection>
      </div>

      <SearchBar
        facilityType={facilityType}
        setFacilityType={setFacilityType}
        status={status}
        setStatus={setStatus}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
      />
      <div id="facilityGrid">
        <Facilities
          facilityType={facilityType}
          status={status}
          searchQuery={searchQuery}
        />
      </div>
      {/* <ShopPage shopName='Wala Canteen' status='Open' openingTime='7.00AM'  closingTime='6.00PM' location='Near here' /> */}
    </div>
  );
}

export default UOMFacHome;
