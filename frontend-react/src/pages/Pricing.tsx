import React from 'react';
import { Container, Typography, Box, Paper, Grid, Card, CardContent } from '@mui/material';
import { Home, Speed, Business } from '@mui/icons-material';
import { Link } from 'react-router-dom';

const Pricing: React.FC = () => {
    return (
        <Container maxWidth="lg" sx={{ py: 8 }}>
            <Box sx={{ textAlign: 'center', mb: 6 }}>
                <Typography variant="h3" gutterBottom sx={{ fontWeight: 700, color: '#2C5F2D' }}>
                    Pricing Information
                </Typography>
                <Typography variant="h6" color="text.secondary">
                    Transparent pricing for EV charging across India
                </Typography>
            </Box>

            <Paper elevation={3} sx={{ p: 4, mb: 4, bgcolor: '#E8F5E9' }}>
                <Typography variant="h4" gutterBottom sx={{ fontWeight: 600, textAlign: 'center' }}>
                    Average Charging Costs
                </Typography>

                <Grid container spacing={3} sx={{ mt: 2 }}>
                    <Grid size={{ xs: 12, md: 4 }}>
                        <Card sx={{ height: '100%' }}>
                            <CardContent>
                                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                                    <Home sx={{ fontSize: 40, color: '#2C5F2D', mr: 2 }} />
                                    <Typography variant="h6" sx={{ fontWeight: 600 }}>Slow Charging</Typography>
                                </Box>
                                <Typography variant="h3" sx={{ color: '#2C5F2D', fontWeight: 700 }}>₹15-20</Typography>
                                <Typography variant="body2" color="text.secondary">per hour</Typography>
                            </CardContent>
                        </Card>
                    </Grid>

                    <Grid size={{ xs: 12, md: 4 }}>
                        <Card sx={{ height: '100%' }}>
                            <CardContent>
                                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                                    <Speed sx={{ fontSize: 40, color: '#FF6B35', mr: 2 }} />
                                    <Typography variant="h6" sx={{ fontWeight: 600 }}>Fast Charging</Typography>
                                </Box>
                                <Typography variant="h3" sx={{ color: '#FF6B35', fontWeight: 700 }}>₹25-30</Typography>
                                <Typography variant="body2" color="text.secondary">per hour</Typography>
                            </CardContent>
                        </Card>
                    </Grid>

                    <Grid size={{ xs: 12, md: 4 }}>
                        <Card sx={{ height: '100%' }}>
                            <CardContent>
                                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                                    <Business sx={{ fontSize: 40, color: '#2196F3', mr: 2 }} />
                                    <Typography variant="h6" sx={{ fontWeight: 600 }}>Commercial</Typography>
                                </Box>
                                <Typography variant="h3" sx={{ color: '#2196F3', fontWeight: 700 }}>₹35-45</Typography>
                                <Typography variant="body2" color="text.secondary">per hour</Typography>
                            </CardContent>
                        </Card>
                    </Grid>
                </Grid>
            </Paper>

            <Box sx={{ mt: 4, textAlign: 'center' }}>
                <Link to="/" style={{ textDecoration: 'none' }}>
                    <Typography variant="body1" sx={{ color: '#2C5F2D', fontWeight: 600 }}>
                        ← Back to Home
                    </Typography>
                </Link>
            </Box>
        </Container>
    );
};

export default Pricing;
