import React from "react";
import styled from "styled-components";
import { useState } from "react";

// Styled Components
const ModalOverlay = styled.div`
  display: ${(props) => (props.isOpen ? "flex" : "none")};
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  z-index: 1000;
  justify-content: center;
  align-items: center;
`;

const ModalContent = styled.div`
  background-color: white;
  padding: 2rem;
  border-radius: 8px;
  max-width: 500px;
  width: 90%;
`;

const ModalHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
`;

const ModalTitle = styled.h3`
  color: var(--primary-color);
`;

const CloseButton = styled.button`
  background: none;
  border: none;
  font-size: 1.5rem;
  cursor: pointer;
  color: var(--dark-gray);
`;

const FormGroup = styled.div`
  margin-bottom: 1.5rem;

  label {
    display: block;
    margin-bottom: 0.5rem;
    font-weight: 500;
  }

  input {
    width: 100%;
    padding: 0.5rem;
    border: 1px solid var(--medium-gray);
    border-radius: 4px;
  }
`;

const ModalFooter = styled.div`
  display: flex;
  justify-content: flex-end;
`;

const ModalButton = styled.button`
  padding: 0.5rem 1rem;
  border: none;
  border-radius: 4px;
  font-weight: 500;
  cursor: pointer;
  margin-left: 0.5rem;

  &.cancel-btn {
    background-color: var(--medium-gray);
    color: var(--text-color);
  }

  &.submit-btn {
    background-color: var(--primary-color);
    color: white;
  }
`;

const LinkSignup = styled.p`
  font-size:small;
  font-style: italic;
  margin: 0.5rem 0;

  span{
    color: var(--primary-color);
    cursor: pointer;
  }
` ;

// Component
const LoginModal = ({ isOpen, onClose,goToLogin }) => {
  const [loginData, setLoginData] = useState({
    email: "",
    password: "",
  });
  const [loginError, setLoginError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoginError("");

    try {
      const response = await fetch("http://127.0.0.1:8001/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(loginData),
      });

      const result = await response.json();
      console.log(result);
      console.log(result.user);

      if (response.ok) {
        localStorage.setItem("user", JSON.stringify(result.user)); // Save to localStorage
        alert("Login successful!");
        onClose(); // Close modal
        window.location.reload(); // Optional: refresh UI
      } else {
        setLoginError(result.error || "Login failed");
      }
    } catch (err) {
      console.error(err);
      setLoginError("Server or network error");
    }
  };

  return (
    <ModalOverlay isOpen={isOpen} onClick={onClose}>
      <ModalContent onClick={(e) => e.stopPropagation()}>
        <ModalHeader>
          <ModalTitle>Login to UoM Facilities</ModalTitle>
          <CloseButton onClick={onClose}>&times;</CloseButton>
        </ModalHeader>

        <form onSubmit={handleSubmit}>
          <FormGroup>
            <label htmlFor="loginEmail">Email</label>
            <input
              type="email"
              id="loginEmail"
              required
              value={loginData.email}
              onChange={(e) =>
                setLoginData({ ...loginData, email: e.target.value })
              }
            />
          </FormGroup>

          <FormGroup>
            <label htmlFor="loginPassword">Password</label>
            <input
              type="password"
              id="loginPassword"
              required
              value={loginData.password}
              onChange={(e) =>
                setLoginData({ ...loginData, password: e.target.value })
              }
            />
          </FormGroup>

          <LinkSignup>Don't have an account?<span onClick={goToLogin}>SignUp</span> </LinkSignup>

          {loginError && (
            <p style={{ color: "red", fontWeight: "500" }}>{loginError}</p>
          )}

          <ModalFooter>
            <ModalButton type="button" className="cancel-btn" onClick={onClose}>
              Cancel
            </ModalButton>
            <ModalButton type="submit" className="submit-btn">
              Login
            </ModalButton>
          </ModalFooter>
        </form>
      </ModalContent>
    </ModalOverlay>
  );
};

export default LoginModal;
