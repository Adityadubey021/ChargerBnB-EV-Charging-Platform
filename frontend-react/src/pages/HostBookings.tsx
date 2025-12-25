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
    Tabs,
    Tab,
} from '@mui/material';
import { format } from 'date-fns';
import axios from 'axios';
import { toast } from 'react-hot-toast';

interface Booking {
    id: number;
    chargerId: number;
    startTime: string;
    endTime: string;
    totalCost: number;
    status: string;
    userNotes?: string;
    user: {
        firstName: string;
        lastName: string;
        email: string;
        phoneNumber: string;
    };
    charger: {
        title: string;
        city: string;
    };
}

const HostBookings: React.FC = () => {
    const [bookings, setBookings] = useState<Booking[]>([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState<string>('all');
    const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

    const fetchBookings = useCallback(async () => {
        try {
            setLoading(true);
            const token = localStorage.getItem('accessToken');
            const params = filter !== 'all' ? `?status=${filter.toUpperCase()}` : '';
            const response = await axios.get(`${API_URL}/host/bookings${params}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setBookings(response.data.bookings || []);
        } catch (error) {
            toast.error('Failed to load bookings');
        } finally {
            setLoading(false);
        }
    }, [filter, API_URL]);

    useEffect(() => {
        fetchBookings();
    }, [fetchBookings]);

    const handleAcceptBooking = async (id: number) => {
        try {
            const token = localStorage.getItem('accessToken');
            await axios.patch(
                `${API_URL}/host/bookings/${id}/accept`,
                {},
                { headers: { Authorization: `Bearer ${token}` } }
            );
            toast.success('Booking accepted');
            fetchBookings();
        } catch (error: any) {
            toast.error(error.response?.data?.error || 'Failed to accept booking');
        }
    };

    const handleRejectBooking = async (id: number) => {
        if (!window.confirm('Are you sure you want to reject this booking?')) {
            return;
        }

        try {
            const token = localStorage.getItem('accessToken');
            await axios.patch(
                `${API_URL}/host/bookings/${id}/reject`,
                {},
                { headers: { Authorization: `Bearer ${token}` } }
            );
            toast.success('Booking rejected');
            fetchBookings();
        } catch (error: any) {
            toast.error(error.response?.data?.error || 'Failed to reject booking');
        }
    };

    const handleCompleteBooking = async (id: number) => {
        try {
            const token = localStorage.getItem('accessToken');
            await axios.patch(
                `${API_URL}/host/bookings/${id}/complete`,
                {},
                { headers: { Authorization: `Bearer ${token}` } }
            );
            toast.success('Booking marked as completed');
            fetchBookings();
        } catch (error: any) {
            toast.error(error.response?.data?.error || 'Failed to complete booking');
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

    if (loading && bookings.length === 0) {
        return (
            <Container sx={{ py: 8, textAlign: 'center' }}>
                <CircularProgress />
            </Container>
        );
    }

    return (
        <Container sx={{ py: 4 }} maxWidth="lg">
            <Typography variant="h4" gutterBottom sx={{ fontWeight: 700, mb: 4 }}>
                Booking Management
            </Typography>

            <Tabs value={filter} onChange={(e, newValue) => setFilter(newValue)} sx={{ mb: 3 }}>
                <Tab label="All" value="all" />
                <Tab label="Pending" value="pending" />
                <Tab label="Confirmed" value="confirmed" />
                <Tab label="Completed" value="completed" />
            </Tabs>

            {loading ? (
                <Box sx={{ textAlign: 'center', py: 4 }}>
                    <CircularProgress />
                </Box>
            ) : bookings.length === 0 ? (
                <Box sx={{ textAlign: 'center', py: 8 }}>
                    <Typography variant="h6" color="text.secondary">
                        No bookings found
                    </Typography>
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
                                                Customer: {booking.user.firstName} {booking.user.lastName}
                                            </Typography>
                                            <Typography variant="caption" color="text.secondary">
                                                {booking.user.email} • {booking.user.phoneNumber}
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
                                                Total Amount
                                            </Typography>
                                            <Typography variant="h6" color="primary.main" sx={{ fontWeight: 700 }}>
                                                ₹{booking.totalCost}
                                            </Typography>
                                        </Grid>
                                    </Grid>

                                    {booking.userNotes && (
                                        <Box sx={{ mt: 2, p: 2, bgcolor: 'grey.100', borderRadius: 2 }}>
                                            <Typography variant="caption" color="text.secondary">
                                                Customer Notes:
                                            </Typography>
                                            <Typography variant="body2">{booking.userNotes}</Typography>
                                        </Box>
                                    )}

                                    <Box sx={{ mt: 2, display: 'flex', gap: 1 }}>
                                        {booking.status === 'PENDING' && (
                                            <>
                                                <Button
                                                    variant="contained"
                                                    color="success"
                                                    size="small"
                                                    onClick={() => handleAcceptBooking(booking.id)}
                                                >
                                                    Accept
                                                </Button>
                                                <Button
                                                    variant="outlined"
                                                    color="error"
                                                    size="small"
                                                    onClick={() => handleRejectBooking(booking.id)}
                                                >
                                                    Reject
                                                </Button>
                                            </>
                                        )}
                                        {booking.status === 'CONFIRMED' && (
                                            <Button
                                                variant="contained"
                                                size="small"
                                                onClick={() => handleCompleteBooking(booking.id)}
                                            >
                                                Mark as Completed
                                            </Button>
                                        )}
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

export default HostBookings;
