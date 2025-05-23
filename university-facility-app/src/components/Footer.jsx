import React from 'react';
import styled from 'styled-components';
import '../index.css'

// Styled components for the footer
const FooterStyled = styled.footer`
 position:relative;
  bottom: 0;
  background-color: var(--primary-color);
  color: var(--secondary-color);
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

  @media (max-width: 768px){
    justify-content: center;
    justify-self: center;
  }
`;

const FooterSection = styled.div`
  flex: 1;
  min-width: 200px;
  justify-content: left;
  margin-bottom: 1.5rem;
`;

const SectionTitle = styled.h4`
  font-size: 1.2rem;
  font-weight: 670;
  margin-bottom: 1rem;
  color: var(--accent-color);
`;

const List = styled.ul`
  list-style: none;
`;

const ListItem = styled.li`
  margin-bottom: 0.5rem;
`;

const Link = styled.a`
  color: var(--secondary-color);
  transition: color 0.3s ease;
  &:hover {
    color: var(--accent-color);
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
const Footer = () => {
  return (
    <FooterStyled >
      <FooterContainer>
        <FooterSection>
          <SectionTitle >About</SectionTitle>
          <List>
            <ListItem><Link href="#" >About UoM Facilities</Link></ListItem>
            <ListItem><Link href="#" >Our Team</Link></ListItem>
            <ListItem><Link href="#" >How It Works</Link></ListItem>
            <ListItem><Link href="#" >Contact Us</Link></ListItem>
          </List>
        </FooterSection>
        <FooterSection>
          <SectionTitle >Facilities</SectionTitle>
          <List>
            <ListItem><Link href="#" >All Canteens</Link></ListItem>
            <ListItem><Link href="#" >All Juice Bars</Link></ListItem>
            <ListItem><Link href="#" >All Book Shops</Link></ListItem>
            <ListItem><Link href="#" >Campus Map</Link></ListItem>
          </List>
        </FooterSection>
        <FooterSection>
          <SectionTitle >For Facility Owners</SectionTitle>
          <List>
            <ListItem><Link href="#" >Update Your Info</Link></ListItem>
            <ListItem><Link href="#" >Manage Pre-orders</Link></ListItem>
            <ListItem><Link href="#" >Facility Dashboard</Link></ListItem>
            <ListItem><Link href="#" >Support</Link></ListItem>
          </List>
        </FooterSection>
        <FooterSection>
          <SectionTitle >For Students</SectionTitle>
          <List>
            <ListItem><Link href="#" >Create Account</Link></ListItem>
            <ListItem><Link href="#" >Pre-order System</Link></ListItem>
            <ListItem><Link href="#" >Your Reviews</Link></ListItem>
            <ListItem><Link href="#" >Help</Link></ListItem>
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




