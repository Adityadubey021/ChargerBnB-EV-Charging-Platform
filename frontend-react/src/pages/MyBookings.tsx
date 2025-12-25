import React, { useState, useEffect, useCallback } from 'react';
import {
    Container,
    Typography,
    Box,
    Card,
    CardContent,
    Chip,
    Button,
    Grid,
    CircularProgress,
} from '@mui/material';
import { format } from 'date-fns';
import axios from 'axios';
import { toast } from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';

interface Booking {
    id: number;
    chargerId: number;
    startTime: string;
    endTime: string;
    totalCost: number;
    status: string;
    charger: {
        title: string;
        city: string;
        address: string;
    };
}

const MyBookings: React.FC = () => {
    const [bookings, setBookings] = useState<Booking[]>([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();
    const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

    const fetchBookings = useCallback(async () => {
        try {
            const token = localStorage.getItem('accessToken');
            const response = await axios.get(`${API_URL}/bookings`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setBookings(response.data.bookings || []);
        } catch (error) {
            toast.error('Failed to load bookings');
        } finally {
            setLoading(false);
        }
    }, [API_URL]);

    useEffect(() => {
        fetchBookings();
    }, [fetchBookings]);

    const handleCancelBooking = async (id: number) => {
        if (!window.confirm('Are you sure you want to cancel this booking?')) {
            return;
        }

        try {
            const token = localStorage.getItem('accessToken');
            await axios.delete(`${API_URL}/bookings/${id}`, {
                headers: { Authorization: `Bearer ${token}` },
                data: { cancellationReason: 'Cancelled by user' }
            });
            toast.success('Booking cancelled successfully');
            fetchBookings();
        } catch (error: any) {
            toast.error(error.response?.data?.error || 'Failed to cancel booking');
        }
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'CONFIRMED':
                return 'success';
            case 'PENDING':
                return 'warning';
            case 'COMPLETED':
                return 'info';
            case 'CANCELLED':
            case 'REJECTED':
                return 'error';
            default:
                return 'default';
        }
    };

    if (loading) {
        return (
            <Container sx={{ py: 8, textAlign: 'center' }}>
                <CircularProgress />
            </Container>
        );
    }

    return (
        <Container sx={{ py: 4 }} maxWidth="lg">
            <Typography variant="h4" gutterBottom sx={{ fontWeight: 700, mb: 4 }}>
                My Bookings
            </Typography>

            {bookings.length === 0 ? (
                <Box sx={{ textAlign: 'center', py: 8 }}>
                    <Typography variant="h6" color="text.secondary" gutterBottom>
                        No bookings yet
                    </Typography>
                    <Button variant="contained" onClick={() => navigate('/chargers')} sx={{ mt: 2 }}>
                        Browse Chargers
                    </Button>
                </Box>
            ) : (
                <Grid container spacing={3}>
                    {bookings.map((booking) => (
                        <Grid size={{ xs: 12 }} key={booking.id}>
                            <Card sx={{ borderRadius: 3 }}>
                                <CardContent>
                                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', mb: 2 }}>
                                        <Box>
                                            <Typography variant="h6" sx={{ fontWeight: 600 }}>
                                                {booking.charger.title}
                                            </Typography>
                                            <Typography variant="body2" color="text.secondary">
                                                {booking.charger.address}, {booking.charger.city}
                                            </Typography>
                                        </Box>
                                        <Chip
                                            label={booking.status}
                                            color={getStatusColor(booking.status) as any}
                                            sx={{ fontWeight: 600 }}
                                        />
                                    </Box>

                                    <Grid container spacing={2} sx={{ mt: 1 }}>
                                        <Grid size={{ xs: 12, sm: 4 }}>
                                            <Typography variant="caption" color="text.secondary" display="block">
                                                Start Time
                                            </Typography>
                                            <Typography variant="body1">
                                                {format(new Date(booking.startTime), 'PPp')}
                                            </Typography>
                                        </Grid>
                                        <Grid size={{ xs: 12, sm: 4 }}>
                                            <Typography variant="caption" color="text.secondary" display="block">
                                                End Time
                                            </Typography>
                                            <Typography variant="body1">
                                                {format(new Date(booking.endTime), 'PPp')}
                                            </Typography>
                                        </Grid>
                                        <Grid size={{ xs: 12, sm: 4 }}>
                                            <Typography variant="caption" color="text.secondary" display="block">
                                                Total Cost
                                            </Typography>
                                            <Typography variant="h6" color="primary.main" sx={{ fontWeight: 700 }}>
                                                ₹{booking.totalCost}
                                            </Typography>
                                        </Grid>
                                    </Grid>

                                    <Box sx={{ mt: 2, display: 'flex', gap: 1 }}>
                                        {booking.status === 'PENDING' || booking.status === 'CONFIRMED' ? (
                                            <Button
                                                variant="outlined"
                                                color="error"
                                                size="small"
                                                onClick={() => handleCancelBooking(booking.id)}
                                            >
                                                Cancel Booking
                                            </Button>
                                        ) : null}
                                        <Button
                                            variant="outlined"
                                            size="small"
                                            onClick={() => navigate(`/chargers/${booking.chargerId}`)}
                                        >
                                            View Charger
                                        </Button>
                                    </Box>
                                </CardContent>
                            </Card>
                        </Grid>
                    ))}
                </Grid>
            )}
        </Container>
    );
};

export default MyBookings;
