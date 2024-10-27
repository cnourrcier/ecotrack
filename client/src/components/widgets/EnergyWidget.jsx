import React, { useState, useEffect } from 'react';
import { Card, CardContent, Typography, Box } from '@mui/material';
import {
    AreaChart,
    Area,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
    ResponsiveContainer,
} from 'recharts';

const EnergyWidget = ({ data, settings }) => {
    const [chartData, setChartData] = useState([]);
    const [energyDomain, setEnergyDomain] = useState([0, 10]);

    const energyUnit = settings.useMetricUnits ? 'kWh' : 'BTU';

    useEffect(() => {
        if (data) {
            setChartData((prevData) => {
                const newData = [
                    ...prevData,
                    {
                        ...data,
                        timestamp: new Date().toLocaleTimeString(),
                        netEnergy: data.solarGeneration - data.consumption,
                    },
                ];
                const updatedData = newData.slice(-10); // Keep only the last 10 data points

                // Update domain based on historical data
                const allValues = updatedData.flatMap((d) => [
                    d.consumption,
                    d.solarGeneration,
                ]);
                const minValue = Math.min(...allValues);
                const maxValue = Math.max(...allValues);
                const newDomain = [
                    Math.max(0, Math.floor(minValue * 0.8)),
                    Math.ceil(maxValue * 1.2),
                ];

                if (
                    newDomain[0] !== energyDomain[0] ||
                    newDomain[1] !== energyDomain[1]
                ) {
                    setEnergyDomain(newDomain);
                }

                return updatedData;
            });
        }
    }, [data]);

    const convertEnergy = (kwh) => {
        return settings.useMetricUnits ? kwh : kwh * 3412.14; // 1 kWh = 3412.14 BTU
    };

    return (
        <Card>
            <CardContent>
                <Typography variant='h6' gutterBottom>
                    Energy
                </Typography>
                <Box
                    display='grid'
                    gridTemplateColumns='repeat(2, 1fr)'
                    gap={2}
                >
                    <Typography variant='body2'>
                        Consumption:{' '}
                        {convertEnergy(parseFloat(data?.consumption)).toFixed(
                            2,
                        )}{' '}
                        {energyUnit}
                    </Typography>
                    <Typography variant='body2'>
                        Solar Generation:{' '}
                        {convertEnergy(
                            parseFloat(data?.solarGeneration),
                        ).toFixed(2)}{' '}
                        {energyUnit}
                    </Typography>
                </Box>
                {settings.showTrends && (
                    <>
                        <Box mt={2} height={300}>
                            <ResponsiveContainer width='100%' height='100%'>
                                <AreaChart data={chartData}>
                                    <CartesianGrid strokeDasharray='3 3' />
                                    <XAxis dataKey='timestamp' />
                                    <YAxis
                                        domain={energyDomain}
                                        label={{
                                            value: `Energy (${energyUnit})`,
                                            angle: -90,
                                            position: 'insideLeft',
                                        }}
                                    />
                                    <Tooltip />
                                    <Legend />
                                    <Area
                                        type='monotone'
                                        dataKey='consumption'
                                        stackId='1'
                                        stroke='#8884d8'
                                        fill='#8884d8'
                                        name='Consumption'
                                    />
                                    <Area
                                        type='monotone'
                                        dataKey='solarGeneration'
                                        stackId='2'
                                        stroke='#82ca9d'
                                        fill='#82ca9d'
                                        name='Solar Generation'
                                    />
                                </AreaChart>
                            </ResponsiveContainer>
                        </Box>
                        <Typography variant='body2' mt={1}>
                            Trend:{' '}
                            {data.consumption > data.solarGeneration
                                ? 'Net Consumer'
                                : 'Net Producer'}
                        </Typography>
                    </>
                )}
            </CardContent>
        </Card>
    );
};

export default EnergyWidget;
