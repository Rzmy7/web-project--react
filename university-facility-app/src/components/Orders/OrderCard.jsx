import React from 'react';
import styled from 'styled-components';
import { Trash } from 'lucide-react';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// Styled Components
const ItemCard = styled.div`
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
  
  @media (max-width: 768px) {
    width: 100%;
    padding: 16px;
    border-radius: 10px;
  }
  
  @media (max-width: 480px) {
    padding: 12px;
    border-radius: 8px;
    &:hover {
      transform: none;
    }
  }
`;

const ItemHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 15px;
  
  @media (max-width: 480px) {
    flex-direction: column;
    gap: 8px;
    margin-bottom: 12px;
  }
`;

const ItemName = styled.h3`
  color: var(--primary-color);
  margin: 0;
  font-size: 1.3rem;
  font-weight: 600;
  flex: 1;
  
  @media (max-width: 768px) {
    font-size: 1.2rem;
  }
  
  @media (max-width: 480px) {
    font-size: 1.1rem;
  }
`;

const CancelButton = styled.button`
  padding: 6px 8px;
  background-color: transparent;
  color: var(--danger);
  border: 1px solid var(--danger);
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  
  &:hover {
    background-color: var(--danger);
    color: white;
    transform: translateY(-1px);
  }
  
  &:active {
    transform: translateY(0);
  }
  
  @media (max-width: 480px) {
    padding: 5px 7px;
    align-self: flex-end;
    
    &:hover {
      transform: none;
    }
  }
`;

const FacilityName = styled.h4`
  color: var(--accent-color);
  margin: 8px 0 15px 0;
  font-size: 1.1rem;
  font-weight: 500;
  
  @media (max-width: 768px) {
    font-size: 1rem;
  }
  
  @media (max-width: 480px) {
    font-size: 0.95rem;
    margin: 6px 0 12px 0;
  }
`;

const ItemDetails = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
  margin: 15px 0;
`;

const DetailRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 8px 0;
  
  @media (max-width: 480px) {
    padding: 6px 0;
  }
`;

const DetailLabel = styled.span`
  color: var(--dark-gray);
  font-weight: 500;
  font-size: 0.9rem;
  
  @media (max-width: 480px) {
    font-size: 0.85rem;
  }
`;

const DetailValue = styled.span`
  color: var(--text-color);
  font-weight: 600;
  font-size: 1rem;
  
  &.price {
    color: var(--primary-color);
    font-size: 1.1rem;
  }
  
  &.quantity {
    color: var(--accent-color);
  }
  
  @media (max-width: 480px) {
    font-size: 0.9rem;
    
    &.price {
      font-size: 1rem;
    }
  }
`;

const ItemFooter = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 15px;
  padding-top: 15px;
  border-top: 2px solid var(--light-gray);
  
  @media (max-width: 480px) {
    flex-direction: column;
    gap: 12px;
    align-items: stretch;
  }
`;

const TimeDisplay = styled.span`
  color: var(--dark-gray);
  font-size: 0.9rem;
  font-weight: 500;
  
  @media (max-width: 480px) {
    text-align: center;
    font-size: 0.85rem;
  }
`;

const StatusBadge = styled.span`
  padding: 6px 12px;
  border-radius: 20px;
  font-size: 0.85rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  
  @media (max-width: 480px) {
    font-size: 0.8rem;
    padding: 5px 10px;
    text-align: center;
  }
  
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

const ItemOrderCard = ({ item, onCancelItem }) => {
  console.log('🔍 Rendering ItemOrderCard:', { ...item });
  const handleCancelItem = async () => {
    console.log('🚮 Attempting to cancel item:', { ...item });
    try {
      const response = await fetch('http://127.0.0.1:8001/api/orders/cancel', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          client_id: item.clientId,
          item_id: item.itemId,
          shop_id: item.shopId,
          time: item.realTime, // Already in YYYY-MM-DD HH:MM:SS format from API
          order_type: item.orderType
        })
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'API error');
      
      onCancelItem(item.clientId, item.itemId, item.shopId, item.realTime);
      
      toast.success(`${item.name} cancelled successfully!`, {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true
      });
    } catch (error) {
      console.error('❌ Error cancelling item:', error);
      toast.error('Failed to cancel item. Please try again.', {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true
      });
    }
  };

  // Parse price to number
  const price = parseFloat(item.price);
  const formattedPrice = isNaN(price) ? '0.00' : price.toFixed(2);

  return (
    <ItemCard status={item.status}>
      <ItemHeader>
        <ItemName>{item.name}</ItemName>
        {item.status === 'pending' && (
          <CancelButton onClick={handleCancelItem}>
            <Trash size={16} />
          </CancelButton>
        )}
      </ItemHeader>
      
      <FacilityName>{item.facilityName}</FacilityName>
      
      <ItemDetails>
        <DetailRow>
          <DetailLabel>Quantity:</DetailLabel>
          <DetailValue className="quantity">×{item.quantity}</DetailValue>
        </DetailRow>
        <DetailRow>
          <DetailLabel>Price:</DetailLabel>
          <DetailValue className="price">LKR {formattedPrice}</DetailValue>
        </DetailRow>
      </ItemDetails>
      
      <ItemFooter>
        <TimeDisplay>Ordered at {item.time}</TimeDisplay>
        <StatusBadge status={item.status}>
          {item.status}
        </StatusBadge>
      </ItemFooter>
    </ItemCard>
  );
};

export default ItemOrderCard;