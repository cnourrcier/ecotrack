import React, { useEffect } from 'react';
import {
    Container,
    Typography,
    Box,
    Paper,
    Stack,
    Chip,
    Button,
} from '@mui/material';
import { styled } from '@mui/material/styles';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import PhoneIcon from '@mui/icons-material/Phone';
import EmailIcon from '@mui/icons-material/Email';
import DirectionsIcon from '@mui/icons-material/Directions';

const StyledSection = styled(Box)(({ theme }) => ({
    marginBottom: theme.spacing(6),
}));

const LocationInfoItem = ({ icon, primary, secondary }) => (
    <Stack direction='row' spacing={2} alignItems='center'>
        {icon}
        <Box>
            <Typography variant='body1'>{primary}</Typography>
            <Typography variant='body2' color='text.secondary'>
                {secondary}
            </Typography>
        </Box>
    </Stack>
);

const LocationCard = ({ name, address, phone, email, type }) => (
    <Paper elevation={3} sx={{ p: 3, mb: 3 }}>
        <Stack spacing={2}>
            <Typography variant='h5'>{name}</Typography>
            <Chip label={type} color='primary' size='small' />
            <LocationInfoItem
                icon={<LocationOnIcon color='primary' />}
                primary='Address'
                secondary={address}
            />
            <LocationInfoItem
                icon={<PhoneIcon color='primary' />}
                primary='Phone'
                secondary={phone}
            />
            <LocationInfoItem
                icon={<EmailIcon color='primary' />}
                primary='Email'
                secondary={email}
            />
            <Button
                variant='outlined'
                startIcon={<DirectionsIcon />}
                href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(address)}`}
                target='_blank'
                rel='noopener noreferrer'
            >
                Get Directions
            </Button>
        </Stack>
    </Paper>
);

const LocationPage = () => {
    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    // Mock data for locations
    const locations = [
        {
            name: 'EcoTrack Headquarters',
            address: '123 Green Street, Eco City, EC 12345, USA',
            phone: '+1 (555) 123-4567',
            email: 'info@ecotrack.com',
            type: 'Main Office',
        },
        {
            name: 'EcoTrack European Office',
            address: '45 Sustainable Lane, Green Town, GT 67890, Germany',
            phone: '+49 (0) 123 456789',
            email: 'europe@ecotrack.com',
            type: 'Regional Office',
        },
        {
            name: 'EcoTrack Asia-Pacific Hub',
            address: '789 Eco Boulevard, Greenville, GV 13579, Singapore',
            phone: '+65 6123 4567',
            email: 'apac@ecotrack.com',
            type: 'Regional Office',
        },
    ];

    return (
        <Container maxWidth='lg'>
            <StyledSection>
                <Typography variant='h2' gutterBottom>
                    Our Locations
                </Typography>
                <Typography variant='body1' paragraph>
                    EcoTrack is committed to making a global impact. Find our
                    offices around the world and get in touch with the team
                    nearest to you.
                </Typography>
            </StyledSection>

            <StyledSection>
                {/* Placeholder for a world map component */}
                <Paper
                    elevation={3}
                    sx={{
                        p: 3,
                        height: 400,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        mb: 4,
                    }}
                >
                    <Typography variant='body1'>
                        World Map placeholder - Showing all EcoTrack locations
                    </Typography>
                </Paper>
            </StyledSection>

            <StyledSection>
                <Typography variant='h4' gutterBottom>
                    Find Us
                </Typography>
                <Stack spacing={3}>
                    {locations.map((location, index) => (
                        <LocationCard key={index} {...location} />
                    ))}
                </Stack>
            </StyledSection>

            <StyledSection>
                <Typography variant='h4' gutterBottom>
                    Visit Us
                </Typography>
                <Typography variant='body1' paragraph>
                    We welcome visitors to our offices and sensor network
                    facilities. If you'd like to schedule a visit to see our
                    environmental monitoring systems in action or discuss
                    potential data collaborations, please contact the relevant
                    office directly using the information provided above. We
                    look forward to meeting you and exploring how our advanced
                    sensor technology and environmental data analytics can
                    contribute to your research, policy-making, or
                    sustainability initiatives.
                </Typography>
            </StyledSection>
        </Container>
    );
};

export default LocationPage;

// Implement an actual map component to replace the placeholder. Either static image of a world map with markers, or an interactive map with Mapbox.
// Add additional information about visiting procedures, office hours, and accessibility.
// Add photos of each office to give visitors a visual preview.
// Make sure all external links (ex "Get Directions" button) have appropriate rel attributes for security.
// Adjust the styling to match the specific EcoTrack design language.
