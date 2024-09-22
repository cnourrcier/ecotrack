import React, { useEffect, useState } from 'react';
import { Container, Typography, Box, Card, CardContent, CardMedia, Stack, Chip, Button, Pagination, TextField, InputAdornment } from '@mui/material';
import { styled } from '@mui/material/styles';
import SearchIcon from '@mui/icons-material/Search';

const StyledSection = styled(Box)(({ theme }) => ({
    marginBottom: theme.spacing(6),
}));

const BlogPostCard = ({ title, date, summary, image, categories }) => (
    <Card elevation={3}>
        <CardMedia
            component="img"
            height="200"
            image={image}
            alt={title}
        />
        <CardContent>
            <Typography variant="h6" gutterBottom>{title}</Typography>
            <Typography variant="subtitle2" color="text.secondary" gutterBottom>{date}</Typography>
            <Typography variant="body2" paragraph>{summary}</Typography>
            <Box mb={2}>
                {categories.map((category, index) => (
                    <Chip key={index} label={category} size="small" sx={{ mr: 1, mb: 1 }} />
                ))}
            </Box>
            <Button variant="outlined">Read More</Button>
        </CardContent>
    </Card>
);

const FeaturedPost = ({ title, date, summary, image, categories }) => (
    <Card elevation={5}>
        <Stack direction={{ xs: 'column', md: 'row' }}>
            <Box sx={{ flex: 1, minHeight: { xs: 200, md: 'auto' } }}>
                <CardMedia
                    component="img"
                    height="100%"
                    image={image}
                    alt={title}
                    sx={{ objectFit: 'cover' }}
                />
            </Box>
            <Box sx={{ flex: 1 }}>
                <CardContent>
                    <Typography variant="h5" gutterBottom>{title}</Typography>
                    <Typography variant="subtitle1" color="text.secondary" gutterBottom>{date}</Typography>
                    <Typography variant="body1" paragraph>{summary}</Typography>
                    <Box mb={2}>
                        {categories.map((category, index) => (
                            <Chip key={index} label={category} size="small" sx={{ mr: 1, mb: 1 }} />
                        ))}
                    </Box>
                    <Button variant="contained">Read Featured Post</Button>
                </CardContent>
            </Box>
        </Stack>
    </Card>
);

const BlogPage = () => {
    const [page, setPage] = useState(1);
    const [search, setSearch] = useState('');

    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    const handlePageChange = (event, value) => {
        setPage(value);
    };

    const handleSearchChange = (event) => {
        setSearch(event.target.value);
    };

    // Mock data for blog posts
    const blogPosts = [
        {
            title: "Understanding Air Quality Index: What EcoTrack Sensors Reveal",
            date: "June 15, 2024",
            summary: "Dive into the world of air quality monitoring and learn how EcoTrack's advanced sensors provide crucial insights into the air we breathe.",
            image: "https://via.placeholder.com/400x200?text=Air+Quality+Sensors",
            categories: ["Air Quality", "Technology"]
        },
        {
            title: "Climate Change in Your Backyard: Local Trends Detected by EcoTrack",
            date: "May 28, 2024",
            summary: "Explore how EcoTrack's network of weather stations and sensors are uncovering local climate trends and what they mean for your community.",
            image: "https://via.placeholder.com/400x200?text=Local+Climate+Trends",
            categories: ["Climate Change", "Data Analysis"]
        },
        {
            title: "Urban Heat Islands: How EcoTrack is Helping Cities Stay Cool",
            date: "May 10, 2024",
            summary: "Discover how city planners are using EcoTrack's temperature and humidity data to combat the urban heat island effect and create cooler, more livable cities.",
            image: "https://via.placeholder.com/400x200?text=Urban+Heat+Islands",
            categories: ["Urban Planning", "Temperature Monitoring"]
        },
        {
            title: "The Power of Citizen Science: How EcoTrack Users Contribute to Environmental Research",
            date: "April 22, 2024",
            summary: "Learn how data from EcoTrack's user-deployed sensors is being used by researchers to gain new insights into environmental patterns and phenomena.",
            image: "https://via.placeholder.com/400x200?text=Citizen+Science",
            categories: ["Research", "Community"]
        },
        {
            title: "Noise Pollution: The Silent Environmental Threat EcoTrack is Helping to Address",
            date: "April 5, 2024",
            summary: "Explore the often-overlooked issue of noise pollution and how EcoTrack's acoustic sensors are helping communities identify and mitigate excessive noise.",
            image: "https://via.placeholder.com/400x200?text=Noise+Pollution",
            categories: ["Noise Monitoring", "Urban Health"]
        },
        {
            title: "From Data to Action: Success Stories of Environmental Improvements Driven by EcoTrack Insights",
            date: "March 20, 2024",
            summary: "Read inspiring case studies of how organizations and communities have used EcoTrack data to implement successful environmental improvement initiatives.",
            image: "https://via.placeholder.com/400x200?text=Success+Stories",
            categories: ["Case Studies", "Environmental Action"]
        }
    ];
    return (
        <Container maxWidth="lg" sx={{ marginTop: 8, marginBottom: 8, }}>
            <StyledSection>
                <Typography variant="h2" gutterBottom>EcoTrack Blog</Typography>
                <Typography variant="body1" paragraph>
                    Stay informed about the latest in sustainable living, environmental news, and EcoTrack updates.
                </Typography>
            </StyledSection>

            <StyledSection>
                <TextField
                    fullWidth
                    variant="outlined"
                    placeholder="Search blog posts..."
                    value={search}
                    onChange={handleSearchChange}
                    InputProps={{
                        startAdornment: (
                            <InputAdornment position="start">
                                <SearchIcon />
                            </InputAdornment>
                        ),
                    }}
                />
            </StyledSection>

            <StyledSection>
                <Typography variant="h4" gutterBottom>Featured Post</Typography>
                <FeaturedPost
                    title="EcoTrack Reaches 1 Million Users Milestone"
                    date="June 5, 2024"
                    summary="We're thrilled to announce that EcoTrack has reached 1 million active users! Learn about our journey and the collective impact our community has made."
                    image="https://via.placeholder.com/800x400?text=EcoTrack+Milestone"
                    categories={["Milestone", "Community"]}
                />
            </StyledSection>

            <StyledSection>
                <Typography variant="h4" gutterBottom>Latest Posts</Typography>
                <Stack direction="row" flexWrap="wrap" justifyContent="space-between" spacing={2}>
                    {blogPosts.map((post, index) => (
                        <Box key={index} sx={{ width: { xs: '100%', md: 'calc(50% - 8px)', lg: 'calc(33.333% - 10.667px)' }, mb: 2 }}>
                            <BlogPostCard {...post} />
                        </Box>
                    ))}
                </Stack>
            </StyledSection>

            <Box display="flex" justifyContent="center" mt={4}>
                <Pagination count={10} page={page} onChange={handlePageChange} />
            </Box>
        </Container >
    );
};

export default BlogPage;


// Implement the search functionality, likely by filtering posts based on the search term.
// Connect the pagination to the actual blog post data, possibly fetching new posts when the page changes.
// Create a separate component or page for individual blog post views, and link the "Read More" buttons to these views.
// Adjust the styling to match the specific EcoTrack design language.
// Add category filtering functionality to enable users to view posts from specific categories.