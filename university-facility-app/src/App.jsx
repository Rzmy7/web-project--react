import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Facilities from "./components/Facilities";
import About from "./pages/About";
import Navbar from "./components/Navbar";
import Review from "./pages/Review";
import UOMFacilities from "./pages/ufshop";
import UOMFacHome from "./pages/ufhome";
import styled from "styled-components";
import Footer from "./components/Footer";


const MainContent = styled.div`
  max-width: "1500px";
  justify-self: "center";
  padding: 0 5rem;
  background-color: #f8f9fa;

  @media (max-width: 768px) {
    padding: 0 1rem ;
  }
`;

function App() {
  return (
    <div className="min-h-screen  bg-white-100">
      <Navbar />
      <MainContent>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/facilities" element={<Facilities />} />
          <Route path="/about" element={<About />} />
          <Route path="/review" element={<Review />} />
          <Route path="/UoMFacilities" element={<UOMFacilities />} />
          <Route path="/UOMFacHome" element={<UOMFacHome />} />
        </Routes>
      </MainContent>
      <Footer primaryColor="#1a3064" accentColor="#e67e22" />
    </div>
  );
}

export default App;
