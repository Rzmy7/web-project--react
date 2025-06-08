import React from 'react';
import styled from 'styled-components';

// Styled Components
const EmptyState = styled.div`
  text-align: center;
  padding: 60px 20px;
  color: var(--dark-gray);
`;

const EmptyIcon = styled.div`
  font-size: 4rem;
  margin-bottom: 20px;
  opacity: 0.5;
`;

const EmptyText = styled.h3`
  color: var(--text-color);
  margin-bottom: 10px;
`;

const EmptySubtext = styled.p`
  color: var(--dark-gray);
  font-size: 1rem;
`;

const EmptyStateComponent = ({ filter }) => {
  return (
    <EmptyState>
      <EmptyIcon>🛍️</EmptyIcon>
      <EmptyText>No orders found</EmptyText>
      <EmptySubtext>
        {filter === 'all' 
          ? "You haven't placed any orders today yet." 
          : `No ${filter} orders found.`
        }
      </EmptySubtext>
    </EmptyState>
  );
};

export default EmptyStateComponent;