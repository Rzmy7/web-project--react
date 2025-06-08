// import React, { useState, useEffect } from "react";
// import styled from "styled-components";
// import { Link, useLocation } from "react-router-dom";
// import LoginModal from "./Login";
// import SignupModal from "./SignUpModal";

// // ---------------- Styled Components ---------------- //

// const Header = styled.header`
//   background-color: var(--primary-color);
//   color: var(--secondary-color);
//   padding: 2rem;
//   width: 100%;
//   position: sticky;
//   top: 0;
//   z-index: 1001;
//   box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
// `;

// const HeaderContainer = styled.div`
//   display: flex;
//   justify-content: space-between;
//   align-items: center;
//   max-width: 1500px;
//   margin: 0 auto;
//   flex-wrap: wrap;
// `;

// const Logo = styled.div`
//   h1 {
//     font-size: 1.5rem;
//     font-weight: 600;
//   }

//   span {
//     color: var(--accent-color);
//   }
// `;

// const Nav = styled.nav`
//   ul {
//     display: flex;
//     list-style: none;
//     flex-wrap: wrap;
//   }

//   li {
//     margin-left: 1.5rem;
//   }

//   li a {
//     font-weight: 550;
//   }

//   a {
//     color: var(--secondary-color);
//     font-weight: 500;
//     transition: color 0.3s ease;

//     &:hover {
//       color: var(--accent-color);
//     }
//   }

//   @media (max-width: 768px) {
//     width: 100%;
//     margin-top: 1rem;
//     max-height: ${(props) => (props.$isOpen ? "500px" : "0")};
//     opacity: ${(props) => (props.$isOpen ? "1" : "0")};
//     visibility: ${(props) => (props.$isOpen ? "visible" : "hidden")};
//     transform: ${(props) =>
//       props.$isOpen ? "translateY(0)" : "translateY(-20px)"};
//     transition: all 0.4s ease;
//     overflow: hidden;

//     ul {
//       flex-direction: column;

//       li {
//         margin: 0.75rem 0;
//         margin-left: 0;
//         a {
//           font-size: 1.1rem;
//         }
//       }
//     }
//   }
// `;

// const AuthButtons = styled.div`
//   display: flex;
//   gap: 1rem;

//   @media (max-width: 768px) {
//     width: 100%;
//     margin-top: 1rem;
//     justify-content: space-between;
//     max-height: ${(props) => (props.$isOpen ? "500px" : "0")};
//     opacity: ${(props) => (props.$isOpen ? "1" : "0")};
//     visibility: ${(props) => (props.$isOpen ? "visible" : "hidden")};
//     transform: ${(props) =>
//       props.$isOpen ? "translateY(0)" : "translateY(-20px)"};
//     transition: all 0.4s ease;
//     overflow: hidden;
//   }
// `;

// const LoginBtn = styled.button`
//   background-color: transparent;
//   border: 1px solid var(--secondary-color);
//   color: var(--secondary-color);
//   padding: 0.5rem 1rem;
//   border-radius: 4px;
//   font-weight: 500;
//   cursor: pointer;

//   &:hover {
//     background-color: rgba(255, 255, 255, 0.1);
//   }
// `;

// const SignupBtn = styled.button`
//   background-color: var(--accent-color);
//   color: var(--secondary-color);
//   padding: 0.5rem 1rem;
//   border-radius: 4px;
//   font-weight: 500;
//   cursor: pointer;

//   &:hover {
//     background-color: var(--hover-accent-color);
//   }
// `;

// const MobileMenuBtn = styled.button`
//   display: none;
//   background: none;
//   border: none;
//   position: relative;
//   width: 30px;
//   height: 30px;
//   cursor: pointer;

//   @media (max-width: 768px) {
//     display: flex;
//     align-items: center;
//     justify-content: center;
//   }

//   span {
//     display: block;
//     width: 24px;
//     height: 3px;
//     background: var(--secondary-color);
//     position: absolute;
//     transition: all 0.3s ease;
//     border-radius: 2px;

//     &:nth-child(1) {
//       transform: ${(props) =>
//         props.$isOpen ? "rotate(45deg) translate(5px, 5px)" : "translateY(-8px)"};
//     }

//     &:nth-child(2) {
//       opacity: ${(props) => (props.$isOpen ? "0" : "1")};
//     }

//     &:nth-child(3) {
//       transform: ${(props) =>
//         props.$isOpen ? "rotate(-45deg) translate(7px, -7px)" : "translateY(8px)"};
//     }
//   }
// `;

// const Overlay = styled.div`
//   position: fixed;
//   top: 0;
//   left: 0;
//   z-index: 2000;
//   width: 100vw;
//   height: 100vh;
//   backdrop-filter: blur(6px);
//   background-color: rgba(0, 0, 0, 0.4);
//   display: flex;
//   justify-content: center;
//   align-items: center;
//   overflow-y: auto;
// `;const UserSection = styled.div`
//   position: relative;
// `;

