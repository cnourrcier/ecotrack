import React, { useEffect, useState } from 'react';
import {
    Container,
    Typography,
    Box,
    TextField,
    Button,
    Stack,
    Paper,
    Snackbar,
    Alert,
} from '@mui/material';
import { styled } from '@mui/material/styles';
import SendIcon from '@mui/icons-material/Send';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import PhoneIcon from '@mui/icons-material/Phone';
import EmailIcon from '@mui/icons-material/Email';

const StyledSection = styled(Box)(({ theme }) => ({
    marginBottom: theme.spacing(6),
}));

const ContactInfoItem = ({ icon, primary, secondary }) => (
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

const ContactPage = () => {
    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    const [formData, setFormData] = useState({
        name: '',
        email: '',
        subject: '',
        message: '',
    });
    const [snackbar, setSnackbar] = useState({
        open: false,
        message: '',
        severity: 'success',
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({
            ...prevData,
            [name]: value,
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        // Here you would typically send the form data to your backend
        console.log('Form submitted:', formData);
        setSnackbar({
            open: true,
            message: 'Message sent successfully!',
            severity: 'success',
        });
        // Reset form after submission
        setFormData({ name: '', email: '', subject: '', message: '' });
    };

    const handleSnackbarClose = (event, reason) => {
        if (reason === 'clickaway') {
            return;
        }
        setSnackbar({ ...snackbar, open: false });
    };

    return (
        <Container maxWidth='lg' sx={{ marginTop: 8, marginBottom: 8 }}>
            <StyledSection>
                <Typography variant='h2' gutterBottom>
                    Contact Us
                </Typography>
                <Typography variant='body1' paragraph>
                    Have questions or feedback? We'd love to hear from you. Use
                    the form below to get in touch with our team.
                </Typography>
            </StyledSection>

            <Stack direction={{ xs: 'column', md: 'row' }} spacing={4}>
                <Box flex={1}>
                    <Paper elevation={3} sx={{ p: 3 }}>
                        <form onSubmit={handleSubmit}>
                            <Stack spacing={3}>
                                <TextField
                                    fullWidth
                                    label='Name'
                                    name='name'
                                    value={formData.name}
                                    onChange={handleChange}
                                    required
                                />
                                <TextField
                                    fullWidth
                                    label='Email'
                                    name='email'
                                    type='email'
                                    value={formData.email}
                                    onChange={handleChange}
                                    required
                                />
                                <TextField
                                    fullWidth
                                    label='Subject'
                                    name='subject'
                                    value={formData.subject}
                                    onChange={handleChange}
                                    required
                                />
                                <TextField
                                    fullWidth
                                    label='Message'
                                    name='message'
                                    multiline
                                    rows={4}
                                    value={formData.message}
                                    onChange={handleChange}
                                    required
                                />
                                <Button
                                    type='submit'
                                    variant='contained'
                                    color='primary'
                                    endIcon={<SendIcon />}
                                >
                                    Send Message
                                </Button>
                            </Stack>
                        </form>
                    </Paper>
                </Box>

                <Box flex={1}>
                    <Paper elevation={3} sx={{ p: 3 }}>
                        <Typography variant='h5' gutterBottom>
                            Contact Information
                        </Typography>
                        <Stack spacing={3}>
                            <ContactInfoItem
                                icon={<LocationOnIcon color='primary' />}
                                primary='EcoTrack Headquarters'
                                secondary='123 Green Street, Eco City, EC 12345'
                            />
                            <ContactInfoItem
                                icon={<PhoneIcon color='primary' />}
                                primary='Phone'
                                secondary='+1 (555) 123-4567'
                            />
                            <ContactInfoItem
                                icon={<EmailIcon color='primary' />}
                                primary='Email'
                                secondary='contact@ecotrack.com'
                            />
                        </Stack>
                    </Paper>

                    <StyledSection>
                        {/* Placeholder for a map component */}
                        <Paper
                            elevation={3}
                            sx={{
                                p: 3,
                                mt: 4,
                                height: 200,
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                            }}
                        >
                            <Typography variant='body1'>
                                Map placeholder
                            </Typography>
                        </Paper>
                    </StyledSection>
                </Box>
            </Stack>

            <Snackbar
                open={snackbar.open}
                autoHideDuration={6000}
                onClose={handleSnackbarClose}
            >
                <Alert
                    onClose={handleSnackbarClose}
                    severity={snackbar.severity}
                    sx={{ width: '100%' }}
                >
                    {snackbar.message}
                </Alert>
            </Snackbar>
        </Container>
    );
};

export default ContactPage;

// Connect the form submission to your actual backend API.
// Implement more comprehensive form validation if needed.
// Replace the map placeholder with an interactive map component showing the company's location.
// Add additional ways to connect (ex social media links).
// Adjust the styling to match the specific EcoTrack design language.
// Ensure that the form is fully accessible, including proper labels and error messaging.
