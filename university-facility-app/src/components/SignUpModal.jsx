import React from "react";
import styled from "styled-components";

// ---------------- Styled Components ---------------- //

const ModalOverlay = styled.div`
  display: ${(props) => (props.isOpen ? "flex" : "none")};
  position: fixed;
  top: 0;
  left: 0;
  z-index: 1000;
  width: 100%;
  height: 100%;
  backdrop-filter: blur(6px);
  background-color: rgba(0, 0, 0, 0.5);
  justify-content: center;
  align-items: flex-start;
  overflow-y: auto;
  padding: 35vh 0 2rem 0;

  
  @media (min-aspect-ratio: 4/3) {
    padding-top: 4vh;
  }

  /* Taller screens (portrait) */
  @media (max-aspect-ratio: 3/4) {
    padding-top: 20vh;
  }

  @media (max-aspect-ratio: 1/2) {
    padding-top: 6vh;
  }
  @media (aspect-ratio:128/75) {
    padding-top: 40vh;
  }
`;

const ModalContent = styled.div`
  background-color: white;
  padding: 2rem;
  border-radius: 8px;
  max-width: 500px;
  width: 90%;
  margin: 2rem 0 1rem 0;
  align-self: center !important;
  position: relative;

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

const OtpButton = styled.button`
margin-top: 0.4rem;
  padding: 0.6rem;
  background-color: var(--light-gray);
  border-radius:0.2rem ;

  &:hover{
    background-color: var(--medium-gray);
    transition: all 0.3s ease-in-out;
  }

  &:active{
    background-color: var(--text-gray);
    color:var(--light-gray);
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
            <label htmlFor="signupName">Name</label>
            <input type="text" id="signupName" required />
          </FormGroup>

          <FormGroup>
            <label htmlFor="signupPassword">Password</label>
            <input type="password" id="signupPassword" required />
          </FormGroup>

          <FormGroup>
            <label htmlFor="signupConfirmPassword">Confirm Password</label>
            <input type="password" id="signupConfirmPassword" required />
          </FormGroup>

          <FormGroup>
            <label htmlFor="indexNumber">Index Number</label>
            <input type="text" id="indexNumber" required />
          </FormGroup>

          <FormGroup>
            <label htmlFor="mobileNumber">Mobile Number</label>
            <input
              type="tel"
              id="mobileNumber"
              pattern="[0-9]{10}"
              maxLength="10"
              required
            />
          </FormGroup>

          <FormGroup>
            <label htmlFor="signupEmail">Email</label>
            <input type="email" id="signupEmail" required />
            <OtpButton>Send OTP</OtpButton>
          </FormGroup>

          <FormGroup>
            <label htmlFor="verificationCode">Verification Code</label>
            <input type="tel" id="verificationCode" required />
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
