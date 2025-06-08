import React, { useState } from 'react';
import styled from 'styled-components';

const Section = styled.section`
  background-color: var(--secondary-color, #ecf0f1);
  width: 100%;
  max-width: 1800px;
  padding: 2rem;
  scroll-margin-top: 50px;
  margin-bottom: 30px;
  box-sizing: border-box;
`;

const DashboardTitle = styled.div`
  margin-bottom: 30px;
  color: var(--primary-color, #2c3e50);
  border-bottom: 2px solid var(--primary-color, #2c3e50);
  padding-bottom: 20px;
  display: flex;
  justify-content: space-between;
  align-items: center;

  h2 {
    font-size: 28px;
    margin: 0;
  }
`;

const LogoutButton = styled.button`
  padding: 0.5rem 1rem;
  background-color: var(--danger, #e74c3c);
  color: var(--secondary-color, #ecf0f1);
  border: none;
  border-radius: 5px;
  font-size: 14px;
  cursor: pointer;
  transition: background-color 0.3s ease;

  &:hover {
    background-color: #c0392b;
  }
`;

const OwnerDetails = styled.div`
  background-color: var(--secondary-color, #ecf0f1);
  border-radius: 5px;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.05);
  padding: 30px;
  border: 1px solid var(--light-gray, #ccc);
  display: flex;
  flex-direction: column;
  gap: 20px;
`;

const Title = styled.h2`
  font-size: 24px;
  color: var(--primary-color, #2c3e50);
  text-align: left;
  margin: 0 0 20px 0;
  border-bottom: 1px solid var(--light-gray, #ccc);
  padding-bottom: 10px;
`;

const ContentRow = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: flex-start;
  gap: 20px;

  @media (max-width: 1000px) {
    flex-direction: column;
    align-items: center;
  }
`;

const ImageWrapper = styled.div`
  flex: 0 0 auto;
`;

const CanteenImage = styled.img`
  width: 100%;
  max-width: 400px;
  height: auto;
  border-radius: 7px;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
  object-fit: cover;
  display: block;

  @media (max-width: 1000px) {
    max-width: 300px;
  }
