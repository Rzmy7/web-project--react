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
  justify-content: center;
  flex-direction: column;
  row-gap: 1rem;
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
  width: 6.5rem;

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
const LinkSignup = styled.p`
  font-size: small;
  font-style: italic;
  margin: 0.5rem 0;

  span {
    color: var(--primary-color);
    cursor: pointer;
  }
`;

// ---------------- SignupModal Component ---------------- //

const SignupModal = ({ isOpen, onClose, onSignupSuccess }) => {
  const handleSubmit = async (e) => {
    e.preventDefault();
    // Add signup logic here

    if (formData.password !== formData.confirmPassword) {
      setFormError("Passwords do not match.");
      return;
    }

    // 🔐 2. Check if verification code matches generated OTP
    if (formData.verificationCode !== generatedOtp) {
      setFormError("Incorrect verification code.");
      return;
    }

    // ✅ Clear error and proceed
    setFormError("");

    // const now = new Date();
    // const date = now.toLocaleDateString("en-GB");
    // const time = now.toLocaleTimeString("en-GB");

    const updatedFormData = {
      full_name: formData.name,
      index_no: formData.indexNumber,
      email: formData.email,
      mobile_number: formData.mobileNumber,
      user_password: formData.password,
    };

    try {
      const response = await fetch("http://127.0.0.1:8001/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updatedFormData),
      });

      const result = await response.json();

      if (response.ok) {
        alert("Signup successful!");
        console.log("trigg");
        console.log("✅ SignupModal props:", {
          isOpen,
          onClose,
          onSignupSuccess,
        });

        if (onSignupSuccess) onSignupSuccess();
        setFormData({
          name: "",
          password: "",
          confirmPassword: "",
          indexNumber: "",
          mobileNumber: "",
          email: "",
          verificationCode: "",
          signupDate: "",
          signupTime: "",
        });

        // Optionally reset the form
      } else {
        setFormError(result.error || "Signup failed");
      }
    } catch (error) {
      console.error("Error:", error);
      setFormError("Network or server error.");
    }

    console.log("Signup submitted");
    console.log("Form Data:", updatedFormData);
  };

  const [OtpBtnLable, setOtpBtnLabel] = useState("Send OTP");
  const [OtpNum, setOtpNum] = useState(0);
  const [OtpClickable, setOtpClickable] = useState(true);
  const [generatedOtp, setGeneratedOtp] = useState("");
  const [formError, setFormError] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [isSendingOtp, setIsSendingOtp] = useState(false);

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
    signupDate: "",
    signupTime: "",
  });

  const isEmailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email);

  const generateOtp = () => {
    return Math.floor(100000 + Math.random() * 900000).toString();
  };

  const handleOtpBtn = async () => {
    if (!OtpClickable || !isEmailValid || isSendingOtp) return;

    setIsSendingOtp(true);
    setOtpBtnLabel("Sending...");

    const nextTry = OtpNum + 1;
    setOtpNum(nextTry);

    const otp = generateOtp();
    setGeneratedOtp(otp);
    console.log("Generated OTP:", otp);

    try {
      const response = await fetch("http://127.0.0.1:8001/send-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
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
      setOtpBtnLabel("Sent"); // ✅ Show sent text
      setOtpSent(true);
      setIsSendingOtp(false);

      setTimeout(() => {
        setOtpBtnLabel("Resend OTP");
        setIsSendingOtp(false); // ✅ Re-enable after timeout
      }, 1500);

      // ✅ Delay to change to "Resend OTP"
      setTimeout(() => {
        setOtpBtnLabel("Resend OTP");
      }, 1500);
      setOtpSent(true); // ✅ Enable verification code input
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
              disabled={!OtpClickable || !isEmailValid || isSendingOtp}
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
              disabled={!otpSent} // ✅ disable unless otpSent is true
              style={{
                backgroundColor: !otpSent ? "#f1f1f1" : "white",
                cursor: !otpSent ? "not-allowed" : "auto",
              }}
              onChange={(e) =>
                setFormData({ ...formData, verificationCode: e.target.value })
              }
            />
          </FormGroup>

          <LinkSignup>
            Don't have an account?<span onClick={onSignupSuccess}>Log in</span>{" "}
          </LinkSignup>

          <ModalFooter>
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <ModalButton
                type="button"
                className="cancel-btn"
                onClick={onClose}
              >
                Cancel
              </ModalButton>
              <ModalButton type="submit" className="submit-btn">
                Sign Up
              </ModalButton>
            </div>
            <div>
              {formError && (
                <p
                  style={{
                    color: "red",
                    fontWeight: 500,
                    marginBottom: "1rem",
                  }}
                >
                  {formError}
                </p>
              )}
            </div>
          </ModalFooter>
        </form>
      </ModalContent>
    </ModalOverlay>
  );
};

export default SignupModal;
