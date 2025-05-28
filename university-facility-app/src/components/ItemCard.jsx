// import React from "react";
// import styled from "styled-components";
// import "../index.css";
// import { useState } from "react";

// const MenuItem = styled.div`
//   background-color: var(--secondary-color);
//   border: 1px solid var(--light-gray);
//   height: fit-content;
//   border-radius: 0.3rem;
//   box-shadow: 0px 0px 1px rgba(0, 0, 0, 0.1);
//   display: flex;
//   flex-direction: column;
//   padding: 1rem;
//   row-gap: 1.5rem;
//   font-weight: 550;
//   min-width: 10rem;
//   max-width: 16rem;
//   border: 1px solid var(--light-gray);

//   &.finished {
//     background-color: var(--light-gray);

//     .item-name,
//     .item-price {
//       color: var(--dark-gray);
//     }

//     .add-order-btn {
//       opacity: 0.7;
//     }
//   }
// `;

// const ItemName = styled.span`
//   /* No specific styles here based on your provided CSS, but kept for structure */
// `;

// const ItemPrice = styled.span`
//   color: var(--primary-color);
//   font-weight: 300;
// `;

// const ItemStatus = styled.span`
//   color: var(--text-color);
//   font-size: small;
//   font-weight: 200;

//   &.available {
//     color: var(--success);
//   }

//   &.unavailable {
//     color: var(--danger);
//   }
// `;

// const AddOrderButton = styled.button`
//   border: none;
//   background-color: var(--accent-color);
//   color: var(--secondary-color);
//   font-weight: 500;
//   padding: 0.5rem 1.2rem;
//   width: fit-content;
//   border-radius: 0.3rem;
//   box-shadow: 0px 1px 1px rgba(0, 0, 0, 0.1);
//   cursor: pointer; /* Add cursor pointer for buttons */
// `;

// const ItemCard = ({ id, name, price, status, preOrderNumHandle }) => {
//   const [isAdded, setIsAdded] = useState(false); // Track if item is added
//   const isAvailable = status === "available";
//   const finishedClass = !isAvailable || isAdded ? "finished" : "";

//   const clickedPreOrderBtn = () => {
//     preOrderNumHandle(); // notify parent
//     setIsAdded(true); // disable after first click
//   };

//   return (
//     <MenuItem id={id} className={finishedClass}>
//       <ItemName>{name}</ItemName>
//       <ItemPrice>{price}</ItemPrice>
//       <ItemStatus className={`${status}`}>
//         {status === "available" ? "Available" : "Unavailable"}
//       </ItemStatus>
//       <AddOrderButton
//         className="add-order-btn"
//         onClick={clickedPreOrderBtn}
//         disabled={!isAvailable || isAdded} // Disable after clicked
//       >
//         {isAdded ? "Added" : "Add to Order"}
//       </AddOrderButton>
//     </MenuItem>
//   );
// };

// export default ItemCard;

import styled from "styled-components";
import "../index.css";

// Styles
const MenuItem = styled.div`
  background-color: var(--secondary-color);
  border: 1px solid var(--light-gray);
  height: fit-content;
  border-radius: 0.3rem;
  box-shadow: 0px 0px 1px rgba(0, 0, 0, 0.1);
  display: flex;
  flex-direction: column;
  padding: 1rem;
  row-gap: 1.5rem;
  font-weight: 550;
  min-width: 10rem;
  max-width: 16rem;
  position: relative;

  &.finished {
    background-color: var(--light-gray);

    .item-name,
    .item-price {
      color: var(--dark-gray);
    }

    .add-order-btn {
      opacity: 0.7;
    }
  }
`;

const ItemName = styled.span``;

const ItemPrice = styled.span`
  color: var(--primary-color);
  font-weight: 300;
`;

const ItemStatus = styled.span`
  color: var(--text-color);
  font-size: small;
  font-weight: 200;

  &.available {
    color: var(--success);
  }

  &.unavailable {
    color: var(--danger);
  }
`;

const AddOrderButton = styled.button`
  border: none;
  background-color: var(--accent-color);
  color: var(--secondary-color);
  font-weight: 500;
  padding: 0.5rem 1.2rem;
  width: fit-content;
  border-radius: 0.3rem;
  box-shadow: 0px 1px 1px rgba(0, 0, 0, 0.1);
  cursor: pointer;
`;

