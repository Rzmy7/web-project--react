
// // FacilityDetails.js
// import React from "react";
// import Header from "../components/viewShop/Header";
// import WeeklySchedule from "../components/viewShop/WeeklySchedule";
// import Location from "../components/viewShop/Location";
// import ReviewsSection from "../components/viewShop/ReviewSection";
// import styled from "styled-components";

// const Container = styled.div`
//   max-width: 1800px;
//   width: 100%;
//   margin: 0 auto;
//   padding: 20px;
//   font-family: "Segoe UI", Tahoma, Geneva, Verdana, sans-serif;
//   color: var(--text-color);
//   background-color: var(--secondary-color);
//   min-height: 100vh;
//   display: grid;
//   align-items: stretch;
//   grid-template-areas:
//     "header header"
//     "schedule location"
//     "reviews reviews"
//     "details details";
//   gap: 1rem;

//   @media (max-width: 768px) {
//     grid-template-areas:
//       "header "
//       "schedule"
//       " location"
//       "reviews "
//       "details ";
//   }
// `;

// const HeaderArea = styled.div`
//   grid-area: header;
// `;

// const ScheduleArea = styled.div`
//   grid-area: schedule;
// `;

// const LocationArea = styled.div`
//   grid-area: location;
// `;

// const ReviewsArea = styled.div`
//   grid-area: reviews;
// `;

// const DetailsArea = styled.div`
//   grid-area: details;
// `;

// const FacilityDetails = () => {
//   const facilityData = {
//     id: 1,
//     name: "Central Canteen",
//     photo:
//       "https://images.unsplash.com/photo-1567521464027-f127ff144326?w=800&h=400&fit=crop",
//     isOpen: true,
//     currentStatus: "Open until 8:00 PM",
//     weeklySchedule: [
//       { day: "Monday", hours: "7:00 AM - 8:00 PM", isOpen: true },
//       { day: "Tuesday", hours: "7:00 AM - 8:00 PM", isOpen: true },
//       { day: "Wednesday", hours: "7:00 AM - 8:00 PM", isOpen: true },
//       { day: "Thursday", hours: "7:00 AM - 8:00 PM", isOpen: true },
//       { day: "Friday", hours: "7:00 AM - 6:00 PM", isOpen: true },
//       { day: "Saturday", hours: "9:00 AM - 4:00 PM", isOpen: true },
//       { day: "Sunday", hours: "Closed", isOpen: false },
//     ],
//     specialNotice:
//       "🎉 New menu items available! Try our signature pasta and fresh salads.",
//     location: "Building A, Ground Floor, Room 101",
//     coordinates: { lat: 6.797307, lng: 79.901778 },
//     ownerName: "Sarah Chen",
//     rating: 4.2,
//     totalReviews: 156,
//     reviews: [
//       {
//         id: 1,
//         userName: "Alex Wong",
//         rating: 5,
//         comment: "Great food and friendly staff! The chicken rice is amazing.",
//         date: "2 days ago",
//       },
//       {
//         id: 2,
//         userName: "Maria Santos",
//         rating: 4,
//         comment:
//           "Good variety of food options. Sometimes gets crowded during lunch hours.",
//         date: "1 week ago",
//       },
//       {
//         id: 3,
//         userName: "David Lim",
//         rating: 4,
//         comment:
//           "Fresh ingredients and reasonable prices. The laksa is my favorite!",
//         date: "2 weeks ago",
//       },
//     ],
//   };

//   return (
//     <Container>
//       <HeaderArea>
//         <Header facilityData={facilityData} />
//       </HeaderArea>

//       <ScheduleArea>
//         <WeeklySchedule schedule={facilityData.weeklySchedule} />
//       </ScheduleArea>

//       <LocationArea>
//         <Location facilityData={facilityData} />
//       </LocationArea>

//       <ReviewsArea>
//         <ReviewsSection rating={facilityData.rating} totalReviews={facilityData.totalReviews} reviews={facilityData.reviews} />
//       </ReviewsArea>

//     </Container>
//   );
// };

// export default FacilityDetails;


// FacilityDetails.js
import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import Header from "../components/viewShop/Header";
import WeeklySchedule from "../components/viewShop/WeeklySchedule";
import Location from "../components/viewShop/Location";
import ReviewsSection from "../components/viewShop/ReviewSection";
import styled from "styled-components";

const Container = styled.div`
  max-width: 1800px;
  width: 100%;
  margin: 0 auto;
  padding: 20px;
  font-family: "Segoe UI", Tahoma, Geneva, Verdana, sans-serif;
  color: var(--text-color);
  background-color: var(--secondary-color);
  min-height: 100vh;
  display: grid;
  align-items: stretch;
  grid-template-areas:
    "header header"
    "schedule location"
    "reviews reviews"
    "details details";
  gap: 1rem;

  @media (max-width: 768px) {
    grid-template-areas:
      "header "
      "schedule"
      " location"
      "reviews "
      "details ";
  }
`;

const HeaderArea = styled.div`
  grid-area: header;
`;

const ScheduleArea = styled.div`
  grid-area: schedule;
`;

const LocationArea = styled.div`
  grid-area: location;
`;

const ReviewsArea = styled.div`
  grid-area: reviews;
`;

const DetailsArea = styled.div`
  grid-area: details;
`;

const FacilityDetails = () => {
  const { facilityId } = useParams();
  const [facilityData, setFacilityData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchFacilityData = async () => {
      try {
        const response = await fetch(`http://127.0.0.1:8001/api/facility/${facilityId}`);
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        setFacilityData(data);
      } catch (error) {
        setError(error);
      } finally {
        setLoading(false);
      }
    };

    fetchFacilityData();
  }, [facilityId]);

  if (loading) {
    return <p>Loading facility details...</p>;
  }

  if (error) {
    return <p>Error loading facility details: {error.message}</p>;
  }

  if (!facilityData) {
    return <p>No facility data found.</p>;
  }

  // Use optional chaining and default to empty arrays/null if data is missing
  // const reviews = facilityData.reviews ?? [];
  // const weeklySchedule = facilityData.weeklySchedule ?? [];
  // const specialNotice = facilityData.specialNotice ?? null;

  return (
    <Container>
      <HeaderArea>
        <Header facilityData={facilityData} />
      </HeaderArea>

      <ScheduleArea>
        <WeeklySchedule schedule={facilityData.weeklySchedule} />
      </ScheduleArea>

      <LocationArea>
        <Location facilityData={facilityData} />
      </LocationArea>

      <ReviewsArea>
        <ReviewsSection facilityId={facilityId} reviews={facilityData.reviews} />
      </ReviewsArea>

    </Container>
  );
};

export default FacilityDetails;