`;

const ImageError = styled.div`
  color: var(--danger, #e74c3c);
  text-align: center;
  font-size: 14px;
`;

const OwnerInfo = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  flex: 1;
  padding: 0 20px;

  p {
    font-weight: bold;
    padding-bottom: 30px;
    text-align: center;
  }

  @media (max-width: 1000px) {
    padding: 0;
    width: 100%;
  }
`;

const StatusWrapper = styled.div`
  flex: 0 0 auto;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: flex-end;

  @media (max-width: 1000px) {
    align-items: center;
    width: 100%;
  }
`;

const ShopStatusStyle = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 16px;
  font-weight: bold;
  line-height: 20px;
`;

const CheckboxWrapper = styled.label`
  display: inline-flex;
  align-items: center;
  position: relative;

  .switch {
    position: relative;
    display: inline-block;
    width: 40px;
    height: 20px;
    cursor: pointer;
    background: var(--medium-gray, #ddd);
    border-radius: 20px;
    transition: all 0.3s;
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
    background-color: var(--success, #2c3e50);
  }
`;

const CrowdedStatusSelector = styled.div`
  display: flex;
  margin-top: 20px;
  flex-direction: column;
  gap: 8px;
  background-color: var(--secondary-color, #ecf0f1);
  padding: 20px;
  border-radius: 8px;
  width: 300px;

  label {
    font-weight: bold;
    color: var(--primary-color, #2c3e50);
    margin-bottom: 5px;
    text-transform: capitalize;
  }

  select {
    padding: 10px;
    border: 2px solid var(--border-color, #ccc);
    border-radius: 5px;
    font-size: 14px;
    color: var(--text-color, #333);
    background-color: var(--light-gray, #f5f5f5);
    outline: none;
    cursor: pointer;
    transition: all 0.3s ease;

    &:hover {
      border-color: var(--primary-color, #2c3e50);
    }

    &:focus {
      border-color: var(--primary-color, #2c3e50);
      box-shadow: 0 0 0 2px rgba(74, 111, 165, 0.2);
    }

    option {
      padding: 10px;
    }
  }

  @media (max-width: 1000px) {
    width: 100%;
    max-width: 300px;
  }
`;

const DashboardStats = styled.div`
  margin-top: 20px;
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(230px, 1fr));
  gap: 30px;
`;

const StatCard = styled.div`
  background-color: var(--secondary-color, #ecf0f1);
  border-radius: 5px;
  padding: 25px;
  text-align: center;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.05);

  h3 {
    text-transform: uppercase;
    font-size: 14px;
    color: var(--primary-color, #2c3e50);
    margin-bottom: 10px;
  }

  .number {
    font-size: 24px;
    font-weight: 400;
    color: var(--primary-color, #2c3e50);
  }
`;

const Notifications = styled.div`
  margin: 30px 0;
  color: var(--primary-color, #2c3e50);
  padding-bottom: 20px;

  h2 {
    margin-bottom: 20px;
    margin-top: 0;
  }
`;

const NotifiAlert = styled.div`
  display: flex;
  color: var(--dark-gray, #555);
  border: 1px solid var(--light-gray, #ccc);
  padding: 20px 10px;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.05);
  border-left: 2px solid var(--accent-color, #e74c3c);
  justify-content: space-between;
`;

const NotifiBtns = styled.div`
  button {
    font-size: 13px;
    padding: 5px;
    margin-left: 10px;
    border-radius: 3px;
    cursor: pointer;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
  }

  #preview-notifi {
    background-color: transparent;
    border: 1px solid var(--primary-color, #2c3e50);
    color: var(--primary-color, #2c3e50);

    &:hover {
      background-color: var(--primary-color, #2c3e50);
      color: var(--secondary-color, #ecf0f1);
    }
  }

  #delete-notifi {
    background-color: transparent;
    border: 1px solid var(--danger, #e74c3c);
    color: var(--danger, #e74c3c);

    &:hover {
      background-color: var(--danger, #e74c3c);
      color: var(--secondary-color, #ecf0f1);
    }
  }
`;

// const shopData={
//   "shopName": "L Canteen",
//   "imageUrl": "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
//   "imageAlt": "L Canteen",
//   "location": "Business Building",
//   "hours": "7.00AM - 6.00PM",
//   "stats": {
//     "availableItems": 10,
//     "pendingOrders": 5,
//     "completedOrders": 20,
//     "totalRevenue": 15000
//   },
//   "notifications": [
//     { "message": "New order received!" },
//     { "message": "Customer feedback submitted." },
//     { "message": "Low stock alert for rice." }
//   ]
// };

function Dashboard({ onLogout, shopOwner,shopData }) {
  const [isOpen, setIsOpen] = useState(false);
  const [imageError, setImageError] = useState(false);

  const handleStatusChange = () => {
    setIsOpen(!isOpen);
  };

  const handleImageError = () => {
    setImageError(true);
  };
  console.log("Dashboard rendered with shopOwner:", shopOwner);
  return (
    <Section id="dashboard">
      <DashboardTitle>
        <h2>Hello! {shopOwner.full_name}</h2>
        <LogoutButton onClick={onLogout}>Logout</LogoutButton>
      </DashboardTitle>

      <OwnerDetails>
        <Title>{shopData.shopName}</Title>
        <ContentRow>
          <ImageWrapper>
            {imageError ? (
              <ImageError>Failed to load canteen image</ImageError>
            ) : (
              <CanteenImage
                src={shopData.imageUrl}
                alt={shopData.imageAlt}
                onError={handleImageError}
              />
            )}
          </ImageWrapper>
          <OwnerInfo>
            <p id="name">Shop owner: {shopOwner.full_name}</p>
            <p id="location">Location: {shopData.location}</p>
            <p id="hours">Time: {shopData.hours}</p>
          </OwnerInfo>
          <StatusWrapper>
            <ShopStatusStyle>
              <span>Status:</span>
              <CheckboxWrapper>
                <input
                  type="checkbox"
                  checked={isOpen}
                  onChange={handleStatusChange}
                />
                <div className="switch"></div>
              </CheckboxWrapper>
              <span id="status-text">{isOpen ? 'Open' : 'Closed'}</span>
            </ShopStatusStyle>
            <CrowdedStatusSelector>
              <label htmlFor="crowded-status">Crowded Status:</label>
              <select id="crowded-status">
                <option value="crowded">Crowded (more than 15 people)</option>
                <option value="pcrowded">Partially Crowded</option>
                <option value="ncrowded">Not Crowded (less than 5 people)</option>
              </select>
            </CrowdedStatusSelector>
          </StatusWrapper>
        </ContentRow>
      </OwnerDetails>

      <DashboardStats>
        <StatCard>
          <h3>Available items</h3>
          <div className="number">{shopData.stats.availableItems}</div>
        </StatCard>
        <StatCard>
          <h3>Pending orders</h3>
          <div className="number">{shopData.stats.pendingOrders}</div>
        </StatCard>
        <StatCard>
          <h3>Completed orders</h3>
          <div className="number">{shopData.stats.completedOrders}</div>
        </StatCard>
        <StatCard>
          <h3>Total revenue</h3>
          <div className="number">Rs.{shopData.stats.totalRevenue}</div>
        </StatCard>
      </DashboardStats>

      <Notifications>
        <h2>Notifications</h2>
        {shopData.notifications.map((notification, index) => (
          <NotifiAlert key={index}>
            <span>{notification.message}</span>
            <NotifiBtns>
              <button id="preview-notifi">Preview</button>
              <button id="delete-notifi">Delete</button>
            </NotifiBtns>
          </NotifiAlert>
        ))}
      </Notifications>
    </Section>
  );
}

export default Dashboard;