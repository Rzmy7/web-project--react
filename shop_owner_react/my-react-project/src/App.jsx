import React, { useState,useEffect } from 'react';
import styled from 'styled-components';
import Navbar from './navbar';
import DataFetcher from './DataFetcher';

// Main Content Styles
const MainContent = styled.div`
  max-width: 1500px;
  margin: 0 auto;
  padding: 2rem 5rem;
  background-color: var(--secondary-color);
  display: flex;
  flex-wrap: wrap;
  flex-direction: column;
  gap: 2rem;
  width: 100%;

  @media (max-width: 768px) {
    padding: 1rem;
    flex-direction: column;
  }
`;

// Login Page Styles
const LoginContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  background-color: var(--secondary-color, #ecf0f1);
`;

const LoginForm = styled.div`
  background-color: white;
  padding: 2rem;
  border-radius: 8px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  width: 100%;
  max-width: 400px;
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
`;

const LoginTitle = styled.h2`
  font-size: 24px;
  color: var(--primary-color, #2c3e50);
  text-align: center;
  margin-bottom: 1rem;
`;

const InputField = styled.input`
  padding: 0.75rem;
  border: 2px solid var(--light-gray, #ccc);
  border-radius: 5px;
  font-size: 16px;
  outline: none;
  transition: border-color 0.3s ease;

  &:focus {
    border-color: var(--primary-color, #2c3e50);
  }
`;

const SubmitButton = styled.button`
  padding: 0.75rem;
  background-color: var(--primary-color, #2c3e50);
  color: var(--secondary-color, #ecf0f1);
  border: none;
  border-radius: 5px;
  font-size: 16px;
  cursor: pointer;
  transition: background-color 0.3s ease;

  &:hover {
    background-color: #34495e;
  }
`;

const ErrorMessage = styled.div`
  color: var(--danger, #e74c3c);
  text-align: center;
  font-size: 14px;
`;

// Simple in-memory credentials (replace with backend API in production)

function App() {
  const [activeSection, setActiveSection] = useState('dashboard');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [shopOwner, setShopOwner] = useState(null);
  const [error, setError] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');


  useEffect(() => {
    const stored = localStorage.getItem("shopOwner");
    if (stored) {
      setShopOwner(JSON.parse(stored));
      setIsAuthenticated(true);
    }
  }, []);

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch("http://127.0.0.1:8001/shop-owner-login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const result = await response.json();

      if (response.ok) {
        localStorage.setItem("shopOwner", JSON.stringify(result.shop_owner));
        // Auto-reload page to refresh UI
        window.location.reload();
        console.log("Login successful:", result);
        setShopOwner(result.shop_owner);
      } else {
        setError(result.error || "Login failed");
      }
    } catch (err) {
      console.error(err);
      setError("Server error");
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("shopOwner");
    setShopOwner(null);
    setIsAuthenticated(false);
    setActiveSection('dashboard');
  };

  if (!isAuthenticated) {
    return (
      <LoginContainer>
        <LoginForm as="form" onSubmit={handleLogin}>
          <LoginTitle>Owner Login</LoginTitle>
          <InputField
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <InputField
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          {error && <ErrorMessage>{error}</ErrorMessage>}
          <SubmitButton type="submit">Login</SubmitButton>
        </LoginForm>
      </LoginContainer>
    );
  }
  

  return (
    
    <>
      <Navbar setActiveSection={setActiveSection} onLogout={handleLogout} shopOwner={shopOwner}/>
      <MainContent>
        <DataFetcher activeSection={activeSection} shopOwner={shopOwner} onLogout={handleLogout}/>
      </MainContent>
    </>
  );
}


export default App;