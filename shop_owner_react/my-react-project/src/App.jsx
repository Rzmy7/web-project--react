import React, { useState } from 'react';
import styled from 'styled-components';
import Navbar from './navbar';
import Dashboard from './dashboard';
import Products from './products';
import Preorder from './preorder';
import Reviews from './reviews';
import Settings from './Settings';

const MainContent = styled.div`
  max-width: 1500px;
  margin: 0 auto;
  padding: 2rem 5rem;
  background-color: var(--secondary-color);
  display: flex;
  flex-wrap: wrap;
  flex-direction: column;
  gap: 2rem;
  width: 100%;

  @media (max-width: 768px) {
    padding: 1rem;
    flex-direction: column;
  }
`;

function App() {
  const [activeSection, setActiveSection] = useState('dashboard');

  return (
    <>
      <Navbar setActiveSection={setActiveSection} />
      <MainContent>
        {activeSection === 'dashboard' && <Dashboard />}
        {activeSection === 'products' && <Products />}
        {activeSection === 'preorder' && <Preorder />}
        {activeSection === 'reviews' && <Reviews />}
        {activeSection === 'settings' && <Settings />}
      </MainContent>
    </>
  );
}

export default App;