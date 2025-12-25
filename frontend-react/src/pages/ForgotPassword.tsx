import React, { useState } from 'react';
import {
    Container,
    Paper,
    TextField,
    Button,
    Typography,
    Box,
    Alert,
} from '@mui/material';
import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

const ForgotPassword: React.FC = () => {
    const [step, setStep] = useState<'email' | 'otp'>('email');
    const [email, setEmail] = useState('');
    const [otp, setOtp] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSendOTP = async () => {
        setLoading(true);
        setError('');
        try {
            await axios.post(`${API_URL}/auth/forgot-password`, { email });
            setMessage('OTP sent to your email. Please check your inbox.');
            setStep('otp');
        } catch (err: any) {
            setError(err.response?.data?.error || 'Failed to send OTP');
        } finally {
            setLoading(false);
        }
    };

    const handleResetPassword = async () => {
        setLoading(true);
        setError('');
        try {
            await axios.post(`${API_URL}/auth/reset-password`, {
                email,
                otp,
                newPassword,
            });
            setMessage('Password reset successful! You can now login with your new password.');
            setTimeout(() => window.location.href = '/login', 2000);
        } catch (err: any) {
            setError(err.response?.data?.error || 'Failed to reset password');
        } finally {
            setLoading(false);
        }
    };

    return (
        <Container maxWidth="sm" sx={{ mt: 8, mb: 4 }}>
            <Paper elevation={3} sx={{ p: 4 }}>
                <Typography variant="h4" gutterBottom align="center" sx={{ color: '#2C5F2D', fontWeight: 700 }}>
                    Reset Password
                </Typography>

                {message && <Alert severity="success" sx={{ mb: 2 }}>{message}</Alert>}
                {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

                {step === 'email' ? (
                    <Box>
                        <TextField
                            fullWidth
                            label="Email Address"
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            margin="normal"
                            required
                        />
                        <Button
                            fullWidth
                            variant="contained"
                            onClick={handleSendOTP}
                            disabled={loading || !email}
                            sx={{
                                mt: 3,
                                bgcolor: '#2C5F2D',
                                '&:hover': { bgcolor: '#1E3F1E' },
                            }}
                        >
                            {loading ? 'Sending...' : 'Send OTP'}
                        </Button>
                    </Box>
                ) : (
                    <Box>
                        <TextField
                            fullWidth
                            label="OTP Code (6 digits)"
                            value={otp}
                            onChange={(e) => setOtp(e.target.value)}
                            margin="normal"
                            required
                            inputProps={{ maxLength: 6 }}
                        />
                        <TextField
                            fullWidth
                            label="New Password"
                            type="password"
                            value={newPassword}
                            onChange={(e) => setNewPassword(e.target.value)}
                            margin="normal"
                            required
                            helperText="Min 10 characters with uppercase, lowercase, number & special character"
                        />
                        <Button
                            fullWidth
                            variant="contained"
                            onClick={handleResetPassword}
                            disabled={loading || !otp || !newPassword}
                            sx={{
                                mt: 3,
                                bgcolor: '#2C5F2D',
                                '&:hover': { bgcolor: '#1E3F1E' },
                            }}
                        >
                            {loading ? 'Resetting...' : 'Reset Password'}
                        </Button>
                        <Button
                            fullWidth
                            variant="text"
                            onClick={() => setStep('email')}
                            sx={{ mt: 2 }}
                        >
                            Resend OTP
                        </Button>
                    </Box>
                )}
            </Paper>
        </Container>
    );
};

export default ForgotPassword;
