import React, { useState } from "react";
import ReactDOM from "react-dom/client";
import { ChakraProvider } from "@chakra-ui/react";
import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom";
import Login from "../pages/Login";
import Register from "../pages/Register";
import HomePage from "../pages/HotelPage/HomePage"
import SideNav from "../components/SideNav";
import BookCalendar from "../pages/HotelPage/BookCalendar";


const AppLayout = () => {
  const location = useLocation();
  const hideSidebar = ["/login", "/register"].includes(location.pathname);

  // ✅ Sidebar expand state
  const [isExpanded, setIsExpanded] = useState(true);

  return (
    <div style={{ display: "flex", width: "100vw", height: "100vh" }}>
      {!hideSidebar && <SideNav isExpanded={isExpanded} setIsExpanded={setIsExpanded} />} {/* Pass props */}
      
      {/* ✅ Main Content Adjusts Dynamically */}
      <div
        style={{
          marginLeft: hideSidebar ? "0" : isExpanded ? "250px" : "80px",
          padding: "20px",
          flexGrow: 1, // ✅ Ensures content expands when sidebar collapses
          transition: "margin-left 0.3s ease-in-out"
        }}
      >
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/homepage" element={<HomePage />} />
          <Route path="/book/:hotelId" element={<BookCalendar />} /> 
        </Routes>
      </div>
    </div>
  );
};

const App = () => (
  <ChakraProvider>
    <Router>
      <AppLayout />
    </Router>
  </ChakraProvider>
);

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
