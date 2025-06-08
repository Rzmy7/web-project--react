import React from 'react';
import styled from 'styled-components';
import { Trash } from 'lucide-react';

// Styled Components
const OrderCard = styled.div`
  width: 300px;
  background: white;
  border-radius: 12px;
  padding: 20px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  border-left: 4px solid ${props => 
    props.status === 'completed' ? 'var(--success)' :
    props.status === 'accepted' ? 'var(--warning)' :
    'var(--accent-color)'
  };
  transition: transform 0.2s ease, box-shadow 0.2s ease;
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 6px 20px rgba(0, 0, 0, 0.15);
  }
`;

const OrderHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 15px;
`;

const OrderId = styled.h3`
  color: var(--primary-color);
  margin: 0;
  font-size: 1.2rem;
  font-weight: 600;
`;

const OrderTime = styled.span`
  color: var(--dark-gray);
  font-size: 0.9rem;
  margin-left: auto;
`;

const ShopName = styled.h4`
  color: var(--accent-color);
  margin: 8px 0;
  font-size: 1.1rem;
  font-weight: 500;
`;

const ItemsContainer = styled.div`
  margin: 15px 0;
`;

const ItemRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 8px 0;
  border-bottom: 1px solid var(--light-gray);
  
  &:last-child {
    border-bottom: none;
  }
`;

const ItemName = styled.span`
  color: var(--text-color);
  font-weight: 500;
  flex: 1;
`;

const ItemQuantity = styled.span`
  color: var(--dark-gray);
  margin: 0 15px;
  font-size: 0.9rem;
`;

const ItemPrice = styled.span`
  color: var(--primary-color);
  font-weight: 600;
`;

const OrderFooter = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 15px;
  padding-top: 15px;
  border-top: 2px solid var(--light-gray);
`;

const TotalPrice = styled.span`
  color: var(--primary-color);
  font-weight: 700;
  font-size: 1.2rem;
`;

const ActionContainer = styled.div`
  display: flex;
  gap: 10px;
  align-items: center;
  
  @media (max-width: 480px) {
    justify-content: center;
  }
`;

const CancelButton = styled.button`
  padding: 0px 9px;
  background-color: transparent;
  color: var(--danger);
  border: 1px solid var(--danger);
  border-radius: 6px;
  font-size: 0.85rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
  align-items: center;
  align-content: center;
  
  &:hover {
    background-color: var(--danger);
    color: var(--secondary-color);
    transform: translateY(-1px);
  }
  
  &:active {
    transform: translateY(0);
  }
  
  @media (max-width: 480px) {
    font-size: 0.8rem;
    padding: 5px 10px;
    
    &:hover {
      transform: none;
    }
  }
`;

const StatusBadge = styled.span`
  padding: 6px 12px;
  border-radius: 20px;
  font-size: 0.85rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  
  ${props => {
    switch(props.status) {
      case 'completed':
        return `
          background-color: var(--success);
          color: white;
        `;
      case 'accepted':
        return `
          background-color: var(--warning);
          color: white;
        `;
      default:
        return `
          background-color: var(--accent-color);
          color: white;
        `;
    }
  }}
`;

const OrderCardComponent = ({ order, onCancelOrder }) => {
  const handleCancelOrder = async (orderId) => {
    try {
      // Replace with your actual API call
      // await fetch(`/api/orders/${orderId}/cancel`, { method: 'POST' });
      
      // Call the parent component's cancel handler
      onCancelOrder(orderId);
      
      // Show success message (you can implement a toast notification here)
      alert('Order cancelled successfully!');
    } catch (error) {
      console.error('Error cancelling order:', error);
      alert('Failed to cancel order. Please try again.');
    }
  };

  return (
    <OrderCard status={order.status}>
      <OrderHeader>
        <OrderId>#{order.id}</OrderId>
        <OrderTime>{order.time}</OrderTime>
      </OrderHeader>
      <div style={{ display: "flex", justifyContent: "space-between" }}>
        <ShopName>{order.shopName}</ShopName>
        {order.status === 'pending' && (
          <CancelButton onClick={() => handleCancelOrder(order.id)}>
            <Trash size={16} />
          </CancelButton>
        )}
      </div>
      
      <ItemsContainer>
        {order.items.map((item, index) => (
          <ItemRow key={index}>
            <ItemName>{item.name}</ItemName>
            <ItemQuantity>×{item.quantity}</ItemQuantity>
            <ItemPrice>${item.price.toFixed(2)}</ItemPrice>
          </ItemRow>
        ))}
      </ItemsContainer>
      
      <OrderFooter>
        <TotalPrice>Total: ${order.totalPrice.toFixed(2)}</TotalPrice>
        <ActionContainer>
          <StatusBadge status={order.status}>
            {order.status}
          </StatusBadge>
        </ActionContainer>
      </OrderFooter>
    </OrderCard>
  );
};

export default OrderCardComponent;