import React, { useContext, useEffect, useState } from "react";
import { Context } from "../main";
import { Navigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import { GoCheckCircleFill } from "react-icons/go";
import { AiFillCloseCircle } from "react-icons/ai";

const Dashboard = () => {
  const [appointments, setAppointments] = useState([]);
  const { isAuthenticated, admin } = useContext(Context);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Only attempt to fetch if authenticated
    if (!isAuthenticated) {
      setLoading(false);
      return;
    }

    const fetchAppointments = async () => {
      try {
        // Make sure we have the authentication cookie before making the request
        const token = localStorage.getItem('isAuthenticated');
        if (!token) {
          setError("Authentication token missing");
          setLoading(false);
          return;
        }

        const { data } = await axios.get(
          "https://hospital-magagement-system.onrender.com/api/v1/appointment/getall",
          { 
            withCredentials: true,
            headers: {
              "Content-Type": "application/json"
            }
          }
        );
        
        if (data && data.appointments) {
          setAppointments(data.appointments);
        } else {
          setAppointments([]);
        }
        setError(null);
      } catch (error) {
        console.error("Error fetching appointments:", error);
        setError("Failed to fetch appointments");
        setAppointments([]);
        
        // Don't show toast here to avoid the react-toastify error
        // We'll show the error in the UI instead
      } finally {
        setLoading(false);
      }
    };

    fetchAppointments();
  }, [isAuthenticated]);

  const handleUpdateStatus = async (appointmentId, status) => {
    try {
      const { data } = await axios.put(
        `https://hospital-magagement-system.onrender.com/api/v1/appointment/update/${appointmentId}`,
        { status },
        { 
          withCredentials: true,
          headers: {
            "Content-Type": "application/json"
          }
        }
      );
      
      if (data && data.success) {
        // Update the local state without using toast
        setAppointments((prevAppointments) =>
          prevAppointments.map((appointment) =>
            appointment._id === appointmentId
              ? { ...appointment, status }
              : appointment
          )
        );
        
        // Use a safer way to show success
        console.log("Status updated successfully");
      }
    } catch (error) {
      console.error("Error updating status:", error);
      // Don't use toast here to avoid the react-toastify error
    }
  };

  if (!isAuthenticated) {
    return <Navigate to={"/login"} />;
  }

  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading"></div>
        <p>Loading appointments...</p>
      </div>
    );
  }

  return (
    <>
      <section className="dashboard page">
        <div className="banner">
          <div className="firstBox">
            <img src="/doc.png" alt="docImg" />
            <div className="content">
              <div>
                <p>Hello ,</p>
                <h5>
                  {admin && admin.firstName && admin.lastName
                    ? `${admin.firstName} ${admin.lastName}`
                    : "Admin"}
                </h5>
              </div>
              <p>
                Welcome to the ZeeCare Hospital Management Dashboard. Manage appointments, 
                doctors, and patient information from this central interface.
              </p>
            </div>
          </div>
          <div className="secondBox">
            <p>Total Appointments</p>
            <h3>{appointments ? appointments.length : 0}</h3>
          </div>
          <div className="thirdBox">
            <p>Registered Doctors</p>
            <h3>10</h3>
          </div>
        </div>
        
        {error && (
          <div className="error-message">
            <p>{error}</p>
            <p>Please try logging out and logging back in.</p>
          </div>
        )}
        
        <div className="banner">
          <h5>Appointments</h5>
          <table>
            <thead>
              <tr>
                <th>Patient</th>
                <th>Date</th>
                <th>Doctor</th>
                <th>Department</th>
                <th>Status</th>
                <th>Visited</th>
              </tr>
            </thead>
            <tbody>
              {appointments && appointments.length > 0 ? (
                appointments.map((appointment) => (
                  <tr key={appointment._id}>
                    <td>{`${appointment.firstName} ${appointment.lastName}`}</td>
                    <td>{appointment.appointment_date.substring(0, 16)}</td>
                    <td>{`${appointment.doctor.firstName} ${appointment.doctor.lastName}`}</td>
                    <td>{appointment.department}</td>
                    <td>
                      <select
                        className={
                          appointment.status === "Pending"
                            ? "value-pending"
                            : appointment.status === "Accepted"
                            ? "value-accepted"
                            : "value-rejected"
                        }
                        value={appointment.status}
                        onChange={(e) =>
                          handleUpdateStatus(appointment._id, e.target.value)
                        }
                      >
                        <option value="Pending" className="value-pending">
                          Pending
                        </option>
                        <option value="Accepted" className="value-accepted">
                          Accepted
                        </option>
                        <option value="Rejected" className="value-rejected">
                          Rejected
                        </option>
                      </select>
                    </td>
                    <td>{appointment.hasVisited === true ? <GoCheckCircleFill className="green"/> : <AiFillCloseCircle className="red"/>}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="6" style={{ textAlign: "center" }}>
                    {error ? "Error loading appointments" : "No Appointments Found!"}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </section>
    </>
  );
};

export default Dashboard;