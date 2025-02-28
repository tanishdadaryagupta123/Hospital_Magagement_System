import React, { useContext, useState } from "react";
import { TiHome } from "react-icons/ti";
import { RiLogoutBoxFill } from "react-icons/ri";
import { AiFillMessage } from "react-icons/ai";
import { GiHamburgerMenu } from "react-icons/gi";
import { FaUserDoctor } from "react-icons/fa6";
import { MdAddModerator } from "react-icons/md";
import { IoPersonAddSharp } from "react-icons/io5";
import axios from "axios";
import { toast } from "react-toastify";
import { Context } from "../main";
import { useNavigate } from "react-router-dom";

const Sidebar = () => {
  const [show, setShow] = useState(false);

  const { isAuthenticated, setIsAuthenticated, setAdmin } = useContext(Context);

  const handleLogout = () => {
    // Clear localStorage
    localStorage.removeItem('isAuthenticated');
    localStorage.removeItem('adminUser');
    
    // Update context
    setIsAuthenticated(false);
    setAdmin({});
    
    // Show success message
    toast.success("Logged out successfully");
    
    // Redirect to login page
    navigateTo("/login");
  };

  const navigateTo = useNavigate();

  const gotoHomePage = () => {
    navigateTo("/");
    setShow(!show);
  };
  const gotoDoctorsPage = () => {
    navigateTo("/doctors");
    setShow(!show);
  };
  const gotoMessagesPage = () => {
    navigateTo("/messages");
    setShow(!show);
  };
  const gotoAddNewDoctor = () => {
    navigateTo("/doctor/addnew");
    setShow(!show);
  };
  const gotoAddNewAdmin = () => {
    navigateTo("/admin/addnew");
    setShow(!show);
  };

  if (!isAuthenticated) return null;

  return (
    <>
      <div className={show ? "sidebar show-sidebar" : "sidebar"}>
        <div className="hamburger" onClick={() => setShow(!show)}>
          <GiHamburgerMenu />
        </div>
        <div className="logo">
          <img src="/logo.png" alt="logo" className="logo-img" />
        </div>
        <div className="sidebar-links">
          <div className="sidebar-link" onClick={gotoHomePage}>
            <TiHome />
            <span>Dashboard</span>
          </div>
          <div className="sidebar-link" onClick={gotoDoctorsPage}>
            <FaUserDoctor />
            <span>Doctors</span>
          </div>
          <div className="sidebar-link" onClick={gotoMessagesPage}>
            <AiFillMessage />
            <span>Messages</span>
          </div>
          <div className="sidebar-link" onClick={gotoAddNewDoctor}>
            <IoPersonAddSharp />
            <span>Add New Doctor</span>
          </div>
          <div className="sidebar-link" onClick={gotoAddNewAdmin}>
            <MdAddModerator />
            <span>Add New Admin</span>
          </div>
          <div className="sidebar-link" onClick={handleLogout}>
            <RiLogoutBoxFill />
            <span>Logout</span>
          </div>
        </div>
      </div>
    </>
  );
};

export default Sidebar;
