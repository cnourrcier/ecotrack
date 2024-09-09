import React, { useEffect, useState } from 'react';
import { useAuth } from '../contexts/AuthContext';

const Profile = () => {
    const { user, error: authError, fetchProfileData } = useAuth();
    const [profileData, setProfileData] = useState(null);
    const [loading, setLoading] = useState(null);
    const [error, setError] = useState(null);

    const loadProfile = async () => {
        setLoading(true);
        setError(null);
        try {
            const data = await fetchProfileData();
            setProfileData(data);
        } catch (err) {
            console.error('Failed to load profile:', err);
            setError('Failed to load profile data. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadProfile();
    }, []);

    if (authError) {
        return <div className="error-message">{authError}</div>;
    }
    if (error) {
        return (
            <div className="error-message">
                {error}
                <button onClick={loadProfile}>Retry</button>
            </div>
        );
    }

    if (loading) {
        return <div>Loading...</div>;
    }

    if (!profileData) {
        return <div>No profile data available.</div>;
    }

    if (!profileData) {
        return <div>Loading...</div>;
    }

    return (
        <div className="profile-container">
            <h1>User Profile</h1>
            <div className="profile-info">
                <p><strong>Username:</strong> {profileData.user.username}</p>
                <p><strong>Email:</strong> {profileData.user.email}</p>
                {/* Add more profile information here */}
            </div>
            <button onClick={loadProfile}>Refresh Profile</button>
        </div>
    );
};

export default Profile;