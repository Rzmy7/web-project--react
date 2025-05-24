

import React, { useState } from "react";
import styled from "styled-components";
import { Link } from "react-router-dom";

// Define styled components
const Header = styled.header`
  background-color: var(--primary-color);
  color: var(--secondary-color);
  padding: 1rem;
  width: 100%;
  position: sticky;
  top: 0;
  z-index: 100;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
`;

const HeaderContainer = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  max-width: 1500px;
  margin: 0 auto;
  flex-wrap: wrap;
`;

const Logo = styled.div`
  h1 {
    font-size: 1.5rem;
    font-weight: 600;
  }

  span {
    color: var(--accent-color);
  }
`;

const Nav = styled.nav`
  ul {
    display: flex;
    list-style: none;
    flex-wrap: wrap;
  }

  li {
    margin-left: 1.5rem;
  }

  li a {
    font-weight: 550;
  }

  a {
    color: var(--secondary-color);
    font-weight: 500;
    transition: color 0.3s ease;

    &:hover {
      color: var(--accent-color);
    }
  }

  @media (max-width: 768px) {
    width: 100%;
    margin-top: 1rem;
    max-height: ${props => (props.isOpen ? '500px' : '0')};
    opacity: ${props => (props.isOpen ? '1' : '0')};
    visibility: ${props => (props.isOpen ? 'visible' : 'hidden')};
    transform: ${props => (props.isOpen ? 'translateY(0)' : 'translateY(-20px)')};
    transition: max-height 0.4s ease, opacity 0.4s ease, transform 0.4s ease, visibility 0.4s ease;
    overflow: hidden;
    ul {
      flex-direction: column;
      li {
        margin: 0.75rem 0;
        margin-left: 0;
        a {
          font-size: 1.1rem;
        }
        opacity: ${props => (props.isOpen ? '1' : '0')};
        transform: ${props => (props.isOpen ? 'translateY(0)' : 'translateY(-30px)')};
        transition: opacity 0.3s ease, transform 0.3s ease;
        transition-delay: ${props => (props.isOpen ? 'calc(0.1s * var(--index))' : '0s')};
      }
    }
  }
`;

const AuthButtons = styled.div`
  display: flex;
  gap: 1rem;

  @media (max-width: 768px) {
    width: 100%;
    margin-top: 1rem;
    gap: 0.5rem;
    justify-content: space-between;
    max-height: ${props => (props.isOpen ? '500px' : '0')};
    opacity: ${props => (props.isOpen ? '1' : '0')};
    visibility: ${props => (props.isOpen ? 'visible' : 'hidden')};
    transform: ${props => (props.isOpen ? 'translateY(0)' : 'translateY(-20px)')};
    transition: max-height 0.4s ease 0.1s, opacity 0.4s ease 0.1s, transform 0.4s ease 0.1s, visibility 0.4s ease 0.1s;
    overflow: hidden;
  }
`;

const LoginBtn = styled.button`
  background-color: transparent;
  border: 1px solid var(--secondary-color) !important;
  color: var(--secondary-color);
  padding: 0.5rem 1rem;
  border-radius: 4px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;

  &:hover {
    background-color: rgba(255, 255, 255, 0.1);
  }

  @media (max-width: 768px) {
    width: 100%;
    text-align: center;
  }
`;

const SignupBtn = styled.button`
  background-color: var(--accent-color);
  color: var(--secondary-color);
  padding: 0.5rem 1rem;
  border-radius: 4px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;

  &:hover {
    background-color: var(--hover-accent-color);
  }

  @media (max-width: 768px) {
    width: 100%;
    text-align: center;
  }
`;

const MobileMenuBtn = styled.button`
  display: none;
  background: none;
  border: none;
  color: var(--secondary-color);
  font-size: 1.5rem;
  cursor: pointer;
  position: relative;
  width: 30px;
  height: 30px;

  @media (max-width: 768px) {
    display: flex;
    align-items: center;
    justify-content: center;
  }

  span {
    display: block;
    width: 24px;
    height: 3px;
    background: var(--secondary-color);
    position: absolute;
    transition: all 0.3s ease;
    border-radius: 2px;

    &:nth-child(1) {
      transform: ${props => (props.isOpen ? 'rotate(45deg) translate(5px, 5px)' : 'translateY(-8px)')};
    }

    &:nth-child(2) {
      opacity: ${props => (props.isOpen ? '0' : '1')};
    }

    &:nth-child(3) {
      transform: ${props => (props.isOpen ? 'rotate(-45deg) translate(7px, -7px)' : 'translateY(8px)')};
    }
  }
`;

// Header component
function HeaderComponent() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <Header>
      <HeaderContainer>
        <Logo>
          <h1>
            UoM<span>Facilities</span>
          </h1>
        </Logo>
        <MobileMenuBtn id="mobileMenuBtn" isOpen={isMenuOpen} onClick={toggleMenu}>
          <span></span>
          <span></span>
          <span></span>
        </MobileMenuBtn>
        <Nav id="mainNav" isOpen={isMenuOpen}>
          <ul>
            {["Home", "Facilities", "About", "Review", "UoMFacilities", "UoMFacHome"].map((item, index) => (
              <li key={item} style={{ '--index': index }}>
                <Link to={`/${item === "Home" ? "" : item}`}>{item}</Link>
              </li>
            ))}
          </ul>
        </Nav>
        <AuthButtons id="authButtons" isOpen={isMenuOpen}>
          <LoginBtn id="loginBtn">Login</LoginBtn>
          <SignupBtn id="signupBtn">Sign Up</SignupBtn>
        </AuthButtons>
      </HeaderContainer>
    </Header>
  );
}

export default HeaderComponent;