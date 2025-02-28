import axios from "axios";
import React, { useContext, useEffect, useState } from "react";
import { toast } from "react-toastify";
import { Context } from "../main";
import { Navigate } from "react-router-dom";

const Messages = () => {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { isAuthenticated } = useContext(Context);

  useEffect(() => {
    if (!isAuthenticated) {
      setLoading(false);
      return;
    }

    const fetchMessages = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const { data } = await axios.get(
          "https://hospital-magagement-system.onrender.com/api/v1/message/getall",
          { 
            withCredentials: true,
            headers: {
              "Content-Type": "application/json"
            }
          }
        );
        
        if (data && data.messages) {
          setMessages(data.messages);
        } else {
          setMessages([]);
        }
      } catch (error) {
        console.error("Error fetching messages:", error);
        setError("Failed to load messages. Please try again later.");
        setMessages([]);
        
        // Use dummy data if in development mode
        if (process.env.NODE_ENV === 'development') {
          setMessages([
            {
              _id: "1",
              firstName: "John",
              lastName: "Doe",
              email: "john@example.com",
              phone: "123-456-7890",
              message: "This is a sample message for testing purposes."
            },
            {
              _id: "2",
              firstName: "Jane",
              lastName: "Smith",
              email: "jane@example.com",
              phone: "987-654-3210",
              message: "Another sample message for testing the UI."
            }
          ]);
        }
      } finally {
        setLoading(false);
      }
    };

    fetchMessages();
  }, [isAuthenticated]);

  if (!isAuthenticated) {
    return <Navigate to={"/login"} />;
  }

  return (
    <section className="page messages">
      <h1>MESSAGES</h1>
      
      {loading ? (
        <div className="loading-container">
          <div className="loading"></div>
          <p>Loading messages...</p>
        </div>
      ) : error ? (
        <div className="error-message">
          <p>{error}</p>
          <p>Please check your connection and try again.</p>
        </div>
      ) : (
        <div className="banner">
          {messages && messages.length > 0 ? (
            messages.map((element) => (
              <div className="card" key={element._id}>
                <div className="details">
                  <p>
                    First Name: <span>{element.firstName}</span>
                  </p>
                  <p>
                    Last Name: <span>{element.lastName}</span>
                  </p>
                  <p>
                    Email: <span>{element.email}</span>
                  </p>
                  <p>
                    Phone: <span>{element.phone}</span>
                  </p>
                  <p>
                    Message: <span>{element.message}</span>
                  </p>
                </div>
              </div>
            ))
          ) : (
            <div className="no-data-message">
              <h3>No Messages Found!</h3>
              <p>There are currently no messages to display.</p>
            </div>
          )}
        </div>
      )}
    </section>
  );
};

export default Messages;
