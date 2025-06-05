import React, { useState } from 'react';
import styled from 'styled-components';

// Styled components
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

const SettingsContainer = styled.div`
  border-radius: 12px;
  background-color: white;
  padding: 1rem;
  box-shadow: 1px 1px 3px 1px rgba(0, 0, 0, 0.1);
  margin: 2rem 0;
`;

const SettingsSection = styled.div`
  margin-bottom: 2rem;
  padding: 16px;
  border-radius: 8px;
  box-shadow: 1px 1px 3px 1px rgba(0, 0, 0, 0.1);
`;

const SectionTitle = styled.h3`
  color: var(--primary-color);
  margin: 0 0 16px 0;
  font-size: 1.2rem;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 8px;
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 16px;
`;

const Input = styled.input`
  padding: 8px;
  border: 1px solid var(--light-gray);
  border-radius: 4px;
  font-size: 1rem;
`;

const Button = styled.button`
  padding: 8px 16px;
  background: linear-gradient(90deg, var(--primary-color), #004085);
  color: white;
  border: 2px solid var(--primary-color);
  border-radius: 6px;
  cursor: pointer;
  font-size: 1rem;
  font-weight: 500;
  transition: transform 0.2s, box-shadow 0.2s;

  &:hover {
    transform: scale(1.03);
    box-shadow: 0 3px 6px rgba(0, 0, 0, 0.15);
  }
`;

const Toggle = styled.label`
  display: flex;
  align-items: center;
  gap: 8px;
  margin: 8px 0;
`;

const BusinessHoursGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
  gap: 16px;
`;

const BusinessHoursItem = styled.div`
  background-color: rgba(0, 123, 255, 0.05);
  padding: 12px;
  border-radius: 6px;
  transition: background-color 0.2s;

  &:hover {
    background-color: rgba(0, 123, 255, 0.1);
  }

  label {
    display: block;
    font-weight: 500;
    margin-bottom: 8px;
    color: var(--dark-gray);
  }

  input {
    border: 2px solid var(--light-gray);
    &:focus {
      border-color: var(--primary-color);
      outline: none;
    }
  }
`;

const ErrorMessage = styled.p`
  color: red;
  font-size: 0.9rem;
`;

const SuccessMessage = styled.p`
  color: green;
  font-size: 0.9rem;
  margin: 8px 0;
  padding: 8px;
  background-color: rgba(0, 128, 0, 0.1);
  border-radius: 4px;
`;

const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
`;

const ModalContent = styled.div`
  background-color: white;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 1px 1px 3px 1px rgba(0, 0, 0, 0.1);
  max-width: 400px;
  width: 100%;
  text-align: center;
`;

const ModalButton = styled(Button)`
  margin: 8px;
`;

