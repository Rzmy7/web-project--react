
import React, { useState, useEffect } from "react";
import styled from "styled-components";
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';


dayjs.extend(utc);
dayjs.extend(timezone);

const TabPane = styled.div`
  display: flex;
  flex-direction: column;
  /* padding: 2rem; */
  font-family: sans-serif;
  width: 100%;
`;

const PreOrderTitle = styled.span`
  color: var(--primary-color);
  font-weight: 700;
  margin-bottom: 2rem;
  padding-bottom: 1rem;
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
  font-weight: 400;
`;

const OrderedItemDetails = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const OrderedItemPrice = styled.span`
  margin-top: 0.3rem;
  color: var(--primary-color);
`;

const OrderedItemQuantity = styled.div`
  display: flex;
  column-gap: 0.5rem;
  align-items: center;
`;

const OrderQuantityChanger = styled.button`
  background-color: transparent;
  border: 1px solid var(--medium-gray);
  padding: 0.2rem 0.6rem;
  border-radius: 4px;
  cursor: pointer;
  height: 1.7rem;

  &:hover {
    background-color: var(--medium-gray);
  }
`;

const OrderQuantity = styled.input`
  width: 2.5rem;
  text-align: center;
  height: 1.7rem;
  background-color: transparent;
  border: 1px solid var(--medium-gray);
`;

const RemoveButton = styled.button`
  position: absolute;
  top: 1.2rem;
  right: 9rem;
  background-color: transparent;
  color: var(--danger);
  border: 1px solid var(--danger);
  border-radius: 3px;
  font-size: 0.9rem;
  padding: 0.2rem 0.5rem;
  cursor: pointer;

  &:hover {
    background-color: var(--danger);
    color: var(--secondary-color);
  }

  
`;

const AdditionalNotes = styled.div`
  margin-top: 2rem;
`;

const AdditionalNotesTextarea = styled.textarea`
margin-top: 1rem;
  padding: 0.5rem;
  border: 1px solid var(--light-gray);
  border-radius: 0.3rem;
  box-shadow: 1px 1px 4px rgba(0,0,0,0.1);
  width: 100%;
  height: 100px;
  resize: none;
`;

const PreOrderSubmitBtn = styled.button`
  margin-top: 1rem;
  background-color: var(--success);
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
  color: var(--primary-color);
`;

// Currency formatter for LKR
const formatCurrency = (value) => {
  return new Intl.NumberFormat("en-LK", {
    style: "currency",
    currency: "LKR",
    minimumFractionDigits: 2,
  }).format(value);
};


const PreOrderTab = ({ PreOrderItems = [], setPreOrderedItems, shopId, noPreOrder }) => {
  // rest of your component


  const initializedItems = PreOrderItems.map(item => ({
    ...item,
    quantity: item.quantity || 1,
  }));

  const [orderedItems, setOrderedItems] = useState(initializedItems);
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
    setOrderedItems(prevItems =>
      prevItems.map(item =>
        item.id === id
          ? { ...item, quantity: Math.max(1, item.quantity + delta) }
          : item
      )
    );
  };

  const handleRemoveItem = (item) => {
    setOrderedItems(prev => prev.filter(i => i.id !== item.id));
    setPreOrderedItems("remove",item);
  };

  // const handleSubmit = e => {
  //   e.preventDefault();
  //   console.log("🛒 Ordered Items:", orderedItems);
  //   console.log("📝 Additional Notes:", additionalNotes);
  //   alert("Pre-order submitted! Check console for details.");
  // };

  const handleSubmit = async (e) => {
  e.preventDefault();

  const storedClient = localStorage.getItem('user'); // Assuming it's saved on login
  const client = storedClient ? JSON.parse(storedClient) : null;
  const clientId = client?.user_id;
  console.log("client ID",clientId);

  if (!clientId) {
    alert("Client not logged in.");
    return;
  }

  try {
    const responses = await Promise.all(orderedItems.map(async (item) => {
      const res = await fetch("http://127.0.0.1:8001/api/place_order", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          client_id: clientId,
          item_id: item.id,
          item_name: item.name,
          shop_id: shopId,
          quantity: item.quantity,
          notes: additionalNotes
        }),
      });

      const data = await res.json();
      console.log("Response for item", item.name, ":", data);
      return data;
    }));

    alert("Pre-order submitted!");
    console.log("All order responses:", responses);

    // Optionally clear state
    setOrderedItems([]);
setAdditionalNotes("");
localStorage.removeItem("orderedItems");
localStorage.removeItem("additionalNotes");
noPreOrder(); // clears in parent and resets badge

  } catch (err) {
    console.error("Failed to submit order:", err);
    alert("Something went wrong when submitting your order.");
  }
};


  const getTotal = () => {
    return orderedItems.reduce((acc, item) => {
      const numericPrice = parseFloat(item.price);
      return acc + numericPrice * item.quantity;
    }, 0);
  };

  return (
    <TabPane>
      <PreOrderTitle>Your Pre-order</PreOrderTitle>

      <OrderedItemList>
        {orderedItems.length === 0 && <p>No items added yet.</p>}
        {orderedItems.map(item => (
          <OrderedItem key={item.id}>
            <RemoveButton onClick={() => handleRemoveItem(item)}>✕</RemoveButton>
            <OrderedItemName>{item.name}</OrderedItemName>
            <OrderedItemDetails>
              <OrderedItemPrice>
                {formatCurrency(parseFloat(item.price))}
              </OrderedItemPrice>
              <OrderedItemQuantity>
                <OrderQuantityChanger onClick={() => handleQuantityChange(item.id, -1)}>
                  -
                </OrderQuantityChanger>

                <OrderQuantity
                  type="number"
                  value={item.quantity}
                  readOnly
                />

                <OrderQuantityChanger onClick={() => handleQuantityChange(item.id, 1)}>
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
