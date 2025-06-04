import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { Link, useLocation } from "react-router-dom";
import LoginModal from "./Login";
import SignupModal from "./SignUpModal";

// ---------------- Styled Components ---------------- //

const Header = styled.header`
  background-color: var(--primary-color);
  color: var(--secondary-color);
  padding: 2rem;
  width: 100%;
  position: sticky;
  top: 0;
  z-index: 1001;
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
    max-height: ${(props) => (props.$isOpen ? "500px" : "0")};
    opacity: ${(props) => (props.$isOpen ? "1" : "0")};
    visibility: ${(props) => (props.$isOpen ? "visible" : "hidden")};
    transform: ${(props) =>
      props.$isOpen ? "translateY(0)" : "translateY(-20px)"};
    transition: all 0.4s ease;
    overflow: hidden;

    ul {
      flex-direction: column;

      li {
        margin: 0.75rem 0;
        margin-left: 0;
        a {
          font-size: 1.1rem;
        }
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
    justify-content: space-between;
    max-height: ${(props) => (props.$isOpen ? "500px" : "0")};
    opacity: ${(props) => (props.$isOpen ? "1" : "0")};
    visibility: ${(props) => (props.$isOpen ? "visible" : "hidden")};
    transform: ${(props) =>
      props.$isOpen ? "translateY(0)" : "translateY(-20px)"};
    transition: all 0.4s ease;
    overflow: hidden;
  }
`;

const LoginBtn = styled.button`
  background-color: transparent;
  border: 1px solid var(--secondary-color);
  color: var(--secondary-color);
  padding: 0.5rem 1rem;
  border-radius: 4px;
  font-weight: 500;
  cursor: pointer;

  &:hover {
    background-color: rgba(255, 255, 255, 0.1);
  }
`;

const SignupBtn = styled.button`
  background-color: var(--accent-color);
  color: var(--secondary-color);
  padding: 0.5rem 1rem;
  border-radius: 4px;
  font-weight: 500;
  cursor: pointer;

  &:hover {
    background-color: var(--hover-accent-color);
  }
`;

const MobileMenuBtn = styled.button`
  display: none;
  background: none;
  border: none;
  position: relative;
  width: 30px;
  height: 30px;
  cursor: pointer;

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
      transform: ${(props) =>
        props.$isOpen ? "rotate(45deg) translate(5px, 5px)" : "translateY(-8px)"};
    }

    &:nth-child(2) {
      opacity: ${(props) => (props.$isOpen ? "0" : "1")};
    }

    &:nth-child(3) {
      transform: ${(props) =>
        props.$isOpen ? "rotate(-45deg) translate(7px, -7px)" : "translateY(8px)"};
    }
  }
`;

const Overlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  z-index: 2000;
  width: 100vw;
  height: 100vh;
  backdrop-filter: blur(6px);
  background-color: rgba(0, 0, 0, 0.4);
  display: flex;
  justify-content: center;
  align-items: center;
  overflow-y: auto;
`;

// ---------------- Header Component ---------------- //

function HeaderComponent() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [authMode, setAuthMode] = useState(null); // 'login' | 'signup'
  const location = useLocation();

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

  useEffect(() => {
    setIsMenuOpen(false);
  }, [location.pathname]);

  const handleCloseModal = () => setAuthMode(null);

  return (
    <>
      <Header>
        <HeaderContainer>
          <Logo>
            <Link to="/">
              <h1>
                <span style={{ color: "var(--secondary-color)" }}>UoM</span>
                <span style={{ color: "var(--accent-color)" }}>Facilities</span>
              </h1>
            </Link>
          </Logo>

          <MobileMenuBtn $isOpen={isMenuOpen} onClick={toggleMenu}>
            <span></span>
            <span></span>
            <span></span>
          </MobileMenuBtn>

          <Nav $isOpen={isMenuOpen}>
            <ul>
              {["Home", "Facilities", "About", "Review", "UoMFacilities", "UoMFacHome"].map(
                (item, index) => (
                  <li key={item} style={{ "--index": index }}>
                    <Link to={`/${item === "Home" ? "" : item}`}>{item}</Link>
                  </li>
                )
              )}
            </ul>
          </Nav>

          <AuthButtons $isOpen={isMenuOpen}>
            <LoginBtn onClick={() => setAuthMode("login")}>Login</LoginBtn>
            <SignupBtn onClick={() => setAuthMode("signup")}>Sign Up</SignupBtn>
          </AuthButtons>
        </HeaderContainer>
      </Header>

      {authMode && (
        <Overlay onClick={handleCloseModal}>
          <div onClick={(e) => e.stopPropagation()}>
            {authMode === "login" ? (
              <LoginModal isOpen onClose={handleCloseModal} />
            ) : (
              <SignupModal isOpen onClose={handleCloseModal} />
            )}
          </div>
        </Overlay>
      )}
    </>
  );
}

export default HeaderComponent;
