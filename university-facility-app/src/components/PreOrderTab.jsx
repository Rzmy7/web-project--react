// import React, { useState } from 'react';
// import styled from 'styled-components';
// import '../index.css';

// const TabPane = styled.div`
//   display: flex !important;
//   flex-direction: column;
// `;

// const PreOrderTitle = styled.span`
//   color: var(--primary-color);
//   font-weight: 700;
//   margin: 2rem 0;
// `;

// const OrderedItemList = styled.div`
//   display: flex;
//   flex-direction: column;
//   row-gap: 2rem;
//   overflow-y: auto;
//   padding-bottom: 1.2rem;
//   border-bottom: 1px solid var(--light-gray);
// `;

// const OrderedItem = styled.div``;

// const OrderedItemName = styled.div`
//   font-weight: 500;
// `;

// const OrderedItemDetails = styled.div`
//   display: flex;
//   justify-content: space-between;
// `;

// const OrderedItemPrice = styled.span`
//   color: var(--primary-color);
// `;

// const OrderedItemQuantity = styled.div`
//   display: flex;
//   justify-content: space-between;
//   column-gap: 0.2rem;
// `;

// const OrderQuantityChanger = styled.span`
//   background-color: var(--light-gray);
//   padding: 0.2rem 0.7rem;
//   border-radius: 0.3rem;
//   cursor: pointer;
//   border: 1px solid transparent;

//   &:hover {
//     background-color: var(--secondary-color);
//     border: 1px solid var(--text-color);
//   }
//   &:active {
//     background-color: var(--text-color);
//     color: var(--secondary-color);
//     border: 1px solid var(--text-color);
//   }
// `;

// const OrderQuantity = styled.input`
//   padding: 0.2rem 0;
//   width: 3rem;
//   text-align: center;

//   &::-webkit-outer-spin-button,
//   &::-webkit-inner-spin-button {
//     -webkit-appearance: none;
//     margin: 0;
//   }
// `;

// const AdditionalNotes = styled.div`
//   margin-top: 2rem;
// `;

// const AdditionalNotesTitle = styled.p``;

// const AdditionalNotesForm = styled.form`
//   display: flex;
//   flex-direction: column;
//   margin-top: 0.3rem;
// `;

// const AdditionalNotesTextarea = styled.textarea`
//   padding: 0.5rem;
//   border: 1px solid var(--light-gray);
//   width: 100%;
//   height: 9rem;
//   border-radius: 0.3rem;
//   box-shadow: 0px 0px 0px 1px var(--light-gray);
//   resize: none;
// `;

// const PreOrderSubmitBtn = styled.button`
//   margin-top: 2rem;
//   border: 1px solid transparent;
//   background-color: var(--success);
//   color: var(--secondary-color);
//   font-weight: 500;
//   padding: 0.7rem 1.3rem;
//   width: fit-content;
//   border-radius: 0.3rem;
//   align-self: end;
// `;

// const PreOrderTab = () => {
//   const [orderedItems, setOrderedItems] = useState([]);
//   const [numOfOrderedItem, setNumOfOrderedItem] = useState(0);
//   const [additionalNotes, setAdditionalNotes] = useState('');

//   const addPreOrderToList = (itemId, itemName, itemPrice) => {
//     const existingItem = orderedItems.find((item) => item.id === itemId);
//     if (existingItem) {
//       setOrderedItems((prevItems) =>
//         prevItems.map((item) =>
//           item.id === itemId
//             ? { ...item, quantity: item.quantity + 1 }
//             : item
//         )
//       );
//     } else {
//       const newItem = {
//         id: itemId,
//         name: itemName,
//         price: itemPrice,
//         quantity: 1,
//       };
//       setOrderedItems((prevItems) => [...prevItems, newItem]);
//       setNumOfOrderedItem((prevCount) => prevCount + 1);
//     }
//   };

//   const handleQuantityChange = (id, change) => {
//     setOrderedItems((prevItems) =>
//       prevItems.map((item) =>
//         item.id === id
//           ? { ...item, quantity: Math.max(0, item.quantity + change) }
//           : item
//       )
//     );
//   };

