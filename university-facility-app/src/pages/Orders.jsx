import React, { useState, useEffect } from 'react';
import styled from 'styled-components';

// Styled Components
const Container = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
  background-color: var(--secondary-color);
  min-height: 100vh;
`;

const Header = styled.div`
  text-align: center;
  margin-bottom: 30px;
`;

const Title = styled.h1`
  color: var(--primary-color);
  font-size: 2.5rem;
  margin-bottom: 10px;
  font-weight: 700;
`;

const Subtitle = styled.p`
  color: var(--text-color);
  font-size: 1.1rem;
  opacity: 0.8;
`;

const OrdersGrid = styled.div`
  display: grid;
  gap: 20px;
  grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
`;

const OrderCard = styled.div`
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
  justify-content: between;
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

const FilterContainer = styled.div`
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

// Sample data - replace with your actual API call
const sampleOrders = [
  {
    id: "ORD001",
    orderName: "Lunch Combo",
    shopName: "Central Canteen",
    items: [
      { name: "Chicken Rice", quantity: 1, price: 4.50 },
      { name: "Iced Tea", quantity: 1, price: 1.50 }
    ],
    totalPrice: 6.00,
    time: "12:30 PM",
    status: "completed"
  },
  {
    id: "ORD002",
    orderName: "Study Snacks",
    shopName: "Library Café",
    items: [
      { name: "Coffee", quantity: 2, price: 2.50 },
      { name: "Muffin", quantity: 1, price: 3.00 }
    ],
    totalPrice: 8.00,
    time: "2:15 PM",
    status: "accepted"
  },
  {
    id: "ORD003",
    orderName: "Quick Bite",
    shopName: "Juice Bar",
    items: [
      { name: "Fresh Orange Juice", quantity: 1, price: 3.50 },
      { name: "Sandwich", quantity: 1, price: 4.00 }
    ],
    totalPrice: 7.50,
    time: "4:45 PM",
    status: "pending"
  }
];

const OrderPage = () => {
  const [orders, setOrders] = useState([]);
  const [filteredOrders, setFilteredOrders] = useState([]);
  const [filter, setFilter] = useState('all');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate API call - replace with your actual API endpoint
    const fetchOrders = async () => {
      try {
        setLoading(true);
        // Replace this with your actual API call
        // const response = await fetch('/api/orders/today');
        // const data = await response.json();
        
        // Using sample data for demonstration
        setTimeout(() => {
          setOrders(sampleOrders);
          setFilteredOrders(sampleOrders);
          setLoading(false);
        }, 1000);
      } catch (error) {
        console.error('Error fetching orders:', error);
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  useEffect(() => {
    if (filter === 'all') {
      setFilteredOrders(orders);
    } else {
      setFilteredOrders(orders.filter(order => order.status === filter));
    }
  }, [filter, orders]);

  const handleFilterChange = (newFilter) => {
    setFilter(newFilter);
  };

  if (loading) {
    return (
      <Container>
        <Header>
          <Title>My Orders</Title>
          <Subtitle>Loading your orders...</Subtitle>
        </Header>
      </Container>
    );
  }

  return (
    <Container>
      <Header>
        <Title>My Orders</Title>
        <Subtitle>Today's orders • Auto-deleted at midnight</Subtitle>
      </Header>

      <FilterContainer>
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
      </FilterContainer>

      {filteredOrders.length === 0 ? (
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
      ) : (
        <OrdersGrid>
          {filteredOrders.map((order) => (
            <OrderCard key={order.id} status={order.status}>
              <OrderHeader>
                <OrderId>#{order.id}</OrderId>
                <OrderTime>{order.time}</OrderTime>
              </OrderHeader>
              
              <ShopName>{order.shopName}</ShopName>
              
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
                <StatusBadge status={order.status}>
                  {order.status}
                </StatusBadge>
              </OrderFooter>
            </OrderCard>
          ))}
        </OrdersGrid>
      )}
    </Container>
  );
};

export default OrderPage;