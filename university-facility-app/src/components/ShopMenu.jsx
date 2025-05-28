import React from "react";
import styled from "styled-components";
import ItemCard from "./ItemCard";
import "../index.css";

// Define CSS variables (ensure these match or are consistent with ItemCard.jsx)

const TabPane = styled.div`
  &.selected {
    /* Styles for the selected tab pane if needed */
  }
`;

const MenuCategoryContainer = styled.div`
  display: flex;
  flex-direction: column;
  padding-top: 1.5rem;
  margin-bottom: 2rem;
`;

const MenuCategoryName = styled.div`
  color: var(--primary-color); /* Use CSS variable, fallback to defined color */
  font-weight: 700;
  padding-bottom: 0.7rem;
  border-bottom: 1px solid var(--light-gray); /* Use CSS variable, fallback */
`;

const MenuItemsGrid = styled.div`
  margin-top: 1.5rem;
  display: grid;
  flex: 1;
  justify-content: space-between;
  grid-template-columns: repeat(auto-fill, minmax(15rem, 1fr));
  gap: 1.5rem;
  min-width: 10rem;
`;

const MenuTabContent = ({
  categories,
  onAddToOrder,
  isSelected,
  preOrderNumHandle,preOrderedItemIds,
}) => {
  return (
    <TabPane className={isSelected ? "selected" : ""}>
      {categories.map((category) => (
        <MenuCategoryContainer key={category.id}>
          <MenuCategoryName>{category.name}</MenuCategoryName>
          <MenuItemsGrid>
            {category.items
              .slice() // clone the array to avoid mutating original data
              .sort((a, b) => {
                // Sort so that available items come before unavailable ones
                return a.status === "available" && b.status !== "available"
                  ? -1
                  : a.status !== "available" && b.status === "available"
                  ? 1
                  : 0;
              })
              .map((item) => (
                <ItemCard
                  key={item.id}
                  id={item.id}
                  name={item.name}
                  price={item.price}
                  status={item.status}
                  preOrderChangeHandle={preOrderNumHandle}
                  isPreOrdered={preOrderedItemIds.includes(item.id)}
                  onAddToOrder={() => onAddToOrder(item.id)}
                />
              ))}
          </MenuItemsGrid>
        </MenuCategoryContainer>
      ))}
    </TabPane>
  );
};

export default MenuTabContent;