//   const handleSubmit = (e) => {
//     e.preventDefault();
//     console.log('Ordered Items:', orderedItems);
//     console.log('Additional Notes:', additionalNotes);
//   };

//   return (
//     <TabPane id="preOrderTab">
//       <PreOrderTitle>Your Pre-order</PreOrderTitle>
//       <OrderedItemList id="orderItemList">
//         {orderedItems.length === 0 && <p>No items added yet.</p>}
//         {orderedItems.map((item) => (
//           <OrderedItem key={item.id} id={item.id}>
//             <OrderedItemName>{item.name}</OrderedItemName>
//             <OrderedItemDetails>
//               <OrderedItemPrice>{item.price}</OrderedItemPrice>
//               <OrderedItemQuantity>
//                 <OrderQuantityChanger
//                   className="minus"
//                   onClick={() => handleQuantityChange(item.id, -1)}
//                 >
//                   -
//                 </OrderQuantityChanger>
//                 <OrderQuantity
//                   type="number"
//                   value={item.quantity}
//                   readOnly
//                   aria-label={`Quantity of ${item.name}`}
//                 />
//                 <OrderQuantityChanger
//                   className="plus"
//                   onClick={() => handleQuantityChange(item.id, 1)}
//                 >
//                   +
//                 </OrderQuantityChanger>
//               </OrderedItemQuantity>
//             </OrderedItemDetails>
//           </OrderedItem>
//         ))}
//       </OrderedItemList>
//       <AdditionalNotes>
//         <AdditionalNotesTitle>Additional Notes</AdditionalNotesTitle>
//         <AdditionalNotesForm onSubmit={handleSubmit}>
//           <AdditionalNotesTextarea
//             id="additionalNotes"
//             placeholder="e.g., No onions, please"
//             value={additionalNotes}
//             onChange={(e) => setAdditionalNotes(e.target.value)}
//           />
//           <PreOrderSubmitBtn type="submit" id="preOrderSubmitBtn">
//             Submit Pre-order
//           </PreOrderSubmitBtn>
//         </AdditionalNotesForm>
//       </AdditionalNotes>
//     </TabPane>
//   );
// };

// export default PreOrderTab;

import React, { useState, useEffect } from "react";
import styled from "styled-components";

const TabPane = styled.div`
  display: flex;
  flex-direction: column;
  padding: 2rem;
  font-family: sans-serif;
`;

const PreOrderTitle = styled.span`
  color: #2c3e50;
  font-weight: 700;
  font-size: 1.5rem;
  margin-bottom: 1.5rem;
`;

const OrderedItemList = styled.div`
  display: flex;
  flex-direction: column;
  row-gap: 1.5rem;
  border-bottom: 1px solid #ccc;
  padding-bottom: 1.5rem;
`;

const OrderedItem = styled.div`
  position: relative;
`;

const OrderedItemName = styled.div`
  font-weight: 600;
`;

const OrderedItemDetails = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const OrderedItemPrice = styled.span`
  color: #2ecc71;
`;

const OrderedItemQuantity = styled.div`
  display: flex;
  column-gap: 0.5rem;
  align-items: center;
`;

const OrderQuantityChanger = styled.button`
  background-color: #ecf0f1;
  border: 1px solid #bdc3c7;
  padding: 0.2rem 0.6rem;
  border-radius: 4px;
  cursor: pointer;

  &:hover {
    background-color: #dcdde1;
  }
`;

const OrderQuantity = styled.input`
  width: 3rem;
  text-align: center;
`;

const RemoveButton = styled.button`
  position: absolute;
  top: 1rem;
  right: 9rem;
  background-color: #e74c3c;
  color: white;
  border: none;
  border-radius: 3px;
  font-size: 0.9rem;
  padding: 0.2rem 0.5rem;
  cursor: pointer;

  &:hover {
    background-color: #c0392b;
  }

  
`;

const AdditionalNotes = styled.div`
  margin-top: 2rem;
`;

const AdditionalNotesTextarea = styled.textarea`
  padding: 0.5rem;
  border: 1px solid #ccc;
  width: 100%;
  height: 100px;
  resize: none;
`;

