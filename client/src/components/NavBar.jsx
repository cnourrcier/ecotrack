import React from 'react';
import { Link } from 'react-router-dom';
import Logout from './Logout';
import { useAuth } from '../contexts/AuthContext';

const Navbar = () => {
    const { user } = useAuth();

    return (
        <nav>
            <ul>
                <li><Link to="/">Home</Link></li>
                {user ? (
                    <>
                        <li><Link to="/dashboard">Dashboard</Link></li>
                        <li><Link to="/profile">Profile</Link></li>
                        <li><Logout /></li>
                    </>
                ) : (
                    <>
                        <li><Link to="/login">Login</Link></li>
                        <li><Link to="/register">Register</Link></li>
                    </>
                )}
            </ul>
        </nav>
    );
};

export default Navbar;