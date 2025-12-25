import React from 'react';
import { Container, Typography } from '@mui/material';

const AdminDashboard: React.FC = () => {
  return (
    <Container sx={{ py: 4 }}>
      <Typography variant="h4" component="h1" gutterBottom sx={{ fontWeight: 700 }}>
        Admin Dashboard
      </Typography>
    </Container>
  );
};

export default AdminDashboard;

