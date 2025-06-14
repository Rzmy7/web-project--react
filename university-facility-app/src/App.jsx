import { Routes, Route, useLocation } from "react-router-dom";
import Home from "./pages/Home";
import Facilities from "./components/Facilities";
import About from "./pages/About";
import Navbar from "./components/Navbar";
import Review from "./pages/Review";
import UOMFacilities from "./pages/ufshop";
import ShopPage from "./pages/ufshop";
import UOMFacHome from "./pages/ufhome";
import styled from "styled-components";
import Footer from "./components/Footer";
import FacilityDetails from "./pages/ViewShop";
import ScrollToTop from "./utils/ScrolledUp";
import OrderPage from "./pages/Orders";
import "./index.css";
import socket from "./socket";
import { ToastContainer } from 'react-toastify';


import { useRef, useEffect } from "react";

const MainContent = styled.div`
  max-width: 1500px;
  justify-self: "center";
  padding: 0 5rem;
  background-color: var(--secondary-color);
  display: flex;
  width: 100%;
  justify-self: center;

  @media (max-width: 768px) {
    padding: 0 1rem;
    display: flex;
    justify-self: center;
  }
`;

function App() {
  const { pathname } = useLocation();
  const scrollRef = useRef();

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTo({
        top: 0,
        behavior: "smooth",
      });
    }
  }, [pathname]);
  useEffect(() => {
    socket.connect();

    return () => {
      socket.disconnect(); // Clean up
    };
  }, []);
  return (
    <div ref={scrollRef} style={{ overflowY: "scroll", height: "100vh" }}>
      <Navbar />
      <ScrollToTop />
      <MainContent>
        <Routes>
          <Route path="/" element={<UOMFacHome />} />
          <Route path="/facilities" element={<Facilities />} />
          <Route path="/about" element={<About />} />
          <Route path="/Orders/:clientId" element={<OrderPage />} />
          <Route path="/UoMFacilities" element={<UOMFacilities />} />
          <Route path="/facilityItems/:shopId" element={<ShopPage />} />
          <Route path="/UOMFacHome" element={<UOMFacHome />} />
          <Route path="/FacilityDetails" element={<FacilityDetails />} />
          <Route path="/facility/:facilityId" element={<FacilityDetails />} />
        </Routes>
      </MainContent>
      <ToastContainer 
          position="top-right" 
          autoClose={3000} 
          hideProgressBar={false} 
          newestOnTop={false} 
          closeOnClick 
          rtl={false} 
          pauseOnFocusLoss 
          draggable 
          pauseOnHover 
        />
      <Footer />
    </div>
  );
}

export default App;
