import React from 'react';
import {
    Container,
    Typography,
    Box,
    Grid,
    Card,
    CardContent,
} from '@mui/material';
import { motion } from 'framer-motion';
import {
    EmojiObjects,
    People,
    Public,
    TrendingUp,
} from '@mui/icons-material';
import Footer from '../components/Footer';

const About: React.FC = () => {
    const stats = [
        { icon: <People sx={{ fontSize: 50 }} />, number: '50,000+', label: 'Active Users' },
        { icon: <EmojiObjects sx={{ fontSize: 50 }} />, number: '5,000+', label: 'Charging Stations' },
        { icon: <Public sx={{ fontSize: 50 }} />, number: '100+', label: 'Cities Covered' },
        { icon: <TrendingUp sx={{ fontSize: 50 }} />, number: '1M+', label: 'Charges Completed' },
    ];

    const values = [
        {
            title: 'Sustainability',
            description: 'Building a greener India through accessible electric vehicle charging infrastructure.',
        },
        {
            title: 'Innovation',
            description: 'Leveraging technology to create seamless peer-to-peer charging experiences.',
        },
        {
            title: 'Community',
            description: 'Connecting EV owners and charging station hosts across India.',
        },
        {
            title: 'Accessibility',
            description: 'Making EV charging affordable and convenient for everyone.',
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
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6 }}
                        >
                            <Typography variant="h2" component="h1" gutterBottom sx={{ fontWeight: 700 }}>
                                About ChargerBNB
                            </Typography>
                            <Typography variant="h5" sx={{ mb: 2, fontWeight: 300 }}>
                                Powering India's Electric Vehicle Revolution
                            </Typography>
                        </motion.div>
                    </Container>
                </Box>

                {/* Mission Section */}
                <Container sx={{ py: 8 }}>
                    <Grid container spacing={6} alignItems="center">
                        <Grid size={{ xs: 12, md: 6 }}>
                            <img
                                src="/images/about_us_team_1764948323717.png"
                                alt="ChargerBNB Team"
                                style={{ width: '100%', borderRadius: '16px', boxShadow: '0 8px 32px rgba(0,0,0,0.1)' }}
                            />
                        </Grid>
                        <Grid size={{ xs: 12, md: 6 }}>
                            <Typography variant="h3" gutterBottom sx={{ fontWeight: 700 }}>
                                Our Mission
                            </Typography>
                            <Typography variant="body1" paragraph sx={{ fontSize: '1.1rem', lineHeight: 1.8 }}>
                                ChargerBNB is India's first peer-to-peer EV charging marketplace, connecting electric vehicle owners with charging station hosts across the nation. We're on a mission to solve the EV charging infrastructure challenge by empowering individuals and businesses to share their charging facilities.
                            </Typography>
                            <Typography variant="body1" paragraph sx={{ fontSize: '1.1rem', lineHeight: 1.8 }}>
                                Founded in 2024, we believe that the transition to electric mobility should be accessible, affordable, and convenient for every Indian. By creating a community-driven charging network, we're accelerating India's journey towards sustainable transportation.
                            </Typography>
                        </Grid>
                    </Grid>
                </Container>

                {/* Stats Section */}
                <Box sx={{ bgcolor: '#f8f9fa', py: 8 }}>
                    <Container>
                        <Typography variant="h3" textAlign="center" gutterBottom sx={{ fontWeight: 700, mb: 6 }}>
                            Our Impact
                        </Typography>
                        <Grid container spacing={4}>
                            {stats.map((stat, index) => (
                                <Grid size={{ xs: 12, sm: 6, md: 3 }} key={index}>
                                    <motion.div
                                        initial={{ opacity: 0, scale: 0.8 }}
                                        whileInView={{ opacity: 1, scale: 1 }}
                                        transition={{ duration: 0.5, delay: index * 0.1 }}
                                        viewport={{ once: true }}
                                    >
                                        <Card
                                            sx={{
                                                textAlign: 'center',
                                                p: 3,
                                                borderRadius: 3,
                                                boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
                                                height: '100%',
                                            }}
                                        >
                                            <Box sx={{ color: '#FF6B35', mb: 2 }}>{stat.icon}</Box>
                                            <Typography variant="h3" sx={{ fontWeight: 700, color: '#FF6B35', mb: 1 }}>
                                                {stat.number}
                                            </Typography>
                                            <Typography variant="body1" color="text.secondary">
                                                {stat.label}
                                            </Typography>
                                        </Card>
                                    </motion.div>
                                </Grid>
                            ))}
                        </Grid>
                    </Container>
                </Box>

                {/* Values Section */}
                <Container sx={{ py: 8 }}>
                    <Typography variant="h3" textAlign="center" gutterBottom sx={{ fontWeight: 700, mb: 6 }}>
                        Our Values
                    </Typography>
                    <Grid container spacing={4}>
                        {values.map((value, index) => (
                            <Grid size={{ xs: 12, md: 6 }} key={index}>
                                <motion.div
                                    initial={{ opacity: 0, x: index % 2 === 0 ? -20 : 20 }}
                                    whileInView={{ opacity: 1, x: 0 }}
                                    transition={{ duration: 0.6 }}
                                    viewport={{ once: true }}
                                >
                                    <Card sx={{ p: 3, borderRadius: 3, height: '100%', boxShadow: '0 4px 20px rgba(0,0,0,0.08)' }}>
                                        <CardContent>
                                            <Typography variant="h5" gutterBottom sx={{ fontWeight: 600, color: '#FF6B35' }}>
                                                {value.title}
                                            </Typography>
                                            <Typography variant="body1" color="text.secondary">
                                                {value.description}
                                            </Typography>
                                        </CardContent>
                                    </Card>
                                </motion.div>
                            </Grid>
                        ))}
                    </Grid>
                </Container>

                {/* Vision Section */}
                <Box sx={{ bgcolor: '#1a1a1a', color: 'white', py: 8 }}>
                    <Container>
                        <Grid container spacing={6} alignItems="center">
                            <Grid size={{ xs: 12, md: 6 }}>
                                <Typography variant="h3" gutterBottom sx={{ fontWeight: 700 }}>
                                    Our Vision
                                </Typography>
                                <Typography variant="body1" paragraph sx={{ fontSize: '1.1rem', lineHeight: 1.8 }}>
                                    We envision an India where range anxiety is a thing of the past. Where every neighborhood, every street, every parking lot has accessible EV charging infrastructure. Where the transition to electric mobility is not just possible, but preferred.
                                </Typography>
                                <Typography variant="body1" sx={{ fontSize: '1.1rem', lineHeight: 1.8 }}>
                                    Through ChargerBNB, we're building the backbone of India's electric future - one charging station at a time, one community at a time.
                                </Typography>
                            </Grid>
                            <Grid size={{ xs: 12, md: 6 }}>
                                <img
                                    src="/images/eco_environment_1764948170400.png"
                                    alt="Sustainable Future"
                                    style={{ width: '100%', borderRadius: '16px' }}
                                />
                            </Grid>
                        </Grid>
                    </Container>
                </Box>
            </Box>
            <Footer />
        </>
    );
};

export default About;
