import React, { useEffect, useState } from "react";
import styled from "styled-components";
import FacilityCard from "./FacilityCard";
import { io } from "socket.io-client";

const FacilitiesContainer = styled.div`
  width: 100%;
`;

const FacilitiesGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 1.5rem;
  margin-bottom: 2rem;
  width: 100%;
`;

function Facilities({ facilityType, status, searchQuery }) {
  const [facilities, setFacilities] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Initial fetch
    fetch("http://127.0.0.1:8001/api/data")
      .then((res) => res.json())
      .then((data) => {
        setFacilities(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching facilities:", err);
        setLoading(false);
      });
  }, []);

  useEffect(() => {
    // Set up Socket.IO
    const socket = io("http://127.0.0.1:8001"); // Your Flask-SocketIO server address

    socket.on("connect", () => {
      console.log("Connected to Socket.IO server");
    });

    // Listen for real-time updates
    socket.on("new_entry", (data) => {
      console.log("New entry received:", data);
      // Update state with new data
      setFacilities((prevFacilities) => [...prevFacilities, data]);
    });

    // Listen for full data updates (if you want to replace the entire list)
    socket.on("shop_data", (updatedData) => {
      console.log("Received full data update:", updatedData);
      setFacilities(updatedData);
    });
    return () => {
      socket.disconnect();
    };
  }, []);

  const filteredFacilities = facilities.filter((facility) => {
    const matchesType =
      facilityType === "all" ||
      (facility.type &&
        facility.type.toLowerCase().includes(facilityType.toLowerCase())) ||
      (facility.type2 &&
        facility.type2.toLowerCase().includes(facilityType.toLowerCase())) ||
      (facility.type3 &&
        facility.type3.toLowerCase().includes(facilityType.toLowerCase()));

    const matchesStatus =
      status === "all" ||
      facility.status?.toLowerCase() === status.toLowerCase();

    const matchesQuery =
      searchQuery === "" ||
      (facility.name &&
        facility.name.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (facility.type &&
        facility.type.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (facility.location &&
        facility.location.toLowerCase().includes(searchQuery.toLowerCase()));

    return matchesType && matchesStatus && matchesQuery;
  });

  if (loading) {
    return <p>Loading facilities...</p>;
  }

  return (
    <FacilitiesContainer>
      <FacilitiesGrid>
        {filteredFacilities.map((f, index) => (
          <FacilityCard key={f.shopid || index} {...f} />
        ))}
      </FacilitiesGrid>
    </FacilitiesContainer>
  );
}

export default Facilities;
