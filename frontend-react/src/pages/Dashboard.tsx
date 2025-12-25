import React from 'react';
import { Container, Typography, Box, Paper, Button } from '@mui/material';
import { ElectricCar } from '@mui/icons-material';
import { useAuth } from '../context/AuthContext';

const Dashboard: React.FC = () => {
  const { user } = useAuth();

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Typography variant="h4" gutterBottom sx={{ fontWeight: 700, color: '#2C5F2D' }}>
        Welcome, {user?.firstName}! ⚡
      </Typography>

      <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
        Your EV Charging Dashboard
      </Typography>

      {/* Stats Summary */}
      <Box sx={{ display: 'flex', gap: 3, mb: 4, flexWrap: 'wrap' }}>
        <Paper sx={{ flex: '1 1 250px', p: 3, bgcolor: '#F5F7F5' }}>
          <Typography variant="h6" color="text.secondary">Total Bookings</Typography>
          <Typography variant="h3" sx={{ fontWeight: 700, color: '#2C5F2D' }}>0</Typography>
        </Paper>

        <Paper sx={{ flex: '1 1 250px', p: 3, bgcolor: '#F5F7F5' }}>
          <Typography variant="h6" color="text.secondary">Upcoming</Typography>
          <Typography variant="h3" sx={{ fontWeight: 700, color: '#F7931E' }}>0</Typography>
        </Paper>

        <Paper sx={{ flex: '1 1 250px', p: 3, bgcolor: '#F5F7F5' }}>
          <Typography variant="h6" color="text.secondary">Total Spent</Typography>
          <Typography variant="h3" sx={{ fontWeight: 700, color: '#2C5F2D' }}>₹0</Typography>
        </Paper>
      </Box>

      {/* Bookings */}
      <Paper elevation={2} sx={{ p: 4, textAlign: 'center' }}>
        <ElectricCar sx={{ fontSize: 64, color: '#CCC', mb: 2 }} />
        <Typography variant="h6" color="text.secondary" gutterBottom>
          No bookings yet
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
          Start exploring EV chargers near you!
        </Typography>
        <Button
          variant="contained"
          href="/chargers"
          sx={{ bgcolor: '#2C5F2D', '&:hover': { bgcolor: '#1E3F1E' } }}
        >
          Find Chargers
        </Button>
      </Paper>
    </Container>
  );
};

export default Dashboard;
