import React, { useEffect } from 'react';
import {
    Container,
    Typography,
    Box,
    Stack,
    Card,
    CardContent,
    Button,
    Link,
    Divider,
} from '@mui/material';
import { styled } from '@mui/material/styles';
import DownloadIcon from '@mui/icons-material/Download';
import ArticleIcon from '@mui/icons-material/Article';

const StyledSection = styled(Box)(({ theme }) => ({
    marginBottom: theme.spacing(6),
}));

const PressReleaseItem = ({ title, date, summary, link }) => (
    <Card elevation={2} sx={{ mb: 2 }}>
        <CardContent>
            <Typography variant='h6' gutterBottom>
                {title}
            </Typography>
            <Typography variant='subtitle2' color='text.secondary' gutterBottom>
                {date}
            </Typography>
            <Typography variant='body2' paragraph>
                {summary}
            </Typography>
            <Button
                variant='outlined'
                startIcon={<ArticleIcon />}
                component={Link}
                href={link}
                target='_blank'
                rel='noopener noreferrer'
            >
                Read Full Release
            </Button>
        </CardContent>
    </Card>
);

const MediaMentionItem = ({ title, publication, date, link }) => (
    <Box mb={2}>
        <Typography variant='subtitle1'>
            <Link href={link} target='_blank' rel='noopener noreferrer'>
                {title}
            </Link>
        </Typography>
        <Typography variant='body2' color='text.secondary'>
            {publication} - {date}
        </Typography>
    </Box>
);

const PressPage = () => {
    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    const pressReleases = [
        {
            title: 'EcoTrack Unveils Advanced Air Quality Monitoring Network',
            date: 'June 15, 2024',
            summary:
                'EcoTrack introduces a cutting-edge network of air quality sensors, providing real-time data on pollutants and particulate matter across major urban areas.',
            link: '#',
        },
        {
            title: 'EcoTrack Partners with NOAA for Enhanced Weather Data Integration',
            date: 'April 22, 2024',
            summary:
                'EcoTrack announces a groundbreaking partnership with the National Oceanic and Atmospheric Administration to integrate high-precision weather data into its environmental monitoring platform.',
            link: '#',
        },
        {
            title: 'EcoTrack Launches Urban Heat Island Mapping Initiative',
            date: 'March 1, 2024',
            summary:
                'EcoTrack unveils a new feature utilizing its extensive sensor network to create detailed urban heat island maps, aiding city planners in developing cooling strategies.',
            link: '#',
        },
    ];

    const mediaMentions = [
        {
            title: "How EcoTrack's Sensor Network is Revolutionizing Environmental Science",
            publication: 'Nature',
            date: 'May 5, 2024',
            link: '#',
        },
        {
            title: 'EcoTrack: The Tech Company at the Forefront of Climate Change Research',
            publication: 'MIT Technology Review',
            date: 'April 12, 2024',
            link: '#',
        },
        {
            title: 'Interview with EcoTrack CTO: The Future of Environmental Monitoring',
            publication: 'IEEE Spectrum',
            date: 'March 28, 2024',
            link: '#',
        },
        {
            title: "EcoTrack's Data-Driven Approach to Tackling Urban Pollution",
            publication: 'CityLab',
            date: 'February 15, 2024',
            link: '#',
        },
    ];

    return (
        <Container maxWidth='lg'>
            <StyledSection>
                <Typography variant='h2' gutterBottom>
                    Press
                </Typography>
                <Typography variant='body1' paragraph>
                    Welcome to the EcoTrack press page. Here you'll find our
                    latest press releases, media mentions, and resources for
                    journalists.
                </Typography>
            </StyledSection>

            <StyledSection>
                <Typography variant='h4' gutterBottom>
                    Press Releases
                </Typography>
                <Stack spacing={2}>
                    {pressReleases.map((release, index) => (
                        <PressReleaseItem key={index} {...release} />
                    ))}
                </Stack>
            </StyledSection>

            <StyledSection>
                <Typography variant='h4' gutterBottom>
                    Media Mentions
                </Typography>
                <Stack spacing={2}>
                    {mediaMentions.map((mention, index) => (
                        <MediaMentionItem key={index} {...mention} />
                    ))}
                </Stack>
            </StyledSection>

            <StyledSection>
                <Typography variant='h4' gutterBottom>
                    Media Resources
                </Typography>
                <Stack direction='row' spacing={2}>
                    <Button
                        variant='contained'
                        startIcon={<DownloadIcon />}
                        component={Link}
                        href='#'
                        target='_blank'
                    >
                        Download Press Kit
                    </Button>
                    <Button
                        variant='contained'
                        startIcon={<DownloadIcon />}
                        component={Link}
                        href='#'
                        target='_blank'
                    >
                        Download Logo Pack
                    </Button>
                </Stack>
            </StyledSection>

            <Divider sx={{ my: 4 }} />

            <StyledSection>
                <Typography variant='h4' gutterBottom>
                    Media Contact
                </Typography>
                <Typography variant='body1'>
                    For press inquiries, please contact:
                </Typography>
                <Typography variant='body1'>
                    Sarah Johnson, PR Manager
                </Typography>
                <Typography variant='body1'>
                    Email: press@ecotrack.com
                </Typography>
                <Typography variant='body1'>Phone: (555) 123-4567</Typography>
            </StyledSection>
        </Container>
    );
};

export default PressPage;

// Adjust the styling to match the specific EcoTrack design language.
