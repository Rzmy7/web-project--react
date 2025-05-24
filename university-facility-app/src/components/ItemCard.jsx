import React from 'react';
import styled from 'styled-components';
import '../index.css';




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
  min-width:10rem;
  max-width: 16rem;
  border: 1px solid var(--light-gray);

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

const ItemName = styled.span`
  /* No specific styles here based on your provided CSS, but kept for structure */
`;

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
  cursor: pointer; /* Add cursor pointer for buttons */
`;

const ItemCard = ({ id, name, price, status, onAddToOrder }) => {
  const isAvailable = status === 'available';
  const finishedClass = !isAvailable ? 'finished' : '';

  return (
    <MenuItem id={id} className={finishedClass}>
      <ItemName >{name}</ItemName>
      <ItemPrice>{price}</ItemPrice>
      <ItemStatus className={`${status}`}>
        {status === 'available' ? 'Availabile' : 'Unavailable'}
      </ItemStatus>
      <AddOrderButton
        className="add-order-btn"
        onClick={onAddToOrder}
        disabled={!isAvailable} // Disable button if not available
      >
        Add to Order
      </AddOrderButton>
    </MenuItem>
  );
};

export default ItemCard;