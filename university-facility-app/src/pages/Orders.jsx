import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import OrderCard from '../components/Orders/OrderCard';
import FilterContainer from '../components/Orders/FilterContainer';
import EmptyState from '../components/Orders/EmptyState';

// Styled Components
const Container = styled.div`
  width: 100%;
  margin: 0 auto;
  padding: 20px;
  background-color: var(--secondary-color);
  min-height: 100vh;

  @media (max-width:768px) {
    padding:10px 1px 20px 1px;
  }
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
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
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
      setFilteredOrders([...orders]);
    } else {
      setFilteredOrders(orders.filter(order => order.status === filter));
    }
  }, [filter, orders]);

  const handleFilterChange = (newFilter) => {
    setFilter(newFilter);
  };

  const handleCancelOrder = (orderId) => {
    setOrders(prevOrders => {
      const updatedOrders = prevOrders.filter(order => order.id !== orderId);
      setFilteredOrders(updatedOrders.filter(order => filter === 'all' || order.status === filter));
      return updatedOrders;
    });
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

      <FilterContainer 
        filter={filter}
        handleFilterChange={handleFilterChange}
      />

      {filteredOrders.length === 0 ? (
        <EmptyState filter={filter} />
      ) : (
        <OrdersGrid>
          {filteredOrders.map((order) => (
            <OrderCard 
              key={order.id} 
              order={order} 
              onCancelOrder={handleCancelOrder} 
            />
          ))}
        </OrdersGrid>
      )}
    </Container>
  );
};

export default OrderPage;