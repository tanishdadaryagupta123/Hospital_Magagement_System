// Styles
import './index.css';
import 'react-toastify/dist/ReactToastify.css';

// React and Dependencies
import React, { createContext, useState } from 'react';
import ReactDOM from 'react-dom/client';
import { ToastContainer } from 'react-toastify';

// Components
import App from './App.jsx';

// Context
export const Context = createContext({ isAuthenticated: false });

const AppWrapper = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [admin, setAdmin] = useState({});

  return (
    <Context.Provider
      value={{
        isAuthenticated,
        setIsAuthenticated,
        admin,
        setAdmin,
      }}
    >
      <App />
      <ToastContainer
        position="bottom-center"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />
    </Context.Provider>
  );
};

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <AppWrapper />
  </React.StrictMode>
);
