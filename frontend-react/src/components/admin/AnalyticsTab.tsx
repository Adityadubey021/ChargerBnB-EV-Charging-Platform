import React, { useState, useEffect, useCallback } from 'react';
import {
    Box,
    Grid,
    Paper,
    Typography,
    Card,
    CardContent,
    CircularProgress,
    Alert,
    MenuItem,
    TextField,
} from '@mui/material';
import {
    LineChart,
    Line,
    BarChart,
    Bar,
    PieChart,
    Pie,
    Cell,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
    ResponsiveContainer,
} from 'recharts';
import { TrendingUp, CheckCircle, Cancel, AttachMoney } from '@mui/icons-material';
import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

interface TrendData {
    date: string;
    requests: number;
    approved: number;
    rejected: number;
}

interface CityData {
    city: string;
    count: number;
}

interface Stats {
    totalChargers: number;
    approvedChargers: number;
    rejectedChargers: number;
    pendingChargers: number;
    totalHosts: number;
    avgRating: number;
}

const AnalyticsTab: React.FC = () => {
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [dateRange, setDateRange] = useState('30'); // days
    const [trendData, setTrendData] = useState<TrendData[]>([]);
    const [cityData, setCityData] = useState<CityData[]>([]);
    const [stats, setStats] = useState<Stats | null>(null);

    const fetchAnalytics = useCallback(async () => {
        try {
            setLoading(true);
            const token = localStorage.getItem('accessToken');

            // Fetch ONLY real stats from database
            const statsRes = await axios.get(`${API_URL}/admin/stats/summary`, {
                headers: { Authorization: `Bearer ${token}` },
            });

            // Fetch real trend data
            const trendRes = await axios.get(`${API_URL}/admin/stats/requests-trend?days=${dateRange}`, {
                headers: { Authorization: `Bearer ${token}` },
            });

            // Fetch real city distribution data
            const cityRes = await axios.get(`${API_URL}/admin/stats/chargers-by-city`, {
                headers: { Authorization: `Bearer ${token}` },
            });

            setStats(statsRes.data);
            setTrendData(trendRes.data.trend || []);
            setCityData(cityRes.data.cityData || []);
        } catch (err: any) {
            console.error('Error fetching analytics:', err);
            setError('Failed to load analytics data');
        } finally {
            setLoading(false);
        }
    }, [dateRange]);

    useEffect(() => {
        fetchAnalytics();
    }, [fetchAnalytics]);

    if (loading) {
        return (
            <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
                <CircularProgress />
            </Box>
        );
    }

    const approvalData = stats ? [
        { name: 'Approved', value: stats.approvedChargers, color: '#2C5F2D' },
        { name: 'Pending', value: stats.pendingChargers, color: '#FFC107' },
        { name: 'Rejected', value: stats.rejectedChargers, color: '#FF6B35' },
    ] : [];

    const approvalRate = stats && stats.totalChargers > 0
        ? ((stats.approvedChargers / stats.totalChargers) * 100).toFixed(1)
        : '0';

    return (
        <Box>
            {error && <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError('')}>{error}</Alert>}

            {/* Filter */}
            <Box sx={{ mb: 3, display: 'flex', justifyContent: 'flex-end' }}>
                <TextField
                    select
                    label="Time Period"
                    value={dateRange}
                    onChange={(e) => setDateRange(e.target.value)}
                    sx={{ minWidth: 180 }}
                    size="small"
                >
                    <MenuItem value="7">Last 7 Days</MenuItem>
                    <MenuItem value="30">Last 30 Days</MenuItem>
                    <MenuItem value="90">Last 90 Days</MenuItem>
                    <MenuItem value="365">Last Year</MenuItem>
                </TextField>
            </Box>

            {/* KPI Cards */}
            <Grid container spacing={3} sx={{ mb: 4 }}>
                <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                    <Card sx={{ bgcolor: '#E8F5E9', borderLeft: '4px solid #2C5F2D' }}>
                        <CardContent>
                            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                                <Box>
                                    <Typography variant="body2" color="text.secondary">
                                        Total Chargers
                                    </Typography>
                                    <Typography variant="h4" sx={{ fontWeight: 700, color: '#2C5F2D' }}>
                                        {stats?.totalChargers || 0}
                                    </Typography>
                                </Box>
                                <TrendingUp sx={{ fontSize: 50, color: '#2C5F2D', opacity: 0.3 }} />
                            </Box>
                        </CardContent>
                    </Card>
                </Grid>

                <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                    <Card sx={{ bgcolor: '#E1F5FE', borderLeft: '4px solid #2196F3' }}>
                        <CardContent>
                            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                                <Box>
                                    <Typography variant="body2" color="text.secondary">
                                        Approval Rate
                                    </Typography>
                                    <Typography variant="h4" sx={{ fontWeight: 700, color: '#2196F3' }}>
                                        {approvalRate}%
                                    </Typography>
                                </Box>
                                <CheckCircle sx={{ fontSize: 50, color: '#2196F3', opacity: 0.3 }} />
                            </Box>
                        </CardContent>
                    </Card>
                </Grid>

                <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                    <Card sx={{ bgcolor: '#FFF3E0', borderLeft: '4px solid #FF6B35' }}>
                        <CardContent>
                            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                                <Box>
                                    <Typography variant="body2" color="text.secondary">
                                        Active Hosts
                                    </Typography>
                                    <Typography variant="h4" sx={{ fontWeight: 700, color: '#FF6B35' }}>
                                        {stats?.totalHosts || 0}
                                    </Typography>
                                </Box>
                                <AttachMoney sx={{ fontSize: 50, color: '#FF6B35', opacity: 0.3 }} />
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
                                        Rejected
                                    </Typography>
                                    <Typography variant="h4" sx={{ fontWeight: 700, color: '#E91E63' }}>
                                        {stats?.rejectedChargers || 0}
                                    </Typography>
                                </Box>
                                <Cancel sx={{ fontSize: 50, color: '#E91E63', opacity: 0.3 }} />
                            </Box>
                        </CardContent>
                    </Card>
                </Grid>
            </Grid>

            {/* Charts */}
            <Grid container spacing={3}>
                {/* Requests Trend Line Chart */}
                <Grid size={{ xs: 12, lg: 8 }}>
                    <Paper sx={{ p: 3 }}>
                        <Typography variant="h6" gutterBottom sx={{ fontWeight: 600 }}>
                            Charger Requests Trend
                        </Typography>
                        {trendData.length > 0 ? (
                            <ResponsiveContainer width="100%" height={300}>
                                <LineChart data={trendData}>
                                    <CartesianGrid strokeDasharray="3 3" />
                                    <XAxis dataKey="date" />
                                    <YAxis />
                                    <Tooltip />
                                    <Legend />
                                    <Line
                                        type="monotone"
                                        dataKey="requests"
                                        stroke="#2196F3"
                                        strokeWidth={2}
                                        name="Total Requests"
                                    />
                                    <Line
                                        type="monotone"
                                        dataKey="approved"
                                        stroke="#2C5F2D"
                                        strokeWidth={2}
                                        name="Approved"
                                    />
                                    <Line
                                        type="monotone"
                                        dataKey="rejected"
                                        stroke="#FF6B35"
                                        strokeWidth={2}
                                        name="Rejected"
                                    />
                                </LineChart>
                            </ResponsiveContainer>
                        ) : (
                            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: 300 }}>
                                <Typography variant="body1" color="text.secondary">
                                    No historical trend data available yet
                                </Typography>
                            </Box>
                        )}
                    </Paper>
                </Grid>

                {/* Approval Rate Pie Chart */}
                <Grid size={{ xs: 12, lg: 4 }}>
                    <Paper sx={{ p: 3 }}>
                        <Typography variant="h6" gutterBottom sx={{ fontWeight: 600 }}>
                            Approval Distribution
                        </Typography>
                        <ResponsiveContainer width="100%" height={300}>
                            <PieChart>
                                <Pie
                                    data={approvalData}
                                    cx="50%"
                                    cy="50%"
                                    outerRadius={90}
                                    fill="#8884d8"
                                    dataKey="value"
                                    label={false}
                                >
                                    {approvalData.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={entry.color} />
                                    ))}
                                </Pie>
                                <Tooltip />
                                <Legend verticalAlign="bottom" height={36} />
                            </PieChart>
                        </ResponsiveContainer>
                    </Paper>
                </Grid>

                {/* Chargers by City Bar Chart */}
                <Grid size={{ xs: 12 }}>
                    <Paper sx={{ p: 3 }}>
                        <Typography variant="h6" gutterBottom sx={{ fontWeight: 600 }}>
                            Chargers by City
                        </Typography>
                        {cityData.length > 0 ? (
                            <ResponsiveContainer width="100%" height={300}>
                                <BarChart data={cityData}>
                                    <CartesianGrid strokeDasharray="3 3" />
                                    <XAxis dataKey="city" />
                                    <YAxis />
                                    <Tooltip />
                                    <Legend />
                                    <Bar dataKey="count" fill="#2196F3" name="Number of Chargers" />
                                </BarChart>
                            </ResponsiveContainer>
                        ) : (
                            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: 300 }}>
                                <Typography variant="body1" color="text.secondary">
                                    No city data available yet
                                </Typography>
                            </Box>
                        )}
                    </Paper>
                </Grid>
            </Grid>
        </Box>
    );
};

export default AnalyticsTab;
