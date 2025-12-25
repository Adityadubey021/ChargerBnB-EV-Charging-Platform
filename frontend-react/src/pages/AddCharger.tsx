import React, { useState } from 'react';
import {
    Container,
    Paper,
    Typography,
    TextField,
    Button,
    Box,
    MenuItem,
    FormControlLabel,
    Checkbox,
    Alert,
} from '@mui/material';
import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

const AddCharger: React.FC = () => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        chargerType: 'Type-2',
        powerRating: '',
        chargingSpeed: 'Fast',
        numPorts: 1,
        plugType: '',
        pricePerHour: '',
        pricePerKWh: '',
        address: '',
        city: '',
        state: '',
        pincode: '',
        latitude: '',
        longitude: '',
        googleMapsUrl: '',
        landmark: '',
        instructions: '',
        amenities: {
            food: false,
            foodCost: '',
            restrooms: false,
            wifi: false,
            seating: false,
            games: false,
            gamesCost: '',
            security: false,
            available24x7: false,
        },
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleAmenityChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, checked, value } = e.target;
        setFormData(prev => ({
            ...prev,
            amenities: {
                ...prev.amenities,
                [name]: name.includes('Cost') ? value : checked
            }
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            const token = localStorage.getItem('accessToken');

            // Format data for backend
            const chargerData = {
                title: formData.title,
                description: formData.description,
                chargerType: formData.chargerType,
                powerRating: parseFloat(formData.powerRating),
                chargingSpeed: formData.chargingSpeed,
                numPorts: formData.numPorts,
                plugType: formData.plugType,
                pricePerHour: parseFloat(formData.pricePerHour),
                pricePerKWh: formData.pricePerKWh ? parseFloat(formData.pricePerKWh) : 0,
                address: formData.address,
                city: formData.city,
                state: formData.state,
                pincode: formData.pincode,
                latitude: formData.latitude || '0',
                longitude: formData.longitude || '0',
                googleMapsUrl: formData.googleMapsUrl,
                landmark: formData.landmark,
                instructions: formData.instructions,
                amenities: formData.amenities,
            };

            await axios.post(`${API_URL}/chargers`, chargerData, {
                headers: { Authorization: `Bearer ${token}` }
            });

            alert('Charger added successfully! It will be visible after admin approval.');
            window.location.href = '/dashboard';
        } catch (err: any) {
            console.error('Add charger error:', err);
            setError(err.response?.data?.error || 'Failed to add charger. Please check all fields.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <Container maxWidth="md" sx={{ py: 4 }}>
            <Paper elevation={3} sx={{ p: 4 }}>
                <Typography variant="h4" gutterBottom sx={{ fontWeight: 700, color: '#2C5F2D' }}>
                    Add New Charging Station
                </Typography>

                {error && <Alert severity="error" sx={{ mb: 3 }}>{error}</Alert>}

                <form onSubmit={handleSubmit}>
                    {/* Basic Info */}
                    <Typography variant="h6" sx={{ mt: 3, mb: 2, fontWeight: 600 }}>Basic Information</Typography>
                    <TextField
                        fullWidth
                        label="Charger Title"
                        name="title"
                        value={formData.title}
                        onChange={handleChange}
                        required
                        sx={{ mb: 2 }}
                        placeholder="e.g., Fast Charging Station - Mumbai Central"
                    />
                    <TextField
                        fullWidth
                        multiline
                        rows={3}
                        label="Description"
                        name="description"
                        value={formData.description}
                        onChange={handleChange}
                        sx={{ mb: 2 }}
                        placeholder="Describe your charging station..."
                    />

                    {/* Charger Specifications */}
                    <Typography variant="h6" sx={{ mt: 3, mb: 2, fontWeight: 600 }}>Charger Specifications</Typography>
                    <Box sx={{ display: 'flex', gap: 2, mb: 2, flexWrap: 'wrap' }}>
                        <TextField
                            select
                            label="Charger Type"
                            name="chargerType"
                            value={formData.chargerType}
                            onChange={handleChange}
                            sx={{ flex: '1 1 200px' }}
                        >
                            <MenuItem value="Type-2">Type-2</MenuItem>
                            <MenuItem value="CCS">CCS</MenuItem>
                            <MenuItem value="CHAdeMO">CHAdeMO</MenuItem>
                            <MenuItem value="AC">AC</MenuItem>
                        </TextField>

                        <TextField
                            label="Power Rating (kW)"
                            name="powerRating"
                            type="number"
                            value={formData.powerRating}
                            onChange={handleChange}
                            required
                            sx={{ flex: '1 1 150px' }}
                        />

                        <TextField
                            select
                            label="Charging Speed"
                            name="chargingSpeed"
                            value={formData.chargingSpeed}
                            onChange={handleChange}
                            sx={{ flex: '1 1 150px' }}
                        >
                            <MenuItem value="Slow">Slow (3-7 kW)</MenuItem>
                            <MenuItem value="Fast">Fast (7-22 kW)</MenuItem>
                            <MenuItem value="Rapid">Rapid (43-150 kW)</MenuItem>
                        </TextField>

                        <TextField
                            label="Number of Ports"
                            name="numPorts"
                            type="number"
                            value={formData.numPorts}
                            onChange={handleChange}
                            sx={{ flex: '1 1 120px' }}
                        />

                        <TextField
                            label="Plug Type"
                            name="plugType"
                            value={formData.plugType}
                            onChange={handleChange}
                            required
                            sx={{ flex: '1 1 150px' }}
                            placeholder="e.g., Type 2"
                        />
                    </Box>

                    {/* Pricing */}
                    <Typography variant="h6" sx={{ mt: 3, mb: 2, fontWeight: 600 }}>Pricing</Typography>
                    <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
                        <TextField
                            label="Price per Hour (₹)"
                            name="pricePerHour"
                            type="number"
                            value={formData.pricePerHour}
                            onChange={handleChange}
                            required
                            sx={{ flex: 1 }}
                        />
                        <TextField
                            label="Price per kWh (₹) - Optional"
                            name="pricePerKWh"
                            type="number"
                            value={formData.pricePerKWh}
                            onChange={handleChange}
                            sx={{ flex: 1 }}
                        />
                    </Box>

                    {/* Location */}
                    <Typography variant="h6" sx={{ mt: 3, mb: 2, fontWeight: 600 }}>Location</Typography>
                    <TextField
                        fullWidth
                        label="Full Address"
                        name="address"
                        value={formData.address}
                        onChange={handleChange}
                        required
                        sx={{ mb: 2 }}
                    />
                    <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
                        <TextField label="City" name="city" value={formData.city} onChange={handleChange} required sx={{ flex: 1 }} />
                        <TextField label="State" name="state" value={formData.state} onChange={handleChange} required sx={{ flex: 1 }} />
                        <TextField label="Pincode" name="pincode" value={formData.pincode} onChange={handleChange} required sx={{ flex: 1 }} />
                    </Box>
                    <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
                        <TextField label="Latitude" name="latitude" value={formData.latitude} onChange={handleChange} sx={{ flex: 1 }} />
                        <TextField label="Longitude" name="longitude" value={formData.longitude} onChange={handleChange} sx={{ flex: 1 }} />
                    </Box>
                    <TextField
                        fullWidth
                        label="Google Maps URL"
                        name="googleMapsUrl"
                        value={formData.googleMapsUrl}
                        onChange={handleChange}
                        sx={{ mb: 2 }}
                        placeholder="https://maps.google.com/..."
                    />
                    <TextField
                        fullWidth
                        label="Landmark"
                        name="landmark"
                        value={formData.landmark}
                        onChange={handleChange}
                        sx={{ mb: 2 }}
                        placeholder="Near..."
                    />
                    <TextField
                        fullWidth
                        multiline
                        rows={2}
                        label="Instructions to Reach"
                        name="instructions"
                        value={formData.instructions}
                        onChange={handleChange}
                        sx={{ mb: 2 }}
                    />

                    {/* Amenities */}
                    <Typography variant="h6" sx={{ mt: 3, mb: 2, fontWeight: 600 }}>Amenities & Services</Typography>
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                        <FormControlLabel
                            control={<Checkbox name="food" checked={formData.amenities.food} onChange={handleAmenityChange} />}
                            label="Food Available"
                        />
                        {formData.amenities.food && (
                            <TextField
                                label="Food Cost (₹)"
                                name="foodCost"
                                type="number"
                                value={formData.amenities.foodCost}
                                onChange={handleAmenityChange}
                                size="small"
                                sx={{ ml: 4, mb: 1, maxWidth: 200 }}
                            />
                        )}
                        <FormControlLabel
                            control={<Checkbox name="restrooms" checked={formData.amenities.restrooms} onChange={handleAmenityChange} />}
                            label="Restrooms"
                        />
                        <FormControlLabel
                            control={<Checkbox name="wifi" checked={formData.amenities.wifi} onChange={handleAmenityChange} />}
                            label="WiFi"
                        />
                        <FormControlLabel
                            control={<Checkbox name="seating" checked={formData.amenities.seating} onChange={handleAmenityChange} />}
                            label="Seating Area"
                        />
                        <FormControlLabel
                            control={<Checkbox name="games" checked={formData.amenities.games} onChange={handleAmenityChange} />}
                            label="Games/Entertainment"
                        />
                        {formData.amenities.games && (
                            <TextField
                                label="Games Cost (₹)"
                                name="gamesCost"
                                type="number"
                                value={formData.amenities.gamesCost}
                                onChange={handleAmenityChange}
                                size="small"
                                sx={{ ml: 4, mb: 1, maxWidth: 200 }}
                            />
                        )}
                        <FormControlLabel
                            control={<Checkbox name="security" checked={formData.amenities.security} onChange={handleAmenityChange} />}
                            label="Security/CCTV"
                        />
                        <FormControlLabel
                            control={<Checkbox name="available24x7" checked={formData.amenities.available24x7} onChange={handleAmenityChange} />}
                            label="24/7 Available"
                        />
                    </Box>

                    <Button
                        type="submit"
                        variant="contained"
                        fullWidth
                        disabled={loading}
                        sx={{ mt: 4, py: 1.5, bgcolor: '#2C5F2D', '&:hover': { bgcolor: '#1E3F1E' } }}
                    >
                        {loading ? 'Adding Charger...' : 'Add Charger'}
                    </Button>
                </form>
            </Paper>
        </Container>
    );
};

export default AddCharger;
