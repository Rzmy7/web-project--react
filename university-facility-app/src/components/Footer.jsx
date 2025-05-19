import React from 'react';
import styled from 'styled-components';

// Styled components for the footer
const FooterStyled = styled.footer`
 position:relative;
  bottom: 0;
  background-color: ${props => props.primaryColor || '#1a3c34'};
  color: white;
  padding: 2rem 1rem;
  display: flex;
  justify-content: space-evenly;
  width: 100%;
`;

const FooterContainer = styled.div`
  max-width: 1500px;
  margin: 0 auto;
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
`;

const FooterSection = styled.div`
  flex: 1;
  min-width: 200px;
  margin-bottom: 1.5rem;
`;

const SectionTitle = styled.h4`
  font-size: 1.2rem;
  font-weight: 670;
  margin-bottom: 1rem;
  color: ${props => props.accentColor || '#f4a261'};
`;

const List = styled.ul`
  list-style: none;
`;

const ListItem = styled.li`
  margin-bottom: 0.5rem;
`;

const Link = styled.a`
  color: white;
  transition: color 0.3s ease;
  &:hover {
    color: ${props => props.accentColor || '#f4a261'};
  }
`;

const FooterBottom = styled.div`
  text-align: center;
  padding-top: 1.5rem;
  margin-top: 1.5rem;
  border-top: 1px solid rgba(255, 255, 255, 0.1);
  width: 100%;
`;

// Footer component
const Footer = ({ primaryColor, accentColor }) => {
  return (
    <FooterStyled primaryColor={primaryColor}>
      <FooterContainer>
        <FooterSection>
          <SectionTitle accentColor={accentColor}>About</SectionTitle>
          <List>
            <ListItem><Link href="#" accentColor={accentColor}>About UoM Facilities</Link></ListItem>
            <ListItem><Link href="#" accentColor={accentColor}>Our Team</Link></ListItem>
            <ListItem><Link href="#" accentColor={accentColor}>How It Works</Link></ListItem>
            <ListItem><Link href="#" accentColor={accentColor}>Contact Us</Link></ListItem>
          </List>
        </FooterSection>
        <FooterSection>
          <SectionTitle accentColor={accentColor}>Facilities</SectionTitle>
          <List>
            <ListItem><Link href="#" accentColor={accentColor}>All Canteens</Link></ListItem>
            <ListItem><Link href="#" accentColor={accentColor}>All Juice Bars</Link></ListItem>
            <ListItem><Link href="#" accentColor={accentColor}>All Book Shops</Link></ListItem>
            <ListItem><Link href="#" accentColor={accentColor}>Campus Map</Link></ListItem>
          </List>
        </FooterSection>
        <FooterSection>
          <SectionTitle accentColor={accentColor}>For Facility Owners</SectionTitle>
          <List>
            <ListItem><Link href="#" accentColor={accentColor}>Update Your Info</Link></ListItem>
            <ListItem><Link href="#" accentColor={accentColor}>Manage Pre-orders</Link></ListItem>
            <ListItem><Link href="#" accentColor={accentColor}>Facility Dashboard</Link></ListItem>
            <ListItem><Link href="#" accentColor={accentColor}>Support</Link></ListItem>
          </List>
        </FooterSection>
        <FooterSection>
          <SectionTitle accentColor={accentColor}>For Students</SectionTitle>
          <List>
            <ListItem><Link href="#" accentColor={accentColor}>Create Account</Link></ListItem>
            <ListItem><Link href="#" accentColor={accentColor}>Pre-order System</Link></ListItem>
            <ListItem><Link href="#" accentColor={accentColor}>Your Reviews</Link></ListItem>
            <ListItem><Link href="#" accentColor={accentColor}>Help</Link></ListItem>
          </List>
        </FooterSection>
        <FooterBottom>
          <p>© 2025 University of Moratuwa. All Rights Reserved.</p>
        </FooterBottom>
      </FooterContainer>
    </FooterStyled>
  );
};

export default Footer;