import React, { useState ,useEffect} from "react";
import styled from "styled-components";
import "../index.css";
import MenuTabContent from "./ShopMenu";
import PreOrderTab from "./PreOrderTab";
import AlertTab from "./Alert";

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
  padding: 0 8px 12px 0;
  height: 3rem;
  /* min-width: 6rem; */
  /* border: 1px solid black; */
  color: var(--dark-gray);
  cursor: pointer;
  position: relative;
  &:hover {
    color: var(--text-color);
  }

  ${(props) =>
    props.$active
      ? `
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
  `
      : null}
`;

const TabContent = styled.div`
  padding: 20px 0px;
`;

const MenuItemTab = styled.div`
  display: grid;
  flex: 1;
  justify-content: space-between;
  grid-template-columns: repeat(auto-fill, minmax(15rem, 1fr));
  gap: 1.5rem;
  min-width: 10rem;
`;

const PreOrderBadge = styled.span`
  color: var(--secondary-color);
  padding: 0.1rem;
  width: max-content;
  min-width: 0.9rem;
  height: 1rem;
  font-size: 0.6rem;
  background-color: var(--primary-color);
  align-content: center;
  border-radius: 50%;
  position: absolute;
  top: 0.2rem;
  right: -0.4rem;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const TabNavigationComponent = ({menuData,shopId}) => {
  const [activeTab, setActiveTab] = useState("Menu");
  const [preOrderItemCount, setPreOrderItemCount] = useState(0); // State to track pre-order items
  const tabs = ["Menu", "Alerts", "Pre-Order"];

  // const menuData = [
  //   {
  //     id: "cat-1",
  //     name: "Main Dishes",
  //     items: [
  //       {
  //         id: "FD001",
  //         name: "Kabilithi One",
  //         price: "2300",
  //         status: "available",
  //       },
  //       {
  //         id: "FD002",
  //         name: "Prawn Curry",
  //         price: "900",
  //         status: "unavailable",
  //       },
  //       {
  //         id: "FD003",
  //         name: "Chicken Noodles",
  //         price: "280",
  //         status: "available",
  //       },
  //       {
  //         id: "FD004",
  //         name: "Veggie Burger",
  //         price: "200",
  //         status: "available",
  //       },
  //     ],
  //   },
  //   {
  //     id: "cat-2",
  //     name: "Drinks",
  //     items: [
  //       {
  //         id: "DR001",
  //         name: "itemNamebima",
  //         price: "150",
  //         status: "available",
  //       },
  //       {
  //         id: "DR002",
  //         name: "Orange Juice",
  //         price: "700",
  //         status: "available",
  //       },
  //       {
  //         id: "DR003",
  //         name: "Coca-Cola",
  //         price: "305",
  //         status: "unavailable",
  //       },
  //     ],
  //   },
  // ];



const [preOrderedItems, setPreOrderedItems] = useState([]);


  const handlePreOrderChange = (action, item) => {
    console.log(action , item);
  if (action === "add") {
    setPreOrderItemCount(prevCount => prevCount + 1);
    setPreOrderedItems(prev => [...prev, item]);
  } else if (action === "remove") {
    setPreOrderItemCount(prevCount => Math.max(0, prevCount - 1));
    setPreOrderedItems(prev => prev.filter(i => i.id !== item.id));
  }
};

useEffect(() => {
  console.log("Current Pre-Ordered Items:", preOrderedItems);
}, [preOrderedItems]);




  return (
    <TabContainer>
      <TabNavigation>
        {tabs.map((tab) => (
          <div key={tab} style={{ position: "relative" }}>
            <TabButton
              $active={activeTab === tab}
              onClick={() => setActiveTab(tab)}
            >
              {tab}
            </TabButton>
            {tab === "Pre-Order" && preOrderItemCount > 0 && (
              <PreOrderBadge>{preOrderItemCount}</PreOrderBadge>
            )}
          </div>
        ))}
      </TabNavigation>
      <TabContent>
        {activeTab === "Menu" && (
          <MenuTabContent
            categories={menuData}
            preOrderedItems={preOrderedItems}
            preOrderNumHandle={handlePreOrderChange}
            isSelected={true}
          />
        )}
        {activeTab === "Alerts" && <AlertTab/>}
        {activeTab === "Pre-Order" && (
          <PreOrderTab PreOrderItems={preOrderedItems} setPreOrderedItems={handlePreOrderChange} shopId={shopId}/>
        )}
      </TabContent>
    </TabContainer>
  );
};

export default TabNavigationComponent;
