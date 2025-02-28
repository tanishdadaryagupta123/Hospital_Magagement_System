import React, { useContext, useEffect } from "react";
import "./App.css";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./Pages/Home";
import Appointment from "./Pages/Appointment";
import AboutUs from "./Pages/AboutUs";
import Register from "./Pages/Register";
import Footer from "./components/Footer";
import Navbar from "./components/Navbar";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axios from "axios";
import { Context } from "./main";
import Login from "./Pages/Login";

const App = () => {
  const { isAuthenticated, setIsAuthenticated, setUser } = useContext(Context);

  useEffect(() => {
    const checkAuth = async () => {
      const isAuth = localStorage.getItem('isAuthenticated') === 'true';
      if (isAuth) {
        try {
          const response = await axios.get(
            "http://localhost:3000/api/v1/user/patient/me",
            {
              withCredentials: true,
              headers: {
                "Content-Type": "application/json"
              }
            }
          );
          
          if (response.data.success) {
            setIsAuthenticated(true);
            setUser(response.data.user);
          } else {
            setIsAuthenticated(false);
            setUser({});
            localStorage.removeItem('isAuthenticated');
          }
        } catch (error) {
          console.error("Error fetching user:", error.message);
          setIsAuthenticated(false);
          setUser({});
          localStorage.removeItem('isAuthenticated');
        }
      }
    };
    checkAuth();
  }, []);

  return (
    <>
      <Router>
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/appointment" element={<Appointment />} />
          <Route path="/about" element={<AboutUs />} />
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login />} />
        </Routes>
        <Footer />
        <ToastContainer
          position="top-center"
          autoClose={3000}
          hideProgressBar={false}
          newestOnTop
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme="colored"
        />
      </Router>
    </>
  );
};

export default App;
