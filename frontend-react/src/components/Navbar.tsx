import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  IconButton,
  Menu,
  MenuItem,
  Avatar,
  Box,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Divider,
} from '@mui/material';
import {
  Menu as MenuIcon,
  AccountCircle,
  Dashboard,
  EvStation,
  AdminPanelSettings,
  Logout,
  Home as HomeIcon,
  Info,
  HelpOutline,
  ContactMail,
  Login as LoginIcon,
  Close,
} from '@mui/icons-material';
import { useAuth } from '../context/AuthContext';
import { motion } from 'framer-motion';

const Navbar: React.FC = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const handleLogout = () => {
    logout();
    navigate('/');
    handleClose();
  };

  const drawer = (
    <Box sx={{ width: 250 }} role="presentation">
      <Box sx={{ p: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Typography variant="h6" sx={{ fontWeight: 700, color: '#FF6B35' }}>
          ⚡ ChargerBNB
        </Typography>
        <IconButton onClick={handleDrawerToggle}>
          <Close />
        </IconButton>
      </Box>
      <Divider />
      <List>
        {!user && (
          <>
            <ListItem disablePadding>
              <ListItemButton onClick={() => { navigate('/'); handleDrawerToggle(); }}>
                <ListItemIcon><HomeIcon /></ListItemIcon>
                <ListItemText primary="Home" />
              </ListItemButton>
            </ListItem>
            <ListItem disablePadding>
              <ListItemButton onClick={() => { navigate('/about'); handleDrawerToggle(); }}>
                <ListItemIcon><Info /></ListItemIcon>
                <ListItemText primary="About" />
              </ListItemButton>
            </ListItem>
            <ListItem disablePadding>
              <ListItemButton onClick={() => { navigate('/how-it-works'); handleDrawerToggle(); }}>
                <ListItemIcon><HelpOutline /></ListItemIcon>
                <ListItemText primary="How It Works" />
              </ListItemButton>
            </ListItem>
            <ListItem disablePadding>
              <ListItemButton onClick={() => { navigate('/contact'); handleDrawerToggle(); }}>
                <ListItemIcon><ContactMail /></ListItemIcon>
                <ListItemText primary="Contact" />
              </ListItemButton>
            </ListItem>
            <Divider sx={{ my: 1 }} />
            <ListItem disablePadding>
              <ListItemButton onClick={() => { navigate('/login'); handleDrawerToggle(); }}>
                <ListItemIcon><LoginIcon /></ListItemIcon>
                <ListItemText primary="Login" />
              </ListItemButton>
            </ListItem>
            <ListItem disablePadding>
              <ListItemButton onClick={() => { navigate('/signup'); handleDrawerToggle(); }} sx={{ bgcolor: '#FF6B35', color: 'white', '&:hover': { bgcolor: '#e55a25' } }}>
                <ListItemIcon><AccountCircle sx={{ color: 'white' }} /></ListItemIcon>
                <ListItemText primary="Sign Up" />
              </ListItemButton>
            </ListItem>
          </>
        )}
      </List>
    </Box>
  );

  return (
    <AppBar position="fixed" sx={{ background: 'linear-gradient(135deg, #FF6B35 0%, #F7931E 100%)' }}>
      <Toolbar>
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ duration: 0.5 }}
        >
          <Typography
            variant="h6"
            component={Link}
            to="/"
            sx={{
              flexGrow: 0,
              fontWeight: 700,
              textDecoration: 'none',
              color: 'inherit',
              mr: { xs: 1, md: 4 },
              display: 'flex',
              alignItems: 'center',
              gap: 1,
              fontSize: { xs: '1rem', md: '1.25rem' },
            }}
          >
            ⚡ ChargerBNB
          </Typography>
        </motion.div>

        <Box sx={{ flexGrow: 1 }} />

        {user ? (
          <>
            <Button
              color="inherit"
              component={Link}
              to="/chargers"
              sx={{ mr: 2, display: { xs: 'none', md: 'inline-flex' } }}
            >
              <EvStation sx={{ mr: 1 }} />
              Find Chargers
            </Button>

            <IconButton
              size="large"
              edge="end"
              aria-label="account menu"
              aria-controls="menu-appbar"
              aria-haspopup="true"
              onClick={handleMenu}
              color="inherit"
            >
              <Avatar sx={{ width: 32, height: 32, bgcolor: 'rgba(255,255,255,0.2)' }}>
                {user.firstName[0]}
              </Avatar>
            </IconButton>

            <Menu
              id="menu-appbar"
              anchorEl={anchorEl}
              anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
              keepMounted
              transformOrigin={{ vertical: 'top', horizontal: 'right' }}
              open={Boolean(anchorEl)}
              onClose={handleClose}
            >
              <MenuItem onClick={() => { navigate('/dashboard'); handleClose(); }}>
                <Dashboard sx={{ mr: 2 }} />
                Dashboard
              </MenuItem>
              {(user.role === 'HOST' || user.role === 'ADMIN') && (
                <MenuItem onClick={() => { navigate('/host'); handleClose(); }}>
                  <EvStation sx={{ mr: 2 }} />
                  Host Dashboard
                </MenuItem>
              )}
              {user.role === 'ADMIN' && (
                <MenuItem onClick={() => { navigate('/admin'); handleClose(); }}>
                  <AdminPanelSettings sx={{ mr: 2 }} />
                  Admin Panel
                </MenuItem>
              )}
              <MenuItem onClick={handleLogout}>
                <Logout sx={{ mr: 2 }} />
                Logout
              </MenuItem>
            </Menu>
          </>
        ) : (
          <>
            {/* Desktop Menu */}
            <Box sx={{ display: { xs: 'none', md: 'flex' }, gap: 1 }}>
              <Button color="inherit" component={Link} to="/">
                Home
              </Button>
              <Button color="inherit" component={Link} to="/about">
                About
              </Button>
              <Button color="inherit" component={Link} to="/how-it-works">
                How It Works
              </Button>
              <Button color="inherit" component={Link} to="/chargers">
                Find Chargers
              </Button>
              <Button color="inherit" component={Link} to="/contact">
                Contact
              </Button>
              <Button color="inherit" component={Link} to="/login">
                Login
              </Button>
              <Button
                color="inherit"
                component={Link}
                to="/signup"
                variant="outlined"
                sx={{ ml: 2, borderColor: 'white', color: 'white' }}
              >
                Sign Up
              </Button>
            </Box>

            {/* Mobile Menu Icon */}
            <IconButton
              color="inherit"
              aria-label="open drawer"
              edge="end"
              onClick={handleDrawerToggle}
              sx={{ display: { md: 'none' } }}
            >
              <MenuIcon />
            </IconButton>

            {/* Mobile Drawer */}
            <Drawer
              anchor="right"
              open={mobileOpen}
              onClose={handleDrawerToggle}
              ModalProps={{ keepMounted: true }} // Better mobile performance
            >
              {drawer}
            </Drawer>
          </>
        )}
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;
