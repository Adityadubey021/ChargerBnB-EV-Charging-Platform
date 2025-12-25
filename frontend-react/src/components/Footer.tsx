import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
    Box,
    Container,
    Grid,
    Typography,
    IconButton,
    TextField,
    Button,
    Divider,
} from '@mui/material';
import {
    Facebook,
    Twitter,
    Instagram,
    LinkedIn,
    YouTube,
    Email,
    Phone,
    LocationOn,
} from '@mui/icons-material';

const Footer: React.FC = () => {
    const [email, setEmail] = React.useState('');
    const navigate = useNavigate();

    const SECRET_PHRASE = 'admin:open-sesame';

    const handleNewsletterSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        // Check for secret admin phrase
        if (email.toLowerCase() === SECRET_PHRASE.toLowerCase()) {
            setEmail('');
            // Auto-navigate to admin login after 500ms
            setTimeout(() => {
                navigate('/admin/login');
            }, 500);
            return;
        }

        // Regular newsletter subscription
        // TODO: Implement newsletter subscription
        alert('Thank you for subscribing!');
        setEmail('');
    };

    return (
        <Box sx={{ bgcolor: '#1a1a1a', color: 'white', pt: 6, pb: 3, mt: 8 }}>
            <Container>
                <Grid container spacing={4}>
                    {/* Company Info */}
                    <Grid size={{ xs: 12, md: 3 }}>
                        <Typography variant="h5" gutterBottom sx={{ fontWeight: 700, color: '#FF6B35' }}>
                            ⚡ ChargerBNB
                        </Typography>
                        <Typography variant="body2" sx={{ mb: 2, color: '#b0b0b0' }}>
                            India's leading peer-to-peer EV charging platform. Making electric mobility accessible across the nation.
                        </Typography>
                        <Box sx={{ display: 'flex', gap: 1 }}>
                            <IconButton sx={{ color: '#FF6B35' }} size="small">
                                <Facebook />
                            </IconButton>
                            <IconButton sx={{ color: '#FF6B35' }} size="small">
                                <Twitter />
                            </IconButton>
                            <IconButton sx={{ color: '#FF6B35' }} size="small">
                                <Instagram />
                            </IconButton>
                            <IconButton sx={{ color: '#FF6B35' }} size="small">
                                <LinkedIn />
                            </IconButton>
                            <IconButton sx={{ color: '#FF6B35' }} size="small">
                                <YouTube />
                            </IconButton>
                        </Box>
                    </Grid>

                    {/* Quick Links */}
                    <Grid size={{ xs: 12, sm: 6, md: 2 }}>
                        <Typography variant="h6" gutterBottom sx={{ fontWeight: 600 }}>
                            Quick Links
                        </Typography>
                        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                            <Link to="/" style={{ color: '#b0b0b0', textDecoration: 'none' }}>Home</Link>
                            <Link to="/about" style={{ color: '#b0b0b0', textDecoration: 'none' }}>About Us</Link>
                            <Link to="/how-it-works" style={{ color: '#b0b0b0', textDecoration: 'none' }}>How It Works</Link>
                            <Link to="/chargers" style={{ color: '#b0b0b0', textDecoration: 'none' }}>Find Chargers</Link>
                            <Link to="/pricing" style={{ color: '#b0b0b0', textDecoration: 'none' }}>Pricing</Link>
                        </Box>
                    </Grid>

                    {/* Services */}
                    <Grid size={{ xs: 12, sm: 6, md: 2 }}>
                        <Typography variant="h6" gutterBottom sx={{ fontWeight: 600 }}>
                            For Users
                        </Typography>
                        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                            <Link to="/signup" style={{ color: '#b0b0b0', textDecoration: 'none' }}>Sign Up</Link>
                            <Link to="/chargers" style={{ color: '#b0b0b0', textDecoration: 'none' }}>Browse Chargers</Link>
                            <Link to="/faq" style={{ color: '#b0b0b0', textDecoration: 'none' }}>FAQ</Link>
                            <Link to="/contact" style={{ color: '#b0b0b0', textDecoration: 'none' }}>Support</Link>
                        </Box>
                    </Grid>

                    {/* Popular Cities */}
                    <Grid size={{ xs: 12, sm: 6, md: 2 }}>
                        <Typography variant="h6" gutterBottom sx={{ fontWeight: 600 }}>
                            Popular Cities
                        </Typography>
                        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                            <Typography variant="body2" sx={{ color: '#b0b0b0' }}>Mumbai</Typography>
                            <Typography variant="body2" sx={{ color: '#b0b0b0' }}>Delhi NCR</Typography>
                            <Typography variant="body2" sx={{ color: '#b0b0b0' }}>Bangalore</Typography>
                            <Typography variant="body2" sx={{ color: '#b0b0b0' }}>Pune</Typography>
                            <Typography variant="body2" sx={{ color: '#b0b0b0' }}>Hyderabad</Typography>
                            <Typography variant="body2" sx={{ color: '#b0b0b0' }}>Chennai</Typography>
                        </Box>
                    </Grid>

                    {/* Newsletter */}
                    <Grid size={{ xs: 12, md: 3 }}>
                        <Typography variant="h6" gutterBottom sx={{ fontWeight: 600 }}>
                            Newsletter
                        </Typography>
                        <Typography variant="body2" sx={{ mb: 2, color: '#b0b0b0' }}>
                            Subscribe to get updates on new charging stations and offers.
                        </Typography>
                        <form onSubmit={handleNewsletterSubmit}>
                            <TextField
                                fullWidth
                                size="small"
                                placeholder="Your email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                sx={{
                                    bgcolor: 'white',
                                    borderRadius: 1,
                                    mb: 1,
                                    '& .MuiOutlinedInput-root': {
                                        '& fieldset': { border: 'none' },
                                    },
                                }}
                            />
                            <Button
                                type="submit"
                                fullWidth
                                variant="contained"
                                sx={{ bgcolor: '#FF6B35', '&:hover': { bgcolor: '#e55a25' } }}
                            >
                                Subscribe
                            </Button>
                        </form>
                    </Grid>
                </Grid>

                <Divider sx={{ my: 4, bgcolor: '#333' }} />

                {/* Contact Info */}
                <Grid container spacing={2} sx={{ mb: 3 }}>
                    <Grid size={{ xs: 12, md: 4 }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <Email sx={{ color: '#FF6B35' }} />
                            <Typography variant="body2" sx={{ color: '#b0b0b0' }}>
                                support@chargerbnb.in
                            </Typography>
                        </Box>
                    </Grid>
                    <Grid size={{ xs: 12, md: 4 }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <Phone sx={{ color: '#FF6B35' }} />
                            <Typography variant="body2" sx={{ color: '#b0b0b0' }}>
                                +91 1800-123-4567 (Toll Free)
                            </Typography>
                        </Box>
                    </Grid>
                    <Grid size={{ xs: 12, md: 4 }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <LocationOn sx={{ color: '#FF6B35' }} />
                            <Typography variant="body2" sx={{ color: '#b0b0b0' }}>
                                Mumbai, Maharashtra, India
                            </Typography>
                        </Box>
                    </Grid>
                </Grid>

                <Divider sx={{ my: 3, bgcolor: '#333' }} />

                {/* Bottom Bar */}
                <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, justifyContent: 'space-between', alignItems: 'center', gap: 2 }}>
                    <Typography variant="body2" sx={{ color: '#b0b0b0' }}>
                        © 2024 ChargerBNB India. All rights reserved. | Proudly Made in India 🇮🇳
                    </Typography>
                    <Box sx={{ display: 'flex', gap: 3 }}>
                        <Link to="/privacy" style={{ color: '#b0b0b0', textDecoration: 'none', fontSize: '14px' }}>
                            Privacy Policy
                        </Link>
                        <Link to="/terms" style={{ color: '#b0b0b0', textDecoration: 'none', fontSize: '14px' }}>
                            Terms & Conditions
                        </Link>
                        <Link to="/contact" style={{ color: '#b0b0b0', textDecoration: 'none', fontSize: '14px' }}>
                            Contact Us
                        </Link>
                    </Box>
                </Box>
            </Container>
        </Box>
    );
};

export default Footer;
