// import React from 'react';
// import styled from 'styled-components';

// // Define styled components
// const SearchContainer = styled.div`
//   background-color: white;
//   padding: 2rem;
//   border-radius: 8px;
//   box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
//   margin-bottom: 2rem;
// `;

// const SearchTitle = styled.h2`
//   color: #1a3064;
//   margin-bottom: 1.5rem;
//   font-weight: 700;
// `;

// const SearchForm = styled.form`
//   display: flex;
//   flex-wrap: wrap;
//   gap: 1rem;
//   @media (max-width: 768px) {
//     flex-direction: column;
//   }
// `;

// const Label = styled.label`
//   display: block;
//   margin-bottom: 0.5rem;
//   font-weight: bold;
// `;

// const Select = styled.select`
//   width: 100%;
//   padding: 0.75rem;
//   border: 1px solid #ddd;
//   border-radius: 4px;
//   margin-bottom: 1rem;
// `;

// const SearchInput = styled.div`
//   display: flex;
//   width: 100%;
// `;

// const Input = styled.input`
//   flex: 1;
//   padding: 0.75rem;
//   border: 1px solid #ddd;
//   border-radius: 4px 0 0 4px;
// `;

// const SearchBtn = styled.button`
//   padding: 0.75rem 1rem;
//   background-color: #1a3064;
//   color: white;
//   border: none;
//   border-radius: 0 4px 4px 0;
//   cursor: pointer;
//   transition: background-color 0.3s ease;

//   &:hover {
//     background-color: #0f2551;
//   }
// `;

// // Search Bar Component
// function SearchBar({ facilityType, setFacilityType, status, setStatus, searchQuery, setSearchQuery }) {
//   const handleSearch = (e) => {
//     e.preventDefault();
//     // Filtering is handled in Facilities component
//     console.log('Search triggered:', { facilityType, status, searchQuery });
//   };

//   return (
//     <SearchContainer>
//       <SearchTitle>Find What You Need</SearchTitle>
//       <SearchForm onSubmit={handleSearch}>
//         <div style={{ flex: '1', minWidth: '200px' }}>
//           <Label>Facility Type</Label>
//           <Select value={facilityType} onChange={(e) => setFacilityType(e.target.value)}>
//             <option value="all">All Facilities</option>
//             <option value="canteen">Canteen</option>
//             <option value="juice-bar">Juice Bar</option>
//             <option value="book-shop">Book Shop</option>
//           </Select>
//         </div>
//         <div style={{ flex: '1', minWidth: '200px' }}>
//           <Label>Status</Label>
//           <Select value={status} onChange={(e) => setStatus(e.target.value)}>
//             <option value="all">All</option>
//             <option value="open">Open</option>
//             <option value="closed">Closed</option>
//             </Select>
//         </div>
//         <div style={{ flex: '2' }}>
//           <Label>Search for items or services</Label>
//           <SearchInput>
//             <Input
//               type="text"
//               placeholder="e.g., Fried Rice, Mango Juice, Printing..."
//               value={searchQuery}
//               onChange={(e) => setSearchQuery(e.target.value)}
//             />
//             <SearchBtn type="submit">
//               <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
//                 <circle cx="11" cy="11" r="8"></circle>
//                 <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
//               </svg>
//             </SearchBtn>
//           </SearchInput>
//         </div>
//       </SearchForm>
//     </SearchContainer>
//   );
// }

// export default SearchBar;




import React from 'react';
import styled from 'styled-components';

// Define styled components
const SearchContainer = styled.div`
  background-color: white;
  padding: 2rem;
  border-radius: 8px;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
  margin-bottom: 2rem;
  width: 100%;
  /* max-width: 300px; */
`;

const SearchTitle = styled.h2`
  color: #1a3064;
  margin-bottom: 1.5rem;
  font-weight: 700;
`;

const SearchForm = styled.form`
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
  @media (max-width: 768px) {
    flex-direction: column;
  }
`;

const Label = styled.label`
  display: block;
  margin-bottom: 0.5rem;
  font-weight: bold;
`;

const Select = styled.select`
  width: 100%;
  padding: 0.75rem;
  border: 1px solid #ddd;
  border-radius: 4px;
  margin-bottom: 1rem;
`;

const SearchInput = styled.div`
  display: flex;
  width: 100%;
`;

const Input = styled.input`
  flex: 1;
  padding: 0.75rem;
  border: 1px solid #ddd;
  border-radius: 4px 0 0 4px;
`;

const SearchBtn = styled.button`
  padding: 0.75rem 1rem;
  background-color: #e1e1e1;
  color: #636363;
  border: none;
  border-radius: 0 4px 4px 0;
  cursor: pointer;
  transition: background-color 0.3s ease;

  &:hover {
    background-color: #666666;color: #ffffff;
  }
`;

// Search Bar Component
function SearchBar({ facilityType, setFacilityType, status, setStatus, searchQuery, setSearchQuery }) {
  const handleSearch = (e) => {
    e.preventDefault();
    // Filtering is handled in Facilities component
    console.log('Search triggered:', { facilityType, status, searchQuery });
  };

  return (
    <SearchContainer>
      <SearchTitle>Find What You Need</SearchTitle>
      <SearchForm onSubmit={handleSearch}>
        <div style={{ flex: '1', minWidth: '200px' }}>
          <Label>Facility Type</Label>
          <Select value={facilityType} onChange={(e) => setFacilityType(e.target.value)}>
            <option value="all">All Facilities</option>
            <option value="canteen">Canteen</option>
            <option value="juice bar">Juice Bar</option>
            <option value="book shop">Book Shop</option>
          </Select>
        </div>
        <div style={{ flex: '1', minWidth: '200px' }}>
          <Label>Status</Label>
          <Select value={status} onChange={(e) => setStatus(e.target.value)}>
            <option value="all">All</option>
            <option value="open">Open</option>
            <option value="closed">Closed</option>
          </Select>
        </div>
        <div style={{ flex: '2' }}>
          <Label>Search for items or services</Label>
          <SearchInput>
            <Input
              type="text"
              placeholder="e.g., Fried Rice, Mango Juice, Printing..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <SearchBtn type="submit">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <circle cx="11" cy="11" r="8"></circle>
                <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
              </svg>
            </SearchBtn>
          </SearchInput>
        </div>
      </SearchForm>
    </SearchContainer>
  );
}

export default SearchBar;