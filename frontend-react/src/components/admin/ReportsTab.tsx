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
} from '@mui/material';
import { Visibility, Error, Warning } from '@mui/icons-material';
import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

interface Report {
    id: number;
    type: string;
    description: string;
    status: string;
    createdAt: string;
    reporter: {
        id: number;
        firstName: string;
        email: string;
    };
    charger?: {
        id: number;
        title: string;
    };
    host?: {
        id: number;
        firstName: string;
        lastName: string;
    };
    adminComment?: string;
}

const ReportsTab: React.FC = () => {
    const [reports, setReports] = useState<Report[]>([]);
    const [loading, setLoading] = useState(true);
    const [statusFilter, setStatusFilter] = useState('all');
    const [selectedReport, setSelectedReport] = useState<Report | null>(null);
    const [dialogOpen, setDialogOpen] = useState(false);
    const [newStatus, setNewStatus] = useState('');
    const [adminComment, setAdminComment] = useState('');
    const [actionLoading, setActionLoading] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
        fetchReports();
    }, []);

    const fetchReports = async () => {
        try {
            setLoading(true);
            const token = localStorage.getItem('accessToken');
            const response = await axios.get(`${API_URL}/admin/reports`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            setReports(response.data.reports || []);
        } catch (err: any) {
            console.error('Error fetching reports:', err);
            setError('Failed to load reports');
        } finally {
            setLoading(false);
        }
    };

    const handleViewReport = (report: Report) => {
        setSelectedReport(report);
        setNewStatus(report.status);
        setAdminComment(report.adminComment || '');
        setDialogOpen(true);
    };

    const handleUpdateStatus = async () => {
        if (!selectedReport) return;

        try {
            setActionLoading(true);
            const token = localStorage.getItem('accessToken');
            await axios.patch(
                `${API_URL}/admin/reports/${selectedReport.id}/status`,
                { status: newStatus, adminComment },
                { headers: { Authorization: `Bearer ${token}` } }
            );

            setDialogOpen(false);
            fetchReports();
        } catch (err: any) {
            console.error('Error updating report:', err);
            setError('Failed to update report status');
        } finally {
            setActionLoading(false);
        }
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'OPEN': return 'error';
            case 'INVESTIGATING': return 'warning';
            case 'RESOLVED': return 'success';
            case 'DISMISSED': return 'default';
            default: return 'default';
        }
    };

    const getTypeIcon = (type: string) => {
        switch (type) {
            case 'FRAUD': return <Error color="error" />;
            case 'SPAM': return <Warning color="warning" />;
            default: return <Visibility />;
        }
    };

    const filteredReports = statusFilter === 'all'
        ? reports
        : reports.filter(r => r.status === statusFilter);

    if (loading) {
        return (
            <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
                <CircularProgress />
            </Box>
        );
    }

    return (
        <Box>
            {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

            <Box sx={{ mb: 3, display: 'flex', gap: 2, alignItems: 'center' }}>
                <TextField
                    select
                    label="Filter by Status"
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                    sx={{ minWidth: 200 }}
                >
                    <MenuItem value="all">All Reports</MenuItem>
                    <MenuItem value="OPEN">Open (Need Attention)</MenuItem>
                    <MenuItem value="INVESTIGATING">Investigating</MenuItem>
                    <MenuItem value="RESOLVED">Resolved</MenuItem>
                    <MenuItem value="DISMISSED">Dismissed</MenuItem>
                </TextField>

                <Typography variant="body2" color="text.secondary">
                    Showing {filteredReports.length} report(s)
                </Typography>
            </Box>

            <TableContainer component={Paper}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>Type</TableCell>
                            <TableCell>Reporter</TableCell>
                            <TableCell>Target</TableCell>
                            <TableCell>Status</TableCell>
                            <TableCell>Date</TableCell>
                            <TableCell>Actions</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {filteredReports.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={6} align="center">
                                    <Typography variant="body2" color="text.secondary" sx={{ py: 3 }}>
                                        No reports found
                                    </Typography>
                                </TableCell>
                            </TableRow>
                        ) : (
                            filteredReports.map((report) => (
                                <TableRow key={report.id} hover>
                                    <TableCell>
                                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                            {getTypeIcon(report.type)}
                                            <Chip label={report.type} size="small" />
                                        </Box>
                                    </TableCell>
                                    <TableCell>
                                        <Typography variant="body2">{report.reporter.firstName}</Typography>
                                        <Typography variant="caption" color="text.secondary">
                                            {report.reporter.email}
                                        </Typography>
                                    </TableCell>
                                    <TableCell>
                                        {report.charger?.title || `${report.host?.firstName} ${report.host?.lastName}`}
                                    </TableCell>
                                    <TableCell>
                                        <Chip
                                            label={report.status}
                                            color={getStatusColor(report.status)}
                                            size="small"
                                        />
                                    </TableCell>
                                    <TableCell>
                                        {new Date(report.createdAt).toLocaleDateString()}
                                    </TableCell>
                                    <TableCell>
                                        <IconButton
                                            size="small"
                                            onClick={() => handleViewReport(report)}
                                            color="primary"
                                        >
                                            <Visibility />
                                        </IconButton>
                                    </TableCell>
                                </TableRow>
                            ))
                        )}
                    </TableBody>
                </Table>
            </TableContainer>

            {/* Report Detail Dialog */}
            <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)} maxWidth="md" fullWidth>
                <DialogTitle>Report Details</DialogTitle>
                <DialogContent>
                    {selectedReport && (
                        <Box>
                            <Typography variant="subtitle2" gutterBottom>Type:</Typography>
                            <Chip label={selectedReport.type} size="small" sx={{ mb: 2 }} />

                            <Typography variant="subtitle2" gutterBottom>Description:</Typography>
                            <Typography variant="body2" sx={{ mb: 2 }}>
                                {selectedReport.description}
                            </Typography>

                            <Typography variant="subtitle2" gutterBottom>Reported By:</Typography>
                            <Typography variant="body2" sx={{ mb: 2 }}>
                                {selectedReport.reporter.firstName} ({selectedReport.reporter.email})
                            </Typography>

                            {selectedReport.charger && (
                                <>
                                    <Typography variant="subtitle2" gutterBottom>Reported Charger:</Typography>
                                    <Typography variant="body2" sx={{ mb: 2 }}>
                                        {selectedReport.charger.title}
                                    </Typography>
                                </>
                            )}

                            <TextField
                                select
                                fullWidth
                                label="Update Status"
                                value={newStatus}
                                onChange={(e) => setNewStatus(e.target.value)}
                                sx={{ mb: 2 }}
                            >
                                <MenuItem value="OPEN">Open</MenuItem>
                                <MenuItem value="INVESTIGATING">Investigating</MenuItem>
                                <MenuItem value="RESOLVED">Resolved</MenuItem>
                                <MenuItem value="DISMISSED">Dismissed</MenuItem>
                            </TextField>

                            <TextField
                                fullWidth
                                multiline
                                rows={3}
                                label="Admin Comment"
                                value={adminComment}
                                onChange={(e) => setAdminComment(e.target.value)}
                                placeholder="Add notes about this report..."
                            />
                        </Box>
                    )}
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setDialogOpen(false)}>Cancel</Button>
                    <Button
                        onClick={handleUpdateStatus}
                        variant="contained"
                        disabled={actionLoading}
                    >
                        {actionLoading ? <CircularProgress size={20} /> : 'Update'}
                    </Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
};

export default ReportsTab;
