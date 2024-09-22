import React, { useEffect, useState } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Container, Typography, Button, Box, Stack, Paper } from '@mui/material';
import { styled } from '@mui/material/styles';
import backgroundImage from '../assets/images/ocean-background.svg';
import { motion } from 'framer-motion';

const BackgroundContainer = styled(Box)({
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: -1,
    backgroundImage: `url(${backgroundImage})`,
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    '&::after': {
        content: '""',
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.1)',
    },
});

const FrostedBox = styled(Paper)(({ theme }) => ({
    padding: theme.spacing(4),
    borderRadius: theme.shape.borderRadius,
    background: 'rgba(255, 255, 255, 0.7)',
    backdropFilter: 'blur(3px)',
    boxShadow: theme.shadows[5],
}));

const Home = () => {
    const { user } = useAuth();
    const [backgroundLoaded, setBackgroundLoaded] = useState(false);

    useEffect(() => {
        const img = new Image();
        img.src = backgroundImage;
        img.onload = () => {
            setBackgroundLoaded(true);
        };
    }, []);

    if (!backgroundLoaded) {
        return null;
    }

    return (
        <>
            <BackgroundContainer />
            <motion.div
                initial={{ opacity: 0, y: 80 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 1.5 }}
            >
                <Container maxWidth="md" sx={{ position: 'relative', zIndex: 1, height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <FrostedBox>
                        <Stack spacing={2} alignItems="center">
                            <Typography
                                variant="h2"
                                component="h1"
                                gutterBottom
                                align="center"
                                sx={{ fontWeight: 'bold', color: 'primary.main' }}
                            >
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
            </motion.div>
        </>
    );
};

export default Home;