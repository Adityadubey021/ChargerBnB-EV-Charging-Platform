import React, { useState } from 'react';
import {
    Container,
    Paper,
    Typography,
    TextField,
    Button,
    Box,
    Alert,
    InputAdornment,
    IconButton,
} from '@mui/material';
import { Visibility, VisibilityOff, AdminPanelSettings } from '@mui/icons-material';
import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

const AdminLogin: React.FC = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            const response = await axios.post(`${API_URL}/auth/login`, { email, password });
            const { accessToken, refreshToken, user } = response.data;

            // Check if user is admin
            if (user.role !== 'ADMIN') {
                setError('Access denied. Admin privileges required.');
                setLoading(false);
                return;
            }

            // Store tokens and user
            localStorage.setItem('accessToken', accessToken);
            localStorage.setItem('refreshToken', refreshToken);
            localStorage.setItem('user', JSON.stringify(user));

            // Direct navigation to admin dashboard
            window.location.href = '/admin/dashboard';
        } catch (err: any) {
            console.error('Admin login error:', err);
            setError(err.response?.data?.error || 'Login failed. Please check your credentials.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <Container maxWidth="sm" sx={{ py: 8 }}>
            <Paper
                elevation={10}
                sx={{
                    p: 4,
                    background: 'linear-gradient(135deg, #1a1a1a 0%, #2a2a2a 100%)',
                    color: 'white',
                    borderRadius: 4,
                }}
            >
                <Box sx={{ textAlign: 'center', mb: 4 }}>
                    <AdminPanelSettings sx={{ fontSize: 60, color: '#FF6B35', mb: 2 }} />
                    <Typography variant="h4" gutterBottom sx={{ fontWeight: 700 }}>
                        Admin Access
                    </Typography>
                    <Typography variant="body2" sx={{ color: '#b0b0b0' }}>
                        Authorized personnel only
                    </Typography>
                </Box>

                {error && (
                    <Alert severity="error" sx={{ mb: 3 }}>
                        {error}
                    </Alert>
                )}

                <form onSubmit={handleSubmit}>
                    <TextField
                        fullWidth
                        label="Email"
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        sx={{
                            mb: 3,
                            '& .MuiOutlinedInput-root': {
                                color: 'white',
                                '& fieldset': { borderColor: '#444' },
                                '&:hover fieldset': { borderColor: '#FF6B35' },
                                '&.Mui-focused fieldset': { borderColor: '#FF6B35' },
                            },
                            '& .MuiInputLabel-root': { color: '#b0b0b0' },
                            '& .MuiInputLabel-root.Mui-focused': { color: '#FF6B35' },
                        }}
                    />

                    <TextField
                        fullWidth
                        label="Password"
                        type={showPassword ? 'text' : 'password'}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        InputProps={{
                            endAdornment: (
                                <InputAdornment position="end">
                                    <IconButton
                                        onClick={() => setShowPassword(!showPassword)}
                                        edge="end"
                                        sx={{ color: '#b0b0b0' }}
                                    >
                                        {showPassword ? <VisibilityOff /> : <Visibility />}
                                    </IconButton>
                                </InputAdornment>
                            ),
                        }}
                        sx={{
                            mb: 4,
                            '& .MuiOutlinedInput-root': {
                                color: 'white',
                                '& fieldset': { borderColor: '#444' },
                                '&:hover fieldset': { borderColor: '#FF6B35' },
                                '&.Mui-focused fieldset': { borderColor: '#FF6B35' },
                            },
                            '& .MuiInputLabel-root': { color: '#b0b0b0' },
                            '& .MuiInputLabel-root.Mui-focused': { color: '#FF6B35' },
                        }}
                    />

                    <Button
                        type="submit"
                        fullWidth
                        variant="contained"
                        size="large"
                        disabled={loading}
                        sx={{
                            bgcolor: '#FF6B35',
                            py: 1.5,
                            fontSize: '1.1rem',
                            fontWeight: 600,
                            '&:hover': { bgcolor: '#e55a25' },
                        }}
                    >
                        {loading ? 'Authenticating...' : 'Access Admin Panel'}
                    </Button>
                </form>

                <Box sx={{ mt: 3, textAlign: 'center' }}>
                    <Typography variant="caption" sx={{ color: '#666' }}>
                        🔒 Secured with end-to-end encryption
                    </Typography>
                </Box>
            </Paper>
        </Container>
    );
};

export default AdminLogin;
