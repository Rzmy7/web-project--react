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
    justify-content: first baseline;
  }
`;

const ProductCategory = styled.div`
  margin-bottom: 3rem;

  h2 {
    margin-top: 20px;
    margin-bottom: 30px;
  }
`;

const AddButton = styled.div`
  margin-bottom: 1rem;

  button {
    background-color: transparent;
    width: 120px;
    border: 1px solid var(--primary-color);
    color: var(--primary-color);
    border-radius: 3px;
    font-size: 16px;
    text-align: center;
    padding: 5px;
    cursor: pointer;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);

    &:hover {
      background-color: var(--primary-color);
      color: var(--secondary-color);
      border: 1px solid var(--primary-color);
    }
  }
`;

const ItemList = styled.div`
  margin-top: 20px;
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 15px;
`;

const FoodItem = styled.div`
  border: 1px solid #e0e0e0;
  border-radius: 5px;
  padding: 15px;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const ItemInfo = styled.div`
  flex: 1;

  h4 {
    margin: 0 0 5px 0;
  }

  p {
    margin: 0 0 10px 0;
    color: #666;
  }

  .item-status {
    display: flex;
    align-items: center;
    margin-top: 5px;
  }

  .status-text-item {
    font-size: 14px;
    font-weight: bold;
  }
`;

const CheckboxWrapper = styled.label`
  display: inline-block;
  position: relative;

  .switch {
    position: relative;
    display: inline-block;
    width: 40px;
    height: 20px;
    cursor: pointer;
    background: #ddd;
    border-radius: 20px;
    transition: all 0.3s;
    margin: 0 8px;
  }

  .switch::after {
    content: '';
    position: absolute;
    width: 18px;
    height: 18px;
    border-radius: 18px;
    background-color: white;
    top: 1px;
    left: 1px;
    transition: all 0.3s;
  }

  input[type='checkbox'] {
    display: none;
  }

  input[type='checkbox']:checked + .switch::after {
    transform: translateX(20px);
  }

  input[type='checkbox']:checked + .switch {
    background-color: #4cd964;
  }
`;

const ItemActions = styled.div`
  display: flex;
  gap: 10px;

  .edit-btn, .delete-btn {
    border-radius: 3px;
    font-size: 16px;
    text-align: center;
    padding: 5px;
    cursor: pointer;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
  }

  .edit-btn {
    background-color: transparent;
    border: 1px solid var(--primary-color);
    color: var(--primary-color);
  }

  .edit-btn:hover {
    background-color: var(--primary-color);
    color: var(--secondary-color);
  }

  .delete-btn {
    background-color: transparent;
    border: 1px solid var(--danger);
    color: var(--danger);
    font-size: 13px;
  }

  .delete-btn:hover {
    background-color: var(--danger);
    color: var(--secondary-color);
  }
`;

const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
`;

const ModalContent = styled.div`
  background: white;
  padding: 2rem;
  border-radius: 8px;
  width: 400px;
  max-width: 90%;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
`;

const ModalForm = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;

  input {
    padding: 0.5rem;
    border: 1px solid #ccc;
    border-radius: 4px;
    font-size: 1rem;
  }

  button {
    padding: 0.5rem;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    font-size: 1rem;
  }

  .submit-btn {
    background-color: var(--primary-color);
    color: var(--secondary-color);
  }

  .cancel-btn {
    background-color: #ccc;
    color: #333;
  }
`;

const ConfirmDelete = styled.div`
  text-align: center;

  p {
    margin-bottom: 1rem;
  }

  button {
    padding: 0.5rem 1rem;
    margin: 0 0.5rem;
    border: none;
    border-radius: 4px;
    cursor: pointer;
  }

  .confirm-btn {
    background-color: #e74c3c;
    color: white;
  }

  .cancel-btn {
    background-color: #ccc;
    color: #333;
  }
`;

