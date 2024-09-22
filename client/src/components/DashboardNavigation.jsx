import React from 'react';
import { Container, Typography, Box, Button, Stack } from '@mui/material';
import { styled } from '@mui/material/styles';
import { Link as RouterLink } from 'react-router-dom';
import SensorsIcon from '@mui/icons-material/Sensors';
import Co2Icon from '@mui/icons-material/Co2';

const StyledSection = styled(Box)(({ theme }) => ({
    marginBottom: theme.spacing(6),
}));

const DashboardButton = styled(Button)(({ theme }) => ({
    padding: theme.spacing(4),
    fontSize: '1.2rem',
}));

const DashboardNavigation = () => {
    return (
        <Container maxWidth="md">
            <Box
                sx={{
                    marginTop: 8,
                    marginBottom: 8,
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                }}
            >
                <StyledSection>
                    <Typography variant="h2" gutterBottom align="center">
                        EcoTrack Dashboards
                    </Typography>
                    <Typography variant="body1" paragraph align="center">
                        Select a dashboard to view detailed environmental data and track your personal impact.
                    </Typography>
                </StyledSection>

                <Stack spacing={4}>
                    <DashboardButton
                        variant="contained"
                        color="primary"
                        startIcon={<SensorsIcon />}
                        component={RouterLink}
                        to="/environment-dashboard"
                        fullWidth
                    >
                        Environment Dashboard
                    </DashboardButton>

                    <DashboardButton
                        variant="contained"
                        color="secondary"
                        startIcon={<Co2Icon />}
                        component={RouterLink}
                        to="/carbon-footprint-dashboard"
                        fullWidth
                    >
                        Track Your Carbon Footprint
                    </DashboardButton>
                </Stack>
            </Box>
        </Container>
    );
};

export default DashboardNavigation;