import React, { useState, useEffect, useCallback } from 'react';
import { Card, CardContent, Typography, Box } from '@mui/material';
import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
    ResponsiveContainer,
} from 'recharts';

const AirQualityWidget = ({ data, settings }) => {
    const [chartData, setChartData] = useState([]);
    const [pm25Domain, setPm25Domain] = useState([0, 100]);
    const [pm10Domain, setPm10Domain] = useState([0, 200]);
    const [coDomain, setCoDomain] = useState([0, 10]);

    const updateChartData = useCallback((newData) => {
        const newDataPoint = {
            pm25: newData.pm25 || 0,
            pm10: newData.pm10 || 0,
            co: newData.co || 0,
            timestamp: new Date().toLocaleTimeString(),
        };

        return (prevData) => {
            const updatedData = [...prevData, newDataPoint].slice(-10); // Keep only the last 10 data points

            // Update domains based on historical data
            const updateDomain = (values, currentDomain, setDomain) => {
                const minValue = Math.min(...values);
                const maxValue = Math.max(...values);
                if (
                    minValue < currentDomain[0] ||
                    maxValue > currentDomain[1]
                ) {
                    setDomain([
                        Math.max(0, Math.floor(minValue * 0.8)),
                        Math.ceil(maxValue * 1.2),
                    ]);
                }
            };

            updateDomain(
                updatedData.map((d) => d.pm25),
                pm25Domain,
                setPm25Domain,
            );
            updateDomain(
                updatedData.map((d) => d.pm10),
                pm10Domain,
                setPm10Domain,
            );
            updateDomain(
                updatedData.map((d) => d.co),
                coDomain,
                setCoDomain,
            );

            return updatedData;
        };
    }, []);

    useEffect(() => {
        if (data) {
            setChartData(updateChartData(data));
        }
    }, [data, updateChartData]);

    const getAirQualityLevel = (pm25) => {
        if (pm25 <= 12) return 'Good';
        if (pm25 <= 35.4) return 'Moderate';
        if (pm25 <= 55.4) return 'Unhealthy for Sensitive Groups';
        if (pm25 <= 150.4) return 'Unhealthy';
        if (pm25 <= 250.4) return 'Very Unhealthy';
        return 'Hazardous';
    };

    return (
        <Card>
            <CardContent>
                <Typography variant='h6' gutterBottom>
                    Air Quality
                </Typography>
                <Box
                    display='grid'
                    gridTemplateColumns='repeat(2, 1fr)'
                    gap={2}
                >
                    <Box>
                        <Typography variant='body2'>
                            PM2.5: {data.pm25} µg/m³
                        </Typography>
                        <Typography variant='body2'>
                            PM10: {data.pm10} µg/m³
                        </Typography>
                    </Box>
                    <Box>
                        <Typography variant='body2'>
                            CO: {data.co} ppm
                        </Typography>
                        <Typography variant='body2'>
                            NO2: {data.no2} ppb
                        </Typography>
                    </Box>
                </Box>
                <Typography variant='body1' mt={2}>
                    Air Quality Level: {getAirQualityLevel(data.pm25)}
                </Typography>
                {settings.showTrends && (
                    <>
                        <Box mt={2} height={300}>
                            <ResponsiveContainer width='100%' height='100%'>
                                <LineChart data={chartData}>
                                    <CartesianGrid strokeDasharray='3 3' />
                                    <XAxis dataKey='timestamp' />
                                    <YAxis />
                                    <Tooltip />
                                    <Legend />
                                    <Line
                                        type='monotone'
                                        dataKey='pm25'
                                        stroke='#8884d8'
                                        name='PM2.5'
                                    />
                                    <Line
                                        type='monotone'
                                        dataKey='pm10'
                                        stroke='#82ca9d'
                                        name='PM10'
                                    />
                                    <Line
                                        type='monotone'
                                        dataKey='co'
                                        stroke='#ffc658'
                                        name='CO'
                                    />
                                </LineChart>
                            </ResponsiveContainer>
                        </Box>
                        <Typography variant='body2' mt={1}>
                            Trend:{' '}
                            {Math.random() > 0.5 ? 'Improving' : 'Worsening'}
                        </Typography>
                    </>
                )}
            </CardContent>
        </Card>
    );
};

export default AirQualityWidget;
