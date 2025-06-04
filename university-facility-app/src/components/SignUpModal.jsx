import React, { useEffect, useState } from "react";
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
  @media (aspect-ratio: 128/75) {
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
  border-radius: 0.2rem;

  &:hover {
    background-color: var(--medium-gray);
    transition: all ease-in;
  }

  &:active {
    background-color: var(--text-color);
    color: var(--light-gray);
  }

  &:disabled {
    background-color: var(--ligth-gray);
    color: var(--medium-gray);
    border: 1px solid rgba(0, 0, 0, 0.1);
    cursor: not-allowed;
    pointer-events: none;
    opacity: 1;

    /* Optional: Prevent hover/active effects */
    &:hover,
    &:active {
      background-color: var(--text-gray);
      color: var(--light-gray);
    }
  }
`;

// ---------------- SignupModal Component ---------------- //

const SignupModal = ({ isOpen, onClose }) => {
  const handleSubmit = (e) => {
    e.preventDefault();
    // Add signup logic here
    console.log("Signup submitted");
    console.log("Form Data:", formData);
  };

  const [OtpBtnLable, setOtpBtnLabel] = useState("Send OTP");
  const [OtpNum, setOtpNum] = useState(0);
  const [OtpClickable, setOtpClickable] = useState(true);
  const [generatedOtp, setGeneratedOtp] = useState("");

  useEffect(() => {
    // Side effect logic here
    console.log(`${generatedOtp}`);
  }, [generatedOtp]);

  const [formData, setFormData] = useState({
    name: "",
    password: "",
    confirmPassword: "",
    indexNumber: "",
    mobileNumber: "",
    email: "",
    verificationCode: "",
  });

  const isEmailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email);

  const generateOtp = () => {
    return Math.floor(100000 + Math.random() * 900000).toString();
  };

  // const handleOtpBtn = () => {
  //   if (!OtpClickable) return;

  //   const nextTry = OtpNum + 1;
  //   setOtpNum(nextTry);

  //   // Simulate sending OTP
  //   const otp = generateOtp();
  //   setGeneratedOtp(otp);
  //   console.log("OTP sent!", otp);

  //   if (nextTry < 3) {
  //     // 1st and 2nd click - no delay
  //     setOtpBtnLabel("Resend OTP");
  //   } else if (nextTry === 3) {
  //     applyCooldown(15, "Resend OTP");
  //   } else if (nextTry === 4) {
  //     applyCooldown(20, "Resend OTP");
  //   } else if (nextTry === 5) {
  //     applyCooldown(30, "Resend OTP");
  //   } else {
  //     setOtpBtnLabel("Try again later");
  //     setOtpClickable(false);
  //   }
  // };

  const handleOtpBtn = async () => {
    if (!OtpClickable || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email))
      return;

    const nextTry = OtpNum + 1;
    setOtpNum(nextTry);

    const otp = generateOtp();
    setGeneratedOtp(otp); // Optional: for verification later

    console.log("Generated OTP:", otp);

    try {
      const response = await fetch("http://127.0.0.1:8001/send-otp", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: formData.email,
          otp: otp,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to send OTP");
      }

      console.log("OTP sent successfully:", data);
      setOtpBtnLabel("Resend OTP");
    } catch (error) {
      console.error("Error sending OTP:", error.message);
      setOtpBtnLabel("Error!");
    }

    // Apply cooldown (optional based on number of tries)
    if (nextTry === 3) applyCooldown(15, "Resend OTP");
    else if (nextTry === 4) applyCooldown(20, "Resend OTP");
    else if (nextTry === 5) applyCooldown(30, "Resend OTP");
    else if (nextTry > 5) {
      setOtpBtnLabel("Try again later");
      setOtpClickable(false);
    }
  };

  const applyCooldown = (seconds, nextLabel) => {
    setOtpClickable(false);
    let remaining = seconds;

    const timer = setInterval(() => {
      setOtpBtnLabel(`Wait ${remaining--}s`);
      if (remaining < 0) {
        clearInterval(timer);
        setOtpClickable(true);
        setOtpBtnLabel(nextLabel);
      }
    }, 1000);
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
            <input
              type="text"
              id="signupName"
              required
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
            />
          </FormGroup>

          <FormGroup>
            <label htmlFor="signupPassword">Password</label>
            <input
              type="password"
              id="signupPassword"
              required
              onChange={(e) =>
                setFormData({ ...formData, password: e.target.value })
              }
            />
          </FormGroup>

          <FormGroup>
            <label htmlFor="signupConfirmPassword">Confirm Password</label>
            <input
              type="password"
              id="signupConfirmPassword"
              required
              onChange={(e) =>
                setFormData({ ...formData, confirmPassword: e.target.value })
              }
            />
          </FormGroup>

          <FormGroup>
            <label htmlFor="indexNumber">Index Number</label>
            <input
              type="text"
              id="indexNumber"
              required
              onChange={(e) =>
                setFormData({ ...formData, indexNumber: e.target.value })
              }
            />
          </FormGroup>

          <FormGroup>
            <label htmlFor="mobileNumber">Mobile Number</label>
            <input
              type="tel"
              id="mobileNumber"
              pattern="[0-9]{10}"
              maxLength="10"
              required
              onChange={(e) =>
                setFormData({ ...formData, mobileNumber: e.target.value })
              }
            />
          </FormGroup>

          <FormGroup>
            <label htmlFor="signupEmail">Email</label>
            <input
              type="email"
              id="signupEmail"
              required
              onChange={(e) =>
                setFormData({ ...formData, email: e.target.value })
              }
            />
            <OtpButton
              type="button"
              onClick={handleOtpBtn}
              disabled={!OtpClickable || !isEmailValid}
            >
              {OtpBtnLable}
            </OtpButton>
          </FormGroup>

          <FormGroup>
            <label htmlFor="verificationCode">Verification Code</label>
            <input
              type="tel"
              id="verificationCode"
              required
              onChange={(e) =>
                setFormData({ ...formData, verificationCode: e.target.value })
              }
            />
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
