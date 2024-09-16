import React from 'react';
import { Paper, Typography, Box } from '@mui/material';

const KeyMetricsSummary = ({ data }) => {
    return (
        <Paper sx={{ p: 2, height: '100%' }}>
            <Typography variant="h6" gutterBottom>
                Key Metrics
            </Typography>
            <Box display="flex" flexWrap="wrap" gap={2}>
                <Box flexGrow={1} flexBasis="calc(33% - 8px)" minWidth="120px">
                    <Typography variant="subtitle1">Carbon Footprint</Typography>
                    <Typography variant="h5">{data.carbonFootprint} kg CO2e</Typography>
                </Box>
                <Box flexGrow={1} flexBasis="calc(33% - 8px)" minWidth="120px">
                    <Typography variant="subtitle1">Energy Saved</Typography>
                    <Typography variant="h5">{data.energySaved} kWh</Typography>
                </Box>
                <Box flexGrow={1} flexBasis="calc(33% - 8px)" minWidth="120px">
                    <Typography variant="subtitle1">Water Conserved</Typography>
                    <Typography variant="h5">{data.waterConserved} liters</Typography>
                </Box>
            </Box>
        </Paper>
    );
};

export default KeyMetricsSummary;