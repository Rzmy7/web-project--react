import React, { useState} from 'react';
import styled from 'styled-components';

const Header = styled.header`
  background-color: var(--primary-color);
  color: var(--secondary-color);
  padding: 15px 30px;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  position: sticky;
  top: 0;
  z-index: 100;
`;

const HeaderContent = styled.div`
  width: 100%;
  max-width: 1200px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-wrap: wrap;
`;

const HeadContainer = styled.div`
  h2 {
    font-size: 24px;
    font-weight: bold;

    #facilities {
      color: var(--accent-color);
      font-weight: bold;
    }
  }
`;

const NavContainer = styled.div`
  margin-left: 40px;

  @media (max-width: 768px) {
    width: 100%;
    margin-top: 15px;
  }
`;

const NavLinks = styled.ul`
  list-style: none;
  display: flex;
  gap: 20px;

  @media (max-width: 768px) {
    flex-direction: column;
    gap: 10px;
    display: ${(props) => (props.active ? 'flex' : 'none')};
  }

  li a {
    color: #ffffff;
    text-decoration: none;
    text-transform: capitalize;
    font-weight: 500;
    transition: color 0.3s ease;

    &:hover {
      color: var(--accent-color);
    }
  }
`;

const UserInfo = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  font-weight: 500;
`;

const UserAvatar = styled.div`
  background-color: var(--accent-color);
  color: white;
  font-weight: bold;
  width: 35px;
  height: 35px;
  display: flex;
  justify-content: center;
  align-items: center;
  border-radius: 50%;
`;

const MobileMenuBtn = styled.button`
  display: none;
  background: none;
  border: none;
  font-size: 22px;
  color: white;
  cursor: pointer;

  @media (max-width: 768px) {
    display: block;
  }
`;

function Navbar({ setActiveSection ,shopOwner}) {
  const [menuOpen, setMenuOpen] = useState(false);
 

  const handleSectionChange = (sectionId) => {
    setActiveSection(sectionId);
    setMenuOpen(false); // Close mobile menu on section select
  };

  return (
    <Header>
      <HeaderContent>
        <HeadContainer>
          <h2>
            UoM<span id="facilities">Facilities</span> - <span>Shop owners</span>
          </h2>
        </HeadContainer>

        <NavContainer>
          <nav>
            <NavLinks active={menuOpen}>
              <li>
                <a href="#dashboard" onClick={() => handleSectionChange('dashboard')}>
                  Dashboard
                </a>
              </li>
              <li>
                <a href="#products" onClick={() => handleSectionChange('products')}>
                  Products
                </a>
              </li>
              <li>
                <a href="#preorder" onClick={() => handleSectionChange('preorder')}>
                  Pre Orders
                </a>
              </li>
              <li>
                <a href="#reviews" onClick={() => handleSectionChange('reviews')}>
                  Reviews
                </a>
              </li>
              <li>
                <a href="#settings" onClick={() => handleSectionChange('settings')}>
                  Settings
                </a>
              </li>
            </NavLinks>
          </nav>
        </NavContainer>

        <UserInfo>
          <UserAvatar></UserAvatar>
          <span>{shopOwner.full_name}</span>
        </UserInfo>

        <MobileMenuBtn onClick={() => setMenuOpen(!menuOpen)}>
          <i className="fas fa-bars"></i>
        </MobileMenuBtn>
      </HeaderContent>
    </Header>
  );
}

export default Navbar;