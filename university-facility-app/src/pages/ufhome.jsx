import styled from "styled-components";
import React, { useState,useEffect } from "react";
import "../index.css";
import Facilities from "../components/Facilities";
import SearchBar from "../components/Searchbar";
import MapWithUserLocation from "../utils/MapWithUserLocation";

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

const MapContainer = styled.div`
  padding: 1.2rem;
  padding-bottom: 2rem;
  border: 2px solid var(--light-gray);
  width: 100%;
  aspect-ratio: 30/9;
  min-height: 300px;
  margin-bottom: 2rem;
`;

function UOMFacHome() {
  const [facilityType, setFacilityType] = useState("all");
  const [status, setStatus] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");

  const [places, setPlaces] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetch('http://127.0.0.1:8001/api/places')  // Your Flask endpoint
      .then((response) => {
        if (!response.ok) {
          throw new Error(`HTTP error: ${response.status}`);
        }
        return response.json();
      })
      .then((data) => {
        setPlaces(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error('Failed to fetch places:', err);
        setError(err.message);
        setLoading(false);
      });
  }, []);

  if (loading) return <p>Loading places...</p>;
  if (error) return <p>Error: {error}</p>;

  // const places = [
  //   {
  //     name: "Central Canteen",
  //     lat: 6.7973,
  //     lng: 79.9018,
  //     description: "Main dining area",
  //   },
  //   {
  //     name: "Library Café",
  //     lat: 6.7985,
  //     lng: 79.9022,
  //     description: "Quick snacks",
  //   },
  // ];

  return (
    <div
      style={{
        width: "100%",
        margin: "0 auto",
        display: "flex",
        flexDirection: "column",
      }}
    >
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
      <div style={{ scrollMarginTop: "7rem" }} id="facilityGrid">
        <Facilities
          facilityType={facilityType}
          status={status}
          searchQuery={searchQuery}
        />
      </div>
      <MapContainer>
        <MapWithUserLocation places={places} />
      </MapContainer>
    </div>
  );
}

export default UOMFacHome;
