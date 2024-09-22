import React, { useEffect, useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import {
    Container,
    Typography,
    Button,
    Box,
    Paper,
    CircularProgress,
    Alert,
    List,
    ListItem,
    ListItemText,
    Divider
} from '@mui/material';
import RefreshIcon from '@mui/icons-material/Refresh';
import PersonIcon from '@mui/icons-material/Person';

const Profile = () => {
    const { user, error: authError, fetchProfileData } = useAuth();
    const [profileData, setProfileData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const loadProfile = async () => {
        setLoading(true);
        setError(null);
        try {
            const data = await fetchProfileData();
            setProfileData(data);
        } catch (err) {
            console.error('Failed to load profile:', err);
            setError('Failed to load profile data. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadProfile();
    }, []);

    if (authError) {
        return <Alert severity="error">{authError}</Alert>;
    }

    return (
        <Container component="main" maxWidth="sm">
            <Box
                sx={{
                    marginTop: 8,
                    marginBottom: 8,
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                }}
            >
                <Paper elevation={3} sx={{ padding: 4, width: '100%' }}>
                    <Box
                        sx={{
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            mb: 2
                        }}
                    >
                        <PersonIcon sx={{ fontSize: 60, color: 'primary.main', mb: 2 }} />
                        <Typography component="h1" variant="h4" gutterBottom>
                            User Profile
                        </Typography>
                    </Box>

                    {error && (
                        <Alert severity="error" sx={{ mb: 2 }}>
                            {error}
                            <Button color="inherit" size="small" onClick={loadProfile}>
                                Retry
                            </Button>
                        </Alert>
                    )}

                    {loading ? (
                        <Box sx={{ display: 'flex', justifyContent: 'center', my: 4 }}>
                            <CircularProgress />
                        </Box>
                    ) : !profileData ? (
                        <Typography>No profile data available.</Typography>
                    ) : (
                        <List>
                            <ListItem>
                                <ListItemText primary="Username" secondary={profileData.user.username} />
                            </ListItem>
                            <Divider component="li" />
                            <ListItem>
                                <ListItemText primary="Email" secondary={profileData.user.email} />
                            </ListItem>
                            {/* Add more profile information here */}
                        </List>
                    )}

                    <Box sx={{ mt: 3, display: 'flex', justifyContent: 'center' }}>
                        <Button
                            variant="contained"
                            startIcon={<RefreshIcon />}
                            onClick={loadProfile}
                            disabled={loading}
                        >
                            Refresh Profile
                        </Button>
                    </Box>
                </Paper>
            </Box>
        </Container>
    );
};

export default Profile;