"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Analytics = exports.AnalyticsSchema = exports.connectMongo = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const connectMongo = async () => {
    try {
        const mongoUri = process.env.MONGODB_URI || 'mongodb://localhost:27017/chargerbnb';
        await mongoose_1.default.connect(mongoUri);
        console.log('✅ MongoDB connected successfully');
    }
    catch (error) {
        console.error('❌ MongoDB connection error:', error);
        throw error;
    }
};
exports.connectMongo = connectMongo;
// MongoDB schemas for analytics, logs, etc.
exports.AnalyticsSchema = new mongoose_1.default.Schema({
    eventType: String,
    userId: String,
    metadata: mongoose_1.default.Schema.Types.Mixed,
    timestamp: { type: Date, default: Date.now }
}, { timestamps: true });
exports.Analytics = mongoose_1.default.model('Analytics', exports.AnalyticsSchema);
exports.default = mongoose_1.default;
