import React, { useContext, useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { Context } from "../main";
import axios from "axios";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const { isAuthenticated, setIsAuthenticated, setAdmin } = useContext(Context);

  const navigateTo = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    
    // Clear any previous authentication
    localStorage.removeItem('isAuthenticated');
    setIsAuthenticated(false);
    
    try {
      // Validate inputs
      if (!email || !password || !confirmPassword) {
        setError("All fields are required");
        setLoading(false);
        return;
      }
      
      if (password !== confirmPassword) {
        setError("Passwords do not match");
        setLoading(false);
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
      
      if (response && response.data && response.data.success) {
        // Set authentication in localStorage
        localStorage.setItem('isAuthenticated', 'true');
        
        // Set authentication in context
        setIsAuthenticated(true);
        
        // Try to fetch admin details immediately
        try {
          const adminResponse = await axios.get(
            "https://hospital-magagement-system.onrender.com/api/v1/user/admin/me",
            {
              withCredentials: true,
              headers: {
                "Content-Type": "application/json"
              }
            }
          );
          
          if (adminResponse.data.success) {
            setAdmin(adminResponse.data.user);
          }
        } catch (adminError) {
          console.error("Error fetching admin details:", adminError);
        }
        
        // Clear form fields
        setEmail("");
        setPassword("");
        setConfirmPassword("");
        
        // Navigate to dashboard
        navigateTo("/");
        
        // Show success message safely
        console.log("Login successful");
      } else {
        setError("Login failed. Please try again.");
      }
    } catch (error) {
      console.error("Login error:", error);
      const errorMessage = error.response?.data?.message || "Login failed. Please try again.";
      setError(errorMessage);
      
      // Clear authentication state on error
      localStorage.removeItem('isAuthenticated');
      setIsAuthenticated(false);
    } finally {
      setLoading(false);
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
        
        {error && (
          <div className="error-message" style={{ color: 'red', margin: '10px 0' }}>
            {error}
          </div>
        )}
        
        <form onSubmit={handleLogin}>
          <input
            type="text"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            disabled={loading}
            required
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            disabled={loading}
            required
          />
          <input
            type="password"
            placeholder="Confirm Password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            disabled={loading}
            required
          />
          <div style={{ justifyContent: "center", alignItems: "center" }}>
            <button type="submit" disabled={loading}>
              {loading ? "Logging in..." : "Login"}
            </button>
          </div>
        </form>
      </section>
    </>
  );
};

export default Login;