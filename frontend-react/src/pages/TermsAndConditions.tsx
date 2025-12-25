import React from 'react';
import { Container, Typography, Box, Paper } from '@mui/material';
import { Link } from 'react-router-dom';

const TermsAndConditions: React.FC = () => {
    return (
        <Container maxWidth="md" sx={{ py: 8 }}>
            <Paper elevation={3} sx={{ p: 4 }}>
                <Typography variant="h3" gutterBottom sx={{ fontWeight: 700, color: '#2C5F2D' }}>
                    Terms & Conditions
                </Typography>

                <Typography variant="body2" color="text.secondary" gutterBottom>
                    Last Updated: December 7, 2025
                </Typography>

                <Box sx={{ mt: 4 }}>
                    <Typography variant="h5" gutterBottom sx={{ fontWeight: 600, mt: 3 }}>
                        1. Acceptance of Terms
                    </Typography>
                    <Typography variant="body1" paragraph>
                        By accessing and using ChargerBNB, you accept and agree to be bound by the terms and provision of this agreement.
                    </Typography>

                    <Typography variant="h5" gutterBottom sx={{ fontWeight: 600, mt: 3 }}>
                        2. Service Description
                    </Typography>
                    <Typography variant="body1" paragraph>
                        ChargerBNB is a peer-to-peer marketplace platform that connects electric vehicle (EV) owners with charging station hosts.
                    </Typography>

                    <Typography variant="h5" gutterBottom sx={{ fontWeight: 600, mt: 3 }}>
                        3. User Responsibilities
                    </Typography>
                    <Typography variant="body1" paragraph>
                        Users must provide accurate information, use charging stations responsibly, and comply with all applicable laws.
                    </Typography>

                    <Typography variant="h5" gutterBottom sx={{ fontWeight: 600, mt: 3 }}>
                        4. Liability and Insurance
                    </Typography>
                    <Typography variant="body1" paragraph>
                        ChargerBNB acts as a marketplace platform only. We are not liable for damage to vehicles, property, or injuries sustained on host premises.
                    </Typography>

                    <Typography variant="h5" gutterBottom sx={{ fontWeight: 600, mt: 3 }}>
                        5. Contact Information
                    </Typography>
                    <Typography variant="body1" paragraph>
                        For questions, contact us at: legal@chargerbnb.com
                    </Typography>
                </Box>

                <Box sx={{ mt: 4, textAlign: 'center' }}>
                    <Link to="/" style={{ textDecoration: 'none' }}>
                        <Typography variant="body1" sx={{ color: '#2C5F2D', fontWeight: 600 }}>
                            ← Back to Home
                        </Typography>
                    </Link>
                </Box>
            </Paper>
        </Container>
    );
};

export default TermsAndConditions;
