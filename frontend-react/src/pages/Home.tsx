import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Container,
  Typography,
  Button,
  Grid,
  Card,
  CardContent,
  Box,
} from '@mui/material';
import {
  EvStation,
  Schedule,
  Payment,
  Star,
} from '@mui/icons-material';
import { motion } from 'framer-motion';
import Footer from '../components/Footer';

const Home: React.FC = () => {
  const navigate = useNavigate();

  const features = [
    {
      icon: <EvStation sx={{ fontSize: 60, color: '#FF6B35' }} />,
      title: 'Find Chargers',
      description: 'Discover EV charging stations near you',
    },
    {
      icon: <Schedule sx={{ fontSize: 60, color: '#FF6B35' }} />,
      title: 'Book Instantly',
      description: 'Reserve your charging slot in advance',
    },
    {
      icon: <Payment sx={{ fontSize: 60, color: '#FF6B35' }} />,
      title: 'Easy Payments',
      description: 'Pay securely via UPI, cards, or wallets',
    },
    {
      icon: <Star sx={{ fontSize: 60, color: '#FF6B35' }} />,
      title: 'Rate & Review',
      description: 'Share your experience and help others',
    },
  ];

  return (
    <>
      <Box>
        {/* Hero Section */}
        <Box
          sx={{
            background: 'linear-gradient(135deg, rgba(44,95,45,0.85) 0%, rgba(255,107,53,0.85) 100%), url(/images/hero.png)',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            color: 'white',
            py: { xs: 8, md: 12 },
            textAlign: 'center',
            mt: { xs: 7, md: 8 }, // Account for fixed navbar
            overflow: 'hidden', // Prevent horizontal scroll
          }}
        >
          <Container maxWidth="lg" sx={{ px: { xs: 2, sm: 3 } }}>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
            >
              <Typography
                variant="h1"
                component="h1"
                gutterBottom
                sx={{
                  fontWeight: 700,
                  mb: 2,
                  fontSize: { xs: '2rem', sm: '3rem', md: '4.5rem' },
                  wordBreak: 'break-word',
                  overflowWrap: 'break-word',
                }}
              >
                ⚡ ChargerBNB
              </Typography>
              <Typography
                variant="h4"
                component="h2"
                gutterBottom
                sx={{
                  mb: 4,
                  fontWeight: 300,
                  fontSize: { xs: '1.25rem', sm: '1.75rem', md: '2.125rem' },
                  wordBreak: 'break-word',
                  overflowWrap: 'break-word',
                }}
              >
                Find EV Charging Stations Across India
              </Typography>
              <Typography
                variant="h6"
                sx={{
                  mb: 4,
                  opacity: 0.9,
                  fontSize: { xs: '0.95rem', sm: '1.15rem', md: '1.25rem' },
                  px: { xs: 1, md: 0 },
                  wordBreak: 'break-word',
                  overflowWrap: 'break-word',
                }}
              >
                Rent charging stations by the hour. Connect with hosts and power your electric vehicle journey.
              </Typography>
              <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center', flexWrap: 'wrap', px: { xs: 1, sm: 2 } }}>
                <Button
                  variant="contained"
                  size="large"
                  onClick={() => navigate('/chargers')}
                  sx={{
                    bgcolor: 'white',
                    color: '#FF6B35',
                    px: { xs: 2.5, md: 4 },
                    py: 1.5,
                    fontSize: { xs: '0.875rem', md: '1rem' },
                    '&:hover': { bgcolor: 'rgba(255,255,255,0.9)' },
                    whiteSpace: 'nowrap',
                  }}
                >
                  Find Chargers
                </Button>
                <Button
                  variant="outlined"
                  size="large"
                  onClick={() => navigate('/signup')}
                  sx={{
                    borderColor: 'white',
                    color: 'white',
                    px: { xs: 2.5, md: 4 },
                    py: 1.5,
                    fontSize: { xs: '0.875rem', md: '1rem' },
                    '&:hover': { borderColor: 'rgba(255,255,255,0.8)' },
                    whiteSpace: 'nowrap',
                  }}
                >
                  Become a Host
                </Button>
              </Box>
            </motion.div>
          </Container>
        </Box>

        {/* Features Section */}
        <Container sx={{ py: 8 }}>
          <Typography variant="h3" component="h2" textAlign="center" gutterBottom sx={{ mb: 6, fontWeight: 600 }}>
            Why Choose ChargerBNB?
          </Typography>
          <Grid container spacing={4}>
            {features.map((feature, index) => (
              <Grid size={{ xs: 12, sm: 6, md: 3 }} key={index}>
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  whileHover={{ y: -8 }}
                >
                  <Card
                    sx={{
                      height: '100%',
                      textAlign: 'center',
                      p: 3,
                      borderRadius: 4,
                      boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
                      transition: 'all 0.3s',
                      '&:hover': {
                        boxShadow: '0 8px 30px rgba(255,107,53,0.3)',
                      },
                    }}
                  >
                    <CardContent>
                      <Box sx={{ mb: 2 }}>{feature.icon}</Box>
                      <Typography variant="h6" gutterBottom sx={{ fontWeight: 600 }}>
                        {feature.title}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {feature.description}
                      </Typography>
                    </CardContent>
                  </Card>
                </motion.div>
              </Grid>
            ))}
          </Grid>
        </Container>

        {/* Network Section with Scroll Animation */}
        <Box sx={{ bgcolor: '#E8F5E9', py: 8 }}>
          <Container>
            <Grid container spacing={6} alignItems="center">
              <Grid size={{ xs: 12, md: 6 }}>
                <motion.div
                  initial={{ opacity: 0, x: -50 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.8 }}
                >
                  <Typography variant="h3" gutterBottom sx={{ fontWeight: 700, color: '#2C5F2D' }}>
                    Join India's Largest EV Charging Network
                  </Typography>
                  <Typography variant="body1" paragraph sx={{ fontSize: '1.1rem', mb: 3, color: 'text.secondary' }}>
                    Connect with thousands of EV owners across 100+ cities. Our peer-to-peer network makes charging accessible, affordable, and convenient.
                  </Typography>
                  <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
                    <Button
                      variant="contained"
                      size="large"
                      onClick={() => navigate('/chargers')}
                      sx={{ bgcolor: '#2C5F2D', px: 4, py: 1.5, '&:hover': { bgcolor: '#1e4620' } }}
                    >
                      Find Chargers
                    </Button>
                    <Button
                      variant="outlined"
                      size="large"
                      onClick={() => navigate('/how-it-works')}
                      sx={{ borderColor: '#2C5F2D', color: '#2C5F2D', px: 4, py: 1.5 }}
                    >
                      Learn More
                    </Button>
                  </Box>
                </motion.div>
              </Grid>
              <Grid size={{ xs: 12, md: 6 }}>
                <motion.div
                  initial={{ opacity: 0, x: 50 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.8 }}
                >
                  <img
                    src="/images/network.png"
                    alt="EV Charging Network"
                    style={{ width: '100%', borderRadius: '16px', boxShadow: '0 8px 32px rgba(0,0,0,0.1)' }}
                  />
                </motion.div>
              </Grid>
            </Grid>
          </Container>
        </Box>

        {/* Host Earnings Section with Scroll Animation */}
        <Box sx={{ bgcolor: '#FFF3E0', py: 8 }}>
          <Container>
            <Grid container spacing={6} alignItems="center">
              <Grid size={{ xs: 12, md: 6 }} sx={{ order: { xs: 2, md: 1 } }}>
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.8 }}
                >
                  <img
                    src="/images/earnings.png"
                    alt="Host Earnings"
                    style={{ width: '100%', borderRadius: '16px', boxShadow: '0 8px 32px rgba(0,0,0,0.1)' }}
                  />
                </motion.div>
              </Grid>
              <Grid size={{ xs: 12, md: 6 }} sx={{ order: { xs: 1, md: 2 } }}>
                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.8 }}
                >
                  <Typography variant="h3" gutterBottom sx={{ fontWeight: 700, color: '#FF6B35' }}>
                    Earn Money from Your Charger
                  </Typography>
                  <Typography variant="body1" paragraph sx={{ fontSize: '1.1rem', mb: 3, color: 'text.secondary' }}>
                    Turn your idle EV charger into a revenue stream. Hosts earn ₹3,000-₹8,000 per month on average by sharing their charging stations.
                  </Typography>
                  <Box sx={{ mb: 3 }}>
                    <Typography variant="h6" sx={{ fontWeight: 600, color: '#FF6B35', mb: 1 }}>
                      ✓ Set your own pricing
                    </Typography>
                    <Typography variant="h6" sx={{ fontWeight: 600, color: '#FF6B35', mb: 1 }}>
                      ✓ Control your availability
                    </Typography>
                    <Typography variant="h6" sx={{ fontWeight: 600, color: '#FF6B35', mb: 1 }}>
                      ✓ Get paid automatically
                    </Typography>
                  </Box>
                  <Button
                    variant="contained"
                    size="large"
                    onClick={() => navigate('/signup')}
                    sx={{ bgcolor: '#FF6B35', px: 4, py: 1.5, '&:hover': { bgcolor: '#e55a25' } }}
                  >
                    Become a Host
                  </Button>
                </motion.div>
              </Grid>
            </Grid>
          </Container>
        </Box>
      </Box>
      <Footer />
    </>
  );
};

export default Home;
