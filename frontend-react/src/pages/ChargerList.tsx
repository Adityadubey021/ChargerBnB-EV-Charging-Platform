import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Container,
  Grid,
  Card,
  CardMedia,
  CardContent,
  CardActions,
  Typography,
  Button,
  TextField,
  Box,
  Chip,
  CircularProgress,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Slider,
  Paper,
  SelectChangeEvent,
} from '@mui/material';
import { LocationOn, Bolt, FilterList } from '@mui/icons-material';
import { motion } from 'framer-motion';
import axios from 'axios';
import { getStates, getCitiesByState } from '../utils/indianStatesAndCities';

interface Charger {
  id: number;
  title: string;
  description?: string;
  powerRating: number;
  chargerType: string;
  plugType: string;
  pricePerHour: number;
  city: string;
  state: string;
  latitude: number;
  longitude: number;
  images?: string[];
  primaryImage?: string;
}

const ChargerList: React.FC = () => {
  const [chargers, setChargers] = useState<Charger[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [city, setCity] = useState('');
  const [state, setState] = useState('');
  const [availableCities, setAvailableCities] = useState<string[]>([]);
  const [chargerType, setChargerType] = useState('');
  const [priceRange, setPriceRange] = useState<number[]>([0, 500]);
  const [sortBy, setSortBy] = useState('createdAt');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const navigate = useNavigate();

  const states = getStates();

  const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

  const fetchChargers = useCallback(async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();

      if (searchQuery) params.append('search', searchQuery);
      if (city) params.append('city', city);
      if (state) params.append('state', state);
      if (chargerType) params.append('chargerType', chargerType);
      if (priceRange[0] > 0) params.append('minPrice', priceRange[0].toString());
      if (priceRange[1] < 500) params.append('maxPrice', priceRange[1].toString());
      params.append('sortBy', sortBy);
      params.append('page', page.toString());
      params.append('limit', '12');

      const response = await axios.get(`${API_URL}/chargers?${params.toString()}`);
      setChargers(response.data.chargers || []);
      setTotalPages(response.data.pagination?.totalPages || 1);
    } catch (error) {
      console.error('Error fetching chargers:', error);
      setChargers([]);
    } finally {
      setLoading(false);
    }
  }, [searchQuery, city, state, chargerType, priceRange, sortBy, page, API_URL]);

  useEffect(() => {
    fetchChargers();
  }, [fetchChargers]);

  const handlePriceChange = (event: Event, newValue: number | number[]) => {
    setPriceRange(newValue as number[]);
  };

  const handleCityChange = (event: SelectChangeEvent) => {
    setCity(event.target.value);
    setPage(1);
  };

  const handleStateChange = (event: SelectChangeEvent) => {
    const selectedState = event.target.value;
    setState(selectedState);
    setCity(''); // Reset city when state changes
    setAvailableCities(selectedState ? getCitiesByState(selectedState) : []);
    setPage(1);
  };

  const handleChargerTypeChange = (event: SelectChangeEvent) => {
    setChargerType(event.target.value);
    setPage(1);
  };

  const handleSortChange = (event: SelectChangeEvent) => {
    setSortBy(event.target.value);
    setPage(1);
  };

  const clearFilters = () => {
    setSearchQuery('');
    setCity('');
    setState('');
    setChargerType('');
    setPriceRange([0, 500]);
    setSortBy('createdAt');
    setPage(1);
  };

  if (loading && chargers.length === 0) {
    return (
      <Container sx={{ py: 8, textAlign: 'center' }}>
        <CircularProgress />
      </Container>
    );
  }

  return (
    <Container sx={{ py: 4 }} maxWidth="xl">
      <Typography variant="h3" component="h1" gutterBottom sx={{ mb: 4, fontWeight: 700 }}>
        Available Charging Stations
      </Typography>

      {/* Filter Panel */}
      <Paper elevation={2} sx={{ p: 3, mb: 4, borderRadius: 3 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
          <FilterList sx={{ mr: 1 }} />
          <Typography variant="h6" sx={{ fontWeight: 600 }}>
            Filters
          </Typography>
          <Button size="small" onClick={clearFilters} sx={{ ml: 'auto' }}>
            Clear All
          </Button>
        </Box>

        <Grid container spacing={2}>
          {/* Search */}
          <Grid size={{ xs: 12, md: 4 }}>
            <TextField
              fullWidth
              placeholder="Search by name, city..."
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setPage(1);
              }}
              size="small"
            />
          </Grid>

          {/* City Filter */}
          <Grid size={{ xs: 12, sm: 6, md: 2 }}>
            <FormControl fullWidth size="small">
              <InputLabel>City</InputLabel>
              <Select
                value={city}
                label="City"
                onChange={handleCityChange}
                disabled={!state}
              >
                <MenuItem value="">All Cities</MenuItem>
                {availableCities.map((cityName) => (
                  <MenuItem key={cityName} value={cityName}>
                    {cityName}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>

          {/* State Filter */}
          <Grid size={{ xs: 12, sm: 6, md: 2 }}>
            <FormControl fullWidth size="small">
              <InputLabel>State</InputLabel>
              <Select value={state} label="State" onChange={handleStateChange}>
                <MenuItem value="">All States</MenuItem>
                {states.map((stateName) => (
                  <MenuItem key={stateName} value={stateName}>
                    {stateName}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>

          {/* Charger Type Filter */}
          <Grid size={{ xs: 12, sm: 6, md: 2 }}>
            <FormControl fullWidth size="small">
              <InputLabel>Charger Type</InputLabel>
              <Select value={chargerType} label="Charger Type" onChange={handleChargerTypeChange}>
                <MenuItem value="">All Types</MenuItem>
                <MenuItem value="Type-2">Type-2</MenuItem>
                <MenuItem value="CCS">CCS</MenuItem>
                <MenuItem value="CHAdeMO">CHAdeMO</MenuItem>
                <MenuItem value="Type-1">Type-1</MenuItem>
              </Select>
            </FormControl>
          </Grid>

          {/* Sort By */}
          <Grid size={{ xs: 12, sm: 6, md: 2 }}>
            <FormControl fullWidth size="small">
              <InputLabel>Sort By</InputLabel>
              <Select value={sortBy} label="Sort By" onChange={handleSortChange}>
                <MenuItem value="createdAt">Newest First</MenuItem>
                <MenuItem value="pricePerHour">Price: Low to High</MenuItem>
                <MenuItem value="title">Name: A-Z</MenuItem>
              </Select>
            </FormControl>
          </Grid>

          {/* Price Range */}
          <Grid size={{ xs: 12 }}>
            <Typography variant="body2" gutterBottom>
              Price Range: ₹{priceRange[0]} - ₹{priceRange[1]}/hour
            </Typography>
            <Slider
              value={priceRange}
              onChange={handlePriceChange}
              onChangeCommitted={fetchChargers}
              valueLabelDisplay="auto"
              min={0}
              max={500}
              step={10}
              sx={{ maxWidth: 400 }}
            />
          </Grid>
        </Grid>
      </Paper>

      {/* Results */}
      {loading ? (
        <Box sx={{ textAlign: 'center', py: 4 }}>
          <CircularProgress />
        </Box>
      ) : chargers.length === 0 ? (
        <Typography variant="h6" textAlign="center" color="text.secondary" sx={{ py: 8 }}>
          No charging stations found. Try adjusting your filters.
        </Typography>
      ) : (
        <>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            Found {chargers.length} charging stations
          </Typography>

          <Grid container spacing={3}>
            {chargers.map((charger, index) => (
              <Grid size={{ xs: 12, sm: 6, md: 4 }} key={charger.id}>
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.05 }}
                  whileHover={{ y: -8 }}
                >
                  <Card
                    sx={{
                      height: '100%',
                      display: 'flex',
                      flexDirection: 'column',
                      cursor: 'pointer',
                      borderRadius: 3,
                      overflow: 'hidden',
                      transition: 'all 0.3s',
                      '&:hover': {
                        boxShadow: '0 8px 30px rgba(255,107,53,0.3)',
                      },
                    }}
                    onClick={() => navigate(`/chargers/${charger.id}`)}
                  >
                    <CardMedia
                      component="img"
                      height="200"
                      image={charger.primaryImage || charger.images?.[0] || '/images/charger-placeholder.jpg'}
                      alt={charger.title}
                      sx={{ objectFit: 'cover' }}
                    />
                    <CardContent sx={{ flexGrow: 1 }}>
                      <Typography variant="h6" gutterBottom sx={{ fontWeight: 600 }}>
                        {charger.title}
                      </Typography>
                      <Box sx={{ display: 'flex', alignItems: 'center', mb: 1, color: 'text.secondary' }}>
                        <LocationOn fontSize="small" sx={{ mr: 0.5 }} />
                        <Typography variant="body2">
                          {charger.city}, {charger.state}
                        </Typography>
                      </Box>
                      <Typography
                        variant="body2"
                        color="text.secondary"
                        sx={{
                          mb: 2,
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                          display: '-webkit-box',
                          WebkitLineClamp: 2,
                          WebkitBoxOrient: 'vertical',
                        }}
                      >
                        {charger.description}
                      </Typography>
                      <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', mb: 2 }}>
                        <Chip
                          icon={<Bolt />}
                          label={`${charger.powerRating} kW`}
                          size="small"
                          color="primary"
                        />
                        <Chip label={charger.chargerType} size="small" />
                      </Box>
                      <Typography variant="h6" color="primary" sx={{ fontWeight: 700 }}>
                        ₹{charger.pricePerHour}/hour
                      </Typography>
                    </CardContent>
                    <CardActions>
                      <Button size="small" color="primary" fullWidth>
                        View Details & Book
                      </Button>
                    </CardActions>
                  </Card>
                </motion.div>
              </Grid>
            ))}
          </Grid>

          {/* Pagination */}
          {totalPages > 1 && (
            <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4, gap: 1 }}>
              <Button
                variant="outlined"
                disabled={page === 1}
                onClick={() => setPage(page - 1)}
              >
                Previous
              </Button>
              <Typography sx={{ display: 'flex', alignItems: 'center', px: 2 }}>
                Page {page} of {totalPages}
              </Typography>
              <Button
                variant="outlined"
                disabled={page === totalPages}
                onClick={() => setPage(page + 1)}
              >
                Next
              </Button>
            </Box>
          )}
        </>
      )}
    </Container>
  );
};

export default ChargerList;
