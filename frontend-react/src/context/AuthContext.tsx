import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-hot-toast';

interface User {
  id: number;
  email: string;
  firstName: string;
  lastName?: string;
  role: string;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  signup: (data: any) => Promise<void>;
  logout: () => void;
  refreshToken: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [inactivityTimer, setInactivityTimer] = useState<NodeJS.Timeout | null>(null);

  // Admin auto-logout after 2 minutes of inactivity
  const resetInactivityTimer = () => {
    if (user?.role === 'ADMIN') {
      if (inactivityTimer) clearTimeout(inactivityTimer);

      const timer = setTimeout(() => {
        logout();
        toast('Session expired due to inactivity (2 minutes)', { icon: '⏱️' });
      }, 2 * 60 * 1000); // 2 minutes

      setInactivityTimer(timer);
    }
  };

  // Track user activity for admin
  useEffect(() => {
    if (user?.role === 'ADMIN') {
      const events = ['mousedown', 'keydown', 'scroll', 'touchstart', 'click'];

      events.forEach(event => {
        document.addEventListener(event, resetInactivityTimer);
      });

      resetInactivityTimer(); // Start timer

      return () => {
        events.forEach(event => {
          document.removeEventListener(event, resetInactivityTimer);
        });
        if (inactivityTimer) clearTimeout(inactivityTimer);
      };
    }
  }, [user]);

  useEffect(() => {
    const token = localStorage.getItem('accessToken');
    if (token) {
      fetchUser();
    } else {
      setLoading(false);
    }
  }, []);

  const fetchUser = async () => {
    try {
      const token = localStorage.getItem('accessToken');
      const response = await axios.get(`${API_URL}/auth/me`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setUser(response.data.user);
    } catch (error) {
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
    } finally {
      setLoading(false);
    }
  };

  const login = async (email: string, password: string) => {
    try {
      const response = await axios.post(`${API_URL}/auth/login`, { email, password });
      localStorage.setItem('accessToken', response.data.accessToken);
      localStorage.setItem('refreshToken', response.data.refreshToken);
      setUser(response.data.user);
      toast.success('Login successful!');
    } catch (error: any) {
      toast.error(error.response?.data?.error || 'Login failed');
      throw error;
    }
  };

  const signup = async (data: any) => {
    console.log('🚀 AuthContext signup called with:', { ...data, password: '[REDACTED]' });
    try {
      const response = await axios.post(`${API_URL}/auth/signup`, data);
      console.log('✅ Signup API success:', response.status);
      localStorage.setItem('accessToken', response.data.accessToken);
      localStorage.setItem('refreshToken', response.data.refreshToken);
      setUser(response.data.user);
      toast.success('Signup successful!');
    } catch (error: any) {
      console.error('❌ Signup API error:', error.response?.status, error.response?.data);
      // Don't show toast for validation errors - let the component handle them
      if (error.response?.data?.errors && Array.isArray(error.response.data.errors)) {
        console.log('📋 Validation errors detected, skipping toast, throwing to component');
        // Validation errors will be handled by Signup component
        throw error;
      } else {
        console.log('⚠️ Non-validation error, showing toast');
        // Show toast for other errors (email already exists, server error, etc.)
        toast.error(error.response?.data?.error || 'Signup failed');
        throw error;
      }
    }
  };

  const logout = () => {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    setUser(null);
    toast.success('Logged out successfully');
  };

  const refreshToken = async () => {
    try {
      const refreshToken = localStorage.getItem('refreshToken');
      if (!refreshToken) throw new Error('No refresh token');

      const response = await axios.post(`${API_URL}/auth/refresh`, { refreshToken });
      localStorage.setItem('accessToken', response.data.accessToken);
    } catch (error) {
      logout();
    }
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, signup, logout, refreshToken }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};

