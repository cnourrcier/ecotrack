import React, { useState, useEffect } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Container, Typography, Button, Box, Stack } from '@mui/material';
import { styled } from '@mui/material/styles';

const BackgroundContainer = styled(Box)({
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: -1,
    '&::after': {
        content: '""',
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
});

const FrostedBox = styled(Box)(({ theme }) => ({
    padding: theme.spacing(4),
    borderRadius: theme.shape.borderRadius,
    background: 'rgba(255, 255, 255, 0.2)',
    backdropFilter: 'blur(10px)',
    boxShadow: '0 4px 30px rgba(0, 0, 0, 0.1)',
    border: '1px solid rgba(255, 255, 255, 0.3)',
}));

const Home = () => {
    const { user } = useAuth();
    const [backgroundImage, setBackgroundImage] = useState('');

    useEffect(() => {
        // Fetch a nature-related image from Unsplash
        fetch(`https://api.unsplash.com/photos/random?query=nature&client_id=${process.env.REACT_APP_UNSPLASH_ACCESS_KEY}`)
            .then(response => response.json())
            .then(data => {
                setBackgroundImage(data.urls.regular);
            })
            .catch(error => console.error('Error fetching background image:', error));
    }, []);

    return (
        <>
            <BackgroundContainer sx={{ backgroundImage: `url(${backgroundImage})`, backgroundSize: 'cover', backgroundPosition: 'center' }} />
            <Container maxWidth="md" sx={{ position: 'relative', zIndex: 1, height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <FrostedBox>
                    <Stack spacing={2} alignItems="center">
                        <Typography variant="h2" component="h1" gutterBottom align="center">
                            Welcome to EcoTrack
                        </Typography>
                        <Typography variant="h5" component="p" gutterBottom align="center">
                            Track and reduce your environmental impact with EcoTrack.
                        </Typography>
                        {user ? (
                            <Stack spacing={2} alignItems="center" sx={{ mt: 2 }}>
                                <Typography variant="h6">
                                    Welcome back, {user.username}!
                                </Typography>
                                <Button
                                    component={RouterLink}
                                    to="/dashboard"
                                    variant="contained"
                                    color="primary"
                                    size="large"
                                >
                                    Go to Dashboard
                                </Button>
                            </Stack>
                        ) : (
                            <Stack direction="row" spacing={2} justifyContent="center" sx={{ mt: 2 }}>
                                <Button
                                    component={RouterLink}
                                    to="/login"
                                    variant="contained"
                                    color="primary"
                                    size="large"
                                >
                                    Login
                                </Button>
                                <Button
                                    component={RouterLink}
                                    to="/register"
                                    variant="outlined"
                                    color="primary"
                                    size="large"
                                >
                                    Register
                                </Button>
                            </Stack>
                        )}
                    </Stack>
                </FrostedBox>
            </Container>
        </>
    );
};

export default Home;