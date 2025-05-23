import React, { useState } from 'react';
import styled from 'styled-components';
import '../index.css';

const TabContainer = styled.div`
  background-color: #f9f9f9;
  border-bottom: 1px solid #eaeaea;
`;

const TabNavigation = styled.div`
  display: flex;
  padding: 15px 0;
  gap: 30px;
  align-items: center;
`;

const TabButton = styled.button`
  background: none;
  border: none;
  padding: 8px 12px;
  color: var(--dark-gray);
  cursor: pointer;
  position: relative;

  &:hover {
    color: var(--text-color);
  }

  ${(props) => (props.active ? `
    color: var(--primary-color);
    font-weight: 500;
    &:after {
      content: '';
      position: absolute;
      bottom: -8px;
      left: 0;
      width: 100%;
      height: 3px;
      background-color: var(--primary-color);
    }
    
    &:hover{
        color:var(--primary-color);
    }
  ` : null)}
`;

const TabContent = styled.div`
  padding: 20px 0px;
`;

const TabNavigationComponent = () => {
  const [activeTab, setActiveTab] = useState('Menu');
  const tabs = ['Menu', 'Reviews', 'Pre-order'];

  return (
    <TabContainer>
      <TabNavigation>
        {tabs.map((tab) => (
          <TabButton
            key={tab}
            active={activeTab === tab}
            onClick={() => setActiveTab(tab)}
          >
            {tab}
          </TabButton>
        ))}
      </TabNavigation>
      <TabContent>
        {activeTab === 'Menu' && <div>This is the menu content</div>}
        {activeTab === 'Reviews' && <div>This is the reviews content</div>}
        {activeTab === 'Pre-order' && <div>This is the pre-order content</div>}
      </TabContent>
    </TabContainer>
  );
};

export default TabNavigationComponent;