// const UserIcon = styled.div`
//   cursor: pointer;
//   font-size: 1.5rem;
//   user-select: none;
// `;

// const UserDetails = styled.div`
//   position: absolute;
//   top: 2.5rem;
//   right: 0;
//   background: white;
//   color: var(--text-color);
//   border: 1px solid var(--medium-gray);
//   padding: 1rem;
//   border-radius: 0.3rem;
//   box-shadow: 0 2px 6px rgba(0, 0, 0, 0.2);
//   z-index: 2000;
//   width: 220px;
// `;

// const LogoutBtn = styled.button`
//   background-color: var(--accent-color);
//   color: white;
//   border: none;
//   padding: 0.4rem 0.8rem;
//   margin-top: 1rem;
//   border-radius: 0.2rem;
//   cursor: pointer;

//   &:hover {
//     background-color: var(--hover-accent-color);
//   }
// `;

// // ---------------- Header Component ---------------- //

// function HeaderComponent() {
//   const [isMenuOpen, setIsMenuOpen] = useState(false);
//   const [authMode, setAuthMode] = useState(null); // 'login' | 'signup'
//   const location = useLocation();

//   const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

//   useEffect(() => {
//     setIsMenuOpen(false);
//   }, [location.pathname]);

//   const handleCloseModal = () => setAuthMode(null);

//   return (
//     <>
//       <Header>
//         <HeaderContainer>
//           <Logo>
//             <Link to="/">
//               <h1>
//                 <span style={{ color: "var(--secondary-color)" }}>UoM</span>
//                 <span style={{ color: "var(--accent-color)" }}>Facilities</span>
//               </h1>
//             </Link>
//           </Logo>

//           <MobileMenuBtn $isOpen={isMenuOpen} onClick={toggleMenu}>
//             <span></span>
//             <span></span>
//             <span></span>
//           </MobileMenuBtn>

//           <Nav $isOpen={isMenuOpen}>
//             <ul>
//               {["Home", "Facilities", "About", "Review", "UoMFacilities", "UoMFacHome"].map(
//                 (item, index) => (
//                   <li key={item} style={{ "--index": index }}>
//                     <Link to={`/${item === "Home" ? "" : item}`}>{item}</Link>
//                   </li>
//                 )
//               )}
//             </ul>
//           </Nav>

//           <AuthButtons $isOpen={isMenuOpen}>
//             <LoginBtn onClick={() => setAuthMode("login")}>Login</LoginBtn>
//             <SignupBtn onClick={() => setAuthMode("signup")}>Sign Up</SignupBtn>
//           </AuthButtons>

//         </HeaderContainer>
//       </Header>

//       {authMode && (
//         <Overlay onClick={handleCloseModal}>
//           <div onClick={(e) => e.stopPropagation()}>
//             {authMode === "login" ? (
//               <LoginModal isOpen onClose={handleCloseModal} />
//             ) : (
//               <SignupModal isOpen onClose={handleCloseModal} />
//             )}
//           </div>
//         </Overlay>
//       )}
//     </>
//   );
// }

// export default HeaderComponent;

