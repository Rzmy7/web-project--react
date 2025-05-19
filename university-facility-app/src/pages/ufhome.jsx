import styled from "styled-components";
import React, { useState } from 'react';
import "../index.css";
import Facilities from "../components/Facilities";
import SearchBar from "../components/Searchbar";
import ShopPage from "../pages/ufshop"

const HeroSection = styled.div`
  background-image: linear-gradient(rgba(0, 0, 0, 0.7), rgba(0, 0, 0, 0.5)),
    url("https://codl.lk/wp-content/uploads/2023/12/Screenshot-2023-12-28-104003-1-1536x483.png");
  background-size: cover;
  background-position: center;
  color: white;
  text-align: center;
  padding: 3.5rem 1rem;
  border-radius: 8px;
  margin-top: 2rem;
  margin-bottom: 2rem;
  width: 100%; 
  min-width: 80vw;
`;

const HeroHeading = styled.h2`
  font-size: 2.5rem;
  margin-bottom: 1rem;
  font-weight: bold;
`;

const HeroInfo = styled.p`
  font-size: 1.1rem;
  max-width: 700px;
  margin: 0 auto 1.5rem;
`;

const FindFacBtn = styled.a`
  display: inline-block;
  background-color: #e67e22;
  color: white;
  padding: 0.75rem 1.5rem;
  border-radius: 4px;
  font-weight: 500;
  transition: background-color 0.3s ease;
`;

function UOMFacHome() {
    const [facilityType, setFacilityType] = useState('all');
  const [status, setStatus] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  return (
    <div style={{ width: "100%", margin: "0 auto" }}>
      <HeroSection>
        <HeroHeading>Your University Facilities at a Glance</HeroHeading>
        <HeroInfo>
          Real-time information about canteens, juice bars, and book shops at
          the University of Moratuwa. Check what's open, see menus, and
          pre-order items.
        </HeroInfo>
        <FindFacBtn href="#facilityGrid">Find a Facility</FindFacBtn>
      </HeroSection>
      {/* <SearchBar/> */}
      {/* <div id="facilityGrid">
        {" "}
        <Facilities />{" "}
      </div> */}
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
      </div>);
}

export default UOMFacHome;




// import React, { useState } from 'react';
// import styled from 'styled-components';
// import SearchBar from './Searchbar';
// import Facilities from './Facilities';

// const HeroSection = styled.div`
//   background-image: linear-gradient(rgba(0, 0, 0, 0.7), rgba(0, 0, 0, 0.5)),
//     url("https://codl.lk/wp-content/uploads/2023/12/Screenshot-2023-12-28-104003-1-1536x483.png");
//   background-size: cover;
//   background-position: center;
//   color: white;
//   text-align: center;
//   padding: 3.5rem 1rem;
//   border-radius: 8px;
//   margin-top: 2rem;
//   margin-bottom: 2rem;
//   width: 100%;
//   min-width: 80vw;
//   font-family: "Old English Five", sans-serif;
// `;

// const HeroHeading = styled.h2`
//   font-size: 2.5rem;
//   margin-bottom: 1rem;
//   font-weight: bold;
// `;

// const HeroInfo = styled.p`
//   font-size: 1.1rem;
//   max-width: 700px;
//   margin: 0 auto 1.5rem;
// `;

// const FindFacBtn = styled.a`
//   display: inline-block;
//   background-color: #e67e22;
//   color: white;
//   padding: 0.75rem 1.5rem;
//   border-radius: 4px;
//   font-weight: 500;
//   transition: background-color 0.3s ease;
//   text-decoration: none;

//   &:hover {
//     background-color: #d35400;
//   }
// `;

// const Container = styled.div`
//   width: 100%;
//   max-width: 1200px;
//   margin: 0 auto;
//   padding: 0 1rem;
// `;

// function UOMFacHome() {
//   const [facilityType, setFacilityType] = useState('all');
//   const [status, setStatus] = useState('all');
//   const [searchQuery, setSearchQuery] = useState('');

//   return (
//     <Container>
//       <HeroSection>
//         <HeroHeading>Your University Facilities at a Glance</HeroHeading>
//         <HeroInfo>
//           Real-time information about canteens, juice bars, and book shops at
//           the University of Moratuwa. Check what's open, see menus, and
//           pre-order items.
//         </HeroInfo>
//         <FindFacBtn href="#facilityGrid">Find a Facility</FindFacBtn>
//       </HeroSection>
//       <SearchBar
//         facilityType={facilityType}
//         setFacilityType={setFacilityType}
//         status={status}
//         setStatus={setStatus}
//         searchQuery={searchQuery}
//         setSearchQuery={setSearchQuery}
//       />
//       <div id="facilityGrid">
//         <Facilities
//           facilityType={facilityType}
//           status={status}
//           searchQuery={searchQuery}
//         />
//       </div>
//     </Container>
//   );
// }

// export default UOMFacHome;