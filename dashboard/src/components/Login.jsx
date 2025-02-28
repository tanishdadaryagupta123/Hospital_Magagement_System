import React, { useContext, useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { Context } from "../main";
import axios from "axios";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const { isAuthenticated, setIsAuthenticated, setAdmin } = useContext(Context);

  const navigateTo = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    
    try {
      // Basic validation
      if (!email || !password || !confirmPassword) {
        toast.error("All fields are required");
        return;
      }
      
      if (password !== confirmPassword) {
        toast.error("Passwords do not match");
        return;
      }
      
      const response = await axios.post(
        "https://hospital-magagement-system.onrender.com/api/v1/user/login",
        { email, password, confirmPassword, role: "Admin" },
        {
          withCredentials: true,
          headers: { 
            "Content-Type": "application/json",
          },
        }
      );
      
      if (response.data.success) {
        toast.success(response.data.message);
        setIsAuthenticated(true);
        localStorage.setItem('isAuthenticated', 'true');
        
        // Store user data in localStorage for persistence
        localStorage.setItem('adminUser', JSON.stringify(response.data.user));
        setAdmin(response.data.user);
        
        // Clear form fields
        setEmail("");
        setPassword("");
        setConfirmPassword("");
        
        // Navigate to dashboard
        navigateTo("/");
      }
    } catch (error) {
      const errorMessage = error.response?.data?.message || "Login failed. Please try again.";
      toast.error(errorMessage);
    }
  };

  if (isAuthenticated) {
    return <Navigate to={"/"} />;
  }

  return (
    <>
      <section className="container form-component">
        <img src="/logo.png" alt="logo" className="logo" />
        <h1 className="form-title">WELCOME TO ZEECARE</h1>
        <p>Only Admins Are Allowed To Access These Resources!</p>
        <form onSubmit={handleLogin}>
          <input
            type="text"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <input
            type="password"
            placeholder="Confirm Password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
          />
          <div style={{ justifyContent: "center", alignItems: "center" }}>
            <button type="submit">Login</button>
          </div>
        </form>
      </section>
    </>
  );
};

export default Login;