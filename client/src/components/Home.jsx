import React, { useEffect, useState } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Container, Typography, Button, Box, Stack, Paper } from '@mui/material';
import { styled } from '@mui/material/styles';
import backgroundImage from '../assets/images/ocean-background.svg';
import { motion, useAnimation } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import Slider from 'react-slick';
import { Avatar } from '@mui/material';
import SensorsIcon from '@mui/icons-material/Sensors';
import TimelineIcon from '@mui/icons-material/Timeline';
import CloudIcon from '@mui/icons-material/Cloud';

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
    background: 'rgba(255, 255, 255, 0.9)',
    backdropFilter: 'blur(3px)',
    boxShadow: theme.shadows[5],
}));

const FeatureIcon = styled(Box)(({ theme }) => ({
    backgroundColor: theme.palette.primary.main,
    color: theme.palette.common.white,
    borderRadius: '50%',
    padding: theme.spacing(2),
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: theme.spacing(2),
}));

// Testimonial data
const testimonials = [
    {
        name: 'Dr. Emily Chen',
        feedback: `EcoTrack's sensor data has revolutionized our local climate research!`,
        avatar: '/avatars/emily.jpg',
    },
    {
        name: 'City Planner Mike Rodriguez',
        feedback: 'The real-time environmental metrics from EcoTrack inform our urban development decisions.',
        avatar: '/avatars/mike.jpg',
    },
    {
        name: 'Environmentalist Aisha Patel',
        feedback: `EcoTrack's comprehensive data helps us identify and address environmental issues quickly.`,
        avatar: '/avatars/aisha.jpg',
    },
];

// Slider settings
const sliderSettings = {
    dots: true,
    arrows: false,
    infinite: true,
    speed: 500,
    autoplay: true,
    autoplaySpeed: 6000,
    slidesToShow: 1,
    slidesToScroll: 1,
    pauseOnHover: true,
};

const MotionContainer = ({ children }) => {
    const controls = useAnimation();
    const [ref, inView] = useInView({
        triggerOnce: true,
        threshold: 0.1,
    });

    useEffect(() => {
        if (inView) {
            controls.start('visible');
        }
    }, [controls, inView]);

    return (
        <motion.div
            ref={ref}
            animate={controls}
            initial="hidden"
            transition={{ duration: 0.6 }}
            variants={{
                visible: { opacity: 1, y: 0 },
                hidden: { opacity: 1, y: 140 }
            }}
        >
            {children}
        </motion.div>
    );
};

const Home = () => {
    const { user } = useAuth();
    const [backgroundLoaded, setBackgroundLoaded] = useState(false);
    const [greeting, setGreeting] = useState('');

    useEffect(() => {
        const img = new Image();
        img.src = backgroundImage;
        img.onload = () => {
            setBackgroundLoaded(true);
        };

        const currentHour = new Date().getHours();
        let greetingMessage = (currentHour >= 3 && currentHour < 12) ? 'Good Morning' :
            (currentHour > 12 && currentHour < 17) ? 'Good afternoon' :
                'Good Evening';

        setGreeting(greetingMessage);
    }, []);

    if (!backgroundLoaded) {
        return null;
    }

    return (
        <>
            <BackgroundContainer />
            <Box sx={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
                {/* Hero Section */}
                <Container maxWidth="md" sx={{ height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <motion.div
                        initial={{ opacity: 1, y: 80 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 1.5 }}
                    >
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
                                    Track your environmental metrics with EcoTrack.
                                </Typography>
                                {user ? (
                                    <Stack spacing={2} alignItems="center" sx={{ mt: 2 }}>
                                        <Typography variant="h6">
                                            {greeting} {user.username}!
                                        </Typography>
                                        <Button
                                            component={RouterLink}
                                            to="/dashboard-navigation"
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
                    </motion.div>
                </Container>

                {/* Features Section */}
                <MotionContainer>
                    <Container maxWidth="md" sx={{ my: 8 }}>
                        <Typography variant="h3" align="center" gutterBottom sx={{ mb: 6 }}>
                            Why Choose EcoTrack?
                        </Typography>
                        <Stack direction={{ xs: 'column', md: 'row' }} spacing={4} justifyContent="center">
                            {[
                                { icon: <SensorsIcon fontSize="large" />, title: 'Advanced Sensor Network', description: 'Utilize our cutting-edge sensor technology to gather precise environmental data in real-time.' },
                                { icon: <TimelineIcon fontSize="large" />, title: 'Comprehensive Analytics', description: 'Access detailed reports and visualizations to track environmental metrics over time.' },
                                { icon: <CloudIcon fontSize="large" />, title: 'Weather Integration', description: 'Incorporate local weather data to provide context and enhance environmental insights.' }
                            ].map((feature, index) => (
                                <FrostedBox key={index} sx={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center' }}>
                                    <FeatureIcon>
                                        {feature.icon}
                                    </FeatureIcon>
                                    <Typography variant="h5" gutterBottom>
                                        {feature.title}
                                    </Typography>
                                    <Typography>
                                        {feature.description}
                                    </Typography>
                                </FrostedBox>
                            ))}
                        </Stack>
                    </Container>
                </MotionContainer>

                {/* Testimonials Section */}
                <MotionContainer>
                    <Container maxWidth="md" sx={{ my: 8 }}>
                        <Typography variant="h3" align="center" gutterBottom sx={{ mb: 6 }}>
                            What Our Users Say
                        </Typography>
                        <FrostedBox>
                            <Slider {...sliderSettings}>
                                {testimonials.map((testimonial, index) => (
                                    <Box key={index} sx={{ px: 2 }}>
                                        <Stack spacing={2} alignItems="center">
                                            <Avatar
                                                src={testimonial.avatar}
                                                alt={testimonial.name}
                                                sx={{ width: 80, height: 80 }}
                                            />
                                            <Typography variant="h6" align="center">
                                                {testimonial.name}
                                            </Typography>
                                            <Typography variant="body1" align="center" sx={{ fontStyle: 'italic' }}>
                                                "{testimonial.feedback}"
                                            </Typography>
                                        </Stack>
                                    </Box>
                                ))}
                            </Slider>
                        </FrostedBox>
                    </Container>
                </MotionContainer>

                {/* Call to Action Section */}
                <MotionContainer>
                    <Container maxWidth="md" sx={{ my: 8 }}>
                        <FrostedBox>
                            <Stack spacing={3} alignItems="center">
                                <Typography variant="h3" align="center">
                                    Ready to Harness the Power of Environmental Data?
                                </Typography>
                                <Typography variant="h6" align="center">
                                    Join EcoTrack today and gain access to cutting-edge sensor technology and real-time environmental metrics.
                                </Typography>
                                <Button
                                    component={RouterLink}
                                    to="/register"
                                    variant="contained"
                                    color="primary"
                                    size="large"
                                >
                                    Get Started Now
                                </Button>
                            </Stack>
                        </FrostedBox>
                    </Container>
                </MotionContainer>
            </Box>
        </>
    );
};

export default Home;