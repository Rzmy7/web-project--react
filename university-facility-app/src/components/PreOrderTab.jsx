
import React, { useState, useEffect } from "react";
import styled from "styled-components";

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
  border: 1px solid var(--light-gray);
  border-radius: 0.3rem;
  box-shadow: 1px 1px 4px rgba(0,0,0,0.1);
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