const PreOrderSubmitBtn = styled.button`
  margin-top: 1rem;
  background-color: #27ae60;
  color: white;
  padding: 0.7rem 1.5rem;
  border: none;
  border-radius: 4px;
  cursor: pointer;
`;

const TotalDisplay = styled.div`
  margin-top: 1.5rem;
  font-weight: 600;
  text-align: right;
  color: #34495e;
`;

// Currency formatter for LKR
const formatCurrency = (value) => {
  return new Intl.NumberFormat("en-LK", {
    style: "currency",
    currency: "LKR",
    minimumFractionDigits: 2,
  }).format(value);
};

const PreOrderTab = () => {
  const [orderedItems, setOrderedItems] = useState([]);
  const [additionalNotes, setAdditionalNotes] = useState("");

  // Load from localStorage on mount
  useEffect(() => {
    const stored = localStorage.getItem("orderedItems");
    const storedNotes = localStorage.getItem("additionalNotes");
    if (stored) setOrderedItems(JSON.parse(stored));
    if (storedNotes) setAdditionalNotes(storedNotes);
  }, []);

  // Persist to localStorage
  useEffect(() => {
    localStorage.setItem("orderedItems", JSON.stringify(orderedItems));
  }, [orderedItems]);

  useEffect(() => {
    localStorage.setItem("additionalNotes", additionalNotes);
  }, [additionalNotes]);

  const handleQuantityChange = (id, delta) => {
    setOrderedItems((prevItems) =>
      prevItems.map((item) =>
        item.id === id
          ? { ...item, quantity: Math.max(1, item.quantity + delta) }
          : item
      )
    );
  };

  const handleRemoveItem = (id) => {
    setOrderedItems((prev) => prev.filter((item) => item.id !== id));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("🛒 Ordered Items:", orderedItems);
    console.log("📝 Additional Notes:", additionalNotes);
    alert("Pre-order submitted! Check console for details.");
  };

  const getTotal = () => {
    return orderedItems.reduce((acc, item) => {
      const numericPrice = parseFloat(item.price);
      return acc + numericPrice * item.quantity;
    }, 0);
  };

  // SAMPLE DATA to pre-fill for demo
  useEffect(() => {
    if (orderedItems.length === 0) {
      setOrderedItems([
        { id: "FD001", name: "Kabilithi One", price: "450.00", quantity: 2 },
        { id: "DR002", name: "Orange Juice", price: "200.00", quantity: 1 },
      ]);
    }
  }, [orderedItems.length]);

  return (
    <TabPane>
      <PreOrderTitle>Your Pre-order</PreOrderTitle>

      <OrderedItemList>
        {orderedItems.length === 0 && <p>No items added yet.</p>}
        {orderedItems.map((item) => (
          <OrderedItem key={item.id}>
            <RemoveButton onClick={() => handleRemoveItem(item.id)}>
              ✕
            </RemoveButton>
            <OrderedItemName>{item.name}</OrderedItemName>
            <OrderedItemDetails>
              <OrderedItemPrice>
                {formatCurrency(parseFloat(item.price))}
              </OrderedItemPrice>
              <OrderedItemQuantity>
                <OrderQuantityChanger
                  onClick={() => handleQuantityChange(item.id, -1)}
                >
                  -
                </OrderQuantityChanger>
                <OrderQuantity type="number" value={item.quantity} readOnly />
                <OrderQuantityChanger
                  onClick={() => handleQuantityChange(item.id, 1)}
                >
                  +
                </OrderQuantityChanger>
              </OrderedItemQuantity>
            </OrderedItemDetails>
          </OrderedItem>
        ))}
      </OrderedItemList>

      <TotalDisplay>Total: {formatCurrency(getTotal())}</TotalDisplay>

      <AdditionalNotes>
        <label htmlFor="notes">Additional Notes</label>
        <AdditionalNotesTextarea
          id="notes"
          value={additionalNotes}
          onChange={(e) => setAdditionalNotes(e.target.value)}
          placeholder="e.g., No onions, please"
        />
        <PreOrderSubmitBtn onClick={handleSubmit}>
          Submit Pre-order
        </PreOrderSubmitBtn>
      </AdditionalNotes>
    </TabPane>
  );
};

export default PreOrderTab;
