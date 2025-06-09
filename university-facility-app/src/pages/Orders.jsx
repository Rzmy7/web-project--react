import React, { useState, useEffect, useCallback } from 'react';
import styled from 'styled-components';
import ItemOrderCard from '../components/Orders/OrderCard';
import FilterContainer from '../components/Orders/FilterContainer';
import EmptyState from '../components/Orders/EmptyState';
import LoadingScreen from '../utils/Loading';
import { useParams } from 'react-router-dom';

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

const ErrorMessage = styled.p`
  color: var(--danger);
  text-align: center;
  font-size: 1.1rem;
`;

function OrderPage() {
    const {clientId} = useParams();
    console.log("clientId:", clientId);
  const [items, setItems] = useState([]);
  const [filteredItems, setFilteredItems] = useState([]);
  const [filter, setFilter] = useState('all');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  useEffect(() => {
    if (!clientId) return console.log("no user",clientId);
    let isMounted = true;
    const fetchItems = async () => {
      try {
        setLoading(true);
        setError(null); // Replace with authenticated user ID
        const response = await fetch(`http://127.0.0.1:8001/api/orders/${clientId}`);
        if (!response.ok) {
          throw new Error(`API error: ${response.status} ${response.statusText}`);
        }
        const data = await response.json();
        console.log('API response:', data);
        if (isMounted) {
          setItems(data);
          setFilteredItems(data);
        }
      } catch (err) {
        console.error('Error fetching items:', err);
        if (isMounted) {
          setError('Failed to load orders. Please try again later.');
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    fetchItems();
    return () => { isMounted = false; };
  }, [clientId]);

  useEffect(() => {
    setFilteredItems(filter === 'all' ? [...items] : items.filter(item => item.order_status === filter));
  }, [filter, items]);

  const handleFilterChange = useCallback((newFilter) => {
    setFilter(newFilter);
  }, []);

  const handleCancelItem = useCallback((clientId, itemId, shopId, time) => {
    console.log('handleCancelItem called with:', { clientId, itemId, shopId, time });
    setItems(prevItems => {
      const updatedItems = prevItems.filter(item =>
        !(item.client_id === clientId &&
          item.item_id === itemId &&
          item.shop_id === shopId &&
          item.time === time)
      );
      console.log('Updated items:', updatedItems);
      return updatedItems;
    });
  }, []);

  if (loading) {
    return (
      <Container>
        <Header>
          <Title>My Orders</Title>
          <div style={{width:"100%",justifyContent:"center"}}><LoadingScreen/></div>
        </Header>
      </Container>
    );
  }

  if (error) {
    return (
      <Container>
        <Header>
          <Title>My Orders</Title>
          <Subtitle>Today's orders • Auto-deleted at midnight</Subtitle>
        </Header>
        <ErrorMessage>{error}</ErrorMessage>
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

      {filteredItems.length === 0 ? (
        <EmptyState filter={filter} />
      ) : (
        <OrdersGrid>
          {filteredItems.map((item) => (
            <ItemOrderCard 
              key={`${item.client_id}-${item.item_id}-${item.shop_id}-${item.time}`}
              item={{
                orderId: `${item.client_id}-${item.item_id}-${item.shop_id}-${item.time}`,
                itemId: item.item_id,
                name: item.item_name,
                quantity: item.quantity,
                price: item.price,
                facilityName: item.shop_name,
                realTime : item.time,
                time: new Date(item.time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
                status: item.order_status,
                clientId: item.client_id,
                shopId: item.shop_id,
                orderType: item.item_id < 100 ? 'food' : 
                          item.item_id >= 100 && item.item_id < 200 ? 'juice' : 'bookaccessories'
              }} 
              onCancelItem={handleCancelItem} 
            />
          ))}
        </OrdersGrid>
      )}
    </Container>
  );
};

export default OrderPage;