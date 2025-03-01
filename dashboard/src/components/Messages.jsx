import axios from "axios";
import React, { useContext, useEffect, useState } from "react";
import { toast } from "react-toastify";
import { Context } from "../main";
import { Navigate } from "react-router-dom";

// const Messages = () => {
//   const [messages, setMessages] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const { isAuthenticated } = useContext(Context);

  // Sample data for when API fail

  // useEffect(() => {
  //   const fetchMessages = async () => {
  //     try {
  //       setLoading(true);
  //       setError(null);
        
  //       // Use sample data instead of making API calls that are failing
  //       setMessages(sampleMessages);
  //       setLoading(false);
        
  //       // The following code is commented out until the API endpoints are fixed
        
  //       const { data } = await axios.get(
  //         "https://hospital-magagement-system.onrender.com/api/v1/message/getall",
  //         { 
  //           withCredentials: true,
  //           headers: {
  //             "Content-Type": "application/json"
  //           }
  //         }
  //       );
        
  //       if (data && data.messages) {
  //         setMessages(data.messages);
  //       } else {
  //         setMessages(sampleMessages);
  //       }
        
  //     } catch (error) {
  //       console.error("Error fetching messages:", error);
  //       setError("Failed to load messages. Please try again later.");
  //       // Use sample data as fallback
  //       setMessages(sampleMessages);
  //     } finally {
  //       setLoading(false);
  //     }
  //   };

  //   fetchMessages();
  // }, [isAuthenticated]);

  const Messages = () => {
    const [messages, setMessages] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const { isAuthenticated } = useContext(Context);

    useEffect(() => {
      const fetchMessages = async () => {
        try {
          setLoading(true);
          const { data } = await axios.get(
            "hospital-magagement-system-qxwr-de5uvmtvq.vercel.app/api/v1/message/getall",
            { withCredentials: true }
          );
          setMessages(data.messages);
        } catch (error) {
          console.error("Error fetching messages:", error.response ? error.response.data : error);
          setError(error.response ? error.response.data.message : "Failed to load messages.");
        } finally {
          setLoading(false);
        }
      };
      fetchMessages();
    }, []);

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
