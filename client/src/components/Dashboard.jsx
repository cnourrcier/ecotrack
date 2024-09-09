import React, { useEffect, useState } from 'react';
import { useAuth } from '../contexts/AuthContext';

const Dashboard = () => {
    const { user, error: authError, fetchDashboardData } = useAuth();
    const [dashboardData, setDashboardData] = useState(null);
    const [loading, setLoading] = useState(null);
    const [error, setError] = useState(null);

    const loadDashboard = async () => {
        setLoading(true);
        setError(null);
        try {
            const data = await fetchDashboardData();
            setDashboardData(data);
        } catch (err) {
            console.error('Failed to load dashboard:', err);
            setError('Failed to load dashboard data. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadDashboard();
    }, []);

    if (authError) {
        return <div className="error-message">{authError}</div>;
    }
    if (error) {
        return (
            <div className="error-message">
                {error}
                <button onClick={loadDashboard}>Retry</button>
            </div>
        );
    }

    if (loading) {
        return <div>Loading...</div>;
    }

    if (!dashboardData) {
        return <div>No dashboard data available.</div>;
    }
    console.log(dashboardData)
    return (
        <div className="dashboard-container">
            <h1>Dashboard</h1>
            <p>{dashboardData.message}, {dashboardData.user.username}!</p>
            <div className="dashboard-stats">
                <h2>Your Eco Stats</h2>
                <p>Carbon Footprint: {dashboardData.user.carbonFootprint} kg CO2e</p>
                <p>Energy Saved: {dashboardData.user.energySaved} kWh</p>
                <p>Water Conserved: {dashboardData.user.waterConserved} liters</p>
            </div>
            <button onClick={loadDashboard}>Refresh Dashboard</button>
        </div>
    );
};

export default Dashboard;