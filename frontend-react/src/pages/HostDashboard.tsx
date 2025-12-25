import React from 'react';
import { Container, Typography, Box, Paper, Button, Tabs, Tab } from '@mui/material';
import { Add, ElectricBolt } from '@mui/icons-material';

const HostDashboard: React.FC = () => {
  const [tabValue, setTabValue] = React.useState(0);

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
        <Box>
          <Typography variant="h4" gutterBottom sx={{ fontWeight: 700, color: '#2C5F2D' }}>
            Host Dashboard ⚡
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Manage your charging stations
          </Typography>
        </Box>
        <Button
          variant="contained"
          startIcon={<Add />}
          onClick={() => window.location.href = '/add-charger'}
          sx={{ bgcolor: '#2C5F2D', '&:hover': { bgcolor: '#1E3F1E' } }}
        >
          Add New Charger
        </Button>
      </Box>

      {/* Stats Cards */}
      <Box sx={{ display: 'flex', gap: 3, mb: 4, flexWrap: 'wrap' }}>
        <Paper sx={{ flex: '1 1 200px', p: 3, bgcolor: '#F5F7F5' }}>
          <Typography variant="body2" color="text.secondary">Total Chargers</Typography>
          <Typography variant="h3" sx={{ fontWeight: 700, color: '#2C5F2D' }}>0</Typography>
        </Paper>

        <Paper sx={{ flex: '1 1 200px', p: 3, bgcolor: '#F5F7F5' }}>
          <Typography variant="body2" color="text.secondary">Active</Typography>
          <Typography variant="h3" sx={{ fontWeight: 700, color: '#F7931E' }}>0</Typography>
        </Paper>

        <Paper sx={{ flex: '1 1 200px', p: 3, bgcolor: '#F5F7F5' }}>
          <Typography variant="body2" color="text.secondary">Total Earnings</Typography>
          <Typography variant="h4" sx={{ fontWeight: 700, color: '#2C5F2D' }}>₹0</Typography>
        </Paper>

        <Paper sx={{ flex: '1 1 200px', p: 3, bgcolor: '#F5F7F5' }}>
          <Typography variant="body2" color="text.secondary">This Month</Typography>
          <Typography variant="h4" sx={{ fontWeight: 700, color: '#F7931E' }}>₹0</Typography>
        </Paper>
      </Box>

      {/* Tabs */}
      <Paper elevation={2} sx={{ mb: 3 }}>
        <Tabs value={tabValue} onChange={(e, v) => setTabValue(v)}>
          <Tab label="My Chargers" />
          <Tab label="Bookings" />
          <Tab label="Analytics" />
        </Tabs>
      </Paper>

      {/* Content */}
      {tabValue === 0 && (
        <Paper elevation={2} sx={{ p: 4, textAlign: 'center' }}>
          <ElectricBolt sx={{ fontSize: 64, color: '#CCC', mb: 2 }} />
          <Typography variant="h6" color="text.secondary" gutterBottom>
            No chargers added yet
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
            Start earning by adding your first charging station!
          </Typography>
          <Button
            variant="contained"
            startIcon={<Add />}
            onClick={() => window.location.href = '/add-charger'}
            sx={{ bgcolor: '#2C5F2D', '&:hover': { bgcolor: '#1E3F1E' } }}
          >
            Add Your First Charger
          </Button>
        </Paper>
      )}

      {tabValue === 1 && (
        <Paper elevation={2} sx={{ p: 4, textAlign: 'center' }}>
          <Typography variant="h6" color="text.secondary">
            Booking management coming soon...
          </Typography>
        </Paper>
      )}

      {tabValue === 2 && (
        <Paper elevation={2} sx={{ p: 4, textAlign: 'center' }}>
          <Typography variant="h6" color="text.secondary">
            Analytics dashboard coming soon...
          </Typography>
        </Paper>
      )}
    </Container>
  );
};

export default HostDashboard;
