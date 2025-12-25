import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { connectPostgres } from './config/postgres';
import { connectMongo } from './config/mongodb';
import authRoutes from './routes/auth.routes';
import chargerRoutes from './routes/charger.routes';
import bookingRoutes from './routes/booking.routes';
import paymentRoutes from './routes/payment.routes';
import reviewRoutes from './routes/review.routes';
import uploadRoutes from './routes/upload.routes';
import adminRoutes from './routes/admin.routes';
import hostRoutes from './routes/host.routes';
import otpRoutes from './routes/otp.routes';
import setupRoutes from './routes/setup.routes';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors({
  origin: process.env.CORS_ORIGIN || 'http://localhost:3000',
  credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Static files
app.use('/uploads', express.static('uploads'));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/otp', otpRoutes);
app.use('/api/chargers', chargerRoutes);
app.use('/api/bookings', bookingRoutes);
app.use('/api/payments', paymentRoutes);
app.use('/api/reviews', reviewRoutes);
app.use('/api/upload', uploadRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/host', hostRoutes);
app.use('/api/setup', setupRoutes);

// Health check endpoint - Last deployed: 2025-12-06T10:21:04+05:30
app.get('/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

// Start server
const startServer = async () => {
  try {
    await connectPostgres();

    // MongoDB is optional (used for analytics)
    if (process.env.MONGODB_URI && process.env.MONGODB_URI !== 'mongodb://localhost:27017/chargerbnb') {
      try {
        await connectMongo();
      } catch (error) {
        console.warn('⚠️  MongoDB not available - analytics features disabled');
      }
    } else {
      console.log('ℹ️  MongoDB disabled - set MONGODB_URI to enable analytics');
    }

    app.listen(PORT, () => {
      console.log(`🚀 Server running on port ${PORT}`);
      console.log(`📊 Environment: ${process.env.NODE_ENV || 'development'}`);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
};

startServer();

export default app;

