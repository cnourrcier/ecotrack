import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';

const Logout = () => {
    const [error, setError] = useState('');
    const { logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = async () => {
        setError('');
        try {
            await logout();
            navigate('/');
        } catch (err) {
            setError(err.response?.data?.error || 'Failed to log out');
        }
    };

    return (
        <div>
            {error && <p style={{ color: 'red' }}>{error}</p>}
            <button onClick={handleLogout} className='logout-button'>
                Logout
            </button>
        </div>
    );
};

export default Logout;
