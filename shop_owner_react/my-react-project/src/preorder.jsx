import React, { useState } from 'react';
import styled from 'styled-components';

const Section = styled.section`
  padding: 2rem;
  scroll-margin-top: 50px;
`;

const SectionHeader = styled.div`
  text-align: center;
  margin-bottom: 2rem;

  h1 {
    font-size: 2.5rem;
    text-transform: uppercase;
    margin-bottom: 30px;
    color: var(--primary-color);
    border-bottom: 2px solid var(--primary-color);
    padding-bottom: 20px;
  }
`;

const ButtonContainer = styled.div`
  display: flex;
  justify-content: left;
  gap: 1.5rem;
  margin-bottom: 10px;
`;

const StyledButton = styled.button`
  background-color: ${({ active }) => (active ? 'var(--primary-color)' : 'transparent')};
  color: ${({ active }) => (active ? 'var(--secondary-color)' : 'var(--primary-color)')};
  width: fit-content;
  border: 1px solid var(--primary-color);
  border-radius: 3px;
  font-size: 16px;
  text-align: center;
  align-items: center;
  padding: 10px;
  cursor: pointer;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
  transition: background 0.3s, color 0.3s;

  &:hover {
    background-color: var(--primary-color);
    color: var(--secondary-color);
  }
`;

const OrderContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 1.5rem;
  justify-content: center;
`;

const OrderBox = styled.div`
  width: 350px;
  margin-top: 10px;
  border: 1px solid #ccc;
  padding: 1rem;
  border-radius: 12px;
  box-shadow: 2px 2px 8px rgba(0, 0, 0, 0.1);
  background-color: #fff;
`;

const OrderItem = styled.p`
  margin: 0.5rem 0;
`;

const BoxButton = styled.button`
  background-color: ${({ danger }) => (danger ? '#e74c3c' : '#2ecc71')};
  color: white;
  border: none;
  padding: 0.5rem 1rem;
  margin-right: 0.5rem;
  border-radius: 5px;
  cursor: pointer;
`;

function Preorder() {
  const [activeTab, setActiveTab] = useState('new');
  const [newOrders, setNewOrders] = useState([
    { id: 1, name: 'Sachintha', indexNum: 'A001', item: 'Juice', quantity: 2, total: 200 },
    { id: 2, name: 'Kavinda', indexNum: 'A002', item: 'Burger', quantity: 1, total: 150 },
    { id: 5, name: 'Nimal', indexNum: 'A003', item: 'Burger', quantity: 1, total: 150 },
    { id: 6, name: 'Sunil', indexNum: 'A004', item: 'Burger', quantity: 1, total: 150 },
    { id: 7, name: 'Amara', indexNum: 'A005', item: 'Burger', quantity: 1, total: 150 },
    { id: 8, name: 'Dilani', indexNum: 'A006', item: 'Burger', quantity: 1, total: 150 },
    { id: 9, name: 'Ruwan', indexNum: 'A007', item: 'Burger', quantity: 1, total: 150 },
  ]);
  const [pendingOrders, setPendingOrders] = useState([
    { id: 3, name: 'Priya', indexNum: 'A008', item: 'Sandwich', quantity: 1, total: 100 },
  ]);
  const [completedOrders, setCompletedOrders] = useState([
    { id: 4, name: 'Kamal', indexNum: 'A009', item: 'Coffee', quantity: 2, total: 120 },
  ]);

  const handleAccept = (order, fromTab) => {
    if (fromTab === 'new') {
      setNewOrders(newOrders.filter((o) => o.id !== order.id));
      setPendingOrders([...pendingOrders, order]);
    } else if (fromTab === 'pending') {
      setPendingOrders(pendingOrders.filter((o) => o.id !== order.id));
      setCompletedOrders([...completedOrders, order]);
    }
  };

  const handleDelete = (orderId, fromTab) => {
    if (window.confirm('Are you sure you want to delete this order?')) {
      if (fromTab === 'new') {
        setNewOrders(newOrders.filter((o) => o.id !== orderId));
      } else if (fromTab === 'pending') {
        setPendingOrders(pendingOrders.filter((o) => o.id !== orderId));
      } else if (fromTab === 'completed') {
        setCompletedOrders(completedOrders.filter((o) => o.id !== orderId));
      }
    }
  };

  const renderOrders = (orders, tab) => (
    <OrderContainer>
      {orders.map((order) => (
        <OrderBox key={order.id}>
          <OrderItem><strong>Name:</strong> {order.name}</OrderItem>
          <OrderItem><strong>Index Number:</strong> {order.indexNum}</OrderItem>
          <OrderItem><strong>Item:</strong> {order.item}</OrderItem>
          <OrderItem><strong>Quantity:</strong> {order.quantity}</OrderItem>
          <OrderItem><strong>Total Price:</strong> Rs.{order.total}</OrderItem>
          {tab !== 'completed' ? (
            <>
              <BoxButton onClick={() => handleAccept(order, tab)}>Accept</BoxButton>
              <BoxButton danger onClick={() => handleDelete(order.id, tab)}>Delete</BoxButton>
            </>
          ) : (
            <OrderItem style={{ color: 'green', fontWeight: 'bold' }}>✓ Completed</OrderItem>
          )}
        </OrderBox>
      ))}
    </OrderContainer>
  );

  return (
    <Section id="preorder">
      <SectionHeader>
        <h1>Pre Orders</h1>
      </SectionHeader>
      <ButtonContainer>
        <StyledButton active={activeTab === 'new'} onClick={() => setActiveTab('new')}>
          New Orders
        </StyledButton>
        <StyledButton active={activeTab === 'pending'} onClick={() => setActiveTab('pending')}>
          Pending Orders
        </StyledButton>
        <StyledButton active={activeTab === 'completed'} onClick={() => setActiveTab('completed')}>
          Completed Orders
        </StyledButton>
      </ButtonContainer>

      {activeTab === 'new' && renderOrders(newOrders, 'new')}
      {activeTab === 'pending' && renderOrders(pendingOrders, 'pending')}
      {activeTab === 'completed' && renderOrders(completedOrders, 'completed')}
    </Section>
  );
}

export default Preorder;