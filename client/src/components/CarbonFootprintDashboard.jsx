import React, { useState } from 'react';
import { Container, Typography, Box, Paper, Stack, TextField, Button, Slider, CircularProgress } from '@mui/material';
import { styled } from '@mui/material/styles';
import DirectionsCarIcon from '@mui/icons-material/DirectionsCar';
import HomeIcon from '@mui/icons-material/Home';
import FlightIcon from '@mui/icons-material/Flight';
import RestaurantIcon from '@mui/icons-material/Restaurant';

const StyledSection = styled(Paper)(({ theme }) => ({
    padding: theme.spacing(3),
    marginBottom: theme.spacing(3),
}));

const CarbonFootprintDashboard = () => {
    const [transportation, setTransportation] = useState(0);
    const [homeEnergy, setHomeEnergy] = useState(0);
    const [diet, setDiet] = useState(2); // 0: Vegan, 1: Vegetarian, 2: Omnivore
    const [flights, setFlights] = useState(0);

    const calculateFootprint = () => {
        // This is a simplified calculation and should be replaced with more accurate models
        const transportationEmissions = transportation * 0.2; // kg CO2 per km
        const homeEnergyEmissions = homeEnergy * 0.5; // kg CO2 per kWh
        const dietEmissions = [1000, 1500, 2000][diet]; // kg CO2 per year
        const flightEmissions = flights * 200; // kg CO2 per flight

        return transportationEmissions + homeEnergyEmissions + dietEmissions + flightEmissions;
    };

    const totalFootprint = calculateFootprint();

    return (
        <Container maxWidth="lg" sx={{ marginTop: 8, marginBottom: 8, }}>
            <Typography variant="h2" gutterBottom>Carbon Footprint Dashboard</Typography>

            <StyledSection>
                <Stack direction="row" justifyContent="space-between" alignItems="center">
                    <Typography variant="h4">Your Carbon Footprint</Typography>
                    <Box position="relative" display="inline-flex">
                        <CircularProgress variant="determinate" value={Math.min(totalFootprint / 100, 100)} size={80} />
                        <Box
                            top={0}
                            left={0}
                            bottom={0}
                            right={0}
                            position="absolute"
                            display="flex"
                            alignItems="center"
                            justifyContent="center"
                        >
                            <Typography variant="caption" component="div" color="text.secondary">
                                {`${Math.round(totalFootprint)} kg`}
                            </Typography>
                        </Box>
                    </Box>
                </Stack>
            </StyledSection>

            <StyledSection>
                <Typography variant="h5" gutterBottom>Transportation <DirectionsCarIcon /></Typography>
                <TextField
                    label="Km driven per week"
                    type="number"
                    value={transportation}
                    onChange={(e) => setTransportation(Number(e.target.value))}
                    fullWidth
                    margin="normal"
                />
            </StyledSection>

            <StyledSection>
                <Typography variant="h5" gutterBottom>Home Energy <HomeIcon /></Typography>
                <TextField
                    label="kWh used per month"
                    type="number"
                    value={homeEnergy}
                    onChange={(e) => setHomeEnergy(Number(e.target.value))}
                    fullWidth
                    margin="normal"
                />
            </StyledSection>

            <StyledSection>
                <Typography variant="h5" gutterBottom>Diet <RestaurantIcon /></Typography>
                <Slider
                    value={diet}
                    onChange={(e, newValue) => setDiet(newValue)}
                    step={1}
                    marks
                    min={0}
                    max={2}
                    valueLabelDisplay="auto"
                    valueLabelFormat={(value) => ['Vegan', 'Vegetarian', 'Omnivore'][value]}
                />
            </StyledSection>

            <StyledSection>
                <Typography variant="h5" gutterBottom>Air Travel <FlightIcon /></Typography>
                <TextField
                    label="Flights per year"
                    type="number"
                    value={flights}
                    onChange={(e) => setFlights(Number(e.target.value))}
                    fullWidth
                    margin="normal"
                />
            </StyledSection>

            <Button variant="contained" color="primary" size="large" fullWidth>
                Get Personalized Reduction Tips
            </Button>
        </Container>
    );
};

export default CarbonFootprintDashboard;


// Adjust the styling to fit the specific EcoTrack design language.
// Implement actual logic for carbon footprint calculation. The current calculation is a simplified version and should be replaced with more accurate models.