const DeleteButton = styled.button`
  position: absolute;
  top: 1rem;
  right: 1rem;
  background: transparent;
  border: none;
  color: var(--dark-gray);
  font-size: 1.3rem;
  cursor: pointer;
  text-shadow: 1px 1px 1px rgba(0, 0, 0, 0.2);
`;

// const ItemCard = ({
//   id,
//   name,
//   price,
//   status,
//   isPreOrdered,
//   preOrderChangeHandle
// }) => {
//   const isAvailable = status === "available";
//   const finishedClass = !isAvailable || isPreOrdered ? "finished" : "";

//   const clickedPreOrderBtn = () => {
//     preOrderChangeHandle("add", id);
//   };

//   const clickedDeleteBtn = () => {
//     preOrderChangeHandle("remove", id);
//   };

//   return (
//     <MenuItem id={id} className={finishedClass}>
//       {isPreOrdered && (
//         <DeleteButton onClick={clickedDeleteBtn} title="Remove from order">
//           ❌
//         </DeleteButton>
//       )}
//       <ItemName>{name}</ItemName>
//       <ItemPrice>{price}</ItemPrice>
//       <ItemStatus className={status}>
//         {isAvailable ? "Available" : "Unavailable"}
//       </ItemStatus>
//       <AddOrderButton
//         onClick={clickedPreOrderBtn}
//         disabled={!isAvailable || isPreOrdered}
//       >
//         {isPreOrdered ? "Added" : "Add to Order"}
//       </AddOrderButton>
//     </MenuItem>
//   );
// };

const ItemCard = ({
  id,
  name,
  price,
  status,
  isPreOrdered,
  preOrderChangeHandle,
}) => {
  const isAvailable = status === "available";
  const finishedClass = !isAvailable || isPreOrdered ? "finished" : "";

  const clickedPreOrderBtn = () => {
    preOrderChangeHandle("add", id);
  };

  const clickedDeleteBtn = () => {
    preOrderChangeHandle("remove", id);
  };

  return (
    <MenuItem id={id} className={finishedClass}>
      {isPreOrdered && (
        <DeleteButton onClick={clickedDeleteBtn} title="Remove from order">
          X
        </DeleteButton>
      )}
      <ItemName className="item-name">{name}</ItemName>
      <ItemPrice className="item-price">{price}</ItemPrice>
      <ItemStatus className={status}>
        {status === "available" ? "Available" : "Unavailable"}
      </ItemStatus>
      <AddOrderButton
        className="add-order-btn"
        onClick={clickedPreOrderBtn}
        disabled={!isAvailable || isPreOrdered}
      >
        {isPreOrdered ? "Added" : "Add to Order"}
      </AddOrderButton>
    </MenuItem>
  );
};

// // Component
// const ItemCard = ({ id, name, price, status, preOrderNumHandle }) => {
//   const [isAdded, setIsAdded] = useState(false);
//   const isAvailable = status === "available";
//   const finishedClass = !isAvailable || isAdded ? "finished" : "";

//   const clickedPreOrderBtn = () => {
//     preOrderNumHandle("add"); // signal parent something was added
//     setIsAdded(true);
//   };

//   const clickedDeleteBtn = () => {
//     preOrderNumHandle("remove"); // signal parent something was removed
//     setIsAdded(false);
//   };

//   return (
//     <MenuItem id={id} className={finishedClass}>
//       {/* Delete icon button only shows after item is added */}
//       {isAdded && (
//         <DeleteButton onClick={clickedDeleteBtn} title="Remove from order">
//           X
//         </DeleteButton>
//       )}
//       <ItemName className="item-name">{name}</ItemName>
//       <ItemPrice className="item-price">{price}</ItemPrice>
//       <ItemStatus className={`${status}`}>
//         {isAvailable ? "Available" : "Unavailable"}
//       </ItemStatus>
//       <AddOrderButton
//         className="add-order-btn"
//         onClick={clickedPreOrderBtn}
//         disabled={!isAvailable || isAdded}
//       >
//         {isAdded ? "Added" : "Add to Order"}
//       </AddOrderButton>
//     </MenuItem>
//   );
// };

export default ItemCard;
