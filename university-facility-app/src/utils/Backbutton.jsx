import styled from "styled-components";
import { useNavigate } from "react-router-dom";

const Button = styled.button`
  background: transparent;
  border: none;
  color: var(--primary-color);
  cursor: pointer;
  display: flex;
  align-items: center;
  margin-bottom: 1.7rem;
  font-weight: 650;
  font-size: small;

  &:before {
    content: "←";
    margin-right: 0.5rem;
  }

  &:hover {
    color: var(--hover-accent-color);
  }

  &:active {
    color: var(--dark-gray);
  }
`;

function BackButton() {
  const navigate = useNavigate();
  const handleBack = () => {
    navigate(-1);
  };
  return <Button onClick={handleBack}>Back to Home</Button>;
}

export default BackButton;
