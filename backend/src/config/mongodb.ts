import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

export const connectMongo = async () => {
  try {
    const mongoUri = process.env.MONGODB_URI || 'mongodb://localhost:27017/chargerbnb';
    await mongoose.connect(mongoUri);
    console.log('✅ MongoDB connected successfully');
  } catch (error) {
    console.error('❌ MongoDB connection error:', error);
    throw error;
  }
};

// MongoDB schemas for analytics, logs, etc.
export const AnalyticsSchema = new mongoose.Schema({
  eventType: String,
  userId: String,
  metadata: mongoose.Schema.Types.Mixed,
  timestamp: { type: Date, default: Date.now }
}, { timestamps: true });

export const Analytics = mongoose.model('Analytics', AnalyticsSchema);

export default mongoose;

