import React from "react";

const Biography = ({imageUrl}) => {
  return (
    <>
      <div className="container biography">
        <div className="banner">
          <img src={imageUrl} alt="whoweare" />
        </div>
        <div className="banner">
          <b><p>Biography</p></b>
          <h3>Who We Are</h3>
          <p>
          <b>Hospital Management System (HMS)</b>
          <br></br> 
          A Smart Healthcare Solution
          The Hospital Management System (HMS) is a modern, full-stack web application built using the MERN stack (MongoDB, Express.js, React.js, and Node.js) to streamline hospital operations and enhance patient care. Designed with efficiency and user experience in mind, this system provides an intuitive and secure platform for managing hospital workflows, patient records, doctor appointments, billing, and more.
          </p>
          <p>We are all in 2024!</p>
          <p>We are working on a MERN STACK PROJECT.</p>
          <p>
          <b>Key Features:</b><br></br>
✅ Patient Management: Easily register, update, and track patient records with a centralized database.<br></br>
✅ Doctor & Staff Dashboard: Manage doctor schedules, specializations, and availability in real time.<br></br>
✅ Appointment Booking: Seamless online scheduling for patients with automated notifications.<br></br>
✅ Billing & Invoicing: Secure and efficient billing system with digital invoice generation.<br></br>
✅ Role-Based Access Control: Different access levels for admins, doctors, and patients to ensure data security.<br></br>
✅ Medical Records & Reports: Secure storage and retrieval of patient history, prescriptions, and test results.<br></br>
✅ User-Friendly Interface: Intuitive UI designed for seamless navigation and accessibility.<br></br>
          </p>
          <p>Coding is fun!</p>
        </div>
      </div>
    </>
  );
};

export default Biography;
