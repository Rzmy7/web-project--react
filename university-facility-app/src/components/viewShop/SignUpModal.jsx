import React from "react";
import styled from "styled-components";

// ---------------- Styled Components ---------------- //

const ModalOverlay = styled.div`
  display: ${(props) => (props.isOpen ? "flex" : "none")};
  position: fixed;
  top: 0;
  left: 0;
  z-index: 1000;
  width: 100vw;
  height: 100vh;
  backdrop-filter: blur(6px);
  background-color: rgba(0, 0, 0, 0.5);
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
    color: white;
  }

  &.submit-btn {
    background-color: var(--accent-color);
    color: white;
  }
`;

// ---------------- SignupModal Component ---------------- //

const SignupModal = ({ isOpen, onClose }) => {
  const handleSubmit = (e) => {
    e.preventDefault();
    // Add signup logic here
    console.log("Signup submitted");
  };

  return (
    <ModalOverlay isOpen={isOpen} onClick={onClose}>
      <ModalContent onClick={(e) => e.stopPropagation()}>
        <ModalHeader>
          <ModalTitle>Create an Account</ModalTitle>
          <CloseButton onClick={onClose}>&times;</CloseButton>
        </ModalHeader>

        <form onSubmit={handleSubmit}>
          <FormGroup>
            <label htmlFor="signupName">Full Name</label>
            <input type="text" id="signupName" required />
          </FormGroup>

          <FormGroup>
            <label htmlFor="signupEmail">Email</label>
            <input type="email" id="signupEmail" required />
          </FormGroup>

          <FormGroup>
            <label htmlFor="signupPassword">Password</label>
            <input type="password" id="signupPassword" required />
          </FormGroup>

          <FormGroup>
            <label htmlFor="signupConfirmPassword">Confirm Password</label>
            <input type="password" id="signupConfirmPassword" required />
          </FormGroup>

          <ModalFooter>
            <ModalButton type="button" className="cancel-btn" onClick={onClose}>
              Cancel
            </ModalButton>
            <ModalButton type="submit" className="submit-btn">
              Sign Up
            </ModalButton>
          </ModalFooter>
        </form>
      </ModalContent>
    </ModalOverlay>
  );
};

export default SignupModal;
