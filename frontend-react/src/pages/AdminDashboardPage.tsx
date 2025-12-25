import React, { useState, useEffect, useCallback } from 'react';
import {
    Container,
    Typography,
    Box,
    Grid,
    Card,
    CardContent,
    Button,
    Tab,
    Tabs,
    TextField,
    MenuItem,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    Chip,
    IconButton,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    CircularProgress,
    Alert,
} from '@mui/material';
import {
    Dashboard as DashboardIcon,
    EvStation,
    Person,
    Report,
    Visibility,
    CheckCircle,
    Cancel,
    Block,
} from '@mui/icons-material';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import ReportsTab from '../components/admin/ReportsTab';
import ReviewsTab from '../components/admin/ReviewsTab';
import AnalyticsTab from '../components/admin/AnalyticsTab';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

interface Stats {
    pendingChargers: number;
    approvedChargers: number;
    activeHosts: number;
    openReports: number;
    avgRating: number;
}

interface Charger {
    id: number;
    title: string;
    city: string;
    state: string;
    powerRating: number;
    pricePerHour: number;
    isApproved: boolean;
    isAvailable: boolean;
    createdAt: string;
    host: {
        id: number;
        firstName: string;
        lastName: string;
        email: string;
    };
}

const AdminDashboard: React.FC = () => {
    const [stats, setStats] = useState<Stats | null>(null);
    const [chargers, setChargers] = useState<Charger[]>([]);
    const [loading, setLoading] = useState(true);
    const [tabValue, setTabValue] = useState(0);
    const [statusFilter, setStatusFilter] = useState('pending');
    const [selectedCharger, setSelectedCharger] = useState<Charger | null>(null);
    const [detailDialogOpen, setDetailDialogOpen] = useState(false);
    const [actionLoading, setActionLoading] = useState(false);
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const fetchStats = useCallback(async () => {
        try {
            const token = localStorage.getItem('accessToken');
            const response = await axios.get(`${API_URL}/admin/stats/summary`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            setStats(response.data);
        } catch (err: any) {
            console.error('Error fetching stats:', err);
            if (err.response?.status === 401 || err.response?.status === 403) {
                navigate('/admin/login');
            }
        }
    }, [navigate]);

    const fetchChargers = useCallback(async () => {
        try {
            setLoading(true);
            const token = localStorage.getItem('accessToken');
            const response = await axios.get(`${API_URL}/admin/chargers`, {
                headers: { Authorization: `Bearer ${token}` },
                params: { status: statusFilter, limit: 50 },
            });
            setChargers(response.data.chargers);
        } catch (err: any) {
            console.error('Error fetching chargers:', err);
            if (err.response?.status === 401 || err.response?.status === 403) {
                navigate('/admin/login');
            }
        } finally {
            setLoading(false);
        }
    }, [statusFilter, navigate]);

    useEffect(() => {
        fetchStats();
        fetchChargers();
    }, [fetchStats, fetchChargers]);

    const handleApprove = async (chargerId: number) => {
        try {
            setActionLoading(true);
            setError('');
            const token = localStorage.getItem('accessToken');
            await axios.post(
                `${API_URL}/admin/chargers/${chargerId}/approve`,
                { adminComment: 'Approved by admin' },
                { headers: { Authorization: `Bearer ${token}` } }
            );
            fetchChargers();
            fetchStats();
            setDetailDialogOpen(false);
        } catch (err: any) {
            setError(err.response?.data?.error || 'Failed to approve charger');
        } finally {
            setActionLoading(false);
        }
    };

    const handleReject = async (chargerId: number) => {
        try {
            setActionLoading(true);
            setError('');
            const token = localStorage.getItem('accessToken');
            await axios.post(
                `${API_URL}/admin/chargers/${chargerId}/reject`,
                { adminComment: 'Rejected by admin' },
                { headers: { Authorization: `Bearer ${token}` } }
            );
            fetchChargers();
            fetchStats();
            setDetailDialogOpen(false);
        } catch (err: any) {
            setError(err.response?.data?.error || 'Failed to reject charger');
        } finally {
            setActionLoading(false);
        }
    };

    const handleSuspend = async (chargerId: number) => {
        try {
            setActionLoading(true);
            setError('');
            const token = localStorage.getItem('accessToken');
            await axios.patch(
                `${API_URL}/admin/chargers/${chargerId}/suspend`,
                { reason: 'Suspended by admin' },
                { headers: { Authorization: `Bearer ${token}` } }
            );
            fetchChargers();
            fetchStats();
            setDetailDialogOpen(false);
        } catch (err: any) {
            setError(err.response?.data?.error || 'Failed to suspend charger');
        } finally {
            setActionLoading(false);
        }
    };

    return (
        <Container maxWidth="xl" sx={{ py: 4 }}>
            {/* Header */}
            <Box sx={{ mb: 4 }}>
                <Typography variant="h3" gutterBottom sx={{ fontWeight: 700, color: '#2C5F2D' }}>
                    <DashboardIcon sx={{ fontSize: 40, mr: 2, verticalAlign: 'middle' }} />
                    Admin Dashboard
                </Typography>
                <Typography variant="body1" color="text.secondary">
                    Manage chargers, hosts, and monitor platform activity
                </Typography>
            </Box>

            {/* Stats Cards */}
            <Grid container spacing={3} sx={{ mb: 4 }}>
                <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                    <Card sx={{ bgcolor: '#FFF3E0', borderLeft: '4px solid #FF6B35' }}>
                        <CardContent>
                            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                                <Box>
                                    <Typography variant="body2" color="text.secondary">
                                        Pending Requests
                                    </Typography>
                                    <Typography variant="h4" sx={{ fontWeight: 700, color: '#FF6B35' }}>
                                        {stats?.pendingChargers || 0}
                                    </Typography>
                                </Box>
                                <EvStation sx={{ fontSize: 50, color: '#FF6B35', opacity: 0.3 }} />
                            </Box>
                        </CardContent>
                    </Card>
                </Grid>

                <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                    <Card sx={{ bgcolor: '#E8F5E9', borderLeft: '4px solid #2C5F2D' }}>
                        <CardContent>
                            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                                <Box>
                                    <Typography variant="body2" color="text.secondary">
                                        Approved Chargers
                                    </Typography>
                                    <Typography variant="h4" sx={{ fontWeight: 700, color: '#2C5F2D' }}>
                                        {stats?.approvedChargers || 0}
                                    </Typography>
                                </Box>
                                <CheckCircle sx={{ fontSize: 50, color: '#2C5F2D', opacity: 0.3 }} />
                            </Box>
                        </CardContent>
                    </Card>
                </Grid>

                <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                    <Card sx={{ bgcolor: '#E3F2FD', borderLeft: '4px solid #2196F3' }}>
                        <CardContent>
                            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                                <Box>
                                    <Typography variant="body2" color="text.secondary">
                                        Active Hosts
                                    </Typography>
                                    <Typography variant="h4" sx={{ fontWeight: 700, color: '#2196F3' }}>
                                        {stats?.activeHosts || 0}
                                    </Typography>
                                </Box>
                                <Person sx={{ fontSize: 50, color: '#2196F3', opacity: 0.3 }} />
                            </Box>
                        </CardContent>
                    </Card>
                </Grid>

                <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                    <Card sx={{ bgcolor: '#FCE4EC', borderLeft: '4px solid #E91E63' }}>
                        <CardContent>
                            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                                <Box>
                                    <Typography variant="body2" color="text.secondary">
                                        Open Reports
                                    </Typography>
                                    <Typography variant="h4" sx={{ fontWeight: 700, color: '#E91E63' }}>
                                        {stats?.openReports || 0}
                                    </Typography>
                                </Box>
                                <Report sx={{ fontSize: 50, color: '#E91E63', opacity: 0.3 }} />
                            </Box>
                        </CardContent>
                    </Card>
                </Grid>
            </Grid>

            {/* Filter Tabs */}
            <Paper sx={{ mb: 3 }}>
                <Tabs
                    value={tabValue}
                    onChange={(e, v) => setTabValue(v)}
                    sx={{ borderBottom: 1, borderColor: 'divider' }}
                >
                    <Tab label="Chargers" />
                    <Tab label="Reports" />
                    <Tab label="Reviews" />
                    <Tab label="Analytics" />
                </Tabs>
            </Paper>

            {/* Tab Content */}
            {tabValue === 0 && (
                <Box>
                    <Box sx={{ mb: 3, display: 'flex', gap: 2 }}>
                        <TextField
                            select
                            label="Status"
                            value={statusFilter}
                            onChange={(e) => setStatusFilter(e.target.value)}
                            sx={{ minWidth: 200 }}
                        >
                            <MenuItem value="pending">Pending</MenuItem>
                            <MenuItem value="approved">Approved</MenuItem>
                            <MenuItem value="suspended">Suspended</MenuItem>
                        </TextField>
                    </Box>

                    {loading ? (
                        <Box sx={{ textAlign: 'center', py: 8 }}>
                            <CircularProgress />
                        </Box>
                    ) : chargers.length === 0 ? (
                        <Paper sx={{ p: 4, textAlign: 'center' }}>
                            <Typography variant="h6" color="text.secondary">
                                No chargers found
                            </Typography>
                        </Paper>
                    ) : (
                        <TableContainer component={Paper}>
                            <Table>
                                <TableHead>
                                    <TableRow sx={{ bgcolor: '#f5f5f5' }}>
                                        <TableCell><strong>ID</strong></TableCell>
                                        <TableCell><strong>Title</strong></TableCell>
                                        <TableCell><strong>Host</strong></TableCell>
                                        <TableCell><strong>Location</strong></TableCell>
                                        <TableCell><strong>Power</strong></TableCell>
                                        <TableCell><strong>Price/hr</strong></TableCell>
                                        <TableCell><strong>Status</strong></TableCell>
                                        <TableCell><strong>Actions</strong></TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {chargers.map((charger) => (
                                        <TableRow key={charger.id} hover>
                                            <TableCell>{charger.id}</TableCell>
                                            <TableCell>{charger.title}</TableCell>
                                            <TableCell>
                                                {charger.host.firstName} {charger.host.lastName}
                                                <br />
                                                <Typography variant="caption" color="text.secondary">
                                                    {charger.host.email}
                                                </Typography>
                                            </TableCell>
                                            <TableCell>
                                                {charger.city}, {charger.state}
                                            </TableCell>
                                            <TableCell>{charger.powerRating} kW</TableCell>
                                            <TableCell>₹{charger.pricePerHour}</TableCell>
                                            <TableCell>
                                                {charger.isApproved ? (
                                                    <Chip label="Approved" color="success" size="small" />
                                                ) : charger.isAvailable ? (
                                                    <Chip label="Pending" color="warning" size="small" />
                                                ) : (
                                                    <Chip label="Suspended" color="error" size="small" />
                                                )}
                                            </TableCell>
                                            <TableCell>
                                                <IconButton
                                                    size="small"
                                                    onClick={() => {
                                                        setSelectedCharger(charger);
                                                        setDetailDialogOpen(true);
                                                    }}
                                                >
                                                    <Visibility />
                                                </IconButton>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </TableContainer>
                    )}
                </Box>
            )}

            {/* Other tabs placeholder */}
            {/* Reports Tab */}
            {tabValue === 1 && <ReportsTab />}

            {/* Reviews Tab */}
            {tabValue === 2 && <ReviewsTab />}

            {/* Analytics Tab */}
            {tabValue === 3 && <AnalyticsTab />}

            {/* Charger Detail Dialog */}
            <Dialog open={detailDialogOpen} onClose={() => setDetailDialogOpen(false)} maxWidth="md" fullWidth>
                <DialogTitle>
                    Charger Details
                    {selectedCharger && (
                        <Chip
                            label={selectedCharger.isApproved ? 'Approved' : 'Pending'}
                            color={selectedCharger.isApproved ? 'success' : 'warning'}
                            size="small"
                            sx={{ ml: 2 }}
                        />
                    )}
                </DialogTitle>
                <DialogContent>
                    {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
                    {selectedCharger && (
                        <Box>
                            <Typography variant="h6" gutterBottom>
                                {selectedCharger.title}
                            </Typography>
                            <Grid container spacing={2}>
                                <Grid size={{ xs: 12, sm: 6 }}>
                                    <Typography variant="body2" color="text.secondary">
                                        Host
                                    </Typography>
                                    <Typography>
                                        {selectedCharger.host.firstName} {selectedCharger.host.lastName}
                                    </Typography>
                                    <Typography variant="caption" color="text.secondary">
                                        {selectedCharger.host.email}
                                    </Typography>
                                </Grid>
                                <Grid size={{ xs: 12, sm: 6 }}>
                                    <Typography variant="body2" color="text.secondary">
                                        Location
                                    </Typography>
                                    <Typography>
                                        {selectedCharger.city}, {selectedCharger.state}
                                    </Typography>
                                </Grid>
                                <Grid size={{ xs: 12, sm: 6 }}>
                                    <Typography variant="body2" color="text.secondary">
                                        Power Rating
                                    </Typography>
                                    <Typography>{selectedCharger.powerRating} kW</Typography>
                                </Grid>
                                <Grid size={{ xs: 12, sm: 6 }}>
                                    <Typography variant="body2" color="text.secondary">
                                        Price per Hour
                                    </Typography>
                                    <Typography>₹{selectedCharger.pricePerHour}</Typography>
                                </Grid>
                            </Grid>
                        </Box>
                    )}
                </DialogContent>
                <DialogActions sx={{ p: 3 }}>
                    {selectedCharger && !selectedCharger.isApproved && (
                        <>
                            <Button
                                onClick={() => handleApprove(selectedCharger.id)}
                                variant="contained"
                                color="success"
                                disabled={actionLoading}
                                startIcon={<CheckCircle />}
                            >
                                Approve
                            </Button>
                            <Button
                                onClick={() => handleReject(selectedCharger.id)}
                                variant="contained"
                                color="error"
                                disabled={actionLoading}
                                startIcon={<Cancel />}
                            >
                                Reject
                            </Button>
                        </>
                    )}
                    {selectedCharger && selectedCharger.isApproved && (
                        <Button
                            onClick={() => handleSuspend(selectedCharger.id)}
                            variant="contained"
                            color="warning"
                            disabled={actionLoading}
                            startIcon={<Block />}
                        >
                            Suspend
                        </Button>
                    )}
                    <Button onClick={() => setDetailDialogOpen(false)} disabled={actionLoading}>
                        Close
                    </Button>
                </DialogActions>
            </Dialog>
        </Container>
    );
};

export default AdminDashboard;
