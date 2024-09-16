import React, { useState, useEffect } from 'react';
import { Box, Paper, Typography, Button, CircularProgress } from '@mui/material';
import { useAuth } from '../contexts/AuthContext';
import KeyMetricsSummary from './KeyMetricsSummary';
import DashboardSettings from './DashboardSettings';

const Dashboard = () => {
    const { user, error: authError, fetchDashboardData } = useAuth();
    const [dashboardData, setDashboardData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [layout, setLayout] = useState(() => {
        const savedLayout = localStorage.getItem('dashboardLayout');
        return savedLayout ? JSON.parse(savedLayout) : ['metrics', 'graph', 'map'];
    });

    const loadDashboard = async () => {
        setLoading(true);
        setError(null);
        try {
            const data = await fetchDashboardData();
            setDashboardData(data.data);
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

    useEffect(() => {
        localStorage.setItem('dashboardLayout', JSON.stringify(layout));
    }, [layout]);

    if (authError) {
        return <Typography color="error">{authError}</Typography>;
    }

    if (error) {
        return (
            <Box textAlign="center">
                <Typography color="error">{error}</Typography>
                <Button onClick={loadDashboard} variant="contained" sx={{ mt: 2 }}>
                    Retry
                </Button>
            </Box>
        );
    }

    if (loading) {
        return (
            <Box display="flex" justifyContent="center" alignItems="center" height="100vh">
                <CircularProgress />
            </Box>
        );
    }

    if (!dashboardData) {
        return <Typography>No dashboard data available.</Typography>;
    }

    const renderWidget = (widgetType) => {
        switch (widgetType) {
            case 'metrics':
                return <KeyMetricsSummary data={dashboardData.metrics} />;
            case 'graph':
                return <Paper sx={{ p: 2, height: '100%' }}>Graph placeholder</Paper>;
            case 'map':
                return <Paper sx={{ p: 2, height: '100%' }}>Map placeholder</Paper>;
            default:
                return null;
        }
    };

    return (
        <Box sx={{ p: 3 }}>
            <Typography variant="h4" gutterBottom>
                Welcome, {user.username}!
            </Typography>
            <DashboardSettings layout={layout} setLayout={setLayout} />
            <Box display="flex" flexDirection="column" gap={3}>
                {layout.map((widgetType) => (
                    <Box key={widgetType}>
                        {renderWidget(widgetType)}
                    </Box>
                ))}
            </Box>
            <Box mt={2}>
                <Button onClick={loadDashboard} variant="contained">
                    Refresh Dashboard
                </Button>
            </Box>
        </Box>
    );
};

export default Dashboard;
