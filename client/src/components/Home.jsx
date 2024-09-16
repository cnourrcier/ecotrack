import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const Home = () => {
    const { user } = useAuth();

    return (
        <div className='home-container'>
            <h1>Welcome to EcoTrack</h1>
            <p>Track and reduce your environmental impact with EcoTrack.</p>
            {user ? (
                <div>
                    <p>Welcome back, {user.username}!</p>
                    <Link to='/dashboard' className='link'>
                        Go to Dashboard
                    </Link>
                </div>
            ) : (
                <div>
                    <Link to='/login' className='link'>
                        Login
                    </Link>
                    <Link to='/register' className='link'>
                        Register
                    </Link>
                </div>
            )}
        </div>
    );
};

export default Home;