import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { Link, useLocation } from "react-router-dom";
import LoginModal from "./Login";
import SignupModal from "./SignUpModal";
import UserProfile from "./UserProfile";
import { UserRound } from "lucide-react";

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
        props.$isOpen
          ? "rotate(45deg) translate(5px, 5px)"
          : "translateY(-8px)"};
    }

    &:nth-child(2) {
      opacity: ${(props) => (props.$isOpen ? "0" : "1")};
    }

    &:nth-child(3) {
      transform: ${(props) =>
        props.$isOpen
          ? "rotate(-45deg) translate(7px, -7px)"
          : "translateY(8px)"};
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

const UserSection = styled.div`
  position: relative;
`;

const UserIcon = styled.div`
  cursor: pointer;
  justify-self: flex-start;
  font-size: 1.5rem;
  user-select: none;
`;
const DesktopOnly = styled.div`
  display: none;

  @media (min-width: 769px) {
    display: block;
  }
`;

const MobileOnly = styled.div`
  display: block;

  @media (min-width: 769px) {
    display: none;
  }
`;

const NavList = styled.ul`
  list-style: none;
  display: flex;
  justify-content: space-around;
  width: 30dvw; 

  /* gap: 20px; */
  padding: 0;
  margin: 0;

  @media (max-width: 768px) {
    flex-direction: column;
    align-items: self-start;
  }
`;

const NavItem = styled.li`
  --index: ${props => props.index};
  transition: transform 0.3s ease calc(var(--index) * 0.1s);

  &:hover {
    transform: translateY(-2px);
  }
`;

const NavLink = styled(Link)`
  color: var(--text-color);
  text-decoration: none;
  font-size: 1.1rem;
  font-weight: 500;

  &:hover {
    color: var(--primary-color);
  }
`;

// ---------------- Header Component ---------------- //

function HeaderComponent() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [authMode, setAuthMode] = useState(null); // 'login' | 'signup'
  const location = useLocation();

  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState(null);
  const [showUserDetails, setShowUserDetails] = useState(false);

  // Load user from localStorage or mock (for now)
  useEffect(() => {
    const stored = localStorage.getItem("user");
    if (stored) {
      setUser(JSON.parse(stored));
      setIsLoggedIn(true);
      console.log(stored);
      if (stored) {
    try {
      const parsedUser = JSON.parse(stored);
      console.log('Parsed user:', parsedUser);
      setUser(parsedUser);
      setIsLoggedIn(true);
      console.log("user id:", parsedUser.user_id);
    } catch (error) {
      console.error('Error parsing user from localStorage:', error);
    }
  } else {
    console.log('No user data in localStorage');
  }
    }
  }, []);

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
              {/* Mobile view – show user or auth buttons */}
              {isMenuOpen && (
                <MobileOnly>
                  {" "}
                  <li style={{ marginBottom: "1rem" }}>
                    {isLoggedIn ? (
                      <>
                        <UserIcon
                          onClick={() => setShowUserDetails((prev) => !prev)}
                        >
                          <UserRound size={20} />
                        </UserIcon>
                        {showUserDetails && user && (
                          <UserProfile
                            user={user}
                            setIsLoggedIn={setIsLoggedIn}
                            setUser={setUser}
                            setShowUserDetails={setShowUserDetails}
                          />
                        )}
                      </>
                    ) : (
                      <div
                        style={{
                          display: "flex",
                          flexDirection: "column",
                          gap: "0.5rem",
                        }}
                      >
                        <LoginBtn onClick={() => setAuthMode("login")}>
                          Login
                        </LoginBtn>
                        <SignupBtn onClick={() => setAuthMode("signup")}>
                          Sign Up
                        </SignupBtn>
                      </div>
                    )}
                  </li>
                </MobileOnly>
              )}

              {/* {[
                "Home",
                "Facilities",
                "About",
                `Orders/${user.user_id}`,
                "UoMFacilities",
                "UoMFacHome",
              ].map((item, index) => (
                <li key={item} style={{ "--index": index }}>
                  <Link to={`/${item === "Home" ? "" : item}`}>{item}</Link>
                </li>
              ))} */}
              <NavList>
        <NavItem index={0}>
          <NavLink to="/">Home</NavLink>
        </NavItem>
        {/* <NavItem index={1}>
          <NavLink to="/Facilities">Facilities</NavLink>
        </NavItem> */}
        {user && user.user_id && (
          <NavItem index={2}>
            <NavLink to={`/Orders/${user.user_id}`}>Orders</NavLink>
          </NavItem>
        )}
        <NavItem index={3}>
          <NavLink to="/About">About</NavLink>
        </NavItem>
        
        {/* <NavItem index={4}>
          <NavLink to="/UoMFacilities">UoMFacilities</NavLink>
        </NavItem>
        <NavItem index={5}>
          <NavLink to="/UoMFacHome">UoMFacHome</NavLink>
        </NavItem> */}
      </NavList>
            </ul>
          </Nav>

          {isLoggedIn ? (
            <DesktopOnly>
              <UserSection>
                <UserIcon onClick={() => setShowUserDetails((prev) => !prev)}>
                  <UserRound size={20} />
                </UserIcon>
                {showUserDetails && user && (
                  <UserProfile
                    user={user}
                    setIsLoggedIn={setIsLoggedIn}
                    setUser={setUser}
                    setShowUserDetails={setShowUserDetails}
                  />
                )}
              </UserSection>
            </DesktopOnly>
          ) : (
            <DesktopOnly>
              <AuthButtons>
                <LoginBtn onClick={() => setAuthMode("login")}>Login</LoginBtn>
                <SignupBtn onClick={() => setAuthMode("signup")}>
                  Sign Up
                </SignupBtn>
              </AuthButtons>
            </DesktopOnly>
          )}
        </HeaderContainer>
      </Header>

      {authMode && (
        <Overlay onClick={handleCloseModal}>
          <div onClick={(e) => e.stopPropagation()}>
            {authMode === "login" ? (
              <LoginModal
                isOpen
                onClose={handleCloseModal}
                goToLogin={() => setAuthMode("signup")}
              />
            ) : (
              <SignupModal
                isOpen
                onClose={handleCloseModal}
                onSignupSuccess={() => setAuthMode("login")}
              />
            )}
          </div>
        </Overlay>
      )}
    </>
  );
}

export default HeaderComponent;
