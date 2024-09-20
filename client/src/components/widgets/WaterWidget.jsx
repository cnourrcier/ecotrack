import React, { useState, useEffect, useCallback } from 'react';
import { Card, CardContent, Typography, Box } from '@mui/material';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const WaterWidget = ({ data, settings }) => {
    const [chartData, setChartData] = useState([]);
    const [consumptionDomain, setConsumptionDomain] = useState([0, 1000]);
    const [qualityDomain, setQualityDomain] = useState([0, 14]);

    const volumeUnit = settings.useMetricUnits ? 'L' : 'gal';

    const updateChartData = useCallback((newData) => {
        const newDataPoint = {
            consumption: newData.consumption,
            pH: newData.pH,
            turbidity: newData.turbidity,
            timestamp: new Date().toLocaleTimeString()
        };

        return (prevData) => {
            const updatedData = [...prevData, newDataPoint].slice(-10);
            // Update consumption domain
            const consumptionValues = updatedData.map(d => d.consumption);
            const maxConsumption = Math.max(...consumptionValues);
            setConsumptionDomain([0, Math.ceil(maxConsumption * 1.2)]);

            // Update quality domain (for pH fixed between 0-14)
            const turbidityValues = updatedData.map(d => d.turbidity);
            const maxTurbidity = Math.max(...turbidityValues);
            setQualityDomain([0, Math.max(14, Math.ceil(maxTurbidity * 1.2))]);

            return updatedData;
        }
    }, []);



    useEffect(() => {
        if (data) {
            setChartData(updateChartData(data));
        }
    }, [data, updateChartData]);

    const convertVolume = (liters) => {
        return settings.useMetricUnits ? liters : liters * 0.264172; // 1 L = 0.264172 gal
    };

    return (
        <Card>
            <CardContent>
                <Typography variant="h6" gutterBottom>Water</Typography>
                <Box display="grid" gridTemplateColumns="repeat(2, 1fr)" gap={2}>
                    <Typography variant="body2">
                        Consumption: {convertVolume(parseFloat(data?.consumption)).toFixed(1)} {volumeUnit}
                    </Typography>
                    <Typography variant="body2">
                        pH: {parseFloat(data.pH)}
                    </Typography>
                    <Typography variant="body2">
                        Turbidity: {parseFloat(data.turbidity)} NTU
                    </Typography>
                </Box>
                {settings.showTrends && (
                    <>
                        <Box mt={2} height={200}>
                            <Typography variant="subtitle2">Water Consumption</Typography>
                            <ResponsiveContainer width="100%" height="100%">
                                <LineChart data={chartData}>
                                    <CartesianGrid strokeDasharray="3 3" />
                                    <XAxis dataKey="timestamp" />
                                    <YAxis domain={consumptionDomain} label={{ value: `Consumption (${volumeUnit})`, angle: -90, position: 'insideLeft' }} />
                                    <Tooltip />
                                    <Legend />
                                    <Line type="monotone" dataKey="consumption" stroke="#8884d8" name="Consumption" />
                                </LineChart>
                            </ResponsiveContainer>
                        </Box>
                        <Box mt={2} height={200}>
                            <Typography variant="subtitle2">Water Quality</Typography>
                            <ResponsiveContainer width="100%" height="100%">
                                <LineChart data={chartData}>
                                    <CartesianGrid strokeDasharray="3 3" />
                                    <XAxis dataKey="timestamp" />
                                    <YAxis yAxisId="ph" domain={[0, 14]} label={{ value: 'pH', angle: -90, position: 'insideLeft' }} />
                                    <YAxis yAxisId="turbidity" orientation="right" domain={qualityDomain} label={{ value: 'Turbidity (NTU)', angle: 90, position: 'insideRight' }} />
                                    <Tooltip />
                                    <Legend />
                                    <Line yAxisId="ph" type="monotone" dataKey="pH" stroke="#82ca9d" name="pH" />
                                    <Line yAxisId="turbidity" type="monotone" dataKey="turbidity" stroke="#ffc658" name="Turbidity" />
                                </LineChart>
                            </ResponsiveContainer>
                        </Box>
                        <Typography variant="body2" mt={1}>
                            Trend: {parseFloat(data.consumption) > 1000 ? 'High Usage' : 'Normal Usage'}
                        </Typography>
                    </>
                )}
            </CardContent>
        </Card>
    );
};

export default WaterWidget;