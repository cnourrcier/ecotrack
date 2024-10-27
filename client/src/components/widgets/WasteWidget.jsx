import React, { useState, useEffect, useCallback } from 'react';
import { Card, CardContent, Typography, Box } from '@mui/material';
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
    ResponsiveContainer,
} from 'recharts';

const WasteWidget = ({ data, settings }) => {
    const [chartData, setChartData] = useState([]);
    const [wasteDomain, setWasteDomain] = useState([0, 100]);

    const massUnit = settings.useMetricUnits ? 'kg' : 'lbs';

    const updateChartData = useCallback((newData) => {
        const newDataPoint = {
            timestamp: new Date().toLocaleTimeString(),
            generalWaste: parseFloat(newData.generalWaste) || 0,
            recycling: parseFloat(newData.recycling) || 0,
            compost: parseFloat(newData.compost) || 0,
        };

        newDataPoint.total =
            newDataPoint.generalWaste +
            newDataPoint.recycling +
            newDataPoint.compost;

        return (prevData) => {
            const updatedData = [...prevData, newDataPoint].slice(-10); // Keep only the last 10 data points
            // Update waste domain
            const maxTotal = Math.max(...updatedData.map((d) => d.total));
            const newMaxDomain = Math.max(100, Math.ceil(maxTotal * 1.2));
            setWasteDomain([0, newMaxDomain]);
            return updatedData;
        };
    }, []);

    useEffect(() => {
        if (data) {
            setChartData(updateChartData(data));
        }
    }, [data, updateChartData]);

    const convertMass = useCallback(
        (kg) => {
            return settings.useMetricUnits ? kg : kg * 2.20462; // 1 kg = 2.20462 lbs
        },
        [settings.useMetricUnits],
    );

    return (
        <Card>
            <CardContent>
                <Typography variant='h6' gutterBottom>
                    Waste Management
                </Typography>
                <Box
                    display='grid'
                    gridTemplateColumns='repeat(2, 1fr)'
                    gap={2}
                >
                    <Typography variant='body2'>
                        General Waste:{' '}
                        {convertMass(parseFloat(data?.generalWaste)).toFixed(1)}{' '}
                        {massUnit}
                    </Typography>
                    <Typography variant='body2'>
                        Recycling:{' '}
                        {convertMass(parseFloat(data?.recycling)).toFixed(1)}{' '}
                        {massUnit}
                    </Typography>
                </Box>
                {settings.showTrends && (
                    <>
                        <Box mt={2} height={300}>
                            <ResponsiveContainer width='100%' height='100%'>
                                <BarChart data={chartData}>
                                    <CartesianGrid strokeDasharray='3 3' />
                                    <XAxis dataKey='timestamp' />
                                    <YAxis
                                        domain={wasteDomain}
                                        label={{
                                            value: `Waste (${massUnit})`,
                                            angle: -90,
                                            position: 'insideLeft',
                                        }}
                                    />
                                    <Tooltip />
                                    <Legend />
                                    <Bar
                                        dataKey='generalWaste'
                                        stackId='a'
                                        fill='#8884d8'
                                        name='General Waste'
                                    />
                                    <Bar
                                        dataKey='recycling'
                                        stackId='a'
                                        fill='#82ca9d'
                                        name='Recycling'
                                    />
                                    {data.compost && (
                                        <Bar
                                            dataKey='compost'
                                            stackId='a'
                                            fill='#ffc658'
                                            name='Compost'
                                        />
                                    )}
                                </BarChart>
                            </ResponsiveContainer>
                        </Box>
                        <Typography variant='body2' mt={1}>
                            Recycling Rate:{' '}
                            {(
                                (parseFloat(data?.recycling) /
                                    (parseFloat(data?.generalWaste) +
                                        parseFloat(data?.recycling))) *
                                100
                            ).toFixed(1)}
                            %
                        </Typography>
                    </>
                )}
            </CardContent>
        </Card>
    );
};

export default WasteWidget;
