import React, { useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';

const Profile = () => {
    const { user, profileData, error, fetchProfileData } = useAuth();

    useEffect(() => {
        let isMounted = true;
        const loadProfile = async () => {
            try {
                await fetchProfileData();
            } catch (err) {
                if (isMounted) {
                    console.error('Failed to load profile:', err);
                }
            }
        };

        if (isMounted) {
            loadProfile();
        }

        return () => {
            isMounted = false;
        };
    }, []); // eslint-disable-line react-hooks/exhaustive-deps

    if (error) {
        return <div className="error-message">{error}</div>;
    }

    if (!profileData) {
        return <div>Loading...</div>;
    }

    return (
        <div className="profile-container">
            <h1>User Profile</h1>
            <div className="profile-info">
                <p><strong>Username:</strong> {profileData.username}</p>
                <p><strong>Email:</strong> {profileData.email}</p>
                {/* Add more profile information here */}
            </div>
            <button onClick={fetchProfileData}>Refresh Profile</button>
        </div>
    );
};

export default Profile;