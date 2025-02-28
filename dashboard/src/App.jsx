import React, { useContext, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Dashboard from "./components/Dashboard";
import Login from "./components/Login";
import AddNewDoctor from "./components/AddNewDoctor";
import Messages from "./components/Messages";
import Doctors from "./components/Doctors";
import { Context } from "./main";
import axios from "axios";
import "react-toastify/dist/ReactToastify.css";
import Sidebar from "./components/Sidebar";
import AddNewAdmin from "./components/AddNewAdmin";
import "./App.css";

const App = () => {
  const { isAuthenticated, setIsAuthenticated, admin, setAdmin } =
    useContext(Context);

  useEffect(() => {
    // Check if user is authenticated from localStorage
    const isAuth = localStorage.getItem('isAuthenticated') === 'true';
    
    if (isAuth) {
      // Set authentication state
      setIsAuthenticated(true);
      
      // Try to get admin data from localStorage
      const storedAdmin = localStorage.getItem('adminUser');
      if (storedAdmin) {
        try {
          const adminData = JSON.parse(storedAdmin);
          setAdmin(adminData);
        } catch (error) {
          console.error("Error parsing admin data:", error);
        }
      }
    } else {
      // Clear authentication state
      setIsAuthenticated(false);
      setAdmin({});
    }
  }, []);

  return (
    <Router>
      <Sidebar />
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/login" element={<Login />} />
        <Route path="/doctor/addnew" element={<AddNewDoctor />} />
        <Route path="/admin/addnew" element={<AddNewAdmin />} />
        <Route path="/messages" element={<Messages />} />
        <Route path="/doctors" element={<Doctors />} />
      </Routes>
    </Router>
  );
};

export default App;
