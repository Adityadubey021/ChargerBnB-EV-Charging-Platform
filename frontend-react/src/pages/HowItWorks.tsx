import React from 'react';
import {
    Container,
    Typography,
    Box,
    Grid,
    Card,
    CardContent,
    Step,
    Stepper,
    StepLabel,
    StepContent,
    Button,
} from '@mui/material';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import {
    Search,
    EvStation,
    Payment,
    RateReview,
} from '@mui/icons-material';
import Footer from '../components/Footer';

const HowItWorks: React.FC = () => {
    const navigate = useNavigate();

    const userSteps = [
        {
            label: 'Find a Charger',
            icon: <Search sx={{ fontSize: 40, color: '#FF6B35' }} />,
            description: 'Browse our map or search for EV charging stations near you. Filter by plug type, power rating, and price.',
        },
        {
            label: 'Book Your Slot',
            icon: <EvStation sx={{ fontSize: 40, color: '#FF6B35' }} />,
            description: 'Select your preferred time slot and duration. Get instant confirmation and directions to the charging station.',
        },
        {
            label: 'Charge & Pay',
            icon: <Payment sx={{ fontSize: 40, color: '#FF6B35' }} />,
            description: 'Plug in your EV and charge. Pay securely through UPI, cards, or digital wallets. Track your charging progress in real-time.',
        },
        {
            label: 'Rate & Review',
            icon: <RateReview sx={{ fontSize: 40, color: '#FF6B35' }} />,
            description: 'Share your experience to help the community. Build your charging history and earn rewards.',
        },
    ];

    const hostSteps = [
        {
            title: 'List Your Charger',
            description: 'Sign up as a host and list your EV charging station with details, photos, and pricing.',
        },
        {
            title: 'Set Availability',
            description: 'Define your available time slots and manage bookings through our easy-to-use dashboard.',
        },
        {
            title: 'Welcome Guests',
            description: 'Accept bookings and provide a great charging experience to EV owners.',
        },
        {
            title: 'Earn Money',
            description: 'Receive payments directly to your account. Track your earnings and analytics.',
        },
    ];

    return (
        <>
            <Box>
                {/* Hero Section */}
                <Box
                    sx={{
                        background: 'linear-gradient(135deg, #FF6B35 0%, #F7931E 100%)',
                        color: 'white',
                        py: 8,
                        textAlign: 'center',
                    }}
                >
                    <Container>
                        <Typography variant="h2" component="h1" gutterBottom sx={{ fontWeight: 700 }}>
                            How ChargerBNB Works
                        </Typography>
                        <Typography variant="h5" sx={{ fontWeight: 300 }}>
                            Simple. Convenient. Sustainable.
                        </Typography>
                    </Container>
                </Box>

                {/* Hero Image */}
                <Box sx={{ width: '100%', overflow: 'hidden' }}>
                    <img
                        src="/images/how_it_works_1764948287322.png"
                        alt="How ChargerBNB Works"
                        style={{ width: '100%', display: 'block' }}
                    />
                </Box>

                {/* For Users Section */}
                <Container sx={{ py: 8 }}>
                    <Typography variant="h3" textAlign="center" gutterBottom sx={{ fontWeight: 700, mb: 2 }}>
                        For EV Owners
                    </Typography>
                    <Typography variant="h6" textAlign="center" color="text.secondary" sx={{ mb: 6 }}>
                        Charge your vehicle in 4 simple steps
                    </Typography>

                    <Grid container spacing={4}>
                        {userSteps.map((step, index) => (
                            <Grid size={{ xs: 12, md: 6 }} key={index}>
                                <motion.div
                                    initial={{ opacity: 0, y: 20 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.5, delay: index * 0.1 }}
                                    viewport={{ once: true }}
                                >
                                    <Card
                                        sx={{
                                            p: 3,
                                            borderRadius: 3,
                                            height: '100%',
                                            boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
                                            transition: 'transform 0.3s',
                                            '&:hover': {
                                                transform: 'translateY(-8px)',
                                                boxShadow: '0 8px 30px rgba(255,107,53,0.2)',
                                            },
                                        }}
                                    >
                                        <CardContent>
                                            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                                                <Box
                                                    sx={{
                                                        width: 60,
                                                        height: 60,
                                                        borderRadius: '50%',
                                                        bgcolor: '#fff3ed',
                                                        display: 'flex',
                                                        alignItems: 'center',
                                                        justifyContent: 'center',
                                                        mr: 2,
                                                    }}
                                                >
                                                    {step.icon}
                                                </Box>
                                                <Typography variant="h5" sx={{ fontWeight: 600 }}>
                                                    {index + 1}. {step.label}
                                                </Typography>
                                            </Box>
                                            <Typography variant="body1" color="text.secondary">
                                                {step.description}
                                            </Typography>
                                        </CardContent>
                                    </Card>
                                </motion.div>
                            </Grid>
                        ))}
                    </Grid>

                    <Box sx={{ textAlign: 'center', mt: 6 }}>
                        <Button
                            variant="contained"
                            size="large"
                            onClick={() => navigate('/chargers')}
                            sx={{
                                bgcolor: '#FF6B35',
                                px: 4,
                                py: 1.5,
                                '&:hover': { bgcolor: '#e55a25' },
                            }}
                        >
                            Find Chargers Now
                        </Button>
                    </Box>
                </Container>

                {/* For Hosts Section */}
                <Box sx={{ bgcolor: '#f8f9fa', py: 8 }}>
                    <Container>
                        <Typography variant="h3" textAlign="center" gutterBottom sx={{ fontWeight: 700, mb: 2 }}>
                            For Charging Station Hosts
                        </Typography>
                        <Typography variant="h6" textAlign="center" color="text.secondary" sx={{ mb: 6 }}>
                            Turn your charger into a source of income
                        </Typography>

                        <Grid container spacing={6} alignItems="center">
                            <Grid size={{ xs: 12, md: 6 }}>
                                <img
                                    src="/images/charger_station_1764948257159.png"
                                    alt="Become a Host"
                                    style={{ width: '100%', borderRadius: '16px', boxShadow: '0 8px 32px rgba(0,0,0,0.1)' }}
                                />
                            </Grid>
                            <Grid size={{ xs: 12, md: 6 }}>
                                <Stepper orientation="vertical">
                                    {hostSteps.map((step, index) => (
                                        <Step key={index} active>
                                            <StepLabel
                                                StepIconProps={{
                                                    sx: { color: '#FF6B35', '& .MuiStepIcon-text': { fill: 'white' } },
                                                }}
                                            >
                                                <Typography variant="h6" sx={{ fontWeight: 600 }}>
                                                    {step.title}
                                                </Typography>
                                            </StepLabel>
                                            <StepContent>
                                                <Typography variant="body1" color="text.secondary" sx={{ mb: 2 }}>
                                                    {step.description}
                                                </Typography>
                                            </StepContent>
                                        </Step>
                                    ))}
                                </Stepper>
                                <Box sx={{ mt: 4 }}>
                                    <Button
                                        variant="outlined"
                                        size="large"
                                        onClick={() => navigate('/signup')}
                                        sx={{
                                            borderColor: '#FF6B35',
                                            color: '#FF6B35',
                                            px: 4,
                                            py: 1.5,
                                            '&:hover': { borderColor: '#e55a25', bgcolor: '#fff3ed' },
                                        }}
                                    >
                                        Become a Host
                                    </Button>
                                </Box>
                            </Grid>
                        </Grid>
                    </Container>
                </Box>

                {/* Benefits Section */}
                <Container sx={{ py: 8 }}>
                    <Typography variant="h3" textAlign="center" gutterBottom sx={{ fontWeight: 700, mb: 6 }}>
                        Why Choose ChargerBNB?
                    </Typography>
                    <Grid container spacing={4}>
                        {[
                            { title: 'Nationwide Network', desc: 'Access chargers across 100+ Indian cities' },
                            { title: 'Verified Hosts', desc: 'All hosts are verified for safety and reliability' },
                            { title: 'Competitive Pricing', desc: 'Transparent pricing with no hidden charges' },
                            { title: 'Real-time Availability', desc: 'See live charger availability and book instantly' },
                            { title: 'Secure Payments', desc: 'Multiple payment options with secure transactions' },
                            { title: '24/7 Support', desc: 'Round-the-clock customer support in multiple languages' },
                        ].map((benefit, index) => (
                            <Grid size={{ xs: 12, sm: 6, md: 4 }} key={index}>
                                <motion.div
                                    initial={{ opacity: 0, scale: 0.9 }}
                                    whileInView={{ opacity: 1, scale: 1 }}
                                    transition={{ duration: 0.4, delay: index * 0.05 }}
                                    viewport={{ once: true }}
                                >
                                    <Card sx={{ p: 3, textAlign: 'center', borderRadius: 3, height: '100%' }}>
                                        <Typography variant="h6" gutterBottom sx={{ fontWeight: 600, color: '#FF6B35' }}>
                                            {benefit.title}
                                        </Typography>
                                        <Typography variant="body2" color="text.secondary">
                                            {benefit.desc}
                                        </Typography>
                                    </Card>
                                </motion.div>
                            </Grid>
                        ))}
                    </Grid>
                </Container>
            </Box>
            <Footer />
        </>
    );
};

export default HowItWorks;
