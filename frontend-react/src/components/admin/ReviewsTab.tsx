import React, { useState, useEffect } from 'react';
import {
    Box,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    Chip,
    IconButton,
    MenuItem,
    TextField,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    Typography,
    CircularProgress,
    Alert,
    Rating,
} from '@mui/material';
import { Delete, Visibility, CheckCircle } from '@mui/icons-material';
import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

interface Review {
    id: number;
    rating: number;
    comment: string;
    isApproved: boolean;
    isVerified: boolean;
    createdAt: string;
    user: {
        id: number;
        firstName: string;
        email: string;
    };
    charger: {
        id: number;
        title: string;
        city: string;
    };
    booking?: {
        id: number;
        startDate: string;
        endDate: string;
    };
}

const ReviewsTab: React.FC = () => {
    const [reviews, setReviews] = useState<Review[]>([]);
    const [loading, setLoading] = useState(true);
    const [approvalFilter, setApprovalFilter] = useState('all');
    const [minRating, setMinRating] = useState(0);
    const [verifiedOnly, setVerifiedOnly] = useState(false);
    const [selectedReview, setSelectedReview] = useState<Review | null>(null);
    const [dialogOpen, setDialogOpen] = useState(false);
    const [actionLoading, setActionLoading] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
        fetchReviews();
    }, []);

    const fetchReviews = async () => {
        try {
            setLoading(true);
            const token = localStorage.getItem('accessToken');
            const response = await axios.get(`${API_URL}/admin/reviews`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            setReviews(response.data.reviews || []);
        } catch (err: any) {
            console.error('Error fetching reviews:', err);
            setError('Failed to load reviews');
        } finally {
            setLoading(false);
        }
    };

    const handleApprove = async (reviewId: number) => {
        try {
            setActionLoading(true);
            const token = localStorage.getItem('accessToken');
            await axios.patch(
                `${API_URL}/admin/reviews/${reviewId}/approve`,
                {},
                { headers: { Authorization: `Bearer ${token}` } }
            );
            fetchReviews();
        } catch (err: any) {
            console.error('Error approving review:', err);
            setError('Failed to approve review');
        } finally {
            setActionLoading(false);
        }
    };

    const handleDelete = async (reviewId: number) => {
        if (!window.confirm('Are you sure you want to delete this review?')) return;

        try {
            setActionLoading(true);
            const token = localStorage.getItem('accessToken');
            await axios.delete(`${API_URL}/admin/reviews/${reviewId}`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            fetchReviews();
        } catch (err: any) {
            console.error('Error deleting review:', err);
            setError('Failed to delete review');
        } finally {
            setActionLoading(false);
        }
    };

    const handleView = (review: Review) => {
        setSelectedReview(review);
        setDialogOpen(true);
    };

    const filteredReviews = reviews.filter(review => {
        if (approvalFilter === 'approved' && !review.isApproved) return false;
        if (approvalFilter === 'pending' && review.isApproved) return false;
        if (verifiedOnly && !review.isVerified) return false;
        if (review.rating < minRating) return false;
        return true;
    });

    if (loading) {
        return (
            <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
                <CircularProgress />
            </Box>
        );
    }

    return (
        <Box>
            {error && <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError('')}>{error}</Alert>}

            <Box sx={{ mb: 3, display: 'flex', gap: 2, alignItems: 'center', flexWrap: 'wrap' }}>
                <TextField
                    select
                    label="Approval Status"
                    value={approvalFilter}
                    onChange={(e) => setApprovalFilter(e.target.value)}
                    sx={{ minWidth: 180 }}
                >
                    <MenuItem value="all">All Reviews</MenuItem>
                    <MenuItem value="approved">Approved Only</MenuItem>
                    <MenuItem value="pending">Pending Approval</MenuItem>
                </TextField>

                <TextField
                    type="number"
                    label="Min Rating"
                    value={minRating}
                    onChange={(e) => setMinRating(Number(e.target.value))}
                    inputProps={{ min: 0, max: 5, step: 1 }}
                    sx={{ maxWidth: 120 }}
                />

                <TextField
                    select
                    label="Verified"
                    value={verifiedOnly ? 'yes' : 'all'}
                    onChange={(e) => setVerifiedOnly(e.target.value === 'yes')}
                    sx={{ minWidth: 150 }}
                >
                    <MenuItem value="all">All Reviews</MenuItem>
                    <MenuItem value="yes">Verified Only</MenuItem>
                </TextField>

                <Typography variant="body2" color="text.secondary">
                    Showing {filteredReviews.length} review(s)
                </Typography>
            </Box>

            <TableContainer component={Paper}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>User</TableCell>
                            <TableCell>Charger</TableCell>
                            <TableCell>Rating</TableCell>
                            <TableCell>Comment</TableCell>
                            <TableCell>Verified</TableCell>
                            <TableCell>Approved</TableCell>
                            <TableCell>Actions</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {filteredReviews.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={7} align="center">
                                    <Typography variant="body2" color="text.secondary" sx={{ py: 3 }}>
                                        No reviews found
                                    </Typography>
                                </TableCell>
                            </TableRow>
                        ) : (
                            filteredReviews.map((review) => (
                                <TableRow key={review.id} hover>
                                    <TableCell>
                                        <Typography variant="body2">{review.user.firstName}</Typography>
                                        <Typography variant="caption" color="text.secondary">
                                            {review.user.email}
                                        </Typography>
                                    </TableCell>
                                    <TableCell>
                                        <Typography variant="body2">{review.charger.title}</Typography>
                                        <Typography variant="caption" color="text.secondary">
                                            {review.charger.city}
                                        </Typography>
                                    </TableCell>
                                    <TableCell>
                                        <Rating value={review.rating} readOnly size="small" />
                                    </TableCell>
                                    <TableCell>
                                        <Typography variant="body2" noWrap sx={{ maxWidth: 200 }}>
                                            {review.comment.substring(0, 60)}
                                            {review.comment.length > 60 && '...'}
                                        </Typography>
                                    </TableCell>
                                    <TableCell>
                                        {review.isVerified ? (
                                            <CheckCircle color="success" fontSize="small" />
                                        ) : (
                                            <Typography variant="caption" color="text.secondary">No</Typography>
                                        )}
                                    </TableCell>
                                    <TableCell>
                                        {review.isApproved ? (
                                            <Chip label="Approved" color="success" size="small" />
                                        ) : (
                                            <Chip label="Pending" color="warning" size="small" />
                                        )}
                                    </TableCell>
                                    <TableCell>
                                        <Box sx={{ display: 'flex', gap: 0.5 }}>
                                            <IconButton
                                                size="small"
                                                onClick={() => handleView(review)}
                                                color="primary"
                                            >
                                                <Visibility fontSize="small" />
                                            </IconButton>
                                            {!review.isApproved && (
                                                <IconButton
                                                    size="small"
                                                    onClick={() => handleApprove(review.id)}
                                                    color="success"
                                                    disabled={actionLoading}
                                                >
                                                    <CheckCircle fontSize="small" />
                                                </IconButton>
                                            )}
                                            <IconButton
                                                size="small"
                                                onClick={() => handleDelete(review.id)}
                                                color="error"
                                                disabled={actionLoading}
                                            >
                                                <Delete fontSize="small" />
                                            </IconButton>
                                        </Box>
                                    </TableCell>
                                </TableRow>
                            ))
                        )}
                    </TableBody>
                </Table>
            </TableContainer>

            {/* Review Detail Dialog */}
            <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)} maxWidth="sm" fullWidth>
                <DialogTitle>Review Details</DialogTitle>
                <DialogContent>
                    {selectedReview && (
                        <Box>
                            <Box sx={{ mb: 2 }}>
                                <Typography variant="subtitle2">Rating:</Typography>
                                <Rating value={selectedReview.rating} readOnly />
                            </Box>

                            <Box sx={{ mb: 2 }}>
                                <Typography variant="subtitle2">Comment:</Typography>
                                <Typography variant="body2">{selectedReview.comment}</Typography>
                            </Box>

                            <Box sx={{ mb: 2 }}>
                                <Typography variant="subtitle2">Reviewed By:</Typography>
                                <Typography variant="body2">
                                    {selectedReview.user.firstName} - {selectedReview.user.email}
                                </Typography>
                            </Box>

                            <Box sx={{ mb: 2 }}>
                                <Typography variant="subtitle2">Charger:</Typography>
                                <Typography variant="body2">
                                    {selectedReview.charger.title} ({selectedReview.charger.city})
                                </Typography>
                            </Box>

                            {selectedReview.booking && (
                                <Box sx={{ mb: 2 }}>
                                    <Typography variant="subtitle2">Booking Details:</Typography>
                                    <Typography variant="body2">
                                        {new Date(selectedReview.booking.startDate).toLocaleDateString()} -
                                        {new Date(selectedReview.booking.endDate).toLocaleDateString()}
                                    </Typography>
                                    <Chip label="Verified Booking" color="success" size="small" sx={{ mt: 1 }} />
                                </Box>
                            )}

                            <Box>
                                <Typography variant="subtitle2">Status:</Typography>
                                {selectedReview.isApproved ? (
                                    <Chip label="Approved" color="success" size="small" />
                                ) : (
                                    <Chip label="Pending Approval" color="warning" size="small" />
                                )}
                            </Box>
                        </Box>
                    )}
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setDialogOpen(false)}>Close</Button>
                    {selectedReview && !selectedReview.isApproved && (
                        <Button
                            onClick={() => {
                                handleApprove(selectedReview.id);
                                setDialogOpen(false);
                            }}
                            variant="contained"
                            color="success"
                        >
                            Approve Review
                        </Button>
                    )}
                </DialogActions>
            </Dialog>
        </Box>
    );
};

export default ReviewsTab;
