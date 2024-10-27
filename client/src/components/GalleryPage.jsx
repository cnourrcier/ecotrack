import React, { useEffect, useState } from 'react';
import {
    Container,
    Typography,
    Box,
    Card,
    CardMedia,
    CardContent,
    Stack,
    Chip,
    Modal,
    IconButton,
    TextField,
    InputAdornment,
} from '@mui/material';
import { styled } from '@mui/material/styles';
import CloseIcon from '@mui/icons-material/Close';
import SearchIcon from '@mui/icons-material/Search';

const StyledSection = styled(Box)(({ theme }) => ({
    marginBottom: theme.spacing(6),
}));

const ImageCard = ({ image, title, category, onClick }) => (
    <Card onClick={onClick} sx={{ cursor: 'pointer' }}>
        <CardMedia component='img' height='200' image={image} alt={title} />
        <CardContent>
            <Typography variant='subtitle1' noWrap>
                {title}
            </Typography>
            <Chip label={category} size='small' />
        </CardContent>
    </Card>
);

const ModalImage = styled('img')({
    maxHeight: '90vh',
    maxWidth: '90vw',
    objectFit: 'contain',
});

const GalleryPage = () => {
    const [selectedImage, setSelectedImage] = useState(null);
    const [search, setSearch] = useState('');
    const [filter, setFilter] = useState('All');

    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    const handleSearchChange = (event) => {
        setSearch(event.target.value);
    };

    const handleFilterChange = (newFilter) => {
        setFilter(newFilter);
    };

    // Updated data for gallery images
    const galleryImages = [
        {
            id: 1,
            title: 'Urban Air Quality Monitoring Station',
            category: 'Air Quality',
            image: 'https://via.placeholder.com/400x300?text=Air+Quality+Station',
        },
        {
            id: 2,
            title: 'Weather Station Network',
            category: 'Weather Monitoring',
            image: 'https://via.placeholder.com/400x300?text=Weather+Station',
        },
        {
            id: 3,
            title: 'Noise Pollution Sensors',
            category: 'Noise Monitoring',
            image: 'https://via.placeholder.com/400x300?text=Noise+Sensors',
        },
        {
            id: 4,
            title: 'Urban Heat Island Mapping',
            category: 'Temperature Monitoring',
            image: 'https://via.placeholder.com/400x300?text=Heat+Island+Map',
        },
        {
            id: 5,
            title: 'Water Quality Monitoring Buoy',
            category: 'Water Quality',
            image: 'https://via.placeholder.com/400x300?text=Water+Quality+Buoy',
        },
        {
            id: 6,
            title: 'Forest Fire Detection System',
            category: 'Environmental Hazards',
            image: 'https://via.placeholder.com/400x300?text=Fire+Detection',
        },
        {
            id: 7,
            title: 'Pollen Count Sensor',
            category: 'Air Quality',
            image: 'https://via.placeholder.com/400x300?text=Pollen+Sensor',
        },
        {
            id: 8,
            title: 'Earthquake Early Warning System',
            category: 'Environmental Hazards',
            image: 'https://via.placeholder.com/400x300?text=Earthquake+Sensor',
        },
        {
            id: 9,
            title: 'Traffic Emissions Monitoring',
            category: 'Air Quality',
            image: 'https://via.placeholder.com/400x300?text=Traffic+Emissions',
        },
    ];

    const categories = [
        'All',
        ...new Set(galleryImages.map((img) => img.category)),
    ];

    const filteredImages = galleryImages.filter(
        (img) =>
            (filter === 'All' || img.category === filter) &&
            img.title.toLowerCase().includes(search.toLowerCase()),
    );

    return (
        <Container maxWidth='lg'>
            <StyledSection>
                <Typography variant='h2' gutterBottom>
                    EcoTrack Sensor Network Gallery
                </Typography>
                <Typography variant='body1' paragraph>
                    Explore images of our advanced environmental monitoring
                    systems, sensor networks, and data visualization projects
                    from around the world.
                </Typography>
            </StyledSection>

            <StyledSection>
                <TextField
                    fullWidth
                    variant='outlined'
                    placeholder='Search images...'
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
                    {categories.map((cat) => (
                        <Chip
                            key={cat}
                            label={cat}
                            onClick={() => handleFilterChange(cat)}
                            color={filter === cat ? 'primary' : 'default'}
                            sx={{ mb: 1 }}
                        />
                    ))}
                </Stack>
            </StyledSection>

            <StyledSection>
                <Stack
                    direction='row'
                    flexWrap='wrap'
                    justifyContent='space-between'
                    spacing={2}
                >
                    {filteredImages.map((img) => (
                        <Box
                            key={img.id}
                            sx={{
                                width: {
                                    xs: '100%',
                                    sm: 'calc(50% - 8px)',
                                    md: 'calc(33.333% - 10.667px)',
                                },
                                mb: 2,
                            }}
                        >
                            <ImageCard
                                {...img}
                                onClick={() => setSelectedImage(img)}
                            />
                        </Box>
                    ))}
                </Stack>
            </StyledSection>

            <Modal
                open={!!selectedImage}
                onClose={() => setSelectedImage(null)}
                sx={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                }}
            >
                <Box
                    sx={{
                        position: 'relative',
                        bgcolor: 'background.paper',
                        boxShadow: 24,
                        p: 4,
                    }}
                >
                    <IconButton
                        sx={{ position: 'absolute', right: 8, top: 8 }}
                        onClick={() => setSelectedImage(null)}
                    >
                        <CloseIcon />
                    </IconButton>
                    {selectedImage && (
                        <>
                            <ModalImage
                                src={selectedImage.image}
                                alt={selectedImage.title}
                            />
                            <Typography variant='h6' mt={2}>
                                {selectedImage.title}
                            </Typography>
                            <Typography
                                variant='subtitle1'
                                color='text.secondary'
                            >
                                {selectedImage.category}
                            </Typography>
                        </>
                    )}
                </Box>
            </Modal>
        </Container>
    );
};

export default GalleryPage;
