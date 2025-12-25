"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const dotenv_1 = __importDefault(require("dotenv"));
const postgres_1 = require("./config/postgres");
const mongodb_1 = require("./config/mongodb");
const auth_routes_1 = __importDefault(require("./routes/auth.routes"));
const charger_routes_1 = __importDefault(require("./routes/charger.routes"));
const booking_routes_1 = __importDefault(require("./routes/booking.routes"));
const payment_routes_1 = __importDefault(require("./routes/payment.routes"));
const review_routes_1 = __importDefault(require("./routes/review.routes"));
const upload_routes_1 = __importDefault(require("./routes/upload.routes"));
const admin_routes_1 = __importDefault(require("./routes/admin.routes"));
const otp_routes_1 = __importDefault(require("./routes/otp.routes"));
dotenv_1.default.config();
const app = (0, express_1.default)();
const PORT = process.env.PORT || 5000;
// Middleware
app.use((0, cors_1.default)({
    origin: process.env.CORS_ORIGIN || 'http://localhost:3000',
    credentials: true
}));
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: true }));
// Static files
app.use('/uploads', express_1.default.static('uploads'));
// Routes
app.use('/api/auth', auth_routes_1.default);
app.use('/api/otp', otp_routes_1.default);
app.use('/api/chargers', charger_routes_1.default);
app.use('/api/bookings', booking_routes_1.default);
app.use('/api/payments', payment_routes_1.default);
app.use('/api/reviews', review_routes_1.default);
app.use('/api/upload', upload_routes_1.default);
app.use('/api/admin', admin_routes_1.default);
// Health check
app.get('/health', (req, res) => {
    res.json({ status: 'OK', timestamp: new Date().toISOString() });
});
// Start server
const startServer = async () => {
    try {
        await (0, postgres_1.connectPostgres)();
        // MongoDB is optional (used for analytics)
        if (process.env.MONGODB_URI && process.env.MONGODB_URI !== 'mongodb://localhost:27017/chargerbnb') {
            try {
                await (0, mongodb_1.connectMongo)();
            }
            catch (error) {
                console.warn('⚠️  MongoDB not available - analytics features disabled');
            }
        }
        else {
            console.log('ℹ️  MongoDB disabled - set MONGODB_URI to enable analytics');
        }
        app.listen(PORT, () => {
            console.log(`🚀 Server running on port ${PORT}`);
            console.log(`📊 Environment: ${process.env.NODE_ENV || 'development'}`);
        });
    }
    catch (error) {
        console.error('Failed to start server:', error);
        process.exit(1);
    }
};
startServer();
exports.default = app;
