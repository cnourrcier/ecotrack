import React, { useEffect, useState } from 'react';
import {
    Container,
    Typography,
    Box,
    Accordion,
    AccordionSummary,
    AccordionDetails,
    TextField,
    InputAdornment,
    Stack,
    Chip,
} from '@mui/material';
import { styled } from '@mui/material/styles';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import SearchIcon from '@mui/icons-material/Search';

const StyledSection = styled(Box)(({ theme }) => ({
    marginBottom: theme.spacing(6),
}));

const FAQPage = () => {
    const [search, setSearch] = useState('');
    const [expandedPanel, setExpandedPanel] = useState(false);
    const [selectedCategory, setSelectedCategory] = useState('All');

    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    const handleSearchChange = (event) => {
        setSearch(event.target.value);
    };

    const handleAccordionChange = (panel) => (event, isExpanded) => {
        setExpandedPanel(isExpanded ? panel : false);
    };

    const handleCategoryChange = (category) => {
        setSelectedCategory(category);
    };

    // Mock data for FAQ items
    const faqItems = [
        {
            question: 'What is EcoTrack?',
            answer: 'EcoTrack is an advanced environmental monitoring platform that uses a network of sensors and weather data to track and analyze various environmental metrics. It provides real-time data, comprehensive analytics, and actionable insights for individuals, researchers, and organizations committed to understanding and improving environmental conditions.',
            category: 'General',
        },
        {
            question: 'How does EcoTrack collect environmental data?',
            answer: 'EcoTrack uses a combination of IoT sensors, weather stations, and satellite data to collect a wide range of environmental metrics. Our sensors measure air quality, temperature, humidity, noise levels, and more. This data is then integrated with local weather information and processed through our advanced analytics engine.',
            category: 'Technology',
        },
        {
            question:
                'What kind of environmental metrics does EcoTrack monitor?',
            answer: 'EcoTrack monitors a variety of environmental metrics including air quality (PM2.5, PM10, CO2, VOCs), temperature, humidity, noise levels, UV index, and more. We also track weather patterns and can provide insights on trends related to climate change in your area.',
            category: 'Features',
        },
        {
            question: "How accurate is EcoTrack's data?",
            answer: 'EcoTrack uses high-precision sensors and advanced data processing algorithms to ensure high accuracy. Our sensors are regularly calibrated and cross-verified with official environmental monitoring stations. While the exact accuracy can vary depending on the specific metric and local conditions, we strive to maintain an accuracy level of 95% or higher for most measurements.',
            category: 'Data Quality',
        },
        {
            question: 'Can businesses or researchers use EcoTrack?',
            answer: 'Absolutely! EcoTrack offers solutions for businesses, research institutions, and government organizations. Our platform includes features for large-scale environmental monitoring, data analysis, custom reporting, and API access for integration with other systems. Contact our sales team for more information on our professional and research-grade solutions.',
            category: 'Professional Use',
        },
        {
            question: 'Is EcoTrack data available worldwide?',
            answer: 'EcoTrack is continuously expanding its sensor network globally. While we have extensive coverage in many urban and suburban areas, availability may vary in rural or remote locations. We also supplement our sensor data with satellite information for broader coverage. Check our coverage map for specific details about data availability in your area.',
            category: 'Availability',
        },
        {
            question: 'How can I access EcoTrack data?',
            answer: 'You can access EcoTrack data through our web platform or mobile app. For basic users, we provide easy-to-understand dashboards and reports. For advanced users, researchers, or businesses, we offer raw data downloads, API access, and integration with popular data analysis tools. Sign up for an account to explore the options that best suit your needs.',
            category: 'Data Access',
        },
        {
            question: 'Is my personal information secure on EcoTrack?',
            answer: 'Yes, we take data security very seriously. While we collect and analyze environmental data, we minimize the collection of personal information. Any personal data we do collect is encrypted and stored securely. We never share individual user data with third parties without explicit consent. You can review our privacy policy for more details on how we handle and protect your information.',
            category: 'Privacy & Security',
        },
    ];

    const categories = [
        'All',
        ...new Set(faqItems.map((item) => item.category)),
    ];

    const filteredFAQs = faqItems.filter(
        (item) =>
            (selectedCategory === 'All' ||
                item.category === selectedCategory) &&
            (item.question.toLowerCase().includes(search.toLowerCase()) ||
                item.answer.toLowerCase().includes(search.toLowerCase())),
    );

    return (
        <Container maxWidth='lg' sx={{ marginTop: 8, marginBottom: 8 }}>
            <StyledSection>
                <Typography variant='h2' gutterBottom>
                    Frequently Asked Questions
                </Typography>
                <Typography variant='body1' paragraph>
                    Find answers to common questions about EcoTrack and how to
                    use our platform effectively.
                </Typography>
            </StyledSection>

            <StyledSection>
                <TextField
                    fullWidth
                    variant='outlined'
                    placeholder='Search FAQ...'
                    value={search}
                    onChange={handleSearchChange}
                    InputProps={{
                        startAdornment: (
                            <InputAdornment position='start'>
                                <SearchIcon />
                            </InputAdornment>
                        ),
                    }}
                />
            </StyledSection>

            <StyledSection>
                <Stack direction='row' spacing={1} flexWrap='wrap'>
                    {categories.map((category) => (
                        <Chip
                            key={category}
                            label={category}
                            onClick={() => handleCategoryChange(category)}
                            color={
                                selectedCategory === category
                                    ? 'primary'
                                    : 'default'
                            }
                            sx={{ mb: 1 }}
                        />
                    ))}
                </Stack>
            </StyledSection>

            <StyledSection>
                {filteredFAQs.map((item, index) => (
                    <Accordion
                        key={index}
                        expanded={expandedPanel === `panel${index}`}
                        onChange={handleAccordionChange(`panel${index}`)}
                    >
                        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                            <Typography>{item.question}</Typography>
                        </AccordionSummary>
                        <AccordionDetails>
                            <Typography>{item.answer}</Typography>
                        </AccordionDetails>
                    </Accordion>
                ))}
            </StyledSection>

            {filteredFAQs.length === 0 && (
                <Typography variant='body1' align='center'>
                    No matching questions found. Please try a different search
                    term or category.
                </Typography>
            )}
        </Container>
    );
};

export default FAQPage;

// Add more advanced search functionality? (ex fuzzy search).
// Adjust the styling to match the specific EcoTrack design language.
// Add analytics to track which questions are viewed most often.
