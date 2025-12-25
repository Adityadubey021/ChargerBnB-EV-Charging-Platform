import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
  Container,
  Paper,
  TextField,
  Button,
  Typography,
  Box,
  Link as MuiLink,
  MenuItem,
  Grid,
  Alert,
} from '@mui/material';
import { useAuth } from '../context/AuthContext';
import { motion } from 'framer-motion';

const Signup: React.FC = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    firstName: '',
    lastName: '',
    phoneNumber: '',
    role: 'USER',
    aadhaarNumber: '',
    panNumber: '',
    address: '',
    city: '',
    state: '',
    pincode: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(''); // Added error state variable
  const { signup } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await signup(formData);
      console.log('✅ Signup successful, navigating to dashboard');
      navigate('/dashboard');
    } catch (err: any) {
      console.error('❌ Signup error caught:', err);
      console.log('Error response data:', err.response?.data);

      // Show detailed validation errors
      if (err.response?.data?.errors && Array.isArray(err.response.data.errors)) {
        console.log('📋 Validation errors array found:', err.response.data.errors);
        const errorMessages = err.response.data.errors
          .map((e: any) => {
            const field = e.path || e.param || 'Field';
            const message = e.msg || e.message || 'Invalid value';
            // Capitalize first letter of field name for better display
            const displayField = field.charAt(0).toUpperCase() + field.slice(1).replace(/([A-Z])/g, ' $1');
            return `${displayField}: ${message}`;
          })
          .join('\n');
        console.log('Formatted error messages:', errorMessages);
        setError(errorMessages);
      } else if (err.response?.data?.error) {
        console.log('📝 Single error message:', err.response.data.error);
        setError(err.response.data.error);
      } else {
        console.log('⚠️ Generic error fallback');
        setError('Signup failed. Please check all fields and try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container maxWidth="md" sx={{ py: { xs: 10, md: 12 }, px: { xs: 2, sm: 3 } }}>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Paper elevation={3} sx={{ p: { xs: 2, sm: 3, md: 4 }, borderRadius: 3 }}>
          <Typography
            variant="h4"
            component="h1"
            gutterBottom
            sx={{
              fontWeight: 700,
              mb: 3,
              fontSize: { xs: '1.75rem', sm: '2.125rem' }
            }}
          >
            Sign Up for ChargerBNB
          </Typography>

          {error && (
            <Alert severity="error" sx={{ mb: 3, whiteSpace: 'pre-line' }}>
              {error}
            </Alert>
          )}

          <form onSubmit={handleSubmit}>
            <Grid container spacing={2}>
              <Grid size={{ xs: 12 }}>
                <TextField
                  fullWidth
                  select
                  label="Role"
                  name="role"
                  value={formData.role}
                  onChange={handleChange}
                  required
                >
                  <MenuItem value="USER">User</MenuItem>
                  <MenuItem value="HOST">Host</MenuItem>
                </TextField>
              </Grid>
              <Grid size={{ xs: 12, sm: 6 }}>
                <TextField
                  fullWidth
                  label="Email"
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                />
              </Grid>
              <Grid size={{ xs: 12, sm: 6 }}>
                <TextField
                  fullWidth
                  label="Password"
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                  helperText="Min 10 characters: uppercase, lowercase, number & special character (@$!%*?&#)"
                  placeholder="Example: MyPass@2024"
                  margin="normal"
                />
              </Grid>
              <Grid size={{ xs: 12, sm: 6 }}>
                <TextField
                  fullWidth
                  label="First Name"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleChange}
                  required
                />
              </Grid>
              <Grid size={{ xs: 12, sm: 6 }}>
                <TextField
                  fullWidth
                  label="Last Name"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleChange}
                />
              </Grid>
              <Grid size={{ xs: 12, sm: 6 }}>
                <TextField
                  fullWidth
                  label="Phone Number"
                  name="phoneNumber"
                  value={formData.phoneNumber}
                  onChange={handleChange}
                  required
                />
              </Grid>

              {formData.role === 'HOST' && (
                <>
                  <Grid size={{ xs: 12 }}>
                    <Typography variant="h6" sx={{ mt: 2, mb: 1 }}>
                      Host Information
                    </Typography>
                  </Grid>
                  <Grid size={{ xs: 12, sm: 6 }}>
                    <TextField
                      fullWidth
                      label="Aadhaar Number"
                      name="aadhaarNumber"
                      value={formData.aadhaarNumber}
                      onChange={handleChange}
                      required
                      inputProps={{ maxLength: 12, pattern: '[2-9][0-9]{11}' }}
                      helperText="12 digits starting with 2-9 (e.g., 234567890123)"
                      margin="normal"
                    />
                  </Grid>
                  <Grid size={{ xs: 12, sm: 6 }}>
                    <TextField
                      fullWidth
                      label="PAN Number"
                      name="panNumber"
                      value={formData.panNumber}
                      onChange={(e) => setFormData({ ...formData, panNumber: e.target.value.toUpperCase() })}
                      required
                      inputProps={{ maxLength: 10, pattern: '[A-Z]{5}[0-9]{4}[A-Z]{1}', style: { textTransform: 'uppercase' } }}
                      helperText="Format: ABCDE1234F (auto-uppercase)"
                      margin="normal"
                    />
                  </Grid>
                  <Grid size={{ xs: 12 }}>
                    <TextField
                      fullWidth
                      label="Address"
                      name="address"
                      value={formData.address}
                      onChange={handleChange}
                      required={formData.role === 'HOST'}
                    />
                  </Grid>
                  <Grid size={{ xs: 12, sm: 4 }}>
                    <TextField
                      fullWidth
                      label="City"
                      name="city"
                      value={formData.city}
                      onChange={handleChange}
                      required={formData.role === 'HOST'}
                    />
                  </Grid>
                  <Grid size={{ xs: 12, sm: 4 }}>
                    <TextField
                      fullWidth
                      label="State"
                      name="state"
                      value={formData.state}
                      onChange={handleChange}
                      required={formData.role === 'HOST'}
                    />
                  </Grid>
                  <Grid size={{ xs: 12, sm: 4 }}>
                    <TextField
                      fullWidth
                      label="Pincode"
                      name="pincode"
                      value={formData.pincode}
                      onChange={handleChange}
                      required={formData.role === 'HOST'}
                    />
                  </Grid>
                </>
              )}

              <Grid size={{ xs: 12 }}>
                <Button
                  type="submit"
                  fullWidth
                  variant="contained"
                  size="large"
                  disabled={loading}
                  sx={{ py: 1.5, mt: 2 }}
                >
                  {loading ? 'Signing up...' : 'Sign Up'}
                </Button>
              </Grid>
            </Grid>
            <Box textAlign="center" sx={{ mt: 2 }}>
              <Typography variant="body2">
                Already have an account?{' '}
                <MuiLink component={Link} to="/login" color="primary">
                  Login here
                </MuiLink>
              </Typography>
            </Box>
          </form>
        </Paper>
      </motion.div>
    </Container>
  );
};

export default Signup;

