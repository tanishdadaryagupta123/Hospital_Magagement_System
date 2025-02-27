import React, { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { useLocation } from "react-router-dom";
import "./Doctors.css";

const Doctors = () => {
  const [doctors, setDoctors] = useState([]);
  const location = useLocation();
  const newDoctor = location.state?.newDoctor;
  const justAdded = location.state?.justAdded;

  const fetchDoctors = async () => {
    try {
      const response = await axios.get(
        "http://localhost:3000/api/v1/user/doctor/getall",
        {
          withCredentials: true,
          headers: {
            "Content-Type": "application/json",
            "x-api-key": "796358263762899"
          }
        }
      );

      if (response.data.success) {
        setDoctors(response.data.doctors);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Error fetching doctors");
    }
  };

  useEffect(() => {
    fetchDoctors();
    
    if (justAdded && newDoctor) {
      toast.success("New doctor added successfully!");
    }
  }, [justAdded, newDoctor]);

  return (
    <div className="doctors-container">
      <div className="doctors-header">
        <h2>Our Medical Specialists</h2>
        <p>Meet our team of experienced healthcare professionals</p>
      </div>
      
      <div className="doctors-grid">
        {doctors.length > 0 ? (
          doctors.map((doctor) => (
            <div 
              key={doctor._id} 
              className={`doctor-card ${newDoctor?._id === doctor._id ? 'highlight-new' : ''}`}
            >
              <div className="doctor-card-header">
                <div className="doctor-image">
                  <img 
                    src={doctor.docAvatar?.url || "/docHolder.jpg"} 
                    alt={`${doctor.firstName} ${doctor.lastName}`} 
                  />
                </div>
                <h3>{`Dr. ${doctor.firstName} ${doctor.lastName}`}</h3>
                <span className="department">{doctor.doctorDepartment}</span>
              </div>
              
              <div className="doctor-card-body">
                <div className="info-item">
                  <i className="fas fa-envelope"></i>
                  <span>{doctor.email}</span>
                </div>
                <div className="info-item">
                  <i className="fas fa-phone"></i>
                  <span>{doctor.phone}</span>
                </div>
                <div className="info-item">
                  <i className="fas fa-venus-mars"></i>
                  <span>{doctor.gender}</span>
                </div>
                <div className="info-item">
                  <i className="fas fa-id-card"></i>
                  <span>{doctor.nic}</span>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="no-doctors">
            <i className="fas fa-user-md"></i>
            <h3>No Doctors Found</h3>
            <p>There are no registered doctors at the moment.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Doctors;
