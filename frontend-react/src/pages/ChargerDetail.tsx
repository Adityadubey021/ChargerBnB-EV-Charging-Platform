import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Container,
  Grid,
  Card,
  CardMedia,
  Typography,
  Button,
  Box,
  Chip,
  TextField,
  Alert,
  CircularProgress,
  List,
  ListItem,
  ListItemText,
} from '@mui/material';
import { GoogleMap, LoadScript, Marker, DirectionsRenderer } from '@react-google-maps/api';
import { LocationOn, Bolt, AccessTime, Navigation } from '@mui/icons-material';
import axios from 'axios';
import { toast } from 'react-hot-toast';
import { useAuth } from '../context/AuthContext';
import { format, addHours } from 'date-fns';

const ChargerDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [charger, setCharger] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [startTime, setStartTime] = useState('');
  const [endTime, setEndTime] = useState('');
  const [checking, setChecking] = useState(false);
  const [availabilityStatus, setAvailabilityStatus] = useState<any>(null);
  const [nextAvailableSlots, setNextAvailableSlots] = useState<any[]>([]);
  const [directions, setDirections] = useState<any>(null);

  const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';
  const GOOGLE_MAPS_API_KEY = process.env.REACT_APP_GOOGLE_MAPS_API_KEY || '';

  const fetchCharger = useCallback(async () => {
    try {
      const response = await axios.get(`${API_URL}/chargers/${id}`);
      setCharger(response.data.charger || response.data);
    } catch (error) {
      toast.error('Failed to load charger details');
      navigate('/chargers');
    } finally {
      setLoading(false);
    }
  }, [id, API_URL, navigate]);

  useEffect(() => {
    fetchCharger();
  }, [fetchCharger]);

  // Calculate next 3 available slots (2-hour slots)
  const calculateNextSlots = (conflictingBookings: any[]) => {
    const slots = [];
    let currentTime = new Date();
    currentTime.setMinutes(0, 0, 0); // Round to nearest hour

    for (let i = 0; i < 10 && slots.length < 3; i++) {
      const slotStart = addHours(currentTime, i);
      const slotEnd = addHours(slotStart, 2);

      // Check if this slot conflicts with any booking
      const hasConflict = conflictingBookings.some((booking: any) => {
        const bookingStart = new Date(booking.startTime);
        const bookingEnd = new Date(booking.endTime);
        return (slotStart < bookingEnd && slotEnd > bookingStart);
      });

      if (!hasConflict && slotStart > new Date()) {
        slots.push({ start: slotStart, end: slotEnd });
      }
    }

    return slots;
  };

  const checkAvailability = async () => {
    if (!startTime || !endTime) {
      toast.error('Please select start and end time');
      return;
    }

    setChecking(true);
    try {
      const response = await axios.get(
        `${API_URL}/bookings/chargers/${id}/availability`,
        {
          params: {
            startTime: new Date(startTime).toISOString(),
            endTime: new Date(endTime).toISOString(),
          },
        }
      );

      setAvailabilityStatus(response.data);

      if (!response.data.isAvailable) {
        // Calculate next available slots
        const slots = calculateNextSlots(response.data.conflictingBookings || []);
        setNextAvailableSlots(slots);
      } else {
        setNextAvailableSlots([]);
      }
    } catch (error: any) {
      toast.error('Failed to check availability');
    } finally {
      setChecking(false);
    }
  };

  const handleBooking = async () => {
    if (!user) {
      navigate('/login');
      return;
    }

    if (!startTime || !endTime) {
      toast.error('Please select start and end time');
      return;
    }

    const start = new Date(startTime);
    const end = new Date(endTime);

    if (start >= end) {
      toast.error('End time must be after start time');
      return;
    }

    if (start < new Date()) {
      toast.error('Cannot book in the past');
      return;
    }

    try {
      const token = localStorage.getItem('accessToken');

      if (!token) {
        toast.error('Please login to book');
        navigate('/login');
        return;
      }

      await axios.post(
        `${API_URL}/bookings`,
        {
          chargerId: id,
          startTime: start.toISOString(),
          endTime: end.toISOString(),
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      toast.success('Booking created successfully! Host will review your request.');
      setStartTime('');
      setEndTime('');
      setAvailabilityStatus(null);
      navigate('/my-bookings');
    } catch (error: any) {
      const errorMsg = error.response?.data?.error || 'Booking failed';

      if (errorMsg.includes('Time slot is already booked')) {
        toast.error('This slot was just booked by another user. Please select another time.');
        // Recheck availability
        checkAvailability();
      } else if (error.response?.status === 401) {
        toast.error('Session expired. Please login again.');
        navigate('/login');
      } else {
        toast.error(errorMsg);
      }
    }
  };

  const selectAvailableSlot = (slot: any) => {
    setStartTime(format(slot.start, "yyyy-MM-dd'T'HH:mm"));
    setEndTime(format(slot.end, "yyyy-MM-dd'T'HH:mm"));
    setAvailabilityStatus(null);
    setNextAvailableSlots([]);
  };

  // Get directions to charger
  const getDirections = () => {
    if (!charger || !window.google) return;

    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((position) => {
        const directionsService = new window.google.maps.DirectionsService();
        const origin = new window.google.maps.LatLng(
          position.coords.latitude,
          position.coords.longitude
        );
        const destination = new window.google.maps.LatLng(
          parseFloat(charger.latitude),
          parseFloat(charger.longitude)
        );

        directionsService.route(
          {
            origin,
            destination,
            travelMode: window.google.maps.TravelMode.DRIVING,
          },
          (result, status) => {
            if (status === 'OK' && result) {
              setDirections(result);
            }
          }
        );
      });
    }
  };

  if (loading || !charger) {
    return (
      <Container sx={{ py: 8, textAlign: 'center' }}>
        <CircularProgress />
      </Container>
    );
  }

  const mapCenter = {
    lat: parseFloat(charger.latitude),
    lng: parseFloat(charger.longitude),
  };

  return (
    <Container sx={{ py: 4 }}>
      <Grid container spacing={4}>
        <Grid size={{ xs: 12, md: 8 }}>
          {(charger.primaryImage || charger.images?.[0]) && (
            <CardMedia
              component="img"
              height="400"
              image={charger.primaryImage || charger.images[0]}
              alt={charger.title}
              sx={{ borderRadius: 3, mb: 3 }}
            />
          )}

          <Card sx={{ p: 3, mb: 3, borderRadius: 3 }}>
            <Typography variant="h4" gutterBottom sx={{ fontWeight: 700 }}>
              {charger.title}
            </Typography>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2, color: 'text.secondary' }}>
              <LocationOn sx={{ mr: 1 }} />
              <Typography>
                {charger.address}, {charger.city}, {charger.state} - {charger.pincode}
              </Typography>
            </Box>
            <Typography variant="body1" paragraph>
              {charger.description}
            </Typography>
            <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', mb: 2 }}>
              <Chip icon={<Bolt />} label={`${charger.powerRating} kW`} color="primary" />
              <Chip label={charger.chargerType || charger.plugType} />
            </Box>
          </Card>

          <Card sx={{ p: 3, borderRadius: 3 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
              <Typography variant="h6" sx={{ fontWeight: 600 }}>
                Location & Navigation
              </Typography>
              <Button
                variant="contained"
                startIcon={<Navigation />}
                onClick={getDirections}
                size="small"
              >
                Get Directions
              </Button>
            </Box>
            {GOOGLE_MAPS_API_KEY ? (
              <LoadScript googleMapsApiKey={GOOGLE_MAPS_API_KEY}>
                <GoogleMap
                  mapContainerStyle={{ width: '100%', height: '400px', borderRadius: '8px' }}
                  center={mapCenter}
                  zoom={15}
                >
                  <Marker position={mapCenter} />
                  {directions && <DirectionsRenderer directions={directions} />}
                </GoogleMap>
              </LoadScript>
            ) : (
              <Box sx={{ p: 4, textAlign: 'center', bgcolor: 'grey.100', borderRadius: 2 }}>
                <Typography color="text.secondary">
                  Google Maps API key not configured
                </Typography>
              </Box>
            )}
          </Card>
        </Grid>

        <Grid size={{ xs: 12, md: 4 }}>
          <Card sx={{ p: 3, borderRadius: 3, position: 'sticky', top: 80 }}>
            <Typography variant="h5" gutterBottom sx={{ fontWeight: 700, color: 'primary.main' }}>
              ₹{charger.pricePerHour}/hour
            </Typography>

            {user ? (
              <Box sx={{ mt: 3 }}>
                <Typography variant="h6" gutterBottom sx={{ fontWeight: 600 }}>
                  Book This Charger
                </Typography>

                <TextField
                  fullWidth
                  label="Start Time"
                  type="datetime-local"
                  value={startTime}
                  onChange={(e) => {
                    setStartTime(e.target.value);
                    setAvailabilityStatus(null);
                  }}
                  sx={{ mb: 2 }}
                  InputLabelProps={{ shrink: true }}
                />

                <TextField
                  fullWidth
                  label="End Time"
                  type="datetime-local"
                  value={endTime}
                  onChange={(e) => {
                    setEndTime(e.target.value);
                    setAvailabilityStatus(null);
                  }}
                  sx={{ mb: 2 }}
                  InputLabelProps={{ shrink: true }}
                />

                {/* Check Availability Button */}
                <Button
                  fullWidth
                  variant="outlined"
                  onClick={checkAvailability}
                  disabled={!startTime || !endTime || checking}
                  startIcon={checking ? <CircularProgress size={20} /> : <AccessTime />}
                  sx={{ mb: 2 }}
                >
                  {checking ? 'Checking...' : 'Check Availability'}
                </Button>

                {/* Availability Status */}
                {availabilityStatus && (
                  <Box sx={{ mb: 2 }}>
                    {availabilityStatus.isAvailable ? (
                      <Alert severity="success">
                        ✓ Slot is available! You can book now.
                      </Alert>
                    ) : (
                      <>
                        <Alert severity="warning" sx={{ mb: 2 }}>
                          ⚠ This slot is already booked. See available slots below:
                        </Alert>

                        {nextAvailableSlots.length > 0 && (
                          <Box>
                            <Typography variant="subtitle2" gutterBottom>
                              Next Available Slots:
                            </Typography>
                            <List dense>
                              {nextAvailableSlots.map((slot, index) => (
                                <ListItem
                                  key={index}
                                  sx={{
                                    border: '1px solid',
                                    borderColor: 'divider',
                                    borderRadius: 1,
                                    mb: 1,
                                    cursor: 'pointer',
                                    '&:hover': { bgcolor: 'action.hover' },
                                  }}
                                  onClick={() => selectAvailableSlot(slot)}
                                >
                                  <ListItemText
                                    primary={`${format(slot.start, 'MMM dd, h:mm a')} - ${format(slot.end, 'h:mm a')}`}
                                    secondary={`${((slot.end - slot.start) / (1000 * 60 * 60)).toFixed(1)} hours`}
                                  />
                                </ListItem>
                              ))}
                            </List>
                          </Box>
                        )}
                      </>
                    )}
                  </Box>
                )}

                <Button
                  fullWidth
                  variant="contained"
                  size="large"
                  onClick={handleBooking}
                  disabled={!startTime || !endTime || (availabilityStatus && !availabilityStatus.isAvailable)}
                  sx={{ py: 1.5 }}
                >
                  Book Now
                </Button>

                <Typography variant="caption" display="block" sx={{ mt: 2, textAlign: 'center', color: 'text.secondary' }}>
                  First-come, first-served. Host will confirm your booking.
                </Typography>
              </Box>
            ) : (
              <Button
                fullWidth
                variant="contained"
                size="large"
                onClick={() => navigate('/login')}
                sx={{ mt: 3 }}
              >
                Login to Book
              </Button>
            )}
          </Card>
        </Grid>
      </Grid>
    </Container>
  );
};

export default ChargerDetail;
