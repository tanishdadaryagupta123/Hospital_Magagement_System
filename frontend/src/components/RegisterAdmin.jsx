import React, { useState } from 'react';
import axios from 'axios';

const RegisterAdmin = () => {
    const [message, setMessage] = useState('');

    const handleAdminRegistration = async () => {
        const newAdmin = {
            firstName: 'Admin',
            lastName: 'User',
            email: 'admin@example.com',
            password: 'adminPassword123', // Use a secure password in production
            role: 'Admin', // Ensure the role is set to Admin
        };

        try {
            const response = await axios.post('http://localhost:4000/api/v1/user/admin/register', newAdmin, { withCredentials: true });
            setMessage(response.data.message);
        } catch (error) {
            setMessage(error.response ? error.response.data.message : 'Registration failed');
        }
    };

    return (
        <div>
            <h2>Register New Admin</h2>
            <button onClick={handleAdminRegistration}>Register Admin</button>
            {message && <p>{message}</p>}
        </div>
    );
};

export default RegisterAdmin; 