function Products() {
  const [categories, setCategories] = useState([
    {
      title: 'canteen products',
      items: [
        { id: 1, name: 'Egg bun', price: 'LKR 90.000' },
        { id: 2, name: 'Rolls', price: 'LKR 70.00' },
        { id: 3, name: 'Fish bun', price: 'LKR 50.00' }
      ]
    },
    {
      title: 'juice bar products',
      items: [
        { id: 1, name: 'Chocolate milk shake', price: 'LKR 340.000' },
        { id: 2, name: 'Watermellon', price: 'LKR 120.00' },
        { id: 3, name: 'Banana boat', price: 'LKR 350.00' }
      ]
    },
    {
      title: 'bookshop accessories',
      items: [
        { id: 1, name: 'A4 sheet', price: 'LKR 10.000' },
        { id: 2, name: 'Pen', price: 'LKR 30.00' },
        { id: 3, name: 'Eraser', price: 'LKR 30.00' }
      ]
    }
  ]);

  const [showModal, setShowModal] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [newItem, setNewItem] = useState({ name: '', price: '', category: '' });
  const [editItem, setEditItem] = useState(null);
  const [itemToDelete, setItemToDelete] = useState(null);

  const handleAddItem = () => {
    if (!newItem.name || !newItem.price) return;

    setCategories(categories.map(category => {
      if (category.title === newItem.category) {
        return {
          ...category,
          items: [
            ...category.items,
            {
              id: category.items.length + 1,
              name: newItem.name,
              price: `LKR ${parseFloat(newItem.price).toFixed(3)}`
            }
          ]
        };
      }
      return category;
    }));

    setNewItem({ name: '', price: '', category: '' });
    setShowModal(false);
  };

  const handleEditItem = (item, categoryTitle) => {
    setEditItem({ ...item, category: categoryTitle });
    setShowModal(true);
  };

  const handleSaveEdit = () => {
    if (!editItem.name || !editItem.price) return;

    setCategories(categories.map(category => {
      if (category.title === editItem.category) {
        return {
          ...category,
          items: category.items.map(item =>
            item.id === editItem.id ? { ...editItem, price: `LKR ${parseFloat(editItem.price).toFixed(3)}` } : item
          )
        };
      }
      return category;
    }));

    setEditItem(null);
    setShowModal(false);
  };

  const handleDeleteConfirm = (item, categoryTitle) => {
    setItemToDelete({ item, category: categoryTitle });
    setShowDeleteConfirm(true);
  };

  const handleDelete = () => {
    if (itemToDelete) {
      setCategories(categories.map(category => {
        if (category.title === itemToDelete.category) {
          return {
            ...category,
            items: category.items.filter(item => item.id !== itemToDelete.item.id)
          };
        }
        return category;
      }));
    }
    setShowDeleteConfirm(false);
    setItemToDelete(null);
  };

  return (
    <Section id="products">
      <SectionHeader>
        <h1>Products</h1>
      </SectionHeader>

      {categories.map((category, index) => (
        <ProductCategory key={index}>
          <h2>{category.title}</h2>
          <AddButton>
            <button onClick={() => {
              setNewItem({ name: '', price: '', category: category.title });
              setShowModal(true);
            }}>
              Add new items
            </button>
          </AddButton>
          <ItemList>
            {category.items.map((item) => (
              <FoodItem key={`${category.title}-${item.id}`}>
                <ItemInfo>
                  <h4>{item.name}</h4>
                  <p>{item.price}</p>
                  <div className="item-status">
                    <span className="status-text-item"></span>
                    <CheckboxWrapper>
                      <input
                        id={`switch-${category.title}-${item.id}`}
                        type="checkbox"
                      />
                      <span className="switch"></span>
                    </CheckboxWrapper>
                  </div>
                </ItemInfo>
                <ItemActions>
                  <button className="edit-btn" onClick={() => handleEditItem(item, category.title)}>Edit</button>
                  <button className="delete-btn" onClick={() => handleDeleteConfirm(item, category.title)}>Delete</button>
                </ItemActions>
              </FoodItem>
            ))}
          </ItemList>
        </ProductCategory>
      ))}

      {(showModal || showDeleteConfirm) && (
        <ModalOverlay onClick={() => { setShowModal(false); setShowDeleteConfirm(false); }}>
          <ModalContent onClick={(e) => e.stopPropagation()}>
            {showModal && (
              <ModalForm>
                <h3>{editItem ? 'Edit Item' : 'Add New Item'}</h3>
                <input
                  type="text"
                  placeholder="Item Name"
                  value={editItem ? editItem.name : newItem.name}
                  onChange={(e) => (editItem ? setEditItem({ ...editItem, name: e.target.value }) : setNewItem({ ...newItem, name: e.target.value }))}
                />
                <input
                  type="number"
                  placeholder="Price (LKR)"
                  value={editItem ? editItem.price.replace('LKR ', '') : newItem.price}
                  onChange={(e) => (editItem ? setEditItem({ ...editItem, price: e.target.value }) : setNewItem({ ...newItem, price: e.target.value }))}
                />
                <button className="submit-btn" onClick={editItem ? handleSaveEdit : handleAddItem}>
                  {editItem ? 'Save Changes' : 'Add Item'}
                </button>
                <button className="cancel-btn" onClick={() => { setShowModal(false); setEditItem(null); }}>Cancel</button>
              </ModalForm>
            )}
            {showDeleteConfirm && (
              <ConfirmDelete>
                <p>Are you sure you want to delete {itemToDelete.item.name}?</p>
                <button className="confirm-btn" onClick={handleDelete}>Yes</button>
                <button className="cancel-btn" onClick={() => setShowDeleteConfirm(false)}>No</button>
              </ConfirmDelete>
            )}
          </ModalContent>
        </ModalOverlay>
      )}
    </Section>
  );
}

export default Products;