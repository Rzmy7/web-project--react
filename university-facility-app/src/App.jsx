import { Routes, Route } from "react-router-dom";
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
import "./index.css";
import FacilityDetails from "./pages/ViewShop";

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
  return (
    <div>
      <Navbar />
      <MainContent>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/facilities" element={<Facilities />} />
          <Route path="/about" element={<About />} />
          <Route path="/review" element={<Review />} />
          <Route path="/UoMFacilities" element={<UOMFacilities />} />
          <Route path="/shopItems/:shopName" element={<ShopPage />} />
          <Route path="/UOMFacHome" element={<UOMFacHome />} />
          <Route path="/FacilityDetails" element={<FacilityDetails />} />
        </Routes>
      </MainContent>
      <Footer />
    </div>
  );
}

export default App;
