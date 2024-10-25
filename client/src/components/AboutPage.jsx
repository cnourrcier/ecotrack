import React, { useEffect, useState } from "react";
import { Container, Typography, Box, Stack, Card, CardContent, CardMedia, Button, useTheme, useMediaQuery } from '@mui/material';
import { styled } from '@mui/material/styles';
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';

const StyledSection = styled(Box)(({ theme }) => ({
    marginBottom: theme.spacing(6),
}));

const TimelineItem = ({ year, event, imageSrc }) => (
    <Card elevation={3}>
        <CardMedia
            component="img"
            height="140"
            image={imageSrc}
            alt={`${year} event`}
        />
        <CardContent>
            <Typography variant="h6" gutterBottom>{year}</Typography>
            <Typography variant="body2">{event}</Typography>
        </CardContent>
    </Card>
);

const FeatureItem = ({ feature }) => (
    <Box display="flex" alignItems="center" mb={1}>
        <Box
            component="span"
            sx={{
                width: 8,
                height: 8,
                borderRadius: '50%',
                backgroundColor: 'secondary.main',
                display: 'inline-block',
                mr: 2,
            }}
        />
        <Typography>{feature}</Typography>
    </Box>
);

const FeaturedUserItem = ({ name, role, imageSrc }) => (
    <Card elevation={3}>
        <CardMedia
            component="img"
            height="200"
            image={imageSrc}
            alt={name}
        />
        <CardContent>
            <Typography variant="h6" gutterBottom>{name}</Typography>
            <Typography variant="body2">{role}</Typography>
        </CardContent>
    </Card>
);

const AboutPage = () => {
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    const timelineEvents = [
        { year: "2020", event: "EcoTrack founded, initial sensor network established", image: "https://via.placeholder.com/300x200?text=EcoTrack+Founded" },
        { year: "2021", event: "Launch of real-time air quality monitoring", image: "https://via.placeholder.com/300x200?text=Air+Quality+Monitoring" },
        { year: "2022", event: "Integration with weather stations for comprehensive climate data", image: "https://via.placeholder.com/300x200?text=Weather+Integration" },
        { year: "2023", event: "1 million active sensors milestone", image: "https://via.placeholder.com/300x200?text=1M+Sensors+Milestone" },
        { year: "2024", event: "Global sensor network expansion", image: "https://via.placeholder.com/300x200?text=Global+Expansion" },
    ];

    const [currentIndex, setCurrentIndex] = useState(0);
    const itemsToShow = isMobile ? 1 : 3;

    const scrollTimeline = (direction) => {
        if (direction === 'left' && currentIndex > 0) {
            setCurrentIndex(currentIndex - 1);
        } else if (direction === 'right' && currentIndex < timelineEvents.length - itemsToShow) {
            setCurrentIndex(currentIndex + 1);
        }
    };

    const visibleEvents = timelineEvents.slice(currentIndex, currentIndex + itemsToShow);

    const features = [
        "Real-time air quality monitoring",
        "High-precision weather data collection",
        "Advanced environmental analytics",
        "IoT sensor network integration",
        "Urban heat island mapping",
        "Noise pollution tracking",
    ];

    const featuredUsers = [
        { name: "Dr. Emma Green", role: "Environmental Researcher", image: "https://via.placeholder.com/300x400?text=Dr.+Emma+Green" },
        { name: "Alex Rivera", role: "City Planner", image: "https://via.placeholder.com/300x400?text=Alex+Rivera" },
        { name: "Sarah Chen", role: "Climate Tech Entrepreneur", image: "https://via.placeholder.com/300x400?text=Sarah+Chen" },
    ];

    return (
        <Container maxWidth="lg" sx={{ marginTop: 8, marginBottom: 8, }}>
            <StyledSection>
                <Typography variant="h2" gutterBottom>About EcoTrack</Typography>
                <Typography variant="body1">
                    EcoTrack is a cutting-edge environmental monitoring platform designed to provide precise, real-time data on various environmental metrics. Founded in 2020, our mission is to empower individuals, researchers, and organizations with accurate environmental insights to drive informed decision-making and positive environmental change.
                </Typography>
            </StyledSection>

            <StyledSection>
                <Typography variant="h4" gutterBottom>Our Journey</Typography>
                <Box position="relative">
                    <Stack direction="row" spacing={3} sx={{ overflowX: 'auto', pb: 2 }}>
                        {visibleEvents.map((event, index) => (
                            <Box key={currentIndex + index} sx={{ minWidth: isMobile ? '100%' : '30%' }}>
                                <TimelineItem year={event.year} event={event.event} imageSrc={event.image} />
                            </Box>
                        ))}
                    </Stack>
                    <Stack direction="row" justifyContent="space-between" mt={2}>
                        <Button onClick={() => scrollTimeline('left')} disabled={currentIndex === 0}>
                            <ArrowBackIosNewIcon />
                        </Button>
                        <Button onClick={() => scrollTimeline('right')} disabled={currentIndex === timelineEvents.length - itemsToShow}>
                            <ArrowForwardIosIcon />
                        </Button>
                    </Stack>
                </Box>
            </StyledSection>

            <StyledSection>
                <Typography variant="h4" gutterBottom>Key Features</Typography>
                <Stack direction="row" flexWrap="wrap" gap={2}>
                    {features.map((feature, index) => (
                        <Box key={index} width={{ xs: '100%', sm: 'calc(50% - 8px)' }}>
                            <FeatureItem feature={feature} />
                        </Box>
                    ))}
                </Stack>
            </StyledSection>

            <StyledSection>
                <Typography variant="h4" gutterBottom>Featured Users</Typography>
                <Stack direction={{ xs: 'column', sm: 'row' }} spacing={3}>
                    {featuredUsers.map((user, index) => (
                        <Box key={index} flex={1}>
                            <FeaturedUserItem name={user.name} role={user.role} imageSrc={user.image} />
                        </Box>
                    ))}
                </Stack>
            </StyledSection>

            <StyledSection>
                <Typography variant="h4" gutterBottom>Our Impact</Typography>
                <Typography variant="body1">
                    Since our inception, EcoTrack has deployed over 1 million sensors worldwide, providing crucial environmental data to researchers, policymakers, and citizens. Our network has contributed to numerous environmental studies, urban planning initiatives, and public health campaigns, driving positive change for our planet.
                </Typography>
            </StyledSection>

            <StyledSection>
                <Box bgcolor="primary.main" color="primary.contrastText" p={4} borderRadius={2}>
                    <Typography variant="h5" gutterBottom>
                        "EcoTrack's sensor network and data analytics have revolutionized our understanding of urban microclimates. It's not just a monitoring tool, it's a catalyst for evidence-based environmental policy."
                    </Typography>
                    <Typography variant="subtitle1">
                        - Dr. Jane Smith, Environmental Scientist
                    </Typography>
                </Box>
            </StyledSection>
        </Container>
    );
};

export default AboutPage;


// Replace the placeholder images with actual images.
// Further customize the styling to match the specific EcoTrack design language.