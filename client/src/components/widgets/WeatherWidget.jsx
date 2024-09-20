import React, { useState, useEffect, useCallback } from 'react';
import { Card, CardContent, Typography, Box } from '@mui/material';
import { ComposedChart, Line, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const WeatherWidget = ({ data, settings }) => {
    const [chartData, setChartData] = useState([]);
    const [tempDomain, setTempDomain] = useState([0, 40]);
    const [precipDomain, setPrecipDomain] = useState([0, 10]);

    const tempUnit = settings.useMetricUnits ? '°C' : '°F';
    const speedUnit = settings.useMetricUnits ? 'm/s' : 'mph';
    const precipUnit = settings.useMetricUnits ? 'mm' : 'in';

    const updateChartData = useCallback((newData) => {
        return (prevData) => {
            const newDataPoint = {
                temperature: parseFloat(newData.temperature),
                humidity: parseFloat(newData.humidity),
                pressure: parseFloat(newData.pressure),
                windSpeed: parseFloat(newData.windSpeed),
                precipitation: parseFloat(newData.precipitation) || 0,
                timestamp: new Date().toLocaleTimeString()
            };

            const updatedData = [...prevData, newDataPoint].slice(-10);

            // Update temperature domain
            const temps = updatedData.map(d => d.temperature);
            const minTemp = Math.min(...temps);
            const maxTemp = Math.max(...temps);
            setTempDomain([Math.floor(minTemp - 5), Math.ceil(maxTemp + 5)]);

            // Update precipitation domain
            const precips = updatedData.map(d => d.precipitation);
            const maxPrecip = Math.max(...precips);
            setPrecipDomain([0, Math.ceil(maxPrecip * 1.2)]); // 20% buffer

            return updatedData;
        }
    }, []);

    useEffect(() => {
        if (data) {
            setChartData(updateChartData(data));
        }
    }, [data, updateChartData]);

    const convertTemp = useCallback((celsius) => {
        return settings.useMetricUnits ? celsius : (celsius * 9 / 5) + 32;
    }, [settings.useMetricUnits]);

    const formatWindSpeed = useCallback((speed) => {
        return settings.useMetricUnits ? speed.toFixed(1) : (speed * 2.237).toFixed(1);
    }, [settings.useMetricUnits]);

    const convertPrecipitation = useCallback((mm) => {
        return settings.useMetricUnits ? mm : mm / 25.4; // Convert mm to inches
    }, [settings.useMetricUnits]);

    const getWindSpeedDescription = (speed) => {
        if (speed < 3) return 'Calm';
        if (speed < 10) return 'Light breeze';
        if (speed < 15) return 'Strong breeze';
        return 'Gale, stormy conditions';
    };

    const windSpeed = parseFloat(data?.windSpeed);
    const windSpeedDescription = getWindSpeedDescription(windSpeed);

    return (
        <Card>
            <CardContent>
                <Typography variant="h6" gutterBottom>Weather</Typography>
                <Box display="grid" gridTemplateColumns="repeat(2, 1fr)" gap={2}>
                    <Typography variant="body2">
                        Temperature: {convertTemp(parseFloat(data?.temperature)).toFixed(1)}{tempUnit}
                    </Typography>
                    <Typography variant="body2">
                        Humidity: {parseFloat(data?.humidity)}%
                    </Typography>
                    <Typography variant="body2">
                        Pressure: {parseFloat(data?.pressure)} hPa
                    </Typography>
                    <Typography variant="body2">
                        Wind Speed: {formatWindSpeed(windSpeed)} {speedUnit}
                    </Typography>
                </Box>
                <Typography variant="body2">
                    Precipitation: {convertPrecipitation(parseFloat(data?.precipitation)).toFixed(2)} {precipUnit}
                </Typography>
                <Typography variant="body2" mt={1}>
                    Wind Conditions: {windSpeedDescription}
                </Typography>
                {settings.showTrends && (
                    <><Box mt={2} height={300}>
                        <ResponsiveContainer width="100%" height="100%">
                            <ComposedChart data={chartData}>
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="timestamp" />
                                <YAxis
                                    yAxisId="left"
                                    domain={tempDomain}
                                    label={{ value: `Temperature (${tempUnit})`, angle: -90, position: 'insideLeft' }}
                                />
                                <YAxis
                                    yAxisId="right"
                                    orientation="right"
                                    domain={precipDomain}
                                    label={{ value: `Precipitation (${precipUnit})`, angle: 90, position: 'insideRight' }}
                                />
                                <Tooltip />
                                <Legend />
                                <Line yAxisId="left" type="monotone" dataKey="temperature" stroke="#8884d8" name="Temperature" />
                                <Bar yAxisId="right" dataKey="precipitation" fill="#82ca9d" name="Precipitation" />
                            </ComposedChart>
                        </ResponsiveContainer>
                    </Box>
                        <Typography variant="body2" mt={1}>
                            Trend: {Math.random() > 0.5 ? 'Warming' : 'Cooling'}
                        </Typography>
                    </>
                )}
            </CardContent>
        </Card>
    );
};

export default WeatherWidget;