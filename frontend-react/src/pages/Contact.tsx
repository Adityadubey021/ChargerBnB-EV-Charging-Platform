import React, { useState } from 'react';
import {
    Container,
    Typography,
    Box,
    Grid,
    TextField,
    Button,
    Card,
} from '@mui/material';
import {
    Email,
    Phone,
    LocationOn,
    Send,
} from '@mui/icons-material';
import Footer from '../components/Footer';

const Contact: React.FC = () => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        subject: '',
        message: '',
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        alert('Thank you! We will get back to you soon.');
        setFormData({ name: '', email: '', phone: '', subject: '', message: '' });
    };

    return (
        <>
            <Box>
                <Box sx={{ background: 'linear-gradient(135deg, #FF6B35 0%, #F7931E 100%)', color: 'white', py: 8, textAlign: 'center' }}>
                    <Container>
                        <Typography variant="h2" gutterBottom sx={{ fontWeight: 700 }}>Contact Us</Typography>
                        <Typography variant="h5" sx={{ fontWeight: 300 }}>We're here to help!</Typography>
                    </Container>
                </Box>

                <Container sx={{ py: 8 }}>
                    <Grid container spacing={6}>
                        <Grid size={{ xs: 12, md: 4 }}>
                            <Card sx={{ p: 3, textAlign: 'center', height: '100%', borderRadius: 3 }}>
                                <Email sx={{ fontSize: 50, color: '#FF6B35', mb: 2 }} />
                                <Typography variant="h6" gutterBottom sx={{ fontWeight: 600 }}>Email</Typography>
                                <Typography variant="body2" color="text.secondary">support@chargerbnb.in</Typography>
                                <Typography variant="body2" color="text.secondary">business@chargerbnb.in</Typography>
                            </Card>
                        </Grid>
                        <Grid size={{ xs: 12, md: 4 }}>
                            <Card sx={{ p: 3, textAlign: 'center', height: '100%', borderRadius: 3 }}>
                                <Phone sx={{ fontSize: 50, color: '#FF6B35', mb: 2 }} />
                                <Typography variant="h6" gutterBottom sx={{ fontWeight: 600 }}>Phone</Typography>
                                <Typography variant="body2" color="text.secondary">+91 1800-123-4567 (Toll Free)</Typography>
                                <Typography variant="body2" color="text.secondary">Mon-Sat: 9 AM - 6 PM IST</Typography>
                            </Card>
                        </Grid>
                        <Grid size={{ xs: 12, md: 4 }}>
                            <Card sx={{ p: 3, textAlign: 'center', height: '100%', borderRadius: 3 }}>
                                <LocationOn sx={{ fontSize: 50, color: '#FF6B35', mb: 2 }} />
                                <Typography variant="h6" gutterBottom sx={{ fontWeight: 600 }}>Office</Typography>
                                <Typography variant="body2" color="text.secondary">ChargerBNB India Pvt. Ltd.</Typography>
                                <Typography variant="body2" color="text.secondary">Mumbai, Maharashtra</Typography>
                            </Card>
                        </Grid>
                    </Grid>

                    <Box sx={{ mt: 8 }}>
                        <Typography variant="h4" textAlign="center" gutterBottom sx={{ fontWeight: 700, mb: 4 }}>Send us a Message</Typography>
                        <Card sx={{ p: 4, borderRadius: 3, maxWidth: 800, mx: 'auto' }}>
                            <form onSubmit={handleSubmit}>
                                <Grid container spacing={3}>
                                    <Grid size={{ xs: 12, sm: 6 }}>
                                        <TextField fullWidth label="Name" required value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} />
                                    </Grid>
                                    <Grid size={{ xs: 12, sm: 6 }}>
                                        <TextField fullWidth label="Email" type="email" required value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} />
                                    </Grid>
                                    <Grid size={{ xs: 12, sm: 6 }}>
                                        <TextField fullWidth label="Phone" value={formData.phone} onChange={(e) => setFormData({ ...formData, phone: e.target.value })} />
                                    </Grid>
                                    <Grid size={{ xs: 12, sm: 6 }}>
                                        <TextField fullWidth label="Subject" required value={formData.subject} onChange={(e) => setFormData({ ...formData, subject: e.target.value })} />
                                    </Grid>
                                    <Grid size={{ xs: 12 }}>
                                        <TextField fullWidth label="Message" multiline rows={4} required value={formData.message} onChange={(e) => setFormData({ ...formData, message: e.target.value })} />
                                    </Grid>
                                    <Grid size={{ xs: 12 }}>
                                        <Button type="submit" fullWidth variant="contained" size="large" endIcon={<Send />} sx={{ bgcolor: '#FF6B35', '&:hover': { bgcolor: '#e55a25' } }}>
                                            Send Message
                                        </Button>
                                    </Grid>
                                </Grid>
                            </form>
                        </Card>
                    </Box>
                </Container>
            </Box>
            <Footer />
        </>
    );
};

export default Contact;
