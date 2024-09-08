import React, { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../contexts/AuthContext';

const Dashboard = () => {
    const { user, dashboardData, error, fetchDashboardData } = useAuth();

    useEffect(() => {
        let isMounted = true;
        const loadDashboard = async () => {
            try {
                await fetchDashboardData();
            } catch (err) {
                console.error('Failed to load dashboard:', err);
            }
        };

        if (isMounted) {
            loadDashboard();
        }

        return () => {
            isMounted = false;
        };
    }, []); // eslint-disable-line react-hooks/exhaustive-deps

    if (error) {
        return <div className="error-message">{error}</div>;
    }

    if (!dashboardData) {
        return <div>Loading...</div>;
    }

    return (
        <div className="dashboard-container">
            <h1>Dashboard</h1>
            <p>Welcome to your dashboard, {user.username}!</p>
            <div className="dashboard-stats">
                <h2>Your Eco Stats</h2>
                <p>Carbon Footprint: {dashboardData.carbonFootprint} kg CO2e</p>
                <p>Energy Saved: {dashboardData.energySaved} kWh</p>
                <p>Water Conserved: {dashboardData.waterConserved} liters</p>
            </div>
            <button onClick={fetchDashboardData}>Refresh Dashboard</button>
        </div>
    );
};

export default Dashboard;