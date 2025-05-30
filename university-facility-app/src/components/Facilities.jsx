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


  // useEffect(() => {
  //   const cachedData = sessionStorage.getItem("facilities");

  //   if (cachedData) {
  //     try {
  //       const parsed = JSON.parse(cachedData);
  //       setFacilities(parsed);
  //       setLoading(false); // Use cached data, don't fetch
  //       console.log("Loaded facilities from cache");
  //       return;
  //     } catch (e) {
  //       console.error("Error parsing cache:", e);
  //     }
  //   }

  //   // If no cache, fetch from server
  //   fetch("http://127.0.0.1:8001/api/data")
  //     .then((res) => res.json())
  //     .then((data) => {
  //       setFacilities(data);
  //       sessionStorage.setItem("facilities", JSON.stringify(data));
  //     })
  //     .catch((err) => {
  //       console.error("Error fetching facilities:", err);
  //     })
  //     .finally(() => {
  //       setLoading(false);
  //     });
  // }, []);

  // // Real-time updates with Socket.IO
  // useEffect(() => {
  //   const socket = io("http://127.0.0.1:8001");

  //   socket.on("connect", () => {
  //     console.log("Connected to Socket.IO server");
  //   });

  //   socket.on("new_entry", (data) => {
  //     setFacilities((prev) => {
  //       const updated = [...prev, data];
  //       sessionStorage.setItem("facilities", JSON.stringify(updated));
  //       return updated;
  //     });
  //   });

  //   socket.on("shop_data", (updatedData) => {
  //     setFacilities(updatedData);
  //     sessionStorage.setItem("facilities", JSON.stringify(updatedData));
  //   });

  //   socket.on("entry_deleted", (deletedId) => {
  //     setFacilities((prev) => {
  //       const updated = prev.filter((item) => item.id !== deletedId);
  //       sessionStorage.setItem("facilities", JSON.stringify(updated));
  //       return updated;
  //     });
  //   });

  //   socket.on("entry_updated", (updatedItem) => {
  //     setFacilities((prev) => {
  //       const updated = prev.map((item) =>
  //         item.id === updatedItem.id ? updatedItem : item
  //       );
  //       sessionStorage.setItem("facilities", JSON.stringify(updated));
  //       return updated;
  //     });
  //   });
    // Clean up on unmount
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
