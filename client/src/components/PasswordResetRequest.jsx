import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import {
    Container,
    Typography,
    TextField,
    Button,
    Box,
    Paper,
    Alert,
} from '@mui/material';
import LockResetIcon from '@mui/icons-material/LockReset';

const PasswordResetRequest = () => {
    const [email, setEmail] = useState('');
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');
    const { resetPasswordRequest } = useAuth();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setMessage('');
        setError('');

        try {
            await resetPasswordRequest(email);
            setMessage('Password reset link sent to your email');
        } catch (err) {
            setError(err.response?.data?.message || 'An error occurred');
        }
    };

    return (
        <Container component='main' maxWidth='xs'>
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
                            mb: 2,
                        }}
                    >
                        <LockResetIcon
                            sx={{ fontSize: 40, color: 'primary.main', mb: 1 }}
                        />
                        <Typography component='h1' variant='h5'>
                            Reset Password
                        </Typography>
                    </Box>
                    {message && (
                        <Alert severity='success' sx={{ mb: 2 }}>
                            {message}
                        </Alert>
                    )}
                    {error && (
                        <Alert severity='error' sx={{ mb: 2 }}>
                            {error}
                        </Alert>
                    )}
                    <Box
                        component='form'
                        onSubmit={handleSubmit}
                        noValidate
                        sx={{ mt: 1 }}
                    >
                        <TextField
                            margin='normal'
                            required
                            fullWidth
                            id='email'
                            label='Email Address'
                            name='email'
                            autoComplete='email'
                            autoFocus
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />
                        <Button
                            type='submit'
                            fullWidth
                            variant='contained'
                            sx={{ mt: 3, mb: 2 }}
                        >
                            Send Reset Link
                        </Button>
                    </Box>
                </Paper>
            </Box>
        </Container>
    );
};

export default PasswordResetRequest;
