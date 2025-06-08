import React from 'react';
import styled from 'styled-components';

// Styled Components
const StyledFilterContainer = styled.div`
  display: flex;
  justify-content: center;
  margin-bottom: 30px;
  gap: 10px;
  flex-wrap: wrap;
`;

const FilterButton = styled.button`
  padding: 8px 16px;
  border: 2px solid var(--accent-color);
  background: ${props => props.active ? 'var(--accent-color)' : 'white'};
  color: ${props => props.active ? 'white' : 'var(--accent-color)'};
  border-radius: 20px;
  cursor: pointer;
  font-weight: 500;
  transition: all 0.2s ease;
  
  &:hover {
    background: var(--hover-accent-color);
    border-color: var(--hover-accent-color);
    color: white;
  }
`;

const FilterContainer = ({ filter, handleFilterChange }) => {
  return (
    <StyledFilterContainer>
      <FilterButton 
        active={filter === 'all'} 
        onClick={() => handleFilterChange('all')}
      >
        All Orders
      </FilterButton>
      <FilterButton 
        active={filter === 'pending'} 
        onClick={() => handleFilterChange('pending')}
      >
        Pending
      </FilterButton>
      <FilterButton 
        active={filter === 'accepted'} 
        onClick={() => handleFilterChange('accepted')}
      >
        Accepted
      </FilterButton>
      <FilterButton 
        active={filter === 'completed'} 
        onClick={() => handleFilterChange('completed')}
      >
        Completed
      </FilterButton>
    </StyledFilterContainer>
  );
};

export default FilterContainer;