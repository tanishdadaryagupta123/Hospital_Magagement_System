import React, { useEffect, useState, useContext } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { useLocation, Navigate } from "react-router-dom";
import { Context } from "../main";
import "./Doctors.css";

const Doctors = () => {
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const location = useLocation();
  const newDoctor = location.state?.newDoctor;
  const justAdded = location.state?.justAdded;
  const { isAuthenticated } = useContext(Context);

  useEffect(() => {
    if (!isAuthenticated) {
      setLoading(false);
      return;
    }

    const fetchDoctors = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const response = await axios.get(
          "https://hospital-magagement-system.onrender.com/api/v1/user/doctor/getall",
          {
            withCredentials: true,
            headers: {
              "Content-Type": "application/json"
            }
          }
        );

        if (response.data.success) {
          setDoctors(response.data.doctors);
        } else {
          setDoctors([]);
        }
      } catch (error) {
        console.error("Error fetching doctors:", error);
        setError("Failed to load doctors. Please try again later.");
        setDoctors([]);
        
        // Use dummy data if in development mode
        if (process.env.NODE_ENV === 'development') {
          setDoctors([
            {
              _id: "1",
              firstName: "John",
              lastName: "Smith",
              email: "john.smith@example.com",
              phone: "123-456-7890",
              gender: "Male",
              nic: "123456789",
              doctorDepartment: "Cardiology",
              docAvatar: { url: "/docHolder.jpg" }
            },
            {
              _id: "2",
              firstName: "Sarah",
              lastName: "Johnson",
              email: "sarah.johnson@example.com",
              phone: "987-654-3210",
              gender: "Female",
              nic: "987654321",
              doctorDepartment: "Neurology",
              docAvatar: { url: "/docHolder.jpg" }
            }
          ]);
        }
      } finally {
        setLoading(false);
      }
    };

    fetchDoctors();
    
    if (justAdded && newDoctor) {
      toast.success("New doctor added successfully!");
    }
  }, [justAdded, newDoctor, isAuthenticated]);

  if (!isAuthenticated) {
    return <Navigate to={"/login"} />;
  }

  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading"></div>
        <p>Loading doctors...</p>
      </div>
    );
  }

  return (
    <section className="page doctors">
      <h1>DOCTORS</h1>
      
      {error ? (
        <div className="error-message">
          <p>{error}</p>
          <p>Please check your connection and try again.</p>
        </div>
      ) : (
        <div className="banner">
          {doctors.length > 0 ? (
            doctors.map((doctor) => (
              <div 
                key={doctor._id} 
                className={`card ${newDoctor?._id === doctor._id ? 'highlight-new' : ''}`}
              >
                <img 
                  src={doctor.docAvatar?.url || "/docHolder.jpg"} 
                  alt={`${doctor.firstName} ${doctor.lastName}`} 
                />
                <h4>{`Dr. ${doctor.firstName} ${doctor.lastName}`}</h4>
                <div className="details">
                  <p>
                    Department: <span>{doctor.doctorDepartment}</span>
                  </p>
                  <p>
                    Email: <span>{doctor.email}</span>
                  </p>
                  <p>
                    Phone: <span>{doctor.phone}</span>
                  </p>
                  <p>
                    Gender: <span>{doctor.gender}</span>
                  </p>
                  <p>
                    NIC: <span>{doctor.nic}</span>
                  </p>
                </div>
              </div>
            ))
          ) : (
            <div className="no-data-message">
              <h3>No Doctors Found!</h3>
              <p>There are currently no registered doctors.</p>
            </div>
          )}
        </div>
      )}
    </section>
  );
};

export default Doctors;
