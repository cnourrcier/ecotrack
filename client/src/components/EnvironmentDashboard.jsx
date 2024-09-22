import React, { useState, useEffect, useCallback } from 'react';
import { Box, Typography, Container, createTheme, Alert, Paper, Button } from '@mui/material';
import { useWebSocket } from '../hooks/useWebSocket';
import DashboardSettings from './DashboardSettings';
import AirQualityWidget from './widgets/AirQualityWidget';
import WeatherWidget from './widgets/WeatherWidget';
import EnergyWidget from './widgets/EnergyWidget';
import WaterWidget from './widgets/WaterWidget';
import WasteWidget from './widgets/WasteWidget';


const DEFAULT_REFRESH_RATE = 5; // 5 seconds

const EnvironmentDashboard = () => {
    const [dashboardData, setDashboardData] = useState(null);
    const [settings, setSettings] = useState({
        useMetricUnits: true,
        showTrends: false,
        refreshRate: DEFAULT_REFRESH_RATE,
    });
    const { lastMessage, sendMessage, isConnected, error } = useWebSocket();

    const fetchData = useCallback(() => {
        if (isConnected && !error) {
            console.log('Fetching data...');
            sendMessage({ type: 'fetchData' });
        } else {
            console.log('Not fetching data due to connection issues');
        }

    }, [sendMessage, isConnected, error]);

    useEffect(() => {
        if (lastMessage) {
            console.log('Received new data:', lastMessage);
            setDashboardData(lastMessage);
        }
    }, [lastMessage]);

    useEffect(() => {
        if (isConnected & !error) {
            console.log('Setting up interval with refresh rate:', settings.refreshRate);
            // Set up the interval for data fetching
            const intervalId = setInterval(fetchData, settings.refreshRate * 1000);

            // Clean up the interval on component unmount or when refresh rate changes 
            return () => {
                console.log('Clearing interval');
                clearInterval(intervalId);
            };
        }
    }, [settings.refreshRate, fetchData, isConnected, error]);

    const theme = createTheme({
        palette: {
            mode: settings.darkMode ? 'dark' : 'light',
        },
    });

    const handleRefresh = () => {
        window.location.reload();
    };

    if (!isConnected && error) {
        return (
            <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100vh' }}>
                <Typography variant="h5" gutterBottom>Connection Lost</Typography>
                <Typography variant="body1" gutterBottom>{error}</Typography>
                <Button variant="contained" onClick={handleRefresh} sx={{ mt: 2 }}>Refresh Page</Button>
            </Box>
        );
    }

    return (
        <Container maxWidth="lg" sx={{ mt: 4, marginTop: 8, marginBottom: 8, }}>
            <Typography variant="h4" gutterBottom>
                Environmental Monitoring Dashboard
            </Typography>
            {!isConnected && (
                <Alert severity="warning" sx={{ mb: 2 }}>
                    WebSocket disconnected. Attempting to reconnect...
                </Alert>
            )}
            {error && (
                <Alert severity="error" sx={{ mb: 2 }}>
                    {error}
                </Alert>
            )}
            <DashboardSettings settings={settings} updateSettings={setSettings} />
            {dashboardData ? (
                <Box display="flex" flexDirection="column" gap={3}>
                    <Paper elevation={3} sx={{ p: 2 }}>
                        <AirQualityWidget data={dashboardData.airQuality} settings={settings} />
                    </Paper>
                    <Paper elevation={3} sx={{ p: 2 }}>
                        <WeatherWidget data={dashboardData.weather} settings={settings} />
                    </Paper>
                    <Paper elevation={3} sx={{ p: 2 }}>
                        <EnergyWidget data={dashboardData.energy} settings={settings} />
                    </Paper>
                    <Paper elevation={3} sx={{ p: 2 }}>
                        <WaterWidget data={dashboardData.water} settings={settings} />
                    </Paper>
                    <Paper elevation={3} sx={{ p: 2 }}>
                        <WasteWidget data={dashboardData.waste} settings={settings} />
                    </Paper>
                </Box>
            ) : (
                <Typography>Loading dashboard data...</Typography>
            )}
        </Container>
    );
};

export default EnvironmentDashboard;