// Settings Component
const Settings = () => {
  // State for shop details
  const [shopDetails, setShopDetails] = useState({
    shopName: 'L canteen',
    location: 'Buisness building',
    phone: '+94754480871',
    email: 'lcanteen@mail.com'
  });

  // State for business hours
  const [businessHours, setBusinessHours] = useState({
    monday: { open: '09:00', close: '17:00' },
    tuesday: { open: '09:00', close: '17:00' },
    wednesday: { open: '09:00', close: '17:00' },
    thursday: { open: '09:00', close: '17:00' },
    friday: { open: '09:00', close: '17:00' },
    saturday: { open: '10:00', close: '15:00' },
    sunday: { open: 'Closed', close: 'Closed' }
  });

  // State for social media links
  const [socialMedia, setSocialMedia] = useState({
    facebook: 'https://facebook.com/myawesomeshop',
    instagram: 'https://instagram.com/myawesomeshop',
    twitter: 'https://twitter.com/myawesomeshop'
  });

  // State for notification preferences
  const [notifications, setNotifications] = useState({
    email: true,
    sms: false
  });

  // State for form feedback
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [showModal, setShowModal] = useState(false);

  // Handle shop details input change
  const handleShopDetailsChange = (e) => {
    const { name, value } = e.target;
    setShopDetails((prev) => ({ ...prev, [name]: value }));
  };

  // Handle business hours change
  const handleBusinessHoursChange = (day, field, value) => {
    setBusinessHours((prev) => ({
      ...prev,
      [day]: { ...prev[day], [field]: value }
    }));
  };

  // Handle social media links change
  const handleSocialMediaChange = (e) => {
    const { name, value } = e.target;
    setSocialMedia((prev) => ({ ...prev, [name]: value }));
  };

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    setShowModal(true); // Show confirmation modal
  };

  // Handle modal confirm
  const handleConfirm = () => {
    setError('');
    setSuccess('');
    setShowModal(false);

    // Basic validation
    if (!shopDetails.shopName || !shopDetails.email) {
      setError('Shop name and email are required.');
      return;
    }
    if (!/\S+@\S+\.\S+/.test(shopDetails.email)) {
      setError('Please enter a valid email address.');
      return;
    }

    // Mock submission (replace with actual API call)
    console.log('Submitting shop details:', shopDetails);
    console.log('Submitting business hours:', businessHours);
    console.log('Submitting social media:', socialMedia);
    console.log('Submitting notifications:', notifications);

    setSuccess('Settings saved successfully!');
    setTimeout(() => setSuccess(''), 3000); // Clear success message after 3s
  };

  // Handle modal cancel
  const handleCancel = () => {
    setShowModal(false);
  };

  return (
    <Section id="settings">
      <SectionHeader>
        <h1>Settings</h1>
      </SectionHeader>
      <SettingsContainer>
        {/* Shop Details Section */}
        <SettingsSection>
          <SectionTitle>Shop Details</SectionTitle>
          <Form>
            <Input
              type="text"
              name="shopName"
              value={shopDetails.shopName}
              onChange={handleShopDetailsChange}
              placeholder="Shop Name"
              required
            />
            <Input
              type="text"
              name="location"
              value={shopDetails.location}
              onChange={handleShopDetailsChange}
              placeholder="Shop Location"
            />
            <Input
              type="tel"
              name="phone"
              value={shopDetails.phone}
              onChange={handleShopDetailsChange}
              placeholder="Phone Number"
            />
            <Input
              type="email"
              name="email"
              value={shopDetails.email}
              onChange={handleShopDetailsChange}
              placeholder="Email Address"
              required
            />
            {error && <ErrorMessage>{error}</ErrorMessage>}
            {success && <SuccessMessage>{success}</SuccessMessage>}
          </Form>
        </SettingsSection>

        {/* Business Hours Section */}
        <SettingsSection>
          <SectionTitle>Business Hours</SectionTitle>
          <Form onSubmit={handleSubmit}>
            <BusinessHoursGrid>
              {Object.keys(businessHours).map((day) => (
                <BusinessHoursItem key={day}>
                  <label>{day.charAt(0).toUpperCase() + day.slice(1)}</label>
                  <Input
                    type="text"
                    value={businessHours[day].open}
                    onChange={(e) => handleBusinessHoursChange(day, 'open', e.target.value)}
                    placeholder="Open (e.g., 09:00 or Closed)"
                  />
                  <Input
                    type="text"
                    value={businessHours[day].close}
                    onChange={(e) => handleBusinessHoursChange(day, 'close', e.target.value)}
                    placeholder="Close (e.g., 17:00 or Closed)"
                  />
                </BusinessHoursItem>
              ))}
            </BusinessHoursGrid>
            <Button type="submit">Save Changes</Button>
          </Form>
        </SettingsSection>

        {/* Social Media Links Section */}
        <SettingsSection>
          <SectionTitle>Social Media Links</SectionTitle>
          <Form>
            <Input
              type="url"
              name="facebook"
              value={socialMedia.facebook}
              onChange={handleSocialMediaChange}
              placeholder="Facebook URL"
            />
            <Input
              type="url"
              name="instagram"
              value={socialMedia.instagram}
              onChange={handleSocialMediaChange}
              placeholder="Instagram URL"
            />
            <Input
              type="url"
              name="twitter"
              value={socialMedia.twitter}
              onChange={handleSocialMediaChange}
              placeholder="Twitter URL"
            />
          </Form>
        </SettingsSection>

        {/* Notification Preferences Section */}
        <SettingsSection>
          <SectionTitle>Notification Preferences</SectionTitle>
          <Toggle>
            <input
              type="checkbox"
              checked={notifications.email}
              onChange={() => setNotifications((prev) => ({ ...prev, email: !prev.email }))}
            />
            Receive email notifications
          </Toggle>
          <Toggle>
            <input
              type="checkbox"
              checked={notifications.sms}
              onChange={() => setNotifications((prev) => ({ ...prev, sms: !prev.sms }))}
            />
            Receive SMS notifications
          </Toggle>
        </SettingsSection>
      </SettingsContainer>

      {/* Confirmation Modal */}
      {showModal && (
        <ModalOverlay>
          <ModalContent>
            <h3>Confirm Changes</h3>
            <p>Are you sure you want to save these changes?</p>
            <div>
              <ModalButton onClick={handleConfirm}>Confirm</ModalButton>
              <ModalButton onClick={handleCancel}>Cancel</ModalButton>
            </div>
          </ModalContent>
        </ModalOverlay>
      )}
    </Section>
  );
};

export default Settings;