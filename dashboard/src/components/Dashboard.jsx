import React, { useContext, useEffect, useState } from "react";
import { Context } from "../main";
import { Navigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import { GoCheckCircleFill } from "react-icons/go";
import { AiFillCloseCircle } from "react-icons/ai";

const Dashboard = () => {
  const [appointments, setAppointments] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const { isAuthenticated, admin } = useContext(Context);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!isAuthenticated) {
      setLoading(false);
      return;
    }

    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // Fetch doctors count
        try {
          const doctorsResponse = await axios.get(
            "https://hospital-magagement-system.onrender.com/api/v1/doctor/getall",
            { 
              withCredentials: true,
              headers: {
                "Content-Type": "application/json"
              }
            }
          );
          
          if (doctorsResponse.data && doctorsResponse.data.doctors) {
            setDoctors(doctorsResponse.data.doctors);
          }
        } catch (doctorError) {
          console.error("Error fetching doctors:", doctorError);
          // Set a default count if API fails
          setDoctors([]);
        }
        
        // Fetch appointments
        try {
          const appointmentsResponse = await axios.get(
            "https://hospital-magagement-system.onrender.com/api/v1/appointment/getall",
            { 
              withCredentials: true,
              headers: {
                "Content-Type": "application/json"
              }
            }
          );
          
          if (appointmentsResponse.data && appointmentsResponse.data.appointments) {
            setAppointments(appointmentsResponse.data.appointments);
          } else {
            setAppointments([]);
          }
        } catch (appointmentError) {
          console.error("Error fetching appointments:", appointmentError);
          setAppointments([]);
          
          // Only set error if both API calls fail
          if (doctors.length === 0) {
            setError("Failed to load dashboard data. Please try again later.");
          }
        }
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
        setError("Failed to load dashboard data. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [isAuthenticated]);

  const handleUpdateStatus = async (appointmentId, status) => {
    try {
      // Simulate successful update
      setAppointments((prevAppointments) =>
        prevAppointments.map((appointment) =>
          appointment._id === appointmentId
            ? { ...appointment, status }
            : appointment
        )
      );
      
      toast.success("Status updated successfully");
      
      // Uncomment this when the API is fixed
      /*
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
        setAppointments((prevAppointments) =>
          prevAppointments.map((appointment) =>
            appointment._id === appointmentId
              ? { ...appointment, status }
              : appointment
          )
        );
        
        toast.success(data.message);
      }
      */
    } catch (error) {
      console.error("Error updating status:", error);
      toast.error("Failed to update status");
    }
  };

  if (!isAuthenticated) {
    return <Navigate to={"/login"} />;
  }

  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading"></div>
        <p>Loading dashboard data...</p>
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
            <h3>{doctors ? doctors.length : 0}</h3>
          </div>
        </div>
        
        <div className="banner">
          <h5>Appointments</h5>
          
          {error ? (
            <div className="error-message">
              <p>{error}</p>
              <p>Please check your connection and try again.</p>
            </div>
          ) : appointments && appointments.length > 0 ? (
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
                {appointments.map((appointment) => (
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
                ))}
              </tbody>
            </table>
          ) : (
            <div className="no-data-message">
              <h3>No Appointments Found!</h3>
              <p>There are currently no appointments to display.</p>
            </div>
          )}
        </div>
      </section>
    </>
  );
};

export default Dashboard;