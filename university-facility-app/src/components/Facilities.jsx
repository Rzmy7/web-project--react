// import React from "react";
// import styled from "styled-components";
// import FacilityCard from "./FacilityCard";

// const FacilitiesContainer = styled.div`
//   width: 100%;
// `;

// const FacilitiesGrid = styled.div`
//   display: grid;
//   grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
//   gap: 1.5rem;
//   margin-bottom: 2rem;
//   width: 100%;
// `;

// function Facilities({ facilityType, status, searchQuery }) {
//   const facilities = [
//     {
//       name: "Godayata",
//       type: "Canteen",
//       type2: "",
//       type3: "",
//       status: "Open",
//       picture:
//         "https://kairosinternationalschool.com/wp-content/uploads/2023/06/WhatsApp-Image-2023-06-12-at-2.31.20-PM-1.jpeg",
//       location: "Near Main Gate",
//       openTime: "7.00",
//       closeTime: "7.00",
//     },
//     {
//       name: "Civil",
//       type: "Canteen",
//       type3: "",
//       type2: "Juice Bar",
//       status: "Open",
//       picture:
//         "https://kairosinternationalschool.com/wp-content/uploads/2023/06/WhatsApp-Image-2023-06-12-at-2.31.20-PM-1.jpeg",
//       location: "Near Main Gate",
//       openTime: "7.00",
//       closeTime: "7.00",
//     },
//     {
//       name: "L",
//       type: "Canteen",
//       type2: "",
//       type3: "",
//       status: "Open",
//       picture:
//         "https://kairosinternationalschool.com/wp-content/uploads/2023/06/WhatsApp-Image-2023-06-12-at-2.31.20-PM-1.jpeg",
//       location: "Near Main Gate",
//       openTime: "7.00",
//       closeTime: "7.00",
//     },
//     {
//       name: "GodaUda",
//       type: "Canteen",
//       type2: "Juice Bar",
//       type3: "",
//       status: "Open",
//       picture:
//         "https://kairosinternationalschool.com/wp-content/uploads/2023/06/WhatsApp-Image-2023-06-12-at-2.31.20-PM-1.jpeg",
//       location: "Near Main Gate",
//       openTime: "7.00",
//       closeTime: "7.00",
//     },
//     {
//       name: "Wala",
//       type: "Canteen",
//       type2: "",
//       type3: "",
//       status: "Closed",
//       picture:
//         "https://lh3.googleusercontent.com/gps-cs-s/AC9h4no87lWMi4Rg15JFx3TWzlZbJqiNwntWCzUMQi7ZJftoAwi4W7nJ8b87Ma0bBPYHrqRXFe0lf9jcMsjjXWPiLZEoTdRT1orNVpKJwOZNmBlE6YtJgLl5awnqR6aiD5pYT8WAfzxU=s1360-w1360-h1020-rw",
//       location: "Near Main Gate",
//       openTime: "7.00",
//       closeTime: "7.00",
//     },
//   ];

//   const filteredFacilities = facilities.filter((facility) => {
//     const matchesType =
//       facilityType === "all" ||
//       facility.type.toLowerCase().includes(facilityType.toLowerCase()) ||
//       facility.type2.toLowerCase().includes(facilityType.toLowerCase());
//     const matchesStatus =
//       status === "all" ||
//       facility.status.toLowerCase() === status.toLowerCase();
//     const matchesQuery =
//       searchQuery === "" ||
//       facility.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
//       facility.type.toLowerCase().includes(searchQuery.toLowerCase()) ||
//       facility.location.toLowerCase().includes(searchQuery.toLowerCase());

//     return matchesType && matchesStatus && matchesQuery;
//   });

//   return (
//     <FacilitiesContainer>
//       <FacilitiesGrid>
//         {filteredFacilities.map((f) => (
//           <FacilityCard key={f.name} {...f} />
//         ))}
//       </FacilitiesGrid>
//     </FacilitiesContainer>
//   );
// }

// export default Facilities;


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

    // Clean up on unmount
    return () => {
      socket.disconnect();
    };
  }, []);

  const filteredFacilities = facilities.filter((facility) => {
    const matchesType =
      facilityType === "all" ||
      (facility.type && facility.type.toLowerCase().includes(facilityType.toLowerCase())) ||
      (facility.type2 && facility.type2.toLowerCase().includes(facilityType.toLowerCase())) ||
      (facility.type3 && facility.type3.toLowerCase().includes(facilityType.toLowerCase()));

    const matchesStatus =
      status === "all" || facility.status?.toLowerCase() === status.toLowerCase();

    const matchesQuery =
      searchQuery === "" ||
      (facility.name && facility.name.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (facility.type && facility.type.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (facility.location && facility.location.toLowerCase().includes(searchQuery.toLowerCase()));

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
