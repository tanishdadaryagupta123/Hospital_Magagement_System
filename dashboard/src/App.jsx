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
    const fetchUser = async () => {
      const isAuth = localStorage.getItem('isAuthenticated') === 'true';
      
      if (isAuth) {
        try {
          const response = await axios.get(
            "https://hospital-magagement-system.onrender.com/api/v1/user/admin/me",
            {
              withCredentials: true,
              headers: {
                "Content-Type": "application/json"
              }
            }
          );
          
          if (response.data.success) {
            setIsAuthenticated(true);
            setAdmin(response.data.user);
          } else {
            setIsAuthenticated(false);
            setAdmin({});
            localStorage.removeItem('isAuthenticated');
          }
        } catch (error) {
          console.error("Error fetching user:", error.message);
          setIsAuthenticated(false);
          setAdmin({});
          localStorage.removeItem('isAuthenticated');
        }
      } else {
        setIsAuthenticated(false);
        setAdmin({});
      }
    };
    fetchUser();
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
