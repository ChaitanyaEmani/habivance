import React from "react";
import { Route, Routes } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Navbar from "./components/common/Navbar";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Recommendations from "./pages/Recommendations";
import Analytics from "./pages/Analytics";
import Profile from "./pages/Profile";
import Routine from "./pages/Routine";
import Notifications from './pages/Notifications';
import Footer from "./components/common/Footer";
const App = () => {
  return (
    <div>
      <Navbar />
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
        theme="light" // Changed from dark to light for better visibility
        style={{ zIndex: 9999 }} // Ensure it's on top
        toastStyle={{
          backgroundColor: "#1f2937",
          color: "#ffffff",
          border: "1px solid #374151",
        }}
      />
      <Routes>
        
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login/>}/>
        <Route path="/register" element={<Register/>}/>
        <Route path="/routine" element={<Routine/>}/>
        <Route path="/recommendations" element={<Recommendations/>}/>
        <Route path="/analytics" element={<Analytics/>}/>
        <Route path="/notifications" element={<Notifications/>}/>
        <Route path="/profile" element={<Profile/>}/>
      </Routes>
      <Footer/>
    </div>
  );
};

export default App;
