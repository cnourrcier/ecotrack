import React from 'react';
import { Link as RouterLink } from 'react-router-dom';
import { Box, Container, Grid, Typography, Link, Stack } from '@mui/material';
import { styled } from '@mui/material/styles';

const StyledFooter = styled('footer')(({ theme }) => ({
    backgroundColor: theme.palette.primary.main,
    color: theme.palette.primary.contrastText,
    padding: theme.spacing(6, 0),
    [theme.breakpoints.down('sm')]: {
        padding: theme.spacing(4, 0),
    },
}));

const FooterLink = styled(Link)(({ theme }) => ({
    color: theme.palette.primary.contrastText,
    '&:hover': {
        color: theme.palette.secondary.main,
    },
}));

const Footer = () => {
    return (
        <StyledFooter>
            <Container maxWidth='lg'>
                <Grid container spacing={4}>
                    <Grid item xs={12} sm={4}>
                        <Typography variant='h6' gutterBottom>
                            EcoTrack
                        </Typography>
                        <Typography variant='body2'>
                            Track your environmental metrics with EcoTrack.
                        </Typography>
                    </Grid>
                    <Grid item xs={12} sm={4}>
                        <Typography variant='h6' gutterBottom>
                            Quick Links
                        </Typography>
                        <Stack spacing={1}>
                            {[
                                { to: '/', text: 'Home' },
                                { to: '/about', text: 'About' },
                                { to: '/gallery', text: 'Gallery' },
                                { to: '/location', text: 'Location' },
                                { to: '/blog', text: 'Blog' },
                                { to: '/faq', text: 'FAQ' },
                                { to: '/press', text: 'Press' },
                                { to: '/contact', text: 'Contact' },
                            ].map((link) => (
                                <FooterLink
                                    key={link.to}
                                    component={RouterLink}
                                    to={link.to}
                                >
                                    {link.text}
                                </FooterLink>
                            ))}
                        </Stack>
                    </Grid>
                    <Grid item xs={12} sm={4}>
                        <Typography variant='h6' gutterBottom>
                            Contact Us
                        </Typography>
                        <Typography variant='body2'>
                            123 EcoTrack Blvd, EcoTrack, CA 92262
                        </Typography>
                        <Typography variant='body2'>
                            Phone: (555) 123-4567
                        </Typography>
                        <Typography variant='body2'>
                            Email: info@ecotrack.com
                        </Typography>
                    </Grid>
                </Grid>
                <Box mt={5}>
                    <Typography variant='body2' align='center'>
                        © {new Date().getFullYear()} EcoTrack. All rights
                        reserved.
                    </Typography>
                </Box>
            </Container>
        </StyledFooter>
    );
};

export default Footer;
