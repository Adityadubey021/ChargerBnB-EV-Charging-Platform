import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { Toaster } from 'react-hot-toast';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Login from './pages/Login';
import Signup from './pages/Signup';
import ChargerList from './pages/ChargerList';
import ChargerDetail from './pages/ChargerDetail';
import Dashboard from './pages/Dashboard';
import HostDashboard from './pages/HostDashboard';
import AdminLogin from './pages/AdminLogin';
import AdminDashboardPage from './pages/AdminDashboardPage';
import About from './pages/About';
import HowItWorks from './pages/HowItWorks';
import Contact from './pages/Contact';
import ForgotPassword from './pages/ForgotPassword';
import AddCharger from './pages/AddCharger';
import MyBookings from './pages/MyBookings';
import HostBookings from './pages/HostBookings';
import TermsAndConditions from './pages/TermsAndConditions';
import FAQ from './pages/FAQ';
import Pricing from './pages/Pricing';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import './App.css';

const theme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: '#2C5F2D',  // Forest green - trust & reliability
      light: '#4A9E4E',
      dark: '#1E3F1E',
    },
    secondary: {
      main: '#F7931E',  // Warm orange - energy & optimism
      light: '#FFA94D',
      dark: '#D27712',
    },
    background: {
      default: '#F5F7F5',  // Soft green-gray
      paper: '#FFFFFF',
    },
  },
  typography: {
    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
    h1: {
      fontWeight: 700,
    },
    h2: {
      fontWeight: 600,
    },
  },
  shape: {
    borderRadius: 16,
  },
});

function AppRoutes() {

  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />
      <Route path="/chargers" element={<ChargerList />} />
      <Route path="/chargers/:id" element={<ChargerDetail />} />
      <Route path="/about" element={<About />} />
      <Route path="/how-it-works" element={<HowItWorks />} />
      <Route path="/contact" element={<Contact />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route path="/add-charger" element={<ProtectedRoute><AddCharger /></ProtectedRoute>} />

      {/* Admin Routes */}
      <Route path="/admin" element={<Navigate to="/admin/dashboard" replace />} />
      <Route path="/admin/login" element={<AdminLogin />} />
      <Route
        path="/admin/dashboard"
        element={
          <ProtectedRoute requiredRole="ADMIN">
            <AdminDashboardPage />
          </ProtectedRoute>
        }
      />

      {/* User Dashboards */}
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        }
      />
      <Route
        path="/host"
        element={
          <ProtectedRoute requiredRole="HOST">
            <HostDashboard />
          </ProtectedRoute>
        }
      />
      <Route
        path="/my-bookings"
        element={
          <ProtectedRoute>
            <MyBookings />
          </ProtectedRoute>
        }
      />
      <Route
        path="/host/bookings"
        element={
          <ProtectedRoute requiredRole="HOST">
            <HostBookings />
          </ProtectedRoute>
        }
      />
      <Route path="/terms" element={<TermsAndConditions />} />
      <Route path="/faq" element={<FAQ />} />
      <Route path="/pricing" element={<Pricing />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <AuthProvider>
        <Router>
          <div className="App">
            <Navbar />
            <main style={{ marginTop: '64px', minHeight: 'calc(100vh - 64px)' }}>
              <AppRoutes />
            </main>
            <Toaster position="top-right" />
          </div>
        </Router>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
